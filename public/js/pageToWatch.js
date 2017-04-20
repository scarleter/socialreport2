var window = window,
    jQuery = jQuery,
    layer = layer,
    moment = moment;

(function (window, $, layer, moment) {
    'use strict';

    //set a gobal variable in this js file
    var gobal = {
        'access_token': window.troperlaicos.facebook.access_token,
        'dateRangeStart': moment().subtract(6, 'days').hours(0).minutes(0).seconds(0),
        'dateRangeEnd': moment().hours(23).minutes(59).seconds(59),
        'currentDate': '',
        'pageId': window.troperlaicos.facebook.pageID,
        'apiUrl': {
            'posts': 'https://graph.facebook.com/v2.8/' + window.troperlaicos.facebook.pageID + '/posts?fields=id,permalink_url,message,type,created_time,shares,comments.limit(0).summary(1),likes.limit(0).summary(1)'
        },
        'postsObj': {},
        'postsArr': '',
        'postsSortedArr': '',
        'dayRanger': '',
        'postAosSum': {
            0: {
                'name': 'Like(d)',
                'value': 0
            },
            1: {
                'name': 'Share(e)',
                'value': 0
            },
            2: {
                'name': 'Comment(f)',
                'value': 0
            },
            'length': 3
        },
        'loadingLayer': '',
        'fqyTable': '',
        'postsDataTable': '',
        'aosTable': '',
        'topThreeLinkDataTable': '',
        'topThreePhotoDataTable': '',
        'topThreeVideoDataTable': ''
    };

    //clear all tables
    function clearAllTables() {

        if (gobal.fqyTable) {
            gobal.fqyTable.clear().draw();
        }

        if (gobal.postsDataTable) {
            gobal.postsDataTable.clear().draw();
        }

        if (gobal.aosTable) {
            gobal.aosTable.clear().draw();
        }

        if (gobal.topThreeLinkDataTable) {
            gobal.topThreeLinkDataTable.clear().draw();
        }

        if (gobal.topThreePhotoDataTable) {
            gobal.topThreePhotoDataTable.clear().draw();
        }

        if (gobal.topThreeVideoDataTable) {
            gobal.topThreeVideoDataTable.clear().draw();
        }
    }

    //builde fqyTable data
    function buildFqyData() {

        var data = [],
            item = [];
        item[0] = 'Data';
        item[1] = (gobal.postsObj.length).toLocaleString() || 'N/A';
        item[2] = gobal.dayRanger || 'N/A';
        item[3] = parseFloat(item[1] / item[2]).toFixed(2) || 'N/A';

        data.push(item);
        return data;
    }

    //build fqyTable
    function buildFqyTable() {

        if (gobal.fqyTable) {
            gobal.fqyTable.destroy();
        }

        var data = buildFqyData();

        gobal.fqyTable = $('#fqyDataTable').DataTable({
            data: data,
            paging: false,
            lengthChange: false,
            searching: false,
            ordering: false,
            info: false,
            autoWidth: false,
            border: false,
            columns: [
                {
                    title: ""
                },
                {
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


    //build posts data
    function buildPostsData() {
        var data = [],
            postInsightArr = [],
            item = [],
            sourceObj = gobal.postsObj,
            i;

        for (i = 0; i < sourceObj.length; i += 1) {
            item = [];
            item[0] = sourceObj[i].id || '';
            item[1] = '<a href="' + sourceObj[i].permalink_url + '" target="_blank">' + sourceObj[i].permalink_url + '</a>';
            item[2] = (sourceObj[i].message || '').substring(0, 30) + '...';
            item[3] = sourceObj[i].type || '';
            item[4] = new Date(new Date(sourceObj[i].created_time).getTime()); //UTC base on created_time: XXX-XX-XXTXX:XX:XX+0000(GMT) 
            item[4] = item[4].getFullYear() + "-" + ("0" + (item[4].getMonth() + 1)).slice(-2) + "-" + ("0" + item[4].getDate()).slice(-2) + " " + ("0" + item[4].getHours()).slice(-2) + ":" + ("0" + item[4].getMinutes()).slice(-2) + ":" + ("0" + item[4].getSeconds()).slice(-2);

            item[5] = (typeof (sourceObj[i].likes.summary.total_count) === 'undefined') ? sourceObj[i].likes.summary.total_count : 0;
            item[6] = (typeof (sourceObj[i].shares) === 'undefined') ? sourceObj[i].shares.count : 0;
            item[7] = (typeof (sourceObj[i].comments.summary.total_count) === 'undefined') ? sourceObj[i].comments.summary.total_count : 0;
            gobal.postAosSum[0].value = gobal.postAosSum[0].value + item[5];
            gobal.postAosSum[1].value = gobal.postAosSum[1].value + item[6];
            gobal.postAosSum[2].value = gobal.postAosSum[2].value + item[7];

            item[5] = item[5].toLocaleString();
            item[6] = item[6].toLocaleString();
            item[7] = item[7].toLocaleString();

            data.push(item);
            gobal.postsArr = data;
        }

        return data;
    }

    //build postsDataTable
    function buildPostsDataTable() {

        if (gobal.postsDataTable) {
            gobal.postsDataTable.destroy();
        }

        var data = buildPostsData();

        gobal.postsDataTable = $('#postsDataTable').DataTable({
            data: data,
            order: [5, 'des'],
            columns: [
                {
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
                    title: "Like(d)"
                },
                {
                    title: "Share(e)"
                },
                {
                    title: "Comment(f)"
                }
            ],
            columnDefs: [
                {
                    "className": "longnumber",
                    "targets": [0, 1]
                }
            ],
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'copyHtml5',
                    text: 'Copy to clipboard',
                    filename: gobal.pageId + ' Facebook Report - ' + gobal.currentDate
                },
                {
                    extend: 'excelHtml5',
                    text: 'Save to XLSX file',
                    filename: gobal.pageId + ' Facebook Report - ' + gobal.currentDate
                }
            ]
        });
    }

    //builde aosTable data
    function buildAosData() {

        var data = [],
            items = gobal.postAosSum,
            i,
            item;

        for (i = 0; i < items.length; i += 1) {
            item = [];
            item[0] = items[i].name;
            item[1] = items[i].value.toLocaleString();
            item[2] = (gobal.postsObj.length).toLocaleString();
            item[3] = Math.round(item[1].replace(',', '') / item[2].replace(',', '')).toLocaleString();

            data.push(item);
        }

        return data;
    }

    //build aosTable
    function buildAosTable() {

        if (gobal.aosTable) {
            gobal.aosTable.destroy();
        }

        var data = buildAosData();

        gobal.aosTable = $('#aosTable').DataTable({
            data: data,
            paging: false,
            lengthChange: false,
            searching: false,
            ordering: false,
            info: false,
            autoWidth: false,
            columns: [
                {
                    title: "Name"
                },
                {
                    title: "Sum"
                },
                {
                    title: "Number of posts"
                },
                {
                    title: "Average"
                }
            ]
        });
    }


    //sort by Likes(d)
    function sortTopType(a, b) {
        return b[5] - a[5];
    }

    //build topThreeLink data
    function buildTopThreeLinkData() {

        var data = [],
            arr = [],
            i,
            item;
        arr = gobal.postsSortedArr = gobal.postsArr.sort(sortTopType);
        for (i = 0; i < arr.length; i += 1) {
            if (arr[i][3] === 'link') {
                item = [];
                item[0] = arr[i][0];
                item[1] = arr[i][1];
                item[2] = arr[i][2];
                item[3] = arr[i][3];
                item[4] = arr[i][4];
                data.push(item);
                if (data.length >= 5) {
                    break;
                }
            }
        }
        return data;

    }

    //build topThreeLink table
    function buildTopThreeLinkTable() {

        if (gobal.topThreeLinkDataTable) {
            gobal.topThreeLinkDataTable.destroy();
        }

        var data = buildTopThreeLinkData();

        gobal.topThreeLinkDataTable = $('#topThreeLinkDataTable').DataTable({
            data: data,
            paging: false,
            lengthChange: false,
            searching: false,
            ordering: false,
            info: false,
            autoWidth: false,
            columns: [
                {
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
                }
            ],
            columnDefs: [
                {
                    "className": "longnumber",
                    "targets": [0, 1]
                }
            ]
        });
    }

    //build topThreePhoto data
    function buildTopThreePhotoData() {

        var data = [],
            arr = gobal.postsSortedArr,
            i,
            item;
        for (i = 0; i < arr.length; i += 1) {
            if (arr[i][3] === 'photo') {
                item = [];
                item[0] = arr[i][0];
                item[1] = arr[i][1];
                item[2] = arr[i][2];
                item[3] = arr[i][3];
                item[4] = arr[i][4];
                data.push(item);
                if (data.length >= 5) {
                    break;
                }
            }
        }
        return data;

    }

    //build topThreePhoto table
    function buildTopThreePhotoTable() {

        if (gobal.topThreePhotoDataTable) {
            gobal.topThreePhotoDataTable.destroy();
        }

        var data = buildTopThreePhotoData();

        gobal.topThreePhotoDataTable = $('#topThreePhotoDataTable').DataTable({
            data: data,
            paging: false,
            lengthChange: false,
            searching: false,
            ordering: false,
            info: false,
            autoWidth: false,
            columns: [
                {
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
                }
            ],
            columnDefs: [
                {
                    "className": "longnumber",
                    "targets": [0, 1]
                }
            ]
        });
    }

    //build topThreeVideo data
    function buildTopThreeVideoData() {

        var data = [],
            arr = gobal.postsSortedArr,
            i,
            item;
        for (i = 0; i < arr.length; i += 1) {
            if (arr[i][3] === 'video') {
                item = [];
                item[0] = arr[i][0];
                item[1] = arr[i][1];
                item[2] = arr[i][2];
                item[3] = arr[i][3];
                item[4] = arr[i][4];
                data.push(item);
                if (data.length >= 5) {
                    break;
                }
            }
        }
        return data;

    }

    //build topThreeVideo table
    function buildTopThreeVideoTable() {

        if (gobal.topThreeVideoDataTable) {
            gobal.topThreeVideoDataTable.destroy();
        }

        var data = buildTopThreeVideoData();

        gobal.topThreeVideoDataTable = $('#topThreeVideoDataTable').DataTable({
            data: data,
            paging: false,
            lengthChange: false,
            searching: false,
            ordering: false,
            info: false,
            autoWidth: false,
            columns: [
                {
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
                }
            ],
            columnDefs: [
                {
                    "className": "longnumber",
                    "targets": [0, 1]
                }
            ]
        });
    }

    //get next posts
    function nextPosts(url) {

        jQuery.ajax({
            type: "GET",
            url: url,
            data: {},
            dataType: "json",
            success: function (data) {
                var nextPostsLink,
                    key;
                if (data.paging) {
                    nextPostsLink = data.paging.next;
                    gobal.postsObj = gobal.postsObj.concat(data.data);
                    nextPosts(nextPostsLink);
                } else {
                    //empty aosSum
                    for (key in gobal.postAosSum) {
                        if (gobal.postAosSum.hasOwnProperty(key)) {
                            if (key !== 'length') {
                                gobal.postAosSum[key].value = 0;
                            }
                        }
                    }
                    layer.close(gobal.loadingLayer);
                    //build tables
                    buildFqyTable();
                    buildPostsDataTable();
                    buildAosTable();
                    buildTopThreeLinkTable();
                    buildTopThreePhotoTable();
                    buildTopThreeVideoTable();
                    return;
                }
            },
            error: function (msg) {
                //console.info(msg);
                if (msg.status === '400') { //400 access token expired  404 url error
                    window.location.href = '<?= base_url() ?>access/logout';
                }
            }
        });
    }

    //get posts from start to end
    function getPosts(start, end) {
        gobal.loadingLayer = layer.load(2, {
            shade: [0.1, '#000']
        });
        jQuery.ajax({
            type: "GET",
            url: gobal.apiUrl.posts,
            data: {
                'access_token': gobal.access_token,
                'since': start,
                'until': end,
                'limit': 100
            },
            dataType: "json",
            success: function (data) {
                if (data.paging) {

                    gobal.postsObj = {};
                    var nextPostsLink = data.paging.next;
                    gobal.postsObj = data.data;

                    //check nextPostsLink
                    nextPosts(nextPostsLink);
                }
            },
            error: function (msg) {
                //console.info(msg.status);
                if (msg.status === '400') { //400 access token expired  404 url error
                    window.location.href = '<?= base_url() ?>access/logout';
                } else if (msg.status === '404') {
                    layer.alert('Can not get any data because pageID is not right');
                    layer.close(gobal.loadingLayer);
                }

            }

        });
    }

    function dateRangerPickerInit(start, end) {
        //Date range confirm function
        function dateRangerConfirm(start, end) {
            var unix_start = Math.floor(start / 1000),
                unix_end = Math.floor(end / 1000);
            gobal.dayRanger = Math.ceil((unix_end - unix_start) / (24 * 60 * 60));
            jQuery('#daterange-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            gobal.currentDate = start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY');

            clearAllTables();
            getPosts(unix_start, unix_end);
        }

        $('#daterange-btn').daterangepicker({
            alwaysShowCalendars: true,
            opens: 'right',
            ranges: {
                'Today': [moment().hours(0).minutes(0).seconds(0), moment().hours(23).minutes(59).seconds(59)],
                'Yesterday': [moment().subtract(1, 'days').hours(0).minutes(0).seconds(0), moment().subtract(1, 'days').hours(23).minutes(59).seconds(59)],
                'Last 7 Days': [moment().subtract(6, 'days').hours(0).minutes(0).seconds(0), moment().hours(23).minutes(59).seconds(59)],
                'Last 30 Days': [moment().subtract(29, 'days').hours(0).minutes(0).seconds(0), moment().hours(23).minutes(59).seconds(59)],
                'This Month': [moment().startOf('month').hours(0).minutes(0).seconds(0), moment().endOf('month').hours(23).minutes(59).seconds(59)],
                'Last Month': [moment().subtract(1, 'month').startOf('month').hours(0).minutes(0).seconds(0), moment().subtract(1, 'month').endOf('month').hours(23).minutes(59).seconds(59)]
            },
            startDate: start,
            endDate: end
        }, dateRangerConfirm);

        dateRangerConfirm(start, end);
    }

    jQuery(function () {

        dateRangerPickerInit(gobal.dateRangeStart, gobal.dateRangeEnd);
        
    });



}(window, jQuery, layer, moment));
