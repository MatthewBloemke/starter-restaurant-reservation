const knex = require("../db/connection");
const reservations = knex("reservations")

function read(date) {
    const temp = knex("reservations")
        .where({reservation_date: date})
        .select("*")
        .orderBy("reservation_time");
    return temp;
}


function create(reservation) {
    return reservations.insert(reservation).returning("*")
}

module.exports = {
    create,
    read,
}