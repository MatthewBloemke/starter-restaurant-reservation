import React, {useState} from "react"
import {useHistory} from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert"

const NewTable = () => {
    const {REACT_APP_API_BASE_URL} = process.env
    const history = useHistory();
    const initialFormState = {
        table_name: "",
        capacity: "",
    }
    const [errorMessage, setErrorMessage] = useState(null);
    const [formData, setFormData] = useState({...initialFormState});
    const cancel = () => {
        history.goBack();
    }
    const handleChange = ({target}) => {
        let value = "";
        if (target.name === "capacity") {
            value = Number(target.value)
        } else {
            value = target.value;      
        }
        setFormData({
            ...formData,
            [target.name]:value,
        })
    }
    async function handleSubmit (event) {
        event.preventDefault();
        if (formData.table_name.length < 2) {
            setErrorMessage({message: "Table name invalid."})
        } else if (!formData.capacity || formData.capacity < 1) {
            setErrorMessage({message: "Invalid capacity"})
        } else {
            if (!errorMessage) {
                const requestOptions = {
                    method: 'POST',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({data: formData})
                }
                await fetch(`${REACT_APP_API_BASE_URL}/tables`, requestOptions)
                console.log(formData)
                history.push("/dashboard")
            }
        }
        
    }
    return (
        <main>
            <h1>New Table</h1>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-3">
                        <label htmlFor="table_name">Table Name</label> <br/>
                        <label htmlFor="capacity">Capacity</label>
                    </div>
                    <div className="col-3">
                        <input onChange={handleChange} value={formData.table_name} type="text" name="table_name"/>
                        <input onChange={handleChange} value={formData.capacity} type="number" name="capacity"/>
                    </div>
                </div>
                <button type="submit" className="btn btn-success">Submit</button>
                <button type="button" className="btn btn-danger" onClick={cancel}>Cancel</button>                  
            </form>
            <ErrorAlert error={errorMessage}/>
        </main>

    )
}

export default NewTable;