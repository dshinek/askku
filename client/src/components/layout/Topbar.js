import {LogOut} from "lucide-react";
import {useLocation, useParams} from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import {useSetRecoilState} from "recoil";
import {sessionIdState} from "../../utils/authState";
import {archiveItems, sharedItems} from "../dummyData";

const titles = {
    "/": "새로운 챗",
    "/profile": "내 프로필",
    "/shared-chats": "공유된 챗",
    "/document": "문서 탐색",
    "/archive": "챗 아카이브",
    // "/shared/:id": ${},
};

export default function Topbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const {slug} = useParams();
    let title = titles[location.pathname] || "ASKKU";
    const setSessionId = useSetRecoilState(sessionIdState);


    if (location.pathname.startsWith("/shared-chat/")) {
        const shared = sharedItems.find(item => String(item.title) === String(slug));
        if (shared) title = shared.title;
    }
    else if(location.pathname.startsWith("/archived-chat")){
        const archived = archiveItems.find(item => String(item.title) === String(slug));
        if (archived) title = archived.title;
    }

    const handleLogOut = async () => {
        localStorage.removeItem("session_id");
        setSessionId(null);
        navigate("/");
    }

    return (
        <div className="h-16 flex items-center justify-between pl-6 pr-2 bg-white shadow-sm">
            <span className="text-xl font-semibold">{title}</span>
            <button className="p-2 rounded hover:bg-gray-100" onClick={handleLogOut}>
                <LogOut size={24}/>
            </button>
        </div>
    );
}
