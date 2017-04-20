<div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            <?php echo 'SETTING - '.$websiteName;?>
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
                        <h3 class="box-title text-aqua">Pages To Watch</h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <label>1.add page</label>
                        <div class="row addPage">
                            <div class="col-xs-3">
                                <input type="text" class="form-control" name="name" placeholder="page name">
                            </div>
                            <div class="col-xs-3">
                                <input type="text" class="form-control" name="pageID" placeholder="facebook page ID">
                            </div>
                            <div class="col-xs-3">
                                <input type="number" class="form-control" name="sort" placeholder="sort">
                                <input type="hidden" class="form-control" name="type" value="<?php echo $websiteName?>">
                            </div>
                            <div class="col-xs-3">
                                <button type="button" class="btn btn-info" onclick="addPage()">add page</button>
                            </div>
                        </div>
                        <br/><br/>
                        <label>2.pages list</label>
                        <table id="pagesToWatchDataTable" class="table table-striped table-bordered dt-responsive" cellspacing="0" width="100%"></table>
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
            'controllerName': '<?php echo $controllerName;?>',
            'websiteName': '<?php echo $websiteName;?>'
        }
    };
window.troperlaicos.facebook.controllerName
</script>

<script src="<?= base_url() ?>public/js/pageToWatchSetting.js"></script>
