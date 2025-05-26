import React, { useState } from 'react';

const RegisterForm = ({ onRegister }) => {
    const [form, setForm] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        affiliation: '',
    });
    const [verification, setVerification] = useState({
        requested: false,
        sentCode: '',
        enteredCode: '',
        verified: false,
        msg: '',
    });
    const [error, setError] = useState(null);

    const handleInput = e => {
        setForm(f => ({
            ...f,
            [e.target.name]: e.target.value,
        }));
    };

    // 이메일 인증코드 요청
    const handleSendVerification = () => {
        if (!form.email) {
            setVerification(v => ({ ...v, msg: '이메일을 입력해주세요.' }));
            return;
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setVerification({
            requested: true,
            sentCode: code,
            enteredCode: '',
            verified: false,
            msg: `인증 코드가 ${form.email} 주소로 전송되었습니다. (예시 코드: ${code})`
        });
    };

    // 인증코드 체크
    const handleCheckVerification = () => {
        setVerification(v =>
            v.enteredCode === v.sentCode
                ? { ...v, requested: false, verified: true, msg: '이메일 인증이 완료되었습니다.' }
                : { ...v, verified: false, msg: '인증 코드가 올바르지 않습니다.' }
        );
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (!verification.verified) {
            setError('이메일 인증을 완료해주세요.');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }
        setError(null);
        onRegister(form.email, form.username, form.password, form.affiliation);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <div>
                <label className="block font-semibold mb-1">Email</label>
                <div className="flex gap-2">
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleInput}
                        required
                        disabled={verification.verified}
                        className="flex-1 px-3 py-2 border rounded"
                    />
                    <button
                        type="button"
                        onClick={handleSendVerification}
                        disabled={verification.verified}
                        className="px-3 py-2 bg-blue-500 disabled:bg-blue-800 text-white rounded enabled:hover:bg-blue-600"
                    >
                        {verification.verified ? "Verified" : "Verify"}
                    </button>
                </div>
                {verification.msg && (
                    <p className={`text-xs mt-1 ${verification.verified ? 'text-green-500' : 'text-gray-600'}`}>
                        {verification.msg}
                    </p>
                )}
            </div>
            {verification.requested && !verification.verified && (
                <div>
                    <label className="block font-semibold mb-1">인증 코드 입력</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={verification.enteredCode}
                            onChange={e => setVerification(v => ({ ...v, enteredCode: e.target.value }))}
                            className="flex-1 px-3 py-2 border rounded"
                        />
                        <button
                            type="button"
                            onClick={handleCheckVerification}
                            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}

            <div>
                <label className="block font-semibold mb-1">Name</label>
                <input
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={handleInput}
                    required
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div>
                <label className="block font-semibold mb-1">Password</label>
                <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleInput}
                    required
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div>
                <label className="block font-semibold mb-1">Check Password</label>
                <input
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleInput}
                    required
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div>
                <label className="block font-semibold mb-1">Affiliation</label>
                <input
                    name="affiliation"
                    type="text"
                    value={form.affiliation}
                    onChange={handleInput}
                    required
                    className="w-full px-3 py-2 border rounded"
                />
            </div>

            <button
                type="submit"
                disabled={!verification.verified}
                className="w-full bg-green-600 text-white py-2 rounded disabled:cursor-not-allowed enabled:hover:bg-green-700 disabled:opacity-50"
            >
                Sign up
            </button>
        </form>
    );
};

export default RegisterForm;
