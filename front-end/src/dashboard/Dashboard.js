import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery"
import {next, previous} from "../utils/date-time"
import {useHistory} from "react-router-dom"
import ReservationsList from "../layout/ReservationsList"
import "../dashboard/dashboard.css"
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */


function Dashboard({ date }) {
  const history = useHistory()
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  function nextDate () {
    date = next(date)
    history.push(`/dashboard?date=${date}`)
  }
  function previousDate () {
    date = previous(date)
    history.push(`/dashboard?date=${date}`)
  }
  function toToday() {
    history.push("/dashboard")
  }
  let query = useQuery()
  
  if (query.get("date")) {
    date  = query.get("date")
  }
  //useEffect(dateDisplay(), [date]);

  useEffect(loadDashboard, [date, reservations.length]);
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    if (!reservations.length) setReservationsError({message: "No reservations today"})
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>        
      <button className="btn btn-info" onClick={previousDate}>Previous Day</button>
      <button className="btn btn-info" onClick={toToday}>Today</button>
      <button className="btn btn-info" onClick={nextDate}>Next Day</button> <br/>
      <div className="d-md-flex mb-3">
      <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {reservations.length ? <ReservationsList reservations={reservations}/> : null}
    </main>
  );
}

export default Dashboard;
