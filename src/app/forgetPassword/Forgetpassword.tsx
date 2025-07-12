import React, { useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace this with your real endpoint
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || 'Reset link sent to your email.');
        setErrorMessage('');
      } else {
        setErrorMessage(data.error || 'Something went wrong.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Server error. Please try again later.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="form-container bg-white rounded-2xl shadow-lg p-10 max-w-md w-[90%]">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Forgot Your Password?
        </h2>
        <p className="text-md text-gray-700 text-center mb-8">
          Enter your email address below and we'll send you a link to reset your password.
        </p>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
            <strong className="font-bold">Error!</strong>{' '}
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6" role="alert">
            <strong className="font-bold">Success!</strong>{' '}
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your registered email"
            />
          </div>

          <div>
            <button type="submit" className="submit-button bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg w-full hover:bg-indigo-700 transition transform hover:-translate-y-1 active:translate-y-0 shadow-md">
              Send Reset Link
            </button>
          </div>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
