import React, {useState} from "react"
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";
import {listResByPhone} from "../utils/api"

function Search() {
    const [input, setInput] = useState("")
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);
    async function handleSubmit(event) {
        event.preventDefault()
        setReservationsError(null)
        loadResults()        

    }

    function loadResults() {
        const abortController = new AbortController();
        listResByPhone(input, abortController.signal)
            .then(response => {
                console.log(response)
                if (response.length===0) {
                    setReservationsError({message: "No reservations found"})
                    setReservations([])
                } else {
                    setReservations(response)
                }
            })
            .catch(setReservationsError) 
    }
    const handleChange = ({target}) => {
        setInput(target.value)
    }
    return (
        <main>
            <h1>Search by Phone number</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="mobile_number">Enter a customer's phone number:</label> <br/>
                <input onChange={handleChange} name="mobile_number" /> <br/>
                <button className="btn btn-success" type="submit">Find</button>                
            </form>
            <ErrorAlert error={reservationsError}/>
            {reservations.length ? <ReservationsList reservations={reservations} page="search" loadResults={loadResults}/> : null}
        </main>

    )
}

export default Search