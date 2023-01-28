import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { DateTime } from 'luxon';

const cityTimezones = require('city-timezones');


function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');

  const cityLookup = cityTimezones.lookupViaCity(`${location}`);
  const allCitiesTZ = Object.assign({}, ...cityLookup);
  const [date, setDate] = useState(DateTime.now().setZone(allCitiesTZ.timezone));
  const [languages, setLanguage] = useState('')
  function refreshClock() {
    setDate(DateTime.now().setZone(allCitiesTZ.timezone));
  }
  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };}, [location]);
   
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&lang=${languages}&appid=< application Id key >`

  
  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios.get(url).then((response) => {
        console.log('res', response.data)
        setData(response.data)
        console.log('ddddd', data)
      })
    }}
  return (
    <div className="app">
      <div className='search'>
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder='Enter Name of the City...'
          type="text" />
      </div>
      <div><label for="languages">Choose  the language:</label>
        <select onChange={(e) => setLanguage(e.target.value)}
        value={languages} name="language" id="language">
         <option value="sv">Swedish</option>
         <option value="ar">Arabic</option>
         <option value="en" selected>English</option>
        </select></div> 
      <div> 
        <p className='date'> {date.toFormat('DD hh:mm:ss')}</p>
      </div>
      <div className='container'>
        <div className='top'>
          <div className='location'> <p> {data.name} </p> </div>
          <div className={'temp'}> {data.main ? <h1> {data.main.temp}°F </h1> : null}</div> <br />
          {data.main ? <p> Min: {data.main.temp_min}°F </p> : null}
          {data.main ? <p> Max: {data.main.temp_max}°F </p> : null}
          <div className='description'>{data.weather ? <p class="des"> {data.weather[0].main}</p> : null}  </div>
        </div>
        {data.name !== undefined &&
          <div className='bottom'>
            <div className='bold'><p> {data.main ? <p className='bold'> {data.main.feels_like}°F </p> : null} </p> <p> Feels Like  </p></div>
            <div className='bold'> {data.main ? <p> {data.main.humidity} % </p> : null} <p>  Humidity </p></div>
            <div className='bold'> {data.wind ? <p> {data.wind.speed} MPH  </p> : null} <p> Wind Speed </p></div>
          </div>
          
        }

      </div>
    </div>
  );
}

export default App;
