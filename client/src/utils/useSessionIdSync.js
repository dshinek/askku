import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { sessionIdState } from "./authState";

const useSessionIdSync = () => {
    const setSessionId = useSetRecoilState(sessionIdState);
    useEffect(() => {
        const sessionId = localStorage.getItem("session_id");
        setSessionId(sessionId);

        const handler = () => {
            setSessionId(localStorage.getItem("session_id"));
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, [setSessionId]);
};
export default useSessionIdSync;
