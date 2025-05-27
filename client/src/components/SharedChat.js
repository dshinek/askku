import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChatConversation } from "./ChatConversation";
import MainLayout from "./layout/MainLayout";
import { getChat } from "../utils/api";

// Helper to get session_id
function getSessionId() {
    return localStorage.getItem("session_id");
}

export default function SharedChat() {
    const { slug } = useParams(); // slug is chat_id
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;
        getChat(slug, getSessionId())
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
    }, [slug]);

    if (notFound) return <div className="p-12">존재하지 않는 공유챗입니다.</div>;

    return (
        <MainLayout>
            <ChatConversation
                messages={messages}
                onSendMessage={() => {}}
                inputValue={""}
                setInputValue={() => {}}
                disabled={true}
            />
        </MainLayout>
    );
}
