const express = require('express');
const path = require('path');
const morgan = require('morgan');
//const mysql = require('mysql')
//const myConnection = require('express-myconnection')
const passport = require('passport');
const session = require('express-session')
const flash = require('connect-flash')
const engine = require('ejs-mate');
const crypto = require('./lib/crypto')
var connection = require('./lib/connection')



//inicializações
const app = express();
require('./lib/connection')

//importing routers
const traderRoutes = require('./routes/trader')
const indexRoutes = require('./routes/index')


// settings
app.set('port', process.env.PORT || 4001);
app.engine('ejs', engine)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');


//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: '!@#estado',
    resave: true,
    saveUninitialized: true
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

require('./lib/passport')
app.use((req, res, next) => {
    app.locals.user = req.user // cria uma variavel global de liberação de rotas para usuários
    app.locals.cadastrarMensagem = req.flash('cadastrarMensagem')
    app.locals.loginMensagem = req.flash('loginMensagem')
    console.log(req.user)
    next()
})



//routes
app.use('/trader', traderRoutes);
app.use('/', indexRoutes);

//static files
app.use(express.static(path.join(__dirname, 'public')));

// starting the server
const server = app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})

