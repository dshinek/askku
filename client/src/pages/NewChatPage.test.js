import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewChatPage from "./NewChatPage";
import * as api from "../utils/api";
import { MemoryRouter } from "react-router-dom";

// Mock MainLayout
jest.mock("../components/layout/MainLayout", () => ({ children }) => (
  <div data-testid="main-layout">{children}</div>
));

// Mock ChatConversation
const mockSetInputValue = jest.fn();
let chatProps = {};
jest.mock("../components/ChatConversation", () => ({
  ChatConversation: (props) => {
    chatProps = props;
    return (
      <div>
        <input
          data-testid="chat-input"
          value={props.inputValue}
          onChange={e => props.setInputValue(e.target.value)}
        />
        <button
          data-testid="send-btn"
          onClick={props.onSendMessage}
          disabled={props.loading}
        >
          Send
        </button>
        <div data-testid="messages">
          {props.messages.map((msg, i) => (
            <div key={i}>{msg.type}: {msg.message}</div>
          ))}
        </div>
      </div>
    );
  }
}));

// Mock API
jest.mock("../utils/api", () => ({
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

describe("NewChatPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    chatProps = {};
  });

  function setup() {
    return render(
      <MemoryRouter>
        <NewChatPage />
      </MemoryRouter>
    );
  }

  it("renders chat interface", () => {
    setup();
    expect(screen.getByTestId("chat-input")).toBeInTheDocument();
    expect(screen.getByTestId("send-btn")).toBeInTheDocument();
  });

  it("sends a message and receives AI response", async () => {
    api.createChat.mockResolvedValue({ chat_id: "c1" });
    api.createMessage.mockResolvedValue({ llm_response: "AI says hi" });
    setup();
    // Simulate user typing
    fireEvent.change(screen.getByTestId("chat-input"), { target: { value: "Hello" } });
    // Simulate send
    fireEvent.click(screen.getByTestId("send-btn"));
    // User message should appear
    expect(await screen.findByText("user_message: Hello")).toBeInTheDocument();
    // AI message should appear
    expect(await screen.findByText("ai_message: AI says hi")).toBeInTheDocument();
    expect(api.createChat).toHaveBeenCalledWith("test-session-id");
    expect(api.createMessage).toHaveBeenCalledWith("c1", "Hello", "test-session-id");
  });

  it("shows error message on send failure", async () => {
    api.createChat.mockResolvedValue({ chat_id: "c1" });
    api.createMessage.mockRejectedValue(new Error("fail"));
    setup();
    fireEvent.change(screen.getByTestId("chat-input"), { target: { value: "Hello" } });
    fireEvent.click(screen.getByTestId("send-btn"));
    expect(await screen.findByText("ai_message: Error: 메시지 전송 실패")).toBeInTheDocument();
  });

  it("disables send button when loading", async () => {
    setup();
    // Simulate loading state
    chatProps.loading = true;
    render(
      <MemoryRouter>
        <NewChatPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId("send-btn")).toBeDisabled();
  });
});
