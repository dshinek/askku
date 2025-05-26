import {useState} from "react";
import {ChatConversation} from "../components/ChatConversation";
import MainLayout from "../components/layout/MainLayout";

export default function NewChatPage() {
    const [messages, setMessages] = useState([
        // {
        //     "type": "user_message",
        //     "message": "shit software engineering",
        //     "message_id": 1
        // },
        // {
        //     "type": "ai_message",
        //     "message": "I agree",
        //     "message_id": 2
        // },
        // {
        //     "type": "user_message",
        //     "message": "why do I learn software engineering",
        //     "message_id": 3
        // },
        // {
        //     "type": "ai_message",
        //     "message": "lets drop",
        //     "message_id": 4
        // }
    ]);
    const [input, setInput] = useState("");

    const onSend = () => {
        const content = input.trim();
        if (!content) return;
        setMessages(prev => [
            ...prev,
            {
                type: "user_message",
                message: content,
                message_id: prev.length + 1
            },
            {
                type: "ai_message",
                message: `Echo: ${content}`,
                message_id: prev.length + 2
            }
        ]);
        setInput("");
    };

    return (
        <MainLayout>
            <ChatConversation
                messages={messages}
                onSendMessage={onSend}
                inputValue={input}
                setInputValue={setInput}
            />
        </MainLayout>
    );
}
