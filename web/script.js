var API_KEY = "O3YEHGYZNFQA77X5E"
var CONSUMER_KEY = "1e3406ea62e381dfd5201f1ec84592a9"
var SHARED_SECRET = "69HZAfaGTdyyizIoxDW0rA"

$(document).ready(function (){
  console.log("ready")
  $('.progress').hide();
})

$("tr").click(function(){
    console.log('clicked row');
});

function ErrMsg(msg){
  var message = "<strong>Oh snap!</strong><a href='#'' class='alert-link'>" + msg + "and try submitting again."
  $('#errorMsg').append(message);
  $('#errorMsg').show();
}

function cratePlaylist(artists,  metric, values) {
  console.log(artists)
  console.log(metric)
  console.log(values)

  var buckets = [[], [], [], [], []]

  // Get tracks and put them into buckets
  getTracks(artists, [], function(tracks) {
    for (var i in tracks) {
      var track = tracks[i]
      var value = track.response.songs[0].audio_summary[metric]
      buckets[getBucket(value, metric)].push(track)
    }

    // Get a track for each value from buckets
    var playlist = []
    for (var i in values) {
      var bucket = buckets[getBucket(values[i], metric)]
      var track;
      if (bucket.length) {
        track = bucket[Math.floor(Math.random()*bucket.length)];
      } else {
        console.log('No matching track :(')
        track = {}
      }
      playlist.push(track)
    }

    // GENERATED PLAYLIST!
    console.log(playlist)

  });
}

function getBucket(value, metric) {
  var min, max;
  switch(metric) {
    case "tempo":
      min = 0; max = 500;
      if (value <= 100)
        return 0
      else if (value <= 200)
        return 1
      else if (value <= 300)
        return 2
      else if (value <= 400)
        return 3
      else
        return 4
      break;
    case "loudness":
      min = -100; max = 100;
      if (value <= -60)
        return 0
      else if (value <= -20)
        return 1
      else if (value <= 20)
        return 2
      else if (value <= 60)
        return 3
      else
        return 4
      break;
    case "energy":
      min = 0.0; max = 1.0;
      if (value <= 0.2)
        return 0
      else if (value <= 0.4)
        return 1
      else if (value <= 0.6)
        return 2
      else if (value <= 0.8)
        return 3
      else
        return 4
      break;
    case "danceability":
      min = 0.0; max = 1.0;
      if (value <= 0.2)
        return 0
      else if (value <= 0.4)
        return 1
      else if (value <= 0.6)
        return 2
      else if (value <= 0.8)
        return 3
      else
        return 4
      break;
    default:
      // Error
      console.error("invalid metric bro")
  }
}

function getTracks(artists, tracks, cb) {
  if (artists.length < 1) {
    cb(tracks)
    return
  }
  getArtistTrackIds(artists.pop(), function(track_ids) {
    getSummaries(track_ids, [], function(summaries) {
      tracks = tracks.concat(summaries);
      getTracks(artists, tracks, cb)
    });
  });
}

function getSummaries(ids, summaries, cb) {
  if (ids.length <= 0) {
    cb(summaries)
    return
  }
  getSummary(ids.pop(), function(summary) {
    summaries.push(summary);
    getSummaries(ids, summaries, cb)
  })
}

function getSummary(id ,cb) {
  var rosetta_id = 'spotify:track:' + id
  var url = "http://developer.echonest.com/api/v4/song/profile"
  var data = {
    'api_key': API_KEY,
    'format': 'json',
    'track_id': rosetta_id,
    'bucket': ['audio_summary', 'id:spotify']
  }

  $.ajax({
    url: url,
    data: data,
    traditional: true,
    success: function (response) {
      cb(response)
    }
  });
}

function getArtistTrackIds(artist, cb) {
  var url = "https://api.spotify.com/v1/search"
  var data = {
    query: artist,
    limit: 1,
    type: "artist"
  }

  $.ajax({
    url: url,
    data: data,
    success: function (response) {
      var returned_artists = response.artists.items;
      if (returned_artists.length > 0) {
        topTrackIds(returned_artists[0].id, function(ids) {
          cb(ids)
        })
      } else {
        console.error("No artists found.")
        ErrMsg("No artists found.")
      }

    }
  });
}

function topTrackIds(artist_id, cb) {
  var url = "https://api.spotify.com/v1/artists/" + artist_id + "/top-tracks"
  var data = {
    'country': 'US'
  }
  $.ajax({
    url: url,
    data: data,
    success: function (response) {
      var ids = []
      for (var key in response.tracks) {
          ids.push(response.tracks[key].id);
      }
      cb(ids)
    }
  });
}

/* OLD CODE

function cratePlaylist(styles, metric, values) {
  console.log(styles)
  console.log(metric)
  console.log(values)

  populatePlaylist(styles, metric, values);

  //change player widget when clicking
  try{
    $('#playlist_results').on('click', 'tr', function (event) {
        $("#player").html('<iframe src="https://embed.spotify.com/?uri=' + $(this).data("href") + '" width="100%" height="80" frameborder="0" allowtransparency="true"></iframe>');
    });
  }
  catch (TypeError) {
       console.log(TypeError);
  }
}

function populatePlaylist(styles, metric, values) {
  getTracks(styles, metric, values, function(tracks) {
    console.log(tracks);



    //initialize player to the first search result
    //broken link for now

    //try{
    //  //console.log(tracks[0].id);
    //  if (tracks[0].tracks.length) {
    //    var firstID = tracks[0].tracks[0].foreign_id;
    //    $("#player").html('<iframe src="https://embed.spotify.com/?uri=' + firstID + '" width="100%" height="80" frameborder="0" allowtransparency="true"></iframe>');
    //  }
    //}
    //catch (TypeError) {
    //   console.log(TypeError);
    //}


    //add data to table
    for (i = 0; i < tracks.length; i++) {
      var track = tracks[i];
      if (Object.keys(track).length && track.tracks.length) {
        var row = '<tr data-href="' + track.tracks[0].foreign_id.replace('-US', '') + '"><td>'
            + track.title + '</td><td>'
            + track.artist_name + '</td></tr>';
      } else {
        var row = '<tr data-href="#"><td>'
            + 'shrug' + '</td><td>'
            + 'shrug' + '</td></tr>';
      }
      $('#playlist_results > tbody:first').append(row);
    }
  })
}

// //change player widget when clicking
// $('#playlist_results').on('click', 'tr', function (event) {
//     alert("fuck");
//     $("#player").html('<iframe src="https://embed.spotify.com/?uri=' + $(this).data("href") + '" width="100%" height="80" frameborder="0" allowtransparency="true"></iframe>');
// });

var progress_bar_increments
function getTracks(styles, metric, values, cb) {
  var style = styles.join()

  //clear previous results
  $("#playlist_results > tbody > tr").remove();
  //reset progress bar
  $('.progress-bar').css('width','0%');
  current_width_percent = 0
  //calculate new progress increments per track
  progress_bar_increments = 100/values.length;
  console.log("progress increment: " + progress_bar_increments);
  //show progress bar
  $('.progress').show();

  populate(style, metric, values, [], function(tracks) {
    cb(tracks)
  })
}

var current_width_percent = 0;
function populate(style, metric, values, tracks, done) {
  if (values.length == 0) {
    //hide progress bar when all tracks have been found
    $('.progress').hide();
    done(tracks)
  }
  else {
    getTrack(style, metric, values.pop(), 10, function(response) {
      var response_count = response.response.songs.length;
      if (response_count) {
        tracks.push(response.response.songs[Math.floor(Math.random()*response_count)])
      } else {
        tracks.push({})
      }

      //make progress bar move accordingly
      $('.progress-bar').css('width', current_width_percent + progress_bar_increments + '%');
      current_width_percent = current_width_percent + progress_bar_increments;
      console.log("current progress: " + current_width_percent);

      populate(style, metric, values, tracks, done)
    });
  }
}

function getTrack(style, metric, value, count, cb) {
  var url = "http://developer.echonest.com/api/v4/song/search"
  var data = {
    'api_key': API_KEY,
    'format': 'json',
    'results': count,
    'style': style,
    'bucket': ['id:spotify-WW', 'tracks'],
    'sort': 'artist_familiarity-desc'
  }

  // Check if metric is valid
  min_max = getRange(metric, value)
  console.log(min_max)
  if (min_max.length == 0) {
    console.error("Invalid metric")
    return
  }

  // Add metric to call
  data['min_' + metric] = min_max[0]
  data['max_' + metric] = min_max[1]

  $.ajax({
    url: url,
    data: data,
    traditional: true,
    success: function (response) {
      cb(response)
    }
  });
}

function getRange(metric, value) {
  range = 20/100
  switch (metric) {
    case "tempo":
      if (value <= 0) value = 0.01;
      if (value >= 500) value = 499.99;
      margin = 500*range
      min = value - margin
      if (min <= 0) min = 0.01;
      max = value + margin
      if (max >= 500) max = 499.99;
      return [min, max]
      break;
    case "loudness":
      if (value <= -100) value = -99.99;
      if (value >= 100) value = 99.99;
      margin = 200*range
      min = value - margin
      if (min <= -100) min = -99.99;
      max = value + margin
      if (max >= 100) max = 99.99;
      return [min, max]
      break;
    case "energy":
      if (value <= 0) value = 0.01;
      if (value >= 1) value = 0.99;
      margin = 1*range
      min = value - margin
      if (min <= 0) min = 0.01;
      max = value + margin
      if (max >= 1) max = 0.99;
      return [min, max]
      break;
    case "danceability":
      if (value <= 0) value = 0.01;
      if (value >= 1) value = 0.99;
      margin = 1*range
      min = value - margin
      if (min <= 0) min = 0.01;
      max = value + margin
      if (max >= 1) max = 0.99;
      return [min, max]
      break;
    default:
      // Error
      return [];
  }
}
*/
