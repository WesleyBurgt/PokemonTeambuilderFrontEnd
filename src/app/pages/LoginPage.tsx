import React, { useState } from "react";
import { loginUser, registerUser } from "../api-client";
import { LoginModel } from "../types";
import { setTokens } from "@/utils/tokenUtils";

interface LoginProps {
    setIsAuthenticated: (isAuthenticated: boolean) => void
}

const LoginPage = ({ setIsAuthenticated}: LoginProps) => {
    const [loginData, setLoginData] = useState<LoginModel>({ username: "", password: "" });
    const [message, setMessage] = useState<string>("");

    const handleLogin = async () => {
        try {
            const { accesToken, refreshToken } = await loginUser(loginData);
            setTokens(accesToken, refreshToken);
            setMessage("Login successful!");
            setIsAuthenticated(true);
        } catch (error) {
            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage("An unknown error occurred");
            }
        }
    };

    const handleRegister = async () => {
        try {
            const { accesToken, refreshToken } = await registerUser(loginData);
            setTokens(accesToken, refreshToken);
            setMessage("Registration successful!");
            setIsAuthenticated(true);
        } catch (error) {
            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage("An unknown error occurred");
            }
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
            />
            <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <button onClick={handleRegister}>Register</button>
            <button onClick={handleLogin}>Login</button>
            <p>{message}</p>
        </div>
    );
};

export default LoginPage;

