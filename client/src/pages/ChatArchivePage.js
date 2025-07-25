import React, { useState, useEffect } from "react";
import { ChevronsDown, MessageCircleMore, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { getChats } from "../utils/api";
import { useRecoilValue } from "recoil";
import { sessionIdState } from "../utils/authState";

export default function ChatArchivePage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const ITEMS_PER_PAGE = 8;
    const [direction, setDirection] = useState(1);

    const [input, setInput] = useState("");    // 입력창 값
    const [search, setSearch] = useState("");  // 실제 검색어(버튼 클릭 시 적용)
    const [chats, setChats] = useState([]);
    const sessionId = useRecoilValue(sessionIdState);

    useEffect(() => {
        if (!sessionId) return;
        getChats(sessionId)
            .then(data => setChats(data))
            .catch(err => {
                setChats([]);
                // Optionally handle error (e.g., show a message)
            });
    }, [sessionId]);

    const trimmedSearch = search.trim();
    const filteredItems = trimmedSearch.length > 0
        ? chats.filter(item => (item.chat_summary || "").toLowerCase().includes(trimmedSearch.toLowerCase()))
        : chats;

    // 페이지네이션
    const startIdx = page * ITEMS_PER_PAGE;
    const currentItems = filteredItems.slice(startIdx, startIdx + ITEMS_PER_PAGE);
    const filteredTotalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

    const handleNext = () => {
        setDirection(1);
        setPage((prev) => (prev + 1) % filteredTotalPages);
    };

    const handleInputChange = (e) => setInput(e.target.value);
    const handleSearch = () => {
        setSearch(input);
        setPage(0);
    };
    const handleInputKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    const variants = {
        enter: (dir) => ({
            y: dir > 0 ? "100%" : "-100%",
            opacity: 0,
            position: "absolute",
            width: "100%",
        }),
        center: {
            y: "0%",
            opacity: 1,
            position: "absolute",
            width: "100%",
        },
        exit: (dir) => ({
            y: dir > 0 ? "-100%" : "100%",
            opacity: 0,
            position: "absolute",
            width: "100%",
        }),
    };

    const placeholders = ITEMS_PER_PAGE - currentItems.length > 0
        ? Array.from({ length: ITEMS_PER_PAGE - currentItems.length })
        : [];

    const renderEmpty = () => (
        <div className="w-full flex justify-center items-center py-12 text-gray-400 text-lg font-medium">
            검색 결과가 없습니다.
        </div>
    );

    return (
        <MainLayout>
            <div className="flex flex-col items-center pt-16 h-full bg-gradient-to-b from-gray-50 via-white to-white">
                {/* 검색창 */}
                <form
                    className="w-full max-w-2xl mb-10 flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-2xl shadow transition focus-within:border-green-500"
                    onSubmit={e => {
                        e.preventDefault();
                        handleSearch();
                    }}
                >
                    <input
                        className="flex-1 resize-none bg-transparent rounded-xl px-4 py-3 text-base text-gray-900 outline-none border-none focus:ring-0"
                        placeholder="검색어를 입력하세요..."
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        style={{ minHeight: "40px", maxHeight: "200px", overflow: "auto" }}
                    />
                    <button
                        type="submit"
                        className="flex items-center justify-center p-2 rounded-full bg-green-600 hover:bg-green-700 transition text-white shadow"
                    >
                        <Search size={18} />
                    </button>
                </form>
                {/* 아카이브 리스트 */}
                <div
                    className="w-full max-w-2xl min-h-[420px] h-auto relative overflow-hidden flex items-stretch justify-stretch">
                    {filteredItems.length === 0 ? (
                        renderEmpty()
                    ) : (
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={page + '-' + search}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.48, ease: "easeInOut" }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full"
                                style={{ minHeight: 360 }}
                            >
                                {currentItems.map(item => (
                                    <button
                                        key={item.chat_id}
                                        onClick={() => navigate(`/archived-chat/${item.chat_id}`)}
                                        className="group flex items-center gap-3 w-full bg-gray-100 hover:bg-green-50 active:scale-[0.98] rounded-2xl px-5 py-6 text-lg font-semibold text-gray-800 shadow-sm border border-gray-200 hover:border-green-400 transition-all duration-200"
                                        style={{
                                            boxShadow: "0 2px 8px 0 rgba(30,41,59,.05)",
                                        }}
                                    >
                                        <span
                                            className="inline-flex items-center justify-center text-green-700 rounded-full w-9 h-9">
                                            <MessageCircleMore className="w-5 h-5" />
                                        </span>
                                        <span className="text-left break-keep">{item.chat_summary || "No Title"}</span>
                                    </button>
                                ))}
                                {placeholders.map((_, idx) => (
                                    <div
                                        key={`empty-${idx}`}
                                        aria-hidden="true"
                                        className="w-full rounded-2xl px-5 py-6 opacity-0"
                                    />
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
                {/* 페이지네이션 */}
                {filteredItems.length > ITEMS_PER_PAGE && (
                    <div className="flex flex-col items-center w-full mt-8">
                        <button
                            onClick={handleNext}
                            className="p-2 rounded-full bg-white border border-gray-200 shadow hover:bg-green-100 transition text-gray-400 hover:text-green-700 focus:outline-none"
                            aria-label="다음 아카이브 보기"
                        >
                            <ChevronsDown className="w-8 h-8" />
                        </button>
                        <span className="mt-3 text-sm text-gray-400">{page + 1} / {filteredTotalPages}</span>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
