var twitchUrl = 'https://api.twitch.tv/kraken/streams/';

function getDataFromApi(searchTerm, callback) {
    $.ajax({
        type: 'get',
        url: 'https://api.twitch.tv/kraken/streams' + searchTerm,
        headers: {
            'Client-ID': 'knitvus66epty3tdv3ym9grcz2iktk'
        },
        success: callback
    });
}

$(document).ready(function(){
});

//if 