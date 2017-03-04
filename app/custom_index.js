(function () {
    var app = angular.module("app", ['chart.js', 'angular-dialgauge']);

    app.controller("chartController", function ($scope, $http) {

        $scope.getLastUpdateTime = getLastUpdateTime;

        $scope.options = {
            responsive: true,
            title: {
                display: true,
                text: 'Solar panel'
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
                    type: 'time',
                    time: {
                        parser: function (utcMoment) {
                            return utcMoment.utcOffset('+0300');
                        }
                    },
                    scaleLabel: {
                        display: true,
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                    }
                }]
            }
        };
        $scope.series = {
            volt1: ['Voltage'],
            watt_per_m2: ['Watt per m2'],
        };
        $scope.colors = [{
            backgroundColor: "rgba(75,192,192,0.4)",
            borderWidth: 5,
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40],
            spanGaps: false,
        },
        //{
        //    backgroundColor: "rgba(75,192,192,0.4)",
        //    borderWidth: 5,
        //    borderColor: "rgba(255,0,0,1)",
        //}
        ];

        $scope.data = {};

        // get latest data (minute)
        $http.get("/data/latest/5000").then(
            function (response) {
                console.info(response);
                var list = response.data;
                $scope.data.volt1 = [
                    list.map(function (v, i, l) {
                        return {
                            x: moment.utc(Number.parseInt(v.time)), // postgreSQL return bigint as string
                            y: v.volt1
                        };
                    }),
                ];

                $scope.data.watt_per_m2 = [
                    list.map(function (v, i, l) {
                        return {
                            x: moment.utc(Number.parseInt(v.time)), // postgreSQL return bigint as string
                            y: v.watt_per_m2,
                        };
                    }),
                ];

                $scope.$applyAsync();
            },
            function (exception) {
                console.error(exception);
            });

        // get very last data
        $http.get("/data/last").then(
            function (response) {
                console.info(response);
                $scope.lastData = response.data;

            },
            function (exception) {
                console.error(exception);
            }
            );

        function getLastUpdateTime() {
            if ($scope.lastData)
                return moment.utc($scope.lastData.time).utcOffset("+0300").toString();
            else return "";
        }
    });
})();

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