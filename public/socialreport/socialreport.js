//SocialReport.js

//It is dependent on jQuery,moment,DataTables(https://datatables.net/),DateRangePicker(http://www.daterangepicker.com/),layer(http://www.layui.com/doc/modules/layer.html).
//It has some subclassess: Data, vVew, Operation, Toolbox, Facebook

;
(function ($, window, moment, layer) {
    window.SocialReport = function () {
        var SocialReport = {};

        //variable for layer plugin ajax loading layer
        var ajaxLoadingLayer = '';

        //SocialReport.DataInterface
        //--------------------------

        //DataInterface class is designed to get the facebook and google data by ajax.
        var DataInterface = SocialReport.DataInterface = {};

        //url for get data from server
        DataInterface.url = '';

        //wrap ajax
        DataInterface.ajax = function (Data, Options) {
            //set `success` function
            var success = function (resp) {
                //close ajax loading layer
                layer.close(ajaxLoadingLayer);
                //if `Options.success` exists call it
                if (Options.success) {
                    //if `Options.context` exists use function.prototype.call to call `Options.success`
                    if (Options.context) {
                        Options.success.call(Options.context, resp);
                    } else {
                        Options.success(resp);
                    }
                }
            };

            //set `error` function
            var error = function (resp) {
                //close ajax loading layer
                layer.close(ajaxLoadingLayer);
                //if `Options.error` exists call it
                if (Options.error) {
                    //if `Options.context` exists use function.prototype.call to call `Options.error`
                    if (Options.context) {
                        Options.error.call(Options.context, resp);
                    } else {
                        Options.error(resp);
                    }
                }
            };

            //if has ajax loading layer then close it
            if (ajaxLoadingLayer) {
                layer.close(ajaxLoadingLayer);
            }
            //set a new one ajax loading layer
            ajaxLoadingLayer = layer.load(2, {
                shade: [0.1, '#000']
            });

            $.ajax({
                url: Options.url,
                type: Options.type || 'GET',
                data: Data,
                dataType: Options.datatype || 'json',
                success: success,
                error: error
            });
        };

        //get data from server by ajax.
        DataInterface.get = function (Data, Options) {
            DataInterface.ajax(Data, Options || '');
        };

        //post data to server by ajax.
        DataInterface.post = function (Data, Options) {
            DataInterface.ajax(Data, Options || '');
        };

        //update the whole data to server.
        DataInterface.put = function (Data, Options) {
            //use DataInterface.post for now, do not figure out the best way to simulate RESTful api.
            DataInterface.post(Data, Options);
        };

        //update the property of data to server.
        DataInterface.patch = function (Data, Options) {
            //use DataInterface.post for now, do not figure out the best way to simulate RESTful api.
            DataInterface.post(Data, Options);
        };

        //delete data from server by ajax simulate RESTful api.
        DataInterface.delete = function (data, Options) {
            //use DataInterface.post for now, do not figure out the best way to simulate RESTful api.
            DataInterface.post(data, Options);
        };

        //temporary function to get facebook posts data before the sever php versin upgrade to 5.4 or above
        DataInterface.getFacebookPosts = function (Params, Callback) {

            var params = Params || {},
                data = {
                    since: params.since || '',
                    until: params.until || '',
                    access_token: params.access_token || ''
                },
                options = {},
                result = {
                    data: []
                },
                error = '',
                success = '',
                callback = Callback || function (resp) {
                    console.info(resp)
                };

            //if `data.since` or `data.until` or `data.access_token` or `params.pageid` is empty return `result`
            if (!(data.since && data.until && data.access_token && params.pageid)) return result.data;
            options = {
                url: 'https://graph.facebook.com/v2.8/' + params.pageid + '/posts?fields=id,permalink_url,message,type,created_time,insights.metric(post_impressions_organic,post_impressions_by_story_type,post_impressions_paid,post_impressions,post_impressions_unique,post_impressions_paid_unique,post_reactions_by_type_total,post_consumptions_by_type,post_video_views),shares,comments.limit(0).summary(1)',
                context: result
            };

            //set the `options.error`
            error = options.error = function (resp) {
                console.info(resp);
            };
            //set the `options.success`
            success = options.success = function (resp) {
                if (resp['data']) {
                    this.data = this.data.concat(resp['data']);
                    if (resp['paging']) {
                        var nextUrl = resp['paging']['next'];
                        SocialReport.DataInterface.ajax({}, {
                            url: nextUrl,
                            context: this,
                            success: success,
                            error: error
                        });
                    } else {
                        callback(result.data);
                    }
                } else {
                    callback(result.data);
                }
            };

            SocialReport.DataInterface.ajax(data, options);
        };




        //SocialReport.View
        //-----------------

        //View class is an Abstract Data Type
        var View = SocialReport.View = function () {

        };

        $.extend(View.prototype, {
            //set `id`
            setId: function (Id) {
                //if `Id` is not undefined and not in de existInIdList then set to `this.id`
                if (Id && !this._existInIdList(Id)) {
                    this.id = Id;
                } else {
                    Toolbox.assert('Function SocialReport.View.setId: `id` is empty or alreay in the `idList` object');
                    return;
                }
            },

            //get `id`
            getId: function () {
                return this.id || '';
            },

            //object for saving used id
            _idList: {},

            //internal function check `id` exist in `idList`
            _existInIdList: function () {
                var id = this.getId();
                return !!this._idList[id];
            },

            //insert `id` in `idList`
            _insertInIdList: function () {
                var id = this.getId();
                return this._idList[id] = true;
            },

            //delete `id` in `idList`
            _deleteInIdList: function () {
                var id = this.getId();
                return !(this._idList[id] = false);
            },

            //template
            _templateInArray: [],

            //set template
            setTemplate: function (Template) {
                var template = Template || '';
                if (Toolbox.isArray(template)) {
                    return this._templateInArray = template;
                } else {
                    Toolbox.assert('Function SocialReport.View.setTemplate: `template` is empty or not a array');
                    return false;
                }
            },

            //get template
            getTemplate: function () {
                return this._templateInArray;
            },


            //initialize
            initialize: function () {

            },

            //render
            render: function () {

            }
        });

        //SocialReport.DateRangePicker
        //----------------------------

        //DateRangePicker is inherited from View
        //It a dateRangePicker ui component (http://www.daterangepicker.com/)
        var DateRangePicker = SocialReport.DateRangePicker = function (Id, Options) {
            this.initialize(Id, Options);
        };

        $.extend(DateRangePicker.prototype, View.prototype, {
            //check if the Object is constructor by moment
            _isMomentObj: function (Obj) {
                var obj = Obj || {};
                return obj.constructor === moment().constructor;
            },

            //set start time in moment object
            setStart: function (Moment) {
                var moment = Moment || {};
                if (!this._isMomentObj(moment)) {
                    Toolbox.assert('Function SocialReport.DateRangePicker.setStart: Moment is undefined or is invalid (need to be constructor by moment');
                    return false;
                } else {
                    return this.start = moment;
                }
            },

            //get start time in moment obj and can format it by using moment format(http://momentjs.cn/docs/#/displaying/format/)
            getStart: function (FormatString) {
                var formatString = FormatString || '';
                //if formatString exist
                if (formatString) {
                    //then we format it
                    return this.start.format(formatString);
                }
                return this.start;
            },

            //set end time in moment object
            setEnd: function (Moment) {
                var moment = Moment || {};
                if (!this._isMomentObj(moment)) {
                    Toolbox.assert('Function SocialReport.DateRangePicker.setEnd: Moment is undefined or is invalid (need to be constructor by moment');
                    return false;
                } else {
                    return this.end = moment;
                }
            },

            //get end time in moment obj and can format it by using moment format(http://momentjs.cn/docs/#/displaying/format/)
            getEnd: function (FormatString) {
                var formatString = FormatString || '';
                //if formatString exist
                if (formatString) {
                    //then we format it
                    return this.end.format(formatString);
                }
                return this.end;
            },

            //set callback function
            setCallback: function (Callback) {
                if (Toolbox.isFunction(Callback)) {
                    this.callback = Callback;
                } else {
                    Toolbox.assert('Function SocialReport.DateRangePicker.setCallback: Callback is not a function');
                    return false;
                }
            },

            //get callback function
            getCallback: function () {
                return this.callback;
            },

            //get range in day
            getRangeInDay: function () {
                return Toolbox.secToDay((this.getEnd("x") - this.getStart("x")) / 1000);
            },

            //render
            render: function () {
                var id = this.getId(),
                    $obj = $('#' + id),
                    template = this.getTemplate().join('').replace('%ID%', id);
                //check if there is element obj whose id attribute is `id`
                if ($obj.size() === 0) {
                    Toolbox.assert('Function SocialReport.DateRangePicker.render: there is no element\'s id is ' + id);
                    return false;
                }
                $obj.prop('outerHTML', template);
            },

            //set daterangerpicker
            setDateRangePikcer: function () {
                var _this = this,
                    id = this.getId(),
                    $obj = $('#' + id),
                    start = this.getStart(),
                    end = this.getEnd(),
                    cb = function (start, end) { //`start` and `end` is millisecond,you need to change it to unix stamp when you commuicate with server
                        //set current `start` and `end`
                        _this.setStart(start);
                        _this.setEnd(end);
                        //change the content of the daterangepicker
                        $obj.find('span').html(_this.getDateRangeInText());
                        //call user's callback function
                        _this.callback.call(_this, moment(start), moment(end));
                    };
                //initialize daterangepicker
                $obj.daterangepicker({
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
                    },
                    cb
                );
                //first time to run the callback function by default
                cb(start, end);
            },

            //get dateRange in text format
            getDateRangeInText: function () {
                return this.getStart('MMMM D, YYYY') + ' - ' + this.getEnd('MMMM D, YYYY');
            },

            //initialize the element obj
            initialize: function (Id, Options) {
                this.setId(Id);
                this.setStart(Options.start || moment().subtract(6, 'days').hours(0).minutes(0).seconds(0));
                this.setEnd(Options.end || moment().hours(23).minutes(59).seconds(59));
                this.setCallback(Options.callback || '');
                this.setTemplate(['<button type="button" class="btn btn-default pull-right" id="', '%ID%', '"><span><i class="fa fa-calendar"></i> Date range picker</span><i class="fa fa-caret-down"></i></button>']);
                this.render();
                this.setDateRangePikcer();
            }
        });


        //SocialReport.DataTables
        //-----------------------

        //DataTables is inherited from View
        //It is a DataTables ui component (https://datatables.net/)
        //temporary add `Options` for further useage
        var DataTables = SocialReport.DataTables = function (Id, TableData, TableAttrs, Options) {
            this.initialize(Id, TableData, TableAttrs, Options);
        };

        $.extend(DataTables.prototype, View.prototype, {
            //set dataTableObj which can use DataTable api
            _setDataTableObj: function (Obj) {
                if (!Obj || typeof (Obj) !== 'object') {
                    Toolbox.assert('Function SocialReport.DataTables._setDataTableObj: Obj can not be undefined and should be an object');
                    return false;
                } else {
                    this.dataTableObj = Obj;
                }
            },

            //get dataTableObj
            _getDataTableObj: function () {
                return this.dataTableObj;
            },

            //set data
            setData: function (Data) {
                if (!Toolbox.isArray(Data)) {
                    Toolbox.assert('Function SocialReport.DataTables.setData: Data can not be undefined and need to be an two dimensioin array.');
                    return false;
                } else {
                    this.data = Data;
                }
            },

            //get table
            getData: function () {
                return this.data;
            },

            //set tableAttrs
            setTableAttrs: function (Attrs) {
                if (!Attrs) {
                    Toolbox.assert('Function SocialReport.DataTables.setTableAttrs: Attrs can not be undefined.');
                    return false;
                } else {
                    return this.tableAttrs = Attrs;
                }
            },

            //get tableAttrs
            getTableAttrs: function () {
                return this.tableAttrs;
            },

            //render the element obj
            render: function () {
                var id = this.getId(),
                    $obj = $('#' + id),
                    template = this.getTemplate().join('').replace('%ID%', id);
                //check if there is element obj whose id attribute is `id`
                if ($obj.size() === 0) {
                    Toolbox.assert('Function SocialReport.DateRangePicker.render: there is no element\'s id is ' + id);
                    return false;
                }
                $obj.prop('outerHTML', template);
            },

            //set DataTables
            setDataTables: function () {
                var id = this.getId(),
                    $obj = $('#' + id),
                    tableAttrs = $.extend({}, this.getTableAttrs(), {
                        'data': this.getData()
                    }),
                    dataTableObj = $obj.DataTable(tableAttrs);
                //save dataTable obj for further use
                this._setDataTableObj(dataTableObj);
            },

            //destory the datatable
            destoryDataTables: function () {
                var dataTableObj = this._getDataTableObj();
                if (dataTableObj) {
                    dataTableObj.destroy();
                }
            },

            //repaint the datatable
            repaint: function (TableData, TableAttrs, Options) {
                this.setData(TableData);
                if (TableAttrs) {
                    this.setTableAttrs(TableAttrs);
                }
                this.destoryDataTables();
                this.setDataTables();
            },

            //initialize the element obj
            initialize: function (Id, TableData, TableAttrs, Options) {
                this.setId(Id);
                this.setData(TableData);
                this.setTableAttrs(TableAttrs);
                this.setTemplate(['<table id="', '%ID%', '" class="table table-striped table-bordered dt-responsive" cellspacing="0" width="100%"></table>']);
                this.render();
                this.setDataTables();
            }
        });



        //SocialReport.Operation
        //----------------------

        //Operatioin is a Abstract Data Type which define a pile of functions to help calculate the date from the data class before render by view class
        var Operation = SocialReport.Operation = function (Data, Options) {
            this.data = Data || {};
            this.options = Options || {};
            this.dayRange = Toolbox.secToDay(this.options.seconds) || 0;
            this.options.parse && this.options.parse() || this.parse(this.options.datasource);
        };

        $.extend(Operation.prototype, {
            //parse Data
            parse: function (Datasource) {
                var datasource = Datasource || '';
                datasource = datasource.toLowerCase();
                switch (datasource) {
                    case 'facebook':
                        return this.parseFacebookData();
                        break;
                    case 'google':
                        return this.parseGoogleData();
                        break;
                    default:
                        return false;
                        break;
                }
            },

            //parse facebook data
            parseFacebookData: function () {
                var resultObj = [],
                    originObj = this.getData(),
                    size = this.getSize();
                //loop to set data
                for (var i = 0; i < size; i++) {
                    var obj = {};
                    obj['comments'] = originObj[i]['comments'] ? originObj[i]['comments']['summary']['total_count'] : 0;
                    obj['shares'] = originObj[i]['shares'] ? originObj[i]['shares']['count'] : 0;
                    obj['created_time'] = Toolbox.formatTime(originObj[i]['created_time']) || '';
                    obj['id'] = originObj[i]['id'] || '';
                    obj['message'] = originObj[i]['message'] || '';
                    obj['permalink_url'] = originObj[i]['permalink_url'] || '';
                    obj['type'] = originObj[i]['type'] || '';
                    obj['insights'] = originObj[i]['insights']['data'] || '';
                    //loop to set insights object data
                    for (var j = 0; j < obj['insights'].length; j++) {
                        switch (obj['insights'][j]['name']) {
                            case 'post_impressions_organic':
                                obj['post_impressions_organic'] = obj['insights'][j]['values']['0']['value'];
                                break;
                            case 'post_impressions_by_story_type':
                                obj['post_impressions_by_story_type'] = obj['insights'][j]['values']['0']['value']['other'];
                                break;
                            case 'post_impressions_paid':
                                obj['post_impressions_paid'] = obj['insights'][j]['values']['0']['value'];
                                break;
                            case 'post_impressions':
                                obj['post_impressions'] = obj['insights'][j]['values']['0']['value'];
                                break;
                            case 'post_impressions_unique':
                                obj['post_impressions_unique'] = obj['insights'][j]['values']['0']['value'];
                                break;
                            case 'post_impressions_paid_unique':
                                obj['post_impressions_paid_unique'] = obj['insights'][j]['values']['0']['value'];
                                break;
                            case 'post_reactions_by_type_total':
                                //`reactionsObj` has different types of reactions need to break it down
                                var reactionsObj = obj['insights'][j]['values']['0']['value'];
                                obj['post_reactions_by_type_total'] = reactionsObj;
                                for (var key in reactionsObj) {
                                    obj[key] = reactionsObj[key];
                                }
                                break;
                            case 'post_consumptions_by_type':
                                //`consumptionsObj` has different types of consumptions need to break it down
                                var consumptionsObj = obj['insights'][j]['values']['0']['value'];
                                obj['post_consumptions_by_type'] = consumptionsObj;
                                for (var key in consumptionsObj) {
                                    obj[key] = consumptionsObj[key];
                                }
                                break;
                            case 'post_video_views':
                                obj['post_video_views'] = obj['insights'][j]['values']['0']['value'];
                                break;
                            case 'post_video_views':
                                obj['post_video_views'] = obj['insights'][j]['values']['0']['value'];
                                break;
                            default:
                                break;
                        };
                    }
                    resultObj[i] = obj;
                }
                this.setData(resultObj);
            },



            //get Data
            getData: function () {
                return this.data;
            },

            //set Data
            setData: function (Data) {
                return this.data = Data || {};
            },

            //get dateRange
            getDayRange: function () {
                return this.dayRange || 0;
            },

            //set dateRange
            setDayRange: function (DayRange) {
                return this.dayRange = DayRange || 0;
            },

            //calculate frequency
            frequency: function () {
                var dateRange = parseInt(this.getDayRange()),
                    size = parseInt(this.getSize());
                if (dateRange) {
                    return parseFloat(size / dateRange).toFixed(2);
                } else {
                    return 0;
                }
            },

            //get format data
            getFormatData: function (Type) {
                var type = (Type).toLowerCase() || 'facebook';
                switch (type) {
                    case 'facebook':
                        return this._formatDataInFacebook();
                        break;
                    case 'google':
                        return this._formatDataInGoogle();
                        break;
                    default:
                        return this.getData();
                        break;
                }
            },

            //get data in facebook style format
            _formatDataInFacebook: function () {
                //set the variable for looping
                var originData = this.getData(),
                    dataSize = this.getSize(),
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
                return data;
            },

            //get data size
            getSize: function () {
                var data = this.getData() || {},
                    type = (typeof data).toLowerCase();
                type = type === 'object' ? (Toolbox.isArray(data) ? 'array' : 'object') : type;

                switch (type) {
                    case 'string':
                        return data.length;
                        break;
                    case 'array':
                        return data.length;
                        break;
                    case 'object':
                        return this._getObjectSize(data);
                        break;
                    default:
                        return 0;
                };

            },

            //internal function which is to get the Object size
            _getObjectSize: function (Obj) {
                var size = 0,
                    obj = Obj || {};
                //Object.keys could not support under IE9
                if (!!Object.keys) {
                    size = Object.keys(obj).length;
                } else {
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            size++;
                        }
                    }
                }
                return size;
            },
        });




        //class Toolbox
        //-------------

        //class to deal with some calculation
        var Toolbox = SocialReport.Toolbox = {

            //convert seconds to day
            secToDay: function (Seconds) {
                var seconds = parseInt(Seconds) || 0;
                return Math.ceil(seconds / (60 * 60 * 24));
            },

            //format time
            formatTime: function (Time) {
                var time = Time || '';
                time = new Date(new Date(time).getTime()); //UTC base on created_time: XXX-XX-XXTXX:XX:XX+0000(GMT) 
                time = time.getFullYear() + "-" + ("0" + (time.getMonth() + 1)).slice(-2) + "-" + ("0" + time.getDate()).slice(-2) + " " + ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2) + ":" + ("0" + time.getSeconds()).slice(-2);
                return time;
            },

            //assert function
            assert: function (Msg) {
                var msg = Msg || '';
                console.warn(msg);
            },

            //check if the Object is Array
            isArray: function (Obj) {
                var obj = Obj || {};
                return Object.prototype.toString.call(obj) === '[object Array]';
            },

            //check if it is a function
            isFunction: function (Obj) {
                var obj = Obj || {};
                return typeof obj === 'function';
            },

        };


        //class Facebook
        //--------------

        //Facebook class contain function relative facebook
        var Facebook = SocialReport.Facebook = {

            //get function posts data base on which to generate a Operation object
            genPostsOperationObj: function (Params, Callback) {
                //set facebook posts request params
                var params = Params || {};
                //if `params.since` or `params.until` or `params.pageid` or `params.access_token` is 0 console assert the msg and return
                if (!(params.since && params.until && params.pageid && params.access_token)) {
                    SocialReport.Toolbox.assert('Function SocialReport.Facebook.genPostsOperationObj: params since or until or pageid or access_token is undefined');
                    return;
                }
                //set facebook posts request callback
                function FBPostsCallback(resp) {
                    var postsOperation = new SocialReport.Operation(resp, {
                        datasource: 'facebook',
                        seconds: parseInt(params.until - params.since)
                    });
                    if (Callback) Callback.call(postsOperation);
                };
                SocialReport.DataInterface.getFacebookPosts(params, FBPostsCallback);
            }
        };


        return SocialReport;
    }();


})($, window, moment, layer);
