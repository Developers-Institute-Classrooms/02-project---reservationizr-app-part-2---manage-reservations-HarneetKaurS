import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useAuth0 } from "@auth0/auth0-react";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateReservation.css";

const CreateReservation = ({restaurantName}) => {
  const [partySize, setPartySize] = useState("");
  const [date, setDate] = useState(new Date());
  
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const accessToken = await getAccessTokenSilently();

    setIsLoading(true);


    const reservation = {
      partySize: Number(partySize),
     date,
      restaurantName,
    };

    const response = await fetch("http://localhost:5001/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
      body: JSON.stringify(reservation),
    });
    if (!response.ok) {
      setIsError(true);
      setErrorStatus(response.status);
    } else {
      setIsLoading(false);
      navigate("/");
    }
  };

  if (isError) {
    return (
      <>
        <p >
          Error creating a reservation (error status {errorStatus})
        </p>
        <Link to="/">
          Return to restaurants
        </Link>
      </>
    );
  }

  return (
     <>
     <h1> Reserve {restaurantName} </h1>
     <form onSubmit = {handleSubmit}>
      <p>
        <label htmlFor="partySize"> Number of guests</label>
        <input
        type="text"
        id="partySize"
        value={partySize}
        onChange = {(event) =>{
          setPartySize(event.target.value);
        }}
        required/>
      </p>
      <p>
        <label htmlFor="date"> Date </label>
<DatePicker 
selected={date} 
onChange={(date) => setDate(date)}
minDate={new Date()}
/>
      </p>
      <button className="submit-btn" disabled={isLoading}>
          Submit
        </button>
     </form>
     </>
  );
};

export default CreateReservation;
