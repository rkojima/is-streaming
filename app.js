var twitchUrl = 'https://api.twitch.tv/kraken/streams/';

var state = {
    channels: [],
};

function getDataFromApi(searchTerm, callback) {
    $.ajax({
        type: 'get',
        url: 'https://api.twitch.tv/kraken/streams/' + searchTerm,
        headers: {
            'Client-ID': 'knitvus66epty3tdv3ym9grcz2iktk'
        },
        stream_type: 'live',
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

//REVISIONS
//FIXED immediately start at search instead of having to click on textbox
//save state, save what they search, show whether saved searches are live or not
//check whether search was actually of a user or not
//have ability to remove saved streams
//local storage to store directly in browser


function enterKey() {
    $('.query').keyup(function(e) {
        if(e.keyCode == 13) {
            $('.user-input').click();
        }
    });
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
    $('.query').focus();
    enterKey();
    getSearch();
});