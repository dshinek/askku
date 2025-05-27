import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChatConversation } from "./ChatConversation";
import MainLayout from "./layout/MainLayout";
import { getChat } from "../utils/api";
import { useRecoilValue } from "recoil";
import { sessionIdState } from "../utils/authState";

export default function ArchiveChat() {
    const { slug } = useParams(); // slug is chat_id
    const sessionId = useRecoilValue(sessionIdState);

    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!sessionId || !slug) return;
        getChat(slug, sessionId)
            .then(data => {
                setChat(data);
                // Map backend messages to ChatConversation format
                const mapped = (data.messages || []).map(m => ({
                    type: m.source === "Human" ? "user_message" : "ai_message",
                    message: m.content,
                    message_id: m.message_id
                }));
                setMessages(mapped);
                setNotFound(false);
            })
            .catch(err => {
                setChat(null);
                setMessages([]);
                setNotFound(true);
            });
    }, [slug, sessionId]);

    const onSendMessage = () => {
        // Optionally implement sending a message to this chat
        // For now, just echo locally
        const content = input.trim();
        if (!content) return;
        const nextId = (messages.at(-1)?.message_id || 0) + 1;
        setMessages(prev => [
            ...prev,
            { source: "Human", content, message_id: nextId },
            { source: "AI", content: `Echo: ${content}`, message_id: nextId + 1 }
        ]);
        setInput("");
    };

    if (notFound) return <div className="p-12">존재하지 않는 아카이브입니다.</div>;

    return (
        <MainLayout>
            <ChatConversation
                messages={messages}
                onSendMessage={onSendMessage}
                inputValue={input}
                setInputValue={setInput}
            />
        </MainLayout>
    );
}
