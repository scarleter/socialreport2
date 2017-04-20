var window = window,
    jQuery = jQuery,
    SocialReport = SocialReport,
    layer = layer;

(function (window, $, SocialReport, layer) {
    'use strict';

    //set a gobal variable in this js file
    var gobal = {};

    //build frequency table
    function buildFqyTable(Operation) {
        var facebookOperation = Operation,
            numbersOfPosts = facebookOperation.getSize(),
            dateRange = gobal.dateRange.getRangeInDay(),
            frequency,
            data;
        facebookOperation.setDayRange(dateRange);
        frequency = facebookOperation.frequency();
        data = [
            ['Data', numbersOfPosts, dateRange, frequency]
        ];

        //if table is exist
        if (gobal.fqyDataTable) {
            //use repaint function to 
            gobal.fqyDataTable.repaint(data);
        } else {
            //build datatable object
            gobal.fqyDataTable = new SocialReport.DataTables('fqyDataTable', data, {
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
                    },
                    {
                        title: "Number of posts"
                    },
                    {
                        title: "Period(day)"
                    },
                    {
                        title: "Frequency"
                    }
                ]
            });
        }

    }

    //build PostsData table
    function buildPostsDataTable(Operation) {
        var facebookOperation = Operation,
            //it returan an object include attribute of `data` and `columnTitle`
            data = facebookOperation.getFormatDataFromTableType('postsdata'),
            tableAttrs = {
                order: [7, 'des'],
                columns: data.columnTitle,
                columnDefs: [{
                    "className": "longnumber",
                    "targets": [0, 1]
                }],
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'copyHtml5',
                        text: 'Copy to clipboard',
                        filename: 'Facebook PageId(<?php echo $pageId;?>) PostDataLegacyView Report during ' + gobal.dateRange.getDateRangeInText()
                    },
                    {
                        extend: 'excelHtml5',
                        text: 'Save to XLSX file',
                        filename: 'Facebook PageId(<?php echo $pageId;?>) PostDataLegacyView Report during ' + gobal.dateRange.getDateRangeInText()
                    }
                ]
            };
        //if table is exist
        if (gobal.postsDataTable) {
            //use repaint
            gobal.postsDataTable.repaint(data.data, tableAttrs);
        } else {
            //build datatable object
            gobal.postsDataTable = new SocialReport.DataTables('postsDataTable', data.data, tableAttrs);
        }
    }

    //build Average PostsData table
    function buildAveragePostsDataTable(Operation) {
        var facebookOperation = Operation,
            //it returan an object include attribute of `data` and `columnTitle`
            data = facebookOperation.getFormatDataFromTableType('averagepostsdata'),
            tableAttrs = {
                paging: false,
                lengthChange: false,
                searching: false,
                ordering: false,
                info: false,
                autoWidth: false,
                columns: data.columnTitle
            };
        //if table is exist
        if (gobal.averagePostsDataTable) {
            //use repaint
            gobal.averagePostsDataTable.repaint(data.data, tableAttrs);
        } else {
            //build datatable object
            gobal.averagePostsDataTable = new SocialReport.DataTables('averagePostsDataTable', data.data, tableAttrs);
        }
    }

    //build ReachRateDataTable
    function buildReachRateDataTable(Operation) {
        var facebookOperation = Operation,
            //it returan an object include attribute of `data` and `columnTitle`
            data = facebookOperation.getFormatDataFromTableType('reachrate'),
            tableAttrs = {
                paging: false,
                lengthChange: false,
                searching: false,
                ordering: false,
                info: false,
                autoWidth: false,
                columns: data.columnTitle
            };
        //if table is exist
        if (gobal.reachRateDataTable) {
            //use repaint
            gobal.reachRateDataTable.repaint(data.data, tableAttrs);
        } else {
            //build datatable object
            gobal.reachRateDataTable = new SocialReport.DataTables('reachRateDataTable', data.data, tableAttrs);
        }
    }

    //build EngagementRateDataTable
    function buildEngagementRateDataTable(Operation) {
        var facebookOperation = Operation,
            //it returan an object include attribute of `data` and `columnTitle`
            data = facebookOperation.getFormatDataFromTableType('engagementrate'),
            tableAttrs = {
                paging: false,
                lengthChange: false,
                searching: false,
                ordering: false,
                info: false,
                autoWidth: false,
                columns: data.columnTitle
            };
        //if table is exist
        if (gobal.engagementRateDataTable) {
            //use repaint
            gobal.engagementRateDataTable.repaint(data.data, tableAttrs);
        } else {
            //build datatable object
            gobal.engagementRateDataTable = new SocialReport.DataTables('engagementRateDataTable', data.data, tableAttrs);
        }
    }

    //build TopLinksDataTable
    function buildTopLinksDataTable(Operation) {
        var facebookOperation = Operation,
            //it returan an object include attribute of `data` and `columnTitle`
            data = facebookOperation.getFormatDataFromTableType('toplinks'),
            tableAttrs = {
                paging: false,
                lengthChange: false,
                searching: false,
                ordering: false,
                info: false,
                autoWidth: false,
                columns: data.columnTitle,
                columnDefs: [{
                    "className": "longnumber",
                    "targets": [0, 1]
                }]
            };
        //if table is exist
        if (gobal.topLinksDataTable) {
            //use repaint
            gobal.topLinksDataTable.repaint(data.data, tableAttrs);
        } else {
            //build datatable object
            gobal.topLinksDataTable = new SocialReport.DataTables('topLinksDataTable', data.data, tableAttrs);
        }
    }

    //build TopPhotosDataTable
    function buildTopPhotosDataTable(Operation) {
        var facebookOperation = Operation,
            //it returan an object include attribute of `data` and `columnTitle`
            data = facebookOperation.getFormatDataFromTableType('topphotos'),
            tableAttrs = {
                paging: false,
                lengthChange: false,
                searching: false,
                ordering: false,
                info: false,
                autoWidth: false,
                columns: data.columnTitle,
                columnDefs: [{
                    "className": "longnumber",
                    "targets": [0, 1]
                }]
            };
        //if table is exist
        if (gobal.topPhotosDataTable) {
            //use repaint
            gobal.topPhotosDataTable.repaint(data.data, tableAttrs);
        } else {
            //build datatable object
            gobal.topPhotosDataTable = new SocialReport.DataTables('topPhotosDataTable', data.data, tableAttrs);
        }
    }

    //build TopVideosDataTable
    function buildTopVideosDataTable(Operation) {
        var facebookOperation = Operation,
            //it returan an object include attribute of `data` and `columnTitle`
            data = facebookOperation.getFormatDataFromTableType('topvideos'),
            tableAttrs = {
                paging: false,
                lengthChange: false,
                searching: false,
                ordering: false,
                info: false,
                autoWidth: false,
                columns: data.columnTitle,
                columnDefs: [{
                    "className": "longnumber",
                    "targets": [0, 1]
                }]
            };
        //if table is exist
        if (gobal.topVideosDataTable) {
            //use repaint
            gobal.topVideosDataTable.repaint(data.data, tableAttrs);
        } else {
            //build datatable object
            gobal.topVideosDataTable = new SocialReport.DataTables('topVideosDataTable', data.data, tableAttrs);
        }
    }

    //dateRange change will trigger this function
    function dateRangeChangeHandler(start, end) {
        //set paras for getting facebook data
        var params = {
            since: start.unix(),
            until: end.unix(),
            pageid: window.troperlaicos.facebook.pageid,
            access_token: window.troperlaicos.facebook.access_token
        };
        //set a new one ajax loading layer
        gobal.websiteLoadingLayer = layer.load(2, {
            shade: [0.1, '#000']
        });
        //use asynchronous to get facebook data(posts and reach) and put the follow steps in the callback function such as `buildTable`.
        SocialReport.Facebook.genFacebookOperation(params, function () { //it is a callback function to build tables
            //close loadding layer
            layer.close(gobal.websiteLoadingLayer);
            var facebookOperation = this;
            //build tables
            buildFqyTable(facebookOperation);
            buildPostsDataTable(facebookOperation);
            buildAveragePostsDataTable(facebookOperation);
            buildReachRateDataTable(facebookOperation);
            buildEngagementRateDataTable(facebookOperation);
            buildTopLinksDataTable(facebookOperation);
            buildTopPhotosDataTable(facebookOperation);
            buildTopVideosDataTable(facebookOperation);
        });
    }

    $(function () {

        //by default dateRangePicker not run in the first time ,you need to trigger it's trigger change event
        gobal.dateRange = (new SocialReport.DateRangePicker('dateRange', {
            changeHandler: dateRangeChangeHandler
        })).triggerChangeEvent();

    });

}(window, jQuery, SocialReport, layer));
