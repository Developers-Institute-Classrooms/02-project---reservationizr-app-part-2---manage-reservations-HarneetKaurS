import React, {useState, useEffect} from "react"
import "./RestaurantList.css";
import { Link } from "react-router-dom";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([])

  const fetchData = async () => {
    const response = await fetch ("http://localhost:5001/restaurants");
    const data = await response.json();
    setRestaurants(data);
    };
  
    useEffect(() =>{
      fetchData();
    }, []);

  return (
    <>
      <h1>Restaurants</h1>
      {restaurants.map((restaurant) => (
        <div key={restaurant.id}>
          <img src={restaurant.image} alt={restaurant.name} />
          <p> {restaurant.name} </p>
          <p> {restaurant.description} </p>
          
          <Link to={`/restaurants/${restaurant.id}`} >
            Reserve now <code>&#8594;</code>
          </Link>
        </div>
      ))}
    </>
  );
};

export default RestaurantList;
