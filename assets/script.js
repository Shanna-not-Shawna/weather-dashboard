const APIKey = "6acaa70b8159eb647ca2c6424a15fd8f";
var currentDay = dayjs().format("MM/DD/YYYY");
var userCity = document.querySelector("#search-form");
var searchHistory = document.querySelector("#search-history")
var currentWeatherContainer = document.querySelector("#currentWeatherContainer");
var forecastContainer = $("#forecastContainer");


// listens for click and checks for input
function formSubmitHandler(event) {
    event.preventDefault();

    var cityInput = userCity.elements.city.value.trim();

    if (cityInput) {
        getCurrentWeather(cityInput);
        storeFormerSearches(cityInput);

    } else {
        alert("Please enter a valid city name");
    }
}

// fetch current weather data
function getCurrentWeather(cityInput) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=" + APIKey + "&units=imperial";
    fetch(queryURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                alert("City not found");
            }
        })
        .then(function (todaysWeather) {
            console.log(todaysWeather);
            displayCurrentWeather(todaysWeather);

            
            // Parse latitude and longitude from todaysWeather
            var lat = todaysWeather.coord.lat;
            var lon = todaysWeather.coord.lon;

            getFiveDayWeather(lat, lon);
        })
        .catch(function (error) {
            console.error(error.message);
        });
}

// on pageload
function getDefaultWeather() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=Dallas&appid=" + APIKey + "&units=imperial";
    fetch(queryURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                alert("City not found");
            }
        })
        .then(function (todaysWeather) {
            console.log(todaysWeather);
            displayCurrentWeather(todaysWeather);
        })
        .catch(function (error) {
            console.error(error.message);
        });
}

//fetch 5 day forecast for entered city
function getFiveDayWeather(lat, lon) {
    var fiveDayWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&" + "lon=" + lon + "&appid=" + APIKey + "&units=imperial";

    fetch(fiveDayWeatherURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function (fiveDayWeatherData) {
            console.log(fiveDayWeatherData);


            var thisDay = dayjs(currentDay);
            forecastContainer[0].innerHTML = "";
            // var fiveDayTitle = document.createElement("h2");
            // fiveDayTitle.textContent = "5 day Forecast";
            // forecastContainer.append(fiveDayTitle);

            for (let i = 0; i < fiveDayWeatherData.list.length; i++) {
                const dayObj = fiveDayWeatherData.list[i];

                if (dayjs(dayObj.dt_txt).isSame(thisDay.add(1, "day"))) {
                    console.log("found next day");
                    displayFiveDayWeather(dayObj);
                    thisDay = dayjs(dayObj.dt_txt);
                }
            }
        })
}

function displayCurrentWeather(todaysWeather) {

    // var sectionTitle = document.createElement("h2");
    var currentCityDate = document.createElement("h3");
    var currentTemp = document.createElement("p");
    var currentWind = document.createElement("p");
    var currentHumidity = document.createElement("p");
    let currentIcon = document.createElement("img");
    currentWeatherContainer.textContent = "";
    // sectionTitle.textContent = "Current Conditions";
    // currentWeatherContainer.append(sectionTitle);
    currentCityDate.textContent = todaysWeather.name + "  (" + currentDay + ")";
    currentIcon.src = "https://openweathermap.org/img/wn/" + todaysWeather.weather[0].icon + "@2x.png";
    currentCityDate.append(currentIcon);
    currentTemp.textContent = "Temp: " + todaysWeather.main.temp + " °F";
    currentWind.textContent = "Wind: " + todaysWeather.wind.speed + " MPH";
    currentHumidity.textContent = "Humidity: " + todaysWeather.main.humidity + "%";
    currentWeatherContainer.append(currentCityDate);
    currentWeatherContainer.append(currentTemp);
    currentWeatherContainer.append(currentWind);
    currentWeatherContainer.append(currentHumidity);
}


// on pageload
function displayDefaultWeather(todaysWeather) {

    var currentCityDate = document.createElement("h3");
    var currentTemp = document.createElement("p");
    var currentWind = document.createElement("p");
    var currentHumidity = document.createElement("p");
    let currentIcon = document.createElement("img");
    currentWeatherContainer.textContent = "";
    currentCityDate.textContent = todaysWeather.name + "  (" + currentDay + ")";
    currentIcon.src = "https://openweathermap.org/img/wn/" + todaysWeather.weather[0].icon + "@2x.png";
    currentCityDate.append(currentIcon);
    currentTemp.textContent = "Temp: " + todaysWeather.main.temp + " °F";
    currentWind.textContent = "Wind: " + todaysWeather.wind.speed + " MPH";
    currentHumidity.textContent = "Humidity: " + todaysWeather.main.humidity + "%";
    currentWeatherContainer.append(currentCityDate);
    currentWeatherContainer.append(currentTemp);
    currentWeatherContainer.append(currentWind);
    currentWeatherContainer.append(currentHumidity);
}

function displayFiveDayWeather(dayObj) {    

    var cardHTML = $(`
    <div class="col">
        <div class="card">
        <img src="https://openweathermap.org/img/wn/${dayObj.weather[0].icon}@2x.png" class="card-img-top" alt="${dayObj.weather[0].description}">
        <div class="card-body">
            <h5 class="card-title">${dayjs(dayObj.dt_txt).format("MM/DD/YYYY")}</h5>
            <ul>
            <li>Temp: ${dayObj.main.temp} °F</li>
            <li>Wind: ${dayObj.wind.speed} MPH</li>
            <li>Humidity: ${dayObj.main.humidity}%</li>
            </ul>
        </div>
        </div>
    </div>
    `);

    forecastContainer.append(cardHTML);
}

function storeFormerSearches(cityInput) {
    var cityHistory = JSON.parse(localStorage.getItem("cityHist")) || [];
    console.log(cityHistory);
    cityHistory.push(cityInput);
    localStorage.setItem("cityHist", JSON.stringify(cityHistory));
    console.log(cityHistory);
    displayCityHist(cityHistory);
}

function displayCityHist(cityHistory) {
    searchHistory.innerHTML = "";
    console.log(cityHistory);
    for (let i = 0; i < cityHistory.length; i++) {
        var cityList = cityHistory[i];
        var cityButton = document.createElement("button");
        cityButton.textContent = cityList;
        cityButton.classList.add("city-button");

        cityButton.addEventListener("click", function () {
        });
        searchHistory.appendChild(cityButton);
    }
}

function displayHistoryCity (event) {
    var clickedCity = event.target.textContent;
    
    if (event.target.textContent = clickedCity) {
        getCurrentWeather(clickedCity);
    }
}

userCity.addEventListener('submit', formSubmitHandler);
searchHistory.addEventListener('click', displayHistoryCity)
document.addEventListener("DOMContentLoaded", displayDefaultWeather);