const knex = require("../db/connection");

function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name")
}
function create(newTable) {
    return knex("tables")
        .insert(newTable)
        .returning("*")
}

function read(table_id) {
    return knex("tables")
    .select("*")
    .where({table_id})
    .first()
}
function update(updatedTable) {
    return knex("tables")
        .select("*")
        .where({table_id: updatedTable.table_id})
        .update(updatedTable, "*")
}
function destroyAssignment(reservation_id) {
    return knex("tables")
        .where({reservation_id})
        .update({reservation_id: null})
}
module.exports = {
    list,
    create,
    update,
    read,
    destroyAssignment
}