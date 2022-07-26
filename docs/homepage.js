//city empty variable
var city="";
//variables listed below
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var currentTemperature = $("#temperature");
var currentHumidty= $("#humidity");
var currentWSpeed=$("#wind-speed");
var currentUvindex= $("#uv-index");
var APIKey="de0302e95be3b39f3ad294c568a4cdc9";
var sCity=[];
//Function to reference the key
function currentWeather(city){
    // Here we build the URL so we can get a data from server side.
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){
        //Convert temperature from Kelvin
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemperature).html((tempF).toFixed(2)+"&#8457");
        //Humidity
        $(currentHumidty).html(response.main.humidity+"%");
        //Display Wind
        var ws=response.wind.speed;
        var windsmph=(ws*2.237).toFixed(1);
        $(currentWSpeed).html(windsmph+"MPH");
        //Display UVIndex.
        UVIndex(response.coord.lon,response.coord.lat);
        forecast(response.id);

    });
}

// Display the current and future weather.
function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
}

    //Reference the key again for the UV index specifically
function UVIndex(ln,lt){
    //URL for UV Index
    var uvIndexURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
    //Create HTML request for UV Index
    $.ajax({
            url:uvIndexURL,
            //get method to retrieve data from server
            method:"GET"
            }).then(function(response){
                $(currentUvindex).html(response.value);
            });
}
//Function for the five day forecast
function forecast(cityid){
    //Link for 5 day forecast
    var queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey;
    //Create HTML request for 5 day forecast
    $.ajax({
        url:queryforcastURL,
        //get method to retrieve data from server
        method:"GET"
    }).then(function(response){
        //for loop for 5 day forecast
        for (i=0;i<5;i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var tempKelvin= response.list[((i+1)*8)-1].main.temp;
            //convert temperature to farenheit
            var tempFarenheit=(((tempKelvin-273.5)*1.80)+32).toFixed(2);
            var humidity= response.list[((i+1)*8)-1].main.humidity;
            //Update the date, temp, and humidity
            $("#fDate"+i).html(date);
            $("#fTemp"+i).html(tempFarenheit+"&#8457");
            $("#fHumidity"+i).html(humidity+"%");
        }
        
    });
}

//Click Handler
$("#search-button").on("click",displayWeather);