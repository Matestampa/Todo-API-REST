const {pool}=require("./db/postgres.js");

const {DFLT_API_ERRORS,INTERNAL_ERRORS}=require("../error_handling");

//POST "login"
async function postLogin(username,password){
    let response=await pool.query(`SELECT users.id,user_access.password FROM users INNER JOIN 
                        user_access on users.id=user_access.user_id WHERE username=$1`,[username]);
     
     if (response.rows.length==0){return {error:DFLT_API_ERRORS.BAD_REQ("Invalid username or password"),user_id:null} }
     
     //Aca deberiamos deshashear la contra antes(en caso que este hasheada)
     else if (response.rows[0].password==password){
        let user_id=response.rows[0].id;
        
        return {error:null,user_id:user_id}
     }
     else{
        return {error:DFLT_API_ERRORS.BAD_REQ("Invalid username or password"),user_id:null};
     }
}

module.exports={postLogin};