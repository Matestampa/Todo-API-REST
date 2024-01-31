const {apiError_handler,DFLT_API_ERRORS}=require("../error_handling");
const {normal_response}=require("../middlewares/response.js");  

const Service=require("../services/tasks_Service.js");

//get "/:id"
async function get_taskInfo(req,res){
        let id=req.params.id;

        let {error,task}=await Service.get_taskInfo(id);

        if (error){apiError_handler(error,res);return};
        
        normal_response(res,"",{task:task})
}

//get "/checked/:list_id"
async function get_checkedTasks(req,res){
    let list_id=req.params.list_id;

    let {error,checkedTasks}=await Service.get_checkedTasks(list_id);

    if (error){apiError_handler(error,res);return};
    
    normal_response(res,"",checkedTasks)
}

//post  "/"
async function create_task(req,res){
       let {body,list_id,last_pos}=req.body;
       
       if (!body || !list_id || !last_pos){apiError_handler(DFLT_API_ERRORS.BAD_REQ("Missing data"))}
       
       let {error,data}=await Service.create_task(body,list_id,last_pos);

       if (error){apiError_handler(error,res);return};

       normal_response(res,"",{id:data.new_id, pos:data.pos})

}


//put "/"
async function modify_task(req,res){
    let {body,id}=req.body;

    if (!body || !id){apiError_handler(DFLT_API_ERRORS.BAD_REQ("Missing data"))}

    let {error}=await Service.modify_task(body,id);

    if (error){apiError_handler(error,res);return};
    
    normal_response(res,"Updated")
}

//put "/uncheck"
async function uncheck_task(req,res){
    //Recibe last_pos de las unchecked tasks para poder insertarla debajo de todo
    let {id,last_pos}=req.body;
    
    if (!id || last_pos){apiError_handler(DFLT_API_ERRORS.BAD_REQ("Missing data"))}
     
    let {error,new_pos}=await Service.uncheck_task(id,last_pos);

    if (error){apiError_handler(error,res);return};
    
    
    normal_response(res,"",{new_pos:new_pos})
}

//put "/check"
async function check_task(req,res){
    let {id}=req.body;

    if (!id){apiError_handler(DFLT_API_ERRORS.BAD_REQ("Missing data"))}

    let {error}=await Service.check_task(id);

    if (error){apiError_handler(error,res);return};
    
    normal_response(res,"Checked")
}

//put "/change_order"
async function change_order(req,res){  
    let {id,up_pos,down_pos,list_id}=req.body;
    
    if (!id || !up_pos || !down_pos || !list_id){apiError_handler(DFLT_API_ERRORS.BAD_REQ("Missing data"))}
    
    let {error,data}=await Service.change_order(id,up_pos,down_pos,list_id);

    if (error){apiError_handler(error,res);return};

    normal_response(res,"",{"new_pos":data.new_pos,"re_order":data.re_order,"cant":data.cant})
}

//delete "/:id"
async function delete_task(req,res){
     let id=req.params.id;

     let {error}=await Service.delete_task(id);

     if (error){apiError_handler(error,res);return};

     normal_response(res,"Deleted")
}



module.exports={
    get_taskInfo,
    get_checkedTasks,
    create_task,
    modify_task,
    uncheck_task,
    check_task,
    change_order,
    delete_task
};