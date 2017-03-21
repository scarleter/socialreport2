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
                        <table id="aosTable" class="table table-striped table-bordered dt-responsive" cellspacing="0" width="100%"></table>
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
        var postOperation = this;

        //build tables
        buildFqyTable(postOperation);
        buildPostsDataTable(postOperation);

    };

    //build frequency table
    function buildFqyTable(Operation) {
        //set the data for frequency datatable
        var postOperation = Operation,
            numbersOfPosts = postOperation.getSize(),
            dateRange = troperlaicos.dateRange.getRangeInDay(),
            frequency, data;
        postOperation.setDayRange(dateRange);
        frequency = postOperation.frequency();
        data = [
            ['Data', numbersOfPosts, dateRange, frequency]
        ];

        //if fqyTable is exist
        if (troperlaicos.fqyDataTable) {
            //use repaint function to 
            troperlaicos.fqyDataTable.repaint(data);
        } else {
            //build datatable object for frequency
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
        //set the data for posts data datatable
        var postOperation = Operation,
            data = postOperation.getFormatData('facebook'),
            tableAttrs = {
                order: [7, 'des'],
                columns: [{
                        title: "Post ID"
                    },
                    {
                        title: "Permalink"
                    },
                    {
                        title: "Post Message"
                    },
                    {
                        title: "Type"
                    },
                    {
                        title: "Posted"
                    },
                    {
                        title: "Organic Reached(a)"
                    },
                    {
                        title: "Paid Reached(b)"
                    },
                    {
                        title: "Total Reached(c)"
                    },
                    {
                        title: "Like(d)"
                    },
                    {
                        title: "Share(e)"
                    },
                    {
                        title: "Comment(f)"
                    },
                    {
                        title: "Video Views(h)"
                    },
                    {
                        title: "Reactions(i)"
                    },
                    {
                        title: "Post Clicks(j)"
                    },
                    {
                        title: "Lifetime Post <br/>Organic Impressions(k)"
                    },
                    {
                        title: "Lifetime Post <br/>Paid Impressions(l)"
                    },
                    {
                        title: "Lifetime Post <br/>Total Impressions(g)"
                    }
                ],
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

        //if posts data table is exist
        if (troperlaicos.postsDataTable) {
            //use repaint
            troperlaicos.postsDataTable.repaint(data, tableAttrs);
        } else {
            //build datatable object for posts data
            troperlaicos.postsDataTable = new SocialReport.DataTables('postsDataTable', data, tableAttrs);
        }
    };

</script>
