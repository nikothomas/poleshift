// src/renderer/components/PreAuth/SignUp.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [licenseKey, setLicenseKey] = useState<string>(''); // New state for license key
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const navigate = useNavigate();

  interface SignUpResponse {
    user_id: string;
    error?: string;
  }

  // Sign-up function that calls the Edge Function
  const callSignUpFunction = async (
    email: string,
    password: string,
    licenseKey: string, // Include license key
  ): Promise<SignUpResponse> => {
    try {
      const response = await fetch(
        'https://YOUR_SUPABASE_FUNCTION_URL/signup', // Replace with your actual function URL
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, licenseKey }), // Send license key
        },
      );

      // Determine the content type of the response
      const contentType = response.headers.get('Content-Type');

      let data: any;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // If not JSON, read as text and throw an error
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Unexpected response format: ${text}`);
      }

      if (!response.ok) {
        // Log detailed error information
        console.error('Error response:', {
          status: response.status,
          statusText: response.statusText,
          data,
        });

        // Return the error message from the response
        return {
          user_id: '',
          error: data.error || 'Unknown error',
        };
      }

      // Log successful response
      console.log('Successful sign-up response:', data);

      // Return the successful response
      return {
        user_id: data.user_id,
      };
    } catch (err: any) {
      // Log the full error details
      console.error('Error calling sign-up function:', err.message);
      return {
        user_id: '',
        error: err.message || 'Internal Server Error',
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset error state on new submit
    setMessage(null); // Reset message state on new submit
    setIsLoading(true); // Start loading

    // Validate email, password, and license key
    if (!email || !password || !licenseKey) {
      setError('Email, password, and license key are required.');
      setIsLoading(false);
      return;
    }

    // Call the Edge Function to sign up the user
    const result = await callSignUpFunction(email, password, licenseKey);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    // Prompt the user to confirm their email
    setMessage(
      'Sign-up successful! Please check your email to confirm your account before logging in. Once confirmed, you can ',
    );

    setIsLoading(false);

    // Optionally, navigate to the login page after a delay
    // setTimeout(() => navigate('/login'), 5000);
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
            disabled={!!message || isLoading} // Disable input if sign-up is successful or loading
          />
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            disabled={!!message || isLoading} // Disable input if sign-up is successful or loading
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
              {message}
              <Link to="/login" className="link">
                log in here
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
