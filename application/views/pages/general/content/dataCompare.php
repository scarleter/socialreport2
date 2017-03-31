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
            website: {
                lineChart: {
                    postSize: {},
                    avgReachByPost: {},
                    avgFanPageLike: {},
                },
            },
            competitor: {
                lineChart: {
                    postSize: {},
                    avgReachByPost: {},
                    avgFanPageLike: {},
                }
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
            option: {
                '<?php echo $pageId;?>': '<?php echo $websiteName;?>',
                'weekendweeklyjetso': '新假期JetSo',
                '100most': '100毛',
                'umagazinehk': 'U Magazine'
            }
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
            troperlaicos.website.lineChart.postSize.labelArr = postSizeData.labelArr;
            troperlaicos.website.lineChart.postSize.dataArr = postSizeData.dataArr;
            troperlaicos.website.lineChart.avgReachByPost.dataArr = avgReachByPostData.dataArr || [];
            troperlaicos.website.lineChart.avgFanPageLike.dataArr = avgPageFanLikeData.dataArr || [];
            //then when the other DataComparePanel finish load we build the whold LineChart
            if (troperlaicos.competitor.lineChart.postSize.labelArr) {
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

        //it is a callback function to get LineChartData for competitor and set data in `troperlaicos`
        function buildCompetitorLineChartDataToGobal() {
            var facebookOperation = this;
            //it return an object include attribute of `labelArr` and `dataArr`
            postSizeData = facebookOperation.getFormatDataFromLineChartType('postsize');
            avgReachByPostData = facebookOperation.getFormatDataFromLineChartType('avgreachbypost');
            avgPageFanLikeData = facebookOperation.getFormatDataFromLineChartType('avgpagefanlike');
            //save it to global variable for further use
            troperlaicos.competitor.lineChart.postSize.labelArr = postSizeData.labelArr;
            troperlaicos.competitor.lineChart.postSize.dataArr = postSizeData.dataArr;
            troperlaicos.competitor.lineChart.avgReachByPost.dataArr = avgReachByPostData.dataArr || [];
            troperlaicos.competitor.lineChart.avgFanPageLike.dataArr = avgPageFanLikeData.dataArr || [];

            //then when the other DataComparePanel finish load we build the whold LineChart
            if (troperlaicos.website.lineChart.postSize.labelArr) {
                buildLineChart();
            }
        };
    };

    //it is a callback function to build LineChart
    function buildLineChart() {
        buildResultLabel();

        //build LineChart
        buildPostSizeLineChart();
        buildAvgReachByPostLineChart();
        buildAvgPageFanLikeLineChart();
        buildReachRateLineChart();
    };

    //build result label array
    function buildResultLabel() {
        var websiteLabelArr = troperlaicos.website.lineChart.postSize.labelArr || [],
            competitorLabelArr = troperlaicos.competitor.lineChart.postSize.labelArr || [],
            //we need to add element of `websiteLabelArr` and `competitorLabelArr` together
            resultLabelArr = [],
            maxLength = Math.max(websiteLabelArr.length, competitorLabelArr.length);
        for (var i = 0; i < maxLength; i++) {
            resultLabelArr.push((websiteLabelArr[i] || '-') + ' / ' + (competitorLabelArr[i] || '-'));
        }
        troperlaicos.resultLabelArr = resultLabelArr;
    };

    //build number of posts lineChart data table 
    function buildPostSizeLineChart() {
        var websiteDataArr = troperlaicos.website.lineChart.postSize.dataArr || [],
            competitorDataArr = troperlaicos.competitor.lineChart.postSize.dataArr || [];

        troperlaicos.postSizeLineChart = new SocialReport.LineChart('postSizeLineChart', {
            labelArr: troperlaicos.resultLabelArr,
            websiteDataArr: websiteDataArr,
            competitorDataArr: competitorDataArr
        });
    };

    //build avg reach by post number data table
    function buildAvgReachByPostLineChart() {
        var websiteDataArr = troperlaicos.website.lineChart.avgReachByPost.dataArr || [],
            competitorDataArr = troperlaicos.competitor.lineChart.avgReachByPost.dataArr || [];

        troperlaicos.avgReachByPostLineChart = new SocialReport.LineChart('avgReachByPostLineChart', {
            labelArr: troperlaicos.resultLabelArr,
            websiteDataArr: websiteDataArr,
            competitorDataArr: competitorDataArr
        });
    };

    //build avg page fan like data table
    function buildAvgPageFanLikeLineChart() {
        var websiteDataArr = troperlaicos.website.lineChart.avgFanPageLike.dataArr || [],
            competitorDataArr = troperlaicos.competitor.lineChart.avgFanPageLike.dataArr || [];

        troperlaicos.avgFanPageLikeLineChart = new SocialReport.LineChart('avgFanPageLikeLineChart', {
            labelArr: troperlaicos.resultLabelArr,
            websiteDataArr: websiteDataArr,
            competitorDataArr: competitorDataArr
        });
    };

    //build reach rate data table
    function buildReachRateLineChart() {
        var websiteAvgReachDataArr = troperlaicos.website.lineChart.avgReachByPost.dataArr || [],
            websiteAvgFanLikeDataArr = troperlaicos.website.lineChart.avgFanPageLike.dataArr || [],
            competitorAvgReachDataArr = troperlaicos.competitor.lineChart.avgReachByPost.dataArr || [],
            competitorAvgFanLikeDataArr = troperlaicos.competitor.lineChart.avgFanPageLike.dataArr || [],
            websiteReachRate = [],
            competitorReachRate = [];


        troperlaicos.reachRateLineChart = new SocialReport.LineChart('reachRateLineChart', {
            labelArr: troperlaicos.resultLabelArr,
            websiteDataArr: websiteReachRate,
            competitorDataArr: competitorReachRate
        });
    };

</script>
