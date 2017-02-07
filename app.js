var twitchUrl = 'https://api.twitch.tv/kraken/streams/';

function getDataFromApi(searchTerm, callback) {
    $.ajax({
        type: 'get',
        url: 'https://api.twitch.tv/kraken/streams/' + searchTerm,
        headers: {
            'Client-ID': 'knitvus66epty3tdv3ym9grcz2iktk'
        },
        success: callback
    });
}

//if no results, display no results
//if result, but isn't streaming, say channel is not streaming
//if result, and is streaming, say channel is streaming and post link
//if results, show each one, showing whether it's streaming or not
function displayResults(data) {
    var results = '';
    console.log(data);
    if (data.stream === null) {
        results = '<p>No :(</p><p>Check later!</p>';
    }
    else {
        results = '<p>Yes! :D</p><a href="' + data.stream.channel.url + '"><p>Do you want to check it out?</p></a>';
    }
    $('.results').html(results);
}

function enterKey() {
    $('.query').keyup(function(e) {
        if(e.keyCode == 13) {
            $('.user-input').click();
        }
    })
}

function getSearch() {
    $('.user-input').submit(function(e) {
        e.preventDefault();
        var query = $(this).find('.query').val();
        getDataFromApi(query, displayResults);
    });
}

function print(test) {
    console.log(test);
}

$(document).ready(function(){
    enterKey();
    getSearch();
});