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
        <div className="restaurants" key={restaurant.id}>
          <img className="img" src={restaurant.image} alt={restaurant.name} />
          <div className="grid">
          <p className="restaurantname"> {restaurant.name} </p>
          <p className="description"> {restaurant.description} </p>
          
          <Link to={`/restaurants/${restaurant.id}`} className="reservenow">
            Reserve now <code>&#8594;</code>
          </Link>
          </div>
        </div>
      ))}
    </>
  );
};

export default RestaurantList;
