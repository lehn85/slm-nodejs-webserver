(function () {
    var app = angular.module("app", ['chart.js', 'angular-dialgauge']);

    app.controller("chartController", function ($scope, $http) {
        // functions
        $scope.getLastUpdateTime = getLastUpdateTime;

        /////// Charts
        var chartData = {
            temp: {},
            humid: {},
            volt: {},
            watt_per_m2: {},
        };
        var defaultChartOptions = {
            responsive: true,
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

        chartData.temp = {
            title: "Temperature (*C)",
            options: defaultChartOptions,
            series: ["Temperature"],
            colors: [{
                backgroundColor: "rgba(75,192,192,0.4)",
                borderWidth: 5,
                borderColor: "rgba(255,0,0,1)",
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
            }],
            data: [],
        };

        chartData.humid = {
            title: "Humidity (%)",
            options: defaultChartOptions,
            series: ["Humidity"],
            colors: [{
                backgroundColor: "rgba(75,192,192,0.4)",
                borderWidth: 5,
                borderColor: "rgba(255,0,0,1)",
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
            }],
            data: [],
        };

        chartData.volt = {
            title: "Voltage (V)",
            options: defaultChartOptions,
            series: ["Voltage"],
            colors: [{
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
            }],
            data: [],
        };

        chartData.watt_per_m2 = {
            title: "Power per m2 (W/m2)",
            options: defaultChartOptions,
            series: ["Watt per m2"],
            colors: [{
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
            }],
            data: [],
        };

        $scope.arrayCharts = [chartData.temp, chartData.humid, chartData.volt, chartData.watt_per_m2];

        // get latest data (minute)
        $http.get("/data/latest/5000").then(
            function (response) {
                console.info(response);
                var list = response.data;
                // temp
                chartData.temp.data = [
                    list.map(function (v, i, l) {
                        return {
                            x: moment.utc(Number.parseInt(v.time)), // postgreSQL return bigint as string
                            y: v.temp
                        };
                    }),
                ];

                // humid                
                chartData.humid.data = [
                    list.map(function (v, i, l) {
                        return {
                            x: moment.utc(Number.parseInt(v.time)), // postgreSQL return bigint as string
                            y: v.humid
                        };
                    }),
                ];

                // voltage data
                chartData.volt.data = [
                   list.map(function (v, i, l) {
                       return {
                           x: moment.utc(Number.parseInt(v.time)), // postgreSQL return bigint as string
                           y: v.volt1
                       };
                   }),
                ];

                // watt per m2 data
                chartData.watt_per_m2.data = [
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

        /////// Gauges
        var gaugeData = {
            temp: {
                min: -40,
                max: 50,
                title: "Temperature",
                units: "*C",
                value: 0,
            },
            humid: {
                min: 0,
                max: 100,
                title: "Humidity",
                units: "%",
                value: 0,
            },
            volt: {
                min: 0,
                max: 5,
                title: "Voltage",
                units: "V",
                value: 0,
            },
            watt_per_m2: {
                min: 0,
                max: 100,
                title: "Power per m2",
                units: "W/m2",
                value: 0,
            },
        };        

        // get very last data
        $http.get("/data/last").then(
            function (response) {
                console.info(response);                
                var data = response.data;

                $scope.lastData = data;

                if (!$scope.gaugeData)
                    $scope.arrayGauges = [gaugeData.temp, gaugeData.humid, gaugeData.volt, gaugeData.watt_per_m2];

                gaugeData.temp.value = data.temp;
                gaugeData.humid.value = data.humid;
                gaugeData.volt.value = data.volt1;
                gaugeData.watt_per_m2.value = data.watt_per_m2;                
                //$scope.$applyAsync();
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