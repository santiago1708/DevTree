import { Router } from 'express'

const router = Router();

//Autenticacion y Registro

router.post('/auth/register', (req,res) => {
    res.json(req.body)
    console.log(req.body)
})

export default router; //Exportando el router