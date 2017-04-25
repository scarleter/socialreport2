<!-- Content Wrapper. Contains page content -->

<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            Post Log
        </h1>
        <ol class="breadcrumb">
            <!--<li><a href="<?= base_url() ?>overview"><i class="fa fa-dashboard"></i> Overview</a></li>-->
        </ol>
    </section>

    <!-- Main content -->
    <section class="content">
        <div class="row">
            <div class="col-md-12">
                <!-- LINE CHART -->
                <div class="box box-info">
                    <div class="box-header">
                        <h3 class="box-title text-aqua">Data Seletor</h3>

                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                        </div>
                    </div>
                    <div class="box-body">
<!--
                        <div class="form-group">
                            <label>Date range button:</label>

                            <span id="dataSelectorPanel"></span>
                            <span id="editorSelector"></span>
                        </div>
-->
                        <div class="row">
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label>Interval</label>
                                    <span id="intervalSelector"></span>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label>Date range</label>
                                    <div class="input-group">
                                        <span id="dateRangePicker"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label>Search(Editor)</label>
                                    <span id="editorSelector"></span>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label>Empty Slot</label>
                                    <span id="emptySlotSelector"></span>
                                </div>
                            </div>
                        </div>

                    </div>
                    <!-- /.box-body -->
                </div>
                <!-- /.box -->

                <div class="box box-info">
                    <div class="box-header">
                        <h3 class="box-title text-aqua">Post Log Summary</h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <span id="postLogSummaryDataTable"></span>
                    </div>
                    <!-- /.box-body -->
                </div>

                <div class="box box-info">
                    <div class="box-header">
                        <h3 class="box-title text-aqua">Post Log Table</h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <span id="postLogDataTable"></span>
                    </div>
                    <!-- /.box-body -->
                </div>

            </div>


        </div>
        <!-- /.row -->

    </section>
    <!-- /.content -->
</div>
<!-- /.content-wrapper -->


<script type="text/javascript">
    //set some request setting
    window.troperlaicos = {
        'facebook': {
            'pageid': '<?php echo $pageId;?>',
            'access_token': '<?php echo $pageAccessToken;?>'
        }
    };

</script>

<script src="<?= base_url() ?>public/js/postLog.js?version=f7e06e54cb82530fd8564f1cd599d1fa"></script>
