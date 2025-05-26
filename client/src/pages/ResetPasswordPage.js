import React, {useState} from 'react';

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            // 실제 요청: await axios.post('/api/forgot-password', { email });
            setTimeout(() => {
                setMessage('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
                setLoading(false);
                setTimeout(() => {
                    setMessage('');
                }, 5000);
            }, 1000);
        } catch (err) {
            setError('요청 처리 중 오류가 발생했습니다.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-background-dark">
            <div
                className="w-full max-w-md bg-white dark:bg-background-dark text-black dark:text-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
                {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 text-sm">Your Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 mb-4 border rounded bg-white dark:bg-gray-800 dark:text-white"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Confirmation Email'}
                    </button>
                </form>
                <p className="mt-2 text-center text-sm">
                    <a href="/login" className="text-gray-500 hover:text-blue-600 hover:underline">
                        Go Back
                    </a>
                </p>
            </div>
        </div>
    );
};

export default ResetPasswordPage;