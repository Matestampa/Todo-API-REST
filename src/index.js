const express=require("express"); 
const sessions=require("express-session");
const cookieparser=require("cookie-parser");


const logSession_Routes=require("./routes/logSession_Routes");
const tasksList_Routes=require("./routes/tasksList_Routes.js");
const tasks_Routes=require("./routes/tasks_Routes.js");

const app=express();

app.listen(3000);
app.use(express.json());

app.use(cookieparser());

app.use(sessions({
    secret:"putoelquelee",
    saveUninitialized:true,
    resave:false,
    cookie:{max_age:1000*60*60*24},

}));



app.use("/user",logSession_Routes);



//Yo pondria este middleware que vea si esta autenticado para todas las request
//Influye en todas, menos en las del login de arriba que son distintas.
const TESTING_MODE=true; //este mode lo activamos cuando estamos probando endpoints,
//y no queremos que nos pida el login a cada rato

app.use((req,res,next)=>{
    //Lo hacemos mas seguro
    if (!TESTING_MODE){
    if (req.cookies.user_id==req.session.user_id){
        next();
    }
    else{
        res.status(401).json({"error":"not_logged"});;
    }
    }
    next();
})

//endpoints
app.use("/tasks_list",tasksList_Routes);
app.use("/tasks",tasks_Routes);
