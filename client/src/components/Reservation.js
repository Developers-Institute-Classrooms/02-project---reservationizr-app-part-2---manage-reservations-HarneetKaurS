import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import "./Reservation.css";

import { Link } from "react-router-dom";

const Reservation = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState({});
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:5001/reservations/${id}`);

      if (response.ok === false) {
        setIsNotFound(true);
        return;
      }

      const data = await response.json();
      setReservation(data);
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  if (isNotFound) {
    return (
      <>
        <p className="error">Sorry! We can't find that reservation</p>
        
      </>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <h1>Reservation</h1>
      <div className="reservation" key={reservation.id}>
          <p className="restaurant-name">{reservation.restaurantName}</p>
          <p className="date">{formatDate(reservation.date)}</p>
         
           <p className="partysize">Party size: <span>{reservation.partySize} </span></p>
         
        </div>
        <Link to={`/reservations`} className="details">
        <code>&#8592;</code> Back to Reservations 
          </Link>
      
     
     
    </>
  );
};

export default Reservation;
