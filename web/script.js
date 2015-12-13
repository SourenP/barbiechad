var API_KEY = "O3YEHGYZNFQA77X5E"
var CONSUMER_KEY = "1e3406ea62e381dfd5201f1ec84592a9"
var SHARED_SECRET = "69HZAfaGTdyyizIoxDW0rA"

var picked_artists = {}

$(document).ready(function (){
  console.log("ready")
  $('#back-to-settings').click(function() {
    $('#graph-page').hide();
    $('#setting-page').show();
  })
  $('#back-to-graph').click(function() {
    $('#playlist-page').hide();
    $('#graph-page').show();
  })

  $('#graph-page').hide();
  $('#playlist-page').hide();
  $('.progress').hide();
})

$("tr").click(function(){
    console.log('clicked row');
});

function ErrMsg(msg){
  var message = "<strong>Oh snap! </strong>" + msg
  $('#errorMsg').empty()
  $('#errorMsg').append(message);
  $('#errorMsg').show();
}

var progress_bar_increments = 0;
var current_width_percent = 0;

function cratePlaylist(artists,  metric, values) {
  console.log('starting progress bar')
  //clear previous results on table
  $("#playlist_results > tbody > tr").remove();
  //reset progress bar
  $('.progress-bar').css('width','0%');
  current_width_percent = 0
  //calculate new progress increments per track
  progress_bar_increments = 100/artists.length;
  console.log("progress increment: " + progress_bar_increments);
  //show progress bar
  $('.progress').show();

  artists = Object.keys(artists)

  var buckets = [[], [], [], [], []]

  // Get tracks and put them into buckets
  getTracks(artists, [], function(tracks) {

    for (var i in tracks) {
      var track = tracks[i]
      var value = track.audio_summary[metric]
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
        console.warn('No matching track for ', values[i])
        track = {}
      }
      playlist.push(track)
    }

    // GENERATED PLAYLIST!
    console.log(playlist)

    //Add the metric type to the table after capitalizing it
    $("#metric").text(firstToUpperCase(metric));

    //Generate table from playlist
    populatePlaylistTable(playlist, values);

    //change player widget when clicking
    try{
      $('#playlist_results').on('click', 'tr', function (event) {
        var trackURL = $(this).data("href");
        //if you're not clicking on an empty track...
        if(trackURL !== "NOTFOUND"){
          //update the player to the clicked track
          $("#player").html('<iframe src=' + $(this).data("href") + ' width="100%" height="80" frameborder="0" allowtransparency="true"></iframe>');
        }
      });
    }
    catch (TypeError) {
         console.log(TypeError);
    }
  });
}

//capitalize first letter of a string
function firstToUpperCase( str ) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function populatePlaylistTable(playlist, values){

  //Player added initialized to false, changed to true when first nonempty song is put on player
  var playerInitialized = false;

  //add data to table
  for (i = 0; i < playlist.length; i++) {
    //if the song is null
    if(jQuery.isEmptyObject(playlist[i])){
      var row = '<tr data-href="NOTFOUND"><td>'
          + 'Song Not Found' + '</td><td>'
          + '' + '</td><td>'
          + roundToTwoDec(values[i]) + '</td></tr>';
    }
    else{
      var song = playlist[i];
      //if player hasn't been initialized yet...
      if(!playerInitialized){
        $("#player").html('<iframe src="https://embed.spotify.com/?uri=' + song.uri + '" width="100%" height="80" frameborder="0" allowtransparency="true"></iframe>');
        //set to true
        playerInitialized = true;
      }
      var row = '<tr data-href="https://embed.spotify.com/?uri=' + song.uri + '"><td>'
          + song.title + '</td><td>'
          + song.artist_name + '</td><td>'
          + roundToTwoDec(values[i]) + '</td></tr>';

    }
    $('#playlist_results > tbody:first').append(row);
  }
}

function roundToTwoDec(num){
  return Math.round(num * 100) / 100;
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
    //hide progress bar
    $('.progress').hide();

    console.log('hiding progress bar')

    return
  }
  //make progress bar move accordingly with playlist pushes
  $('.progress-bar').css('width', current_width_percent + progress_bar_increments + '%');
  current_width_percent = current_width_percent + progress_bar_increments;
  console.log("current progress: " + current_width_percent);

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
  var id = ids.pop()
  getSummary(id, function(summary) {
    if (summary.response.songs) {
      var summary = summary.response.songs[0]
      summary["uri"] = id;
      summaries.push(summary);
    }
    getSummaries(ids, summaries, cb)
  })
}

function getSummary(id ,cb) {
  var url = "http://developer.echonest.com/api/v4/song/profile"
  var data = {
    'api_key': API_KEY,
    'format': 'json',
    'track_id': id,
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
        console.warn("No artists found under '" + artist + "'.")
        ErrMsg("No artists found under " + artist)
        cb([])
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
          ids.push(response.tracks[key].uri);
      }
      cb(ids)
    }
  });
}

function split( val ) {
  return val.split( /,\s*/ );
}
function extractLast( term ) {
  return split( term ).pop();
}

function searchArtist(){
  $('#artistSelect')
  .bind( "keydown", function( event ) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
            $( this ).autocomplete( "instance" ).menu.active ) {
          event.preventDefault();
        }
      })
  .autocomplete({
      minLength: 0,
      source:function(query, process) {
          $.when(
            $.ajax({
                url: 'http://ws.spotify.com/search/1/artist.json?q=' + extractLast(query.term),
            })
          ).then(function (data) {
            var process_data = [];
            $.each(data.artists.slice(0, 4), function(i,item) {
              $.when (
               $.ajax({
                  url: 'https://embed.spotify.com/oembed/?url=' + item.href,
                  dataType: 'jsonp'
               })
              ).then(function (image) {
                process_data.push( {
                  artist_name: item.name,
                  label: item.name,
                  artist: item,
                  href: item.href,
                  //image: image.thumbnail_url.replace("cover", "60")
                });
                process( $.ui.autocomplete.filter(process_data, extractLast( query.term)));
              });
            });
          });
      },
      // open: function(event, ui) {

      // },
      focus: function() {
          // prevent value inserted on focus
          return false;
        },

      select: function( event, ui ) {
          event.preventDefault();
          addArtist(ui.item)
          $('#artistSelect').val('');
          return false;
        },
        messages: {
          noResults: '',
          results: function() {}
        }
      // multiselect: true,
    })
    .data('ui-autocomplete')._renderItem = function(ul, item) {
      return $('<li>')
          .data( "ui-autocomplete-item", item)
          .append('<a>' +
            //'<img width="50" src="' + item.image + '" alt="" />' +
            '<span class="ui-autocomplete-artist">' + item.artist_name  + '</span>' + '<span class="ui-autocomplete-divider"><i class="fa fa-minus"></i></span>' + '<span class="ui-autocomplete-album-name">' + item.artist_name  + '</span>' + '<span class="ui-autocomplete-icon pull-right"><i class="fa fa-plus-circle fa-2x"></i></span>' + '</a>')
          .appendTo(ul);
    };
}

function addArtist(artist) {
  picked_artists[artist.label] = artist
  renderSearchArtists()
}

function renderSearchArtists() {
  $('#search-artists').empty()
  for (var i in picked_artists) {
    $('#search-artists').append("<li class='list-group-item'>" + picked_artists[i].label + "<button onclick='deleteArtist(\""+ picked_artists[i].artist_name + "\")' class='btn btn-md btn-danger delete-button' type='submit'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></button></li>")
  }
}

function deleteArtist(name) {
  delete picked_artists[name];
  renderSearchArtists()
}


// function imageExists(image_url){
//     var http = new XMLHttpRequest();
//     http.open('HEAD', image_url, false);
//     http.send();
//     return http.status != 404;
// }

// function imageUrl(image_url){
//   $.get(image_url)
//     .done(function() {
//         break;
//     }).fail(function() {
//         image_url = "/img/spotify_logo.png";// Image doesn't exist - do something else.

//     })
//     return image_url;
// }

  // <script>
  // $(function() {
  //   var availableTags = [
  //     "ActionScript",
  //     "AppleScript",
  //     "Asp",
  //     "BASIC",
  //     "C",
  //     "C++",
  //     "Clojure",
  //     "COBOL",
  //     "ColdFusion",
  //     "Erlang",
  //     "Fortran",
  //     "Groovy",
  //     "Haskell",
  //     "Java",
  //     "JavaScript",
  //     "Lisp",
  //     "Perl",
  //     "PHP",
  //     "Python",
  //     "Ruby",
  //     "Scala",
  //     "Scheme"
  //   ];
  //   function split( val ) {
  //     return val.split( /,\s*/ );
  //   }
  //   function extractLast( term ) {
  //     return split( term ).pop();
  //   }

  //   $( "#tags" )
  //     // don't navigate away from the field on tab when selecting an item
  //     .bind( "keydown", function( event ) {
  //       if ( event.keyCode === $.ui.keyCode.TAB &&
  //           $( this ).autocomplete( "instance" ).menu.active ) {
  //         event.preventDefault();
  //       }
  //     })
  //     .autocomplete({
  //       minLength: 0,
  //       source: function( request, response ) {
  //         // delegate back to autocomplete, but extract the last term
  //         response( $.ui.autocomplete.filter(
  //           availableTags, extractLast( request.term ) ) );
  //       },
  //       focus: function() {
  //         // prevent value inserted on focus
  //         return false;
  //       },
  //       select: function( event, ui ) {
  //         var terms = split( this.value );
  //         // remove the current input
  //         terms.pop();
  //         // add the selected item
  //         terms.push( ui.item.value );
  //         // add placeholder to get the comma-and-space at the end
  //         terms.push( "" );
  //         this.value = terms.join( ", " );
  //         return false;
  //       }
  //     });
  // });
  // </script>

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
