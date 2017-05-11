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
        base_url: window.troperlaicos.google.base_url,
        controllerName: window.troperlaicos.google.controllerName,
        websiteName: window.troperlaicos.google.websiteName,
        cmsDataUrl: window.troperlaicos.google.cmsDataUrl,
        editorsSummaryObj: {},
        articlePageviews: {}
    };

    //get google pageviews
    function getGooglePageviews(Params, Callback) {
        var params = $.extend({}, {
                'metrics': 'ga:pageviews',
                'dimensions': 'ga:dimension3',
                'sort': '-ga:pageviews'
            }, Params),
            requestDoneTimes = 0,
            ids = gobal.ids,
            id,
            idNums = window.SocialReport.Toolbox.getObjectSize(ids);

        //init `articlePageviews`
        gobal.articlePageviews = {};

        //request pageview
        function requestGAPageviews(Params) {
            var params = Params || {};

            SocialReport.GoogleAnalytics.getGoogleAnalyticsData(params, function (resp) {
                var articleKey,
                    articleId;

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

                //record request done
                requestDoneTimes += 1;

                if (requestDoneTimes >= idNums) {
                    Callback.call(gobal.articlePageviews);
                }
            });
        }

        //loop ids to request pageviews
        for (id in ids) {
            if (ids.hasOwnProperty(id)) {
                params = $.extend({}, params, {
                    'ids': id
                });

                requestGAPageviews(params);
            }
        }
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
                ordering: false,
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
                        title: "Date"
                    },
                    {
                        title: "Post Link"
                    },
                    {
                        title: "Post Title"
                    },
                    {
                        title: "Pageviews"
                    },
                    {
                        title: "State"
                    }
                ],
                iDisplayLength: 50,
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

    //get cms data between dayrange
    function getCmsDataBetweenDayRange(start, end, dateType, successCallback, errorCallback) {
        $.ajax({
            type: 'GET',
            url: gobal.cmsDataUrl,
            data: {
                'startDateTime': start,
                'endDateTime': end,
                type: dateType
            },
            dataType: 'jsonp',
            jsonp: 'callback',
            jsonpCallback: 'getName',
            success: function (data) {
                successCallback.call(null, data);
            },
            error: function (error) {
                errorCallback.call(null, error);
            }
        });
    }

    //format cms data
    function formatCmsData(SourceData, articlePageviews, opinions, Callback) {
        var start = opinions.start || null,
            end = opinions.end || null,
            dateType = opinions.dateType || 'start',
            interval = opinions.interval || 1,
            reservedEditor = opinions.reservedEditor || 'all',
            showEmptySlot = (opinions.showEmptySlot === 'enable') || false,
            data = [],
            sourceData = SourceData || [],
            formatedData = [],
            summaryData = {},
            summaryReportData = [],
            url = '',
            editor = '',
            sourceDataKey,
            summaryKey,
            articleid,
            pageviews,
            writingScheduleData = {},
            writingScheduleDataKey,
            timeKeyInSourceData = 1,
            editorKeyInSourceData = 0,
            descriptioinKeyInSourceData = 3,
            metricsKeyInSourceData = 4,
            reportHeaderText = gobal.websiteName + ' CMS\'s Writing Schedule ',
            detailReportData = [],
            editorList = {};

        //iterator
        function iterator(key, value, context) {
            var postKeyDuringPeriod = 0;

            //empty data
            if (value.length <= 0) {

                //if `showEmptySlot` is true, we create an empty slot
                if (showEmptySlot) {
                    context.push(['', '<div class="timeWrapper">' + key + '</div>', '', '', '', '']);
                }
            } else {
                for (postKeyDuringPeriod = 0; postKeyDuringPeriod < value.length; postKeyDuringPeriod += 1) {
                    context.push([value[postKeyDuringPeriod][0], (postKeyDuringPeriod === 0) ? '<div class="timeWrapper">' + key + '</div>' : '', value[postKeyDuringPeriod][2], value[postKeyDuringPeriod][3], value[postKeyDuringPeriod][4], value[postKeyDuringPeriod][5]]);
                }
            }
        }

        //loop `sourceData`
        for (sourceDataKey = sourceData.length - 1; sourceDataKey >= 0; sourceDataKey -= 1) {
            articleid = sourceData[sourceDataKey].id;
            pageviews = SocialReport.Toolbox.isUndefined(articlePageviews[articleid]) ? 0 : articlePageviews[articleid].pageviews;
            url = sourceData[sourceDataKey].url;
            editor = sourceData[sourceDataKey].author;

            // reserve editor
            if (reservedEditor === 'all' || reservedEditor === editor) {
                data = [];
                data.push(editor);
                data.push(sourceData[sourceDataKey].date);
                data.push('<a href="' + url + '" target="_blank">' + url + '</a>');
                data.push(sourceData[sourceDataKey].title);
                data.push(pageviews);
                data.push(sourceData[sourceDataKey].state);
                formatedData.push(data);
            }

            //get summary data
            //create one object name `author` if `summaryData` does not have one
            summaryData[editor] = (summaryData.hasOwnProperty(editor)) ? summaryData[editor] : {
                postNum: 0,
                pageviews: 0
            };
            summaryData[editor].postNum += 1;
            summaryData[editor].pageviews += pageviews;

            //set editorList
            editorList[editor] = editor;
        }

        //loop `summaryData`
        for (summaryKey in summaryData) {
            if (summaryData.hasOwnProperty(summaryKey)) {
                summaryReportData.push([summaryKey, summaryData[summaryKey].postNum, summaryData[summaryKey].pageviews]);
            }
        }

        //get writingScheduleData
        writingScheduleData = SocialReport.Operation.prototype.generateWritingScheduleData.call(null, formatedData, timeKeyInSourceData, editorKeyInSourceData, {
            interval: interval,
            reservedEditor: reservedEditor,
            showEmptySlot: showEmptySlot
        });

        //loop to format data in datatable format
        for (writingScheduleDataKey in writingScheduleData) {
            if (writingScheduleData.hasOwnProperty(writingScheduleDataKey)) {
                detailReportData.push(['', '<div class="dateHeader">' + writingScheduleDataKey + '</div>', '', '', '', '']);
                writingScheduleData[writingScheduleDataKey].map(iterator, detailReportData);
            }
        }

        //generate `writingScheduleExcelData`
        gobal.writingScheduleExcelData = SocialReport.Operation.prototype.generateWritingScheduleExcelData.call(null, writingScheduleData, start, end, {
            timeKeyInPostData: timeKeyInSourceData,
            editorKeyInPostData: editorKeyInSourceData,
            descriptioinKeyInPostData: descriptioinKeyInSourceData,
            metricsKeyInPostData: metricsKeyInSourceData,
            reportHeaderText: reportHeaderText
        });

        Callback.call(null, {
            detailReportData: detailReportData,
            summaryReportData: summaryReportData,
            editorList: editorList
        });
    }

    //build data tables
    function buildDataTables(ArticlePageviews, Opinions) {
        var articlePageviews = ArticlePageviews || null,
            opinions = Opinions || {},
            start = opinions.start || null,
            end = opinions.end || null,
            dateType = opinions.dateType || 'start';

        //get cms data
        getCmsDataBetweenDayRange(start, end, dateType, function (data) {

            //close google request loading layer
            layer.close(gobal.googleRequestloadingLayer);
            formatCmsData(data, articlePageviews, opinions, function (data) {

                //build detail report
                buildDetailReport(data.detailReportData, start, end);
                //build summary report
                buildSummaryReport(data.summaryReportData);
                //update editorSelector editor list
                gobal.dataSelectorPanel.componentCombiner.getComponent('editorSelector').addOption(data.editorList);
            });
        }, function (error) {

            //close google request loading layer
            layer.close(gobal.googleRequestloadingLayer);
            SocialReport.Toolbox.assert('Function articlePerformanceReport.js buildDataTables: ' + error);
        });

        //make sure `start`, `end` or `dateType` is not null
        if (SocialReport.Toolbox.isNull(start) || SocialReport.Toolbox.isNull(end) || SocialReport.Toolbox.isNull(dateType)) {
            SocialReport.Toolbox.assert('Function articlePerformanceReport.js buildDataTables: `start`, `end` or `dateType` is undefined');
            return false;
        }

    }

    //generate weekly repport on server
    window.generateWeeklyReportExcel = function () {
        //set a new one ajax loading layer
        gobal.genWeeklyReportLayer = layer.load(2, {
            shade: [0.1, '#000']
        });

        $.ajax({
            type: 'POST',
            url: gobal.base_url + gobal.controllerName + '/generateWeeklyReportExcel',
            data: {
                'writingScheduleExcelData': JSON.stringify(gobal.writingScheduleExcelData),
                'excelName': gobal.websiteName + ' CMS\'s Writing Schedule ' + gobal.dataSelectorPanel.componentCombiner.getComponent('dateRangePicker').getDateRangeInText()
            },
            dataType: 'json',
            success: function (data) {
                //close loadding layer
                layer.close(gobal.genWeeklyReportLayer);
                if (data.hasOwnProperty('downloadUrl')) {
                    window.location.href = data.downloadUrl;
                }
            },
            error: function (error) {
                //close loadding layer
                layer.close(gobal.genWeeklyReportLayer);
                SocialReport.Toolbox.assert(error);
            }
        });
    };

    //##################################################
    //dataSelectorPanel change will trigger this handler
    //##################################################
    function dataSelectorPanelChangeHandler(ComponentList) {
        var currentDateType = ComponentList.dateTypeSelect.getCurrentValue(),
            interval = ComponentList.intervalSelector.getCurrentValue(),
            reservedEditor = ComponentList.editorSelector.getCurrentValue(),
            showEmptySlot = ComponentList.emptySlotSelector.getCurrentValue(),
            start = ComponentList.dateRangePicker.getStart(),
            end = ComponentList.dateRangePicker.getEnd(),
            params = {
                'start-date': start.format("YYYY-MM-DD"),
                'end-date': end.format("YYYY-MM-DD")
            };

        gobal.start = start;
        gobal.end = end;

        //set google request loading layer
        gobal.googleRequestloadingLayer = layer.load(2, {
            shade: [0.1, '#000']
        });

        //get google pageviews
        getGooglePageviews(params, function () {
            var articlePageviews = this;

            //get cms article
            //            buildDataTables(start.format("YYYY-MM-DD HH:mm:ss"), end.format("YYYY-MM-DD HH:mm:ss"), currentDateType, articlePageviews);
            buildDataTables(articlePageviews, {
                start: start.format("YYYY-MM-DD HH:mm:ss"),
                end: end.format("YYYY-MM-DD HH:mm:ss"),
                dateType: currentDateType,
                interval: interval,
                reservedEditor: reservedEditor,
                showEmptySlot: showEmptySlot
            });
        });
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
                intervalSelector = new SocialReport.Select('intervalSelector', {
                    option: {
                        '1': '1 minutes',
                        '15': '15 minutes',
                        '30': '30 minutes',
                        '60': '60 minutes'
                    },
                    defaultValue: '15'
                }),
                dateTypeSelect = new SocialReport.Select('dateTypeSelect', {
                    option: {
                        'start': 'Publish Date',
                        'created': 'Create Date'
                    }
                }),
                dateRangePicker = new SocialReport.DateRangePicker('dateRangePicker'),
                editorSelector = new SocialReport.Select('editorSelector', {
                    option: {
                        all: 'all'
                    }
                }),
                emptySlotSelector = new SocialReport.Select('emptySlotSelector', {
                    option: {
                        disable: 'disable',
                        enable: 'enable'
                    }
                });

            gobal.dataSelectorPanel = new SocialReport.Panel('', {
                components: [intervalSelector, dateTypeSelect, dateRangePicker, editorSelector, emptySlotSelector],
                changeHandler: dataSelectorPanelChangeHandler
            });
            //start the dateRangePicker component
            dateRangePicker.triggerChangeEvent();
        });
    });

}(window, jQuery, SocialReport, layer, moment));
