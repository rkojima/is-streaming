var twitchUrl = 'https://api.twitch.tv/kraken/streams/';

//local storage

var state = {
    channels:  JSON.parse(localStorage.getItem('storedChannels')) || [],
};

function storeNewData(searchTerm) {
    if (!state.channels.includes(searchTerm.toLowerCase())) {
        state.channels.push(searchTerm.toLowerCase());
        localStorage.setItem('storedChannels', JSON.stringify(state.channels));
    }
}

function getDataFromApi(callback) { //chan1, chan2
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

function getFeaturedTwitchStreams(callback) {
    // body...
    $.ajax({
        type: 'get',
        url: 'https://api.twitch.tv/kraken/streams/featured',
        headers: {
            'Client-ID': 'knitvus66epty3tdv3ym9grcz2iktk'
        },
        data: {
            limit: 5,
        },
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
    var results = '';
    state.channels.forEach(function(name) {
        if (onlineChannels.includes(name)) {
            var channelObject = callbackResults.streams.find(function(stream){ return stream.channel.name.toLowerCase() === name; });
            //change results here
            results += '<tr><td class="result">' + name + '</td><td class="online">' + 
            '<a href="' + channelObject.channel.url + '" target="_blank">' + 
            'Online!</a></td>' + '<td class="game">' + channelObject.channel.game + '</td>';
        }
        else {
            //stream is not online, change results accordingly
            results += '<tr><td class="result">' + name + '</td> <td class="offline"><a class="disabled" href="javascript:;">Offline</a></td>' + '<td class="game">Not Playing</td>';
        }
        results += '<td class="close-button"><a href="#">&#10006</a></td></tr>';
    });
    $('table.results').html(results);
    //for each searchTerm, go through the callbackResults.stream and for each stream, check if channel name corresponds.
    //if no name that matches, then person is offline. if name matches, then online. 
}

function displayFeaturedResults(callbackResults) {
    var featuredResults = '';
    console.log(callbackResults); 
    callbackResults.featured.forEach(function(feature) {
        //console.log(feature.stream); different from personal searches because personal searches are not featured. 
        var channel = feature.stream.channel;
        featuredResults += '<tr><td class="result">' + channel.name + '</td><td class="online">' + 
            '<a href="' + channel.url + '" target="_blank">' + 
            'Online!</a></td>' + '<td class="game">' + channel.game + '</td><td class="close-button"><a href="#">&#10006</a></td></tr>';
    });
    $('table.pop-list').html(featuredResults);
}

function removeChannel() {
    $('table').on('click', '.close-button', function(e) {
        var name = $(this).closest('td').siblings('.result').text();
        var toRemove = state.channels.indexOf(name);
        if (toRemove > -1) {
            state.channels.splice(toRemove, 1);
            localStorage.setItem('storedChannels', JSON.stringify(state.channels));
            getDataFromApi(displayResults);
        }
    });
}


//REVISIONS
//FIXED immediately start at search instead of having to click on textbox
//FIXED save state, save what they search, show whether saved searches are live or not
//check whether search was actually of a user or not
//have ability to remove saved streams
//FIXED local storage to store directly in browser


function enterKey() {
    $('.query').keyup(function(e) {
        if(e.keyCode == 13) {
            $('.user-input').click();
        }
    });
}

function searchStored() {
    getDataFromApi(displayResults);
}

function getSearch() {
    $('.user-input').submit(function(e) {
        e.preventDefault();
        var query = $(this).find('.query').val();
        storeNewData(query);
        getDataFromApi(displayResults);
    });
}


$(document).ready(function(){
    searchStored();
    getFeaturedTwitchStreams(displayFeaturedResults);
    $('.query').focus();
    enterKey();
    getSearch();
    removeChannel();
});