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
        accessToken: window.troperlaicos.google.accessToken,
        editorsSummaryObj: {}
    };

    //build detailReport
    function buildDetailReport(ChartData, Start, End) {
        var chartData = ChartData || [],
            start = Start || '',
            end = End || '';

        //if table is exist
        if (gobal.detailReport) {
            //use repaint function to 
            gobal.detailReport.repaint(chartData);
        } else {
            gobal.detailReport = new SocialReport.DataTables('detailReport', chartData, {
                lengthChange: false,
                searching: false,
                order: [3, 'des'],
                info: false,
                autoWidth: false,
                border: false,
                columnDefs: [
                    {
                        "className": "breakall",
                        "targets": [0]
                    }
                ],
                columns: [
                    {
                        title: "Editor"
                    },
                    {
                        title: "Post Link"
                    },
                    {
                        title: "Post Title"
                    },
                    {
                        title: "Date"
                    },
                    {
                        title: "State"
                    }
                ],
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'copyHtml5',
                        text: 'Copy to clipboard',
                        filename: 'Article Performance Report during ' + start.substring(0, 10) + ' to ' + end.substring(0, 10)
                    },
                    {
                        extend: 'excelHtml5',
                        text: 'Save to XLSX file',
                        filename: 'Article Performance Report during ' + start.substring(0, 10) + ' to ' + end.substring(0, 10)
                    }
                ]
            });
        }
    }

    //build summary report
    function buildSummaryReport(ChartData) {
        var chartData = ChartData || [];

        //if table is exist
        if (gobal.summaryReport) {
            //use repaint function to 
            gobal.summaryReport.repaint(chartData);
        } else {
            //build datatable object
            gobal.summaryReport = new SocialReport.DataTables('summaryReport', chartData, {
                paging: false,
                lengthChange: false,
                searching: false,
                order: [1, 'des'],
                info: false,
                autoWidth: false,
                border: false,
                columns: [
                    {
                        title: "Editor"
                    },
                    {
                        title: "Posts"
                    }
                ]
            });
        }
    }

    //build data tables
    function buildDataTables(Start, End, DateType) {
        var start = Start || null,
            end = End || null,
            dateType = DateType || null;

        //format cms data
        function formatCmsData(Data) {
            var eachArticleData = [],
                data = Data || {},
                formatedDetailData = [],
                summaryData = {},
                formatedSummaryData = [],
                url = '',
                dataKey,
                summaryKey;

            //loop `data`
            for (dataKey in data) {
                if (data.hasOwnProperty(dataKey)) {
                    eachArticleData = [];
                    url = 'http://easttouch.my-magazine.me/main/' + data[dataKey].articles.category + '/view/' + data[dataKey].articles.articleid;

                    eachArticleData.push(data[dataKey].articles.author);
                    eachArticleData.push('<a href="' + url + '" target="_blank">' + url + '</a>');
                    eachArticleData.push(data[dataKey].articles.title);
                    eachArticleData.push(data[dataKey].articles[DateType]);
                    eachArticleData.push(data[dataKey].articles.state);
                    formatedDetailData.push(eachArticleData);

                    //get summary data
                    //create one object name `author` if `summaryData` does not have one
                    summaryData[data[dataKey].articles.author] = (summaryData.hasOwnProperty(data[dataKey].articles.author)) ? summaryData[data[dataKey].articles.author] : {
                        postNum: 0,
                        reach: 0
                    };
                    summaryData[data[dataKey].articles.author].postNum += 1;
                }
            }

            //loop `summaryData`
            for (summaryKey in summaryData) {
                if (summaryData.hasOwnProperty(summaryKey)) {
                    formatedSummaryData.push([summaryKey, summaryData[summaryKey].postNum]);
                }
            }

            //build detail report
            buildDetailReport(formatedDetailData, start, end);
            //build summary report
            buildSummaryReport(formatedSummaryData);
        }

        //get cms data between dayrange
        function getCmsDataBetweenDayRange(start, end, dateType) {
            $.ajax({
                type: 'GET',
                url: 'http://easttouch.my-magazine.me/main/home/getArticleFromDayRange',
                data: {
                    'startDateTime': start,
                    'endDateTime': end,
                    type: dateType
                },
                dataType: 'jsonp',
                jsonp: 'callback',
                jsonpCallback: 'getName',
                success: function (data) {
                    //close google request loading layer
                    layer.close(gobal.googleRequestloadingLayer);

                    formatCmsData(data);
                },
                error: function (error) {
                    //close google request loading layer
                    layer.close(gobal.googleRequestloadingLayer);

                    SocialReport.Toolbox.assert('Function articlePerformanceReport.js buildDataTables: ' + error);
                }
            });
        }

        //make sure `start`, `end` or `dateType` is not null
        if (SocialReport.Toolbox.isNull(start) || SocialReport.Toolbox.isNull(end) || SocialReport.Toolbox.isNull(dateType)) {
            SocialReport.Toolbox.assert('Function articlePerformanceReport.js buildDataTables: `start`, `end` or `dateType` is undefined');
            return false;
        }

        getCmsDataBetweenDayRange(start, end, dateType);

    }

    //##################################################
    //dataSelectorPanel change will trigger this handler
    //##################################################
    function dataSelectorPanelChangeHandler(ComponentList) {
        var currentProperty = ComponentList.dateTypeSelect.getCurrentValue(),
            start = ComponentList.dateRangePicker.getStart(),
            end = ComponentList.dateRangePicker.getEnd();
        //            params = {
        //                'start-date': start.format("YYYY-MM-DD"),
        //                'end-date': end.format("YYYY-MM-DD"),
        //                'ids': currentProperty
        //            };

        //set google request loading layer
        gobal.googleRequestloadingLayer = layer.load(2, {
            shade: [0.1, '#000']
        });

        //get cms article
        buildDataTables(start.format("YYYY-MM-DD HH:mm:ss"), end.format("YYYY-MM-DD HH:mm:ss"), currentProperty);

        //build google analytics chart
        //buildDetailReportDataTable(params);
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
                dateTypeSelect = new SocialReport.Select('dateTypeSelect', {
                    option: {
                        'start': 'Publish Date',
                        'created': 'Create Date'
                    }
                }),
                dateRangePicker = new SocialReport.DateRangePicker('dateRangePicker');

            gobal.dataSelectorPanel = new SocialReport.Panel('', {
                components: [dateTypeSelect, dateRangePicker],
                changeHandler: dataSelectorPanelChangeHandler
            });
            //start the dateRangePicker component
            dateRangePicker.triggerChangeEvent();
        });
    });

}(window, jQuery, SocialReport, layer, moment));
