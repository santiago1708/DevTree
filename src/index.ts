import express from 'express' //importando express

const app = express() //instancia del servidor


app.get('/', (req, res) => { //Req = Enviando mucha información al servidor, Res = Respuesta del servidor
    res.send('Hola mundo')
})

const port = process.env.port || 3000 //puerto del servidor

app.listen(port, () => {
    console.log('Server on port:', port)
})