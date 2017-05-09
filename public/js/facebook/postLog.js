var window = window,
    jQuery = jQuery,
    SocialReport = SocialReport,
    layer = layer;

(function (window, $, SocialReport, layer) {
    'use strict';

    //set a gobal variable in this js file
    var gobal = {};

    //build posts log summary table
    function buildPostLogSummaryDataTable(Operation) {
        var facebookOperation = Operation,
            //it returan an object include attribute of `data`, `columnTitle` and `editorList`
            data = facebookOperation.getFormatDataFromTableType('postlogsummary'),
            tableAttrs = {
                order: [1, 'des'],
                searching: false,
                paging: false,
                columns: data.columnTitle
            };
        //if table is exist
        if (gobal.postLogSummaryDataTable) {
            //use repaint
            gobal.postLogSummaryDataTable.repaint(data.data, tableAttrs);
        } else {
            //build datatable object
            gobal.postLogSummaryDataTable = new SocialReport.DataTables('postLogSummaryDataTable', data.data, tableAttrs);
        }
        //update editorSelector editor list
        gobal.dataSelectorPanel.componentCombiner.getComponent('editorSelector').addOption(data.editorList);
    }

    //build PostLogDataTable
    function buildPostLogDataTable(Operation, ComponentList) {
        var facebookOperation = Operation,
            //it returan an object include attribute of `data` and `columnTitle`
            data = facebookOperation.getFormatDataFromTableType('postlog', {
                interval: ComponentList.intervalSelector.getCurrentValue(),
                reservedEditor: ComponentList.editorSelector.getCurrentValue(),
                showEmptySlot: ComponentList.emptySlotSelector.getCurrentValue(),
                startDate: ComponentList.dateRangePicker.getStart(),
                endDate: ComponentList.dateRangePicker.getEnd()
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
                        filename: 'Facebook PageId(' + window.troperlaicos.facebook.pageid + ') Post Log Report during ' + gobal.dataSelectorPanel.componentCombiner.getComponent('dateRangePicker').getDateRangeInText()
                    },
                    {
                        extend: 'excelHtml5',
                        text: 'Save to XLSX file',
                        filename: 'Facebook PageId(' + window.troperlaicos.facebook.pageid + ') Post Log Report during ' + gobal.dataSelectorPanel.componentCombiner.getComponent('dateRangePicker').getDateRangeInText()
                    }
                ]
            };
        
        //save `writingScheduleExcelData` to gobal
        gobal.writingScheduleExcelData = data.writingScheduleExcelData;
        
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
    function dataSelectorPanelChangeHandler(ComponentList) {
        //set paras for getting facebook data
        var params = {
            since: ComponentList.dateRangePicker.getStart().unix(),
            until: ComponentList.dateRangePicker.getEnd().unix(),
            pageid: window.troperlaicos.facebook.pageid,
            access_token: window.troperlaicos.facebook.access_token
        };
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
            buildPostLogSummaryDataTable(facebookOperation);
            buildPostLogDataTable(facebookOperation, ComponentList);
        });
    }
    
    //generate weekly repport on server
    window.generateWeeklyReportExcel = function () {
        //set a new one ajax loading layer
        gobal.genWeeklyReportLayer = layer.load(2, {
            shade: [0.1, '#000']
        });

        $.ajax({
            type: 'POST',
            url: window.troperlaicos.facebook.base_url + window.troperlaicos.facebook.controllerName + '/generateWeeklyReportExcel',
            data: {
                'writingScheduleExcelData': JSON.stringify(gobal.writingScheduleExcelData),
                'excelName': 'TOUCH Facebook\'s Writing Schedule ' + gobal.dataSelectorPanel.componentCombiner.getComponent('dateRangePicker').getDateRangeInText()
            },
            dataType: 'json',
            success: function (data) {
                //close loadding layer
                layer.close(gobal.genWeeklyReportLayer);
                if (data.hasOwnProperty('downloadUrl')) {
                    window.location.href = data.downloadUrl;
                }
            },
            error: function (error) {
                //close loadding layer
                layer.close(gobal.genWeeklyReportLayer);
                SocialReport.Toolbox.assert(error);
            }
        });
    };

    $(function () {
        //build panel component
        var intervalSelector = new SocialReport.Select('intervalSelector', {
                option: {
                    '1': '1 minutes',
                    '15': '15 minutes',
                    '30': '30 minutes',
                    '60': '60 minutes'
                },
                defaultValue: '15'
            }),
            dateRangePicker = new SocialReport.DateRangePicker('dateRangePicker'),
            editorSelector = new SocialReport.Select('editorSelector', {
                option: {
                    all: 'all'
                }
            }),
            emptySlotSelector = new SocialReport.Select('emptySlotSelector', {
                option: {
                    disable: 'disable',
                    enable: 'enable'
                }
            });
        //build panel
        window.dataSelectorPanel = gobal.dataSelectorPanel = new SocialReport.Panel('', {
            components: [intervalSelector, dateRangePicker, editorSelector, emptySlotSelector],
            changeHandler: dataSelectorPanelChangeHandler
        });
        //start the dateRangePicker component
        dateRangePicker.triggerChangeEvent();
        
    });

}(window, jQuery, SocialReport, layer));
