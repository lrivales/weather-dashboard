var appId = "7dddd78df5cbb905a33ba3be92421fbf";
var historyBtnGrpEl = $("#historyBtnGrp");
var searchHistory = localStorage.getItem("cities");
if (!searchHistory) {
    searchHistory = [];
} else {
    searchHistory = JSON.parse(searchHistory);
}


var getCurrentWeather = function(city) {
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&APPID="+appId+"&units=imperial";
    
    fetch(queryUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data){
                // get city coordinates
                var lat = (data.coord.lat);
                var lon = (data.coord.lon);
                var city = data.name;

                // build api url
                var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly&units=imperial&appid="+appId;
                
                // fetch current weather
                fetch(apiUrl).then(function(response) {
                    if (response.ok) {
                        response.json().then(function(data) {

                            // update page with current weather
                            $("#city").text(city);
                            $("#temp").text("Temp: "+data.current.temp+"F");
                            $("#wind").text("Wind: "+data.current.wind_speed+" MPH");
                            $("#humidity").text("Humidity: "+data.current.humidity+"%");
                            $("#uv-index").text("UV Index: "+data.current.uvi);
                            getFutureWeather(apiUrl);

                            // add current weather icon
                            weatherIconEl = document.createElement("img");
                            weatherIconEl.setAttribute("width", "100px");
                            weatherIconEl.setAttribute("height", "100px");
                            weatherIconEl.setAttribute("src", "https://openweathermap.org/img/wn/"+data.current.weather[0].icon+"@2x.png")                        
                            $("#city").append(weatherIconEl);
                        });
                    } else {
                        alert("Invalid data submitted/returned.");
                    }
                });
            });
        } else {
            alert("Please provide a valid city.");
        }
    });
};

var getFutureWeather = function(apiUrl) {
    // fetch future weather
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                for (var i = 0; i < 5; i++) {
                    // convert unix time to human readable time
                    var futureDate = luxon.DateTime.fromSeconds(data.daily[i].dt).toLocaleString();
                    // update daily forecast card with weather info
                    $("#"+i).text(futureDate);
                    $("#"+i+"-temp").text("Temp: "+data.daily[i].temp.day+"F");
                    $("#"+i+"-wind").text("Wind: "+data.daily[i].wind_speed+" MPH");
                    $("#"+i+"-humidity").text("Humidity: "+data.daily[i].humidity);

                    // add future weather icon
                     weatherIconEl = document.createElement("img");
                     weatherIconEl.setAttribute("src", "https://openweathermap.org/img/wn/"+data.daily[i].weather[0].icon+"@2x.png")
                     futureWeatherCardEl = document.getElementById([i]);
                     futureWeatherCardEl.appendChild(weatherIconEl);
                }
            });
        }
    });
};

var createCityBtn = function(city) {
    // create button
    var btnEl = document.createElement("button");
    btnEl.classList = "searchHist btn btn-primary mt-2 w-100";
    btnEl.setAttribute("id", city);
    btnEl.setAttribute("type", "button");
    btnEl.textContent = city;
    // add button to history button group
    document.getElementById("historyBtnGrp").appendChild(btnEl);
};

var createHistBtns = function(){
    // load cities from local storage
    var cities = JSON.parse(localStorage.getItem("cities"));
    // if empty, set cities array to empty
    if (!cities) {
        var cities = [];
        return;
    } else {
        // delete all history buttons
        historyBtnGrpEl.empty();

        // re-create all history buttons
        for (var i = 0; i < cities.length; i++) {
            
            // create new button
            var btnEl = document.createElement("button");
            btnEl.classList = "searchHist btn btn-primary mt-2 w-100";
            btnEl.setAttribute("id", cities[i]);
            btnEl.setAttribute("type", "button");
            btnEl.textContent = cities[i];
            btnEl.onclick = function() {
                console.log(cities[i]);
                getCurrentWeather($(this).attr("id"));
            }
    
            // append to container
            document.getElementById("historyBtnGrp").appendChild(btnEl);
        }
    }
};

var searchFormHandler = function(event) {
    var searchTxt = $("#searchTxt").val();
    var city = searchTxt.trim();
    getCurrentWeather(city);

    // add city to array
    searchHistory.push(city);
    
    // save city to local storage
    localStorage.setItem("cities", JSON.stringify(searchHistory));
    createHistBtns();
};

createHistBtns();

$("#searchBtn").click(searchFormHandler);