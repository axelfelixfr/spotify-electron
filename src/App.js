import React, { useState } from 'react';
import { auth, onAuthStateChanged, signOut } from './firebase/firebase-config';
import { AuthPage } from './pages/auth/AuthPage';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  onAuthStateChanged(auth, currentUser => {
    if (!currentUser) {
      setUser(null);
    } else {
      setUser(currentUser);
    }

    setIsLoading(false);
  });

  if (isLoading) {
    return null;
  }

  return !user ? <AuthPage /> : <UserLogged />;
}

function UserLogged() {
  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log('sign Out success');
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100vh'
      }}
    >
      <h1>Usuario logueado</h1>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}

export default App;
