//------------------- INICIACION DE CLASES PARA INTERACTUAR CON POSTGRES ------------------------------------
//-------------------------------  Y COSAS RELACIONADAS    -----------------------------

const {Pool}=require("pg");
const {POSTGRES_CONN_VARS,POSTGRES_POOL_VARS}=require("../../config/postgres_config.js");

const pool=new Pool({
    ...POSTGRES_CONN_VARS,
    ...POSTGRES_POOL_VARS
});
    
module.exports={pool};