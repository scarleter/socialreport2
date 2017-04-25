var window = window,
    jQuery = jQuery,
    layer = layer;

(function (window, $, layer) {
    'use strict';

    //set a gobal variable in this js file
    var gobal = {
        controllerName: window.troperlaicos.facebook.controllerName,
        websiteName: window.troperlaicos.facebook.websiteName,
        base_url: window.troperlaicos.facebook.base_url
    };

    //build PagesToWatch data
    function buildPagesToWatchData(data) {

        var result = [],
            item = [],
            arr = data,
            i;
        for (i = 0; i < arr.length; i += 1) {
            item = [];
            item[0] = '<input type="text" class="form-control ' + arr[i].id + '" name="name" value="' + arr[i].name + '">';
            item[1] = '<input type="text" class="form-control ' + arr[i].id + '" name="pageID" value="' + arr[i].pageID + '">';
            item[2] = '<input type="number" class="form-control ' + arr[i].id + '" name="sort" value="' + arr[i].sort + '"><input type="hidden" class="form-control ' + arr[i].id + '" name="id" value="' + arr[i].id + '" >';
            item[3] = '<button type="button" class="btn btn-info" onclick="editPage(' + arr[i].id + ')">edit</button><button type="button" class="btn btn-danger" onclick="deletePage(' + arr[i].id + ')">delete</button>';
            result.push(item);
        }
        return result;
    }

    //build PagesToWatch table
    function buildPagesToWatchTable(data) {

        if (gobal.pagesToWatchDataTable) {
            gobal.pagesToWatchDataTable.destroy();
        }

        var tableData = buildPagesToWatchData(data);

        gobal.pagesToWatchDataTable = $('#pagesToWatchDataTable').DataTable({
            data: tableData,
            ordering: false,
            searching: false,
            columns: [
                {
                    title: "name"
                },
                {
                    title: "pageID"
                },
                {
                    title: "sort"
                },
                {
                    title: "function"
                }
            ]
        });
    }

    //get pagesToWatch list
    function getPagesToWatchList() {
        $.ajax({
            type: 'GET',
            url: gobal.base_url + gobal.controllerName + '/getPagesToWatchList',
            data: {
                'type': gobal.websiteName
            },
            dataType: "json",
            success: function (data) {
                if (data.status.code === '200') {
                    buildPagesToWatchTable(data.data);
                } else {
                    buildPagesToWatchTable('');
                    layer.msg(data.status.msg);
                    //console.info(data.status.msg);
                }

            },
            error: function (data) {
                layer.msg(data.status.msg);
                //console.info(data.status.msg);
            }
        });
    }

    $(function () {
        getPagesToWatchList();

    });

    function addPage() {
        var data = $('.addPage').find('input').serializeArray(),
            i;
        for (i = 0; i < data.length; i += 1) {
            if (data[i].value === '' && data[i].name !== 'sort') {
                layer.msg(data[i].name + ' should not be empty');
                return;
            }
        }
        $.ajax({
            type: 'GET',
            url: gobal.base_url + gobal.controllerName + '/addPage',
            data: $.param(data),
            dataType: 'json',
            success: function (data) {
                location.reload();
            },
            error: function (data) {
                layer.msg(data.status.msg);
                //console.info(data.status.msg);
            }
        });
    }

    function editPage(id) {
        layer.confirm('Are you sure to modify it?', {
            btn: ['Yes', 'No'],
            title: 'info'
        }, function () {
            var data = $('#pagesToWatchDataTable').find('input.' + id).serializeArray(),
                i;
            for (i = 0; i < data.length; i += 1) {
                if (data[i].value === '' && data[i].name !== 'sort') {
                    layer.msg(data[i].name + ' should not be empty');
                    return;
                }
            }
            $.ajax({
                type: 'GET',
                url: gobal.base_url + gobal.controllerName + '/editPage',
                data: $.param(data),
                dataType: 'json',
                success: function (data) {
                    //console.info(data);
                    location.reload();
                },
                error: function (data) {
                    layer.msg(data.status.msg);
                    //console.info(data.status.msg);
                }
            });
        }, function () {});

    }

    function deletePage(id) {
        layer.confirm('Are you sure to delete it?', {
            btn: ['Yes', 'No'],
            title: 'info'
        }, function () {
            $.ajax({
                type: 'GET',
                url: gobal.base_url + gobal.controllerName + '/deletePage',
                data: {
                    'id': id
                },
                dataType: 'json',
                success: function (data) {
                    location.reload();

                },
                error: function (data) {
                    layer.msg(data.status.msg);
                    //console.info(data.status.msg);
                }
            });
        }, function () {});
    }

}(window, jQuery, layer));
