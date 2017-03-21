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
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
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
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
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
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
                        </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
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
                            
                            #postsDataTable .post_message {
                                max-width: 200px;
                                max-height: 200px;
                                word-break: break-all;
                                overflow-y: scroll;
                            }
                            
                            #postsDataTable label {
                                margin-bottom: 0px;
                                width: 95px;
                                display: inline-block;
                            }
                            
                            #postsDataTable p {
                                margin-bottom: 2px;
                            }

                        </style>
                        <label>1. Posts Data Table</label>
                        <span id="postsDataTable"></span>
                        <br/><br/>
                        <label>2. Average of a,b,c,d,e,f</label>
                        <span id="averagePostsDataTable"></span>
                        <br/><br/>
                        <label>3. Reach%</label>
                        <table id="reachTable" class="table table-striped table-bordered dt-responsive" cellspacing="0" width="100%"></table>
                        <br/><br/>
                        <label>4. Enagement Rate</label>
                        <table id="enagementRateTable" class="table table-striped table-bordered dt-responsive" cellspacing="0" width="100%"></table>
                    </div>
                    <!-- /.box-body -->
                </div>

                <div class="box box-info topThreeBox">
                    <div class="box-header">
                        <h3 class="box-title text-aqua">Top 5 by each type</h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                    </button>
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
    $(function() {
        //set a gobal variable
        window.troperlaicos = {};

        troperlaicos.dateRange = new SocialReport.DateRangePicker('dateRange', {
            callback: dateRangeCallback
        });

    });

    //dateRange change will trigger this function
    function dateRangeCallback(start, end) {
        //set paras for getting facebook posts data
        var postsParams = {
            since: start.unix(),
            until: end.unix(),
            pageid: '<?php echo $pageId;?>',
            access_token: '<?php echo $pageAccessToken;?>'
        };
        //use asynchronous to get data and put the follow steps in the callback function such as `initPostsView`.
        SocialReport.Facebook.genPostsOperationObj(postsParams, initPostsView);
    };

    //initialize posts view after genPostsOperation
    function initPostsView() {
        var facebookOperation = this;

        //build tables
        buildFqyTable(facebookOperation);
        buildPostsDataTable(facebookOperation);
        buildAveragePostsDataTable(facebookOperation);

    };

    //build frequency table
    function buildFqyTable(Operation) {
        var facebookOperation = Operation,
            numbersOfPosts = facebookOperation.getSize(),
            dateRange = troperlaicos.dateRange.getRangeInDay(),
            frequency, data;
        facebookOperation.setDayRange(dateRange);
        frequency = facebookOperation.frequency();
        data = [
            ['Data', numbersOfPosts, dateRange, frequency]
        ];

        //if table is exist
        if (troperlaicos.fqyDataTable) {
            //use repaint function to 
            troperlaicos.fqyDataTable.repaint(data);
        } else {
            //build datatable object
            troperlaicos.fqyDataTable = new SocialReport.DataTables('fqyDataTable', data, {
                paging: false,
                lengthChange: false,
                searching: false,
                ordering: false,
                info: false,
                autoWidth: false,
                border: false,
                columns: [{
                        title: ""
                    }, {
                        title: "Number of posts"
                    },
                    {
                        title: "Period(day)"
                    },
                    {
                        title: "Frequency"
                    }
                ]
            });
        }

    };

    //build PostsData table
    function buildPostsDataTable(Operation) {
        var facebookOperation = Operation,
            //it returan an object include attribute of `data` and `columnTitle`
            data = facebookOperation.getFormatDataFromTableType('postsdata'),
            tableAttrs = {
                order: [7, 'des'],
                columns: data['columnTitle'],
                columnDefs: [{
                    "className": "longnumber",
                    "targets": [0, 1]
                }],
                dom: 'Bfrtip',
                buttons: [{
                        extend: 'copyHtml5',
                        text: 'Copy to clipboard',
                        filename: '<?php echo $pageId;?> Facebook Report during ' + troperlaicos.dateRange.getDateRangeInText(),
                    },
                    {
                        extend: 'excelHtml5',
                        text: 'Save to XLSX file',
                        filename: '<?php echo $pageId;?> Facebook Report during ' + troperlaicos.dateRange.getDateRangeInText(),
                    }
                ]
            };
        //if table is exist
        if (troperlaicos.postsDataTable) {
            //use repaint
            troperlaicos.postsDataTable.repaint(data['data'], tableAttrs);
        } else {
            //build datatable object
            troperlaicos.postsDataTable = new SocialReport.DataTables('postsDataTable', data['data'], tableAttrs);
        }
    };

    //build Average PostsData table
    function buildAveragePostsDataTable(Operation) {
        var facebookOperation = Operation,
            //it returan an object include attribute of `data` and `columnTitle`
            data = facebookOperation.getFormatDataFromTableType('averagepostsdata'),
            tableAttrs = {
                paging: false,
                lengthChange: false,
                searching: false,
                ordering: false,
                info: false,
                autoWidth: false,
                columns: data['columnTitle']
            };
        //if table is exist
        if (troperlaicos.averagePostsDataTable) {
            //use repaint
            troperlaicos.averagePostsDataTable.repaint(data['data'], tableAttrs);
        } else {
            //build datatable object
            troperlaicos.averagePostsDataTable = new SocialReport.DataTables('averagePostsDataTable', data['data'], tableAttrs);
        }
    };

</script>
