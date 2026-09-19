import { Link } from 'react-router-dom';
import RegisterForm from '../features/auth/components/RegisterForm';

function RegisterPage() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        minHeight: '65vh',
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          border: '1px solid var(--line)',
          padding: '48px 36px',
          textAlign: 'center',
          background: 'var(--bg)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: '400',
            letterSpacing: '-0.3px',
            marginBottom: '8px',
          }}
        >
          Create account
        </h2>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--ink-soft)',
            marginBottom: '28px',
          }}
        >
          Join Cosplay to receive updates and manage orders.
        </p>

        <RegisterForm />

        <div
          style={{
            marginTop: '28px',
            borderTop: '1px solid var(--line)',
            paddingTop: '20px',
            fontSize: '13px',
            color: 'var(--ink-soft)',
          }}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: 'var(--ink)',
              borderBottom: '1px solid var(--ink)',
              paddingBottom: '2px',
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
