<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            <?php echo $websiteName.' Google Data Compare';?>
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
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label>Property</label>
                                    <span id="propertySelect"></span>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label>Date range (period 1)</label>
                                    <div class="input-group">
                                        <span id="periodOneDateRangePicker"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label>Date range (period 2)</label>
                                    <div class="input-group">
                                        <span id="periodTwoDateRangePicker"></span>
                                    </div>
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
                        <h3 class="box-title text-aqua">Users Timeline
                            <span class="usersSummaryBox"></span>
                        </h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <span id="userstimeline"></span>
                    </div>
                    <!-- /.box-body -->
                </div>
            </div>

            <div class="col-md-12">
                <div class="box box-info">
                    <div class="box-header">
                        <h3 class="box-title text-aqua">Pageviews Timeline
                            <span class="pageViewsSummaryBox"></span>
                        </h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <span id="pageviewstimeline"></span>
                    </div>
                    <!-- /.box-body -->
                </div>
            </div>

            <div class="col-md-12">
                <div class="box box-info">
                    <div class="box-header">
                        <h3 class="box-title text-aqua">Avg. Session Duration Timeline
                            <span class="avgSessionDurationSummaryBox"></span>
                        </h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <span id="avgsessiondurationtimeline"></span>
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
            'accessToken': '<?php echo $accessToken;?>'
        }
    };

</script>

<script src="<?= base_url() ?>public/js/google/dataCompare.js"></script>
