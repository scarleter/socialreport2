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
        editorsSummaryObj: {},
        articlePageviews: {}
    };

    //get google pageviews
    function getGooglePageviews(Params, Callback) {
        var params = $.extend({}, {
            'metrics': 'ga:pageviews',
            'dimensions': 'ga:dimension3',
            'sort': '-ga:pageviews'
        }, Params);

        SocialReport.GoogleAnalytics.getGoogleAnalyticsData(params, function (resp) {
            var articleKey,
                articleId;
            //init `articlePageviews`
            gobal.articlePageviews = {};

            //loop resp.rows
            for (articleKey in resp.rows) {
                if (resp.rows.hasOwnProperty(articleKey)) {
                    articleId = resp.rows[articleKey][0];
                    gobal.articlePageviews[articleId] = (gobal.articlePageviews.hasOwnProperty(articleId)) ? gobal.articlePageviews[articleId] : {
                        pageviews: 0
                    };
                    gobal.articlePageviews[articleId].pageviews += parseInt(resp.rows[articleKey][1], 0);
                }
            }

            Callback.call(gobal.articlePageviews);
        });
    }

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
                        title: "Pageviews"
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
                order: [2, 'des'],
                info: false,
                autoWidth: false,
                border: false,
                columns: [
                    {
                        title: "Editor"
                    },
                    {
                        title: "Posts"
                    },
                    {
                        title: "Pageviews"
                    }
                ]
            });
        }
    }

    //build data tables
    function buildDataTables(Start, End, DateType, ArticlePageviews) {
        var start = Start || null,
            end = End || null,
            dateType = DateType || null,
            articlePageviews = ArticlePageviews || null;

        //format cms data
        function formatCmsData(Data) {
            var eachArticleData = [],
                data = Data || {},
                formatedDetailData = [],
                summaryData = {},
                formatedSummaryData = [],
                url = '',
                dataKey,
                summaryKey,
                articleid,
                pageviews;

            //loop `data`
            for (dataKey in data) {
                if (data.hasOwnProperty(dataKey)) {
                    eachArticleData = [];
                    articleid = data[dataKey].articles.articleid;
                    pageviews = SocialReport.Toolbox.isUndefined(articlePageviews[articleid]) ? 0 : articlePageviews[articleid].pageviews;
                    url = 'http://easttouch.my-magazine.me/main/' + data[dataKey].articles.category + '/view/' + data[dataKey].articles.articleid;

                    eachArticleData.push(data[dataKey].articles.author);
                    eachArticleData.push('<a href="' + url + '" target="_blank">' + url + '</a>');
                    eachArticleData.push(data[dataKey].articles.title);
                    eachArticleData.push(data[dataKey].articles[DateType]);
                    eachArticleData.push(pageviews);
                    eachArticleData.push(data[dataKey].articles.state);
                    formatedDetailData.push(eachArticleData);

                    //get summary data
                    //create one object name `author` if `summaryData` does not have one
                    summaryData[data[dataKey].articles.author] = (summaryData.hasOwnProperty(data[dataKey].articles.author)) ? summaryData[data[dataKey].articles.author] : {
                        postNum: 0,
                        pageviews: 0
                    };
                    summaryData[data[dataKey].articles.author].postNum += 1;
                    summaryData[data[dataKey].articles.author].pageviews += pageviews;
                }
            }

            //loop `summaryData`
            for (summaryKey in summaryData) {
                if (summaryData.hasOwnProperty(summaryKey)) {
                    formatedSummaryData.push([summaryKey, summaryData[summaryKey].postNum, summaryData[summaryKey].pageviews]);
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
        var currentDateType = ComponentList.dateTypeSelect.getCurrentValue(),
            start = ComponentList.dateRangePicker.getStart(),
            end = ComponentList.dateRangePicker.getEnd(),
            currentProperty = ComponentList.propertySelect.getCurrentValue(),
            params = {
                'start-date': start.format("YYYY-MM-DD"),
                'end-date': end.format("YYYY-MM-DD"),
                'ids': currentProperty
            };

        gobal.start = start;
        gobal.end = end;

        //set google request loading layer
        //        gobal.googleRequestloadingLayer = layer.load(2, {
        //            shade: [0.1, '#000']
        //        });

        //get google pageviews
        getGooglePageviews(params, function () {
            var articlePageviews = this;
            
            //get cms article
            buildDataTables(start.format("YYYY-MM-DD HH:mm:ss"), end.format("YYYY-MM-DD HH:mm:ss"), currentDateType, articlePageviews);
        });


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
                propertySelect = new SocialReport.Select('propertySelect', {
                    option: gobal.ids
                }),
                dateTypeSelect = new SocialReport.Select('dateTypeSelect', {
                    option: {
                        'start': 'Publish Date',
                        'created': 'Create Date'
                    }
                }),
                dateRangePicker = new SocialReport.DateRangePicker('dateRangePicker');

            gobal.dataSelectorPanel = new SocialReport.Panel('', {
                components: [dateTypeSelect, dateRangePicker, propertySelect],
                changeHandler: dataSelectorPanelChangeHandler
            });
            //start the dateRangePicker component
            dateRangePicker.triggerChangeEvent();
        });
    });

}(window, jQuery, SocialReport, layer, moment));
