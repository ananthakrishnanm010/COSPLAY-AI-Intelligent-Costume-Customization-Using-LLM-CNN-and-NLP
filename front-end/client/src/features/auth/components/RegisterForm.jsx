import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function RegisterForm() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const result = await register({ name, email, password });
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Registration failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ textAlign: 'left' }}>
      {error && (
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: '#F7F7F7',
            borderLeft: '2px solid var(--clay)',
            color: 'var(--clay)',
            fontSize: '13px',
            marginBottom: '20px',
          }}
        >
          {error}
        </div>
      )}

      {/* Name Input */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="name" style={{ display: 'block', fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '6px' }}>
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
          disabled={isLoading}
          required
        />
      </div>

      {/* Email Input */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="email" style={{ display: 'block', fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '6px' }}>
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          disabled={isLoading}
          required
        />
      </div>

      {/* Password Input */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="password" style={{ display: 'block', fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '6px' }}>
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          disabled={isLoading}
          required
        />
      </div>

      {/* Confirm Password Input */}
      <div style={{ marginBottom: '24px' }}>
        <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '6px' }}>
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input-field"
          disabled={isLoading}
          required
        />
      </div>

      {/* Submit CTA */}
      <button type="submit" disabled={isLoading} className="btn-outline" style={{ width: '100%' }}>
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
}

export default RegisterForm;
