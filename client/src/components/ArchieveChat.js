import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ChatConversation } from "./ChatConversation";
import MainLayout from "./layout/MainLayout";
import { getChat, createMessage } from "../utils/api";
import { useRecoilValue } from "recoil";
import { sessionIdState } from "../utils/authState";

export default function ArchiveChat() {
    const { slug } = useParams(); // slug is chat_id
    const sessionId = useRecoilValue(sessionIdState);
    const location = useLocation();

    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [notFound, setNotFound] = useState(false);
    const [loadingAI, setLoadingAI] = useState(false);

    // To ensure we only process the initial question once
    const initialQuestionHandled = useRef(false);

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

                // Handle initial question from navigation state
                if (
                    location.state &&
                    location.state.initialQuestion &&
                    !initialQuestionHandled.current
                ) {
                    initialQuestionHandled.current = true;
                    const userMsg = {
                        type: "user_message",
                        message: location.state.initialQuestion,
                        message_id: (mapped.at(-1)?.message_id || 0) + 1
                    };
                    setMessages(prev => [...prev, userMsg]);
                    setLoadingAI(true);
                    // Send to backend and append AI response
                    createMessage(slug, location.state.initialQuestion, sessionId)
                        .then(res => {
                            setMessages(prev => [
                                ...prev,
                                {
                                    type: "ai_message",
                                    message: res.llm_response,
                                    message_id: userMsg.message_id + 1
                                }
                            ]);
                        })
                        .catch(() => {
                            setMessages(prev => [
                                ...prev,
                                {
                                    type: "ai_message",
                                    message: "Error: 메시지 전송 실패",
                                    message_id: userMsg.message_id + 1
                                }
                            ]);
                        })
                        .finally(() => setLoadingAI(false));
                }
            })
            .catch(err => {
                setChat(null);
                setMessages([]);
                setNotFound(true);
            });
    // eslint-disable-next-line
    }, [slug, sessionId]);

    const onSendMessage = async () => {
        const content = input.trim();
        if (!content || loadingAI) return;
        const nextId = (messages.at(-1)?.message_id || 0) + 1;
        setMessages(prev => [
            ...prev,
            { type: "user_message", message: content, message_id: nextId }
        ]);
        setInput("");
        setLoadingAI(true);
        try {
            const res = await createMessage(slug, content, sessionId);
            setMessages(prev => [
                ...prev,
                { type: "ai_message", message: res.llm_response, message_id: nextId + 1 }
            ]);
        } catch {
            setMessages(prev => [
                ...prev,
                { type: "ai_message", message: "Error: 메시지 전송 실패", message_id: nextId + 1 }
            ]);
        } finally {
            setLoadingAI(false);
        }
    };

    if (notFound) return <div className="p-12">존재하지 않는 아카이브입니다.</div>;

    return (
        <MainLayout>
            <ChatConversation
                messages={messages}
                onSendMessage={onSendMessage}
                inputValue={input}
                setInputValue={setInput}
                loading={loadingAI}
            />
        </MainLayout>
    );
}
