import React from "react"

const TablesList = (props) => {
    const {tables, onClick} = props;
    const tablesTable = [];
    tables.forEach(table => {
        const {table_id} = table;
        const tableStatus = table.table_id;
        const capacityId=`capacity${table.table_id}`
        tablesTable.push(
            <tr key={table.table_id}>
                <td>{table.table_name}</td>
                <td id={capacityId}>{table.capacity}</td>
                <td data-table-id-status={tableStatus}>{table.reservation_id ? "Occupied": "Free"}</td>
                <td>{table.reservation_id ? table.reservation_id: "N/A"}</td>
                <td id={table.reservation_id}>{table.reservation_id ? <button id={table_id} onClick={onClick} data-table-id-finish={tableStatus}>Finish</button>:null}</td>
            </tr>            
        )

    })
    return (
        <table>
            <thead>
                <tr key="Header">
                    <th>Table Name</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th>Reservation Id</th>
                </tr>                
            </thead>
            <tbody>
                {tablesTable}
            </tbody>
            
        </table>
    )
}

export default TablesList;