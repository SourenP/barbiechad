var metric = "energy";
var values = [];

window.onload = function() {
    searchArtist();
		if (localStorage.getItem("barbieChadPlaylist") !== null) {
			var getButton = '<button type="button" id="retrieve-playlist" class="btn pull-right getPlaylist"> Retrieve Saved Playlist </button>';
			$('#retrieve-div').empty();
			$('#retrieve-div').append(getButton);
		}
    $("#headerimg").click(function() {
    	location.reload();
    });

    $("#searchsubmit").click(function() {
			if (Object.keys(picked_artists).length === 0)
				ErrMsg("No artists inputted!");
			else {
				$('#setting-page').slideUp("slow");
				$('#graph-page').show();
				renderArtistList(picked_artists);
				metric = $('#metricSelect').val();
				renderGraph(metric);
			}
    });
    $("#graphsubmit").click(function() {
			$('#graph-page').slideUp("slow");
			$('#playlist-page').show();
      passToSpotify(picked_artists);
    });
    $('div').off('click', "button.savePlaylist").on('click', "button.savePlaylist", function() {
    	savePlaylist();
    });
    $(document).off('click', "#retrieve-playlist").on('click', "#retrieve-playlist", function() {
    	getPlaylist();
    });
};

function renderArtistList(artists) {
	$('#artist-list').empty();
	var list_html = '';
	list_html += "<h3> Artists </h3>";
	list_html += "<ul class='list-group'>";
	for (var key in picked_artists) {
		list_html += "<li class='list-group-item'>" + key + "</li>";
	}
	list_html += "</ul>";
	$('#artist-list').append(list_html);
}

function metricChange() {
    metric = $('#metricSelect').val();
    renderGraph(metric);
}

function renderGraph(metric) {
    var min;
    var max;
    switch (metric) {
        case "tempo":
            min = 0;
            max = 500;
            break;
        case "loudness":
            min = -100;
            max = 100;
            break;
        case "energy":
            min = 0.0;
            max = 1.0;
            break;
        case "danceability":
            min = 0.0;
            max = 1.0;
            break;
    }
    var graph = $('#graph').highcharts({
        chart: {
            type: 'spline',
            margin: [70, 50, 60, 80],
            events: {
                click: function(e) {
                    // find the clicked values and the series
                    var x = e.xAxis[0].value,
                        y = e.yAxis[0].value,
                        series = this.series[0];

                    // Add it
                    series.addPoint([x, y]);
                }
            }
        },
        title: {
            text: ""
        },
        // subtitle: {
        //     align: 'left',
        //     text: 'Click the graph area to add a point. Click a point to remove it.'
        // },
        xAxis: {
            title: {
                text: ''
            },
            labels: {
                enabled: false
            },
            gridLineWidth: 1,
            minPadding: 0.2,
            maxPadding: 0.2,
            maxZoom: 60,
            min: 0,
            max: 100
        },
        yAxis: {
            title: {
                text: metric
            },
            minPadding: 0.2,
            maxPadding: 0.2,
            maxZoom: 60,
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            min: min,
            max: max
        },
        legend: {
            enabled: false
        },
        tooltip: {
            headerFormat: '<span style="font-size: 10px">{point.y}</span><br/>',
            pointFormat: ""
        },
        exporting: {
            buttons: {
                contextButton: {
                    symbol: "",
                    menuItems: null,
                    text: null
                }
            }
        },
        plotOptions: {
            series: {
                lineWidth: 1,
                point: {
                    events: {
                        'click': function() {
                            if (this.series.data.length > 1) {
                                this.remove();
                            }
                        }
                    }
                }
            }
        },
        series: [{
            data: [
                [15, min + (max * 0.4)],
                [85, max * 0.6]
            ]
        }]
    });
}

function passToSpotify(picked_artists) {
    values.length = 0;
    var lines = $('#graph').highcharts().getCSV().split('\n');
    for (var i = 1; i < lines.length; i++) {
        values.push(parseFloat(lines[i].split(',')[1]));
    }
    cratePlaylist(picked_artists, metric, values);
}

function getPlaylist() {
	playlist = JSON.parse(localStorage.barbieChadPlaylist);
	values = JSON.parse(localStorage.barbieChadValues);
	metric = localStorage.barbieChadMetric;
	$('#setting-page').slideUp("slow");
	$('#playlist-page').show();
	$("#metric").text(firstToUpperCase(metric));
	populatePlaylistTable(playlist, values);
}
