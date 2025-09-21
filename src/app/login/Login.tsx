"use client";
import React, { useState } from "react";
import Image from 'next/image';
import "./login.css";
import {authService} from '@/app/api/authService';
import Link from 'next/link';
import {jwtDecode} from 'jwt-decode';
import {importSPKI, jwtVerify} from 'jose';
import {UserType} from '@/app/enums/UserType';
import {useRouter} from 'next/navigation';

function toSPKI(base64Key: string): string {
  // insert line breaks every 64 chars
  const formatted = base64Key.match(/.{1,64}/g)!.join("\n");
  return `-----BEGIN PUBLIC KEY-----\n${formatted}\n-----END PUBLIC KEY-----`;
}

export default function Login() {

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("");
  const PUBLIC_KEY:string = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmcqhZSzbgO0gwQNfZKoNGZIr00fTb/FMmvjMSjETT3wk+oIXCjEhBYlDcT7RRmAw6oxGw4bDEZFhrkhY6+wdClpepC+rphGvo5n8QWCJ5TREWDhDgiOZR03H2IdNK2cVfld76sb/hRTP2HWcQ+LVwfM0JeNmzNUQA+Aqev2AXV42p2Exba2T/bD5TIXjfJwAPqjufPiooQbTQQ3oqa2tPuTpZTo076cTDPWxdQFGOtoy60Dlzhh5cPUDj65TtcDhIC4Xn98XsO8tG5tURcNFL06u66cvn+R8oMCUDMGNcCGzUDKMT/VLk/6VJ0xoxAjiAA4Gr+rqkSASdwEsxQT6wQIDAQAB";
  const PUBLIC_KEY_PEM = toSPKI(PUBLIC_KEY);
  function handleSuccessMessage( message: string ) {
    setErrorMessage("");
    setSuccessMessage(message);
  }
  function handleErrorMessage( message: string ) {
    setSuccessMessage("");
    setErrorMessage(message);
  }

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {

      const response = authService.login({userName: username, password: password});
      response.then(async res => {
        try{
          if (res.status === 200) {

            // redirect or show success message

            const publicKey = await importSPKI(PUBLIC_KEY_PEM, "RS256");
            var jwtPayloadJWTVerifyResult = await jwtVerify(res.token, publicKey);
            handleSuccessMessage("PasswordReset successful! Redirecting...");
            // var jwtPayload = jwtDecode(res.token);
            localStorage.setItem('token', res.token);
            var role:UserType = jwtPayloadJWTVerifyResult.payload.role as UserType;
            var username = jwtPayloadJWTVerifyResult.payload.username as string;
            localStorage.setItem('userName', username);
            if(role === UserType.ADMIN){
              router.push("/admin");
            }
          } else {
            handleErrorMessage("Invalid login.");
          }
        } catch (error) {
          handleErrorMessage("Invalid login.");
        }
      }).catch(e => {
        handleErrorMessage(e.message);
      });

    } catch (error) {
      handleErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
      <div className="bg-image flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full">
        <Image
        src="/mycomart_logo.png"
        alt="MYCOMART Logo"
        width={120}
        height={100}
        className="mx-auto mb-6 w-24 h-auto"/>
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Mushroom Sales System
        </h2>

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
        {successMessage && (
            <div
                className="bg-red-100 border border-green-300 text-green-600 px-4 py-3 rounded-lg mb-6"
                role="alert"
            >
              <strong className="font-bold">Error! </strong>
              <span>{successMessage}</span>
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
            <Link
              href="/forgot-password"
              className="font-medium text-[#402101] hover:text-[#7B3F00]"
            >
              Forgot your password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
