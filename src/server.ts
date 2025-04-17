import express from 'express' //importando express
import router from './router'


const app = express() //instancia del servidor

//Leer datos de formulario
app.use(express.json())

app.use('/', router)

export default app;