import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import './SaveDesignAuthModal.css';

function SaveDesignAuthModal({ onClose, onSuccess }) {
    const { login, register, isLoading } = useAuth();

    const [mode, setMode] = useState('login');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');

        let result;

        if (mode === 'login') {
            result = await login({
                email,
                password,
            });
        } else {
            result = await register({
                name,
                email,
                password,
            });
        }

        if (!result.success) {
            setError(result.message || 'Something went wrong.');
            return;
        }

        // Authentication succeeded.
        // Tell AIDesignPage to save the already-generated design.
        onSuccess();
    };

    return (
        <div
            className="save-design-modal-overlay"
            onClick={onClose}
        >
            <div
                className="save-design-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="save-design-modal-close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>

                <div className="save-design-modal-header">
                    <h2>
                        {mode === 'login'
                            ? 'Save Your Design'
                            : 'Create Account'}
                    </h2>

                    <p>
                        {mode === 'login'
                            ? 'Sign in to save your custom design to your account.'
                            : 'Create an account to save your custom design.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>

                    {mode === 'register' && (
                        <div className="save-design-field">
                            <label htmlFor="save-design-name">
                                Name
                            </label>

                            <input
                                id="save-design-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                required
                            />
                        </div>
                    )}

                    <div className="save-design-field">
                        <label htmlFor="save-design-email">
                            Email
                        </label>

                        <input
                            id="save-design-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="save-design-field">
                        <label htmlFor="save-design-password">
                            Password
                        </label>

                        <input
                            id="save-design-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="save-design-auth-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="save-design-auth-submit"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? 'Please wait...'
                            : mode === 'login'
                                ? 'Login & Continue'
                                : 'Create Account & Continue'}
                    </button>
                </form>

                <div className="save-design-auth-switch">
                    {mode === 'login' ? (
                        <>
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    setMode('register');
                                    setError('');
                                }}
                            >
                                Create Account
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    setMode('login');
                                    setError('');
                                }}
                            >
                                Sign In
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SaveDesignAuthModal;