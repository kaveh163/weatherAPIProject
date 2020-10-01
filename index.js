let inputValue;
let obj;

$(function () {

    $('#search').on('click', function (event) {
        event.preventDefault();
        inputValue = $('#inputVal').val();
        obj = {
            q: inputValue,
            appid: 'ea96ca10dc430cd769f78ede39efa7a1',
            units: 'imperial'
        };
        getForecastData();
        getWeatherData();
        // getForecastData();

    });


});

function getUrlApi() {
    let urlQuery = "https://api.openweathermap.org/data/2.5/weather?";
    let urlParams = $.param(obj);
    urlQuery = urlQuery + urlParams;
    return urlQuery;
}

function getWeatherData() {
    $.ajax({
        url: getUrlApi(),
        method: 'GET',
        success: function (data, textStatus) {
            processData(data);
            // $('#currentCond').text(data.weather[0].icon);
        },
        error: function (xhr, textStatus) {
            console.log(`${xhr.status} ${textStatus}`)
        }
    });
}

let ul;

// localStorage
let storeCurrentArray = [];
let storeCurrentData = {};
let currentDate;
function processData(data) {
    let dataRes = data;
    // console.log(data);
    $('#currentCond').empty();
    // print city and date
    let dt = data.dt;
    // console.log(dt);
    let date = new Date(dt * 1000);
    let city = '<span id="city">' + data.name + ' ' + '(' + date.toLocaleDateString() + ')' + '</span>';
    currentDate = date.toLocaleDateString();
    // print image icon

    const imgWrapper = $('<div>');
    imgWrapper.append(city);

    // console.log(date.toLocaleDateString());
    const img = $('<img src="" alt="weatherCondition">');
    let iconCode = data.weather[0].icon;
    let iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
    img.attr('src', iconUrl);
    imgWrapper.append(img);
    $('#currentCond').append(imgWrapper);

    // print Temp conditions

    ul = $('<ul>');
    ul.addClass('list-unstyled');
    ul.css('line-height', '3');

    $('#currentCond').append(ul);

    // let Temp = $('<li>').text(`Temperature: ${data.main.temp} ${&#8457;}`);
    let Temp = $('<li>');
    // Temp.attr('value', '' + String.fromCharCode(176));
    // Temp.text($(Temp).attr('value'));
    // Temp.append('&deg;');
    Temp.append(`Temperature: ${data.main.temp}&#8457;`);
    ul.append(Temp);
    let Humidity = $('<li>');
    Humidity.text('Humidity: ' + data.main.humidity + '%');
    ul.append(Humidity);
    let windSpeed = $('<li>');
    windSpeed.text('Wind Speed: ' + data.wind.speed + 'MPH');
    ul.append(windSpeed);
    // console.log(data.coord.lat);
    let latitude = data.coord.lat;
    // console.log(data.coord.lon);
    let longitude = data.coord.lon;

    //to local storage
    // storeCurrentData['city'] = data.name;
    // storeCurrentData['currDate'] = currentDate;
    // storeCurrentData['currIcon'] = data.weather[0].icon;
    // storeCurrentData['currTemp'] = data.main.temp;
    // storeCurrentData['currHumidity'] = data.main.humidity;
    // storeCurrentData['currWS'] = data.wind.speed;

    //UV Index
    getUVIndex(latitude, longitude, dataRes);


}

// let urlQuery = "api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// let urlQuery = "https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=YOUR_API_KEY";
// let urlQuery = "https://api.openweathermap.org/data/2.5/weather?";

function getUVIndex(lat, lon, data) {
    // let response;

    $.ajax({
        url: `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=ea96ca10dc430cd769f78ede39efa7a1`,
        // url: `http://api.openweathermap.org/v3/uvi/40.7,-74.2/current.json?appid=ea96ca10dc430cd769f78ede39efa7a1`,
        method: 'GET',
        success: function (res) {
            // console.log(res.value);
            let UVIndex = res.value;
            // console.log(UVIndex);
            let UVIndexVal = $('<li>');
            UVIndexVal.append('UV Index: ' + '<span id="UVData">' + UVIndex + '</span>');
            ul.append(UVIndexVal);
        //    to local storage
            storeCurrentData['currUV'] = UVIndex;

            console.log('result',resultRes);

            let getStoreWeather = getCurrWXStorage();
            if(getStoreWeather === null) {
                getStoreWeather = [];
                storeCurrentData['city'] = data.name;
                storeCurrentData['currDate'] = currentDate;
                storeCurrentData['currIcon'] = data.weather[0].icon;
                storeCurrentData['currTemp'] = data.main.temp;
                storeCurrentData['currHumidity'] = data.main.humidity;
                storeCurrentData['currWS'] = data.wind.speed;
                getStoreWeather.push(storeCurrentData);
                setCurrWXStorage(getStoreWeather);
            } else {
                storeCurrentData['city'] = data.name;
                storeCurrentData['currDate'] = currentDate;
                storeCurrentData['currIcon'] = data.weather[0].icon;
                storeCurrentData['currTemp'] = data.main.temp;
                storeCurrentData['currHumidity'] = data.main.humidity;
                storeCurrentData['currWS'] = data.wind.speed;
                getStoreWeather.push(storeCurrentData);
                setCurrWXStorage(getStoreWeather);
            }

        },
        error: function (xhr, textStatus) {
            console.log(`${xhr.status} ${textStatus}`);
        }

    });

}
// setCurrWXStorage();
function setCurrWXStorage(arr){
    // arr.push(storeCurrentData);
    console.log('array1',arr);
    localStorage.setItem('currData', JSON.stringify(arr));
}
console.log(storeCurrentData);
function getCurrWXStorage(){
    return JSON.parse(localStorage.getItem('currData'));
}
function getForecastUrlApi() {
    let urlForecastQuery = "https://api.openweathermap.org/data/2.5/forecast?";
    let urlParams = $.param(obj);
    urlForecastQuery = urlForecastQuery + urlParams;
    return urlForecastQuery;
}

function getForecastData() {
    $.ajax({
        url: getForecastUrlApi(),
        method: 'GET',
        success: function (result) {
            // console.log(result);
            processForecastData(result);
        },
        error: function (xhr, textStatus) {
            console.log(`${xhr.status} ${textStatus}`)
        }
    });
}
let resultRes;
function processForecastData(result) {
    resultRes = result;
    const listDataLength = result.list.length;
    for (let i = 0; i < listDataLength; i++) {
        let dt_txt= result.list[i].dt_txt;
        let forecastDate = new Date(dt_txt);
        let hour = forecastDate.getHours();
        let minutes = forecastDate.getMinutes();
        let seconds = forecastDate.getSeconds();
        if(hour === 0 && minutes === 0 && seconds === 0){
            let cards = $('<div>').addClass('card bg-primary');
            $('#futureInfo').append(cards);
            let cardBody = $('<div>').addClass('card-body');
            cards.append(cardBody);
            let futureDate = $('<p>').addClass('card-text font-weight-bold');
            let forecastDay = forecastDate.toLocaleDateString();
            futureDate.text(forecastDay);
            cardBody.append(futureDate);
            // console.log(forecastDay);

            let weatherIcon = $('<img src="" alt="WeatherIcon">');
            let weatherIconCode = result.list[i].weather[0].icon;
            let weatherIconUrl = "http://openweathermap.org/img/wn/" + weatherIconCode + ".png";
            weatherIcon.attr('src', weatherIconUrl);
            cardBody.append(weatherIcon);

            let temperature = $('<p>').addClass('card-text');
            let tempForecast = result.list[i].main.temp;
            temperature.append(`Temp: ${tempForecast} &#8457;`);
            cardBody.append(temperature);
            // console.log(tempForecast);

            let humidityCond = $('<p>').addClass('card-text');
            let humidityForecast = result.list[i].main.humidity;
            humidityCond.text(`Humidity: ${humidityForecast}%`);
            cardBody.append(humidityCond);
            // console.log(humidityForecast);
        }
    }
}