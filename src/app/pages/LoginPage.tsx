import React, { useState } from "react";
import { loginUser, registerUser } from "../api-client";
import { LoginModel } from "../types";
import { setTokens } from "@/utils/tokenUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface LoginProps {
    setIsAuthenticated: (isAuthenticated: boolean) => void
}

const LoginPage = ({ setIsAuthenticated }: LoginProps) => {
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-md shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                    <CardDescription className="text-center">
                        Please enter your login credentials.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Input
                            type="text"
                            placeholder="Username"
                            value={loginData.username}
                            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        />
                    </div>
                    {message && <p className="text-sm text-red-500 mt-4 text-center">{message}</p>}
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <Button onClick={handleLogin} className="w-full">
                        Login
                    </Button>
                    <Button onClick={handleRegister} variant="outline" className="w-full">
                        Register
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;

