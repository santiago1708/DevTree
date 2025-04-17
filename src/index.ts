import server from './server'

const port = process.env.port || 3000 //puerto del servidor

server.listen(port, () => {
    console.log('Server on port:', port)
})