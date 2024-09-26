// SearchFlights.jsx
import React from "react";

const SearchFlights = () => {
  return (
    <section className="search-flights">
      <div className="search-container">
        <input type="text" placeholder="From - To" />
        {/* <select>
          <option value="return">Return</option>
          <option value="oneway">One Way</option>
        </select> */}
        <input type="date" placeholder="Depart - Return" />
        <select>
          <option value="economy">1 Passenger, Economy</option>
          <option value="economy">2 Passenger, Economy</option>
        </select>
        <button className="show-flights-btn">Show Flights</button>
      </div>
    </section>
  );
};

export default SearchFlights;
