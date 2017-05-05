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
    
    //calculate editor total posts number and post reach
    function calcuateEditorPostsAndReach(Editor, Reach) {
        var editor = Editor || null,
            reach = Reach || null;

        //make sure `editor` and `reach` is not null
        if (SocialReport.Toolbox.isNull(editor) || SocialReport.Toolbox.isNull(reach)) {
            SocialReport.Toolbox.assert('Function articlePerformanceReport.js calcuateEditorPostsAndReach: `editor` or `reach` is undefined');
            return false;
        }

        gobal.editorsSummaryObj[editor] = (gobal.editorsSummaryObj.hasOwnProperty(editor)) ? gobal.editorsSummaryObj[editor] : {
            postsNum: 0,
            reach: 0
        };
        gobal.editorsSummaryObj[editor].postsNum += 1;
        gobal.editorsSummaryObj[editor].reach += reach;
    }
    
    //build summary report
    function buildSummaryReportDataTable() {
        var chartData = [],
            editor,
            editorArray = [];

        //loop to set chartData
        for (editor in gobal.editorsSummaryObj) {
            if (gobal.editorsSummaryObj.hasOwnProperty(editor)) {
                editorArray = [];
                editorArray.push(editor);
                editorArray.push(gobal.editorsSummaryObj[editor].postsNum);
                editorArray.push(gobal.editorsSummaryObj[editor].reach);
                chartData.push(editorArray);
            }
        }

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
                        title: "Pages Views"
                    }
                ]
            });
        }
    }

    //build detailReport data table
    function buildDetailReportDataTable(Params) {
        var params = $.extend({}, {
            'metrics': 'ga:pageviews',
            'dimensions': 'ga:dimension1,ga:pagePath,ga:pageTitle,ga:dimension2',
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
                    dataArr.push(dateSource[rowKey][0]);
                    url = 'http://eastweek.my-magazine.me' + dateSource[rowKey][1];
                    dataArr.push('<a href="' + url + '" target="_blank">' + url + '</a>');
                    dataArr.push(dateSource[rowKey][2]);
                    dataArr.push(dateSource[rowKey][3]);
                    dataArr.push(parseInt(dateSource[rowKey][4], 0).toLocaleString());
                    chartData.push(dataArr);
                    
                    //calculate editor posts number and total reach
                    calcuateEditorPostsAndReach(dateSource[rowKey][0], parseInt(dateSource[rowKey][4], 0));
                }
            }
            //if table is exist
            if (gobal.detailReport) {
                //use repaint function to 
                gobal.detailReport.repaint(chartData);
            } else {
                //build datatable object
                gobal.detailReport = new SocialReport.DataTables('detailReport', chartData, {
                    paging: false,
                    lengthChange: false,
                    searching: false,
                    order: [4, 'des'],
                    info: false,
                    autoWidth: false,
                    border: false,
                    columnDefs: [{
                        "className": "breakall",
                        "targets": [0]
                    }],
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
                            title: "GA Pageviews"
                        }
                    ]
                });
            }
            
            //build Summary Report
            buildSummaryReportDataTable();

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
        buildDetailReportDataTable(params);
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
