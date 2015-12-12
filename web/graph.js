var artists = "";
var metric = "tempo";
window.onload = function() {
    searchArtist();
    $("#searchsubmit").click(function() {
        artists = $('#artistSelect').val();
    });
    $("#graphsubmit").click(function() {
        passToSpotify();
    });
    renderGraph(metric);
};

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
        subtitle: {
            align: 'left',
            text: 'Click the graph area to add a point. Click a point to remove it.'
        },
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

function passToSpotify() {
    var values = [];
    var lines = $('#graph').highcharts().getCSV().split('\n');
    for (var i = 1; i < lines.length; i++) {
        values.push(parseFloat(lines[i].split(',')[1]));
    }
    cratePlaylist(artists.split(','), metric, values);
    console.log(artists);
    console.log(values);
}
