const knex = require("../db/connection");
const reservations = knex("reservations")

function list(date) {
    const temp = knex("reservations")
        .where({reservation_date: date})
        .whereNot({status: "finished"})
        .select("*")
        .orderBy("reservation_time");
    return temp;
}

 function search(mobile_number) {
    return knex("reservations")
        .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date");
}
function create(reservation) {
    return reservations.insert(reservation).returning("*")
}

function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({reservation_id})
        .first()
}

function update(updatedStatus) {
    return knex("reservations")
    .select("*")
    .where({reservation_id: updatedStatus.reservation_id})
    .update(updatedStatus, "*")
}

module.exports = {
    create,
    list,
    read,
    update,
    search
}