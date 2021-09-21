var appId = "7dddd78df5cbb905a33ba3be92421fbf";

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
                            console.log(data);
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

var searchFormHandler = function(event) {
    var searchTxt = $("#searchTxt").val();
    var city = searchTxt.trim();
    getCurrentWeather(city);
};

$("#searchBtn").click(searchFormHandler);