var APIkey = "b539fdcf084f125f2fbdb2489d4ebf94";
var searchInputVal = "Dallas";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInputVal + "&appid=" + APIkey + "&units=imperial";
var currentDay = dayjs().format('MM/DD/YYYY');


fetch(queryURL)
  .then(response => response.json())
  .then(data => console.log(data));

  // http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}