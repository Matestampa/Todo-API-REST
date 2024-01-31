const {apiError_handler,DFLT_API_ERRORS}=require("../error_handling");
const {normal_response}=require("../middlewares/response.js"); 

const Service=require("../services/tasksList_Service.js");

//get "mylists/:user_id"
async function get_lists(req,res){
      let user_id=req.params.user_id;
      
      //Chequear que el user_id de la session, coincida con el user_id de las lists solicitadas.
      if (req.session.user_id==user_id){
         
         let {error,lists}=await Service.get_lists(user_id);
         
         if (error){apiError_handler(error,res);return}

         //hacer good response
         normal_response(res,"",lists)
      }
      
      //Si no coincide, error
      else{
        apiError_handler(DFLT_API_ERRORS.NOT_AUTH(),res);
      }
}

//get "/:list_id"
async function get_tasks(req,res){
      let list_id=req.params.list_id;

      let {error,tasks}=await Service.get_tasks(list_id);

      if (error){apiError_handler(error,res)};
      
      normal_response(res,"",tasks)
}

//post
async function create_list(req,res){
      let {title,color,user_id}=req.body;

      if (!title || !color || !user_id){apiError_handler(DFLT_API_ERRORS.BAD_REQ("Missing data"))}
      
      let {error,new_id}=await Service.create_list(title,color,user_id);

      if (error){apiError_handler(error,res)};
      
      normal_response(res,"",{id:new_id})
}

//put
async function modify_list(req,res){
      let {id,title,color}=req.body;

      let {error}=await Service.modify_list(id,title,color);

      if (error){apiError_handler(error,res)};

      normal_response(res,"Updated",)
}

//delete "/:id"
async function delete_list(req,res){
      let id=req.params.id;

      let {error}=await Service.delete_list(id);

      if (error){apiError_handler(error,res)};

      normal_response(res,"Deleted")
}

module.exports={
    get_lists,
    get_tasks,
    create_list,
    modify_list,
    delete_list
}