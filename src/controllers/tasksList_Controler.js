const {pool}=require("./db/connection.js");

//get "mylists/:user_id"
async function get_lists(req,res){
      let user_id=req.params.user_id;

      //Chequemaos que se haga un get con el mismo user_id de list, que el user_id en la session
      if (req.session.user_id==user_id){
            let response=await pool.query("SELECT lists.* FROM users INNER JOIN lists on users.id=lists.user_id WHERE users.id=$1",[user_id]);

            res.status(200).json(response.rows); 
      }
      //Si no coincide deberiamos mandar un redirect o algo asi.
      else{
            res.status(401).json({"error":"wrong_data"});
      }
}

//get "/:id"
async function get_tasks(req,res){
      let id=req.params.id;

      let response=await pool.query(`SELECT * FROM TASKS WHERE list_id=$1 AND checked=false order by pos`,[id])
      
      res.status(200).json(response.rows);
}

//post
async function create_list(req,res){
      let {title,color,user_id}=req.body;

      if (!title || !color || !user_id){res.status(400).json({"error":"missing_data"})}

      let response=await pool.query(`INSERT INTO lists(title,color,user_id) VALUES($1,$2)
      RETURNING id`,[title,color,user_id]);
      
      let new_id=response.rows[0].id;
      
      res.status(201).json({"id":new_id});
}

//put
async function modify_list(req,res){
      let {id,title,color}=req.body;

      await pool.query("UPDATE lists SET title=$1,color=$2 WHERE id=$3",[title,color,id]);
      
      res.status(200).json("UPDATED");
}

//delete "/:id"
async function delete_list(req,res){
      let id=req.params.id;

      await pool.query("DELETE FROM lists WHERE id=$1",[id]);

      res.status(200).send("DELETED");
}

module.exports={
    get_lists,get_tasks,create_list,modify_list,delete_list
};