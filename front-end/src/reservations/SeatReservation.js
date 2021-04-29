import React, {useEffect, useState, } from "react";
import {useParams, useHistory} from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert";
import {listTables, listSingleRes} from "../utils/api"
import TablesOptions from "../tables/TablesOptions"
import "./seatReservation.css"

const SeatReservation = () => {
    const {REACT_APP_API_BASE_URL} = process.env
    const history = useHistory()
    let tempTime
    const params = useParams()
    const [tables, setTables] = useState([])
    const [tablesError, setTablesError] = useState(null);
    const [reservation, setReservation] = useState([])
    const [selectedTable, setSelectedTable] = useState([]);
    const [reservationError, setReservationError] = useState(null)
    useEffect(loadTables, [params.reservation_id])
    function loadTables() {
        const abortController = new AbortController();
        listTables(abortController.signal)
            .then(setTables)
            .catch(setTablesError)
        listSingleRes(params.reservation_id, abortController.signal)
            .then(setReservation)
            .catch(setReservationError)


        return () => abortController.abort();
    }
    if (reservation.reservation_time){
        if (reservation.reservation_time>"12:00") {
            tempTime = reservation.reservation_time.slice(0,2) - 12;
            tempTime = tempTime + `${reservation.reservation_time.slice(2,5)}pm`
        } else {
            tempTime = `${reservation.reservation_time.slice(0,5)}am`
        }    
    }

    const handleChange = ({target}) => {
        setSelectedTable(target.value);
        setTablesError(null)
    }
    async function handleSubmit (event) {
        event.preventDefault();
        const table = tables.find((table) => table.table_id===Number(selectedTable))
        if (reservation.people > table.capacity) {
            setTablesError({message: "Too many people for that table"})
        } else if (table.reservation_id){
            setTablesError({message: "That table is occupied"})
        } else {
            const seatOptions = {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({data: {
                    reservation_id: reservation.reservation_id,
                }})
            }
            await fetch(`${REACT_APP_API_BASE_URL}/tables/${table.table_id}/seat`, seatOptions)
            history.push("/dashboard")
        }

    }
    return (
        <main>
            <h1>Choose a table to seat Reservation {params.reservation_id} at.</h1>
            <ErrorAlert error={tablesError}/>
            <ErrorAlert error={reservationError}/>
            <div className="reservations">
                <div className="alert alert-secondary singleRes" key={reservation.reservation_id}>
                    <div className="resContainers">
                        <h5>{reservation.first_name} {reservation.last_name}</h5>
                                                
                    </div>
                    <div className="resContainers">
                        <p><img src="https://img.icons8.com/android/20/000000/phone.png" alt="phone"/> {reservation.mobile_number}</p>
                        <p><img src="https://img.icons8.com/metro/20/000000/date-to.png" alt="date"/> {reservation.reservation_date}</p>            
                    </div>
                    <div className="resContainers">
                        <p><img src="https://img.icons8.com/metro/20/000000/time.png" alt="time"/> {tempTime}</p> <br/>            
                        <p><img src="https://img.icons8.com/material-sharp/20/000000/conference-call.png" alt="capacity"/> {reservation.people}</p>               
                    </div>
                    <div className="resContainers">              
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <select className="form-select form-select-lg" aria-label="disabled .form-select-lg example" onChange={handleChange} name="table_id">
                    <option>Select Table</option>
                    <TablesOptions tables={tables}/>
                </select> <br/>
                <button type="submit" className="btn btn-success">Submit</button>               
            </form>

        </main>

    )
}

export default SeatReservation;