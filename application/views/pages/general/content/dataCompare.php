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
                .dataTables_wrapper .dataTables_paginate .paginate_button {
                    padding: 0;
                }
                
                .dataTables_wrapper .dataTables_paginate .paginate_button:hover {
                    border-color: #fff;
                    background: none;
                }
                
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
                        <table id="pageToWatchDataTable" class="table table-striped table-bordered dt-responsive" cellspacing="0" width="100%"></table>
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
                            <span class="numberOfPostsContainer"></span>
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
                            <span class="avgReachByPostsContainer"></span>
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
                            <span class="avgPageFansLikeByDayRangeContainer"></span>
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
                            <span class="reachRateContainer"></span>
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
            pageToWatchLoadingLayer: '',
            websiteLoadingLayer: '',
            competitorLoadingLayer: '',
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
        troperlaicos.websitePanel = new SocialReport.DateRangePickerSelectorPanel('websitePanel', {
            changeHandler: websitePanelChangeHandler,
            option: {
                '<?php echo $pageId;?>': '<?php echo $websiteName;?>'
            }
        });
        //competitor setting panel,change competitor and dateRnage to get different data
        troperlaicos.competitorPanel = new SocialReport.DateRangePickerSelectorPanel('competitorPanel', {
            changeHandler: competitorPanelChangeHandler,
            option: troperlaicos.pagesToWatchList
        });

        //set a new one ajax loading layer
        troperlaicos.pageToWatchLoadingLayer = layer.load(2, {
            shade: [0.1, '#000']
        });
        //get page to watch dataTable data, it return labelArr and dataArr for dataTable api
        SocialReport.Facebook.genPagesToWatchListData({
            since: moment().add(8, 'hours').subtract(8, 'days').hours(8).minutes(0).seconds(0).unix(),
            until: moment().add(8, 'hours').hours(8).minutes(0).seconds(0).unix(),
            pageidList: troperlaicos.pagesToWatchList,
            access_token: '<?php echo $pageAccessToken;?>'
        }, function(LabelArr, DataArr) {
            //this is a call back function for genPagesToWatchListData, it return labelArr and dataArr for building pageToWatch datatable.`this` is `facebookOperationList`

            //close loadding layer
            layer.close(troperlaicos.pageToWatchLoadingLayer);

            var tableAttrs = {
                columns: LabelArr,
                order: [1, 'des']
            };
            //if table is exist
            if (troperlaicos.pageToWatchDataTable) {
                //use repaint
                troperlaicos.pageToWatchDataTable.repaint(DataArr, tableAttrs);
            } else {
                //build datatable object
                troperlaicos.pageToWatchDataTable = new SocialReport.DataTables('pageToWatchDataTable', DataArr, tableAttrs);
            }
            //highlight website
            $('.<?php echo $pageId?>').closest('tr').css('border', '3px solid #00C0EF');
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
        //set a new one ajax loading layer
        troperlaicos.websiteLoadingLayer = layer.load(2, {
            shade: [0.1, '#000']
        });
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
            //close loadding layer
            layer.close(troperlaicos.websiteLoadingLayer);
            //then when the other DateRangePickerSelectorPanel finish load we build the whold LineChart
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
        //set a new one ajax loading layer
        troperlaicos.competitorLoadingLayer = layer.load(2, {
            shade: [0.1, '#000']
        });
        //use asynchronous to get facebook data(posts and reach) and put the follow steps in the callback function such as `buildTable`.
        SocialReport.Facebook.genFacebookOperation(params, buildCompetitorLineChartDataToGobal, fbErrorCallback);
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
            //close loadding layer
            layer.close(troperlaicos.competitorLoadingLayer);
            //then when the other DateRangePickerSelectorPanel finish load we build the whold LineChart
            if (troperlaicos.website.lineChart.postSizeData) {
                buildLineChart();
            }
        };
        
        //it is a callback for facebook request error 
        function fbErrorCallback(Error){
            //close loadding layer
            layer.close(troperlaicos.competitorLoadingLayer);
            var errorPageId = $.trim(Error.facebookPostsRequestError.responseJSON.error.message.split(':')[1]);
            layer.alert(errorPageId + ' is not a corret page id in facebook, so we can not show facebook data of ' + errorPageId);
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
        //draw a overall data in the section
        $('.numberOfPostsContainer').html(' &nbsp; &nbsp; &nbsp; &nbsp;(<label class="text-aqua">Total: &nbsp;' + troperlaicos.website.lineChart.postSizeData.numberOfPost.toLocaleString() + '</label><label class="text-muted"> &nbsp; / &nbsp;Total: &nbsp;' + troperlaicos.competitor.lineChart.postSizeData.numberOfPost.toLocaleString() + ')</label>');
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
        //draw a overall data in the section
        $('.avgReachByPostsContainer').html('&nbsp;&nbsp;&nbsp;&nbsp;(<label class="text-aqua">Total: &nbsp;' + troperlaicos.website.lineChart.avgReachByPostData.avgReachByPost.toLocaleString() + '</label><label class="text-muted">&nbsp; / &nbsp;Total: &nbsp;' + troperlaicos.competitor.lineChart.avgReachByPostData.avgReachByPost.toLocaleString() + '</label>)');
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
        //draw a overall data in the section
        $('.avgPageFansLikeByDayRangeContainer').html('&nbsp;&nbsp;&nbsp;&nbsp;(<label class="text-aqua">Total: &nbsp;' + troperlaicos.website.lineChart.avgFanPageLikeData.avgPageFansLike.toLocaleString() + '</label><label class="text-muted">&nbsp; / &nbsp;Total: &nbsp;' + troperlaicos.competitor.lineChart.avgFanPageLikeData.avgPageFansLike.toLocaleString() + '</label>)');
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
        //draw a overall data in the section
        $('.reachRateContainer').html('&nbsp;&nbsp;&nbsp;&nbsp;(<label class="text-aqua">Total: &nbsp;' + (parseFloat(troperlaicos.website.lineChart.avgReachByPostData.avgReachByPost / troperlaicos.website.lineChart.avgFanPageLikeData.avgPageFansLike) * 100).toFixed(2) + '%</label><label class="text-muted">&nbsp; / &nbsp;Total: &nbsp;' + (parseFloat(troperlaicos.competitor.lineChart.avgReachByPostData.avgReachByPost / troperlaicos.competitor.lineChart.avgFanPageLikeData.avgPageFansLike) * 100).toFixed(2) + '%</label>)');
    };

</script>
