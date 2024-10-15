// src/renderer/components/PreAuth/SignUp.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../utils/supabaseClient.ts';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [licenseKey, setLicenseKey] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Function to call the Edge Function to process the license key
  const callLicenseFunction = async (licenseKey: string) => {
    try {
      // Get the current session to obtain the access token
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      const accessToken = session?.access_token;

      if (!accessToken) {
        throw new Error('User is not authenticated.');
      }

      // Call the Edge Function with the access token
      const response = await fetch(
        'https://poleshift.icarai.cloud/functions/v1/process_license',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // Include JWT token
          },
          body: JSON.stringify({ licenseKey }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error processing license key.');
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error processing license key:', error.message);
      return { success: false, error: error.message };
    }
  };

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

    // Check if the user needs to confirm their email
    if (!data.session) {
      // Email confirmation is required
      setMessage(
        'Sign-up successful! Please check your email to confirm your account before logging in.'
      );
      setIsLoading(false);
      return;
    }

    // After successful sign-up and if email confirmation is not required, process the license key
    const result = await callLicenseFunction(licenseKey);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setMessage('Sign-up successful! You can now log in.');
    setIsLoading(false);

    // Optionally, log the user out if you want them to log in again
    await supabase.auth.signOut();

    // Optionally, navigate to the login page
    // navigate('/login');
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
