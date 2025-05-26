import { atom } from "recoil";

export const sessionIdState = atom({
    key: "sessionIdState",
    default: localStorage.getItem('session_id'),
});
