import React from 'react';
import LoginForm from '../../components/login/LoginForm';
import RegisterForm from '../../components/login/RegisterForm';

const AuthPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <LoginForm />
      <RegisterForm />
    </div>
  );
};

export default AuthPage;
