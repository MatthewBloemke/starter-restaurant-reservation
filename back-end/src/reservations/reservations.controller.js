/**
 * List handler for reservation resources
 */
const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
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
  const date = req.query.date;
  const reservations = await service.read(date)
  res.json({
    data: reservations,
  });
}


function hasValidFields(req, res, next) {


  const invalidFields = [];
  if (!req.body.data) {
    next({
      status: 400,
      message: "Data is missing"
    })
  }
  const {data = {}} = req.body;  
  let [ year, month, day ] = data.reservation_date.split("-");
  let testDate = new Date(year, month - 1, day)
  if (!data.first_name) invalidFields.push("first_name");
  if (!data.last_name) invalidFields.push("last_name");
  if (!data.mobile_number) invalidFields.push("mobile_number");
  if (!data.reservation_date || !data.reservation_date.match(dateFormat)) {
    invalidFields.push("reservation_date")
  }
  if (data.reservation_date<today()) {
    return next({
      status:400,
      message: "The reservation must be made for the future"
    })
  }
  if (testDate.getDay() === 2) {
    return next({
      status:400,
      message: "Sorry, we are closed on Tuesdays."
    })
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
  } else if ( data.reservation_time < "10:30") {
    return next({
      status: 400,
      message: "That is before we open"
    })
  } else if (data.reservation_time > "21:30"){
    return next({
      status: 400,
      message: "That is after we close"
    })
  }
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`
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
  } = req.body.data);
  const createdReservation = await service.create(newReservation)
      
  res.status(201).json({data: createdReservation[0]})
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasValidFields, asyncErrorBoundary(create)] ,
};
