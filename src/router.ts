import { Router } from 'express';
import { body } from 'express-validator';
import { createAccount, login } from './handlers';

const router = Router();

//Autenticacion y Registro

router.post('/auth/register', 
    body('handle')
        .notEmpty()
        .withMessage('El nombre de usuario es obligatorio'),
    body('name')
        .notEmpty()
        .withMessage('El nombre no puede ir vacio'),
    body('email')
        .isEmail()
        .withMessage('El email no es valido'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres'),
    createAccount)

router.post('/auth/login', 
        body('email')
        .isEmail()
        .withMessage('El email no es valido'),
    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria'),
    login
)

export default router; //Exportando el router