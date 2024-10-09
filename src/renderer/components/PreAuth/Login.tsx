// src/renderer/components/PreAuth/Login.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../../utils/supabaseClient';

interface LoginProps {
  onLogin: (userData: any) => void; // Adjust the user type based on your implementation
}

const Login: React.FC<LoginProps> = ({ onLogin = () => {} }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    // Fetch user profile
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user?.id)
      .single();

    if (profileError) {
      setError('Failed to fetch user profile.');
      setIsLoading(false);
      return;
    }

    // Pass the user and profile data to the parent component
    onLogin({ user: data.user, profile: profileData });
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
            disabled={isLoading}
          />
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            disabled={isLoading}
          />
          <button type="submit" className="button" disabled={isLoading}>
            {isLoading ? 'Logging In...' : 'Login'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <p>
          <Link to="/reset-password" className="link">
            Forgot your password?
          </Link>
        </p>
        <p>
          Don't have an account?{' '}
          <Link to="/signup" className="link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
