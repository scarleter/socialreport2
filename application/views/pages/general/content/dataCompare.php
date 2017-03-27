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
                            <canvas id="lineChart_ar" style="height:300px"></canvas>
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
                            <canvas id="lineChart_apfl" style="height:300px"></canvas>
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
                            <canvas id="lineChart_rp" style="height:300px"></canvas>
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
        window.troperlaicos = {};
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
                'weekendweeklyjetso': '新假期JetSo',
                '100most': '100毛',
                'umagazinehk': 'U Magazine'
            }
        });
    });

    //websitePanel change will trigger this handler
    function websitePanelChangeHandler(currentValue, start, end) {
        console.info(this + ' ' + currentValue + ' ' + start + ' ' + end);
        troperlaicos.postSizeLineChart = new SocialReport.LineChart('postSizeLineChart', {
            labelArr: [1, 2, 3],
            websiteDataArr: [
                2,
                1,
                2
            ],
            competitorDataArr: [
                5,
                8,
                9
            ]
        });
    };

    //competitorPanel change will trigger this handler
    function competitorPanelChangeHandler(currentValue, start, endcurrentValue, start, end) {
        console.info(this + ' ' + currentValue + ' ' + start + ' ' + end);
    };

    //build lineChart
    //    function buildLineChart(){
    //        
    //    };

</script>
