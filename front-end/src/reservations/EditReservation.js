import React, { useEffect, useState } from "react";
import {useHistory, useParams} from "react-router-dom"
import {now, today, } from "../utils/date-time"
import ErrorAlert from "../layout/ErrorAlert"
import { listSingleRes } from "../utils/api";

function EditReservation () {
    const {REACT_APP_API_BASE_URL} = process.env
    console.log(REACT_APP_API_BASE_URL)
    const params = useParams()
    const history = useHistory()
    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
        status: "booked"
    }
    const [errorMessage, setErrorMessage] = useState(null);
    const [formData, setFormData] = useState({...initialFormState});
    const handleChange = ({target}) => {
        let value = "";
        if (target.name === "people") {
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
        const errorList = [];
        const invalidFields = []
        event.preventDefault();
        if (!formData.first_name) invalidFields.push("first_name");
        if (!formData.last_name) invalidFields.push("last_name");
        if (!formData.mobile_number) invalidFields.push("mobile_number");
        if (!formData.reservation_date ) {
          invalidFields.push("reservation_date")
        }
        if (!formData.reservation_time) {
          invalidFields.push("reservation_time")
        }
        if (!formData.people) {
          invalidFields.push("people")
        }
        if (formData.reservation_date === today() && formData.reservation_time <= now()) {
            errorList.push({message: "Reservations cannot be made for the past"})
        } else if (formData.reservation_time < "10:30") {
            errorList.push({message: "That reservation is before we are open"})
        } else if (formData.reservation_time > "21:30") {
            errorList.push({message: "That reservation is after we close"})
        }        
        let [ year, month, day ] = formData.reservation_date.split("-");
        let testDate = new Date(year, month - 1, day)
        if (formData.reservation_date<today() && testDate.getDay() === 2) {
            setErrorMessage({message: "Reservation cannot be in the past! Reservations cannot be made for Tuesday."})
        } else if (formData.reservation_date<today()) {
            setErrorMessage({message: "Reservation cannot be in the past!"})
        } else if (testDate.getDay() === 2) {
            setErrorMessage({message: "Reservations cannot be made for Tuesday."})
        } else {
            setErrorMessage(null)
        }
        if (errorList.length) {
            setErrorMessage(errorList[0])
            return null;
        } else if (invalidFields.length ) {
            setErrorMessage({message: `Invalid field(s): ${invalidFields.join(", ")}`})
        } else {
            if (!errorMessage) {
                const requestOptions = {
                    method:'PUT',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({data: formData})
                }
                
                await fetch(`${REACT_APP_API_BASE_URL}/reservations/${formData.reservation_id}`, requestOptions)

                console.log("submitted")
                history.push(`/dashboard?date=${formData.reservation_date}`);
            }

        }
    }
    const cancel = () => {
        history.goBack();
    }
    useEffect(() => {
        const abortController = new AbortController()
        listSingleRes(params.reservation_id, abortController.signal)
            .then(setFormData)
        return () => abortController.abort()
    }, [params.reservation_id])

    return (
        <main>
            <h1>Edit Reservation</h1>
                <form onSubmit = {handleSubmit}>
                    <div className="row">
                        <div className="col-md-3">
                            <label htmlFor="first_name">First Name:</label> <br/>                
                            <label htmlFor="last_name">Last Name:</label> <br/> 
                            <label htmlFor="mobile_number">Mobile Number:</label> <br/> 
                            <label htmlFor="people">Party Size:</label> <br/> 
                            <label htmlFor="reservation_date">Reservation Date:</label> <br/> 
                            <label htmlFor="reservation_time">Reservation Time:</label> <br/> 
                            
                        </div>
                        <div className="col-md-3">
                            <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange = {handleChange}/> <br/>
                            <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange = {handleChange}/> <br/>
                            <input placeholder="123-456-7890"type="text" id="mobile_number" name="mobile_number" value={formData.mobile_number} onChange = {handleChange}/> <br/>
                            <input type="number" id="people" name="people" value={formData.people} onChange = {handleChange}/> <br/>                 
                            <input type="date" id="reservation_date" name="reservation_date" value={formData.reservation_date} onChange = {handleChange}/> <br/>                  
                            <input type="time" id="reservation_time" name="reservation_time" value={formData.reservation_time} onChange = {handleChange}/> <br/>                
                            
                        </div>
                    </div>

                    

                    <button type="submit" className="btn btn-success">Submit</button>
                    <button type="button" className="btn btn-danger" onClick={cancel}>Cancel</button>
                </form>  

            <ErrorAlert error={errorMessage} />
        </main>
    )
}

export default EditReservation