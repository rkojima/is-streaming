var twitchUrl = 'https://api.twitch.tv/kraken/streams/';

//local storage

var state = {
    channels: JSON.parse(localStorage.getItem('storedChanels')) || [],
};

function getDataFromApi(searchTerm, callback) { //chan1, chan2
    if (!state.channels.includes(searchTerm)) {
        state.channels.push(searchTerm);
        localStorage.setItem('storedChannels', JSON.stringify(state.channels));
    }
    $.ajax({
        type: 'get',
        url: 'https://api.twitch.tv/kraken/streams/',
        data: {
            channel: state.channels.join(),
        },
        headers: {
            'Client-ID': 'knitvus66epty3tdv3ym9grcz2iktk'
        },
        stream_type: 'all',
        success: callback
    });
}

//if no results, display no results
//if result, but isn't streaming, say channel is not streaming
//if result, and is streaming, say channel is streaming and post link
//if results, show each one, showing whether it's streaming or not
function displayResults(callbackResults) {
    var onlineChannels = callbackResults.streams.map(function(stream) {
        return stream.channel.name;
    });
    /*var onlineChannelLinks = callbackResults.streams.map(function(stream) {
        return stream.channel.url;
    });
    */
    var results = '';
    //console.log(callbackResults);
    //console.log(state.channels);
    state.channels.forEach(function(name) {
        if (onlineChannels.includes(name)) {
            var channelObject = callbackResults.streams.find(function(stream){ return stream.channel.name === name; });
            //change results here
            results += '<p class="result">' + name + ': </p>' + '<a href="' + channelObject.channel.url + '" target="_blank">' + 
            '<button type="button" class="btn btn-success">Online!</button>' + '</a><br>';
        }
        else {
            //stream is not online, change results accordingly
            results +='<p class="result">' + name + ': </p>' + '<button type="button" class="btn btn-danger">Offline</button><br>';
        }
    });
    $('.results').html(results);
    /*state.channels.forEach(function(chan) {
        callbackResults.streams.forEach(function(elem) {
            var currChannel = elem.channel.name;
            console.log(currChannel);
            console.log(chan);
            if(chan === currChannel) {
                //add to result
            }
        //do something here so that it shows that there wasn't a match
        });
    });
    */

    //for each searchTerm, go through the callbackResults.stream and for each stream, check if channel name corresponds.
    //if no name that matches, then person is offline. if name matches, then online. 

    /*if (callbackResults.stream === null) {
        results = '<p>No :(</p><p>Check later!</p>';
    }
    else {
        results = '<p>Yes! :D</p><a href="' + callbackResults.stream.channel.url + '"><p>Do you want to check it out?</p></a>';
    }
    $('.results').html(results);
    */
}

//REVISIONS
//FIXED immediately start at search instead of having to click on textbox
//save state, save what they search, show whether saved searches are live or not
//check whether search was actually of a user or not
//have ability to remove saved streams
//local storage to store directly in browser
//ability to cross off streamers that you do not want to keep track of


function enterKey() {
    $('.query').keyup(function(e) {
        if(e.keyCode == 13) {
            $('.user-input').click();
        }
    });
}

function searchStored() {
    //getDataFromApi(, displayResults);
}

function getSearch() {
    $('.user-input').submit(function(e) {
        e.preventDefault();
        var query = $(this).find('.query').val();
        getDataFromApi(query, displayResults);
    });
}

$(document).ready(function(){
    $('.query').focus();
    enterKey();
    searchStored();
    getSearch();
});