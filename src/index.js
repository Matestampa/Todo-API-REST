const {App}=require("./app.js");

const {APP_CONN_VARS}=require("./config/app_config.js");

const PORT=APP_CONN_VARS.PORT;

App.listen(PORT,()=>{console.log(`Running on port:${PORT}`)});
