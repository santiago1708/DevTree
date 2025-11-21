import express from 'express' //importando express
import cors from "cors"
import 'dotenv/config' //importando dotenv para leer el archivo .env
import router from './router'
import { connectDB } from './config/db'
import { corsConfig } from './config/cors'

connectDB() //Conectar a la base de datos

const app = express() //instancia del servidor
//cors
app.use(cors(corsConfig))

//Leer datos de formulario
app.use(express.json())

app.use('/', router)

export default app;