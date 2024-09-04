//dependencies
import { useEffect, useState } from "react";
import axios from "axios";

//Main Component
const App = () => {
  //locally held APIs information for countries
  const [countries, setCountries] = useState([]);
  //locally held APIs information for weather in countries
  const [countryWeather, setCountryWeather] = useState([]);
  //the users types input
  const [searchItem, setSearchItem] = useState("");

  //isolate selected country - long formatted way to use on button click
  // const [isolate, setIsolate] = useState(null);

  //hook renders based on state of user input
  //empty input yields empty API information
  //when input has values, its function runs
  //function async promises:
  // 1) creates url if theres input value
  // 2) will request through axios to get API info based on input
  // 3) sets local API info
  // 4) if error - logs errors
  useEffect(() => {
    if (searchItem.trim() === "") {
      setCountries([]);
      return;
    }

    const fetchCountries = async () => {
      try {
        const countryUrl = `https://restcountries.com/v3.1/name/${searchItem}`;
        const response = await axios.get(countryUrl);
        setCountries(response.data);
      } catch (error) {
        console.log(`Fetched error data: ${error.data}`);
      }
    };

    fetchCountries();
  }, [searchItem]);

  //language rendering function works for Objs and Arr
  const renderLanguages = (languages) => {
    if (Array.isArray(languages)) {
      return languages.join(", ");
    } else if (typeof languages === "object") {
      return Object.values(languages).join(", ");
    } else {
      return "Unknown";
    }
  };

  //Handle button click to render single country
  // const handleBtn = (country) => setIsolate(country);

  //Components rendering
  return (
    <div>
      <h1>Country Information App</h1>
      Find Country:{" "}
      <input
        name="userInput"
        type="text"
        value={searchItem}
        onChange={(e) => {
          setSearchItem(e.target.value);
        }}
      />
      {searchItem === "" && (
        <p>
          <i>No name entered</i>
        </p>
      )}
      {countries.length > 10 && <p>Too Many Matches, Specify the Name!</p>}
      {countries.length <= 10 && countries.length > 1 && (
        <div>
          <h3>Matching Countries</h3>
          <ul>
            {countries.map((country) => (
              <li key={country.cca2}>
                {country.name.common}{" "}
                <button
                  onClick={() => {
                    setSearchItem(country.name.common);
                  }}
                >
                  Show Data
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {countries.length === 1 && (
        <div>
          <h2>{countries[0].name.common}</h2>
          <p>Capital: {countries[0].capital}</p>
          <p>Area: {countries[0].area}</p>
          <ul>
            Languages:{" "}
            {countries[0].languages && renderLanguages(countries[0].languages)}
          </ul>
          <p>Flag:</p>
          <img
            src={countries[0].flags.png}
            alt={`${countries[0].name.common} national flag`}
            width="350px"
            height="250px"
          />
          <p>Coat of Arms: </p>
          <img
            src={countries[0].coatOfArms.png}
            alt={`${countries[0].name.common}'s COA flag`}
            width="350px"
            height="250px"
          />
          <p>Longitude & Latitude: {countries[0].latlng.join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default App;
