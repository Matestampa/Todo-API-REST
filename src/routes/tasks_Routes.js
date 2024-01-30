const {Router}=require("express");
const router=Router();

const Controler=require("../controllers/tasks_Controler");

//Traer info de una task
router.get("/t",Controler.test);

//Traer data particular de una task (no operativo por el momento)
router.get("/:id",Controler.get_taskInfo);

//Traer task ya checked
router.get("/checked/:list_id",Controler.get_checkedTasks);

//Crear task
router.post("/",Controler.create_task);

//Modificar task
router.put("/",Controler.modify_task);

//Check 
router.put("/check",Controler.check_task);

//Uncheck
router.put("/uncheck",Controler.uncheck_task);

//Cambiar orden entre 2 tasks
router.put("/change_order",Controler.change_order);

//Eliminar task
router.delete("/:id",Controler.delete_task);


module.exports=router;