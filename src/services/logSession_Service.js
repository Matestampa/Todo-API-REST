const {pool}=require("./db/postgres.js");


//POST "login"
async function postLogin(username,password){
    let response=await pool.query(`SELECT users.id,user_access.password FROM users INNER JOIN 
                        user_access on users.id=user_access.user_id WHERE username=$1`,[username]);
     
     if (response.rows.length==0){return error}
     
     //Aca deberiamos deshashear la contra antes(en caso que este hasheada)
     else if (response.rows[0].password==password){
        let user_id=response.rows[0].id;
        
        return {error:undefined,user_id:user_id}
     }
     else{
        return error;
     }
}

module.exports={postLogin};