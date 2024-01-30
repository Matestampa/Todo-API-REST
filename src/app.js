const express=require("express"); 


//---------------------- importacion de middlewares -------------------------------
const sessions=require("express-session");
const cookieparser=require("cookie-parser");

const {check_authentication}=require("./middlewares/authentication.js");


//--------------------- importacion de rutas -----------------------------------
const logSession_Routes=require("./routes/logSession_Routes");
const tasksList_Routes=require("./routes/tasksList_Routes.js");
const tasks_Routes=require("./routes/tasks_Routes.js");

//--------------- importacion vars generales de la app --------------------
const {APP_GEN_VARS}=require("./config/app_config.js");


const App=express();


//------------------- Config general express -------------------------------
App.use(express.json());
App.use(cookieparser());

App.use(sessions({
    secret:APP_GEN_VARS.session_secret,
    saveUninitialized:true,
    resave:false,
    cookie:{max_age:1000*60*60*24},

}));


//------------------- Endpoints --------------------------------------------
App.use("/user",logSession_Routes);


/*--------- Middleware superior/general que aplica autenticacion a todas las requests -----
(Influye en todas, menos en las del login de arriba que son distintas).*/

App.use(check_authentication);

//------------------------ Resto de endpoints ------------------------------------
App.use("/tasks_list",tasksList_Routes);
App.use("/tasks",tasks_Routes);



module.exports={App};