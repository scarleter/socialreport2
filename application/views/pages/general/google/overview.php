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
            'ids': JSON.parse('<?php echo $ids;?>'),
            'behaviorAllPagesMax': 30,
        };
        //load google script and get google authorize
        SocialReport.GoogleAnalytics.ready('<?php echo $accessToken;?>', googleAnalyticsReady);
    });

    //when google script is loaded and get google authorize this function will call
    function googleAnalyticsReady() {
        var googleAnalytics = this;

        //data selector panel,change Property and dateRnage to get different data
        troperlaicos.dataSelectorPanel = new SocialReport.DataComparePanel('dataSelectorPanel', {
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
            since: start.format("YYYY-MM-DD"),
            until: end.format("YYYY-MM-DD"),
            ids: currentProperty
        };

        //build google analytics chart
        buildOverviewDataTable(params);
        buildUsersLineChart(params);
        buildPageviewsLineChart(params);
        buildAvgSessionDurationLineChart(params);
    }
    
    //build overview data table
    function buildOverviewDataTable(Params){
        var params = $.extend({}, {
            metrics: 'ga:sessions,ga:users,ga:pageviews,ga:pageviewsPerSession',
            dimensions: 'ga:medium'
        }, Params);
        SocialReport.GoogleAnalytics.getGoogleAnalyticsData(params, function(resp) {
            var dataArr = [];
            
            //make sure resp.totalsForAllResults exist
            if(!resp.totalsForAllResults){
                SocialReport.Toolbox.assert.assert('No data avaliable in the request of Overview of google analytics');
                return false;
            }
            //set data to dataArr
            dataArr.push([resp.totalsForAllResults['ga:sessions'], resp.totalsForAllResults['ga:users'], resp.totalsForAllResults['ga:pageviews'], resp.totalsForAllResults['ga:pageviewsPerSession']]);
            //if table is exist
            if (troperlaicos.overviewTable) {
                //use repaint function to 
                troperlaicos.overviewTable.repaint(data);
            } else {
                //build datatable object
                troperlaicos.overviewTable = new SocialReport.DataTables('overviewTable', dataArr, {
                    paging: false,
                    lengthChange: false,
                    searching: false,
                    ordering: false,
                    info: false,
                    autoWidth: false,
                    border: false,
                    columns: [{
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
    function buildUsersLineChart(Params){
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
                        pattern: 'yyyy/M/d'//for formatting tooltip
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
    function buildPageviewsLineChart(Params){
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
                        pattern: 'yyyy/M/d'//for formatting tooltip
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
                        pattern: 'yyyy/M/d'//for formatting tooltip
                    }, {
                        type: 'datetime',
                        name: 'Avg. Session Duration',
                        pattern: 'mm:ss'//for formatting tooltip
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

</script>
