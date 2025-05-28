import React, { useState, useRef, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { PencilLine, Check, X, Camera } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { sessionIdState } from "../utils/authState";
import { getMyProfile, updateMyProfile } from "../utils/api";

export default function ProfilePage() {
    const sessionId = useRecoilValue(sessionIdState);
    const [profile, setProfile] = useState({
        name: "",
        studentId: "",
        major: "",
        year: "",
        avatar: null,
    });
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState(profile);

    const fileInputRef = useRef();

    useEffect(() => {
        if (!sessionId) return;
        getMyProfile(sessionId)
            .then(data => {
                setProfile({
                    name: data.name || "",
                    studentId: data.student_id || "",
                    major: data.department || "",
                    year: data.grade || "",
                    avatar: null,
                });
                setForm({
                    name: data.name || "",
                    studentId: data.student_id || "",
                    major: data.department || "",
                    year: data.grade || "",
                    avatar: null,
                });
            })
            .catch(err => {
                // Optionally handle error
            });
    }, [sessionId]);

    const handleChange = (key, value) => {
        setForm(f => ({ ...f, [key]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            setForm(f => ({ ...f, avatar: event.target.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        if (!sessionId) return;
        try {
            await updateMyProfile(form, sessionId);
            setProfile(form);
            setEditMode(false);
        } catch (error) {
            // Optionally handle error
        }
    };

    const handleCancel = () => {
        setForm(profile);
        setEditMode(false);
    };

    const renderValue = (key, value) => {
        if (!editMode)
            return <span className="text-lg font-semibold text-gray-800">{value}</span>;

        const inputBase =
            "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-lg font-semibold text-gray-900 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition placeholder:text-gray-400";

        if (key === "year") {
            return (
                <select
                    value={form.year}
                    onChange={e => handleChange("year", e.target.value)}
                    className={inputBase + " cursor-pointer pr-8"}
                >
                    <option>1학년</option>
                    <option>2학년</option>
                    <option>3학년</option>
                    <option>4학년</option>
                </select>
            );
        }
        return (
            <input
                type={key === "studentId" ? "number" : "text"}
                value={form[key]}
                onChange={e => handleChange(key, e.target.value)}
                className={inputBase}
                placeholder={key === "name" ? "이름을 입력하세요" : ""}
            />
        );
    };

    const canSave = JSON.stringify(profile) !== JSON.stringify(form);

    function AvatarBlock() {
        const src = editMode ? form.avatar : profile.avatar;
        return (
            <div className="relative group mb-4">
                {src ? (
                    <img
                        src={src}
                        alt="avatar"
                        className="w-20 h-20 rounded-full object-cover shadow-inner border border-green-200"
                    />
                ) : (
                    <div
                        className="w-20 h-20 rounded-full bg-gradient-to-tr from-green-200 to-green-400 flex items-center justify-center shadow-inner">
                        <span className="text-4xl font-bold text-white">{profile.name[0]}</span>
                    </div>
                )}
                {editMode && (
                    <button
                        type="button"
                        className="absolute bottom-0 right-0 bg-white/80 hover:bg-green-100 rounded-full p-2 border border-gray-200 shadow transition flex items-center"
                        onClick={() => fileInputRef.current.click()}
                        aria-label="프로필 사진 변경"
                    >
                        <Camera size={18} className="text-green-600"/>
                    </button>
                )}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleAvatarChange}
                />
            </div>
        );
    }

    return (
        <MainLayout>
            <div className="flex flex-col items-center bg-gradient-to-b from-gray-50 via-white to-white h-full">
                <div
                    className="mt-10 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-12 w-full max-w-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                            프로필 정보
                        </h2>
                        {!editMode ? (
                            <button
                                type="button"
                                className="group rounded-full p-2 border border-gray-200 hover:border-green-500 hover:bg-green-50 transition"
                                aria-label="프로필 수정"
                                onClick={() => setEditMode(true)}
                            >
                                <PencilLine className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition"/>
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    disabled={!canSave}
                                    className={`rounded-full p-2 border ${canSave
                                        ? "border-green-400 bg-green-50 hover:bg-green-100 text-green-600"
                                        : "border-gray-200 bg-gray-100 text-gray-300 cursor-not-allowed"
                                    } transition`}
                                    aria-label="저장"
                                    type="button"
                                >
                                    <Check className="w-5 h-5"/>
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="rounded-full p-2 border border-gray-200 bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-600 transition"
                                    aria-label="취소"
                                    type="button"
                                >
                                    <X className="w-5 h-5"/>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-center mb-8">
                        <AvatarBlock/>
                        <div className="text-xl font-semibold text-gray-900">{form.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{form.major} · {form.year}학년</div>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <InfoRow label="이름" value={profile.name} input={renderValue("name", profile.name)}
                                 editMode={editMode}/>
                        <InfoRow label="학번" value={profile.studentId}
                                 input={renderValue("studentId", profile.studentId)}
                                 editMode={editMode}/>
                        <InfoRow label="학과" value={profile.major} input={renderValue("major", profile.major)}
                                 editMode={editMode}/>
                        <InfoRow label="학년" value={profile.year} input={renderValue("year", profile.year)}
                                 editMode={editMode}/>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

function InfoRow({label, value, input, editMode}) {
    return (
        <div className="flex items-center py-4 first:pt-0 last:pb-0">
            <div className="w-24 text-gray-500 font-medium">{label}</div>
            <div className="flex-1 text-right">
                {editMode ? input : <span className="text-lg font-semibold text-gray-800">{value}</span>}
            </div>
        </div>
    );
}
