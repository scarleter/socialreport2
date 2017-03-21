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
    };

    //build PostsData table
    function buildPostsDataTable(Operation) {
        //set the data for posts data datatable
        var postOperation = Operation,
            originData = postOperation.getData(),
            dataSize = postOperation.getSize(),
            data = [];
        //loop to set a two dimension array to get datatable data
        for (var i = 0; i < dataSize; i++) {
            //some middle variable
            var arr = [],
                type = originData[i]['type'],
                like = originData[i]['like'] || 0,
                love = originData[i]['love'] || 0,
                haha = originData[i]['haha'] || 0,
                wow = originData[i]['wow'] || 0,
                sorry = originData[i]['sorry'] || 0,
                anger = originData[i]['anger'] || 0,
                reactionsTotal = like + love + haha + wow + sorry + anger,
                vieworplay = ((type === 'video') ? originData[i]['video play'] : originData[i]['photo view']) || 0,
                linkClick = originData[i]['link clicks'] || 0,
                otherClick = originData[i]['other clicks'] || 0,
                postsClickTotal = vieworplay + linkClick + otherClick,
                paidReached = originData[i]['post_impressions_paid_unique'],
                totalReached = originData[i]['post_impressions_unique'],
                paidImpressions = originData[i]['post_impressions_paid'],
                totalImpressions = originData[i]['post_impressions'];
            //set data in `arr` in order
            arr.push(originData[i]['id']);
            arr.push(originData[i]['permalink_url']);
            arr.push('<div class="post_message">' + (originData[i]['message']) + '</div>');
            arr.push(originData[i]['type']);
            arr.push(originData[i]['created_time']);
            arr.push((totalReached - paidReached).toLocaleString());
            arr.push(paidReached.toLocaleString());
            arr.push(totalReached.toLocaleString());
            arr.push(originData[i]['like'].toLocaleString());
            arr.push(originData[i]['shares'].toLocaleString());
            arr.push(originData[i]['comments'].toLocaleString());
            arr.push(originData[i]['post_video_views'].toLocaleString());
            arr.push('<p><label>' + reactionsTotal.toLocaleString() + '</label></p>' + '<p><i class="fa fb_icon fb_like" title="like"></i><span> ' + like.toLocaleString() + '</span></p> ' + '<p><i class="fa fb_icon fb_love" title="love"></i><span> ' + love.toLocaleString() + '</span></p>' + '<p><i class="fa fb_icon fb_haha" title="haha"></i><span> ' + haha.toLocaleString() + '</span></p>' + '<p><i class="fa fb_icon fb_wow" title="wow"></i><span> ' + wow.toLocaleString() + '</span></p>' + '<p><i class="fa fb_icon fb_sad" title="sad"></i><span> ' + sorry.toLocaleString() + '</span></p>' + '<p><i class="fa fb_icon fb_anger" title="anger"></i><span> ' + anger.toLocaleString() + '</span></p>');

            arr.push('<p><label>' + postsClickTotal.toLocaleString() + '</label></p>' + '<p><label>' + ((type === 'video') ? 'Clicks to Play:' : 'Photo Views:') + '</label><span> ' + vieworplay.toLocaleString() + '</span></p>' + '<p><label>Link Clicks:</label><span> ' + linkClick.toLocaleString() + '</span></p>' + '<p><label>Other Clicks:</label><span> ' + otherClick.toLocaleString() + '</span></p>');
            arr.push((totalImpressions - paidImpressions).toLocaleString());
            arr.push(paidImpressions.toLocaleString());
            arr.push(totalImpressions.toLocaleString());
            //push in data array
            data.push(arr);

        }
        //build datatable object for posts data
        troperlaicos.postsDataTable = new SocialReport.DataTables('postsDataTable', data, {
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
        });
    };

</script>
