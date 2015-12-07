var API_KEY = "O3YEHGYZNFQA77X5E"
var CONSUMER_KEY = "1e3406ea62e381dfd5201f1ec84592a9"
var SHARED_SECRET = "69HZAfaGTdyyizIoxDW0rA"

$(document).ready(function () {
  console.log("ready")
})

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

    //clear previous results
    $("#playlist_results > tbody > tr").remove();

    //initialize player to the first search result
    //broken link for now
    /*
    try{
      //console.log(tracks[0].id);
      if (tracks[0].tracks.length) {
        var firstID = tracks[0].tracks[0].foreign_id;
        $("#player").html('<iframe src="https://embed.spotify.com/?uri=' + firstID + '" width="100%" height="80" frameborder="0" allowtransparency="true"></iframe>');
      }
    }
    catch (TypeError) {
       console.log(TypeError);
    }
    */

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

$("tr").click(function(){
    console.log('clicked row');
 });

function getTracks(styles, metric, values, cb) {
  var style = styles.join()
  populate(style, metric, values, [], function(tracks) {
    cb(tracks)
  })
}

function populate(style, metric, values, tracks, done) {
  if (values.length == 0) {
    done(tracks)
  }
  else {
    getTrack(style, metric, values.pop(), 1, function(response) {
      if (response.response.songs.length) {
        tracks.push(response.response.songs[0])
      } else {
        tracks.push({})
      }
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
    'bucket': ['id:spotify-US', 'tracks']
  }

  // Check if metric is valid
  min_max = getRange(metric, value)
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
  range = 15/100
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
