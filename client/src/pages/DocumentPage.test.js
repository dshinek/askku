import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DocumentPage from "./DocumentPage";
import * as api from "../utils/api";
import { MemoryRouter } from "react-router-dom";

// Mock MainLayout
jest.mock("../components/layout/MainLayout", () => ({ children }) => (
  <div data-testid="main-layout">{children}</div>
));

// Mock API
jest.mock("../utils/api", () => ({
  getDocuments: jest.fn(),
  createChat: jest.fn(),
  createMessage: jest.fn(),
}));

// Mock localStorage
beforeAll(() => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn(() => "test-session-id"),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });
});

describe("DocumentPage", () => {
  const mockDocs = [
    { doc_id: "1", doc_name: "Doc One", doc_thumbnail: "thumb1.png" },
    { doc_id: "2", doc_name: "Doc Two", doc_thumbnail: "thumb2.png" },
    { doc_id: "3", doc_name: "Another Doc", doc_thumbnail: "thumb3.png" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api.getDocuments.mockResolvedValue(mockDocs);
  });

  function setup() {
    return render(
      <MemoryRouter>
        <DocumentPage />
      </MemoryRouter>
    );
  }

  it("renders and fetches documents", async () => {
    setup();
    expect(screen.getByText("문서 목록을 불러오는 중...")).toBeInTheDocument();
    expect(await screen.findByText("Doc One")).toBeInTheDocument();
    expect(screen.getByText("Doc Two")).toBeInTheDocument();
  });

  it("shows error state if fetch fails", async () => {
    api.getDocuments.mockRejectedValue(new Error("fail"));
    setup();
    expect(await screen.findByText("문서 목록을 불러오지 못했습니다.")).toBeInTheDocument();
  });

  it("shows empty state if no documents", async () => {
    api.getDocuments.mockResolvedValue([]);
    setup();
    expect(await screen.findByText("검색 결과가 없습니다.")).toBeInTheDocument();
  });

  it("filters documents by search", async () => {
    setup();
    await screen.findByText("Doc One");
    const input = screen.getByPlaceholderText("검색어를 입력하세요...");
    fireEvent.change(input, { target: { value: "another" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(await screen.findByText("Another Doc")).toBeInTheDocument();
    expect(screen.queryByText("Doc One")).not.toBeInTheDocument();
  });

  it("shows pagination button if more than 8 documents", async () => {
    const manyDocs = Array.from({ length: 10 }, (_, i) => ({
      doc_id: String(i + 1),
      doc_name: `Doc ${i + 1}`,
      doc_thumbnail: `thumb${i + 1}.png`,
    }));
    api.getDocuments.mockResolvedValue(manyDocs);
    setup();
    expect(await screen.findByText("Doc 1")).toBeInTheDocument();
    expect(screen.getByLabelText("다음 문서 보기")).toBeInTheDocument();
  });

  it("goes to next page on pagination button click", async () => {
    const manyDocs = Array.from({ length: 10 }, (_, i) => ({
      doc_id: String(i + 1),
      doc_name: `Doc ${i + 1}`,
      doc_thumbnail: `thumb${i + 1}.png`,
    }));
    api.getDocuments.mockResolvedValue(manyDocs);
    setup();
    expect(await screen.findByText("Doc 1")).toBeInTheDocument();
    const nextBtn = screen.getByLabelText("다음 문서 보기");
    fireEvent.click(nextBtn);
    expect(await screen.findByText("Doc 9")).toBeInTheDocument();
    expect(screen.getByText("Doc 10")).toBeInTheDocument();
  });

  it("opens and closes modal on document click", async () => {
    setup();
    const doc = await screen.findByText("Doc One");
    fireEvent.click(doc);
    expect(screen.getByText("Ask about Doc One")).toBeInTheDocument();
    // Close modal
    fireEvent.click(screen.getByLabelText("Close"));
    expect(screen.queryByText("Ask about Doc One")).not.toBeInTheDocument();
  });

  it("calls createChat and navigates on Ask button click", async () => {
    // Mock useNavigate
    const mockNavigate = jest.fn();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);
    api.createChat.mockResolvedValue({ chat_id: "123" });

    setup();
    const doc = await screen.findByText("Doc One");
    fireEvent.click(doc);
    const askBtn = screen.getByText("Ask about Doc One");
    fireEvent.click(askBtn);
    await waitFor(() => {
      expect(api.createChat).toHaveBeenCalledWith("test-session-id");
      expect(mockNavigate).toHaveBeenCalledWith("/archived-chat/123", {
        state: { initialQuestion: "Doc One 문서에 대해 설명해줘!" },
      });
    });
  });
});
