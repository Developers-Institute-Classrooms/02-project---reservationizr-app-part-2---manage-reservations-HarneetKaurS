import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateReservation from "./CreateReservation";
import "./Restaurant.css";

const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchUrl =  await fetch(`http://localhost:5001/restaurants/${id}`);
      // FIXME: Make a fetch request and call setRestaurant with the response body
      const data = await fetchUrl.json();
      setRestaurant(data);
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
     
      <div className="createreservation" key={restaurant.id}>
        <div className="img">
      <img src={restaurant.image} alt={restaurant.name} />
      </div>
      <div className="restaurantdetails">
          <p className="restaurantname"> {restaurant.name} </p>
          <p> {restaurant.description} </p>
          </div>
          </div>
        
          <CreateReservation restaurantName={restaurant.name} />
      
         
    </>
  );
};

export default Restaurant;
