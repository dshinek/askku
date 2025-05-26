import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import {signUp} from "../utils/api";

const RegisterPage = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const isAuthenticated = () => {
        return !!localStorage.getItem('token');
    }
    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/dashboard");
        }
    }, []);
    const handleRegister = async (email, username, password, affiliation) => {
        setError(null);
        const userData = {
            email: email,
            password: password,
            name: username,
            affiliation: affiliation
        };

        try {
            const result = await signUp(userData);
            if (!result || result.status !== 200) {
                alert(result?.data?.detail || "회원가입에 실패했습니다. 네트워크 상태를 확인해주세요.");
                return;
            }
            alert(result.data.message);
            navigate("/login");
        } catch (err) {
            alert("회원가입 처리 중 예기치 못한 오류가 발생했습니다.");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign up</h2>
                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
                <RegisterForm onRegister={handleRegister}/>
                <p className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;