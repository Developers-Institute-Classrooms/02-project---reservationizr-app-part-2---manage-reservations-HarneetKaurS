import React, {useState, useEffect} from "react"
import "./ReservationList.css";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);

  const fetchData = async () => {
  const response = await fetch ("http://localhost:5001/reservations");
  const data = await response.json();
  setReservations(data);

  };

  useEffect(() =>{
    fetchData();
  }, []);

  return (
    <>
      <h1>Upcoming reservations</h1>
      {reservations.map((reservation) => (
          <div className="reservations" key={reservation.id}>
          <p className="restaurant-name">{reservation.restaurantName}</p>
          <p className="date">{formatDate(reservation.date)}</p>
          <Link to={`/reservations/${reservation.id}`} className="details">
            View details <code>&#8594;</code>
          </Link>
        </div>
    
      
      )
        )}
     
    </>
  );
};

export default ReservationList;
