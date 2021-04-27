import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery"
import {next, previous} from "../utils/date-time"
import {useHistory} from "react-router-dom"
import ReservationsList from "../reservations/ReservationsList"
import TablesList from "../tables/TablesList"
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
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
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
  async function onClick  ({target}) {
    const tableId = target.id;
    const result = window.confirm("Is this table ready to seat new guests? This cannot be undone.")
    if (result) {
      await fetch(`http://localhost:5000/tables/${tableId}/seat`, {method: 'DELETE'})
      loadDashboard()
    }
    
  }

  useEffect(loadDashboard, [date, reservations.length]);
  function loadDashboard() {
    console.log("loading dashboard")
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError)
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
      {reservations.length ? <ReservationsList reservations={reservations} loadDashboard={loadDashboard}/> : null}
      <ErrorAlert error ={tablesError}/>
      {tables.length ? <TablesList tables={tables} onClick={onClick}/> : null}
    </main>
  );
}

export default Dashboard;
