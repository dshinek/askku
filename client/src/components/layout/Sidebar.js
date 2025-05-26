import {useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {User, MessageCircle, Archive, Search, Users, Menu} from "lucide-react";

const navItems = [
    {label: "새로운 챗", icon: MessageCircle, path: "/"},
    {label: "챗 아카이브", icon: Archive, path: "/archive"},
    {label: "문서 탐색", icon: Search, path: "/document"},
    {label: "공유된 챗", icon: Users, path: "/shared-chats"}
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div
            className={`
        bg-green-900 text-white flex flex-col justify-between h-screen transition-all duration-300
        ${collapsed ? "w-16" : "w-48"}
      `}
            style={{minWidth: collapsed ? "4rem" : "12rem"}}
        >
            <div>
                <div className={`flex h-16 items-center ${collapsed ? "justify-center" : "gap-6"} transition-all`}>
                    <div
                        onClick={() => {
                            navigate("/")
                        }}
                        className={`cursor-pointer font-bold tracking-wide transition-all duration-200
            ${collapsed ? "p-0 text-[0px] w-0 overflow-hidden" : "p-5 text-2xl w-auto"}
          `}>
                        ASKKU
                    </div>
                    <button
                        onClick={() => setCollapsed(c => !c)}
                        className={`p-2 rounded-full hover:bg-green-800 transition mx-auto `}
                        aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
                        tabIndex={0}
                    >
                        <Menu size={20}/>
                    </button>
                </div>
                {/* 메뉴 페이드 트랜지션 */}
                <nav
                    className={`
            mt-6 flex flex-col
            transition-opacity duration-300
            ${collapsed ? "opacity-0 pointer-events-none select-none" : "opacity-100"}
          `}
                >
                    {navItems.map(item => (
                        <Link
                            to={item.path}
                            key={item.label}
                            className={`flex items-center gap-3 px-5 py-3 text-base hover:bg-green-800 transition rounded-lg mb-2 cursor-pointer
                ${location.pathname === item.path ? "bg-green-800" : ""}
                ${collapsed ? "justify-center px-0" : ""}
              `}
                            title={collapsed ? item.label : undefined}
                        >
                            <item.icon size={20}/>
                            {!collapsed && <span className="transition-all">{item.label}</span>}
                        </Link>
                    ))}
                </nav>
            </div>
            {/* 프로필도 페이드 트랜지션 */}
            <div
                className={`
          border-t border-green-800 flex items-center gap-2 transition-all
          transition-opacity duration-300
          ${collapsed ? "opacity-0 pointer-events-none select-none p-0" : "opacity-100 p-4"}
        `}
            >
                <User size={20}/>
                {!collapsed && (
                    <Link to="/profile" className="text-base cursor-pointer">내 프로필</Link>
                )}
            </div>
        </div>
    );
}
