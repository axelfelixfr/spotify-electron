import React, { useState } from 'react';
import { Button, Form, Icon, Input } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import './RegisterForm.scss';
import { useForm } from './../../../hooks/useForm';
import {
  validateEmail,
  validateName,
  validatePassword
} from '../../../utils/validations';
import {
  createUserWithEmailAndPassword,
  auth,
  updateProfile,
  sendEmailVerification
} from '../../../firebase/firebase-config';

export const RegisterForm = ({ setSelectedForm }) => {
  // State del formulario de registro
  const initialForm = {
    username: '',
    email: '',
    password: ''
  };

  // State del formulario
  const [formValues, handleInputChange] = useForm(initialForm);
  const { username, email, password } = formValues;

  // Errores del formulario
  const [formError, setFormError] = useState({});

  // Loading al enviar el formulario
  const [isLoading, setIsLoading] = useState(false);

  const handleOnSubmit = e => {
    // Prevenimos el evento
    e.preventDefault();
    // Inicializamos el state de errores
    setFormError({});
    // Las variables para validación
    let errors = {};
    let formIsCorrect = true;

    // Si el email no es valido entonces pasara a false "formIsCorrect" y pasara la propiedad email en false
    if (!validateEmail(email)) {
      errors.email = true;
      formIsCorrect = false;
    }

    // Si el password no es valido entonces pasara a false "formIsCorrect" y pasara la propiedad password en false
    if (!validatePassword(password)) {
      errors.password = true;
      formIsCorrect = false;
    }

    // Si el username no es valido entonces pasara a false "formIsCorrect" y pasara la propiedad username en false
    if (!validateName(username)) {
      errors.username = true;
      formIsCorrect = false;
    }

    // El objeto de errores se pasa al state
    setFormError(errors);

    // Si el formulario paso sin errores se ejecuta esto
    if (formIsCorrect) {
      // Se hace el loading del boton
      setIsLoading(true);

      console.log(username, email, password);

      // Crear usuario con Firebase
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          console.log('Registro completo');
          // Cambiamos el username por el que puso en el formulario
          changeUsername();
          // Enviamos el correo para verificar
          sendVerificationEmail();
        })
        .catch(error => {
          toast.error('Ha fallado el registro');
          console.log(error);
        });

      // Por último quitamos el loading y pasamos a null el formulario
      setIsLoading(false);
      setSelectedForm(null);
    }
  };

  // Función para cambiar el username
  const changeUsername = () => {
    const user = auth.currentUser;
    updateProfile(user, { displayName: username }).catch(error => {
      toast.error('Error al asignar el nombre de usuario');
      console.log(error);
    });
  };

  // Enviamos el correo para verificar
  const sendVerificationEmail = () => {
    const user = auth.currentUser;
    sendEmailVerification(user)
      .then(() => {
        toast.success('Se ha enviado un correo de verificación');
      })
      .catch(error => {
        toast.error('Error al enviar el mensaje de verificación');
        console.log(error);
      });
  };

  // Mostrar contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Handle para mostrar/ocultar contraseña
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-form">
      <h1>Empieza a escuchar con una cuenta de Spotify</h1>
      <Form onSubmit={handleOnSubmit}>
        <Form.Field>
          <Input
            type="text"
            value={username}
            onChange={handleInputChange}
            name="username"
            placeholder="Nombre"
            icon="user circle outline"
            error={formError.username}
          />
          {formError.username && (
            <span className="error-text">
              Introduce un nombre correcto sin números ni carácteres
            </span>
          )}
        </Form.Field>

        <Form.Field>
          <Input
            type="text"
            value={email}
            onChange={handleInputChange}
            name="email"
            placeholder="Correo electrónico"
            icon="mail outline"
            error={formError.email}
          />
          {formError.email && (
            <span className="error-text">Introduce un email válido</span>
          )}
        </Form.Field>

        <Form.Field>
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handleInputChange}
            name="password"
            placeholder="Contraseña"
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
            error={formError.password}
          />
          {formError.password && (
            <span className="error-text">
              Introduce una contraseña con al menos 8 letras con un número y una
              mayúscula
            </span>
          )}
        </Form.Field>

        <Button type="submit" loading={isLoading}>
          Continuar
        </Button>
      </Form>

      <div className="register-form__options">
        <p onClick={() => setSelectedForm(null)}>Volver</p>
        <p>
          ¿Ya tienes Spotify?{' '}
          <span onClick={() => setSelectedForm('login')}>Iniciar sesión</span>
        </p>
      </div>
    </div>
  );
};
