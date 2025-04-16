const express = require('express')

const app = express() //instancia del servidor


app.get('/', (req, res) => { //Req = Enviando mucha información al servidor, Res = Respuesta del servidor
    res.send('Hola mundo')
})

app.listen(3000, () => {
    console.log('Server on port 3000')
})