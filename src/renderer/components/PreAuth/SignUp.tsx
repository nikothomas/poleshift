// src/renderer/components/PreAuth/SignUp.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../../utils/supabaseClient.ts';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [licenseKey, setLicenseKey] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    // Validate input fields
    if (!email || !password || !licenseKey) {
      setError('Email, password, and license key are required.');
      setIsLoading(false);
      return;
    }

    // Sign up the user using Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    // Store the license key in localStorage for later use
    localStorage.setItem('licenseKey', licenseKey);

    // Email confirmation is required
    setMessage(
      'Sign-up successful! Please check your email to confirm your account before logging in.'
    );
    setIsLoading(false);
  };

  return (
    <div className="full-height-center">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            disabled={!!message || isLoading}
          />
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            disabled={!!message || isLoading}
          />
          <input
            type="text"
            className="input-field"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            placeholder="License Key"
            required
            disabled={!!message || isLoading}
          />
          <button
            type="submit"
            className="button"
            disabled={!!message || isLoading}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
          {error && <p className="error-message">{error}</p>}
          {message && (
            <p className="success-message">
              {message}{' '}
              <Link to="/login" className="link">
                Log in here
              </Link>
              .
            </p>
          )}
        </form>
        {!message && (
          <p>
            Already have an account?{' '}
            <Link to="/login" className="link">
              Log In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default SignUp;
