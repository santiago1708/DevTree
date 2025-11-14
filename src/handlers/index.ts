import { Request, Response } from "express";
import User from "../models/User";

export const createAccount = async (req : Request, res : Response) => {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('El usuario ya existe');
        res.status(409).json({ error: error.message });
        return
    }
    await User.create(req.body)
    res.status(201).send('Usuario registrado correctamente');
} 