import { useState, useEffect } from "react";
import { CiLight, CiDark, CiLocationOn } from "react-icons/ci";
import "./App.css";
import cloud from "./assets/cloud.png";
import rain from "./assets/rain.png";
import mist from "./assets/mist.png";
import clear from "./assets/clear.png";
import { IoIosSearch } from "react-icons/io";
import { LuWind } from "react-icons/lu";
import { FaDroplet } from "react-icons/fa6";

export default function App() {
  const [data, setData] = useState(null);
  const [values, setValues] = useState("delhi");
  const [bg, setBg] = useState("bgImg");

  useEffect(() => {
    if (!values) return;

    async function UpdateValue() {
      let key = "30c3a7aa6747a8232eeee348b7df3fca";
      let response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${values}&appid=${key}&units=metric`
      );
      const mainData = await response.json();
      setData(mainData);
    }
    UpdateValue();
  }, [values]);

  function getWeatherIcon(main) {
    if (main === "Clouds") return cloud;
    if (main === "Clear") return clear;
    if (main === "Rain") return rain;
    if (main === "Mist") return mist; // ✅ Add this
    return cloud;
  }

  let weatherImage = "";

  if (data?.list[0]?.weather?.[0]?.main) {
    let mainImage = data?.list[0]?.weather?.[0]?.main;

    weatherImage = getWeatherIcon(mainImage);
  }

  const handleChange = (e) => {
    if (e.key == "Enter") {
      setValues(e.target.value);
    }
  };

  const BtnClick = () => {
    const input = document.querySelector("input");
    setValues(input.value);
  };

  const getDate = new Date();
  const week = getDate.toLocaleString("en-US", { weekday: "long" });
  const day = getDate.getDate();
  const GetMonth = getDate.toLocaleString("en-US", { month: "short" });
  const MainData = `${week},  ${day}${GetMonth}`;

  const chnageBg = () => {
    const BackgroundData = ["SunBg", "NightBg", "bgImg"];
    const saveData = Math.floor(Math.random() * BackgroundData.length);
    setBg(BackgroundData[saveData]);
  };

  useEffect(() => {
    const BackgroundData = ["SunBg", "NightBg", "bgImg"];
    BackgroundData.forEach((list) => document.body.classList.remove(list));
    document.body.classList.add(bg);
  }, [bg]);

  return (
    <div className="weather ">
      <div className="container">
        <div className="search">
          <input type="text" placeholder="Search..." onKeyDown={handleChange} />
          <button onClick={BtnClick}>
            <IoIosSearch className="SearchIcon" />
          </button>
        </div>
        <div>
          <div className="location">
            <div className="locationData">
              <CiLocationOn className="locationIcon" />
              <p>{data?.city?.name}</p>
            </div>
            <p id="days">{MainData}</p>
          </div>
          <div className="weatherData">
            {weatherImage && <img id="imageTemp" src={weatherImage} />}

            <div className="temp">
              <h1>{Math.round(data?.list?.[0]?.main?.temp)}°C</h1>
              <p>{data?.list?.[0]?.weather?.[0]?.main}</p>
            </div>
          </div>
          <div className="content">
            <div className="humidity">
              <FaDroplet className="Drop" />
              <div>
                <p>Humidity</p>
                <p className="bold">{data?.list?.[0]?.main?.humidity}%</p>
              </div>
            </div>
            <div>
              <div className="winSpeed">
                <LuWind className="Drop" />
                <div>
                  <p>Win Speed</p>
                  <p className="bold">
                    {Math.round(data?.list?.[0].wind?.speed)} M/s
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="Previous">
            {data?.list
              ?.filter((item) => item.dt_txt.includes("12:00:00"))
              .map((item, index) => {
                const date = new Date(item.dt_txt);
                const Day = String(date.getDate()).padStart(2, "0");
                const month = date.toLocaleString("en-US", {
                  month: "short",
                });
                return (
                  <div className="searchResul" key={index}>
                    <ul>
                      <li>
                        <p>
                          {Day} {month}
                        </p>
                        <img
                          src={getWeatherIcon(item.weather[0].main)}
                          alt="weather icon"
                        />

                        <p>{Math.round(item.main.temp)}°C</p>
                      </li>
                    </ul>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="chnage">
          <button onClick={chnageBg}>Change the Background</button>
        </div>
      </div>
    </div>
  );
}
