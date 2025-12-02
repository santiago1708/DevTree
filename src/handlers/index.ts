import { Request, Response } from "express";
import slug from 'slug';
import jwt from "jsonwebtoken";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";

export const createAccount = async (req: Request, res: Response) => {


    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('Un usuario con ese email ya existe');
        res.status(409).json({ error: error.message });
        return
    }

    const handle = slug(req.body.handle, '');

    const handleExist = await User.findOne({ handle });
    if (handleExist) {
        const error = new Error('Nombre de usuario no disponible');
        res.status(409).json({ error: error.message });
        return
    }


    const user = new User(req.body)
    user.password = await hashPassword(password);
    user.handle = handle;

    await user.save();
    res.status(201).send('Usuario registrado correctamente');
}

export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    //Comprobar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error('El usuario no existe');
        res.status(409).json({ error: error.message });
        return
    }

    //Comprobar la contraseña
    const isPasswordCorrect = await checkPassword(password, user.password)
    if (!isPasswordCorrect) {
        const error = new Error('Password incorrecto');
        res.status(401).json({ error: error.message });
        return
    }

    const token = generateJWT({ id: user._id })

    res.send(token)
}

export const getUser = async (req: Request, res: Response) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        const error = new Error('No autorizado');
        res.status(401).json({ error: error.message });
        return
    }

    const [, token] = bearer.split(' ');

    if (!token) {
        const error = new Error('No autorizado');
        res.status(401).json({ error: error.message });
        return
    }

    try {
        const result = jwt.verify(token, process.env.JWT_SECRET)
        if (typeof result === 'object' && result.id) {
            const user = await (await User.findById(result.id).select('-password -__v'));
            if (!user) {
                const error = new Error('El usuario no existe');
                res.status(404).json({ error: error.message });
                return
            }
            res.json(user)
        }
    } catch (error) {
        res.status(500).json({ error: 'Token no valido' });
        return
    }
}