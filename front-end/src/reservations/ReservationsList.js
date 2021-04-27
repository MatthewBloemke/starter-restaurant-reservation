import React from "react"

const ReservationsList = (props) => {
    const {reservations, page} = props
    const reservationsTable = [];
    async function handleCancel({target}) {
        const result = window.confirm("Do you want to cancel this reservation? This cannot be undone")
        if (result) {
            const requestOptions = {
                method:'PUT',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({data: {status: "cancelled"}})
            }
            await fetch(`http://localhost:5000/reservations/${target.id}/status`, requestOptions)
            if (props.loadDashboard)props.loadDashboard();
            if (props.loadResults)props.loadResults();
        }
    }
    reservations.forEach((reservation) => {
        let tempTime;
        const hrefUrl = `/reservations/${reservation.reservation_id}/seat`
        if (reservation.reservation_time>"01:00:00") {
            tempTime = reservation.reservation_time.slice(0,2) - 12;
            tempTime = tempTime + `${reservation.reservation_time.slice(2,5)}pm`
        } else if (reservation.reservation_time > "12:00:00" && reservation.reservation_time < "01:00:00") {
            tempTime = `${reservation.reservation_time.slice(0,5)}pm`
        } else {
            tempTime = `${reservation.reservation_time.slice(0,5)}am`
        }
        
        if (reservation.status !== "finished" && reservation.status !== "cancelled") {
            let seatButton = null
            if (reservation.status === "booked" && page!=="search") {
                seatButton = <td><button><a href={hrefUrl}>Seat</a></button></td>;
            }
            const url = `/reservations/${reservation.reservation_id}/edit`
            reservationsTable.push(
                <tr key={reservation.reservation_id}>
                    <td>{reservation.first_name}</td>
                    <td>{reservation.last_name}</td>
                    <td>{reservation.mobile_number}</td>
                    <td>{reservation.reservation_date}</td>
                    <td>{tempTime}</td>
                    <td>{reservation.people}</td>
                    
                    <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
                    <td><button><a href={url}>Edit</a></button></td>
                    <td><button id={reservation.reservation_id} data-reservation-id-cancel={reservation.reservation_id} onClick={handleCancel}>Cancel</button></td>
                    {seatButton}
                </tr>
            )            
        }

    })
    return (
        <table>
            <thead>
                <tr key="Header">
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Mobile Number</th>
                    <th>Reservation Date</th>
                    <th>Reservation Time</th>
                    <th>Party Size</th>
                    <th>Reservation Status</th>
                </tr>                
            </thead>
            <tbody>
               {reservationsTable} 
            </tbody>
            
        </table>
    )
}





export default ReservationsList