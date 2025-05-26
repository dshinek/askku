import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import {useSetRecoilState} from "recoil";
import {sessionIdState} from "../utils/authState";


const LoginPage = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const setSessionId = useSetRecoilState(sessionIdState);

    const handleLogin = async (email, password) => {
        setError(null);
        try {
            // const response = await signIn(email, password);
            // const sessionId = response.session_id;
            // if (!sessionId) {
            //     setError("세션 정보가 없습니다.");
            //     return;
            // }
            // setSessionId(sessionId);
            const sessionId = "1234";
            setSessionId(sessionId);
            localStorage.setItem("session_id", sessionId);
        } catch (err) {
            setError('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.');
        } finally {
            navigate("/")
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">ASKKU</h2>
                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
                <LoginForm onLogin={handleLogin}/>
                <p className="mt-4 text-center text-sm">
                    Don't you have an account?{' '}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Create an account
                    </a>
                </p>
                <p className="mt-2 text-center text-sm">
                    <a href="/reset-password" className="text-gray-500 hover:text-blue-600 hover:underline">
                        Forgot password?
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;