const {pool}=require("./db/postgres.js");

const {DFLT_API_ERRORS,INTERNAL_ERRORS}=require("../error_handling");

const {ORDER_SCALE}=require("./const_vars/tasks_constVars.js");

//get "/:id"
async function get_taskInfo(id){
        let response;
        try{
            response=await pool.query("SELECT * FROM tasks WHERE id=$1",[id]); 
        }
        catch(e){
            return {error:INTERNAL_ERRORS.DB("",e),task:null}
        }
        
        let task=response.rows[0];
        
        return {error:null,task:task};
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


//get "/checked/:list_id"
async function get_checkedTasks(list_id){
    let response;

    try{
        response=await pool.query(`SELECT * FROM tasks WHERE list_id=$1 and checked=true ORDER BY completed`,[list_id]);
    }
    catch(e){
        return {error:INTERNAL_ERRORS.DB("",e),checkedTasks:null}
    }

    let checkedTasks=response.rows;

    return {error:null ,checkedTasks:checkedTasks};

}

//post  "/"
async function create_task(body,list_id,last_pos){
       
       let checked=false;
       
       let new_pos=last_pos+ORDER_SCALE;
       
       let response;
       try{
         response=await pool.query(`INSERT INTO tasks(body,checked,list_id,pos) VALUES($1,$2,$3,$4)
                             RETURNING id`,[body,checked,list_id,new_pos]);
 
       }
       catch(e){
         return {error:INTERNAL_ERRORS.DB("",e),data:null}
       }
       
       let newTask_id=response.rows[0].id;

       return {error:undefined, data:{new_id:newTask_id,new_pos:new_pos} };

}


//put "/"
async function modify_task(body,id){
    
    let response;
    try{
        response=await pool.query("UPDATE tasks SET body=$1 WHERE id=$2",[body,id]);
    }
    catch(e){
        return {error:INTERNAL_ERRORS.DB("",e)}
    }

    return {}
}

//put "/uncheck"
async function uncheck_task(id,last_pos){
    let checked=false;
    
    //Generamos la nueva pos
    let new_pos=last_pos+ORDER_SCALE;

    let response;
    try{
        response=await pool.query(`UPDATE tasks SET checked=$1, pos=$2, completed=null
                     WHERE id=$3`,[checked,new_pos,id]);
    }
    catch(e){
        return {error:INTERNAL_ERRORS.DB("",e),new_pos:null}
    }
    
    return {error:null,new_pos:new_pos};
}

//put "/check"
async function check_task(id){
    
    let checked=true;
    
    try{
        await pool.query(`UPDATE TASKS SET checked=$1, completed=CURRENT_DATE
                     WHERE id=$2`,[checked,id]);
    }
    catch(e){
        return {error:INTERNAL_ERRORS.DB("",e)}
    }
    
    return {}
}

//put "/change_order"
async function change_order(id,up_pos,down_pos,list_id){  
    let new_pos;
    let re_order=false;
    
    //Si se inserta abajo de todo
    if (down_pos=="end"){
        new_pos=up_pos+ORDER_SCALE
    }
    else{//Si se inserta en cualquier otro lado
        new_pos=parseInt((up_pos+down_pos)/2);
        
        //Primero nos fijamos si es que hay conflicto de lugar
        if (new_pos==up_pos || new_pos==down_pos){
            re_order=true;
            //Incrementamos "la pos" del de abajo
            down_pos+=ORDER_SCALE;
            //Generamos la nueva pos para la task que metemos
            new_pos=parseInt((up_pos+down_pos)/2);
        }
    
    }

    //Actualizamos la db
    try{
        //Si hay "conflicto"
        if (re_order){
            //Aumentamos la pos de todas las que tengan posicion mayor a "up_pos"
            await pool.query(`UPDATE tasks SET pos=pos+$1 WHERE list_id=$2 
            AND pos>$3`,[ORDER_SCALE,list_id,up_pos]);
        }
        
        //Updateamos la pos de la task que metemos
        await pool.query(`UPDATE tasks set pos=$1 WHERE id=$2`,[new_pos,id]);
    }
    catch(e){
        return {error:INTERNAL_ERRORS.DB("",e),data:null};
    }
    
    return {error:null, data:{"new_pos":new_pos,"re_order":re_order,"cant":re_order?ORDER_SCALE:null}}
}

//delete "/:id"
async function delete_task(id){
     
    try{
        await pool.query("DELETE FROM tasks WHERE id=$1",[id]);
    }
    catch(e){
        return {error:INTERNAL_ERRORS.DB("",e)}
    }
    
    return {};
}

module.exports={
    get_taskInfo,
    get_tasks,
    get_checkedTasks,
    create_task,
    modify_task,
    uncheck_task,
    check_task,
    change_order,
    delete_task
};