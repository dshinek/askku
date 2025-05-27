import React, { useState } from 'react';
import { signUp } from '../../utils/api';

const RegisterForm = () => {
    const [form, setForm] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        department: '',
        grade: '',
        student_id: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleInput = e => {
        setForm(f => ({
            ...f,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }
        setError(null);
        setSuccess(null);
        const res = await signUp(form);
        if (res && res.status && res.status >= 200 && res.status < 300) {
            setSuccess('회원가입이 완료되었습니다.');
            setForm({
                email: '',
                username: '',
                password: '',
                confirmPassword: '',
                department: '',
                grade: '',
                student_id: '',
            });
        } else if (res && res.data && res.data.detail) {
            setError(res.data.detail);
        } else {
            setError('회원가입에 실패했습니다.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

            <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleInput}
                    required
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
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
                <label className="block font-semibold mb-1">Department</label>
                <input
                    name="department"
                    type="text"
                    value={form.department}
                    onChange={handleInput}
                    required
                    className="w-full px-3 py-2 border rounded"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1">Grade</label>
                <input
                    name="grade"
                    type="number"
                    value={form.grade}
                    onChange={handleInput}
                    required
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div>
                <label className="block font-semibold mb-1">Student ID</label>
                <input
                    name="student_id"
                    type="text"
                    value={form.student_id}
                    onChange={handleInput}
                    required
                    className="w-full px-3 py-2 border rounded"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded enabled:hover:bg-green-700"
            >
                Sign up
            </button>
        </form>
    );
};

export default RegisterForm;
