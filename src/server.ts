import express from 'express' //importando express
import router from './router'


const app = express() //instancia del servidor
app.use('/', router)

export default app;