const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const SECRET = 'senha secreta'
function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token']
    const index = backlistTokens.findIndex(item => item === token)
    if (index !== -1) {
        return req.status(401).end()
    }
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) { 
            return res.status(401).end()
        }        
        req.userId = decoded.userId
        next()
    })
}
const backlistTokens = []

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({message: 'Tudo ok por aqui!'})
})

app.get('/clientes', verifyJWT, (req, res) => {
    console.log(req.userId + ' fez essa chamada!')
    res.json([{id: 1, name: 'vinícius'}])
})

app.post('/login', (req, res) => {
    if (req.body.user === 'vinícius' && req.body.password === '123') {
        const token = jwt.sign({userId: 1}, SECRET, {expiresIn: 300})
        return res.json({auth: true, token})
    }

    res.status(401).end()
})

app.post('/logout', (req, res) => {
    backlistTokens.push(req.headers['x-access-token'])
    res.end()
})

const server = http.createServer(app)
server.listen(3000)
console.log('Servidor escutando na porta 3000...')
