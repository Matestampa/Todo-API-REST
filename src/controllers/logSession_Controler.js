const {pool}=require("./db/connection.js");

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

     let response=await pool.query(`SELECT users.id,user_access.password FROM users INNER JOIN 
                        user_access on users.id=user_access.user_id WHERE username=$1`,[username]);
     
     if (response.rows.length==0){res.status(400).json({"error":"wrong_user"})}
     
     //Aca deberiamos deshashear la contra antes(en caso que este hasheada)
     else if (response.rows[0].password==password){
        let user_id=response.rows[0].id;
        req.session.user_id=user_id;
        res.cookie("user_id",user_id);
        
        res.status(200).send("Logged");
     }
     else{
        res.status(400).json({"error":"wrong_password"});
     }
}
 
//get "/logout"
async function logout(req,res){
    req.session.destroy();
    res.status(200).send("Logged out");
}

module.exports={
    getLogin,postLogin,logout
}