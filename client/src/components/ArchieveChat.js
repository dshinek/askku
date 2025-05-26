import {useParams, useNavigate} from "react-router-dom";
import {useState} from "react";
import {archiveItems} from "./dummyData";
import {ChatConversation} from "./ChatConversation";
import {ArrowLeft} from "lucide-react";
import MainLayout from "./layout/MainLayout";

export default function ArchiveChat() {
    const {slug} = useParams();
    const navigate = useNavigate();

    const archived = archiveItems.find(item => String(item.title) === String(slug));
    const [messages, setMessages] = useState(archived ? archived.conversation : []);
    const [input, setInput] = useState("");

    const onSendMessage = () => {
        const content = input.trim();
        if (!content) return;
        const nextId = (messages.at(-1)?.message_id || 0) + 1;
        setMessages(prev => [
            ...prev,
            {type: "user_message", message: content, message_id: nextId},
            {type: "ai_message", message: `Echo: ${content}`, message_id: nextId + 1}
        ]);
        setInput("");
    };

    if (!archived) return <div className="p-12">존재하지 않는 아카이브입니다.</div>;

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
