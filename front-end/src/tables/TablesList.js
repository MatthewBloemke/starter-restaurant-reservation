import React from "react"

const TablesList = (props) => {
    const {tables, onClick} = props;
    const tablesTable = [];
    tables.forEach(table => {
        const {table_id} = table;
        const tableStatus = table.table_id;
        const resId = `Id: ${table.reservation_id}`
        tablesTable.push(
            <div className="alert alert-secondary singleTable" key={table.table_id}>
                <h5>{table.table_name}</h5>
                <p><img src="https://img.icons8.com/material-sharp/20/000000/conference-call.png" alt="capacity"/> {table.capacity}</p> <br/>
                <p data-table-id-status={tableStatus}>{table.reservation_id ? "Occupied": "Free"}</p>
                <p>{table.reservation_id ? resId : "N/A"}</p> <br/>
                {table.reservation_id ? <button className="btn btn-warning" id={table_id} onClick={onClick} data-table-id-finish={tableStatus}>Finish</button>:null}
            </div>  
        )

    })
    return (
        <div className="tables">
            {tablesTable}
        </div>
    )
}

export default TablesList;