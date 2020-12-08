var apiKey = "aa7e07faf6ff57b5528ce9a4a68a992a";
var currentTempEl = document.querySelector("#current-temp");
var currentHumidityEl = document.querySelector("#current-humidity");
var currentWindEl = document.querySelector("#current-wind");
var currentWeatherIconEl = document.querySelector("#current-weather-icon");
var CitySearchEl = document.querySelector("#city-search");
var cityLabelEl = document.querySelector("#city");
var SearchBoardEl = document.querySelector("#search-board");
var currentDateEl = document.querySelector("#date");
var currentUviEl = document.querySelector("#current-uv");
var forecastTempLowEl0 = document.querySelector("#forecast-temp-low-0");
var forecastTempLowEl1 = document.querySelector("#forecast-temp-low-1");
var forecastTempLowEl2 = document.querySelector("#forecast-temp-low-2");
var forecastTempLowEl3 = document.querySelector("#forecast-temp-low-3");
var forecastTempLowEl4 = document.querySelector("#forecast-temp-low-4");
var forecastTempHighEl0 = document.querySelector("#forecast-temp-high-0");
var forecastTempHighEl1 = document.querySelector("#forecast-temp-high-1");
var forecastTempHighEl2 = document.querySelector("#forecast-temp-high-2");
var forecastTempHighEl3 = document.querySelector("#forecast-temp-high-3");
var forecastTempHighEl4 = document.querySelector("#forecast-temp-high-4");
var forecastHumidity0 = document.querySelector("#forecast-humidity-0");
var forecastHumidity1 = document.querySelector("#forecast-humidity-1");
var forecastHumidity2 = document.querySelector("#forecast-humidity-2");
var forecastHumidity3 = document.querySelector("#forecast-humidity-3");
var forecastHumidity4 = document.querySelector("#forecast-humidity-4");
var forecastDate0 = document.querySelector("#date0");
var forecastDate1 = document.querySelector("#date1");
var forecastDate2 = document.querySelector("#date2");
var forecastDate3 = document.querySelector("#date3");
var forecastDate4 = document.querySelector("#date4");
var forecastIconEl0 = document.querySelector("#forecast-icon-0");
var forecastIconEl1 = document.querySelector("#forecast-icon-1");
var forecastIconEl2 = document.querySelector("#forecast-icon-2");
var forecastIconEl3 = document.querySelector("#forecast-icon-3");
var forecastIconEl4 = document.querySelector("#forecast-icon-4");
var pastSearchEl = document.querySelector("#search-history-list");
var pastSearch = [];

//button press detection
document.getElementById("search-btn").addEventListener("click", function(event) {
    event.preventDefault();
    getDate();
    var citySearched = CitySearchEl.value.trim();
    cityLabelEl.textContent = citySearched;
    storeSearch(citySearched);
    getWeather(citySearched,apiKey);
});
    
//getting current date and forecast dates
var getDate = function(){
    //var currentDate = moment().format('LL');
    currentDateEl.textContent = moment().format('LL');
    //moment().format('LL').add(1,'days');
    forecastDate0.textContent = moment().add(1, 'd').format('ll');
    forecastDate1.textContent = moment().add(2, 'd').format('ll');
    forecastDate2.textContent = moment().add(3, 'd').format('ll');
    forecastDate3.textContent = moment().add(4, 'd').format('ll');
    forecastDate4.textContent = moment().add(5, 'd').format('ll');
};
//storing cities searched in the past
var storeSearch = function(search){
    pastSearch.push(search);
    var searchEl = document.createElement("li");
        searchEl.innerHTML=search;
        pastSearchEl.appendChild(searchEl);    
    localStorage.setItem("pastSearch",JSON.stringify(pastSearch));
};
//loading past searches for future use
var loadPastSearch = function() {
    let tempSearch = localStorage.getItem("pastSearch");
    if (tempSearch) {
        let mytempSearch = JSON.parse(tempSearch.toString());
        
        for(let i=0; i < mytempSearch.length; i++){
            var searchEl = document.createElement("li");
            searchEl.innerHTML=mytempSearch[i];
            pastSearchEl.appendChild(searchEl);
        }
        pastSearch = mytempSearch;
    }
};  
//getting weather and populating current weather fields
var getWeather = function(citySearched, apiKey){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearched + "&units=imperial&appid=" + apiKey;

    var apiUrl2 = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearched + "&cnt=6&units=imperial&appid=" + apiKey;
    
    fetch(apiUrl).then(function(response){
    return response.json();
    }).then(function(data){
      currentTempEl.textContent = data.main.temp;
      currentHumidityEl.textContent = data.main.humidity;
      currentWindEl.textContent = data.wind.speed;
      currentWeatherIconEl.setAttribute("src","http://openweathermap.org/img/wn/"+ data.weather[0].icon + "@2x.png" )

      var uvIndex = "http://api.openweathermap.org/data/2.5/uvi?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=" + apiKey;

      fetch(uvIndex).then(function(response){
        if (response.ok){
            response.json().then(function(data){
                var check = JSON.parse(data.value);
                debugger;
                
                //checking to see if the uv index is dagerous or not
                if (check < 4){
                    currentUviEl.classList.remove("bg-danger","bg-warning");
                    currentUviEl.classList.add("bg-primary");
                }
                if (check < 8 && check > 4){
                    currentUviEl.classList.remove("bg-danger","bg-primary");
                    currentUviEl.classList.add("bg-warning");
                }
                if (data.vale > 8){
                    currentUviEl.classList.remove("bg-primary","bg-warning");
                    currentUviEl.classList.add("bg-danger");
                }

                currentUviEl.textContent = data.value;
            })
        } else {
            alert("Error: " + response.statusText);
        }
          
      })     
    })
    //getting and populating forecast weather fields
   fetch(apiUrl2).then(function(response){
    return response.json();
    }).then(function(data){
    
         for (i =0; i < 5; i++){
         
            document.querySelector("#forecast-temp-low-" + [i]).textContent = data.list[i].main.temp_min;

            document.querySelector("#forecast-temp-high-" + [i]).textContent = data.list[i].main.temp_max;

            document.querySelector("#forecast-humidity-" + [i]).textContent = data.list[i].main.humidity;

            document.querySelector("#forecast-icon-" + [i]).setAttribute("src","http://openweathermap.org/img/wn/"+ data.list[i].weather[0].icon + "@2x.png");
           
        }
          
      })     
};
var cityUpdate = function(event){
    var targetEl = event.target.innerHTML;
    cityLabelEl.textContent = targetEl;
    getWeather(targetEl,apiKey);
    
};
pastSearchEl.addEventListener("click",cityUpdate);
loadPastSearch();



