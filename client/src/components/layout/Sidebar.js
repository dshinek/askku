import { Link, useLocation } from "react-router-dom";
import { User, MessageCircle, Archive, Search, Users } from "lucide-react";

const navItems = [
  { label: "새로운 챗", icon: MessageCircle, path: "/" },
  { label: "챗 아카이브", icon: Archive, path: "/archive" },
  { label: "문서 탐색", icon: Search, path: "/document" },
  { label: "공유된 챗", icon: Users, path: "/shared-chats" }
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <div className="bg-green-900 text-white w-48 flex flex-col justify-between h-screen">
      <div>
        <div className="p-5 font-bold text-2xl tracking-wide">ASKKU</div>
        <nav className="mt-6">
          {navItems.map(item => (
            <Link
              to={item.path}
              key={item.label}
              className={`flex items-center gap-3 px-5 py-3 text-base hover:bg-green-800 transition rounded-lg mb-2 cursor-pointer ${
                location.pathname === item.path ? "bg-green-800" : ""
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-green-800 flex items-center gap-2">
        <User size={20} />
        <Link to="/profile" className="text-base cursor-pointer">내 프로필</Link>
      </div>
    </div>
  );
}
