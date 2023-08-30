import React, { useState, useEffect } from "react";
import "./ReservationList.css";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { useAuth0 } from "@auth0/auth0-react";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();

      const response = await fetch("http://localhost:5001/reservations", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok === false) {
        setIsNotFound(true);
        return;
      }

      const data = await response.json();
      setReservations(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (reservations.length<1) {
    return (
      <>
        <p>You don't have any reservations.</p>
        <Link to="/"> View the restaurants </Link>
      </>
    );
  }
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <h1>Upcoming reservations</h1>
      {reservations.map((reservation) => (
        <div className="reservations" key={reservation.id}>
          <p className="restaurant-name">{reservation.restaurantName}</p>
          <p className="date">{formatDate(reservation.date)}</p>
          <Link to={`/reservations/${reservation.id}`} className="detailss">
            View details <code>&#8594;</code>
          </Link>
        </div>
      ))}
    </>
  );
};

export default ReservationList;
