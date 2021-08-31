import knexfile from "./knexfile";
const knex = require("knex")(knexfile);
export default knex;
