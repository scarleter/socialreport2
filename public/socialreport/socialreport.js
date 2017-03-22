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
                    if (resp['paging'] && resp['paging']['next']) {
                        var nextUrl = resp['paging']['next'];
                        SocialReport.DataInterface.ajax({}, {
                            url: nextUrl,
                            context: this,
                            success: success,
                            error: error
                        });
                    } else {
                        callback(this.data);
                    }
                } else {
                    callback(this.data);
                }
            };

            SocialReport.DataInterface.ajax(data, options);
        };

        //temporary function to get facebook reach data before the sever php versin upgrade to 5.4 or above
        DataInterface.getFacebookReach = function (Params, Callback) {

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
                //url: 'https://graph.facebook.com/v2.8/' + params.pageid + '/insights/page_consumptions,page_positive_feedback_by_type,page_fans',
                url: 'https://graph.facebook.com/v2.8/' + params.pageid + '/insights/page_fans',
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
                    if (resp['paging'] && resp['paging']['next']) {
                        var nextUrl = resp['paging']['next'];
                        SocialReport.DataInterface.ajax({}, {
                            url: nextUrl,
                            context: this,
                            success: success,
                            error: error
                        });
                    } else {
                        callback(this.data);
                    }
                } else {
                    callback(this.data);
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
            setDateRangePicker: function () {
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
                this.setDateRangePicker();
            }
        });


        //SocialReport.Select
        //-------------------

        //Select is inherited from View
        //just wrap select component
        var Select = SocialReport.Select = function (Id, Options) {
            this.initialize(Id, Options);
        };
        
        $.extend(Select.prototype, View.prototype, {
            //set dateRangePicker
            setDateRangePicker: function (Object) {
                //set it if `Object` is create by DateRangePicker
                if (Object && Object.constructor === SocialReport.DateRangePicker.constructor) {
                    return this.dateRangePicker = Object;
                } else {
                    Toolbox.assert('Function SocialReport.DataComparePanel.setDateRangePicker: `Object` is undefined or not create by SocialReport.DateRangePicker');
                    return false;
                }
            },

            //get dateRangePicker
            getDateRangePicker: function () {
                return this.dateRangePicker;
            },

            //initialize function
            initialize: function (Id, Options) {
                this.setId(Id);
            }
        });

        //SocialReport.DataComparePanel
        //-----------------------------

        //DataComparePanel contains a DateRangePicker object and a Select object
        //just make DateRangePicker and Select become one class
        var DataComparePanel = SocialReport.DataComparePanel = function (Id, Options) {
            this.initialize(Id, Options);
        };

        $.extend(DataComparePanel.prototype, View.prototype, {
            //set dateRangePicker
            setDateRangePicker: function (Object) {
                //set it if `Object` is create by DateRangePicker
                if (Object && Object.constructor === SocialReport.DateRangePicker.constructor) {
                    return this.dateRangePicker = Object;
                } else {
                    Toolbox.assert('Function SocialReport.DataComparePanel.setDateRangePicker: `Object` is undefined or not create by SocialReport.DateRangePicker');
                    return false;
                }
            },

            //get dateRangePicker
            getDateRangePicker: function () {
                return this.dateRangePicker;
            },

            //initialize function
            initialize: function (Id, Options) {
                this.setId(Id);
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

        //Operatioin is a Abstract Data Type which define a pile of functions to help calculate the date from the Datainterface class before render by view class
        var Operation = SocialReport.Operation = function (Data, Options) {
            this.setData(Data);
            this.setOptions(Options);
            this.setDayRange(Toolbox.secToDay(this.getOptions('seconds')) || 0);
            this.setDataOrigin(this.getOptions('dataOrigin').toLowerCase() || 'facebook');
            var parseFun = this.getOptions('parse');
            parseFun && parseFun.call(this) || this.parse();
        };

        $.extend(Operation.prototype, {
            //parse Data
            parse: function () {
                var dataOrigin = this.getOptions('dataOrigin') || '';
                switch (dataOrigin.toLowerCase()) {
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

            //parse facebook data in json format for further use
            parseFacebookData: function () {
                var parsedPostsData = [],
                    parsedReachData = [],
                    postsData = this.getData('postsData'),
                    reachData = this.getData('reachData'),
                    size = this.getSize();
                //loop to set postsData
                for (var i = 0; i < size; i++) {
                    var obj = {};
                    obj['comments'] = postsData[i]['comments'] ? postsData[i]['comments']['summary']['total_count'] : 0;
                    obj['shares'] = postsData[i]['shares'] ? postsData[i]['shares']['count'] : 0;
                    obj['created_time'] = Toolbox.formatTime(postsData[i]['created_time']) || '';
                    obj['id'] = postsData[i]['id'] || '';
                    obj['message'] = postsData[i]['message'] || '';
                    obj['permalink_url'] = postsData[i]['permalink_url'] || '';
                    obj['type'] = postsData[i]['type'] || '';
                    obj['insights'] = postsData[i]['insights']['data'] || '';
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
                                    //if `type` is video and `key` is photo view or `type` is not video and `key` is video play, skip it
                                    if ((obj['type'] === 'video' && key === 'photo view') || (obj['type'] !== 'video' && key === 'video play')) {
                                        continue;
                                    }
                                    obj[key] = consumptionsObj[key];
                                };
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
                    parsedPostsData[i] = obj;
                }
                //loop to set reachData
                $.each(reachData, function (key, value) {
                    switch (value['name']) {
                        case 'page_fans':
                            parsedReachData['page_fans'] = value['values'];
                            break;
                        default:
                            break;
                    }
                });

                this.setData({
                    postsData: parsedPostsData,
                    reachData: parsedReachData
                });
            },

            //get options
            getOptions: function (AttrName) {
                if (AttrName) {
                    return this.options[AttrName] || undefined;
                }
                return this.options;
            },

            //set options
            setOptions: function (Options) {
                if (!Options) {
                    Toolbox.assert('Function SocialReport.setOptions.setDataOrigin: Options is undefined.');
                    return false;
                } else {
                    this.options = Options;
                }
            },

            //get data origin
            getDataOrigin: function () {
                return this.dataOrigin;
            },

            //set data origin
            setDataOrigin: function (DataOrigin) {
                if (!DataOrigin) {
                    Toolbox.assert('Function SocialReport.Operation.setDataOrigin: DataOrigin is undefined.');
                    return false;
                } else {
                    return this.dataOrigin = DataOrigin;
                }
            },

            //get Data
            getData: function (Attr) {
                if (!!(Attr && typeof Attr === 'string')) {
                    return this.data[Attr];
                }
                return this.data;
            },

            //set Data
            setData: function (Data) {
                if (!Data) {
                    Toolbox.assert('Function SocialReport.Operation.setData: Data is undefined.');
                    return false;
                } else {
                    return this.data = Data;
                }
            },

            //get dateRange
            getDayRange: function () {
                return this.dayRange || 0;
            },

            //set dateRange
            setDayRange: function (DayRange) {
                if (!DayRange) {
                    Toolbox.assert('Function SocialReport.Operation.setDayRange: DayRange is undefined.');
                    return false;
                } else {
                    return this.dayRange = DayRange;
                }
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

            //get standard format data from `TableType` to build datatable
            getFormatDataFromTableType: function (TableType) {
                var dataOrigin = this.getOptions('dataOrigin') || '',
                    tableType = TableType.toLowerCase() || '';
                switch (dataOrigin.toLowerCase()) {
                    case 'facebook':
                        switch (tableType) {
                            case 'postsdata':
                                return this._getPostsDataInFacebook();
                                break;
                            case 'averagepostsdata':
                                return this._getAveragePostsDataInFacebook();
                                break;
                            case 'reachrate':
                                return this._getReachRateInFacebook();
                                break;
                            case 'engagementrate':
                                return this._getEngagementRateInFacebook();
                                break;
                            case 'toplinks':
                                return this._getTopPostsDataInFacebookByType('link', 5);
                                break;
                            case 'topphotos':
                                return this._getTopPostsDataInFacebookByType('photo', 5);
                                break;
                            case 'topvideos':
                                return this._getTopPostsDataInFacebookByType('video', 5);
                                break;
                            default:
                                return this.getData();
                                break;
                        };
                        break;
                    case 'google':
                        //return this._formatDataInGoogle();
                        break;
                    default:
                        return this.getData();
                        break;
                }
            },

            //build facebook postsdata in datatable format
            //return `columnTitle` and `data`
            _getPostsDataInFacebook: function () {
                //set the variable for looping
                var columnTitle = [{
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
                    data = [];
                //get postsdata in 2d array
                data = this._getPostsDataIn2DArray();
                return {
                    data: data,
                    columnTitle: columnTitle
                };
            },

            //build facebook average posts data in datatable format
            //return `columnTitle` and `data`
            _getAveragePostsDataInFacebook: function () {
                //set the variable for looping
                var originData = this.getData('postsData'),
                    dataSize = this.getSize(),
                    columnTitle = [
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
                    ],
                    summary = [],
                    data = [];
                //get the summary of the posts data
                summary = this._getPostsDataSummary();
                //calculate some variable
                var paidReach = parseInt(summary['post_impressions_paid_unique']),
                    totalReach = parseInt(summary['post_impressions_unique']),
                    organicReach = totalReach - paidReach,
                    like = parseInt(summary['like']),
                    share = parseInt(summary['shares']),
                    comment = parseInt(summary['comments']),
                    videoPlay = parseInt(summary['post_video_views']),
                    haha = parseInt(summary['haha']),
                    wow = parseInt(summary['wow']),
                    love = parseInt(summary['love']),
                    sorry = parseInt(summary['sorry']),
                    anger = parseInt(summary['anger']),
                    reaction = (like + love + wow + haha + sorry + anger).toLocaleString() + '&nbsp;&nbsp;(<i class="fa fb_icon fb_like" title="like"></i><span> ' + like.toLocaleString() + '</span> ' + '&nbsp;&nbsp;<i class="fa fb_icon fb_love" title="love"></i><span> ' + love.toLocaleString() + '</span>' + '&nbsp;&nbsp;<i class="fa fb_icon fb_haha" title="haha"></i><span> ' + haha.toLocaleString() + '</span>' + '&nbsp;&nbsp;<i class="fa fb_icon fb_wow" title="wow"></i><span> ' + wow.toLocaleString() + '</span>' + '&nbsp;&nbsp;<i class="fa fb_icon fb_sad" title="sad"></i><span> ' + sorry.toLocaleString() + '</span>' + '&nbsp;&nbsp;<i class="fa fb_icon fb_anger" title="anger"></i><span> ' + anger.toLocaleString() + '</span>)',
                    averageReaction = Math.round((like + love + wow + haha + sorry + anger) / dataSize).toLocaleString() + '&nbsp;&nbsp;(<i class="fa fb_icon fb_like" title="like"></i><span> ' + Math.round(like / dataSize).toLocaleString() + '</span> ' + '&nbsp;&nbsp;<i class="fa fb_icon fb_love" title="love"></i><span> ' + Math.round(love / dataSize).toLocaleString() + '</span>' + '&nbsp;&nbsp;<i class="fa fb_icon fb_haha" title="haha"></i><span> ' + Math.round(haha / dataSize).toLocaleString() + '</span>' + '&nbsp;&nbsp;<i class="fa fb_icon fb_wow" title="wow"></i><span> ' + Math.round(wow / dataSize).toLocaleString() + '</span>' + '&nbsp;&nbsp;<i class="fa fb_icon fb_sad" title="sad"></i><span> ' + Math.round(sorry / dataSize).toLocaleString() + '</span>' + '&nbsp;&nbsp;<i class="fa fb_icon fb_anger" title="anger"></i><span> ' + Math.round(anger / dataSize).toLocaleString() + '</span>)',
                    vieworplays = parseInt(summary['video play']) + parseInt(summary['photo view']),
                    linkclick = parseInt(summary['link clicks']),
                    otherclick = parseInt(summary['other clicks']),
                    postclick = (vieworplays + linkclick + otherclick).toLocaleString() + '&nbsp;&nbsp;(<label>Photo Views & Clicks to Play:</label><span> ' + vieworplays.toLocaleString() + '</span>' + '&nbsp;&nbsp;<label>Link Clicks:</label><span> ' + linkclick.toLocaleString() + '</span>' + '&nbsp;&nbsp;<label>Other Clicks:</label><span> ' + otherclick.toLocaleString() + '</span>)',
                    averagePostclick = Math.round((vieworplays + linkclick + otherclick) / dataSize).toLocaleString() + '&nbsp;&nbsp;(<label>Photo Views & Clicks to Play:</label><span> ' + Math.round(vieworplays / dataSize).toLocaleString() + '</span>' + '&nbsp;&nbsp;<label>Link Clicks:</label><span> ' + Math.round(linkclick / dataSize).toLocaleString() + '</span>' + '&nbsp;&nbsp;<label>Other Clicks:</label><span> ' + Math.round(otherclick / dataSize).toLocaleString() + '</span>)',
                    paidImpression = parseInt(summary['post_impressions_paid']),
                    totalImpression = parseInt(summary['post_impressions']),
                    organicImpression = totalImpression - paidImpression;
                //build the result into data array
                data.push(['Organic Reach(a)', organicReach.toLocaleString(), dataSize.toLocaleString(), Math.round(organicReach / dataSize).toLocaleString()]);
                data.push(['Paid Reach(b)', paidReach.toLocaleString(), dataSize.toLocaleString(), Math.round(paidReach / dataSize).toLocaleString()]);
                data.push(['Total Reached(c)', totalReach.toLocaleString(), dataSize.toLocaleString(), Math.round(totalReach / dataSize).toLocaleString()]);
                data.push(['Like(d)', like.toLocaleString(), dataSize.toLocaleString(), Math.round(like / dataSize).toLocaleString()]);
                data.push(['Share(e)', share.toLocaleString(), dataSize.toLocaleString(), Math.round(share / dataSize).toLocaleString()]);
                data.push(['Comment(f)', comment.toLocaleString(), dataSize.toLocaleString(), Math.round(comment / dataSize).toLocaleString()]);
                data.push(['Video Views(g)', videoPlay.toLocaleString(), dataSize.toLocaleString(), Math.round(videoPlay / dataSize).toLocaleString()]);
                data.push(['Reactions(h)', reaction, dataSize.toLocaleString(), averageReaction]);
                data.push(['Post Clicks(i)', postclick, dataSize.toLocaleString(), averagePostclick]);
                data.push(['Lifetime Post Organic Impressions(j)', organicImpression.toLocaleString(), dataSize.toLocaleString(), Math.round(organicImpression / dataSize).toLocaleString()]);
                data.push(['Lifetime Post Paid Impressions(k)', paidImpression.toLocaleString(), dataSize.toLocaleString(), Math.round(paidImpression / dataSize).toLocaleString()]);
                data.push(['Lifetime Post Total Impressions(l)', totalImpression.toLocaleString(), dataSize.toLocaleString(), Math.round(totalImpression / dataSize).toLocaleString()]);

                return {
                    data: data,
                    columnTitle: columnTitle
                };
            },

            //build facebook reachrate data in datatable format
            //return `columnTitle` and `data`
            _getReachRateInFacebook: function () {
                //set the variable for looping
                var postsData = this.getData('postsData'),
                    reachData = this.getData('reachData'),
                    dataSize = this.getSize(),
                    columnTitle = [
                        {
                            title: ""
                        },
                        {
                            title: "Total Reach"
                        },
                        {
                            title: "Avg Reach"
                        },
                        {
                            title: "Avg Page Fans Like"
                        },
                        {
                            title: "Reach % (Avg Reach/ Avg Fans Like)"
                        }
                    ],
                    summary = [],
                    data = [],
                    totalReach = 0,
                    averageTotalReach = 0,
                    fanLikeSummary = 0,
                    averageFanLikeSummary = 0,
                    reachRate = 0;
                //get the summary of the posts data
                summary = this._getPostsDataSummary();
                totalReach = parseInt(summary['post_impressions_unique']);
                averageTotalReach = Math.round(totalReach / dataSize);
                //get fans likes summary
                $.each(reachData['page_fans'], function (ken, value) {
                    fanLikeSummary = fanLikeSummary + value['value'];
                });
                averageFanLikeSummary = Math.round(fanLikeSummary / this.getDayRange());
                reachRate = (parseFloat(averageTotalReach / averageFanLikeSummary) * 100).toFixed(2) + '%';
                //push in `data`
                data.push(['Data', totalReach.toLocaleString(), averageTotalReach.toLocaleString(), averageFanLikeSummary.toLocaleString(), reachRate]);

                return {
                    data: data,
                    columnTitle: columnTitle
                };
            },

            //build facebook engagementrate data in datatable format
            //return `columnTitle` and `data`
            _getEngagementRateInFacebook: function () {
                //set the variable for looping
                var postsData = this.getData('postsData'),
                    dataSize = this.getSize(),
                    columnTitle = [
                        {
                            title: ""
                        },
                        {
                            title: "Avg Like & Comment & Share"
                        },
                        {
                            title: "Avg Reaction & Post Click"
                        },
                        {
                            title: "Avg Reach"
                        },
                        {
                            title: "Avg Like & Comment & Share / Avg Reach"
                        },
                        {
                            title: "Avg Reaction & Post Click / Avg Reach"
                        }
                    ],
                    summary = [],
                    data = [],
                    likeCommentShareSummary = 0,
                    reactionPostclickSummary = 0,
                    reachSummary = 0,
                    averageLikeCommentShare = 0,
                    averageReactionPostclick = 0,
                    averageReach = 0;
                //get the summary of the posts data
                summary = this._getPostsDataSummary();
                likeCommentShareSummary = summary['like'] + summary['comments'] + summary['shares'];
                reactionPostclickSummary = summary['like'] + summary['love'] + summary['haha'] + summary['wow'] + summary['sorry'] + summary['anger'] + summary['video play'] + summary['photo view'] + summary['link clicks'] + summary['other clicks'];
                reachSummary = summary['post_impressions_unique'];
                averageLikeCommentShare = Math.round(likeCommentShareSummary / dataSize);
                averageReactionPostclick = Math.round(reactionPostclickSummary / dataSize);
                averageReach = Math.round(reachSummary / dataSize);
                //push in `data`
                data.push(['Data', averageLikeCommentShare.toLocaleString(), averageReactionPostclick.toLocaleString(), averageReach.toLocaleString(), (parseFloat(averageLikeCommentShare / averageReach) * 100).toFixed(2) + '%', (parseFloat(averageReactionPostclick / averageReach) * 100).toFixed(2) + '%']);

                return {
                    data: data,
                    columnTitle: columnTitle
                };
            },

            //build facebook top postsdata in datatable format
            //return `columnTitle` and `data`
            _getTopPostsDataInFacebookByType: function (Type, Limit) {
                //set the variable for looping
                var sortedPostsData = this._sortPostsData(),
                    dataSize = this.getSize(),
                    columnTitle = [
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
                    data = [],
                    limit = Limit || 5,
                    type = Type || 'link';
                for (var i = 0; i < dataSize; i++) {
                    //if type suited
                    if (sortedPostsData[i][3] === type) {
                        data.push([sortedPostsData[i][0], sortedPostsData[i][1], sortedPostsData[i][2], sortedPostsData[i][3], sortedPostsData[i][4]]);
                        //when data length reach limit,it should jump out the loop
                        if (data.length >= limit) {
                            break;
                        }
                    }
                }
                return {
                    data: data,
                    columnTitle: columnTitle
                };
            },

            //internal function to get postsData in two dimension array format
            _getPostsDataIn2DArray: function () {
                //set the variable for looping
                var postsData = this.getData('postsData'),
                    dataSize = this.getSize(),
                    data = [];
                //loop to set a two dimension array to get datatable data
                for (var i = 0; i < dataSize; i++) {
                    //some middle variable
                    var arr = [],
                        type = postsData[i]['type'],
                        like = postsData[i]['like'] || 0,
                        love = postsData[i]['love'] || 0,
                        haha = postsData[i]['haha'] || 0,
                        wow = postsData[i]['wow'] || 0,
                        sorry = postsData[i]['sorry'] || 0,
                        anger = postsData[i]['anger'] || 0,
                        reactionsTotal = like + love + haha + wow + sorry + anger,
                        vieworplay = ((type === 'video') ? postsData[i]['video play'] : postsData[i]['photo view']) || 0,
                        linkClick = postsData[i]['link clicks'] || 0,
                        otherClick = postsData[i]['other clicks'] || 0,
                        postsClickTotal = vieworplay + linkClick + otherClick,
                        paidReached = postsData[i]['post_impressions_paid_unique'],
                        totalReached = postsData[i]['post_impressions_unique'],
                        paidImpressions = postsData[i]['post_impressions_paid'],
                        totalImpressions = postsData[i]['post_impressions'];
                    //set data in `arr` in order
                    arr.push(postsData[i]['id']);
                    arr.push('<a href="' + postsData[i]['permalink_url'] + '" target="_blank">' + postsData[i]['permalink_url'] + '</a>');
                    arr.push('<div class="post_message">' + (postsData[i]['message']) + '</div>');
                    arr.push(postsData[i]['type']);
                    arr.push(postsData[i]['created_time']);
                    arr.push((totalReached - paidReached).toLocaleString());
                    arr.push(paidReached.toLocaleString());
                    arr.push(totalReached.toLocaleString());
                    arr.push(postsData[i]['like'].toLocaleString());
                    arr.push(postsData[i]['shares'].toLocaleString());
                    arr.push(postsData[i]['comments'].toLocaleString());
                    arr.push(postsData[i]['post_video_views'].toLocaleString());
                    arr.push('<p><label>' + reactionsTotal.toLocaleString() + '</label></p>' + '<p><i class="fa fb_icon fb_like" title="like"></i><span> ' + like.toLocaleString() + '</span></p> ' + '<p><i class="fa fb_icon fb_love" title="love"></i><span> ' + love.toLocaleString() + '</span></p>' + '<p><i class="fa fb_icon fb_haha" title="haha"></i><span> ' + haha.toLocaleString() + '</span></p>' + '<p><i class="fa fb_icon fb_wow" title="wow"></i><span> ' + wow.toLocaleString() + '</span></p>' + '<p><i class="fa fb_icon fb_sad" title="sad"></i><span> ' + sorry.toLocaleString() + '</span></p>' + '<p><i class="fa fb_icon fb_anger" title="anger"></i><span> ' + anger.toLocaleString() + '</span></p>');

                    arr.push('<p><label>' + postsClickTotal.toLocaleString() + '</label></p>' + '<p><label>' + ((type === 'video') ? 'Clicks to Play:' : 'Photo Views:') + '</label><span> ' + vieworplay.toLocaleString() + '</span></p>' + '<p><label>Link Clicks:</label><span> ' + linkClick.toLocaleString() + '</span></p>' + '<p><label>Other Clicks:</label><span> ' + otherClick.toLocaleString() + '</span></p>');
                    arr.push((totalImpressions - paidImpressions).toLocaleString());
                    arr.push(paidImpressions.toLocaleString());
                    arr.push(totalImpressions.toLocaleString());
                    //push in data array
                    data.push(arr);
                };
                return data;
            },

            //internal function to sort postsData
            _sortPostsData: function (Index) {
                //`Index` is the reference for sorting
                var index = index || 7,
                    originPostsData = this._getPostsDataIn2DArray(),
                    resultPostsData = [];
                resultPostsData = originPostsData.sort(sortByIndex);
                //a sort function for sorting
                function sortByIndex(a, b) {
                    var arrayB = b[index].replace(',', '');
                    var arrayA = a[index].replace(',', '');
                    return arrayB - arrayA;
                };
                return resultPostsData;
            },

            //internal function to get summary of postsData
            _getPostsDataSummary: function () {
                var originData = this.getData('postsData'),
                    dataSize = this.getSize(),
                    summary = [];
                //loop to get the summary of the posts data
                for (var i = 0; i < dataSize; i++) {
                    $.each(originData[i], function (key, value) {
                        //make sure `value` is integer
                        if (!isNaN(value)) {
                            //if summary[key] is not exist 
                            if (typeof summary[key] === 'undefined') {
                                //init it 0
                                summary[key] = 0;
                            }
                            summary[key] = summary[key] + parseInt(value);
                        }
                    });
                }
                return summary;
            },

            //get data size
            getSize: function () {
                var data = this.getData('postsData') || {},
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

            //get facebook operatioin object
            genFacebookOperation: function (Params, Callback) {
                //set facebook request params
                var params = Params || {},
                    data = {};
                //if `params.since` or `params.until` or `params.pageid` or `params.access_token` is 0 console assert the msg and return
                if (!(params.since && params.until && params.pageid && params.access_token)) {
                    SocialReport.Toolbox.assert('Function SocialReport.Facebook.genFacebookOperation: params since or until or pageid or access_token is undefined');
                    return;
                }
                //callback for `getFacebookPosts`
                function FBPostsCallback(resp) {
                    //set `data.postsData`
                    data.postsData = resp;
                    //request to get facebook reach data
                    SocialReport.DataInterface.getFacebookReach(params, FBReachCallback);
                };
                //callback for `getFacebookReach`
                function FBReachCallback(resp) {
                    data.reachData = resp;
                    var facebookOperation = new SocialReport.Operation(data, {
                        dataOrigin: 'facebook',
                        seconds: parseInt(params.until - params.since)
                    });
                    if (Callback) Callback.call(facebookOperation);
                };
                //request to get facebook posts data
                SocialReport.DataInterface.getFacebookPosts(params, FBPostsCallback);
            }
        };


        return SocialReport;
    }();


})($, window, moment, layer);
