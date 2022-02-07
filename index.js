let inputValue;
let obj;

$(function () {
    //Load weather values at start
    loadValues();
    //Search button section
    $('#search').on('click', function (event) {
        event.preventDefault();
        inputValue = $('#inputVal').val();
        obj = {
            q: inputValue,
            appid: 'ea96ca10dc430cd769f78ede39efa7a1',
            units: 'imperial'
        };

        getWeatherData();


    });


});
//Get Weather Api URL for Current Weather
function getUrlApi() {
    let urlQuery = "https://api.openweathermap.org/data/2.5/weather?";
    let urlParams = $.param(obj);
    urlQuery = urlQuery + urlParams;
    return urlQuery;
}
//Get Current Weather Data from Weather Api
function getWeatherData() {
    $.ajax({
        url: getUrlApi(),
        method: 'GET',
        success: function (data, textStatus) {
            processData(data);



        },
        error: function (xhr, textStatus) {
            console.log(`${xhr.status} ${textStatus}`)
        }
    });
}

let ul;

// localStorage Array-Obj
let storeCurrentArray = [];
let storeData = {};
let currentDate;
let currentDataRes;
let UVRes;

async function processData(data) {
    console.log('first');
    currentDataRes = data;

    $('#currentCond').empty();
    // print city and date
    let dt = data.dt;

    let date = new Date(dt * 1000);
    let city = '<span id="city">' + data.name + ' ' + '(' + date.toLocaleDateString() + ')' + '</span>';
    currentDate = date.toLocaleDateString();
    // print image icon

    const imgWrapper = $('<div>');
    imgWrapper.append(city);


    const img = $('<img src="" alt="weatherCondition">');
    let iconCode = data.weather[0].icon;
    console.log('iconCode', iconCode);
    let iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
    img.attr('src', iconUrl);
    imgWrapper.append(img);
    $('#currentCond').append(imgWrapper);

    // print Temp conditions

    ul = $('<ul>');
    ul.addClass('list-unstyled');
    ul.css('line-height', '3');

    $('#currentCond').append(ul);


    let Temp = $('<li>');

    Temp.append(`Temperature: ${data.main.temp}&#8457;`);
    ul.append(Temp);
    //Print Humidity Conditions
    let Humidity = $('<li>');
    Humidity.text('Humidity: ' + data.main.humidity + '%');
    ul.append(Humidity);
    //Print Wind Speed Conditions
    let windSpeed = $('<li>');
    windSpeed.text('Wind Speed: ' + data.wind.speed + 'MPH');
    ul.append(windSpeed);
    //Get latitude and longitude
    let latitude = data.coord.lat;
    console.log('latitude', latitude);

    let longitude = data.coord.lon;
    console.log('longitude', longitude);
    //Get UV Result
    let UVResult = await getUVIndex(latitude, longitude);
    console.log(UVResult);
    //Print UV Result
    UVIndex = getUVData(UVResult);
    getForecastData();


}


let UVIndex;


async function getUVIndex(lat, lon) {
    let res;
    try {
        res = await $.ajax({
            url: `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=ea96ca10dc430cd769f78ede39efa7a1`,

            method: 'GET'
        });
    } catch (error) {
        console.log(error);
    }
    return res;

}

//Print UV Result
function getUVData(res) {
    UVRes = res;
    UVIndex = res.value;
    console.log('second', UVIndex);
    let UVIndexVal = $('<li>');
    UVIndexVal.append('UV Index: ' + '<span id="UVData">' + UVIndex + '</span>');
    ul.append(UVIndexVal);
    return UVIndex;
}

//Get Weather Api forecast Url
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

            processForecastData(result);
        },
        error: function (xhr, textStatus) {
            console.log(`${xhr.status} ${textStatus}`)
        }
    });
}

let futureDataRes;
let listDataLength;

function processForecastData(result) {
    console.log('third');
    let html = '';
    $('#futureInfo').empty();
    futureDataRes = result;
    listDataLength = result.list.length;
    for (let i = 0; i < listDataLength; i++) {
        let dt_txt = result.list[i].dt_txt;
        let forecastDate = new Date(dt_txt);
        let hour = forecastDate.getHours();
        let minutes = forecastDate.getMinutes();
        let seconds = forecastDate.getSeconds();
        let tempForecast = result.list[i].main.temp;
        console.log(tempForecast);
        if (hour === 0 && minutes === 0 && seconds === 0) {
            let forecastDay = forecastDate.toLocaleDateString();
            let weatherIconCode = result.list[i].weather[0].icon;
            let weatherIconUrl = "https://openweathermap.org/img/wn/" + weatherIconCode + ".png";
            let humidityForecast = result.list[i].main.humidity;
            //populate 5 weather Forecast
            html += '<div class="col">'
            html += '<div class="card cardSize bg-primary">'
            html += '<div class="card-body center">'
            html += `<p class="font-weight-bold">${forecastDay}</p>`
            html += `<img src="${weatherIconUrl}" alt="WeatherIcon">`
            html += `<p class="">Temp: ${tempForecast} &#8457;</p>`
            html += `<p class="">Humidity: ${humidityForecast}%</p>`
            html += '</div>'
            html += '</div>'
            html += '</div>';

            // let column = $('<div class="col">');
            // $('#futureInfo').append(column);
            // let cards = $('<div class="card">');
            // column.append(cards);
            // let cardBody = $('<div>').addClass('card-body');
            // cards.append(cardBody);
            // let futureDate = $('<p>').addClass('card-text font-weight-bold');

            // futureDate.text(forecastDay);
            // cardBody.append(futureDate);


            // let weatherIcon = $('<img src="" alt="WeatherIcon">');
            // let weatherIconCode = result.list[i].weather[0].icon;
            // let weatherIconUrl = "https://openweathermap.org/img/wn/" + weatherIconCode + ".png";
            // weatherIcon.attr('src', weatherIconUrl);
            // cardBody.append(weatherIcon);

            // let temperature = $('<p>').addClass('card-text');
            // let tempForecast = result.list[i].main.temp;
            // temperature.append(`Temp: ${tempForecast} &#8457;`);
            // cardBody.append(temperature);


            // let humidityCond = $('<p>').addClass('card-text');
            // let humidityForecast = result.list[i].main.humidity;
            // humidityCond.text(`Humidity: ${humidityForecast}%`);
            // cardBody.append(humidityCond);

        }

    }
    $('#futureInfo').append(html);

    handleLocalStorage();
    populateSearch();
}

function populateSearch() {
    let weatherArray = getWXStorage();

    let searchHistory = $('#searchHistory');
    searchHistory.empty();
    let searchList = $('<ul>').addClass('list-group');
    searchHistory.append(searchList);
    for (let i = 0; i < weatherArray.length; i++) {
        let weatherCity = weatherArray[i].city;
        let searchItem = $('<li>').addClass('list-group-item');
        searchList.append(searchItem);
        let listBtn = $('<a class="btn">').attr({
            'href': '#',
            'data-city': weatherCity
        }).text(weatherCity);
        searchItem.append(listBtn)
    }
}

function setWXStorage(arr) {


    localStorage.setItem('weatherData', JSON.stringify(arr));
}


function getWXStorage() {
    return JSON.parse(localStorage.getItem('weatherData'));
}

function handleLocalStorage() {
    let getWeatherArray = getWXStorage();
    if (getWeatherArray === null) {
        getWeatherArray = [];
        storeWeatherData();
        getWeatherArray.push(storeData);
        setWXStorage(getWeatherArray);
    } else {
        for (let i = 0; i < getWeatherArray.length; i++) {
            if (getWeatherArray[i].city === currentDataRes.name) {
                storeWeatherData();
                getWeatherArray.splice(i, 1, storeData);
                setWXStorage(getWeatherArray);
                return;
            }
        }
        storeWeatherData();
        getWeatherArray.push(storeData);
        setWXStorage(getWeatherArray);
    }

}

function storeWeatherData() {
    storeData['city'] = currentDataRes.name;
    storeData['currDate'] = currentDate;
    storeData['currIcon'] = currentDataRes.weather[0].icon;
    storeData['currTemp'] = currentDataRes.main.temp;
    storeData['currHumidity'] = currentDataRes.main.humidity;
    storeData['currWS'] = currentDataRes.wind.speed;
    console.log('UV', UVIndex);
    storeData['currUV'] = UVIndex;
    storeData['futureWeatherArray'] = [];


    // For Loop
    for (let i = 0; i < listDataLength; i++) {
        let dt_txt = futureDataRes.list[i].dt_txt;
        let forecastDate = new Date(dt_txt);
        let hour = forecastDate.getHours();
        let minutes = forecastDate.getMinutes();
        let seconds = forecastDate.getSeconds();
        if (hour === 0 && minutes === 0 && seconds === 0) {
            let futureWeather = futureWX();

            function futureWX() {
                return {
                    'futDayPred': '',
                    'futIconCode': '',
                    'futTemp': 0,
                    'futHumidity': 0
                }
            }

            let forecastDay = forecastDate.toLocaleDateString();
            futureWeather['futDayPred'] = forecastDay;


            let weatherIconCode = futureDataRes.list[i].weather[0].icon;
            futureWeather['futIconCode'] = weatherIconCode;


            let tempForecast = futureDataRes.list[i].main.temp;
            futureWeather['futTemp'] = tempForecast;


            let humidityForecast = futureDataRes.list[i].main.humidity;
            futureWeather['futHumidity'] = humidityForecast;


            storeData['futureWeatherArray'].push(futureWeather);

        }
    }

}
// Handle Search History Cities
$(document).on('click', 'li .btn', function (event) {
    event.preventDefault();
    let dataCity = $(this).attr('data-city');

    let getWeather = getWXStorage();

    for (let i = 0; i < getWeather.length; i++) {
        if (getWeather[i].city === dataCity) {

            $('#currentCond').empty();
            // print city and date

            let city = '<span id="city">' + getWeather[i].city + ' ' + '(' + getWeather[i].currDate + ')' + '</span>';

            // print image icon

            let Wrapper = $('<div>');
            Wrapper.append(city);


            let img = $('<img src="" alt="weatherCondition">');
            let iconCode = getWeather[i].currIcon;
            let iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
            img.attr('src', iconUrl);
            Wrapper.append(img);
            $('#currentCond').append(Wrapper);

            // print Temp conditions

            ul = $('<ul>');
            ul.addClass('list-unstyled');
            ul.css('line-height', '3');

            $('#currentCond').append(ul);


            let Temp = $('<li>');

            Temp.append(`Temperature: ${getWeather[i].currTemp}&#8457;`);
            ul.append(Temp);
            let Humidity = $('<li>');
            Humidity.text('Humidity: ' + getWeather[i].currHumidity + '%');
            ul.append(Humidity);
            let windSpeed = $('<li>');
            windSpeed.text('Wind Speed: ' + getWeather[i].currWS + 'MPH');
            ul.append(windSpeed);

            let UVIndexVal = $('<li>');
            UVIndexVal.append('UV Index: ' + '<span id="UVData">' + getWeather[i].currUV + '</span>');
            ul.append(UVIndexVal);


            // populate five day forecast
            let html = '';
            $('#futureInfo').empty();
            let futureWXArr = getWeather[i].futureWeatherArray;


            for (let j = 0; j < getWeather[i].futureWeatherArray.length; j++) {
                let futDay = getWeather[i].futureWeatherArray[j].futDayPred;
                let futIconCode = getWeather[i].futureWeatherArray[j].futIconCode;
                let futTemp = getWeather[i].futureWeatherArray[j].futTemp;
                let futHumidity = getWeather[i].futureWeatherArray[j].futHumidity;
                let forecastDay = futDay;
                let weatherIconCode = futIconCode;
                let weatherIconUrl = "https://openweathermap.org/img/wn/" + weatherIconCode + ".png";
                let tempForecast = futTemp;
                let humidityForecast = futHumidity;
                html += '<div class="col">'
                html += '<div class="card cardSize bg-primary">'
                html += '<div class="card-body center">'
                html += `<p class="font-weight-bold">${forecastDay}</p>`
                html += `<img src="${weatherIconUrl}" alt="WeatherIcon">`
                html += `<p class="">Temp: ${tempForecast} &#8457;</p>`
                html += `<p class="">Humidity: ${humidityForecast}%</p>`
                html += '</div>'
                html += '</div>'
                html += '</div>';


                // Html += '<div class="col">'
                // Html += '<div class="card">'
                // Html += '<div class="card-body">'
                // Html += `<p class="font-weight-bold">${forecastDay}</p>`
                // Html += `<img src="${weatherIconUrl}" alt="WeatherIcon">`
                // Html += `<p>Temp: ${tempForecast} &#8457;</p>`
                // Html += `<p>Humidity: ${humidityForecast}%</p>`
                // Html += '<div>'
                // Html += '</div>'
                // Html += '</div>'
                // let cards = $('<div>').addClass('card bg-primary');
                // $('#futureInfo').append(cards);
                // let cardBody = $('<div>').addClass('card-body');
                // cards.append(cardBody);
                // let futureDate = $('<p>').addClass('card-text font-weight-bold');
                // let forecastDay = futDay;
                // futureDate.text(forecastDay);
                // cardBody.append(futureDate);


                // let weatherIcon = $('<img src="" alt="WeatherIcon">');
                // let weatherIconCode = futIconCode;
                // let weatherIconUrl = "https://openweathermap.org/img/wn/" + weatherIconCode + ".png";
                // weatherIcon.attr('src', weatherIconUrl);
                // cardBody.append(weatherIcon);

                // let temperature = $('<p>').addClass('card-text');
                // let tempForecast = futTemp;
                // temperature.append(`Temp: ${tempForecast} &#8457;`);
                // cardBody.append(temperature);


                // let humidityCond = $('<p>').addClass('card-text');
                // let humidityForecast = futHumidity;
                // humidityCond.text(`Humidity: ${humidityForecast}%`);
                // cardBody.append(humidityCond);


            }
            $('#futureInfo').append(html);

        }
    }

});

//Load Values when refresh
function loadValues() {
    let getWeather = getWXStorage();
    if (getWeather != null) {
        let lastSearch = getWeather.pop();

        $('#currentCond').empty();

        //populate load values
        let city = '<span id="city">' + lastSearch.city + ' ' + '(' + lastSearch.currDate + ')' + '</span>';

        // print image icon

        let Wrapper = $('<div>');
        Wrapper.append(city);


        let img = $('<img src="" alt="weatherCondition">');
        let iconCode = lastSearch.currIcon;
        let iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
        img.attr('src', iconUrl);
        Wrapper.append(img);
        $('#currentCond').append(Wrapper);

        // print Temp conditions

        ul = $('<ul>');
        ul.addClass('list-unstyled');
        ul.css('line-height', '3');

        $('#currentCond').append(ul);


        let Temp = $('<li>');

        Temp.append(`Temperature: ${lastSearch.currTemp}&#8457;`);
        ul.append(Temp);

        //print Humidity Conditions
        let Humidity = $('<li>');
        Humidity.text('Humidity: ' + lastSearch.currHumidity + '%');
        ul.append(Humidity);
        //print windSpeed Conditions
        let windSpeed = $('<li>');
        windSpeed.text('Wind Speed: ' + lastSearch.currWS + 'MPH');
        ul.append(windSpeed);
        //print UV Value
        let UVIndexVal = $('<li>');
        UVIndexVal.append('UV Index: ' + '<span id="UVData">' + lastSearch.currUV + '</span>');
        ul.append(UVIndexVal);


        // populate five day forecast
        let html = '';
        $('#futureInfo').empty();
        let futureWXArr = lastSearch.futureWeatherArray;


        for (let j = 0; j < lastSearch.futureWeatherArray.length; j++) {
            let futDay = lastSearch.futureWeatherArray[j].futDayPred;
            let futIconCode = lastSearch.futureWeatherArray[j].futIconCode;
            let futTemp = lastSearch.futureWeatherArray[j].futTemp;
            let futHumidity = lastSearch.futureWeatherArray[j].futHumidity;
            let forecastDay = futDay;
            let weatherIconCode = futIconCode;
            let weatherIconUrl = "https://openweathermap.org/img/wn/" + weatherIconCode + ".png";
            let tempForecast = futTemp;
            let humidityForecast = futHumidity;
            html += '<div class="col">'
            html += '<div class="card cardSize bg-primary">'
            html += '<div class="card-body center">'
            html += `<p class="font-weight-bold">${forecastDay}</p>`
            html += `<img src="${weatherIconUrl}" alt="WeatherIcon">`
            html += `<p class="">Temp: ${tempForecast} &#8457;</p>`
            html += `<p class="">Humidity: ${humidityForecast}%</p>`
            html += '</div>'
            html += '</div>'
            html += '</div>';


            // let cards = $('<div>').addClass('card bg-primary');
            // $('#futureInfo').append(cards);
            // let cardBody = $('<div>').addClass('card-body');
            // cards.append(cardBody);
            // let futureDate = $('<p>').addClass('card-text font-weight-bold');
            // let forecastDay = futDay;
            // futureDate.text(forecastDay);
            // cardBody.append(futureDate);


            // let weatherIcon = $('<img src="" alt="WeatherIcon">');
            // let weatherIconCode = futIconCode;
            // let weatherIconUrl = "https://openweathermap.org/img/wn/" + weatherIconCode + ".png";
            // weatherIcon.attr('src', weatherIconUrl);
            // cardBody.append(weatherIcon);

            // let temperature = $('<p>').addClass('card-text');
            // let tempForecast = futTemp;
            // temperature.append(`Temp: ${tempForecast} &#8457;`);
            // cardBody.append(temperature);


            // let humidityCond = $('<p>').addClass('card-text');
            // let humidityForecast = futHumidity;
            // humidityCond.text(`Humidity: ${humidityForecast}%`);
            // cardBody.append(humidityCond);


        }
        $('#futureInfo').append(html);
        populateSearch();
    }

}