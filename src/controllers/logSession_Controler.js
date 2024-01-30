const Service=require("../services/logSession_Service.js");

//get "/login"
async function getLogin(req,res){
      if (req.session.user_id){
        res.status(200).json({"logged":true});
      }
      else{
        res.status(401).json({"logged":false});
      }
}

//put "login"
async function postLogin(req,res){
     let {username,password}=req.body;

     let {error,user_id}=await Service.postLogin(username,password);
     
     if (error){return error}
    
       
     req.session.user_id=user_id;
     res.cookie("user_id",user_id);
     
     //Return good response
     //(res,"Logged in")
     res.status(200).send("Logged");
}

 
//get "/logout"
async function logout(req,res){
    req.session.destroy();

    //(res,"Logged out")
    res.status(200).send("Logged out");
}

module.exports={
    getLogin,postLogin,logout
}