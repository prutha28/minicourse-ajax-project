
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // code to load streetview

    var streetStr = $("#street").val();
    var cityStr = $("#city").val();
    var locationStr = streetStr + ", " + cityStr;
    // console.log(locationStr);
    var url = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + locationStr + '';
    var str = '<img class="bgimg" ' + 'src="' + url + '"' + '>' + '';
    $body.append(str);

    // code to load nytimes articles
    var key = "*****************************";
    var nyt_url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    var parameters = {
        'api-key' : key,
        'query' : locationStr
    };

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



    // Code to load wikipedia articles
    // 1. Using CORS Headers
    var wiki_url = 'https://www.mediawiki.org/w/api.php';
    var cityStrEncoded = encodeURI(cityStr);
    var headers = {
        'origin' :'http://152.7.224.3:80/',
        'user-agent' : 'prutha.bits@gmail.com'
    };

    var wiki_params = {
        'action' : 'query',
        'format' : 'json',
        'titles' : cityStrEncoded,
        'prop' : 'revisions',
        'rvprop' : 'content',
        'headers' : headers
    };

    // $.ajax({
    //     url : wiki_url,
    //     data : wiki_params,
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

    var wiki_url_1 = 'https://www.mediawiki.org/w/api.php?format=json&callback=wikiCallback&action=opensearch&search=' + cityStrEncoded ;
    console.log(wiki_url_1);
    $.ajax({
        url : wiki_url,
        dataType : "jsonp",
        headers : {
            'content-type' : 'application/json',
            'accept' : 'application/json'
        },
        success : function( result){
            console.log(result);
        }
    });

    return false;
};

$('#form-container').submit(loadData);
