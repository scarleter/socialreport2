<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            <?php echo $websiteName.' Overview in Google';?>
        </h1>
        <ol class="breadcrumb">
            <!--<li><a href="<?= base_url() ?>overview"><i class="fa fa-dashboard"></i> Overview</a></li>-->
        </ol>
    </section>

    <!-- Main content -->
    <section class="content">
        <div class="row">

            <div class="col-md-12">
                <div class="box box-info">
                    <div class="box-header">
                        <h3 class="box-title text-aqua">Data Selector</h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                                </button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <!--
                        <span id="dataSelectorPanel"></span>
                        <span id="searchbox"></span>
-->

                        <div class="row">
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label>Property</label>
                                    <span id="propertySelect"></span>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label>Date range button:</label>
                                    <div class="input-group">
                                        <span id="dateRangePicker"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label>Page Search Box:</label>
                                    <span id="pageSearchBox"></span>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label>Title Search Box:</label>
                                    <span id="titleSearchBox"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- /.box-body -->
                </div>
            </div>

            <div class="col-md-12">
                <div class="box box-info">
                    <div class="box-header">
                        <h3 class="box-title text-aqua">Overview</h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                                </button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <table id="overviewTable" class="table table-striped table-bordered dt-responsive" cellspacing="0" width="100%"></table>
                    </div>
                    <!-- /.box-body -->
                </div>
            </div>

            <div class="col-md-12">
                <div class="box box-info">
                    <div class="box-header">
                        <h3 class="box-title text-aqua">Users Timeline</h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                                </button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <section id="userstimeline"></section>
                    </div>
                    <!-- /.box-body -->
                </div>
            </div>

            <div class="col-md-12">
                <div class="box box-info">
                    <div class="box-header">
                        <h3 class="box-title text-aqua">Pageviews Timeline</h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                                </button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <section id="pageviewstimeline"></section>
                    </div>
                    <!-- /.box-body -->
                </div>
            </div>

            <div class="col-md-12">
                <div class="box box-info">
                    <div class="box-header">
                        <h3 class="box-title text-aqua">Avg. Session Duration Timeline</h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                                </button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <section id="avgsessiondurationtimeline"></section>
                    </div>
                    <!-- /.box-body -->
                </div>
            </div>
            <style>
                .dt-responsive.table tr td.breakall {
                    word-break: break-all;
                    max-width: 350px;
                }

            </style>

            <div class="col-md-12">
                <div class="box box-info">
                    <div class="box-header">
                        <h3 class="box-title text-aqua">BEHAVIOR - ALL Pages</h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                                </button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <table id="behaviorAllPages" class="table table-striped table-bordered dt-responsive" cellspacing="0" width="100%"></table>
                    </div>
                    <!-- /.box-body -->
                </div>
            </div>

        </div>
    </section>
</div>
<script type="text/javascript">
    $(function() {
        //set a gobal variable
        window.troperlaicos = {
            ids: JSON.parse('<?php echo $ids;?>'),
            googleRequestloadingLayer: '',
            googleLoadingLayer: ''
        };
        //set google loading layer
        troperlaicos.googleLoadingLayer = layer.load(2, {
            shade: [0.1, '#000']
        });
        //load google script and get google authorize
        SocialReport.GoogleAnalytics.ready('<?php echo $accessToken;?>', googleAnalyticsReady);
    });

    //when google script is loaded and get google authorize this function will call
    function googleAnalyticsReady() {
        //close google loading layer
        layer.close(troperlaicos.googleLoadingLayer);
        var googleAnalytics = this,
            propertySelect = new SocialReport.Select('propertySelect', {
                option: troperlaicos.ids,
            }),
            dateRangePicker = new SocialReport.DateRangePicker('dateRangePicker'),
            pageSearchBox = new SocialReport.SearchBox('pageSearchBox'),
            titleSearchBox = new SocialReport.SearchBox('titleSearchBox');

        //data selector panel,change Property and dateRnage to get different data
        //        troperlaicos.dataSelectorPanel = new SocialReport.DateRangePickerSelectorPanel('dataSelectorPanel', {
        //            changeHandler: dataSelectorPanelChangeHandler,
        //            option: troperlaicos.ids,
        //            template: ['<div class="row"><div class="col-md-4"><div class="form-group"><label>Property</label><span id="', '%ID%Select"></span></div></div><div class="col-md-6"><div class="form-group"><label>Date range button:</label><div class="input-group"><span id="', '%ID%DateRangePicker"></span></div></div></div></div>']
        //        });

        troperlaicos.dataSelectorPanel = new SocialReport.Panel('', {
            components: [propertySelect, dateRangePicker, pageSearchBox, titleSearchBox],
            changeHandler: dataSelectorPanelChangeHandler
        });
        //start the dateRangePicker component
        dateRangePicker.triggerChangeEvent();
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
            filterArray.push('ga:pagePath=@' + pageFilterString + '');
        }
        if (titleFilterString) {
            filterArray.push('ga:PageTitle=@' + titleFilterString + '');
        }
        //only when filterArray not empty, we add `filters` to params
        if (filterArray.length > 0) {
            params.filters = filterArray.join(';');
        }

        //set google request loading layer
        troperlaicos.googleRequestloadingLayer = layer.load(2, {
            shade: [0.1, '#000']
        });

        //build google analytics chart
        buildOverviewDataTable(params);
        buildUsersLineChart(params);
        buildPageviewsLineChart(params);
        buildAvgSessionDurationLineChart(params);
        buildBehaviorAllPageDataTable(params);
    }

    //build overview data table
    function buildOverviewDataTable(Params) {
        var params = $.extend({}, {
            metrics: 'ga:sessions,ga:users,ga:pageviews,ga:pageviewsPerSession',
            dimensions: 'ga:medium'
        }, Params);
        SocialReport.GoogleAnalytics.getGoogleAnalyticsData(params, function(resp) {
            var chartData = [],
                dataSource = resp.totalsForAllResults || [];
            //set data to chartData
            chartData.push(['Data', Number(dataSource['ga:sessions']).toLocaleString(), Number(dataSource['ga:users']).toLocaleString(), Number(dataSource['ga:pageviews']).toLocaleString(), Number(dataSource['ga:pageviewsPerSession']).toFixed(2)]);
            //if table is exist
            if (troperlaicos.overviewTable) {
                //use repaint function to 
                troperlaicos.overviewTable.repaint(chartData);
            } else {
                //build datatable object
                troperlaicos.overviewTable = new SocialReport.DataTables('overviewTable', chartData, {
                    paging: false,
                    lengthChange: false,
                    searching: false,
                    ordering: false,
                    info: false,
                    autoWidth: false,
                    border: false,
                    columns: [{
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
        SocialReport.GoogleAnalytics.getGoogleAnalyticsData(params, function(resp) {
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
                options = {};
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
        SocialReport.GoogleAnalytics.getGoogleAnalyticsData(params, function(resp) {
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
                options = {};
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
        SocialReport.GoogleAnalytics.getGoogleAnalyticsData(params, function(resp) {
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
                options = {};
            //format data in 2d Array
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    chartData.rowData.push([new Date(data[key][0].substring(0, 4) + ',' + data[key][0].substring(4, 6) + ',' + data[key][0].substring(6, 8)), new Date(parseInt(data[key][2] * 1000))]);
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
        SocialReport.GoogleAnalytics.getGoogleAnalyticsData(params, function(resp) {
            //close google request loading layer
            layer.close(troperlaicos.googleRequestloadingLayer);

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
                    dataArr.push(parseInt(dateSource[rowKey][2]).toLocaleString());
                    dataArr.push(parseInt(dateSource[rowKey][3]).toLocaleString());
                    dataArr.push(moment().set({
                        'minute': 0,
                        'second': dateSource[rowKey][4]
                    }).format('mm:ss'));
                    chartData.push(dataArr);
                }
            }
            //if table is exist
            if (troperlaicos.behaviorAllPages) {
                //use repaint function to 
                troperlaicos.behaviorAllPages.repaint(chartData);
            } else {
                //build datatable object
                troperlaicos.behaviorAllPages = new SocialReport.DataTables('behaviorAllPages', chartData, {
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
                    columns: [{
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

</script>
