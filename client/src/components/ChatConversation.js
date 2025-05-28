import {User, Bot, Send} from "lucide-react";
import {useRef, useEffect} from "react";

// 공통 대화 UI
export function ChatConversation({messages, onSendMessage, inputValue, setInputValue, loading = false, disabled = false}) {
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages]);

    useEffect(() => {
        if (inputValue === "" && inputRef.current) {
            inputRef.current.style.height = "auto";
        }
    }, [inputValue]);

    const handleChange = (e) => {
        setInputValue(e.target.value);
        const textarea = inputRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
        }
    };

    return (
        <div className="h-full bg-gray-100 flex flex-col">
            {/* 대화 내역 */}
            <div
                ref={scrollRef}
                className="flex-1 w-full mx-auto overflow-y-auto px-10 py-8"
                style={{minHeight: 0}}
            >
                {messages.length === 0 ? (
                    <div
                        className="text-6xl font-bold text-green-900 select-none flex flex-col items-center justify-center h-full pb-40">ASKKU</div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {messages.map((msg) =>
                            <Bubble
                                key={msg.message_id}
                                role={msg.type}
                                content={msg.message}
                            />
                        )}
                        {loading && (
                            <div className="flex items-center gap-2 text-gray-500 text-base pl-12 pt-2">
                                <Bot className="w-5 h-5 text-green-700 animate-bounce" />
                                <span>답변 생각중...</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* 프롬프트 */}
            <div className="w-full mx-auto px-8 pb-6">
                <form
                    className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-2xl shadow transition focus-within:border-green-500"
                    onSubmit={e => {
                        e.preventDefault();
                        onSendMessage();
                    }}
                >
                    <textarea
                        ref={inputRef}
                        rows={1}
                        className={`flex-1 resize-none bg-transparent rounded-xl px-4 py-3 text-base text-gray-900 outline-none border-none focus:ring-0 ${disabled && !loading ? "placeholder:text-red-400" : ""}`}
                        placeholder={disabled ? "공유된 챗은 메시지를 입력할 수 없습니다." : "메시지를 입력하세요..."}
                        value={inputValue}
                        disabled={loading || disabled}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        style={{minHeight: "40px", maxHeight: "200px", overflow: "auto"}}
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || loading || disabled}
                        className="flex items-center justify-center p-2 rounded-full bg-green-600 enabled:hover:bg-green-700 transition text-white shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18}/>
                    </button>
                </form>
            </div>
        </div>
    );
}


// 말풍선 UI
function Bubble({role, content}) {
    const isUser = role === "user_message";
    return (
        <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
            {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-200 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-green-700"/>
                </div>
            )}
            <div className={`
                max-w-[70%] px-4 py-3 rounded-2xl text-base leading-relaxed
                ${isUser
                ? "bg-green-600 text-white rounded-br-md shadow-md"
                : "bg-gray-100 text-gray-900 rounded-bl-md border border-gray-200"
            }
                break-words whitespace-pre-wrap
            `}>
                {content}
            </div>
            {isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-green-700"/>
                </div>
            )}
        </div>
    );
}
