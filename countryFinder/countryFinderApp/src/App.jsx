//dependencies
import { useEffect, useState } from "react";
import axios from "axios";

//Main Component
const App = () => {
  //locally held APIs information for countries
  const [countries, setCountries] = useState([]);
  //the users types input
  const [searchItem, setSearchItem] = useState("");
  //user select country
  const [selectedCountry, setSelectedCountry] = useState(null);
  //locally held weatherAPI information for country
  const [weatherData, setWeatherData] = useState(null);
  //meesage for weatherAPI alert
  const [ApiError, setApiError] = useState(null);

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

        if (selectedCountry) {
          const capital = selectedCountry.capital;
          fetchWeather(capital);
          console.log(capital);
        }
      } catch (error) {
        console.log(
          `country function error fetch: ${error.data}, ${error.message}`
        );
      }
    };

    fetchCountries();
  }, [searchItem]);

  const fetchWeather = async (capital) => {
    try {
      console.log(import.meta.env.VITE_SOME_KEY);
      const apiKey = import.meta.env.VITE_SOME_KEY;
      const hardKEY = "ef081b13568d142e9cd02535eb2d1f93";
      const version2_5 = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${hardKEY}&units=imperial`;
      const weatherResponse = await axios.get(version2_5);
      setWeatherData(weatherResponse.data);
      setApiError(null);
    } catch (error) {
      setWeatherData(null);
      console.error(`Error fetchng weather: ${error}`);
      setApiError(`error retching data`);
    }
  };

  //hanlde button click
  const handlerButtonClick = (obj) => {
    setSearchItem(obj.name.common);

    setSelectedCountry(obj);
  };

  const inputListener = (e) => {
    setSearchItem(e.target.value);
    countries.find((item) => {
      return item.name.common.includes(e.target.value);
    });

    if (e.target.value === "") {
      setSelectedCountry(null);
    }

    if (countries.length === 1) setSelectedCountry(countries[0]);
    if (countries.length > 1) setSelectedCountry(null);
  };

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
          inputListener(e);
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
                    handlerButtonClick(country);
                  }}
                >
                  Show Data
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {countries.length <= 1 && selectedCountry && (
        <div>
          <h2>{selectedCountry.name.common}</h2>
          <p>Capital: {selectedCountry.capital}</p>
          <p>Area: {selectedCountry.area}</p>
          <ul>
            Languages:{" "}
            {selectedCountry.languages &&
              renderLanguages(selectedCountry.languages)}
          </ul>
          <p>Flag:</p>
          <img
            src={selectedCountry.flags.png}
            alt={`${selectedCountry.name.common} national flag`}
            width="350px"
            height="250px"
          />
          <h4>Coat of Arms: </h4>
          <img
            src={selectedCountry.coatOfArms.png}
            alt={`${selectedCountry.name.common}'s COA flag`}
            width="350px"
            height="355px"
          />
          <div>
            <h2>
              Weather in {selectedCountry.name.common} capital;{" "}
              {selectedCountry.capital}
            </h2>
            <h3>{weatherData && weatherData.weather[0].main}</h3>

            {weatherData && (
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                alt={`${weatherData.weather[0].main} icon`}
              ></img>
            )}
            <h3>{ApiError}</h3>
            <div>
              {weatherData && <p>Temperature: {weatherData.main.temp}°F</p>}
              {weatherData && <p>Hunmidity: {weatherData.main.humidity} %</p>}
              {weatherData && <p>Wind: {weatherData.wind.speed}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default App;
