const {POSTGRES_CONN_VARS}=require("./app_config.js");

const POSTGRES_CONFIG={
    ...POSTGRES_CONN_VARS,
    database:"todo",
    idleTimeoutMillis:0
};

module.exports=POSTGRES_CONFIG;