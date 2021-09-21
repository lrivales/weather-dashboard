var appId = "7dddd78df5cbb905a33ba3be92421fbf";
var historyBtnGrpEl = $("#historyBtnGrp");
var searchHistory = [];

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
                        response.json().then(function(data){
                            // console.log(data);
                            // update page with current weather
                            $("#city").text(city);
                            $("#temp").text("Temp: "+data.current.temp+"F");
                            $("#wind").text("Wind: "+data.current.wind_speed+" MPH");
                            $("#humidity").text("Humidity: "+data.current.humidity+"%");
                            $("#uv-index").text("UV Index: "+data.current.uvi);
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

var createHistBtns = function(){
    var cities = JSON.parse(localStorage.getItem("cities"));
    if (!cities) {
        var cities = [];
        return;
    } else {
        for (var i = 0; i < cities.length; i++) {
            // console.log(cities[i]);
    
            // create new button
            var btnEl = document.createElement("button");
            btnEl.classList = "searchHist btn btn-primary mt-2 w-100";
            btnEl.setAttribute("id", cities[i]);
            btnEl.setAttribute("type", "button");
            btnEl.textContent = cities[i];
            // console.log(btnEl);
    
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
};

var historyBtnHandler = function(event) {
    var searchTxt = "";
    searchTxt = $(".searchHist").attr("id");
    console.log(searchTxt);
    getCurrentWeather(searchTxt);
};

createHistBtns();

$("#searchBtn").click(searchFormHandler);

$(".searchHist").click(historyBtnHandler);