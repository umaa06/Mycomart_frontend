"use client";
import React, { useState } from "react";
import loginBackground from "../../../public/mushroom.jpg";
import Image from 'next/image';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      const response = await fetch("/auth/process_login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // redirect or show success message
        window.location.href = "/dashboard";
      } else {
        setErrorMessage(data.message || "Invalid login.");
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
              className="input-field"
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
              className="input-field"
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

      <style>{`
        .input-field {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          width: 100%;
          transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .input-field:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
        .login-button {
          background-color: #4f46e5;
          color: #ffffff;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          width: 100%;
          transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                      0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .login-button:hover {
          background-color: #4338ca;
          transform: translateY(-1px);
        }
        .login-button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};
