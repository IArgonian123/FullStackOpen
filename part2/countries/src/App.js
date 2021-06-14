// libraries needed for our app
// axios for http requests
import React, { useState, useEffect } from 'react'
import axios from 'axios'


const App = () => {
  // Holds the state of the search bar; gets updated every time the user types
  // Using this state we overwrite the default behavoir of HTML forms (They keep their own state normally)
  const [ search, setSearch ] = useState('')
  // Will store the array of 250 objects holding info about countries
  const [ countries, setCountries ] = useState([])

  // After the first render sends a GET request to the server
  // When we get it, we store it in the search array
  // This gets executed only once
  useEffect(() => {
    const promise = axios.get('https://restcountries.eu/rest/v2/all')
    promise.then(response => {
      setCountries(response.data)
    })
  }, [])

  // Handler for choosing a country
  // from the list of matches
  const chooseCountry = code => {
    // Sets the search value to the chosen country
    setSearch(countries.find(country => country.alpha3Code === code).name)
  }

  // result is the array of the countries to be displayed
  const result = search
  ? countries.filter(country => (
    country.name
    .toUpperCase()
    .includes(search.toUpperCase())
  ))
  : []

  return (
    <div>
      <SearchBar search={search} setSearch={setSearch} />
      <SearchResult 
        result={result} 
        chooseCountry={chooseCountry} 
      />
    </div>
  )
}

const SearchBar = ({ search, setSearch }) => (
  <div>
    Find countries <input onChange={event => setSearch(event.target.value)} />
  </div>
)

const SearchResult = ({ result, chooseCountry}) => {
  const [ capitalWeather, setWeather ] = useState({})
  const results = result.length

  useEffect(() => {
    if (results !== 1) {
      return;
    } 
    if (Object.keys(capitalWeather).length !== 0 && capitalWeather.location.name === result[0].capital) {
      return;
    }

    axios
      .get(`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${result[0].capital}`)
      .then(response => setWeather(response.data))
  }, [result, results, capitalWeather])

  if (results > 10) {
    // If we get more than 10 results
    // We ask the user to be more specific
    return (<div>Too many matches, specify another filter</div>)
  } else if (results > 1) {
    // If we get between 1 and 10 results
    // We display a list of their names
    // And give the user the choice to display one
    return (
    <CountryList 
      list={result} 
      chooseCountry={chooseCountry} 
    />)
  } else if (results === 1) {
    // If there's only one result
    // We display it
    if (capitalWeather.current !== undefined) {
      return(<Country country={result[0]} capitalWeather={capitalWeather.current} />)
    } else {
      return null
    }
  } else {
    // If we don't get any results
    // We ask the user to change their search
    return(<div>No matches, specify another filter</div>)
  }
}

const CountryList = ({ list, chooseCountry }) => (
  <ul>
    {list.map(country => 
      <li key={country.alpha3Code}>
        {country.name} <ShowButton chooseCountry={() => chooseCountry(country.alpha3Code)} country={country.name} />
      </li>
    )}
  </ul>
)

const ShowButton = ({ chooseCountry, country }) => (
  <button value={country} onClick={chooseCountry}>show</button>
)

const Country = ({ country, capitalWeather }) => {

  return (
  <div>
    <h2>{country.name}</h2>
    <div>capital {country.capital}</div>
    <div>population {country.population}</div>

    <h3>Spoken languages</h3>
    <Languages languages={country.languages} />
    <img src={country.flag} style={{width:'25%'}} alt="flag"/>

    <h3>Weather in {country.capital}</h3>
    <div>
      <b>temperature: </b>{capitalWeather.temperature} Celcius
    </div>
    <img src={capitalWeather.weather_icons} alt="weather icon" />
    <div>
      <b>wind: </b>{capitalWeather.wind_speed} mph direction {capitalWeather.wind_dir}
    </div>  
  </div>
  )
}


const Languages = ({ languages }) => (
  <ul>
    {languages.map(language =>
      <li key={language.iso639_2}>{language.name}</li>
    )}
  </ul>
)

export default App;
