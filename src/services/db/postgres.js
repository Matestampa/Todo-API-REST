//------------------- INICIACION DE CLASES PARA INTERACTUAR CON POSTGRES ------------------------------------
//-------------------------------  Y COSAS RELACIONADAS    -----------------------------

const {Pool}=require("pg");

const pool=new Pool({
    user:"postgres",
    password:"postgres",
    host:"localhost",
    port:"5432",
    database:"todo",
    idleTimeoutMillis:0
});

module.exports={pool};