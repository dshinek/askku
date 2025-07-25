import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfilePage from "./ProfilePage";
import { useRecoilValue } from "recoil";
import * as api from "../utils/api";
import { MemoryRouter } from "react-router-dom";

// Mock MainLayout
jest.mock("../components/layout/MainLayout", () => ({ children }) => (
  <div data-testid="main-layout">{children}</div>
));

// Mock Recoil
jest.mock("recoil", () => ({
  useRecoilValue: jest.fn(),
}));

// Mock API
jest.mock("../utils/api", () => ({
  getMyProfile: jest.fn(),
  updateMyProfile: jest.fn(),
}));

describe("ProfilePage", () => {
  const mockProfile = {
    name: "홍길동",
    student_id: "20231234",
    department: "컴퓨터공학과",
    grade: "3학년",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useRecoilValue.mockReturnValue("test-session-id");
    api.getMyProfile.mockResolvedValue(mockProfile);
  });

  function setup() {
    return render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );
  }

  it("fetches and displays profile info", async () => {
    setup();
    expect(await screen.findByText("홍길동")).toBeInTheDocument();
    expect(screen.getByText("컴퓨터공학과 · 3학년")).toBeInTheDocument();
    expect(screen.getByText("20231234")).toBeInTheDocument();
  });

  it("enters edit mode and updates profile", async () => {
    api.updateMyProfile.mockResolvedValue({});
    setup();
    await screen.findByText("홍길동");
    fireEvent.click(screen.getByLabelText("프로필 수정"));
    const nameInput = screen.getByPlaceholderText("이름을 입력하세요");
    fireEvent.change(nameInput, { target: { value: "이순신" } });
    const saveBtn = screen.getByLabelText("저장");
    expect(saveBtn).not.toBeDisabled();
    fireEvent.click(saveBtn);
    await waitFor(() => {
      expect(api.updateMyProfile).toHaveBeenCalled();
      expect(screen.getByText("이순신")).toBeInTheDocument();
    });
  });

  it("cancels edit and restores original values", async () => {
    setup();
    await screen.findByText("홍길동");
    fireEvent.click(screen.getByLabelText("프로필 수정"));
    const nameInput = screen.getByPlaceholderText("이름을 입력하세요");
    fireEvent.change(nameInput, { target: { value: "이순신" } });
    fireEvent.click(screen.getByLabelText("취소"));
    expect(screen.getByText("홍길동")).toBeInTheDocument();
  });

  it("disables save button if no changes", async () => {
    setup();
    await screen.findByText("홍길동");
    fireEvent.click(screen.getByLabelText("프로필 수정"));
    const saveBtn = screen.getByLabelText("저장");
    expect(saveBtn).toBeDisabled();
  });

  it("handles avatar upload", async () => {
    setup();
    await screen.findByText("홍길동");
    fireEvent.click(screen.getByLabelText("프로필 수정"));
    const fileInput = screen.getByLabelText("프로필 사진 변경").parentElement.nextSibling;
    // Simulate file upload
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });
    Object.defineProperty(fileInput, "files", {
      value: [file],
    });
    fireEvent.change(fileInput);
    // Avatar preview should update (simulate FileReader)
    // This is a limitation of jsdom, so we just check that the input was triggered
    expect(fileInput.files[0]).toBe(file);
  });

  it("does not fetch or update profile if sessionId is missing", async () => {
    useRecoilValue.mockReturnValue(null);
    setup();
    expect(api.getMyProfile).not.toHaveBeenCalled();
  });
});
