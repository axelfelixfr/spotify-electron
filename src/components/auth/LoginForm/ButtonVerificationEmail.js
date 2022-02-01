import React from 'react';
import { toast } from 'react-toastify';
import { sendEmailVerification, auth } from '../../../firebase/firebase-config';

export const ButtonVerificationEmail = ({ setIsLoading, setUserActive }) => {
  const resetEmailVerification = () => {
    const user = auth.currentUser;
    sendEmailVerification(user)
      .then(() => {
        toast.success('Se ha enviado el email de verificación');
      })
      .catch(error => {
        handleErrorVerification(error.code);
        console.log(error);
      });
    setIsLoading(false);
    setUserActive(true);
  };

  const handleErrorVerification = code => {
    switch (code) {
      case 'auth/wrong-password':
        toast.warning('El usuario o la contraseña son incorrectos');
        break;
      case 'auth/too-many-requests':
        toast.warning(
          'Has enviado demasiadas solicitudes de confirmación de cuenta en un lapso de tiempo corto'
        );
        break;
      default:
        toast.warning('Algo ha fallado');
        break;
    }
  };

  return (
    <div className="resend-verification-email">
      <p>
        Si no has recibido el email de verificación puedes volver a enviarlo
        haciendo click <span onClick={resetEmailVerification}>aquí</span>
      </p>
    </div>
  );
};
