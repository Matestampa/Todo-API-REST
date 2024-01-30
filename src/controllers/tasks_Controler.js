const Service=require("../services/tasks_Service.js");

//get "/:id"
async function get_taskInfo(req,res){
        let id=req.params.id;

        let {error,task}=await Service.get_taskInfo(id);
        
        //Return good response
        //(res,"", {task:task})
        res.status(200).json(response.rows[0]);
}

//get "/checked/:list_id"
async function get_checkedTasks(req,res){
    let list_id=req.params.list_id;

    let {error,checkedTasks}=await Service.get_checkedTasks(list_id);
    
    //Return good response
    //(res,"",checkedTasks)
    res.status(200).json(response.rows);
}

//post  "/"
async function create_task(req,res){
       let {body,list_id,last_pos}=req.body;
       
       if (!body || !list_id || !last_pos){res.status(400).json({"error":"missing_data"})}
       
       let {error,data}=await Service.create_task(body,list_id,last_pos);

       //Return good response
       //(res,"",{id:data.new_id, pos:data.pos})
       res.status(201).json({"id":new_id,"pos":new_pos});

}


//put "/"
async function modify_task(req,res){
    let {body,id}=req.body;

    if (!body || !id){res.status(400).json({"error":"missing_data"})}

    let {error}=await Service.modify_task(body,id);
    
    //hacer good response
    //(res,"Updated")
    res.status(200).send("UPDATED");
}

//put "/uncheck"
async function uncheck_task(req,res){
    //Recibe last_pos de las unchecked tasks para poder insertarla debajo de todo
    let {id,last_pos}=req.body;
    
    if (!id || last_pos){res.status(400).json({"error":"missing_data"})}
     
    let {error,new_pos}=await Service.uncheck_task(id,last_pos);
    
    //hacer good response
    //(res,"",{new_pos:new_pos})
    res.status(200).json({"new_pos":new_pos});
}

//put "/check"
async function check_task(req,res){
    let {id}=req.body;

    if (!id){res.status(400).json({"error":"missing_data"})}

    let {error}=await Service.check_task(id);
    
    //hacer good response
    //(res,"Checked")
    res.status(200).send("checked");
}

//put "/change_order"
async function change_order(req,res){  
    let {id,up_pos,down_pos,list_id}=req.body;
    
    if (!id || !up_pos || !down_pos || !list_id){res.status(400).json({"error":"missing_data"})}
    
    let {error,data}=await Service.change_order(id,up_pos,down_pos,list_id);

    //hacer good response
    //(res,"",{"new_pos":data.new_pos,"re_order":data.re_order,"cant":data.cant})
    res.status(204).json({"new_pos":new_pos,"re_order":re_order,"cant":re_order?ORDER_SCALE:null});
}

//delete "/:id"
async function delete_task(req,res){
     let id=req.params.id;

     let {error}=await Service.delete_task(id);

     
     //hacer good response
     //(res,"Deleted")
     res.status(200).send("DELETED");
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