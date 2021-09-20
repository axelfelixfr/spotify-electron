import { useState } from 'react';

// El initialState sera un objeto, que a su vez contendra los input, ejemplo: {name: '', email: '', password: ''}
export const useForm = (initialState = {}) => {

    // Para limpiar los campos hacemos la función reset
    const reset = () => {
        // Volvemos al initialState de los input, que es donde estan vacíos
        setValues(initialState);
    }

    // Inicializamos el useState y le pasamos el objeto de los input 
    const [values, setValues] = useState(initialState);

     // Usamos la mismo función para cada input
    const handleInputChange = ({ target }) => {
        // setValues se ejecutara cada vez que se introduzca o borre algo en los input
        setValues({
            ...values,
            [target.name]: target.value
        });
        // [target.name]: target.value == email: 'axel@correo.com' o nombre: 'Axel Félix'
    }

    // Regresamos tanto los valores como la función handleInputChange 
    return [ values, handleInputChange, reset ];
}