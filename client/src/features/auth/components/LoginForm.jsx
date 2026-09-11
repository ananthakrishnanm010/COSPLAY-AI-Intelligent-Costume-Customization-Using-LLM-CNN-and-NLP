import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function LoginForm() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const result = await login({ email, password });
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Login failed.');
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

      {/* Email Input */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="email"
          style={{ display: 'block', fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '6px' }}
        >
          Email address
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
      <div style={{ marginBottom: '24px' }}>
        <label
          htmlFor="password"
          style={{ display: 'block', fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '6px' }}
        >
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

      {/* Submit Button */}
      <button type="submit" disabled={isLoading} className="btn-outline" style={{ width: '100%' }}>
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
}

export default LoginForm;
