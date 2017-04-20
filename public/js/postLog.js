var window = window,
    jQuery = jQuery,
    SocialReport = SocialReport,
    layer = layer;

(function (window, $, SocialReport, layer) {
    'use strict';

    //set a gobal variable in this js file
    var gobal = {};

    //build posts number by editor
    function buildpostNumberByEditorDataTable(Operation) {
        var facebookOperation = Operation,
            //it returan an object include attribute of `data` and `columnTitle`
            data = facebookOperation.getFormatDataFromTableType('postnumberbyeditor'),
            tableAttrs = {
                order: [1, 'des'],
                searching: false,
                paging: false,
                columns: data.columnTitle
            };
        //if table is exist
        if (gobal.postNumberByEditorDataTable) {
            //use repaint
            gobal.postNumberByEditorDataTable.repaint(data.data, tableAttrs);
        } else {
            //build datatable object
            gobal.postNumberByEditorDataTable = new SocialReport.DataTables('postNumberByEditorDataTable', data.data, tableAttrs);
        }
    }

    //build PostLogDataTable
    function buildPostLogDataTable(Operation) {
        var facebookOperation = Operation,
            //it returan an object include attribute of `data` and `columnTitle`
            data = facebookOperation.getFormatDataFromTableType('postlog', {
                interval: gobal.interval
            }),
            tableAttrs = {
                ordering: false,
                searching: false,
                columns: data.columnTitle,
                columnDefs: [{
                    "className": "breakall",
                    "targets": [2]
                }],
                "iDisplayLength": 50,
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'copyHtml5',
                        text: 'Copy to clipboard',
                        filename: 'Facebook PageId(' + window.troperlaicos.facebook.pageid + ') Post Log Report during ' + gobal.dataSelectorPanel.getDateRangeInText()
                    },
                    {
                        extend: 'excelHtml5',
                        text: 'Save to XLSX file',
                        filename: 'Facebook PageId(' + window.troperlaicos.facebook.pageid + ') Post Log Report during ' + gobal.dataSelectorPanel.getDateRangeInText()
                    }
                ]
            };
        //if table is exist
        if (gobal.postLogDataTable) {
            //use repaint
            gobal.postLogDataTable.repaint(data.data, tableAttrs);
        } else {
            //build datatable object
            gobal.postLogDataTable = new SocialReport.DataTables('postLogDataTable', data.data, tableAttrs);
        }
    }

    //data selector panel change will trigger this function
    function dataSelectorPanelChangeHandler(currentInterval, start, end) {
        //set paras for getting facebook data
        var params = {
            since: start.unix(),
            until: end.unix(),
            pageid: window.troperlaicos.facebook.pageid,
            access_token: window.troperlaicos.facebook.access_token
        };
        //set current interval to gobal
        gobal.interval = currentInterval;
        //set a new one ajax loading layer
        gobal.websiteLoadingLayer = layer.load(2, {
            shade: [0.1, '#000']
        });
        //use asynchronous to get facebook data(posts and reach) and put the follow steps in the callback function such as `buildTable`.
        SocialReport.Facebook.genFacebookOperation(params, function () { //it is a callback function to build tables
            //close loadding layer
            layer.close(gobal.websiteLoadingLayer);
            var facebookOperation = this;
            //build tables
            buildpostNumberByEditorDataTable(facebookOperation);
            buildPostLogDataTable(facebookOperation);
        });
    }

    $(function () {

        //data selector panel,change Property and dateRnage to get different data
        gobal.dataSelectorPanel = new SocialReport.DateRangePickerSelectorPanel('dataSelectorPanel', {
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

}(window, jQuery, SocialReport, layer));
