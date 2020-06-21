const express = require('express');
const router = express.Router();
const passport = require('passport');
const {eAdmin} = require('../lib/eAdmin');
const fslogin = require('../lib/login');
var crypto = require('../lib/crypto')
var connection = require('../lib/connection.js')

router.get('/admin', eAdmin, (req, res, next) => {
    //res.render('login')
});

router.get('/login', (req, res, next) => {
    res.render('login')
});
router.post('/login',  async(req, res, next)=>{
    await passport.authenticate('local-login',{
        successRedirect: '/trader',
        failureRedirect: '/login',
        passReqToCallback: true
    })(req, res, next);
});

router.get('/logout', (req, res, next)=>{
    req.logout();
    res.redirect('/login')
})



router.get('/cadastrar', (req, res, next) => {
    res.render('trader_cadastro')
});
 
router.post('/cadastrar', async(req, res, next)=>{
    var email = req.body.email
    var password = req.body.password
            
              try {
                connection.query('SELECT * FROM trader WHERE email = ?', [email],
                function  (error, results, fields) {
                      var dataAtual = new Date();
                      var data_vencimento = new Date()
                      data_vencimento.setDate(dataAtual.setDate(dataAtual.getDate() + 7))
                      var senha = crypto.code(password).toString();
                      console.log('senha', senha)
                      console.log('LocalStrategy', error, results);
                      if (error) { return done(error); }
  
                      if (results.length > 0) {
                          return done(null, false, req.flash('cadastrarMensagem', 'Email já existe em nossos dados'))
                      } else {
  
                          connection.query('INSERT INTO trader(email,password, nome, cpf, cidade, telefone, data_vencimento, pagou_em, oculto, admin )VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                              [
                                  email,
                                  senha,
                                  req.body.nome,
                                  req.body.cpf,
                                  req.body.cidade,
                                  req.body.telefone,
                                  data_vencimento, // define como padrão 7 dias gratuitos a partir do cadastro,
                                  dataAtual,
                                  0,
                                  0 
                              ],
                             function (error, results) {
                                  console.log('erroooooo:', error)
                                  console.log('resultssss do cadastros:', results)
                                 
                                  res.render('login')
                              })
                      }
                  })
              } catch (error) {
                  console.log('error', error)
              }
                
            
      
});

function isAutenticated(req, res, next){ // pode colocar o nome igual ao é admin, na mesma posição
    if(req.isAutenticated()){
        return next();
    }
    res.redirect('/login')
}
// Essa função pode ser colocada antes das que devem ser autenticadas
// router.use((req, res, next)=>{
//     isAutenticated(req, res, next);
//     next()
// })
 
module.exports = router;    