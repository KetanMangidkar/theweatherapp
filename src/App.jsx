import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import { FaMapMarkerAlt, FaSistrix } from "react-icons/fa";
import WeatherGraph from "./Comoponents/WeatherGraph";
import { LineChart, Line, XAxis } from "recharts";

// key = c14e29af465c6ff3ec26be92e3ed443a
function App() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState({
    lon: 0,
    lat: 0,
  });
  const [data, setData] = useState([]);
  const [searchplace, setSearchplace] = useState("");
  const [hourdata, setHourdata] = useState([]);

  //for get the live location of the user
  function getcurrentLocation() {
    navigator.geolocation.getCurrentPosition(success);
    function success(pos) {
      const crd = pos.coords;
      setLocation({ lat: crd.latitude, lon: crd.longitude });
    }
  }
  useEffect(() => {
    getcurrentLocation();
  }, []);

  //user get live location by coordinates
  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=c14e29af465c6ff3ec26be92e3ed443a&units=metric`
      )
      .then((res) => {
        console.log(res.data.name);
        setSearch(res.data.name);
      });
  }, [location.lat, location.lon]);

  //user get city by name
  const getLocation = () => {
    try {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=c14e29af465c6ff3ec26be92e3ed443a&units=metric`
        )
        .then((response) => {
          weeklyData(response.data.coord.lat, response.data.coord.lon);
          setSearchplace(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("err", err);
    }
  };

  //user get weekly and daily data
  const weeklyData = (lat, lon) => {
    try {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=c14e29af465c6ff3ec26be92e3ed443a&units=metric`
        )
        .then((res) => {
          console.log(res.data);
          setData(res.data.daily);
          setHourdata(res.data.hourly);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch {}
  };

  useEffect(() => {
    getLocation();
    // eslint-disable-next-line
  }, [search]);

  //to get time of sunrise and sunset
  let sunRise = new Date(searchplace.sys?.sunrise * 1000);
  let sunSet = new Date(searchplace.sys?.sunset * 1000);

  //for sunrise and sunset fraph
  const risensetData = [
    { name: sunRise, sunAct: searchplace.sys?.sunrise, value: 0 },
    { name: "", sunAct: "", value: 5 },
    { name: sunSet, sunAct: searchplace.sys?.sunrise, value: 0 },
  ];

  return (
    <div className="App">
      <div className="searchBox">
        <FaMapMarkerAlt />
        <input
          type="text"
          className="searchterm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={getLocation}
        />
        <FaSistrix />
      </div>

      <div className="weekForcast">
        {data.map((e) => (
          <div className="days">
            <p>
              {new Date(`${e.dt}` * 1000).toLocaleString("en", {
                weekday: "short",
              })}
            </p>
            <div className="daytemp">
              <p>{Math.round(e.temp.max)}°</p>
              <p>{Math.round(e.temp.min)}°</p>
            </div>
            <div className="dayimg">
              <img
                src={`https://openweathermap.org/img/wn/${e?.weather[0]?.icon}@2x.png`}
                alt="weather"
              />
            </div>
            <p>{e.weather[0]?.main}</p>
          </div>
        ))}
      </div>

      <div className="graphical">
        <div className="currentData">
          <h1>{Math.round(searchplace.main?.temp)}°C</h1>
          <img
            src={`https://openweathermap.org/img/wn/${data[0]?.weather[0]?.icon}@2x.png`}
            alt=""
          />
        </div>

        <WeatherGraph hourlydata={hourdata} />

        <div className="humpres">
          <div>
            <p>
              <b>Pressure</b>
            </p>
            <p>{searchplace.main?.pressure} hpa</p>
          </div>
          <div>
            <p>
              <b>Humidity</b>
            </p>
            <p>{searchplace.main?.humidity} %</p>
          </div>
        </div>

        <div className="setnrise">
          <div>
            <p>
              <b>Sunrise</b>
            </p>
            <p>{sunRise.toLocaleTimeString()}</p>
          </div>
          <div>
            <p>
              <b>Sunset</b>
            </p>
            <p>{sunSet.toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="sungraph">
          <LineChart
            style={{ margin: "auto" }}
            width={300}
            height={200}
            data={risensetData}
          >
            <XAxis dataKey="name" />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#eccb87"
              strokeWidth={2}
              label={3}
              name={3}
            />
          </LineChart>
        </div>

      </div>
    </div>
  );
}

export default App;
