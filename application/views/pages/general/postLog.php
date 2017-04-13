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
                        <h3 class="box-title text-aqua">Date range:</h3>

                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
                        </div>
                    </div>
                    <div class="box-body">
                        <div class="form-group">
                            <!--<label>Date range button:</label>-->

                            <span id="dataSelectorPanel"></span>
                        </div>


                    </div>
                    <!-- /.box-body -->
                </div>
                <!-- /.box -->

                <style>
                    .dt-responsive.table tr td.longnumber {
                        word-break: break-all;
                    }
                    
                    table.dataTable thead .sorting:after {
                        opacity: 0;
                    }
                    
                    table.dataTable thead .sorting:after,
                    table.dataTable thead .sorting_asc:after,
                    table.dataTable thead .sorting_desc:after {
                        opacity: 0;
                    }
                    
                    .dataTables_wrapper .dataTables_paginate .paginate_button {
                        padding: 0;
                    }
                    
                    .dataTables_wrapper .dataTables_paginate .paginate_button:hover {
                        border-color: #fff;
                        background: none;
                    }
                    .dateHeader{
                        font-weight: bold;
                        font-size: 18px;
                        white-space: nowrap;
                    }
                    /* can add border to datatable tr */
                    table.table-bordered.dataTable {
                        border-collapse: collapse !important;
                    }
                </style>
                <div class="box box-info topThreeBox">
                    <div class="box-header">
                        <h3 class="box-title text-aqua">Post Log Table</h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                    </button>
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
    $(function() {
        //set a gobal variable
        window.troperlaicos = {};

        //data selector panel,change Property and dateRnage to get different data
        troperlaicos.dataSelectorPanel = new SocialReport.DateRangePickerSelectorPanel('dataSelectorPanel', {
            changeHandler: dataSelectorPanelChangeHandler,
            option: {
                '1': '1 minutes',
                '15': '15 minutes',
                '30': '30 minutes',
                '60': '60 minutes'
            },
            defaultValue: '15',
            template: ['<div class="row"><div class="col-md-4" style="max-width:180px;"><div class="form-group"><label>Interval</label><span id="', '%ID%Select"></span></div></div><div class="col-md-6"><div class="form-group"><label>Date range button:</label><div class="input-group"><span id="', '%ID%DateRangePicker"></span></div></div></div></div>']
        });

    });

    //data selector panel change will trigger this function
    function dataSelectorPanelChangeHandler(currentInterval, start, end) {
        //set paras for getting facebook data
        var params = {
            since: start.unix(),
            until: end.unix(),
            pageid: '<?php echo $pageId;?>',
            access_token: '<?php echo $pageAccessToken;?>'
        };
        //set current interval to gobal
        troperlaicos.interval = currentInterval;
        //set a new one ajax loading layer
        troperlaicos.websiteLoadingLayer = layer.load(2, {
            shade: [0.1, '#000']
        });
        //use asynchronous to get facebook data(posts and reach) and put the follow steps in the callback function such as `buildTable`.
        SocialReport.Facebook.genFacebookOperation(params, buildTable);
    };

    //it is a callback function to build tables
    function buildTable() {
        //close loadding layer
        layer.close(troperlaicos.websiteLoadingLayer);
        var facebookOperation = this;
        //build tables
        buildPostLogDataTable(facebookOperation);
    };


    //build PostLogDataTable
    function buildPostLogDataTable(Operation) {
        var facebookOperation = Operation,
            //it returan an object include attribute of `data` and `columnTitle`
            data = facebookOperation.getFormatDataFromTableType('postlog', {interval: troperlaicos.interval}),
            tableAttrs = {
                ordering: false,
                columns: data['columnTitle'],
                columnDefs: [{
                    "className": "longnumber",
                    "targets": [2]
                }],
                "iDisplayLength": 50,
                dom: 'Bfrtip',
                buttons: [{
                        extend: 'copyHtml5',
                        text: 'Copy to clipboard',
                        filename: 'Facebook PageId(<?php echo $pageId;?>) Post Log Report during ' + troperlaicos.dataSelectorPanel.getDateRangeInText(),
                    },
                    {
                        extend: 'excelHtml5',
                        text: 'Save to XLSX file',
                        filename: 'Facebook PageId(<?php echo $pageId;?>) Post Log Report during ' + troperlaicos.dataSelectorPanel.getDateRangeInText(),
                    }
                ]
            };
        //if table is exist
        if (troperlaicos.postLogDataTable) {
            //use repaint
            troperlaicos.postLogDataTable.repaint(data['data'], tableAttrs);
        } else {
            //build datatable object
            troperlaicos.postLogDataTable = new SocialReport.DataTables('postLogDataTable', data['data'], tableAttrs);
        }
    };

</script>
