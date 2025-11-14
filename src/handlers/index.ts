import { Request, Response } from "express";
import slug from 'slug';
import User from "../models/User";
import { hashPassword } from "../utils/auth";

export const createAccount = async (req : Request, res : Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('El usuario ya existe');
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

