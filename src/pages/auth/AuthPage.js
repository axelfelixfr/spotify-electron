import React, { useState } from 'react';
import { AuthOptions } from '../../components/auth/AuthOptions/AuthOptions';
import { LoginForm } from '../../components/auth/LoginForm/LoginForm';
import { RegisterForm } from '../../components/auth/RegisterForm/RegisterForm';
import BackgroundApp from '../../assets/img/background-auth.jpg';
import LogoNameWhite from '../../assets/img/logo-name-white.png';
import LogoSpotify from '../../assets/img/logo.svg';

import './Auth.scss';

export const AuthPage = () => {
  const [selectedForm, setSelectedForm] = useState(null);

  const handleForm = () => {
    switch (selectedForm) {
      case 'login':
        return <LoginForm setSelectedForm={setSelectedForm} />;
      case 'register':
        return <RegisterForm setSelectedForm={setSelectedForm} />;

      default:
        return <AuthOptions setSelectedForm={setSelectedForm} />;
    }
  };

  return (
    <div className="auth" style={{ backgroundImage: `url(${BackgroundApp})` }}>
      <div className="auth__dark" />
      <div className="auth__box">
        <div className="auth__box-logo">
          <img src={LogoSpotify} alt="Spotify Logo" />
        </div>
        {handleForm()}
      </div>
    </div>
  );
};
