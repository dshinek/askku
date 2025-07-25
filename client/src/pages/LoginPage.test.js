import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./LoginPage";
import { useSetRecoilState } from "recoil";
import * as api from "../utils/api";
import { MemoryRouter } from "react-router-dom";

// Mock LoginForm
jest.mock("../components/auth/LoginForm", () => ({ onLogin }) => (
  <button onClick={() => onLogin("test@example.com", "password")}>Login</button>
));

// Mock Recoil
jest.mock("recoil", () => ({
  useSetRecoilState: jest.fn(),
}));

// Mock API
jest.mock("../utils/api", () => ({
  signIn: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock localStorage
beforeAll(() => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });
});

describe("LoginPage", () => {
  let setSessionId;

  beforeEach(() => {
    jest.clearAllMocks();
    setSessionId = jest.fn();
    useSetRecoilState.mockReturnValue(setSessionId);
  });

  function setup() {
    return render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
  }

  it("renders login form and links", () => {
    setup();
    expect(screen.getByText("ASKKU")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Create an account")).toBeInTheDocument();
    expect(screen.getByText("Forgot password?")).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    api.signIn.mockResolvedValue({ session_token: "abc123" });
    setup();
    fireEvent.click(screen.getByText("Login"));
    await waitFor(() => {
      expect(api.signIn).toHaveBeenCalledWith("test@example.com", "password");
      expect(setSessionId).toHaveBeenCalledWith("abc123");
      expect(window.localStorage.setItem).toHaveBeenCalledWith("session_id", "abc123");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("shows error if session_token is missing", async () => {
    api.signIn.mockResolvedValue({});
    setup();
    fireEvent.click(screen.getByText("Login"));
    expect(await screen.findByText("세션 정보가 없습니다.")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("shows error on login failure", async () => {
    api.signIn.mockRejectedValue(new Error("fail"));
    setup();
    fireEvent.click(screen.getByText("Login"));
    expect(await screen.findByText("로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
