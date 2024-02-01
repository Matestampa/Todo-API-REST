const {pool}=require("./db/postgres.js");

const {DFLT_API_ERRORS,INTERNAL_ERRORS}=require("../error_handling");

//get "mylists/:user_id"
async function get_lists(user_id){
   
    let response;
    try{
        response=await pool.query("SELECT lists.* FROM users INNER JOIN lists on users.id=lists.user_id WHERE users.id=$1",[user_id]);
    }
    catch(e){
        return {error:INTERNAL_ERRORS.DB("",e),lists:null};
    }
    
    let lists=response.rows;

    return {error:null,lists:lists};
    
}

//get "/:list_id"
async function get_tasks(list_id){
    
    let response;
    try{
        response=await pool.query(`SELECT * FROM TASKS WHERE list_id=$1 AND checked=false order by pos`,[list_id])
    }
    catch(e){
        return {error:INTERNAL_ERRORS.DB("",e),tasks:null};
    }
    let tasks=response.rows;

    return {error:null,tasks:tasks}
}

//post
async function create_list(req,res){
    let response;

    try{
        response=await pool.query(`INSERT INTO lists(title,color,user_id) VALUES($1,$2)
        RETURNING id`,[title,color,user_id]);  
    }
    catch(e){
        return {error:INTERNAL_ERRORS.DB("",e),new_id:null};
    }
    
    let new_id=response.rows[0].id;
    
    return {error:null,new_id:new_id}
}

//put
async function modify_list(id,title,color){
    
    try{
        await pool.query("UPDATE lists SET title=$1,color=$2 WHERE id=$3",[title,color,id]); 
    }
    catch(e){
        return {error:INTERNAL_ERRORS.DB("",e)};;
    }
    
    return {}
}

//delete "/:id"
async function delete_list(id){
    
    try{
        await pool.query("DELETE FROM lists WHERE id=$1",[id]); 
    }
    catch(e){
        return {error:INTERNAL_ERRORS.DB("",e)};
    }
    return {}
}

module.exports={
    get_lists,
    get_tasks,
    create_list,
    modify_list,
    delete_list
};