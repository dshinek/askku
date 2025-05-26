import {useParams, useNavigate} from "react-router-dom";
import {useState} from "react";
import {sharedItems} from "./dummyData";
import {ChatConversation} from "./ChatConversation";
import {ArrowLeft} from "lucide-react";
import MainLayout from "./layout/MainLayout";

export default function SharedChat() {
    const {id} = useParams();
    const navigate = useNavigate();

    const shared = sharedItems.find(item => String(item.id) === String(id));
    const [messages, setMessages] = useState(shared ? shared.conversation : []);
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

    if (!shared) return <div className="p-12">존재하지 않는 공유챗입니다.</div>;

    return (
        <MainLayout>
            <div className="h-full flex flex-col">
                <div className="w-full mx-auto flex-1 flex items-center gap-4 pt-8 pb-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-full p-2 hover:bg-gray-100 transition"
                        aria-label="뒤로가기"
                    >
                        <ArrowLeft className="w-6 h-6"/>
                    </button>
                    <h3 className="text-xl font-bold">{shared.title}</h3>
                </div>
                <ChatConversation
                    messages={messages}
                    onSendMessage={onSendMessage}
                    inputValue={input}
                    setInputValue={setInput}
                />
            </div>
        </MainLayout>
    );
}
