module.exports = {
    eAdmin: (req, res, next)=>{

        if(req.isAuthenticated() && req.user.admin == 1){
            return next();
        }
        //req.flash("error_msg", "Acesso Restrito para Administradores")
        res.redirect("/")
    },
}