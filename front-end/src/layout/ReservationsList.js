import React from "react"

const ReservationsList = (reservations) => {
    const reservationsTable = [];
    reservations.reservations.forEach((reservation) => {
        let tempTime;
        if (reservation.reservation_time>"12:00") {
            tempTime = reservation.reservation_time.slice(0,2) - 12;
            tempTime = tempTime + `${reservation.reservation_time.slice(2,5)}pm`
        } else {
            tempTime = `${reservation.reservation_time.slice(0,5)}am`
        }
        reservationsTable.push(
            <tr key={reservation.reservation_id}>
                <td>{reservation.first_name}</td>
                <td>{reservation.last_name}</td>
                <td>{reservation.mobile_number}</td>
                <td>{reservation.reservation_date}</td>
                <td>{tempTime}</td>
                <td>{reservation.people}</td>
            </tr>
        )
    })
    return (
        <table>
            <tr key="Header">
                <th>First Name</th>
                <th>Last Name</th>
                <th>Mobile Number</th>
                <th>Reservation Date</th>
                <th>Reservation Time</th>
                <th>Party Size</th>
            </tr>
            {reservationsTable}
        </table>
    )
}





export default ReservationsList