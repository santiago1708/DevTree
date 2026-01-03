import { Router } from 'express';
import { body } from 'express-validator';
import { createAccount, getUser, getUserByHandle, login, searchByHandle, updateProfile, uploadImage } from './handlers';
import { handleInpoutErrors } from './middleware/validation';
import { authenticate } from './middleware/Auth';

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
    handleInpoutErrors,
    createAccount
)

router.post('/auth/login',
    body('email')
        .isEmail()
        .withMessage('El email no es valido'),
    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria'),
    handleInpoutErrors,
    login
)

router.get('/user', authenticate, getUser)
router.patch('/user',
    body('handle')
        .notEmpty()
        .withMessage('El nombre de usuario es obligatorio'),
    handleInpoutErrors,
    authenticate,
    updateProfile)

router.post('/user/image',
    authenticate,
    uploadImage)

router.get('/:handle',
    getUserByHandle
)

router.post('/search',
    body('handle')
        .notEmpty()
        .withMessage('el handle no puede ir vacio'),
    handleInpoutErrors,
    searchByHandle
)

export default router; //Exportando el router