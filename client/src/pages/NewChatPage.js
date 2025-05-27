import { useState } from "react";
import { ChatConversation } from "../components/ChatConversation";
import MainLayout from "../components/layout/MainLayout";
import { createChat, createMessage } from "../utils/api";

 // Helper to get session_id (adjust if you use a different auth system)
function getSessionId() {
    return localStorage.getItem("session_id");
}

export default function NewChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [chatId, setChatId] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSend = async () => {
        const content = input.trim();
        if (!content || loading) return;
        setLoading(true);

        try {
            let currentChatId = chatId;
            // If no chatId, create a new chat first
            if (!currentChatId) {
                const chatRes = await createChat(getSessionId());
                currentChatId = chatRes.chat_id;
                setChatId(currentChatId);
            }

            // Add user message immediately
            setMessages(prev => [
                ...prev,
                {
                    type: "user_message",
                    message: content,
                    message_id: prev.length + 1
                }
            ]);
            setInput("");

            // Send message to server
            const msgRes = await createMessage(currentChatId, content, getSessionId());
            setMessages(prev => [
                ...prev,
                {
                    type: "ai_message",
                    message: msgRes.llm_response,
                    message_id: prev.length + 2
                }
            ]);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    type: "ai_message",
                    message: "Error: 메시지 전송 실패",
                    message_id: prev.length + 2
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <ChatConversation
                messages={messages}
                onSendMessage={onSend}
                inputValue={input}
                setInputValue={setInput}
                loading={loading}
            />
        </MainLayout>
    );
}
