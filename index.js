const express = require('express')
const { Socket } = require('socket.io')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: { orgin: '*'}})
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('./userinfo.db')

db.serialize(() => {           
    db.run("CREATE TABLE user (id INT, username TEXT, password TEXT)");
  });

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/home', (req, res) => {
    res.render('home')
})

app.post('/', (req, res) => {
    const username = req.body.username
    const password = req.body.username
    res.cookie('username', username, { maxAge: 90 * 24 * 60 * 60 * 1000 });
    res.cookie('loggedin', "yes", { maxAge: 90 * 24 * 60 * 60 * 1000 });
    res.render('index')
})

app.get('/login', (req, res) => {
    if(req.cookies.loggedin != 'yes')
        res.render('login')
    res.redirect('/home')
})

app.get('/chat/:id', (req, res) => {
    if(req.cookies.loggedin != 'yes')
        res.redirect('/')
    res.render('chat', { id: req.params.id})
})

server.listen(3000, () => {
    console.log('Server is running...')
})

io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);
});