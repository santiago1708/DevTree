import { Request, Response } from "express";
import slug from 'slug';
import formidable from 'formidable'
import { v4 as uuid } from 'uuid'
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
import cloudinary from "../config/cloudinary";

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
    res.send(req.user)
}

export const updateProfile = async (req: Request, res: Response) => {

    try {
        const { description, links } = req.body

        const handle = slug(req.body.handle, '');

        const handleExist = await User.findOne({ handle });
        if (handleExist && handleExist.email !== req.user.email) {
            const error = new Error('Nombre de usuario no disponible');
            res.status(409).json({ error: error.message });
            return
        }

        //Actualizar el perfil
        req.user.description = description;
        req.user.handle = handle;
        req.user.links = links;

        await req.user.save();
        res.send('Perfil actualizado correctamente');

    } catch (e) {
        const error = new Error('Hubo un error')
        res.status(500).json({ error: error.message });
        return
    }

}


export const uploadImage = async (req: Request, res: Response) => {
    const form = formidable({
        multiples: false,
    })
    try {

        form.parse(req, (error, fields, files) => {

            cloudinary.uploader.upload(files.file[0].filepath, { public_id: uuid() }, async function (error, result) {
                if (error) {
                    const error = new Error('Hubo un error en la subida de la imagen')
                    res.status(500).json({ error: error.message });
                    return
                }
                if (result) {
                    req.user.image = result.secure_url //Agregar URL a la base de datos
                    await req.user.save(); // Guarda el usuario con la nueva imagen
                    res.json({ message: 'Imagen subida correctamente', image: result.secure_url });
                }
            })
        })

    } catch (e) {
        const error = new Error('Hubo un error')
        res.status(500).json({ error: error.message });
        return
    }

}

export const getUserByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.params
        const user = await User.findOne({ handle }).select('-password -_id -__v -email ')

        if (!user) {
            const error = new Error('Usuario no encontrado')
            res.status(404).json({ error: error.message })
            return
        }
        res.json(user)
    } catch (e) {
        const error = new Error('Hubo un error')
        res.status(500).json({ error: error.message });
        return
    }
}