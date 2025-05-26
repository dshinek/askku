import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import SharedChatPage from "./pages/SharedChatPage";
import DocumentPage from "./pages/DocumentPage";
import ChatArchivePage from "./pages/ChatArchivePage";
import NewChatPage from "./pages/NewChatPage";
import SharedChat from "./components/SharedChat";
import useSessionIdSync from "./utils/useSessionIdSync";
import LoginPage from "./pages/LoginPage";
import {useRecoilState} from "recoil";
import {sessionIdState} from "./utils/authState";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ArchiveChat from "./components/ArchieveChat";

function App() {
    useSessionIdSync();
    const [isAuthenticated, setIsAuthenticated] = useRecoilState(sessionIdState);
    return (
        <Router>
            <Routes>
                <Route path="/" element={isAuthenticated ? <NewChatPage/> : <Navigate to="/login"/>}/>
                <Route path="/login" element={isAuthenticated ? <NewChatPage/> : <LoginPage/>}/>
                <Route path="/register" element={isAuthenticated ? <NewChatPage/> : <RegisterPage/>}/>
                <Route path="/reset-password" element={isAuthenticated ? <NewChatPage/> : <ResetPasswordPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/shared-chats" element={<SharedChatPage/>}/>
                <Route path="/document" element={<DocumentPage/>}/>
                <Route path="/archive" element={<ChatArchivePage/>}/>
                <Route path="/archived-chat/:slug" element={<ArchiveChat/>}/>
                <Route path="/shared-chat/:slug" element={<SharedChat/>}/>
            </Routes>
        </Router>
    );
}

export default App;
