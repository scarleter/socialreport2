<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            <?php echo $websiteName.' Article Performance Report';?>
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
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <!--
                        <span id="dataSelectorPanel"></span>
                        <span id="searchbox"></span>
-->

                        <div class="row">
                           <div class="col-md-2">
                                <div class="form-group">
                                    <label>Interval</label>
                                    <span id="intervalSelector"></span>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-group">
                                    <label>Date Type</label>
                                    <span id="dateTypeSelect"></span>
                                </div>
                            </div>
                            <div class="col-md-3" style="max-width:212px;">
                                <div class="form-group">
                                    <label>Date range</label>
                                    <div class="input-group">
                                        <span id="dateRangePicker"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2" style="display:none;">
                                <div class="form-group">
                                    <label>Property</label>
                                    <span id="propertySelect"></span>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-group">
                                    <label>Search(Editor)</label>
                                    <span id="editorSelector"></span>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-group">
                                    <label>Empty Slot</label>
                                    <span id="emptySlotSelector"></span>
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
                        <h3 class="box-title text-aqua">Detail Report</h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                    <?php if(isset($showWeeklyReportButton)&&$showWeeklyReportButton){?>
                        <button id="downloadWeeklyReport" style="width: 232px;font-size: 14px;margin-bottom: 10px;border: 1px solid #999;" type="button" class="btn btn-block btn-default btn-lg" onclick="javascript:generateWeeklyReportExcel();"><i class="fa fa-download"></i>&nbsp;Download Writing Schedule</button>
                    <?php
                        }
                    ?>
                        <table id="detailReport" class="table table-striped table-bordered dt-responsive" cellspacing="0" width="100%"></table>
                    </div>
                    <!-- /.box-body -->
                </div>
            </div>
               
            <div class="col-md-12">
                <div class="box box-info">
                    <div class="box-header">
                        <h3 class="box-title text-aqua">Summary Report</h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <table id="summaryReport" class="table table-striped table-bordered dt-responsive" cellspacing="0" width="100%"></table>
                    </div>
                    <!-- /.box-body -->
                </div>
            </div>

        </div>
    </section>
</div>


<script type="text/javascript">
    //set some request setting
    window.troperlaicos = {
        'google': {
            'ids': '<?php echo $ids;?>',
            'accessToken': '<?php echo $accessToken;?>',
            'base_url': '<?= base_url() ?>',
            'controllerName': '<?php if(isset($controllerName)) echo $controllerName;?>',
            'showWeeklyReportButton': '<?php if(isset($showWeeklyReportButton)) echo $showWeeklyReportButton;?>'
        }
    };

</script>

<script src="<?= base_url() ?>public/js/google/articlePerformanceReport.js?version=191a08ef850061c471eef029058a3409"></script>
