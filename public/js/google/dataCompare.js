var window = window,
    jQuery = jQuery,
    SocialReport = SocialReport,
    layer = layer,
    moment = moment;

(function (window, $, SocialReport, layer, moment) {
    'use strict';

    //set a gobal variable
    var gobal = {
        ids: JSON.parse(window.troperlaicos.google.ids),
        googleRequestloadingLayer: '',
        googleLoadingLayer: '',
        accessToken: window.troperlaicos.google.accessToken
    };

    //build google analytics UsersLineChart
    function buildUsersLineChart(Params) {
        var PeriodOneParams = $.extend({}, {
                metrics: 'ga:users',
                dimensions: 'ga:date'
            }, Params.periodOne),
            PeriodTwoParams = $.extend({}, {
                metrics: 'ga:users',
                dimensions: 'ga:date'
            }, Params.periodTwo),
            dataTable = {
                periodOne: {
                    name: 'Users (Period 1)',
                    labelArr: [],
                    dataArr: [],
                    sum: 0
                },
                periodTwo: {
                    name: 'Users (Period 2)',
                    labelArr: [],
                    dataArr: [],
                    sum: 0
                }
            },
            periodOneLabelArr = [],
            periodTwoLabelArr = [],
            periodOneDataArr = [],
            periodTwoDataArr = [];

        //get summary of data and format dat to dataTable style
        function getSumAndFormat(Resp, Context) {
            var data = Resp.rows,
                context = Context || 'periodOne',
                key;

            //format google data to dataTable format
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    dataTable[context].labelArr.push(data[key][0].substring(0, 4) + '-' + data[key][0].substring(4, 6) + '-' + data[key][0].substring(6, 8));
                    dataTable[context].dataArr.push(parseInt(data[key][1], 0));
                    dataTable[context].sum += parseInt(data[key][1], 0);
                }
            }
        }

        //draw line chart
        function drawLineChart() {

            gobal.usersLineChart = new SocialReport.LineChart('userstimeline', {
                websiteName: dataTable.periodOne.name,
                websiteLabelArr: dataTable.periodOne.labelArr,
                websiteDataArr: dataTable.periodOne.dataArr,
                competitorName: dataTable.periodTwo.name,
                competitorLabelArr: dataTable.periodTwo.labelArr,
                competitorDataArr: dataTable.periodTwo.dataArr
            });
            //draw a overall data in the section
            $('.usersSummaryBox').html(' &nbsp; &nbsp; &nbsp; &nbsp;<label class="text-aqua">Total (Period 1): &nbsp;' + dataTable.periodOne.sum.toLocaleString() + '</label><label class="text-muted"> &nbsp; / &nbsp;Total (Period 2): &nbsp;' + dataTable.periodTwo.sum.toLocaleString() + '</label>');
        }

        //get google data
        SocialReport.GoogleAnalytics.getGoogleAnalyticsData(PeriodOneParams, function (resp) {
            //get sum and format google data to dataTable style
            getSumAndFormat(resp, 'periodOne');
            //request periodTwo data
            SocialReport.GoogleAnalytics.getGoogleAnalyticsData(PeriodTwoParams, function (resp) {
                //get sum and format google data to dataTable style
                getSumAndFormat(resp, 'periodTwo');
                //draw line chart
                drawLineChart();
            });
        });
    }

    //build google analytics Pageviews LineChart
    function buildPageviewsLineChart(Params) {
        var PeriodOneParams = $.extend({}, {
                metrics: 'ga:pageviews',
                dimensions: 'ga:date'
            }, Params.periodOne),
            PeriodTwoParams = $.extend({}, {
                metrics: 'ga:pageviews',
                dimensions: 'ga:date'
            }, Params.periodTwo),
            dataTable = {
                periodOne: {
                    name: 'Pageviews (Period 1)',
                    labelArr: [],
                    dataArr: [],
                    sum: 0
                },
                periodTwo: {
                    name: 'Pageviews (Period 2)',
                    labelArr: [],
                    dataArr: [],
                    sum: 0
                }
            },
            periodOneLabelArr = [],
            periodTwoLabelArr = [],
            periodOneDataArr = [],
            periodTwoDataArr = [];

        //get summary of data and format dat to dataTable style
        function getSumAndFormat(Resp, Context) {
            var data = Resp.rows,
                context = Context || 'periodOne',
                key;

            //format google data to dataTable format
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    dataTable[context].labelArr.push(data[key][0].substring(0, 4) + '-' + data[key][0].substring(4, 6) + '-' + data[key][0].substring(6, 8));
                    dataTable[context].dataArr.push(parseInt(data[key][1], 0));
                    dataTable[context].sum += parseInt(data[key][1], 0);
                }
            }
        }

        //draw line chart
        function drawLineChart() {

            gobal.pageViewsLineChart = new SocialReport.LineChart('pageviewstimeline', {
                websiteName: dataTable.periodOne.name,
                websiteLabelArr: dataTable.periodOne.labelArr,
                websiteDataArr: dataTable.periodOne.dataArr,
                competitorName: dataTable.periodTwo.name,
                competitorLabelArr: dataTable.periodTwo.labelArr,
                competitorDataArr: dataTable.periodTwo.dataArr
            });
            //draw a overall data in the section
            $('.pageViewsSummaryBox').html(' &nbsp; &nbsp; &nbsp; &nbsp;<label class="text-aqua">Total (Period 1): &nbsp;' + dataTable.periodOne.sum.toLocaleString() + '</label><label class="text-muted"> &nbsp; / &nbsp;Total (Period 2): &nbsp;' + dataTable.periodTwo.sum.toLocaleString() + '</label>');
        }

        //get google data
        SocialReport.GoogleAnalytics.getGoogleAnalyticsData(PeriodOneParams, function (resp) {
            //get sum and format google data to dataTable style
            getSumAndFormat(resp, 'periodOne');
            //request periodTwo data
            SocialReport.GoogleAnalytics.getGoogleAnalyticsData(PeriodTwoParams, function (resp) {
                //get sum and format google data to dataTable style
                getSumAndFormat(resp, 'periodTwo');
                //draw line chart
                drawLineChart();
            });
        });
    }

    //build google analytics avg session duration line chart
    function buildAvgSessionDurationLineChart(Params) {
        var PeriodOneParams = $.extend({}, {
                metrics: 'ga:sessions,ga:avgSessionDuration',
                dimensions: 'ga:date'
            }, Params.periodOne),
            PeriodTwoParams = $.extend({}, {
                metrics: 'ga:sessions,ga:avgSessionDuration',
                dimensions: 'ga:date'
            }, Params.periodTwo),
            dataTable = {
                periodOne: {
                    name: 'Avg. Session Duration (Period 1)',
                    labelArr: [],
                    dataArr: [],
                    sum: 0
                },
                periodTwo: {
                    name: 'Avg. Session Duration (Period 2)',
                    labelArr: [],
                    dataArr: [],
                    sum: 0
                }
            },
            periodOneLabelArr = [],
            periodTwoLabelArr = [],
            periodOneDataArr = [],
            periodTwoDataArr = [];

        //get summary of data and format dat to dataTable style
        function getSumAndFormat(Resp, Context) {
            var data = Resp.rows,
                context = Context || 'periodOne',
                key;

            //format google data to dataTable format
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    dataTable[context].labelArr.push(data[key][0].substring(0, 4) + '-' + data[key][0].substring(4, 6) + '-' + data[key][0].substring(6, 8));
                    dataTable[context].dataArr.push(parseInt(data[key][2], 0));
                    dataTable[context].sum += parseInt(data[key][2], 0);
                }
            }
        }

        //draw line chart
        function drawLineChart() {

            gobal.pageViewsLineChart = new SocialReport.LineChart('avgsessiondurationtimeline', {
                websiteName: dataTable.periodOne.name,
                websiteLabelArr: dataTable.periodOne.labelArr,
                websiteDataArr: dataTable.periodOne.dataArr,
                competitorName: dataTable.periodTwo.name,
                competitorLabelArr: dataTable.periodTwo.labelArr,
                competitorDataArr: dataTable.periodTwo.dataArr
            });
            //draw a overall data in the section
            $('.avgSessionDurationSummaryBox').html(' &nbsp; &nbsp; &nbsp; &nbsp;<label class="text-aqua">Total (Period 1): &nbsp;' + moment().set({
                'hour': 0,
                'minute': 0,
                'second': dataTable.periodOne.sum
            }).format('HH:mm:ss') + '</label><label class="text-muted"> &nbsp; / &nbsp;Total (Period 2): &nbsp;' + moment().set({
                'hour': 0,
                'minute': 0,
                'second': dataTable.periodTwo.sum
            }).format('HH:mm:ss') + '</label>');
        }

        //get google data
        SocialReport.GoogleAnalytics.getGoogleAnalyticsData(PeriodOneParams, function (resp) {
            //get sum and format google data to dataTable style
            getSumAndFormat(resp, 'periodOne');
            //request periodTwo data
            SocialReport.GoogleAnalytics.getGoogleAnalyticsData(PeriodTwoParams, function (resp) {
                //get sum and format google data to dataTable style
                getSumAndFormat(resp, 'periodTwo');
                //draw line chart
                drawLineChart();

                //close google request loading layer
                layer.close(gobal.googleRequestloadingLayer);
            });
        });
    }

    //##################################################
    //dataSelectorPanel change will trigger this handler
    //##################################################
    function dataSelectorPanelChangeHandler(ComponentList) {
        var currentProperty = ComponentList.propertySelect.getCurrentValue(),
            periodOneStart = ComponentList.periodOneDateRangePicker.getStart(),
            periodOneEnd = ComponentList.periodOneDateRangePicker.getEnd(),
            periodTwoStart = ComponentList.periodTwoDateRangePicker.getStart(),
            periodTwoEnd = ComponentList.periodTwoDateRangePicker.getEnd(),
            params = {
                periodOne: {
                    'start-date': periodOneStart.format("YYYY-MM-DD"),
                    'end-date': periodOneEnd.format("YYYY-MM-DD"),
                    'ids': currentProperty
                },
                periodTwo: {
                    'start-date': periodTwoStart.format("YYYY-MM-DD"),
                    'end-date': periodTwoEnd.format("YYYY-MM-DD"),
                    'ids': currentProperty
                }
            };

        //set google request loading layer
        gobal.googleRequestloadingLayer = layer.load(2, {
            shade: [0.1, '#000']
        });

        //build google analytics chart
        buildUsersLineChart(params);
        buildPageviewsLineChart(params);
        buildAvgSessionDurationLineChart(params);
    }

    $(function () {

        //set google loading layer
        gobal.googleLoadingLayer = layer.load(2, {
            shade: [0.1, '#000']
        });
        //load google script and get google authorize
        SocialReport.GoogleAnalytics.ready(gobal.accessToken, function () { //when google script is loaded and get google authorize this function will call
            //close google loading layer
            layer.close(gobal.googleLoadingLayer);
            var googleAnalytics = this,
                propertySelect = new SocialReport.Select('propertySelect', {
                    option: gobal.ids
                }),
                periodOneDateRangePicker = new SocialReport.DateRangePicker('periodOneDateRangePicker'),
                periodTwoDateRangePicker = new SocialReport.DateRangePicker('periodTwoDateRangePicker');

            gobal.dataSelectorPanel = new SocialReport.Panel('', {
                components: [propertySelect, periodOneDateRangePicker, periodTwoDateRangePicker],
                changeHandler: dataSelectorPanelChangeHandler
            });
            //start the periodOneDateRangePicker component
            periodOneDateRangePicker.triggerChangeEvent();
            periodTwoDateRangePicker.triggerChangeEvent();
        });
    });

}(window, jQuery, SocialReport, layer, moment));
