const {Router}=require("express");
const router=Router();

const Controler=require("../controllers/logSession_Controler.js");

//Informa si esta logeado o no
router.get("/login",Controler.get_login);

//Loggea si la data esta bien
router.post("/login",Controler.post_login);

//Cierra la session
router.get("/logout",Controler.logout);


module.exports=router;