
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $("#street").val();
    var cityStr = $("#city").val();
    var locationStr = streetStr + ", " + cityStr;
    // console.log(locationStr);
    var cityStrEncoded = encodeURI(cityStr);

    loadGoogleImages(locationStr);
    loadNYTimes(locationStr);
    loadWikiArticles(cityStr);
    loadWeatherDetails();
    loadEventBriteDetails();
    return false;
};


// Code to Load the Google Street View Images
var loadGoogleImages = function(locationStr){

    // URL
    var google_url = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + locationStr + '';
    var str = '<img class="bgimg" ' + 'src="' + google_url + '"' + '>' + '';
    $body.append(str);

}

// Code to Load the NYTimes Articles
var loadNYTimes = function(locationStr){

    // API Key needed to call the API methods
    var nyt_key = '';
    var nyt_url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
  
    var parameters = {
        'api-key' : nyt_key,
        'query' : locationStr
    };

    // Using Jquery's AJAX method to make the API calls
    $.ajax({
        url : nyt_url,
        // url : nyt_url + 'abc', // code to deliberately mess the url
        data : parameters,
        success : function( result){
            console.log(result);
            var articles = result.response.docs;
            var article_list = $('#nytimes-articles');

            for (var i = 0; i < articles.length; i++) {
                var article_heading = articles[i].headline.main ;
                var article_link =  articles[i].web_url ;
                var article_para =  articles[i].snippet ;
                var list_item = '<li class="article"><a href=' + '"' + article_link + '"' + '>' + article_heading + '</a>' + '<p>' + article_para + '</p></li>';
                // console.log(list_item);
                article_list.append(list_item);
            };
        }
    })
    .error(function(err){
        // console.log(err);
        console.log('The newyork times artciles could not be loaded.');
        $('.nytimes-container').append('<p>The newyork times articles could not be loaded.</p>');
    });
}



// Code to load wikipedia articles
var loadWikiArticles = function(cityStrEncoded){

    var wiki_url = 'https://www.mediawiki.org/w/api.php?format=json&callback=wikiCallback&action=opensearch&search=' 
                    + cityStrEncoded ;
    
    // Accessing Wikipedia articles lead to CORS, so we handle the CORS requests using the HTTP headers and JSONP
    
    // 1. Using CORS Headers    
    // $.ajax({
    //     url : wiki_url,
    //     success : function(result){
    //         console.log(result);
    //     }
    // });


    // 2. Using JSON-P

    //  var wiki_params = {
    //     'action' : 'query',
    //     'format' : 'json',
    //     'titles' : cityStr,
    //     'prop' : 'revisions',
    //     'rvprop' : 'content'
    // };

    // $.ajax({
    //     url : wiki_url,
    //     dataType : "jsonp",
    //     headers : {
    //         'content-type' : 'application/json',
    //         'accept' : 'application/json'
    //     },
    //     success : function( result){
    //         console.log(result);
    //     }
    // });
}


// XHR Requests to weather API
// Code to load weather details 
var loadWeatherDetails = function(){

     // Using the XHR request object with the weather api
    var hotelLocationStr = encodeURI('London,England');
    var weather_url = 'http://api.openweathermap.org/data/2.5/' ;
    var weatherApiKey = '';
    weather_url += 'weather?q=' + hotelLocationStr + '&appid=' + weatherApiKey ;
    var xhrRequest ;

    if( window.XMLHttpRequest){
        xhrRequest = new XMLHttpRequest();
    }else{
        xhrRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }

    var handleResponse = function(){

        // This code is reached everytime there is a change in the readyState (1,2,3,4)
        // console.log('State :' + xhrRequest.readyState);
       
        if( xhrRequest.readyState === 4) {
            if( xhrRequest.status === 200){
                handleSuccess(xhrRequest.responseText);
            }else{
                handleFailure();
            }
        }
    };

    xhrRequest.onreadystatechange = handleResponse;
    xhrRequest.open('GET', weather_url, true);
    xhrRequest.send();
}


// Handle XHR Success
var handleSuccess = function(responseText){
    // console.log('XHR Response :');
    // console.log(xhrRequest.response);

    var json_response = JSON.parse(responseText);

    // API gives temperatures in Kelvin
    var temp_max = json_response.main.temp_max;
    var temp_min = json_response.main.temp_min;

    // Convert these to celsius
    var temp_max_c = Math.floor(temp_max - 273.15) ;
    var temp_min_c = Math.floor(temp_min - 273.15) ;


    // console.log(max_temp_f);
    // console.log(min_temp_f);

    var $weather_container = $('.wikipedia-container');
    $weather_container.append('<div class="weather-report">');
   
    $weather_container.append('<p>');
    $weather_container.append('Minimum Temperature is ' + temp_min_c);
    $weather_container.append('</p>');
    $weather_container.append('<p>');
    $weather_container.append('Maximum Temperature is ' + temp_max_c);
    $weather_container.append('</p>');
    $weather_container.append('</div>');
}

// Handle XHR error
var handleFailure = function(){
    console.log('Something went wrong!');
}


var loadEventBriteDetails = function(){
    
    // Event Brite API key needed
    var eventBriteApiKey = '';
    

}


$('#form-container').submit(loadData);
