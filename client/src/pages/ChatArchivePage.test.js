import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatArchivePage from "./ChatArchivePage";
import { useRecoilValue } from "recoil";
import * as api from "../utils/api";
import { MemoryRouter } from "react-router-dom";

// Mock Recoil
jest.mock("recoil", () => ({
  useRecoilValue: jest.fn(),
}));

// Mock API
jest.mock("../utils/api", () => ({
  getChats: jest.fn(),
}));

// Mock MainLayout
jest.mock("../components/layout/MainLayout", () => ({ children }) => (
  <div data-testid="main-layout">{children}</div>
));

describe("ChatArchivePage", () => {
  const mockChats = [
    { chat_id: "1", chat_summary: "First chat" },
    { chat_id: "2", chat_summary: "Second chat" },
    { chat_id: "3", chat_summary: "Another chat" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useRecoilValue.mockReturnValue("test-session-id");
    api.getChats.mockResolvedValue(mockChats);
  });

  function setup() {
    return render(
      <MemoryRouter>
        <ChatArchivePage />
      </MemoryRouter>
    );
  }

  it("renders search input and fetches chats", async () => {
    setup();
    expect(screen.getByPlaceholderText("검색어를 입력하세요...")).toBeInTheDocument();
    await waitFor(() => {
      expect(api.getChats).toHaveBeenCalledWith("test-session-id");
    });
    expect(await screen.findByText("First chat")).toBeInTheDocument();
    expect(screen.getByText("Second chat")).toBeInTheDocument();
  });

  it("shows empty state when no chats", async () => {
    api.getChats.mockResolvedValue([]);
    setup();
    expect(await screen.findByText("검색 결과가 없습니다.")).toBeInTheDocument();
  });

  it("filters chats by search", async () => {
    setup();
    await screen.findByText("First chat");
    const input = screen.getByPlaceholderText("검색어를 입력하세요...");
    fireEvent.change(input, { target: { value: "another" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(await screen.findByText("Another chat")).toBeInTheDocument();
    expect(screen.queryByText("First chat")).not.toBeInTheDocument();
  });

  it("navigates to chat detail on chat click", async () => {
    // Mock useNavigate
    const mockNavigate = jest.fn();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);

    setup();
    const chatButton = await screen.findByText("First chat");
    fireEvent.click(chatButton);
    expect(mockNavigate).toHaveBeenCalledWith("/archived-chat/1");
  });

  it("shows pagination button if more than 8 chats", async () => {
    const manyChats = Array.from({ length: 10 }, (_, i) => ({
      chat_id: String(i + 1),
      chat_summary: `Chat ${i + 1}`,
    }));
    api.getChats.mockResolvedValue(manyChats);
    setup();
    expect(await screen.findByText("Chat 1")).toBeInTheDocument();
    expect(screen.getByLabelText("다음 아카이브 보기")).toBeInTheDocument();
  });

  it("goes to next page on pagination button click", async () => {
    const manyChats = Array.from({ length: 10 }, (_, i) => ({
      chat_id: String(i + 1),
      chat_summary: `Chat ${i + 1}`,
    }));
    api.getChats.mockResolvedValue(manyChats);
    setup();
    expect(await screen.findByText("Chat 1")).toBeInTheDocument();
    const nextBtn = screen.getByLabelText("다음 아카이브 보기");
    fireEvent.click(nextBtn);
    // After clicking, page 2 should show Chat 9 and Chat 10
    expect(await screen.findByText("Chat 9")).toBeInTheDocument();
    expect(screen.getByText("Chat 10")).toBeInTheDocument();
  });
});
