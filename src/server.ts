import express from 'express' //importando express
import 'dotenv/config' //importando dotenv para leer el archivo .env
import router from './router'
import { connectDB } from './config/db'


const app = express() //instancia del servidor
connectDB() //Conectar a la base de datos

//Leer datos de formulario
app.use(express.json())

app.use('/', router)

export default app;