"use client";
import React, { useState } from "react";
import Image from 'next/image';
import "./login.css";
import Link from 'next/link';
import { importSPKI, jwtVerify } from 'jose';
import { UserType } from '@/app/enums/UserType';
import { useRouter } from 'next/navigation';

// Helper to format the public key
function toSPKI(base64Key: string): string {
    const formatted = base64Key.match(/.{1,64}/g)!.join("\n");
    return `-----BEGIN PUBLIC KEY-----\n${formatted}\n-----END PUBLIC KEY-----`;
}

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Your JWT Public Key
    const PUBLIC_KEY: string = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmcqhZSzbgO0gwQNfZKoNGZIr00fTb/FMmvjMSjETT3wk+oIXCjEhBYlDcT7RRmAw6oxGw4bDEZFhrkhY6+wdClpepC+rphGvo5n8QWCJ5TREWDhDgiOZR03H2IdNK2cVfld76sb/hRTP2HWcQ+LVwfM0JeNmzNUQA+Aqev2AXV42p2Exba2T/bD5TIXjfJwAPqjufPiooQbTQQ3oqa2tPuTpZTo076cTDPWxdQFGOtoy60Dlzhh5cPUDj65TtcDhIC4Xn98XsO8tG5tURcNFL06u66cvn+R8oMCUDMGNcCGzUDKMT/VLk/6VJ0xoxAjiAA4Gr+rqkSASdwEsxQT6wQIDAQAB";
    const PUBLIC_KEY_PEM = toSPKI(PUBLIC_KEY);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        try {
            // Direct fetch to your Spring Boot Backend
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username: username, // Ensure this matches your Java LoginRequest field
                    password: password 
                }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                setSuccessMessage("Login successful! Redirecting...");
                localStorage.setItem('token', data.token);

                // Verify and Decode JWT
                const publicKey = await importSPKI(PUBLIC_KEY_PEM, "RS256");
                const { payload } = await jwtVerify(data.token, publicKey);
                
                const role = payload.role as string;

                // Redirect based on Role
                if (role === "ADMIN") {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/dashboard"); 
                }
            } else {
                setErrorMessage(data.message || "Invalid username or password.");
            }
        } catch (error) {
            setErrorMessage("Failed to connect to server. Ensure your Spring Boot app is running on port 8080.");
        }
    };

    return (
        <div className="bg-image flex items-center justify-center min-h-screen bg-gray-100 font-sans">
            <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
                    Mushroom Sales System
                </h2>
                <Image
                    src="/mycomart_logo.png"
                    alt="MYCOMART Logo"
                    width={96}
                    height={96}
                    className="mx-auto mb-6 w-24 h-auto"
                />

                <p className="text-xl font-semibold text-gray-700 text-center mb-8">
                    Login to your account
                </p>

                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
                        <strong className="font-bold">Error! </strong>
                        <span>{errorMessage}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-6" role="alert">
                        <strong className="font-bold">Success! </strong>
                        <span>{successMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username:
                        </label>
                        <input
                            type="text"
                            id="username"
                            required
                            className="input-field border border-gray-300 rounded-lg p-3 w-full text-gray-700"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            required
                            className="input-field border border-gray-300 rounded-lg p-3 w-full text-gray-700"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="login-button bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg w-full hover:bg-indigo-700 transition">
                        Login
                    </button>

                    <div className="text-center text-sm">
                        <Link href="/forgot-password" size-sm className="font-medium text-indigo-600 hover:text-indigo-500">
                            Forgot your password?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}