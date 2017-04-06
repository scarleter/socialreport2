<!-- Content Wrapper. Contains page content -->

<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            Data Compare
        </h1>
        <ol class="breadcrumb">
            <!--<li><a href="<?= base_url() ?>overview"><i class="fa fa-dashboard"></i> Overview</a></li>-->
        </ol>
    </section>

    <!-- Main content -->
    <section class="content">
        <div class="row">

            <style>
                .pageContainer {
                    white-space: nowrap;
                    text-align: left;
                }
                
                .pageContainer label {
                    padding-left: 10px;
                }
                
                table.dataTable thead .sorting:after {
                    opacity: 0;
                }
                
                table.dataTable thead .sorting:after,
                table.dataTable thead .sorting_asc:after,
                table.dataTable thead .sorting_desc:after {
                    opacity: 0;
                }
                
                table.table-bordered.dataTable {
                    border-collapse: collapse !important;
                }
                
                table.table-bordered.dataTable tbody th,
                table.table-bordered.dataTable tbody td {
                    vertical-align: baseline;
                }

            </style>
            <div class="col-md-12">
                <div class="box box-info ptwBox">
                    <div class="box-header">
                        <h3 class="box-title text-aqua">Pages to Watch</h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <label>Compare the performance of your Page and posts with similar Pages on Facebook.</label>
                        <table id="ptwDataTable" class="table table-striped table-bordered dt-responsive" cellspacing="0" width="100%"></table>
                    </div>
                    <!-- /.box-body -->
                </div>
            </div>

            <div class="col-md-6">
                <div class="box box-info">
                    <div class="box-header">
                        <h3 class="box-title text-aqua">
                            <?php echo $websiteName;?> Panel:</h3>

                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
                        </div>
                    </div>
                    <div class="box-body">
                        <span id="websitePanel"></span>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="box">
                    <div class="box-header">
                        <h3 class="box-title text-muted">Customize Panel:</h3>

                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
                        </div>
                    </div>
                    <div class="box-body">
                        <span id="competitorPanel"></span>
                    </div>
                </div>
            </div>

            <div class="col-md-12">
                <!-- LINE CHART -->
                <div class="box box-info">
                    <div class="box-header with-border">
                        <h3 class="box-title">Number of Posts
                            <span class="nopSummaryContainer"></span>
                        </h3>

                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
                            <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
                        </div>
                    </div>
                    <div class="box-body">
                        <span id="postSizeLineChart"></span>
                    </div>
                    <!-- /.box-body -->
                </div>
                <!-- /.box -->
            </div>

            <div class="col-md-12">
                <!-- LINE CHART -->
                <div class="box box-info">
                    <div class="box-header with-border">
                        <h3 class="box-title">Avg Reach By Posts
                            <span class="arSummaryContainer"></span>
                        </h3>

                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
                            <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
                        </div>
                    </div>
                    <div class="box-body">
                        <div class="chart">
                            <canvas id="avgReachByPostLineChart" style="height:300px"></canvas>
                        </div>
                    </div>
                    <!-- /.box-body -->
                </div>
                <!-- /.box -->
            </div>

            <div class="col-md-12">
                <!-- LINE CHART -->
                <div class="box box-info">
                    <div class="box-header with-border">
                        <h3 class="box-title">Avg Page Fans Like
                            <span class="apflSummaryContainer"></span>
                        </h3>

                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
                            <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
                        </div>
                    </div>
                    <div class="box-body">
                        <div class="chart">
                            <canvas id="avgFanPageLikeLineChart" style="height:300px"></canvas>
                        </div>
                    </div>
                    <!-- /.box-body -->
                </div>
                <!-- /.box -->
            </div>

            <div class="col-md-12">
                <!-- LINE CHART -->
                <div class="box box-info">
                    <div class="box-header with-border">
                        <h3 class="box-title">Reach% (Avg Reach / Avg Fans Like)
                            <span class="rpSummaryContainer"></span>
                        </h3>

                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
                            <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
                        </div>
                    </div>
                    <div class="box-body">
                        <div class="chart">
                            <canvas id="reachRateLineChart" style="height:300px"></canvas>
                        </div>
                    </div>
                    <!-- /.box-body -->
                </div>
                <!-- /.box -->
            </div>

        </div>
        <!-- /.row -->

    </section>
    <!-- /.content -->
</div>
<!-- /.content-wrapper -->

<script type="text/javascript">
    $(function() {
        //set a gobal variable
        window.troperlaicos = {
            pagesToWatchList: JSON.parse('<?php echo $pagesToWatchList;?>'),
            website: {
                currentName: '<?php echo $pageId;?>',
                lineChart: {},
            },
            competitor: {
                currentName: '',
                lineChart: {}
            },
        };
        //website setting panel,can choose dateRange to get different data
        troperlaicos.websitePanel = new SocialReport.DataComparePanel('websitePanel', {
            changeHandler: websitePanelChangeHandler,
            option: {
                '<?php echo $pageId;?>': '<?php echo $websiteName;?>'
            }
        });
        //competitor setting panel,change competitor and dateRnage to get different data
        troperlaicos.competitorPanel = new SocialReport.DataComparePanel('competitorPanel', {
            changeHandler: competitorPanelChangeHandler,
            option: troperlaicos.pagesToWatchList
        });

        //get page to watch dataTable data, it return labelArr and dataArr for dataTable api
        SocialReport.Facebook.genPagesToWatchListData({
            since: moment().subtract(6, 'days').hours(0).minutes(0).seconds(0).unix(),
            until: moment().hours(23).minutes(59).seconds(59).unix(),
            pageidList: troperlaicos.pagesToWatchList,
            access_token: '<?php echo $pageAccessToken;?>'
        });
    });

    //#############################################
    //websitePanel change will trigger this handler
    //#############################################
    function websitePanelChangeHandler(currentValue, start, end) {
        //set paras for getting facebook data
        var params = {
            since: start.unix(),
            until: end.unix(),
            pageid: currentValue,
            access_token: '<?php echo $pageAccessToken;?>',
            dataStart: start,
            dateEnd: end
        };
        //use asynchronous to get facebook data(posts and reach) and put the follow steps in the callback function such as `buildTable`.
        SocialReport.Facebook.genFacebookOperation(params, buildWebsiteLineChartDataToGobal);

        //it is a callback function to get LineChartData for website and set data in `troperlaicos`
        function buildWebsiteLineChartDataToGobal() {
            var facebookOperation = this;
            //it return an object include attribute of `labelArr` and `dataArr`
            postSizeData = facebookOperation.getFormatDataFromLineChartType('postsize');
            avgReachByPostData = facebookOperation.getFormatDataFromLineChartType('avgreachbypost');
            avgPageFanLikeData = facebookOperation.getFormatDataFromLineChartType('avgpagefanlike');
            //save it to global variable for further use
            troperlaicos.website.lineChart.postSizeData = postSizeData;
            troperlaicos.website.lineChart.avgReachByPostData = avgReachByPostData;
            troperlaicos.website.lineChart.avgFanPageLikeData = avgPageFanLikeData;
            //then when the other DataComparePanel finish load we build the whold LineChart
            if (troperlaicos.competitor.lineChart.postSizeData) {
                buildLineChart();
            }

        };
    };

    //################################################
    //competitorPanel change will trigger this handler
    //################################################
    function competitorPanelChangeHandler(currentValue, start, end) {
        //set paras for getting facebook data
        var params = {
            since: start.unix(),
            until: end.unix(),
            pageid: currentValue,
            access_token: '<?php echo $pageAccessToken;?>',
            dataStart: start,
            dateEnd: end
        };
        //use asynchronous to get facebook data(posts and reach) and put the follow steps in the callback function such as `buildTable`.
        SocialReport.Facebook.genFacebookOperation(params, buildCompetitorLineChartDataToGobal);
        troperlaicos.competitor.currentName = currentValue;

        //it is a callback function to get LineChartData for competitor and set data in `troperlaicos`
        function buildCompetitorLineChartDataToGobal() {
            var facebookOperation = this;
            //it return an object include attribute of `labelArr` and `dataArr`
            postSizeData = facebookOperation.getFormatDataFromLineChartType('postsize');
            avgReachByPostData = facebookOperation.getFormatDataFromLineChartType('avgreachbypost');
            avgPageFanLikeData = facebookOperation.getFormatDataFromLineChartType('avgpagefanlike');
            //save it to global variable for further use
            troperlaicos.competitor.lineChart.postSizeData = postSizeData;
            troperlaicos.competitor.lineChart.avgReachByPostData = avgReachByPostData;
            troperlaicos.competitor.lineChart.avgFanPageLikeData = avgPageFanLikeData;
            //then when the other DataComparePanel finish load we build the whold LineChart
            if (troperlaicos.website.lineChart.postSizeData) {
                buildLineChart();
            }
        };
    };

    //it is a callback function to build LineChart
    function buildLineChart() {
        //build LineChart
        buildPostSizeLineChart();
        buildAvgReachByPostLineChart();
        buildAvgPageFanLikeLineChart();
        buildReachRateLineChart();
    };

    //build number of posts lineChart data table 
    function buildPostSizeLineChart() {
        troperlaicos.postSizeLineChart = new SocialReport.LineChart('postSizeLineChart', {
            websiteName: troperlaicos.website.currentName,
            websiteLabelArr: troperlaicos.website.lineChart.postSizeData.labelArr,
            websiteDataArr: troperlaicos.website.lineChart.postSizeData.dataArr,
            competitorName: troperlaicos.competitor.currentName,
            competitorLabelArr: troperlaicos.competitor.lineChart.postSizeData.labelArr,
            competitorDataArr: troperlaicos.competitor.lineChart.postSizeData.dataArr
        });
    };

    //build avg reach by post number data table
    function buildAvgReachByPostLineChart() {
        troperlaicos.avgReachByPostLineChart = new SocialReport.LineChart('avgReachByPostLineChart', {
            websiteName: troperlaicos.website.currentName,
            websiteLabelArr: troperlaicos.website.lineChart.avgReachByPostData.labelArr,
            websiteDataArr: troperlaicos.website.lineChart.avgReachByPostData.dataArr,
            competitorName: troperlaicos.competitor.currentName,
            competitorLabelArr: troperlaicos.competitor.lineChart.avgReachByPostData.labelArr,
            competitorDataArr: troperlaicos.competitor.lineChart.avgReachByPostData.dataArr
        });
    };

    //build avg page fan like data table
    function buildAvgPageFanLikeLineChart() {
        troperlaicos.avgFanPageLikeLineChart = new SocialReport.LineChart('avgFanPageLikeLineChart', {
            websiteName: troperlaicos.website.currentName,
            websiteLabelArr: troperlaicos.website.lineChart.avgFanPageLikeData.labelArr,
            websiteDataArr: troperlaicos.website.lineChart.avgFanPageLikeData.dataArr,
            competitorName: troperlaicos.competitor.currentName,
            competitorLabelArr: troperlaicos.competitor.lineChart.avgFanPageLikeData.labelArr,
            competitorDataArr: troperlaicos.competitor.lineChart.avgFanPageLikeData.dataArr
        });
    };

    //build reach rate data table
    function buildReachRateLineChart() {
        var websiteAvgReachDataArr = troperlaicos.website.lineChart.avgReachByPostData.dataArr,
            websiteAvgFanLikeDataArr = troperlaicos.website.lineChart.avgFanPageLikeData.dataArr,
            competitorAvgReachDataArr = troperlaicos.competitor.lineChart.avgReachByPostData.dataArr,
            competitorAvgFanLikeDataArr = troperlaicos.competitor.lineChart.avgFanPageLikeData.dataArr,
            websiteReachRateArr = [],
            competitorReachRateArr = [],
            websiteKey = '',
            comopetitorKey = '',
            websiteReachRate = 0,
            competitorReachRate = 0;
        //loop to get website ReachRate
        for (websiteKey in websiteAvgReachDataArr) {
            if (websiteAvgReachDataArr.hasOwnProperty(websiteKey)) {
                websiteReachRate = (websiteAvgFanLikeDataArr[websiteKey] !== 0) ? parseFloat(websiteAvgReachDataArr[websiteKey] / websiteAvgFanLikeDataArr[websiteKey]).toFixed(2) : 0;
                websiteReachRateArr.push(websiteReachRate);
            }
        }
        //loop to get competitor ReachRate
        for (comopetitorKey in competitorAvgReachDataArr) {
            if (competitorAvgReachDataArr.hasOwnProperty(comopetitorKey)) {
                competitorReachRate = (competitorAvgReachDataArr[comopetitorKey] !== 0) ? parseFloat(competitorAvgReachDataArr[comopetitorKey] / competitorAvgFanLikeDataArr[comopetitorKey]).toFixed(2) : 0;
                competitorReachRateArr.push(competitorReachRate);
            }
        }
        troperlaicos.reachRateLineChart = new SocialReport.LineChart('reachRateLineChart', {
            websiteName: troperlaicos.website.currentName,
            websiteLabelArr: troperlaicos.website.lineChart.postSizeData.labelArr,
            websiteDataArr: websiteReachRateArr,
            competitorName: troperlaicos.competitor.currentName,
            competitorLabelArr: troperlaicos.competitor.lineChart.postSizeData.labelArr,
            competitorDataArr: competitorReachRateArr
        });
    };

</script>
