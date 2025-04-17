import { Router } from 'express'

const router = Router();

router.get('/', (req, res) => { //Req = Enviando mucha información al servidor, Res = Respuesta del servidor
    res.send('Hola mundo')
})

router.get('/nosotros', (req, res) => { //Req = Enviando mucha información al servidor, Res = Respuesta del servidor
    res.send('Nosotros')
})

router.get('/blog', (req, res) => {
    res.send('Blog')
})

export default router; //Exportando el router