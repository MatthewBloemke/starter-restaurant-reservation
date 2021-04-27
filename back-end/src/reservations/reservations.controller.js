/**
 * List handler for reservation resources
 */
const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const dateFormat = /\d\d\d\d-\d\d-\d\d/;
const timeFormat = /\d\d:\d\d/;
const today = () => {
  const today = new Date();
  return `${today.getFullYear().toString(10)}-${(today.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${today.getDate().toString(10).padStart(2, "0")}`;
}
const now = () => {
  const now = new Date();
  return now.getHours() + ":" + now.getMinutes();
}
const validFields = [
  "first_name",
  "last_name",
  "reservation_time",
  "reservation_date",
  "mobile_number",
  "people"
];
async function list(req, res) {
  let reservations = [];
  if (req.query.date) {
    const date = req.query.date;
    reservations = await service.list(date)    
  } else if (req.query.mobile_number) {
    const mobile_number = req.query.mobile_number;
    reservations = await service.search(mobile_number)
  }

  res.json({
    data: reservations,
  });
}


function hasValidFields(req, res, next) {
  const invalidFields = [];
  let testDate = new Date();
  if (!req.body.data) {
    next({
      status: 400,
      message: "Data is missing"
    })
  }
  let {data = {}} = req.body;
  if (!data.status) data.status = "booked";
  if (data.reservation_date) {
    if (data.reservation_date.length==="") {
      invalidFields.push("reservation_date")
    }
    let [ year, month, day ] = data.reservation_date.split("-");
    testDate = new Date(year, month - 1, day)    
  }

  if (!data.first_name) invalidFields.push("first_name");
  if (!data.last_name) invalidFields.push("last_name");
  if (!data.mobile_number) invalidFields.push("mobile_number");
  if (data.status !== "booked") return next({status:400, message:`Table cannot already be ${data.status}`})
  if (!data.reservation_date || !data.reservation_date.match(dateFormat)) {
    invalidFields.push("reservation_date")
  }

  if (!data.reservation_time || !data.reservation_time.match(timeFormat)) {
    invalidFields.push("reservation_time")
  }
  if (!Number(data.people) || typeof(data.people) === "string") {
    invalidFields.push("people")
  }
  if (data.reservation_date === today() && data.reservation_time <= now()) {
    return next({
      status: 400,
      message:"You cannot schedule a reservation for the past."
    })
  } else if ( data.reservation_time < "10:30" || data.reservation_time > "21:30") {
    invalidFields.push("reservation_time")
  }
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`
    })
  }  
  if (data.reservation_date<today()) {
    next({status: 400, message:"Reservation must be for the future"})
  }
  if (testDate.getDay() === 2) {
    return next({
      status:400,
      message: "Sorry, we are closed on Tuesdays."
    })
  }
  next()
}

async function create(req, res) {
  const newReservation = ({
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status
  } = req.body.data);
  const createdReservation = await service.create(newReservation)
  res.status(201).json({data: createdReservation[0]})
}

async function reservationExists (req, res, next) {
  const reservation = await service.read(req.params.reservationId)

  if (reservation) {
    res.locals.reservation = reservation;
    return next()
  }
  next({status: 404, message: `Reservation ${req.params.reservationId} not found`})
}
function read(req, res) {
  res.json({data: res.locals.reservation})
}

async function updateStatus(req, res) {
  const {data = {}} = req.body;
  const newStatus = {
    reservation_id: req.params.reservationId,
    status: data.status
  }
  await service.update(newStatus)
  res.status(200).json({data: {status: data.status}})
}

async function validStatusUpdate(req, res, next) {
  const {data ={}} = req.body;
  if (data.status==="unknown") return next({status: 400, message: "Status cannot be unknown"})
  if (res.locals.reservation.status ==="finished") return next({status: 400, message: "finished reservation cannot be updated"})
  next();
}
async function update (req, res) {
  const reservation = {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status
  } = req.body.data
  
  const updatedReservation = await service.update(reservation)
  res.status(200).json({data: updatedReservation[0]})
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasValidFields, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [asyncErrorBoundary(reservationExists),asyncErrorBoundary(hasValidFields), asyncErrorBoundary(update)],
  updateStatus: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(validStatusUpdate), asyncErrorBoundary(updateStatus)]
};
