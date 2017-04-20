var window = window,
    jQuery = jQuery,
    SocialReport = SocialReport,
    layer = layer,
    moment = moment;

(function (window, $, SocialReport, layer, moment) {
    'use strict';

    //set a gobal variable in this js file
    var gobal = {
        pageToWatchLoadingLayer: '',
        websiteLoadingLayer: '',
        competitorLoadingLayer: '',
        pagesToWatchList: JSON.parse(window.troperlaicos.facebook.pagesToWatchList),
        website: {
            currentName: window.troperlaicos.facebook.pageid,
            lineChart: {}
        },
        competitor: {
            currentName: '',
            lineChart: {}
        }
    };

    //build number of posts lineChart data table 
    function buildPostSizeLineChart() {
        gobal.postSizeLineChart = new SocialReport.LineChart('postSizeLineChart', {
            websiteName: gobal.website.currentName,
            websiteLabelArr: gobal.website.lineChart.postSizeData.labelArr,
            websiteDataArr: gobal.website.lineChart.postSizeData.dataArr,
            competitorName: gobal.competitor.currentName,
            competitorLabelArr: gobal.competitor.lineChart.postSizeData.labelArr,
            competitorDataArr: gobal.competitor.lineChart.postSizeData.dataArr
        });
        //draw a overall data in the section
        $('.numberOfPostsContainer').html(' &nbsp; &nbsp; &nbsp; &nbsp;(<label class="text-aqua">Total: &nbsp;' + gobal.website.lineChart.postSizeData.numberOfPost.toLocaleString() + '</label><label class="text-muted"> &nbsp; / &nbsp;Total: &nbsp;' + gobal.competitor.lineChart.postSizeData.numberOfPost.toLocaleString() + ')</label>');
    }

    //build avg reach by post number data table
    function buildAvgReachByPostLineChart() {
        gobal.avgReachByPostLineChart = new SocialReport.LineChart('avgReachByPostLineChart', {
            websiteName: gobal.website.currentName,
            websiteLabelArr: gobal.website.lineChart.avgReachByPostData.labelArr,
            websiteDataArr: gobal.website.lineChart.avgReachByPostData.dataArr,
            competitorName: gobal.competitor.currentName,
            competitorLabelArr: gobal.competitor.lineChart.avgReachByPostData.labelArr,
            competitorDataArr: gobal.competitor.lineChart.avgReachByPostData.dataArr
        });
        //draw a overall data in the section
        $('.avgReachByPostsContainer').html('&nbsp;&nbsp;&nbsp;&nbsp;(<label class="text-aqua">Total: &nbsp;' + gobal.website.lineChart.avgReachByPostData.avgReachByPost.toLocaleString() + '</label><label class="text-muted">&nbsp; / &nbsp;Total: &nbsp;' + gobal.competitor.lineChart.avgReachByPostData.avgReachByPost.toLocaleString() + '</label>)');
    }

    //build avg page fan like data table
    function buildAvgPageFanLikeLineChart() {
        gobal.avgFanPageLikeLineChart = new SocialReport.LineChart('avgFanPageLikeLineChart', {
            websiteName: gobal.website.currentName,
            websiteLabelArr: gobal.website.lineChart.avgFanPageLikeData.labelArr,
            websiteDataArr: gobal.website.lineChart.avgFanPageLikeData.dataArr,
            competitorName: gobal.competitor.currentName,
            competitorLabelArr: gobal.competitor.lineChart.avgFanPageLikeData.labelArr,
            competitorDataArr: gobal.competitor.lineChart.avgFanPageLikeData.dataArr
        });
        //draw a overall data in the section
        $('.avgPageFansLikeByDayRangeContainer').html('&nbsp;&nbsp;&nbsp;&nbsp;(<label class="text-aqua">Total: &nbsp;' + gobal.website.lineChart.avgFanPageLikeData.avgPageFansLike.toLocaleString() + '</label><label class="text-muted">&nbsp; / &nbsp;Total: &nbsp;' + gobal.competitor.lineChart.avgFanPageLikeData.avgPageFansLike.toLocaleString() + '</label>)');
    }

    //build reach rate data table
    function buildReachRateLineChart() {
        var websiteAvgReachDataArr = gobal.website.lineChart.avgReachByPostData.dataArr,
            websiteAvgFanLikeDataArr = gobal.website.lineChart.avgFanPageLikeData.dataArr,
            competitorAvgReachDataArr = gobal.competitor.lineChart.avgReachByPostData.dataArr,
            competitorAvgFanLikeDataArr = gobal.competitor.lineChart.avgFanPageLikeData.dataArr,
            websiteReachRateArr = [],
            competitorReachRateArr = [],
            websiteKey = '',
            comopetitorKey = '',
            websiteReachRate = 0,
            competitorReachRate = 0;
        //loop to get website ReachRate
        for (websiteKey in websiteAvgReachDataArr) {
            if (websiteAvgReachDataArr.hasOwnProperty(websiteKey)) {
                websiteReachRate = (websiteAvgFanLikeDataArr[websiteKey] !== 0) ? parseFloat(websiteAvgReachDataArr[websiteKey] / websiteAvgFanLikeDataArr[websiteKey]).toFixed(2) : 0;
                websiteReachRateArr.push(websiteReachRate);
            }
        }
        //loop to get competitor ReachRate
        for (comopetitorKey in competitorAvgReachDataArr) {
            if (competitorAvgReachDataArr.hasOwnProperty(comopetitorKey)) {
                competitorReachRate = (competitorAvgReachDataArr[comopetitorKey] !== 0) ? parseFloat(competitorAvgReachDataArr[comopetitorKey] / competitorAvgFanLikeDataArr[comopetitorKey]).toFixed(2) : 0;
                competitorReachRateArr.push(competitorReachRate);
            }
        }
        gobal.reachRateLineChart = new SocialReport.LineChart('reachRateLineChart', {
            websiteName: gobal.website.currentName,
            websiteLabelArr: gobal.website.lineChart.postSizeData.labelArr,
            websiteDataArr: websiteReachRateArr,
            competitorName: gobal.competitor.currentName,
            competitorLabelArr: gobal.competitor.lineChart.postSizeData.labelArr,
            competitorDataArr: competitorReachRateArr
        });
        //draw a overall data in the section
        $('.reachRateContainer').html('&nbsp;&nbsp;&nbsp;&nbsp;(<label class="text-aqua">Total: &nbsp;' + (parseFloat(gobal.website.lineChart.avgReachByPostData.avgReachByPost / gobal.website.lineChart.avgFanPageLikeData.avgPageFansLike) * 100).toFixed(2) + '%</label><label class="text-muted">&nbsp; / &nbsp;Total: &nbsp;' + (parseFloat(gobal.competitor.lineChart.avgReachByPostData.avgReachByPost / gobal.competitor.lineChart.avgFanPageLikeData.avgPageFansLike) * 100).toFixed(2) + '%</label>)');
    }

    //it is a callback function to build LineChart
    function buildLineChart() {
        //build LineChart
        buildPostSizeLineChart();
        buildAvgReachByPostLineChart();
        buildAvgPageFanLikeLineChart();
        buildReachRateLineChart();
    }

    //#############################################
    //websitePanel change will trigger this handler
    //#############################################
    function websitePanelChangeHandler(currentValue, start, end) {
        //set paras for getting facebook data
        var params = {
            since: start.unix(),
            until: end.unix(),
            pageid: currentValue,
            access_token: window.troperlaicos.facebook.access_token,
            dataStart: start,
            dateEnd: end
        };
        //set a new one ajax loading layer
        gobal.websiteLoadingLayer = layer.load(2, {
            shade: [0.1, '#000']
        });
        //use asynchronous to get facebook data(posts and reach) and put the follow steps in the callback function such as `buildTable`.
        SocialReport.Facebook.genFacebookOperation(params, function () { //it is a callback function to get LineChartData for website and set data in `gobal`
            var facebookOperation = this,
                //it return an object include attribute of `labelArr` and `dataArr`
                postSizeData = facebookOperation.getFormatDataFromLineChartType('postsize'),
                avgReachByPostData = facebookOperation.getFormatDataFromLineChartType('avgreachbypost'),
                avgPageFanLikeData = facebookOperation.getFormatDataFromLineChartType('avgpagefanlike');
            //save it to global variable for further use
            gobal.website.lineChart.postSizeData = postSizeData;
            gobal.website.lineChart.avgReachByPostData = avgReachByPostData;
            gobal.website.lineChart.avgFanPageLikeData = avgPageFanLikeData;
            //close loadding layer
            layer.close(gobal.websiteLoadingLayer);
            //then when the other DateRangePickerSelectorPanel finish load we build the whold LineChart
            if (gobal.competitor.lineChart.postSizeData) {
                buildLineChart();
            }

        });
    }

    //################################################
    //competitorPanel change will trigger this handler
    //################################################
    function competitorPanelChangeHandler(currentValue, start, end) {
        //set paras for getting facebook data
        var params = {
            since: start.unix(),
            until: end.unix(),
            pageid: currentValue,
            access_token: window.troperlaicos.facebook.access_token,
            dataStart: start,
            dateEnd: end
        };

        //it is a callback for facebook request error 
        function fbErrorCallback(Error) {
            //close loadding layer
            layer.close(gobal.competitorLoadingLayer);
            var errorPageId = $.trim(Error.facebookPostsRequestError.responseJSON.error.message.split(':')[1]);
            layer.alert(errorPageId + ' is not a corret page id in facebook, so we can not show facebook data of ' + errorPageId);
        }

        //set a new one ajax loading layer
        gobal.competitorLoadingLayer = layer.load(2, {
            shade: [0.1, '#000']
        });
        //use asynchronous to get facebook data(posts and reach) and put the follow steps in the callback function such as `buildTable`.
        SocialReport.Facebook.genFacebookOperation(params, function () { //it is a callback function to get LineChartData for competitor and set data in `gobal`
            var facebookOperation = this,
                //it return an object include attribute of `labelArr` and `dataArr`
                postSizeData = facebookOperation.getFormatDataFromLineChartType('postsize'),
                avgReachByPostData = facebookOperation.getFormatDataFromLineChartType('avgreachbypost'),
                avgPageFanLikeData = facebookOperation.getFormatDataFromLineChartType('avgpagefanlike');
            //save it to global variable for further use
            gobal.competitor.lineChart.postSizeData = postSizeData;
            gobal.competitor.lineChart.avgReachByPostData = avgReachByPostData;
            gobal.competitor.lineChart.avgFanPageLikeData = avgPageFanLikeData;
            //close loadding layer
            layer.close(gobal.competitorLoadingLayer);
            //then when the other DateRangePickerSelectorPanel finish load we build the whold LineChart
            if (gobal.website.lineChart.postSizeData) {
                buildLineChart();
            }
        }, fbErrorCallback);
        gobal.competitor.currentName = currentValue;
    }

    $(function () {
        var websitePanelOption = {};
        websitePanelOption[window.troperlaicos.facebook.pageid] = window.troperlaicos.facebook.websiteName;
        //website setting panel,can choose dateRange to get different data
        gobal.websitePanel = new SocialReport.DateRangePickerSelectorPanel('websitePanel', {
            changeHandler: websitePanelChangeHandler,
            option: websitePanelOption
        });
        //competitor setting panel,change competitor and dateRnage to get different data
        gobal.competitorPanel = new SocialReport.DateRangePickerSelectorPanel('competitorPanel', {
            changeHandler: competitorPanelChangeHandler,
            option: gobal.pagesToWatchList
        });

        //set a new one ajax loading layer
        gobal.pageToWatchLoadingLayer = layer.load(2, {
            shade: [0.1, '#000']
        });
        //get page to watch dataTable data, it return labelArr and dataArr for dataTable api
        SocialReport.Facebook.genPagesToWatchListData({
            since: moment().add(8, 'hours').subtract(8, 'days').hours(8).minutes(0).seconds(0).unix(),
            until: moment().add(8, 'hours').hours(8).minutes(0).seconds(0).unix(),
            pageidList: gobal.pagesToWatchList,
            access_token: window.troperlaicos.facebook.access_token
        }, function (LabelArr, DataArr) {
            //this is a call back function for genPagesToWatchListData, it return labelArr and dataArr for building pageToWatch datatable.`this` is `facebookOperationList`

            //close loadding layer
            layer.close(gobal.pageToWatchLoadingLayer);

            var tableAttrs = {
                columns: LabelArr,
                order: [1, 'des']
            };
            //if table is exist
            if (gobal.pageToWatchDataTable) {
                //use repaint
                gobal.pageToWatchDataTable.repaint(DataArr, tableAttrs);
            } else {
                //build datatable object
                gobal.pageToWatchDataTable = new SocialReport.DataTables('pageToWatchDataTable', DataArr, tableAttrs);
            }
            //highlight website
            $('.' + window.troperlaicos.facebook.pageid).closest('tr').css('border', '3px solid #00C0EF');
        });

    });

}(window, jQuery, SocialReport, layer, moment));
