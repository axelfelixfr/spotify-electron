import React, { useState, useEffect } from 'react';
import { auth, onAuthStateChanged, signOut } from './firebase/firebase-config';
import { AuthPage } from './pages/auth/AuthPage';
import { ToastContainer } from 'react-toastify';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Se coloca useEffect
  useEffect(() => {
    onAuthStateChanged(auth, currentUser => {
      console.log(auth.currentUser);

      // Si existe un usuario pero su correo no ha sido verificado, entonces que lo saque de sesión
      if (!currentUser?.emailVerified) {
        // Hacemos el cierre de sesión
        signOut(auth)
          .then(() => {
            // Pasa a null el user
            setUser(null);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        // Si su correo ha sido verificado, entonces mandamos al usuario
        setUser(currentUser);
      }

      setIsLoading(false);
    });
  }, [setUser, setIsLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      {!user ? <AuthPage /> : <UserLogged />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
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
