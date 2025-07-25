import axios from 'axios';
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 0,
});

 // Create a new chat, returns { message, chat_id }
export const createChat = async (sessionId) => {
    try {
        const response = await api.post('/chats/', {}, {
            headers: {
                Bearer: sessionId
            }
        });
        return response.data;
    } catch (error) {
        console.error('채팅 생성 실패:', error);
        throw error;
    }
};

// Send a message to a chat, returns { llm_response }
export const createMessage = async (chat_id, content, sessionId) => {
    try {
        const response = await api.post(`/chats/${chat_id}/message`, {
            content
        }, {
            headers: {
                Bearer: sessionId
            }
        });
        return response.data;
    } catch (error) {
        console.error('메시지 전송 실패:', error);
        throw error;
    }
};

// signUp
export const signUp = async (form) => {
    // Map frontend fields to backend schema
    const userData = {
        user_id: form.email,
        name: form.username,
        user_pw: form.password,
        department: form.department,
        grade: parseInt(form.grade, 10),
        student_id: form.student_id,
    };
    try {
        return await api.post('/users/signup', userData);
    } catch (error) {
        console.error('회원가입 실패:', error);
        return error.response;
    }
};

export const getChats = async (sessionId) => {
    try {
        const response = await api.get('/chats/', {
            headers: {
                Bearer: sessionId
            }
        });
        return response.data;
    } catch (error) {
        console.error('채팅 목록 불러오기 실패:', error);
        throw error;
    }
};

export const getChat = async (chatId, sessionId) => {
    try {
        const response = await api.get(`/chats/${chatId}`, {
            headers: {
                Bearer: sessionId
            }
        });
        return response.data;
    } catch (error) {
        console.error('채팅 불러오기 실패:', error);
        throw error;
    }
};

// Get list of documents
export const getDocuments = async (sessionId) => {
    try {
        const response = await api.get('/docs/', {
            headers: {
                Bearer: sessionId
            }
        });
        return response.data;
    } catch (error) {
        console.error('문서 목록 불러오기 실패:', error);
        throw error;
    }
};

// signIn (for reference, not used in register)
export const signIn = async (email, password) => {
    try {
        const response = await api.post('/users/login', {
            user_id: email,
            user_pw: password
        });
        return response.data;
    } catch (error) {
        console.error("로그인 실패: ", error);
        throw error;
    }
};

// Update authenticated user's profile
export const updateMyProfile = async (profile, sessionId) => {
    // Send all fields required by the backend schema
    const data = {
        name: profile.name,
        student_id: profile.studentId,
        department: profile.major,
        grade: parseInt(profile.year, 10),
    };
    try {
        const response = await api.put('/users/profile/me', data, {
            headers: {
                Bearer: sessionId
            }
        });
        return response.data;
    } catch (error) {
        console.error('프로필 업데이트 실패:', error);
        throw error;
    }
};

export const getMyProfile = async (sessionId) => {
    try {
        const response = await api.get('/users/profile/me', {
            headers: {
                Bearer: sessionId
            }
        });
        return response.data;
    } catch (error) {
        console.error('프로필 불러오기 실패:', error);
        throw error;
    }
};

// Get shared chats (other users' shared chats)
export const getSharedChats = async (sessionId) => {
    try {
        const response = await api.get('/chats/shared/', {
            headers: {
                Bearer: sessionId
            }
        });
        return response.data;
    } catch (error) {
        console.error('공유 채팅 불러오기 실패:', error);
        throw error;
    }
};
