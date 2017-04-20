<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            Pages To Watch -
            <?php echo $pageID;?>
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
                        <h3 class="box-title text-aqua">Date range:</h3>

                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                        </div>
                    </div>
                    <div class="box-body">
                        <div class="form-group">
                            <!--<label>Date range button:</label>-->

                            <div class="input-group">
                                <button type="button" class="btn btn-default pull-right" id="daterange-btn">
                    <span>
                      <i class="fa fa-calendar"></i> Date range picker
                    </span>
                    <i class="fa fa-caret-down"></i>
                  </button>
                            </div>
                        </div>


                    </div>
                    <!-- /.box-body -->
                </div>
                <!-- /.box -->

                <div class="box box-info fqyBox">
                    <div class="box-header">
                        <h3 class="box-title text-aqua">Frequency</h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <table id="fqyDataTable" class="table table-striped table-bordered dt-responsive" cellspacing="0" width="100%"></table>
                    </div>
                    <!-- /.box-body -->
                </div>

                <div class="box box-info">
                    <div class="box-header">
                        <h3 class="box-title text-aqua">Reach % </h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <label>1. Posts Data Table</label>
                        <table id="postsDataTable" class="table table-striped table-bordered dt-responsive" cellspacing="0" width="100%"></table>
                        <br/><br/>
                        <label>2. Average of d,e,f</label>
                        <table id="aosTable" class="table table-striped table-bordered dt-responsive" cellspacing="0" width="100%"></table>
                    </div>
                    <!-- /.box-body -->
                </div>

                <div class="box box-info topThreeBox">
                    <div class="box-header">
                        <h3 class="box-title text-aqua">Top 5 by each type</h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <label>1. Top 5 Links</label>
                        <table id="topThreeLinkDataTable" class="table table-striped table-bordered dt-responsive" cellspacing="0" width="100%"></table>
                        <br/><br/>
                        <label>2. Top 5 Photos</label>
                        <table id="topThreePhotoDataTable" class="table table-striped table-bordered dt-responsive" cellspacing="0" width="100%"></table>
                        <br/><br/>
                        <label>3. Top 5 Videos</label>
                        <table id="topThreeVideoDataTable" class="table table-striped table-bordered dt-responsive" cellspacing="0" width="100%"></table>
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
            'access_token': '<?php echo ACCESS_TOKEN_EASTTOUCH?>',
            'pageID': <?php echo $pageID;?>
        }
    };

</script>

<script src="<?= base_url() ?>public/js/pageToWatch.js"></script>
