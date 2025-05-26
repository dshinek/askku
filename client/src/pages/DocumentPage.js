import React, {useState} from "react";
import {ChevronsDown, FolderOpen, Search} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion";
import MainLayout from "../components/layout/MainLayout";

export default function DocumentPage() {
    const docs = [
        "학사 제도 안내 p.1",
        "학사 제도 안내 p.2",
        "학사 제도 안내 p.3",
        "학사 제도 안내 p.4",
        "학사 제도 안내 p.5",
        "학사 제도 안내 p.6",
        "학사 제도 안내 p.7",
        "학사 제도 안내 p.8",
        "학사 제도 안내 p.8",
        "학사 제도 안내 p.8",
        "학사 제도 안내 p.8",
        "학사 제도 안내 p.8",
        "학사 제도 안내 p.8",
        "학사 제도 안내 p.8",
        "학사 제도 안내 p.8",
        "학사 제도 안내 p.8",
    ];

    const ITEMS_PER_PAGE = 8;
    const [input, setInput] = useState("");
    const [search, setSearch] = useState(""); // 실제 적용된 검색어
    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState(1);

    const trimmedSearch = search.trim();
    const filteredDocs = trimmedSearch.length > 0
        ? docs.filter(doc => doc.toLowerCase().includes(trimmedSearch.toLowerCase()))
        : docs;

    // 페이지네이션
    const filteredTotalPages = Math.ceil(filteredDocs.length / ITEMS_PER_PAGE);
    const startIdx = page * ITEMS_PER_PAGE;
    const currentDocs = filteredDocs.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    const placeholders = Array.from({length: ITEMS_PER_PAGE - currentDocs.length > 0 ? ITEMS_PER_PAGE - currentDocs.length : 0});

    const handleSearch = () => {
        setSearch(input);
        setPage(0);
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleInputKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleNext = () => {
        setDirection(1);
        setPage((prev) => (prev + 1) % filteredTotalPages);
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

    const renderEmpty = () => (
        <div className="w-full flex justify-center items-center py-12 text-gray-400 text-lg font-medium">
            검색 결과가 없습니다.
        </div>
    );

    return (
        <MainLayout>
            <div className="flex flex-col items-center pt-16 h-full bg-gradient-to-b from-gray-50 via-white to-white">
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
                        style={{minHeight: "40px", maxHeight: "200px", overflow: "auto"}}
                    />
                    <button
                        type="submit"
                        className="flex items-center justify-center p-2 rounded-full bg-green-600 hover:bg-green-700 transition text-white shadow"
                    >
                        <Search size={18}/>
                    </button>
                </form>
                {/* 문서 그리드 */}
                <div
                    className="w-full max-w-2xl min-h-[280px] relative overflow-hidden flex items-stretch justify-stretch">
                    {filteredDocs.length === 0 ? (
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
                                transition={{duration: 0.48, ease: "easeInOut"}}
                                className="grid grid-cols-4 grid-rows-2 gap-8 w-full"
                            >
                                {currentDocs.map((name, i) => (
                                    <div key={name + i} className="flex flex-col items-center py-4 cursor-pointer">
                                        <FolderOpen size={50}/>
                                        <span className="text-center text-sm mt-6">{name}</span>
                                    </div>
                                ))}
                                {placeholders.map((_, i) => (
                                    <div
                                        key={`empty-${i}`}
                                        aria-hidden="true"
                                        className="opacity-0 flex flex-col items-center"
                                    >
                                        <div className="w-24 h-20 mb-2"/>
                                        <span className="text-center text-sm mt-1">&nbsp;</span>
                                    </div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
                {/* 페이지네이션*/}
                {filteredDocs.length > ITEMS_PER_PAGE && (
                    <div className="flex flex-col items-center w-full mt-8">
                        <button
                            onClick={handleNext}
                            className="p-2 rounded-full bg-white border border-gray-200 shadow hover:bg-green-100 transition text-gray-400 hover:text-green-700 focus:outline-none"
                            aria-label="다음 문서 보기"
                        >
                            <ChevronsDown className="w-8 h-8"/>
                        </button>
                        <span className="mt-3 text-sm text-gray-400">{page + 1} / {filteredTotalPages}</span>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
