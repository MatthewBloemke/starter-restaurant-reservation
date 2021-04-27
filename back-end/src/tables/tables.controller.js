const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require('./tables.service')
const reservationService = require("../reservations/reservations.service")

const validFields = [
    "table_name",
    "capacity",
];

async function list(req, res) {
    const tables = await service.list()
    res.json({data: tables})
}
async function tableExists(req, res, next) {
    const table_id = req.params.table_id;
    const table = await service.read(table_id);
    if (table) {
        if (!table.reservation_id) {
            return next({status:400, message: "Table is not occupied!"});
        }

        res.locals.reservation_id = table.reservation_id;
        res.locals.table = table;
        return next();
    }
    next({status: 404, message: `Table ${table_id} not found`})
}

async function destroy(req, res) {
    await service.destroyAssignment(res.locals.reservation_id)
    const newStatus = {
        reservation_id: res.locals.reservation_id,
        status: "finished"
    }
    await reservationService.update(newStatus)
    res.sendStatus(200)
}
function hasValidFields (req, res, next) {
    const invalidFields = [];
    if (!req.body.data) {
        next({
            status: 400,
            message: "Data is missing"
        })
    }
    const {data ={}} = req.body;
    if (!data.table_name) {
        invalidFields.push("table_name")
    } else if (data.table_name.length < 2 ) {
        invalidFields.push("table_name")
    };
    if (!data.capacity) {
        invalidFields.push("capacity")
    }
    if (invalidFields.length) {
        return next({
          status: 400,
          message: `Invalid field(s): ${invalidFields.join(", ")}`
        })
    }
    next()
}
async function create (req, res) {
    console.log("creating")
        const newTable = ({
            table_name,
            capacity,
        } = req.body.data);  
    const createdTable = await service.create(newTable)
    res.status(201).json({data: createdTable[0]})
}

async function isValidUpdate  (req, res, next)  {
    if (!req.body.data) {
        next({
            status: 400,
            message: "Data is missing"
        })
    }
    const {data = {}} = req.body;
    if (!data.reservation_id) next({status:400, message: "Missing reservation_id"})
    const reservation = await reservationService.read(data.reservation_id)
    const table = await service.read(req.params.table_id)
    if (!reservation) {
      next({status: 404, message: `Reservation ${data.reservation_id} not found.`})
    }
    if (reservation.status === "seated") {
        next({status: 400, message:"Table already seated"})
    }
    if (Number(table.capacity) < Number(reservation.people)) {
        next({status:400, message: "Table already at capacity"})
    }
    if (table.reservation_id) next({status:400, message: "Table already occupied"})
    res.locals.reservation_id = data.reservation_id
    next()
}
async function update (req, res) {
    const updatedTable = {
        reservation_id: res.locals.reservation_id,
        table_id: req.params.table_id
    }
    
    const newStatus = {
        reservation_id: res.locals.reservation_id,
        status: "seated"
    }
    await reservationService.update(newStatus)
    const data = await service.update(updatedTable);
    res.json({data})
}

module.exports = {
    list: [asyncErrorBoundary(list)],
    create: [hasValidFields, asyncErrorBoundary(create)],
    update: [asyncErrorBoundary(isValidUpdate), asyncErrorBoundary(update)],
    destroy: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy), ]
}