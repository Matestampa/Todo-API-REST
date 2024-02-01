const {Router}=require("express");
const router=Router();

const Controler=require("../controllers/lists_Controler.js");

//Traer todas las lists de un user
router.get("/mylists/:user_id",Controler.get_lists);

//Crear una list
router.post("/",Controler.create_list);

//Modificar la data de una list
router.put("/",Controler.modify_list);

//Eliminar list
router.delete("/:id",Controler.delete_list);




module.exports=router;