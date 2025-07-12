"use client";
import React, { useState } from "react";
import Image from 'next/image';
import "./login.css";
import {authService} from '@/app/api/authService';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {

      const response = await authService.login({userName: username, password: password});

      if (response.status === 200) {
        // redirect or show success message
        window.location.href = "/dashboard";
      } else {
        setErrorMessage(response.status +  "Invalid login.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
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
        className="mx-auto mb-6 w-24 h-auto"/>

        <p className="text-xl font-semibold text-gray-700 text-center mb-8">
          Login to your account
        </p>

        {errorMessage && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6"
            role="alert"
          >
            <strong className="font-bold">Error! </strong>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="input-field text-gray-700"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="input-field text-gray-700"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button type="submit" className="login-button">
              Login
            </button>
          </div>

          <div className="text-center text-sm">
            <a
              href="/auth/forgot_password.php"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
