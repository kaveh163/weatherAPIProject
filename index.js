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
        // getForecastData();
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
let storeData = {};
let currentDate;
let currentDataRes;
let UVRes;

async function processData(data) {
    console.log('first');
    currentDataRes = data;
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
    let UVResult = await getUVIndex(latitude, longitude);
    console.log(UVResult);
    UVIndex= getUVData(UVResult);
    getForecastData();
    //to local storage


    //UV Index



}

// let urlQuery = "api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// let urlQuery = "https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=YOUR_API_KEY";
// let urlQuery = "https://api.openweathermap.org/data/2.5/weather?";
let UVIndex;


async function getUVIndex(lat, lon) {
    let res;
    try {
        res = await $.ajax({
            url: `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=ea96ca10dc430cd769f78ede39efa7a1`,
            // url: `http://api.openweathermap.org/v3/uvi/40.7,-74.2/current.json?appid=ea96ca10dc430cd769f78ede39efa7a1`,
            method: 'GET'
        });
    } catch(error) {
        console.log(error);
    }
    return res;

}
        // success: function (res) {
            // console.log(res.value);
            // console.log('second');
            // getUVData(res);

            // UVRes = res;
            // UVIndex = res.value;
            // console.log(UVIndex);
            // let UVIndexVal = $('<li>');
            // UVIndexVal.append('UV Index: ' + '<span id="UVData">' + UVIndex + '</span>');
            // ul.append(UVIndexVal);

            //    to local storage
            //     storeData['currUV'] = UVIndex;

            // console.log('result',resultRes);

            // let getStoreWeather = getCurrWXStorage();
            // if(getStoreWeather === null) {
            //     getStoreWeather = [];
            //     storeData['city'] = data.name;
            //     storeData['currDate'] = currentDate;
            //     storeData['currIcon'] = data.weather[0].icon;
            //     storeData['currTemp'] = data.main.temp;
            //     storeData['currHumidity'] = data.main.humidity;
            //     storeData['currWS'] = data.wind.speed;
            //     // store future data
            //     storeData['futureData'] = {};
            //
            //     getStoreWeather.push(storeData);
            //     setCurrWXStorage(getStoreWeather);
            // } else {
            //     storeData['city'] = data.name;
            //     storeData['currDate'] = currentDate;
            //     storeData['currIcon'] = data.weather[0].icon;
            //     storeData['currTemp'] = data.main.temp;
            //     storeData['currHumidity'] = data.main.humidity;
            //     storeData['currWS'] = data.wind.speed;
            //     getStoreWeather.push(storeData);
            //     setCurrWXStorage(getStoreWeather);
            // }

        // },
        // error: function (xhr, textStatus) {
        //     console.log(`${xhr.status} ${textStatus}`);
        // }




function getUVData(res){
    UVRes = res;
    UVIndex = res.value;
    console.log('second', UVIndex);
    let UVIndexVal = $('<li>');
    UVIndexVal.append('UV Index: ' + '<span id="UVData">' + UVIndex + '</span>');
    ul.append(UVIndexVal);
    return UVIndex;
}
// setCurrWXStorage();

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

let futureDataRes;
let listDataLength;
function processForecastData(result) {
    console.log('third');
    $('#futureInfo').empty();
    futureDataRes = result;
    listDataLength = result.list.length;
    for (let i = 0; i < listDataLength; i++) {
        let dt_txt = result.list[i].dt_txt;
        let forecastDate = new Date(dt_txt);
        let hour = forecastDate.getHours();
        let minutes = forecastDate.getMinutes();
        let seconds = forecastDate.getSeconds();
        if (hour === 0 && minutes === 0 && seconds === 0) {

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
    console.log('future', futureDataRes);
    console.log('current', currentDataRes);
    handleLocalStorage();
    populateSearch();
}
function populateSearch(){
    let weatherArray = getWXStorage();

    let searchHistory = $('#searchHistory');
    searchHistory.empty();
    let searchList = $('<ul>').addClass('list-group');
    searchHistory.append(searchList);
    for(let i=0; i < weatherArray.length; i++){
        let weatherCity = weatherArray[i].city;
        let searchItem = $('<li>').addClass('list-group-item');
        searchList.append(searchItem);
        let listBtn = $('<a class="btn">').attr({'href':'#', 'data-city': weatherCity}).text(weatherCity);
        searchItem.append(listBtn)
    }
}
function setWXStorage(arr) {
    // arr.push(storeData);
    console.log('array1', arr);
    localStorage.setItem('weatherData', JSON.stringify(arr));
}

console.log(storeData);

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
        for(let i=0; i<getWeatherArray.length; i++){
            if(getWeatherArray[i].city === currentDataRes.name){
                storeWeatherData();
                getWeatherArray.splice(i,1,storeData);
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
    console.log('UV',UVIndex);
    storeData['currUV']= UVIndex;
    storeData['futureWeatherArray']= [];
    // storeData['futureWeather']= {};
    // let futureWeather= {};

    // For Loop
    for (let i = 0; i < listDataLength; i++) {
        let dt_txt = futureDataRes.list[i].dt_txt;
        let forecastDate = new Date(dt_txt);
        let hour = forecastDate.getHours();
        let minutes = forecastDate.getMinutes();
        let seconds = forecastDate.getSeconds();
        if (hour === 0 && minutes === 0 && seconds === 0) {
            let futureWeather= futureWX();
            function futureWX(){
                return {
                    'futDayPred': '',
                    'futIconCode': '',
                    'futTemp': 0,
                    'futHumidity':0
                }
            }
            let forecastDay = forecastDate.toLocaleDateString();
            futureWeather['futDayPred'] = forecastDay;
            // console.log('forecast',forecastDay);

            let weatherIconCode = futureDataRes.list[i].weather[0].icon;
            futureWeather['futIconCode'] = weatherIconCode;
            // console.log('icon',weatherIconCode);



            let tempForecast = futureDataRes.list[i].main.temp;
            futureWeather['futTemp'] = tempForecast;

            // console.log('temperature',tempForecast);


            let humidityForecast = futureDataRes.list[i].main.humidity;
            futureWeather['futHumidity'] = humidityForecast;

            // storeData['futureWeatherArray']= [{...futureWeather}];
            storeData['futureWeatherArray'].push(futureWeather);
            // console.log('humidity', humidityForecast);
        }
    }

}
$(document).on('click', 'li .btn', function(event){
    event.preventDefault();
    let dataCity = $(this).attr('data-city');
    // console.log(dataCity);
    let getWeather = getWXStorage();
    console.log('getWeather', getWeather);
    for(let i=0; i< getWeather.length; i++){
        if(getWeather[i].city === dataCity) {

            $('#currentCond').empty();
            // print city and date

            let city = '<span id="city">' + getWeather[i].city + ' ' + '(' + getWeather[i].currDate + ')' + '</span>';

            // print image icon

            let Wrapper = $('<div>');
            Wrapper.append(city);

            // console.log(date.toLocaleDateString());
            let img = $('<img src="" alt="weatherCondition">');
            let iconCode = getWeather[i].currIcon;
            let iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
            img.attr('src', iconUrl);
            Wrapper.append(img);
            $('#currentCond').append(Wrapper);

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
            Temp.append(`Temperature: ${getWeather[i].currTemp}&#8457;`);
            ul.append(Temp);
            let Humidity = $('<li>');
            Humidity.text('Humidity: ' + getWeather[i].currHumidity + '%');
            ul.append(Humidity);
            let windSpeed = $('<li>');
            windSpeed.text('Wind Speed: ' + getWeather[i].currWS + 'MPH');
            ul.append(windSpeed);
            // console.log(data.coord.lat);
            let UVIndexVal = $('<li>');
            UVIndexVal.append('UV Index: ' + '<span id="UVData">' + getWeather[i].currUV + '</span>');
            ul.append(UVIndexVal);


        // populate five day forecast
            $('#futureInfo').empty();
            let futureWXArr = getWeather[i].futureWeatherArray;
            let futureWXDay = getWeather[i].futureWeatherArray[0].futDayPred;
            console.log('5',futureWXDay);
            console.log(futureWXArr);
            console.log(futureWXArr.length);
            for(let j=0; j < getWeather[i].futureWeatherArray.length; j++){
                let futDay =  getWeather[i].futureWeatherArray[j].futDayPred;
                let futIconCode =  getWeather[i].futureWeatherArray[j].futIconCode;
                let futTemp =  getWeather[i].futureWeatherArray[j].futTemp;
                let futHumidity =  getWeather[i].futureWeatherArray[j].futHumidity;


                let cards = $('<div>').addClass('card bg-primary');
                $('#futureInfo').append(cards);
                let cardBody = $('<div>').addClass('card-body');
                cards.append(cardBody);
                let futureDate = $('<p>').addClass('card-text font-weight-bold');
                let forecastDay = futDay;
                futureDate.text(forecastDay);
                cardBody.append(futureDate);
                // console.log(forecastDay);

                let weatherIcon = $('<img src="" alt="WeatherIcon">');
                let weatherIconCode = futIconCode;
                let weatherIconUrl = "http://openweathermap.org/img/wn/" + weatherIconCode + ".png";
                weatherIcon.attr('src', weatherIconUrl);
                cardBody.append(weatherIcon);

                let temperature = $('<p>').addClass('card-text');
                let tempForecast = futTemp;
                temperature.append(`Temp: ${tempForecast} &#8457;`);
                cardBody.append(temperature);
                // console.log(tempForecast);

                let humidityCond = $('<p>').addClass('card-text');
                let humidityForecast = futHumidity;
                humidityCond.text(`Humidity: ${humidityForecast}%`);
                cardBody.append(humidityCond);



            }


        }
    }

});