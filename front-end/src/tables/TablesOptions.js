import React from "react"

const TablesOptions = (tables) => {
    const optionsList = [];
    tables.tables.forEach((table) => {
        optionsList.push(
            <option value={table.table_id}  key={table.table_id}>{table.table_name} - {table.capacity}</option>
        )
    })
    return optionsList;
}

export default TablesOptions;
