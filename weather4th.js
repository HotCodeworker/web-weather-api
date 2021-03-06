function Weather4(nx, ny){
    var today = new Date();
    var week = new Array('일','월','화','수','목','금','토');
    var year = today.getFullYear();
    var month = today.getMonth()+1;
    var day = today.getDate();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    console.log("minutes: " + minutes)
    $('.weather-date').html(month + "월 " + day + "일 " + week[today.getDay()]+"요일");
 
    if(minutes < 30){
        hours = hours - 1;
        if(hours < 0){
            today.setDate(today.getDate() - 1);
            day = today.getDate();
            minutes = today.getMonth()+1;
            year = today.getFullYear();
            hours = 23;
        }
    }
    if(hours<10) {
        hours='0'+hours
    }
    if(minutes<10) {
        minutes='0'+minutes
    }
    if(day<10) {
        day='0'+day
    }

    /* 
    ** test for hours because of items's count 
    ** Could not get weather info. when from 05:30 to 08:29.
    */
    //hours = '05';
    console.log(hours);

    var _nx = nx,
    _ny = ny,
    apikey = "API-Key",
    today = year+""+ minutes +""+day,
    basetime = hours + "00",
    ForecastGribURL = "http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData";
    ForecastGribURL += "?ServiceKey=" + apikey;
    ForecastGribURL += "&base_date=" + today;
    ForecastGribURL += "&base_time=" + basetime;
    ForecastGribURL += "&nx=" + _nx + "&ny=" + _ny;
    ForecastGribURL += "&pageNo=1&numOfRows=7";
    ForecastGribURL += "&_type=json";

    httpRequest = new XMLHttpRequest();
    if(!httpRequest) {
        alert('could not create XML-HTTP instance.');
        return false;
    }
    httpRequest.open("GET", ForecastGribURL, true);
    function alertContents() {
        try {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
              alert(httpRequest.responseText);
            } else {
              alert('There was a problem with the request.');
            }
          }
        }
        catch( e ) {
          alert('Caught Exception: ' + e.description);
        }
    }
    //httpRequest.onreadystatechange = alertContents;
    httpRequest.onreadystatechange = function() {
        if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status == 200)
        {
            //alert(httpRequest.responseText);
            var text = httpRequest.responseText;
            text = text.replace(/(<([^>]+)>)/ig,"");
            text = '[' + text + ']';
            
            var jsonObj = JSON.parse(text);
            //console.log(jsonObj);
            if(jsonObj[0].response.body.totalCount != 0){
                var rainsnow = jsonObj[0].response.body.items.item[0].fcstValue;
                var rain_state = jsonObj[0].response.body.items.item[1].fcstValue;
                var rain = jsonObj[0].response.body.items.item[3].fcstValue;
                var sky = jsonObj[0].response.body.items.item[4].fcstValue;
                var temperature = jsonObj[0].response.body.items.item[5].fcstValue;
                
                console.log(rainsnow); // - 
                console.log(rain_state);
                console.log(rain);
                console.log(sky); // -
                console.log(temperature);

                $('.weather-temp').html("Temperature :" + temperature.toFixed(1) + " ℃");
                $('#RN1').html("Rain-capacity per hour : "+ rain +"mm");
            
                if(rain_state != 0) {
                    switch(rain_state) {// when rainny or snowy,
                        case 1:
                        $('.weather-state-text').html("rain");
                            break;
                        case 2:
                            $('.weather-state-text').html("rain/snow");
                            break;
                        case 3:
                            $('.weather-state-text').html("snow");
                            break;
                    }
                }else{
                    switch(sky) { //when not rainny,
                        case 1:
                            $('.weather-state-text').html("good");
                            break;
                        case 2:
                            $('.weather-state-text').html("little cloudy");
                            break;
                        case 3:
                        $('.weather-state-text').html("heavy cloudy");
                            break;
                        case 4:
                        $('.weather-state-text').html("not good");    
                            break;
                    }
                
                    $('.weather-state-text').html("good");  
                }
            }else{
                console.log("Could not get weather info.");
            }
        }
    }
    httpRequest.send();
}