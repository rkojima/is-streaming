var twitchUrl = 'https://api.twitch.tv/kraken/streams/';

//local storage

var state = {
    channels: JSON.parse(localStorage.getItem('storedChannels')) || [],
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
            var channelObject = callbackResults.streams.find(function(stream){ return stream.channel.name.toLowerCase() === name; });
            //change results here
            results += '<tr><td class="result">' + name + '</td><td class="online">' + 
            '<a href="' + channelObject.channel.url + '" target="_blank">' + 
            'Online!</a></td>';

            /*'<p class="result">' + name + ': </p>' + '<a href="' + channelObject.channel.url + '" target="_blank">' + 
            '<button type="button" class="btn btn-success">Online!</button>' + '</a><br>';
            */
        }
        else {
            //stream is not online, change results accordingly
            results += '<tr><td class="result">' + name + '</td> <td class="offline"><a class="disabled" href="javascript:;">Offline</a></td>';
            //'<p class="result">' + name + ': </p>' + '<button type="button" class="btn btn-danger">Offline</button><br>';
        }
        results += '<td class="close-button"><a href="#">&#10006</a></td></tr>';
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

function removeChannel() {
    $('.close-button').click(function(e) {
        console.log(test);
        var toRemove = state.indexOf(clicked);
        if (toRemove > -1) {
            state.splice(toRemove, 1);
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
    $('.query').focus();
    enterKey();
    getSearch();
    removeChannel();
});