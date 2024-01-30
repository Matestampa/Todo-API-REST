//------------------------ MIDDLEWARE PARA AUTENTICACION DE SESION DE USUARIO --------------- 

const TESTING_MODE=true; //este mode lo activamos cuando estamos probando endpoints,
//y no queremos que nos pida el login a cada rato

function check_authentication(req,res,next){
    
    //Si no estamos en modo dev, aplicamos la autenticacion a las requests
    if (!APP_GEN_VARS.dev_mode){
        if (req.cookies.user_id==req.session.user_id){
            next();
        }
        else{
            apiError_handler(DFLT_API_ERRORS.NOT_AUTH(),res);
        }
    }
    
    else{
        next();
    }
}

module.exports={check_authentication};