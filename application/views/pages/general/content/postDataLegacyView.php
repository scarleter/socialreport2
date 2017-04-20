<!-- Content Wrapper. Contains page content -->

<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            Post Data - Legacy View
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
                                <span id="dateRange"></span>
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
                        <span id="fqyDataTable"></span>
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
                        <span id="postsDataTable"></span>
                        <br/><br/>
                        <label>2. Average of a,b,c,d,e,f</label>
                        <span id="averagePostsDataTable"></span>
                        <br/><br/>
                        <label>3. Reach%</label>
                        <span id="reachRateDataTable"></span>
                        <br/><br/>
                        <label>4. Engagement Rate</label>
                        <span id="engagementRateDataTable"></span>
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
                        <span id="topLinksDataTable"></span>
                        <br/><br/>
                        <label>2. Top 5 Photos</label>
                        <span id="topPhotosDataTable"></span>
                        <br/><br/>
                        <label>3. Top 5 Videos</label>
                        <span id="topVideosDataTable"></span>
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
<script>
    //set some request setting
    window.troperlaicos = {
        'facebook': {
            'pageid': '<?php echo $pageId;?>',
            'access_token': '<?php echo $pageAccessToken;?>'
        }
    };

</script>

<script src="<?= base_url() ?>public/js/postDataLegacyView.js"></script>
