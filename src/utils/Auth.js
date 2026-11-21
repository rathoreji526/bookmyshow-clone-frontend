import { jwtDecode } from "jwt-decode";

export const isAuthenticated = () => {
    console.log('checking token');
    
    const token = localStorage.getItem('token');
    if(!token)return false;
    
    const decoded = jwtDecode(token);
    if(!decoded || !decoded.exp)return false;

    const currrentTimeInSeconds =Math.floor(Date.now() / 1000);
    return decoded.exp > currrentTimeInSeconds;
}