import React, { useState } from 'react';
import { Form, Input, Button, Icon } from 'semantic-ui-react';
import { useForm } from '../../../hooks/useForm';
import { validateEmail, validatePassword } from '../../../utils/validations';
import {
  auth,
  signInWithEmailAndPassword
} from '../../../firebase/firebase-config';
import { toast } from 'react-toastify';
import { ButtonVerificationEmail } from './ButtonVerificationEmail';
import './LoginForm.scss';

export const LoginForm = ({ setSelectedForm }) => {
  // State inicial del formulario de registro
  const initialForm = {
    email: '',
    password: ''
  };

  // State para los inputs
  const [formValues, handleInputChange] = useForm(initialForm);
  const { email, password } = formValues;

  // Errores del formulario
  const [formError, setFormError] = useState({});

  // Para el loading del boton
  const [isLoading, setIsLoading] = useState(false);

  // Para saber si esta o no activo el usuario en la verificación del correo
  const [userActive, setUserActive] = useState(true);

  // Para saber si hay un usuario
  const [user, setUser] = useState(null);

  // Códigos de error de Firebase
  const handleErrorLogin = code => {
    switch (code) {
      case 'auth/user-not-found':
        toast.error('El usuario o la contraseña son incorrectos');
        break;
      case 'auth/wrong-password':
        toast.error('Verifica tus credenciales');
        break;
      case 'auth/too-many-requests':
        toast.warning(
          'Haz enviado demasiadas solicitudes, por favor intentalo más tarde'
        );
        break;
      default:
        toast.error('Algo ha fallado, intentalo más tarde');
        break;
    }
  };

  // Envio del formulario
  const handleOnSubmit = e => {
    e.preventDefault();
    setFormError({});
    let errors = {};

    let formIsCorrect = true;

    if (!validateEmail(email)) {
      errors.email = true;
      formIsCorrect = false;
    }

    if (!validatePassword(password)) {
      errors.password = true;
      formIsCorrect = false;
    }

    // El objeto de errores se pasa al state
    setFormError(errors);

    // Si el formulario paso sin errores se ejecuta esto
    if (formIsCorrect) {
      // Se hace el loading del boton
      setIsLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then(response => {
          console.log(response.user);
          setUser(response.user);
          setUserActive(response.user.emailVerified);
          if (!response.user.emailVerified) {
            toast.warning(
              'Es necesario que verifiques tu cuenta con tu correo electrónico para iniciar sesión'
            );
          }
        })
        .catch(error => {
          // Controlamos los errores de Firebase
          handleErrorLogin(error.code);
        });
      // Por último quitamos el loading y pasamos a null el formulario
      setIsLoading(false);
      // Esto te regresa a las opciones
      // setSelectedForm(null);
    }
  };

  // Mostrar contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Handle para mostrar/ocultar contraseña
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-form">
      <h1>Música para todos</h1>
      <Form onSubmit={handleOnSubmit}>
        <Form.Field>
          <Input
            type="text"
            name="email"
            placeholder="Correo electrónico"
            error={formError.email}
            icon="mail outline"
            onChange={handleInputChange}
          />
          {formError.email && (
            <span className="error-text">Introduce un email válido</span>
          )}
        </Form.Field>

        <Form.Field>
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Contraseña"
            error={formError.password}
            icon={
              showPassword ? (
                <Icon
                  name="eye slash outline"
                  link
                  onClick={handleShowPassword}
                ></Icon>
              ) : (
                <Icon name="eye" link onClick={handleShowPassword}></Icon>
              )
            }
            // Es necesario la propiedad "link" para poder clickear el icono
            onChange={handleInputChange}
          />
          {formError.password && (
            <span className="error-text">
              Introduce una contraseña con al menos 8 letras con un número y una
              mayúscula
            </span>
          )}
        </Form.Field>

        <Button type="submit" loading={isLoading}>
          Iniciar Sesión
        </Button>
      </Form>

      {!userActive && (
        <ButtonVerificationEmail
          user={user}
          setIsLoading={setIsLoading}
          setUserActive={setUserActive}
        />
      )}

      <div className="login-form__options">
        <p onClick={() => setSelectedForm(null)}>Volver</p>
        <p>
          ¿No tienes cuenta?{' '}
          <span onClick={() => setSelectedForm('register')}>Regístrarte</span>
        </p>
      </div>
    </div>
  );
};
