/// <reference path="Chart.min.js"/>

(function () {
    var app = angular.module("app", []);

    app.controller("chartController", function ($scope, $http) {
        var ctx = $('#canvas');
        var c1 = new Chart(ctx, config);

        var urlget = "/data/latest/5000";
        $http.get(urlget).then(
            function (response) {
                console.info(response);
                var list = response.data;
                config.data.datasets[0] = {
                    label: "My First dataset",
                    backgroundColor: window.chartColors.red,
                    borderColor: window.chartColors.red,
                    data: list.map(function (v, i, l) {
                        return v.watt;
                    })
                };
                config.data.labels = list.map(function (v, i, l) {
                    return v.time;
                });                
                c1.update();
            },
            function (exception) {
                console.error(exception);
            });
    });
})();

var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var config = {
    type: 'line',
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "My First dataset",
            backgroundColor: window.chartColors.red,
            borderColor: window.chartColors.red,
            data: [
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor()
            ],
            fill: false,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Chart.js Line Chart'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Month'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Value'
                }
            }]
        }
    }
};

//window.onload = function () {
//    var ctx = document.getElementById("canvas").getContext("2d");
//    window.myLine = new Chart(ctx, config);
//};

//document.getElementById('randomizeData').addEventListener('click', function () {
//    config.data.datasets.forEach(function (dataset) {
//        dataset.data = dataset.data.map(function () {
//            return randomScalingFactor();
//        });
//    });

//    window.myLine.update();
//});

var colorNames = Object.keys(window.chartColors);
//document.getElementById('addDataset').addEventListener('click', function () {
//    var colorName = colorNames[config.data.datasets.length % colorNames.length];
//    var newColor = window.chartColors[colorName];
//    var newDataset = {
//        label: 'Dataset ' + config.data.datasets.length,
//        backgroundColor: newColor,
//        borderColor: newColor,
//        data: [],
//        fill: false
//    };

//    for (var index = 0; index < config.data.labels.length; ++index) {
//        newDataset.data.push(randomScalingFactor());
//    }

//    config.data.datasets.push(newDataset);
//    window.myLine.update();
//});

//document.getElementById('addData').addEventListener('click', function () {
//    if (config.data.datasets.length > 0) {
//        var month = MONTHS[config.data.labels.length % MONTHS.length];
//        config.data.labels.push(month);

//        config.data.datasets.forEach(function (dataset) {
//            dataset.data.push(randomScalingFactor());
//        });

//        window.myLine.update();
//    }
//});

//document.getElementById('removeDataset').addEventListener('click', function () {
//    config.data.datasets.splice(0, 1);
//    window.myLine.update();
//});

//document.getElementById('removeData').addEventListener('click', function () {
//    config.data.labels.splice(-1, 1); // remove the label first

//    config.data.datasets.forEach(function (dataset, datasetIndex) {
//        dataset.data.pop();
//    });

//    window.myLine.update();
//});