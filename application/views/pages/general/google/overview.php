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
                        <span id="dataSelectorPanel"></span>
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
        var googleAnalytics = this;

        //data selector panel,change Property and dateRnage to get different data
        troperlaicos.dataSelectorPanel = new SocialReport.DateRangePickerSelectorPanel('dataSelectorPanel', {
            changeHandler: dataSelectorPanelChangeHandler,
            option: troperlaicos.ids,
            template: ['<div class="row"><div class="col-md-4"><div class="form-group"><label>Property</label><span id="', '%ID%Select"></span></div></div><div class="col-md-6"><div class="form-group"><label>Date range button:</label><div class="input-group"><span id="', '%ID%DateRangePicker"></span></div></div></div></div>']
        });
    }

    //##################################################
    //dataSelectorPanel change will trigger this handler
    //##################################################
    function dataSelectorPanelChangeHandler(currentProperty, start, end) {
        var params = {
            'start-date': start.format("YYYY-MM-DD"),
            'end-date': end.format("YYYY-MM-DD"),
            ids: currentProperty
        };

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
            var chartData = [];

            //make sure resp.totalsForAllResults exist
            if (!resp.totalsForAllResults) {
                SocialReport.Toolbox.assert.assert('No data avaliable in the request of Overview of google analytics');
                return false;
            }
            //set data to chartData
            chartData.push(['Data', Number(resp.totalsForAllResults['ga:sessions']).toLocaleString(), Number(resp.totalsForAllResults['ga:users']).toLocaleString(), Number(resp.totalsForAllResults['ga:pageviews']).toLocaleString(), Number(resp.totalsForAllResults['ga:pageviewsPerSession']).toFixed(2)]);
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
                        pattern: 'yyyy/M/d' //for formatting tooltip
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
                        pattern: 'yyyy/M/d' //for formatting tooltip
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
                        pattern: 'yyyy/M/d' //for formatting tooltip
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
                url;

            //make sure resp.rows exist
            if (!resp.rows) {
                SocialReport.Toolbox.assert.assert('No data avaliable in the request of Behavior all page of google analytics');
                return false;
            }
            //loop to set data to chartData
            for (rowKey in resp.rows) {
                if (resp.rows.hasOwnProperty(rowKey)) {
                    dataArr = [];
                    url = 'http://eastweek.my-magazine.me' + resp.rows[rowKey][0];
                    dataArr.push('<a href="' + url + '" target="_blank">' + url + '</a>');
                    dataArr.push(resp.rows[rowKey][1]);
                    dataArr.push(parseInt(resp.rows[rowKey][2]).toLocaleString());
                    dataArr.push(parseInt(resp.rows[rowKey][3]).toLocaleString());
                    dataArr.push(moment().set({
                        'minute': 0,
                        'second': resp.rows[rowKey][4]
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
                    searching: true,
                    ordering: false,
                    info: false,
                    autoWidth: false,
                    border: false,
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
