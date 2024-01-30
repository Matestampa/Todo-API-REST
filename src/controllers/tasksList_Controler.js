const {apiError_handler,DFLT_API_ERRORS}=require("../error_handling");

const Service=require("../services/tasksList_Service.js");

//get "mylists/:user_id"
async function get_lists(req,res){
      let user_id=req.params.user_id;

      if (req.session.user_id==user_id){
         
         let {error,lists}=await Service.get_lists(user_id);
         
         if (error){apiError_handler(error,res);return}

         //hacer good response
         //(res,"",lists)
      }

      else{
        apiError_handler(DFLT_API_ERRORS.NOT_AUTH(),res);
      }
}

//get "/:list_id"
async function get_tasks(req,res){
      let list_id=req.params.list_id;

      let {error,tasks}=await Service.get_tasks(list_id);

      if (error){apiError_handler(error,res)};
      
      //Hacer good response
      //(res,"",tasks)
      res.status(200).json(response.rows);
}

//post
async function create_list(req,res){
      let {title,color,user_id}=req.body;

      if (!title || !color || !user_id){res.status(400).json({"error":"missing_data"})}
      
      let {error,new_id}=await Service.create_list(title,color,user_id);

      if (error){apiError_handler(error,res)};
      
      //hacer good response
      //(res,"",{id:new_id})
      res.status(201).json({"id":new_id});
}

//put
async function modify_list(req,res){
      let {id,title,color}=req.body;

      let {error}=await Service.modify_list(id,title,color);

      if (error){apiError_handler(error,res)};

      //hacer good response
      //(res,"Updated",)
      res.status(200).json("UPDATED");
}

//delete "/:id"
async function delete_list(req,res){
      let id=req.params.id;

      let {error}=await Service.delete_list(id);

      if (error){apiError_handler(error,res)};

      //hacer good response
      //(res,"Deleted")
      res.status(200).send("DELETED");
}

module.exports={
    get_lists,
    get_tasks,
    create_list,
    modify_list,
    delete_list
}