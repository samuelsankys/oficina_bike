var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var connection = require('./connection.js')
var crypto = require('./crypto')



passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
    async (req, email, password, done) => {
        console.log(req.body)
        try {
            console.log('LocalStrategy', email, password);

            connection.query('SELECT * FROM trader WHERE email=?', [email],
                function (error, results, fields) {
                    console.log('LocalStrategy', error, results);
                    if (error) { return done(error); }

                    if (results.length > 0) {

                        if (results[0].password == crypto.code(password)) {
                            done(null, results[0]);
                        } else {
                            return done(null, false, req.flash('loginMensagem', 'Senha incorreta.'))
                        }
                    } else {
                        return done(null, false, req.flash('loginMensagem', 'Usuário não encontrado'));
                    }
                })

        } catch (error) {
            res.json({ status: 'error' })
        }

    }
));


// passport.use('local', new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password',
//     passReqToCallback: true
// },
//     async (req, email, password, done) => {
//         console.log(req.body)
//         try {
//             console.log('LocalStrategy', email, password);

//             connection.query('SELECT * FROM trader WHERE email = ?', [email],
//               function  (error, results, fields) {
//                     var dataAtual = new Date();
//                     var data_vencimento = new Date()
//                     data_vencimento.setDate(dataAtual.setDate(dataAtual.getDate() + 7))
//                     var senha = crypto.hash(password).toString();
//                     console.log('LocalStrategy', error, results);
//                     if (error) { return done(error); }

//                     if (results.length > 0) {
//                         return done(null, false, req.flash('cadastrarMensagem', 'Email já existe em nossos dados'))
//                     } else {

//                         connection.query('INSERT INTO trader(email,password, nome, cpf, cidade, telefone, data_vencimento, pagou_em, oculto, admin )VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//                             [
//                                 email,
//                                 senha,
//                                 req.body.nome,
//                                 req.body.cpf,
//                                 req.body.cidade,
//                                 req.body.telefone,
//                                 data_vencimento, // define como padrão 7 dias gratuitos a partir do cadastro,
//                                 dataAtual,
//                                 0,
//                                 0
//                             ],
//                            async function (error, results, fields) {
//                                 console.log('erroooooo:', error)
//                                 console.log('resultssss do cadastros:', results)
//                                 console.log('resultssss do cadastros:', fields)
//                                  done(null,await results);
//                             })
//                     }
//                 })
//         } catch (error) {
//             res.json({ status: 'error' })
//         }

//     }
// ));


// passport.serializeUser(function(user, done) {
//     done(null, user);
//   });
  
//   passport.deserializeUser(function(user, done) {
//     done(null, user);
//   });

passport.serializeUser(function (user, done) {
    console.log('serializeUser', user);

    return done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    console.log("denro do deserialize ..", id)
    connection.query(`
    SELECT *
    FROM trader 
    WHERE id=?`, [id], function (error, results) {
        console.log('deserializeUser', error, results);

       return done(error, results[0]);
    })
});


module.exports = passport