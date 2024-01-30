//------------------- INICIACION DE CLASES PARA INTERACTUAR CON POSTGRES ------------------------------------
//-------------------------------  Y COSAS RELACIONADAS    -----------------------------

const {Pool}=require("pg");
const POSTGRES_CONFIG=require("../../config/postgres_config.js");

const pool=new Pool(POSTGRES_CONFIG);

module.exports={pool};