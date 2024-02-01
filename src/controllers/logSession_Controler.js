const {apiError_handler,DFLT_API_ERRORS}=require("../error_handling");
const {normal_response}=require("../middlewares/response.js");  

const Service=require("../services/logSession_Service.js");


//get "/login"
async function get_login(req,res){
      if (req.session.user_id){

        normal_response(res,"",{logged:true})
      }
      else{
        apiError_handler(DFLT_API_ERRORS.NOT_AUTH("",{logged:false}),res)
      }
}

//put "login"
async function post_login(req,res){
     let {username,password}=req.body;

     let {error,user_id}=await Service.post_login(username,password);
     
     if (error){apiError_handler(error,res);return}
    
     //Aplicar valores a la session y a la cookie  
     req.session.user_id=user_id;
     res.cookie("user_id",user_id);
     
     normal_response(res,"Logged in")
}

 
//get "/logout"
async function logout(req,res){
    //Destruir session
    req.session.destroy();

    normal_response(res,"Logged out");
}

module.exports={
    get_login,post_login,logout
}