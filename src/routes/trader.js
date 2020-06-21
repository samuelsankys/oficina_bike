const express = require('express');
const router = express.Router();

const path = require('path');
const login = require('../lib/login')
const crypto = require('../lib/crypto')
var connection = require('../lib/connection.js')


router.get('/', isAuthenticated, async (req, res, next) => {
  // var email = req.body['email'];
  // var password = req.body['password'];
  // var tipoDeConta = req.body['tipoDeConta'];
  // var periodoDaVela = req.body['periodoDaVela'];
  // var periodoDaCaptura = req.body['periodoDaCaptura'];
  //const user = await User.findOne({email:user.email})
  //console.log('entru no dcoidas',user.name)
  var password = crypto.decode(req.user.password).toString()
  let options = await {
    mode: 'text',
    pythonPath: '/usr/bin/python3.6',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: path.join(__dirname, '../app/script'),
    args: [req.user.email, password, 60, 7200, 'EURUSD']
  };
  console.log(options)
  promisse = new Promise((resolve, reject) => {
    // PythonShell.run('script.py', options, function (err, results) {
    //   if (err)
    //     reject(err)
    //   else resolve(results)
    //   //  var jsonArray = JSON.parse(JSON.stringify(results))
    //   //         console.log('JSON :',jsonArray)
    //   if (err) throw err;
    //   // results is an array consisting of messages collected during execution
    //   console.log('results: %j', results);
    // });
  })
    .then(async (results) => {

      // salvar o valor da api para passar como parametro
      // login.saveLogin(results[1])
      //console.log(req.user.email)
      await res.render('index-trader', {

        catalogacaoGx: {}, //results ||
        paridade: {}
      })
    })
    .catch((err) => {
      res.json({ erro: "error" })
    })
})

router.get('/conexao', isAuthenticated, async (req, res, next) => {

  var password = crypto.decode(req.user.password).toString()
  console.log("senhaaaaaaaaaaaaaaaaaa decrypt", password)
  let options = await {
    mode: 'text',
    pythonPath: '/usr/bin/python3.6',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: path.join(__dirname, '../app/script'),
    args: [req.user.email, password]
  };

  promisse = new Promise((resolve, reject) => {
    // PythonShell.run('connectionApi.py', options, function (err, results) {
    //   if (err)
    //     reject(err)
    //   else resolve(results)
    //   if (err) throw err;
    //   // results is an array consisting of messages collected during execution
    //   console.log('results: %j', results);
    // });
  })
    .then(async (results) => {
      var conexao = await results
      if (conexao[0] == 'Tentando Reconectar') {
        req.flash('loginMensagem', 'Tentando Reconectar, tente novamente')
      } else if (conexao[0] == 'Senha incorreta') {
        req.flash('loginMensagem', 'Senha incorreta, a senha deve ser a utilizada na IQ Option')
      } else if (conexao[0] == 'Sem internet') {
        req.flash('loginMensagem', 'Sem internet, Tente novamente')
      } else {
        res.render('index-trader')
      }
    })
    .catch((err) => {
      res.json({ erro: "error" })
    })
})


router.get('/paridade', async (req, res, next) => {
  var password = crypto.decode(req.user.password).toString()
  let options = await {
    mode: 'text',
    pythonPath: '/usr/bin/python3.6',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: path.join(__dirname, '../app/script'),
    args: [req.user.email, password]
  };

  promisse = new Promise((resolve, reject) => {
    PythonShell.run('paridade.py', options, function (err, results) {
      if (err)
        reject(err)
      else resolve(results)

      if (err) throw err;
      // results is an array consisting of messages collected during execution
      console.log('results: %j', results);
    });
  })
    .then(async (results) => {
      var paridade = await results
      console.log("entrou no json")
      res.json({ status: 'sucesso000000', paridade: paridade })
    })
    .catch((err) => {
      res.json({ erro: "error" })
    })
})



function isAuthenticated(req, res, next) {

  if (req.isAuthenticated()) {
    return next();
  }
  //req.flash("error_msg", "Acesso Restrito para Administradores")
  res.redirect("/")
}
module.exports = router;