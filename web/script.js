var API_KEY = "O3YEHGYZNFQA77X5E"
var CONSUMER_KEY = "1e3406ea62e381dfd5201f1ec84592a9"
var SHARED_SECRET = "69HZAfaGTdyyizIoxDW0rA"

$(document).ready(function () {
  var styles = ['country']
  var metric = 'tempo'
  var values = [100, 200, 300]
  getTracks(styles, metric, values, function(tracks) {
    console.log(tracks);
  })
})

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
    'bucket': ['id:spotify-WW', 'tracks']
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
  switch (metric) {
    case "tempo":
      margin = 500*10/100
      min = value - margin
      if (min <= 0) min = 0.01;
      max = value + margin
      if (max >= 500) max = 499.99;
      return [min, max]
      break;
    case "loudness":
      margin = 200*10/100
      min = value - margin
      if (min <= -100) min = -99.99;
      max = value + margin
      if (max >= 100) max = 99.99;
      return [min, max]
      break;
    case "energy":
      margin = 1*10/100
      min = value - margin
      if (min <= 0) min = 0.01;
      max = value + margin
      if (max >= 1) max = 0.99;
      return [min, max]
      break;
    case "danceability":
      margin = 1*10/100
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
