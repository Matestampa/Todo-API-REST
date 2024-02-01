const {Router}=require("express");
const router=Router();

const Controler=require("../controllers/tasksList_Controler.js");

//Traer todas las lists de un user
router.get("/mylists/:user_id",Controler.get_lists);

//Traer las tasks de una list (las no checked todavia)
router.get("/:list_id",Controler.get_tasks);

//Crear una list
router.post("/",Controler.create_list);

//Modificar la data de una list
router.put("/",Controler.modify_list);

//Eliminar list
router.delete("/:id",Controler.delete_list);




module.exports=router;