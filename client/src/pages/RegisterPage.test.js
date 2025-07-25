import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "./RegisterPage";
import * as api from "../utils/api";
import { MemoryRouter } from "react-router-dom";

// Mock RegisterForm
jest.mock("../components/auth/RegisterForm", () => ({ onRegister }) => (
  <button onClick={() => onRegister("test@example.com", "tester", "pw123", "CS")}>Register</button>
));

// Mock API
jest.mock("../utils/api", () => ({
  signUp: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock localStorage and alert
beforeAll(() => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn(() => null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });
  window.alert = jest.fn();
});

describe("RegisterPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function setup() {
    return render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );
  }

  it("renders register form and link", () => {
    setup();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("redirects if already authenticated", () => {
    window.localStorage.getItem.mockReturnValue("token");
    setup();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("handles successful registration", async () => {
    api.signUp.mockResolvedValue({ status: 200, data: { message: "가입 성공" } });
    setup();
    fireEvent.click(screen.getByText("Register"));
    await waitFor(() => {
      expect(api.signUp).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "pw123",
        name: "tester",
        affiliation: "CS",
      });
      expect(window.alert).toHaveBeenCalledWith("가입 성공");
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("alerts on registration failure (status not 200)", async () => {
    api.signUp.mockResolvedValue({ status: 400, data: { detail: "에러" } });
    setup();
    fireEvent.click(screen.getByText("Register"));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("에러");
      expect(mockNavigate).not.toHaveBeenCalledWith("/login");
    });
  });

  it("alerts on registration error (exception)", async () => {
    api.signUp.mockRejectedValue(new Error("fail"));
    setup();
    fireEvent.click(screen.getByText("Register"));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("회원가입 처리 중 예기치 못한 오류가 발생했습니다.");
    });
  });
});
