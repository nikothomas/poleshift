// src/components/PreAuth/ResetPassword.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../../utils/supabaseClient';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) {
        setError((error as Error).message);
        setMessage(null);
      }
      setMessage('Password reset email sent. Check your inbox.');
      setError(null);
  };

  return (
    <div className="full-height-center">
      <div className="form-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <button type="submit" className="button">
            Reset Password
          </button>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
        <p>
          Remember your password?{' '}
          <Link to="/login" className="link">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
