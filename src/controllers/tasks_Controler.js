const {pool}=require("./db/connection.js");
const ORDER_SCALE=1000; //escala usada para aumentar la column "pos"(posicion de la task)

//get "/:id"
async function get_task(req,res){
        let id=req.params.id;

        let response=await pool.query("SELECT * FROM tasks WHERE id=$1",[id]);

        res.status(200).json(response.rows[0]);
}

//get "/checked/:list_id"
async function get_checkedTasks(req,res){
    let list_id=req.params.list_id;

    let response=await pool.query(`SELECT * FROM tasks WHERE list_id=$1 and checked=true ORDER BY completed`,[list_id]);

    res.status(200).json(response.rows);
}

//post  "/"
async function create_task(req,res){
       let {body,list_id,last_pos}=req.body;
       
       if (!body || !list_id || !last_pos){res.status(400).json({"error":"missing_data"})}
       
       let checked=false;
       
       let new_pos=last_pos+ORDER_SCALE;

       let response=await pool.query(`INSERT INTO tasks(body,checked,list_id,pos) VALUES($1,$2,$3,$4)
       RETURNING id`,[body,checked,list_id,new_pos]);

       let new_id=response.rows[0].id;

       res.status(201).json({"id":new_id,"pos":new_pos});

}


//put "/"
async function modify_task(req,res){
    let {body,id}=req.body;

    if (!body || !id){res.status(400).json({"error":"missing_data"})}
    
    await pool.query("UPDATE tasks SET body=$1 WHERE id=$2",[body,id]);

    res.status(200).send("UPDATED");
}

//put "/uncheck"
async function uncheck_task(req,res){
    //Recibe last_pos de las unchecked tasks para poder insertarla debajo de todo
    let {id,last_pos}=req.body;
    
    if (!id || last_pos){res.status(400).json({"error":"missing_data"})}

    let check=false;
    
    //Generamos la nueva pos
    let new_pos=last_pos+ORDER_SCALE;
    
    await pool.query(`UPDATE tasks SET checked=$1, pos=$2, completed=null
                      WHERE id=$3`,[check,new_pos,id]);
    
    res.status(200).json({"new_pos":new_pos});
}

//put "/check"
async function check_task(req,res){
    let {id}=req.body;

    if (!id){res.status(400).json({"error":"missing_data"})}

    let check=true;

    await pool.query(`UPDATE TASKS SET checked=$1, completed=CURRENT_DATE
                     WHERE id=$2`,[check,id]);
    
    res.status(200).send("checked");
}

//put "/change_order"
async function change_order(req,res){  
    let {id,up_pos,down_pos,list_id}=req.body;
    
    if (!id || !up_pos || !down_pos || !list_id){res.status(400).json({"error":"missing_data"})}

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
            //Incrementamos la pos del de abajo
            down_pos+=ORDER_SCALE;
            //Generamos la nueva pos para la task que metemos
            new_pos=parseInt((up_pos+down_pos)/2);
            //Aumentamos en la base de datos todos los que tengan posicion mayor al de arriba
            await pool.query(`UPDATE tasks SET pos=pos+$1 WHERE list_id=$2 
                             AND pos>$3`,[ORDER_SCALE,list_id,up_pos]);
        }
    
    }
    
    
    //Luego updateamos la pos en la bd de la task que metemos
    await pool.query(`UPDATE tasks set pos=$1 WHERE id=$2`,[new_pos,id]);
    
    res.status(204).json({"new_pos":new_pos,"re_order":re_order,"cant":re_order?ORDER_SCALE:null});
}

//delete "/:id"
async function delete_task(req,res){
     let id=req.params.id;

     await pool.query("DELETE FROM tasks WHERE id=$1",[id]);

     res.status(200).send("DELETED");
}

async function test(req,res){
    return res.status(400).json(new Error("asa"));
}

module.exports={
    get_task,get_checkedTasks,create_task,modify_task,uncheck_task,check_task,change_order,delete_task,
    test
};