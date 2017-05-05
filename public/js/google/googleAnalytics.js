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

    //build overview data table
    function buildOverviewDataTable(Params) {
        var params = $.extend({}, {
            metrics: 'ga:sessions,ga:users,ga:pageviews,ga:pageviewsPerSession',
            dimensions: 'ga:medium'
        }, Params);
        SocialReport.GoogleAnalytics.getGoogleAnalyticsData(params, function (resp) {
            var chartData = [],
                dataSource = resp.totalsForAllResults || [];
            //set data to chartData
            chartData.push(['Data', Number(dataSource['ga:sessions']).toLocaleString(), Number(dataSource['ga:users']).toLocaleString(), Number(dataSource['ga:pageviews']).toLocaleString(), Number(dataSource['ga:pageviewsPerSession']).toFixed(2)]);
            //if table is exist
            if (gobal.overviewTable) {
                //use repaint function to 
                gobal.overviewTable.repaint(chartData);
            } else {
                //build datatable object
                gobal.overviewTable = new SocialReport.DataTables('overviewTable', chartData, {
                    paging: false,
                    lengthChange: false,
                    searching: false,
                    ordering: false,
                    info: false,
                    autoWidth: false,
                    border: false,
                    columns: [
                        {
                            title: ""
                        }, {
                            title: "Sessions"
                        },
                        {
                            title: "Users"
                        },
                        {
                            title: "Pageviews"
                        },
                        {
                            title: "Pages / Session"
                        }
                    ]
                });
            }
        });
    }

    //build google analytics UsersLineChart
    function buildUsersLineChart(Params) {
        var params = $.extend({}, {
            metrics: 'ga:users',
            dimensions: 'ga:date'
        }, Params);
        SocialReport.GoogleAnalytics.getGoogleAnalyticsData(params, function (resp) {
            var data = resp.rows,
                chartData = {
                    rowData: [],
                    columnData: [{
                        type: 'datetime',
                        name: 'date',
                        pattern: 'yyyy-MM-dd' //for formatting tooltip
                    }, {
                        type: 'number',
                        name: 'Users'
                    }]
                },
                options = {},
                key;
            //format data in 2d Array
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    chartData.rowData.push([new Date(data[key][0].substring(0, 4) + ',' + data[key][0].substring(4, 6) + ',' + data[key][0].substring(6, 8)), parseInt(data[key][1], 0)]);
                }
            }
            //draw line chart
            SocialReport.GoogleAnalytics.drawLineChartByGoogleVisualization('userstimeline', chartData, options);
        });
    }

    //build google analytics Pageviews LineChart
    function buildPageviewsLineChart(Params) {
        var params = $.extend({}, {
            metrics: 'ga:pageviews',
            dimensions: 'ga:date'
        }, Params);
        SocialReport.GoogleAnalytics.getGoogleAnalyticsData(params, function (resp) {
            var data = resp.rows,
                chartData = {
                    rowData: [],
                    columnData: [{
                        type: 'datetime',
                        name: 'date',
                        pattern: 'yyyy-MM-dd' //for formatting tooltip
                    }, {
                        type: 'number',
                        name: 'Pageviews'
                    }]
                },
                options = {},
                key;
            //format data in 2d Array
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    chartData.rowData.push([new Date(data[key][0].substring(0, 4) + ',' + data[key][0].substring(4, 6) + ',' + data[key][0].substring(6, 8)), parseInt(data[key][1], 0)]);
                }
            }
            //draw line chart
            SocialReport.GoogleAnalytics.drawLineChartByGoogleVisualization('pageviewstimeline', chartData, options);
        });
    }

    //build google analytics avg session duration line chart
    function buildAvgSessionDurationLineChart(Params) {
        var params = $.extend({}, {
            metrics: 'ga:sessions,ga:avgSessionDuration',
            dimensions: 'ga:date'
        }, Params);
        SocialReport.GoogleAnalytics.getGoogleAnalyticsData(params, function (resp) {
            var data = resp.rows,
                chartData = {
                    rowData: [],
                    columnData: [{
                        type: 'datetime',
                        name: 'date',
                        pattern: 'yyyy-MM-dd' //for formatting tooltip
                    }, {
                        type: 'datetime',
                        name: 'Avg. Session Duration',
                        pattern: 'mm:ss' //for formatting tooltip
                    }]
                },
                options = {},
                key;
            //format data in 2d Array
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    chartData.rowData.push([new Date(data[key][0].substring(0, 4) + ',' + data[key][0].substring(4, 6) + ',' + data[key][0].substring(6, 8)), new Date(parseInt(data[key][2] * 1000, 0))]);
                }
            }
            //draw line chart
            SocialReport.GoogleAnalytics.drawLineChartByGoogleVisualization('avgsessiondurationtimeline', chartData, options);
        });
    }

    //build google ananlytics behavior all page data table
    function buildBehaviorAllPageDataTable(Params) {
        var params = $.extend({}, {
            'metrics': 'ga:pageviews,ga:uniquePageviews,ga:avgTimeOnPage',
            'dimensions': 'ga:pagePath,ga:pageTitle',
            'max-results': 30,
            'sort': '-ga:pageviews'
        }, Params);
        SocialReport.GoogleAnalytics.getGoogleAnalyticsData(params, function (resp) {

            //close google request loading layer
            layer.close(gobal.googleRequestloadingLayer);

            var chartData = [],
                dataArr = [],
                rowKey,
                url,
                dateSource = resp.rows || [];

            //loop to set data to chartData
            for (rowKey in dateSource) {
                if (dateSource.hasOwnProperty(rowKey)) {
                    dataArr = [];
                    url = 'http://eastweek.my-magazine.me' + dateSource[rowKey][0];
                    dataArr.push('<a href="' + url + '" target="_blank">' + url + '</a>');
                    dataArr.push(dateSource[rowKey][1]);
                    dataArr.push(parseInt(dateSource[rowKey][2], 0).toLocaleString());
                    dataArr.push(parseInt(dateSource[rowKey][3], 0).toLocaleString());
                    dataArr.push(moment().set({
                        'minute': 0,
                        'second': dateSource[rowKey][4]
                    }).format('mm:ss'));
                    chartData.push(dataArr);
                }
            }
            //if table is exist
            if (gobal.behaviorAllPages) {
                //use repaint function to 
                gobal.behaviorAllPages.repaint(chartData);
            } else {
                //build datatable object
                gobal.behaviorAllPages = new SocialReport.DataTables('behaviorAllPages', chartData, {
                    paging: false,
                    lengthChange: false,
                    searching: false,
                    ordering: false,
                    info: false,
                    autoWidth: false,
                    border: false,
                    columnDefs: [{
                        "className": "breakall",
                        "targets": [0]
                    }],
                    columns: [
                        {
                            title: "Page"
                        },
                        {
                            title: "Title"
                        },
                        {
                            title: "Pageviews"
                        },
                        {
                            title: "Unique Pageviews"
                        },
                        {
                            title: "Avg. Time on Page"
                        }
                    ]
                });
            }

        });
    }

    //##################################################
    //dataSelectorPanel change will trigger this handler
    //##################################################
    function dataSelectorPanelChangeHandler(ComponentList) {
        var currentProperty = ComponentList.propertySelect.getCurrentValue(),
            start = ComponentList.dateRangePicker.getStart(),
            end = ComponentList.dateRangePicker.getEnd(),
            pageFilterString = ComponentList.pageSearchBox.getSearchValue(),
            titleFilterString = ComponentList.titleSearchBox.getSearchValue(),
            filterArray = [],
            params = {
                'start-date': start.format("YYYY-MM-DD"),
                'end-date': end.format("YYYY-MM-DD"),
                'ids': currentProperty
            };

        //build the filter string
        if (pageFilterString) {
            filterArray.push('ga:pagePath=@' + pageFilterString);
        }
        if (titleFilterString) {
            filterArray.push('ga:PageTitle=@' + titleFilterString);
        }
        //only when filterArray not empty, we add `filters` to params
        if (filterArray.length > 0) {
            params.filters = filterArray.join(';');
        }

        //set google request loading layer
        gobal.googleRequestloadingLayer = layer.load(2, {
            shade: [0.1, '#000']
        });

        //build google analytics chart
        buildOverviewDataTable(params);
        buildUsersLineChart(params);
        buildPageviewsLineChart(params);
        buildAvgSessionDurationLineChart(params);
        buildBehaviorAllPageDataTable(params);
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
                dateRangePicker = new SocialReport.DateRangePicker('dateRangePicker'),
                pageSearchBox = new SocialReport.SearchBox('pageSearchBox'),
                titleSearchBox = new SocialReport.SearchBox('titleSearchBox');

            gobal.dataSelectorPanel = new SocialReport.Panel('', {
                components: [propertySelect, dateRangePicker, pageSearchBox, titleSearchBox],
                changeHandler: dataSelectorPanelChangeHandler
            });
            //start the dateRangePicker component
            dateRangePicker.triggerChangeEvent();
        });
    });

}(window, jQuery, SocialReport, layer, moment));
