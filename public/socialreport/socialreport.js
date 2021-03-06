//SocialReport.js

//It is dependent on jQuery,moment,DataTables(https://datatables.net/),DateRangePicker(http://www.daterangepicker.com/),ChartJs(http://www.chartjs.org/).
//It has some subclassess: Data, vVew, Operation, Toolbox, Facebook
var jQuery = jQuery,
    moment = moment,
    Chart = Chart;

(function ($, window, document, moment, Chart) {
    "use strict";
    window.SocialReport = (function () {
        var SocialReport = {},

            //class Toolbox
            //-------------

            //class to deal with some calculation
            Toolbox = SocialReport.Toolbox = {

                //convert seconds to day
                secToDay: function (Seconds) {
                    var seconds = parseInt(Seconds, 0) || 0;
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
                    window.console.warn(msg);
                    //throw new Error(Msg);
                },

                //check if the Object is Array
                isArray: function (Obj) {
                    var obj = Obj || {};
                    return Object.prototype.toString.call(obj) === '[object Array]';
                },
                
                //check if the object is null
                isNull: function (Obj) {
                    var obj = Obj;
                    return obj === null;
                },
                
                //check if undefined
                isUndefined: function (Obj) {
                    var obj = Obj;
                    return typeof obj === "undefined";
                },
                
                //check if the Object is 2DArray
                is2DArray: function (Arr) {
                    var arr = Arr || {},
                        is2DArray = true,
                        key;
                    if (Toolbox.isArray(arr)) {
                        //check if each element of `arr` is array
                        for (key = 0; key < arr.length; key += 1) {
                            if (!Toolbox.isArray(arr[key])) {
                                is2DArray = false;
                                break;
                            }
                        }
                    }
                    return is2DArray;
                },

                //check if it is a function
                isFunction: function (Obj) {
                    var obj = Obj || {};
                    return typeof obj === 'function';
                },

                //check if it is a Object
                isObject: function (Obj) {
                    var obj = Obj;
                    return obj instanceof Object;
                },

                //check if it is a string object
                isString: function (Str) {
                    var str = Str || {};
                    return typeof str === 'string';
                },

                //check if `Instance` is instance of `Obj`
                //if `Obj` is undefined then check if `Instance` is instance of `Object`
                isInstance: function (Instance, Obj) {
                    var instance = Instance || undefined,
                        obj = Obj || Object;
                    return instance instanceof obj;
                },
                
                //get the Object size
                getObjectSize: function (Obj) {
                    var size = 0,
                        obj = Obj || {},
                        key;
                    //Object.keys could not support under IE9
                    if (!!Object.keys) {
                        size = Object.keys(obj).length;
                    } else {
                        for (key in obj) {
                            if (obj.hasOwnProperty(key)) {
                                size += 1;
                            }
                        }
                    }
                    return size;
                },
                
                //it is a constructor for building an ordered map table
                OrderedMapTable: function () {
                    this.keyList = [];
                    this.mapTable = {};

                    //check if has `Key`
                    this.hasKey = function (Key) {
                        var key = Key || '',
                            hasKey = false;

                        if (this.mapTable.hasOwnProperty(key)) {
                            hasKey = true;
                        }
                        return hasKey;
                    };

                    //add attribute
                    this.add = function (Key, Value) {
                        var key = Key || '',
                            value = Value || '';

                        if (!this.hasKey(key)) {
                            this.keyList.push(key);
                            this.mapTable[key] = value;
                        }
                    };

                    //remove attribute
                    this.remove = function (Key) {
                        var key = Key || '',
                            index;

                        if (this.hasKey(key)) {
                            index = this.keyList.indexOf(key);
                            if (index !== -1) {
                                this.keyList.splice(index, 1);
                            }
                            //this.keyList.push(key);
                            delete this.mapTable[key];
                        }
                    };

                    //get attribute
                    this.getAttribute = function (Key) {
                        var key = Key || '';
                        return this.mapTable[key];
                    };

                    //set attribute
                    this.setAttribute = function (Key, Value) {
                        var key = Key || '',
                            value = Value || '';

                        if (this.hasKey(key)) {
                            this.mapTable[key] = value;
                        }
                    };
                    
                    //Iterator should be a function like function(key, value){}
                    this.map = function (Iterator, Context) {
                        if (!Toolbox.isFunction(Iterator)) {
                            Toolbox.assert('Function SocialReport.Toolbox.OrderedMapTable.each: `Iterator` is not a function');
                            return false;
                        }

                        var index,
                            keyList = this.keyList,
                            mapTable = this.mapTable,
                            iterator = Iterator,
                            context = Context || [];

                        for (index = 0; index < keyList.length; index += 1) {
                            iterator.call(this, keyList[index], mapTable[keyList[index]], context);
                        }
                    };
                }
            },


            //SocialReport.DataInterface
            //--------------------------

            //DataInterface class is designed to get the facebook and google data by ajax.
            DataInterface = SocialReport.DataInterface = {
                //url for get data from server
                url: '',

                //wrap ajax
                ajax: function (Data, Options) {
                    //set `success` function
                    var success = function (resp) {
                            //if `Options.success` exists call it
                            if (Options.success) {
                                //if `Options.context` exists use function.prototype.call to call `Options.success`
                                if (Options.context) {
                                    Options.success.call(Options.context, resp);
                                } else {
                                    Options.success(resp);
                                }
                            }
                        },

                        //set `error` function
                        error = function (resp) {
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

                    $.ajax({
                        url: Options.url,
                        type: Options.type || 'GET',
                        data: Data,
                        dataType: Options.datatype || 'json',
                        success: success,
                        error: error
                    });
                },

                //get data from server by ajax.
                get: function (Data, Options) {
                    DataInterface.ajax(Data, Options || '');
                },

                //post data to server by ajax.
                post: function (Data, Options) {
                    DataInterface.ajax(Data, Options || '');
                },

                //update the whole data to server.
                put: function (Data, Options) {
                    //use DataInterface.post for now, do not figure out the best way to simulate RESTful api.
                    DataInterface.post(Data, Options);
                },

                //update the property of data to server.
                patch: function (Data, Options) {
                    //use DataInterface.post for now, do not figure out the best way to simulate RESTful api.
                    DataInterface.post(Data, Options);
                },

                //delete data from server by ajax simulate RESTful api.
                destroy: function (Data, Options) {
                    //use DataInterface.post for now, do not figure out the best way to simulate RESTful api.
                    DataInterface.post(Data, Options);
                },

                //temporary function to get facebook posts data before the sever php versin upgrade to 5.4 or above
                getFacebookPosts: function (Params, Callback, FBErrorCallback) {

                    var params = Params || {},
                        data = {
                            since: params.since || '',
                            until: params.until || '',
                            access_token: params.access_token || '',
                            limit: params.limit || 100
                        },
                        options = {},
                        result = {
                            data: [],
                            error: {
                                facebookPostsRequestError: '',
                                facebookReachRequestError: '',
                                facebookFanpageRequestError: ''
                            }
                        },
                        error = '',
                        success = '',
                        callback = (Toolbox.isFunction(Callback) && Callback) || Toolbox.assert('Function DataInterface.getFacebookPosts: `Callback` is undefined');

                    //if `data.since` or `data.until` or `data.access_token` or `params.pageid` is empty return `result`
                    if (!(data.since && data.until && data.access_token && params.pageid)) {
                        return result.data;
                    }
                    options = {
                        url: 'https://graph.facebook.com/v2.8/' + params.pageid + '/posts?fields=id,admin_creator,permalink_url,message,type,created_time,insights.metric(post_impressions_organic,post_impressions_by_story_type,post_impressions_paid,post_impressions,post_impressions_unique,post_impressions_paid_unique,post_reactions_by_type_total,post_consumptions_by_type,post_video_views),shares,comments.limit(0).summary(1)',
                        context: result
                    };

                    //set the `options.error`
                    error = options.error = function (resp) {
                        //make sure `FBErrorCallback` is an exist function
                        if (Toolbox.isFunction(FBErrorCallback)) {
                            this.error.facebookPostsRequestError = resp;
                            FBErrorCallback.call(this, this.error);
                        }
                        //Toolbox.assert('Function DataInterface.getFacebookPosts go to error branch: msg is ' + resp);
                    };
                    //set the `options.success`
                    success = options.success = function (resp) {
                        if (resp.data) {
                            this.data = this.data.concat(resp.data);
                            if (resp.paging && resp.paging.next) {
                                var nextUrl = resp.paging.next;
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
                },

                //temporary function to get facebook reach data before the sever php versin upgrade to 5.4 or above
                getFacebookReach: function (Params, Callback, FBErrorCallback) {

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
                        callback = (Toolbox.isFunction(Callback) && Callback) || Toolbox.assert('Function DataInterface.getFacebookReach: `Callback` is undefined');

                    //if `data.since` or `data.until` or `data.access_token` or `params.pageid` is empty return `result`
                    if (!(data.since && data.until && data.access_token && params.pageid)) {
                        return result.data;
                    }
                    options = {
                        //url: 'https://graph.facebook.com/v2.8/' + params.pageid + '/insights/page_consumptions,page_positive_feedback_by_type,page_fans',
                        url: 'https://graph.facebook.com/v2.8/' + params.pageid + '/insights/page_fans',
                        context: result
                    };

                    //set the `options.error`
                    error = options.error = function (resp) {
                        //make sure `FBErrorCallback` is an exist function
                        if (Toolbox.isFunction(FBErrorCallback)) {
                            this.error.facebookReachRequestError = resp;
                            FBErrorCallback.call(this, this.error);
                        }
                        //Toolbox.assert('Function DataInterface.getFacebookReach go to error branch: msg is ' + resp);
                    };
                    //set the `options.success`
                    success = options.success = function (resp) {
                        if (resp.data) {
                            this.data = this.data.concat(resp.data);
//                            if (resp.paging && resp.paging.next) {
//                                var nextUrl = resp.paging.next;
//                                SocialReport.DataInterface.ajax({}, {
//                                    url: nextUrl,
//                                    context: this,
//                                    success: success,
//                                    error: error
//                                });
//                            } else {
                            callback(this.data);
//                            }
                        } else {
                            callback(this.data);
                        }
                    };

                    SocialReport.DataInterface.ajax(data, options);
                },
                
                //get facebook fanpage id,name,picture,fan_count and engagement
                getFacebookFanpageInfo: function (Params, Callback, FBErrorCallback) {
                    var params = Params || {},
                        data = {
                            access_token: params.access_token || ''
                        },
                        options = {},
                        result = {
                            data: []
                        },
                        error = '',
                        success = '',
                        callback = (Toolbox.isFunction(Callback) && Callback) || Toolbox.assert('Function DataInterface.getFacebookFanpageInfo: `Callback` is undefined');
                    //if `data.since` or `data.until` or `data.access_token` or `params.pageid` is empty return `result`
                    if (!(params.since && params.until && data.access_token && params.pageid)) {
                        return result.data;
                    }
                    options = {
                        //url: 'https://graph.facebook.com/v2.8/' + params.pageid + '/insights/page_consumptions,page_positive_feedback_by_type,page_fans',
                        url: 'https://graph.facebook.com/v2.8/' + params.pageid + '/?fields=id,picture,name,fan_count,posts.limit(100).since(' + params.since + ').until(' + params.until + '){created_time,id,shares,comments.limit(0).summary(1),reactions.type(LOVE).limit(0).summary(1),likes.limit(0).summary(1)}',
                        context: result
                    };
                    //set the `options.error`
                    error = options.error = function (resp) {
                        //make sure `FBErrorCallback` is an exist function
                        if (Toolbox.isFunction(FBErrorCallback)) {
                            this.error.facebookFanpageRequestError = resp;
                            FBErrorCallback.call(this, this.error);
                        }
                        //Toolbox.assert('Function DataInterface.getFacebookFanpageInfo go to error branch: msg is ' + resp);
                    };
                    //set the `options.success`
                    success = options.success = function (resp) {
                        if (resp) {
                            //if resp has data attribute,it means this is the next data
                            if (resp.data) {
                                //when data is not null
                                if (resp.data.length !== 0) {
                                    this.data[0].posts.data = this.data[0].posts.data.concat(resp.data);
                                }
                            } else {
                                this.data = this.data.concat(resp);
                            }
                            if (resp.posts && resp.posts.paging && resp.posts.paging.next) {
                                var nextUrl = resp.posts.paging.next;
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
                }
            },
            
            
            //SocialReport.Event
            //------------------
            
            //By extending `Event` class, View's subclass can use Event api to manage its event
            Event = SocialReport.Event = function () {

            },
            
            
            //SocialReport.ComponentCombiner
            //------------------------------
            
            //it just combined several View's subclass into one
            ComponentCombiner = SocialReport.ComponentCombiner = function (Components, Options) {
                //make sure all instance has their `componentsList` instead of using the componentsList in ComponentCombiner prototype
                this.componentsList = {};
                this.initialize(Components, Options);
            },


            //SocialReport.View
            //-----------------

            //View class is an Abstract Data Type which inherit from Event
            View = SocialReport.View = function () {

            },


            //SocialReport.DateRangePicker
            //----------------------------

            //DateRangePicker is inherited from View and Event
            //It a dateRangePicker ui component (http://www.daterangepicker.com/)
            DateRangePicker = SocialReport.DateRangePicker = function (Id, Options) {
                //make sure all instance has their `selfListeners` instead of using the selfListeners in Event prototype 
                this.selfListeners = {};
                this.initialize(Id, Options);
            },


            //SocialReport.Select
            //-------------------

            //Select is inherited from View and Event
            //just wrap select component
            Select = SocialReport.Select = function (Id, Options) {
                //make sure all instance has their `selfListeners` instead of using the selfListeners in Event prototype 
                this.selfListeners = {};
                this.initialize(Id, Options);
            },
            
            
            //SocialReport.SearchBox
            //----------------------

            //SearchBox is inherited from View and Event
            //it containe a input and submit button
            SearchBox = SocialReport.SearchBox = function (Id, Options) {
                //make sure all instance has their `selfListeners` instead of using the selfListeners in Event prototype 
                this.selfListeners = {};
                this.initialize(Id, Options);
            },
            
            
            //SocialReport.Panel
            //------------------
            
            //it inherit from View and has a ComponentCombiner instance
            //it is an abstract object
            Panel = SocialReport.Panel = function (Id, Options) {
                //make sure all instance has their `selfListeners` instead of using the selfListeners in Event prototype 
                this.selfListeners = {};
                this.initialize(Id, Options);
            },


            //SocialReport.DateRangePickerSelectorPanel
            //-----------------------------------------

            //DateRangePickerSelectorPanel contains a DateRangePicker object and a Select object
            //just make DateRangePicker and Select become one class
            DateRangePickerSelectorPanel = SocialReport.DateRangePickerSelectorPanel = function (Id, Options) {
                this.initialize(Id, Options);
            },


            //SocialReport.DataTables
            //-----------------------

            //DataTables is inherited from View
            //It is a DataTables ui component (https://datatables.net/)
            //temporary add `Options` for further useage
            DataTables = SocialReport.DataTables = function (Id, TableData, TableAttrs, Options) {
                //make sure all instance has their `selfListeners` instead of using the selfListeners in Event prototype 
                this.selfListeners = {};
                this.initialize(Id, TableData, TableAttrs, Options);
            },
            
            
            //SocialReport.LineChart
            //-----------------------

            //LineChart is inherited from View
            //It is a LineChart ui component (http://www.chartjs.org/docs/#line-chart)
            //`LineChartData` is an object contain three attributes: labelsArr, websiteDataArr and competitorDataArr
            //`LineChartOptions` is an object to edit LineChart default LineChartOptions
            LineChart = SocialReport.LineChart = function (Id, LineChartData, LineChartOptions, Options) {
                //make sure all instance has their `selfListeners` instead of using the selfListeners in Event prototype 
                this.selfListeners = {};
                this.initialize(Id, LineChartData, LineChartOptions, Options);
            },


            //SocialReport.Operation
            //----------------------

            //Operatioin is a Abstract Data Type which define a pile of functions to help calculate the date from the Datainterface class before render by view class
            Operation = SocialReport.Operation = function (Data, Options) {
                this.setData(Data);
                this.setOptions(Options);
                this.setDayRange(Toolbox.secToDay(this.getOptions('seconds')) || 0);
                this.setDataOrigin(this.getOptions('dataOrigin').toLowerCase() || 'facebook');
                var parseFun = this.getOptions('parse') || this.parse;
                parseFun.call(this);
            },
            
            
            //class Facebook
            //--------------

            //Facebook class contain function relative facebook
            Facebook = SocialReport.Facebook = {

                //get facebook operatioin object, `FBErrorCallback` is an object contain all facebook request(getFacebookPosts, getFacebookReach and getFacebookFanpageInfo) error
                genFacebookOperation: function (Params, Callback, FBErrorCallback) {
                    //set facebook request params
                    var params = Params || {},
                        data = {};
                    //if `params.since` or `params.until` or `params.pageid` or `params.access_token` is 0 console assert the msg and return
                    if (!(params.since && params.until && params.pageid && params.access_token)) {
                        SocialReport.Toolbox.assert('Function SocialReport.Facebook.genFacebookOperation: params since or until or pageid or access_token is undefined');
                        return;
                    }
                    //callback for `getFacebookFanpageInfo`
                    function FBFanpageCallback(resp) {
                        data.fanpageData = resp;
                        var facebookOperation = new SocialReport.Operation(data, {
                            dataOrigin: 'facebook',
                            seconds: parseInt(params.until - params.since, 0),
                            dateStart: params.dataStart,
                            dateEnd: params.dateEnd
                        });
                        if (Callback) {
                            Callback.call(facebookOperation);
                        }
                    }
                    //callback for `getFacebookReach`
                    function FBReachCallback(resp) {
                        data.reachData = resp;
                        //request to get FacebookFanpageInfo
                        SocialReport.DataInterface.getFacebookFanpageInfo(params, FBFanpageCallback, FBErrorCallback);
                    }
                    //callback for `getFacebookPosts`
                    function FBPostsCallback(resp) {
                        //set `data.postsData`
                        data.postsData = resp;
                        //request to get facebook reach data
                        SocialReport.DataInterface.getFacebookReach(params, FBReachCallback, FBErrorCallback);
                    }
                    //request to get facebook posts data
                    SocialReport.DataInterface.getFacebookPosts(params, FBPostsCallback, FBErrorCallback);
                },
                
                //get pagesToWatch list data
                //return labelArr and dataArr for building dataTable
                genPagesToWatchListData: function (Params, Callback) {
                    //set facebook request params
                    var params = Params || {},
                        pageParams = {},
                        data = {},
                        pageid = '',
                        facebookOperationList = [],
                        errorRequestNum = 0;
                    //if `params.since` or `params.until` or `params.pageidList` or `params.access_token` is 0 console assert the msg and return
                    if (!(params.since && params.until && params.pageidList && params.access_token)) {
                        SocialReport.Toolbox.assert('Function SocialReport.Facebook.genPagesToWatchListData: params since or until or pageidList or access_token is undefined');
                        return;
                    }
                    //set the true request data object for each fanpage
                    pageParams = {
                        since: params.since,
                        until: params.until,
                        access_token: params.access_token
                    };

                    //check if all request is done
                    function isRequestAllDone() {
                        var normalOperationSize = Toolbox.getObjectSize(params.pageidList),
                            acturalOperationSize = facebookOperationList.length;
                        if (parseInt((acturalOperationSize + errorRequestNum), 0) === normalOperationSize) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                    //build all fanpage data to dataTable format
                    //return labelArr and dataArr
                    function buildFanpageData() {
                        var operationList = facebookOperationList,
                            //postsData = this.getData('postsData'),
                            labelArr = [
                                {
                                    title: "Page"
                                },
                                {
                                    title: "Total Page Likes"
                                },
                                {
                                    title: "Posts This Week"
                                },
                                {
                                    title: "Engagement This Week"
                                }],
                            dataArr = [],
                            operationKey = '',
                            operation = '',
                            fanpageData = [];
                        //loop to set dataArr
                        for (operationKey in operationList) {
                            if (operationList.hasOwnProperty(operationKey)) {
                                operation = operationList[operationKey];
                                //reset `fanpageData` for next fanpage
                                fanpageData = [];
                                fanpageData.push('<div class="pageContainer ' + operation.getData('fanpageData').id + '"><img src="' + operation.getData('fanpageData').picture_src + '"><label>' + operation.getData('fanpageData').name + '</label></div>');
                                fanpageData.push(Math.round(operation.getData('fanpageData').fan_count).toLocaleString());
                                fanpageData.push(Math.round(operation.getData('fanpageData').postSize).toLocaleString());
                                fanpageData.push(Math.round(operation.getData('fanpageData').engagement).toLocaleString());
                                dataArr.push(fanpageData);
                            }
                        }

                        if (Callback) {
                            Callback.call(facebookOperationList, labelArr, dataArr);
                        }
                    }

                    //call this function after each request fanpage data
                    //save this fanpage operation in the `faceboookOperation`
                    function FBDataCallback() {
                        var faceboookOperation = this;
                        facebookOperationList.push(faceboookOperation);
                        if (isRequestAllDone()) {
                            buildFanpageData();
                        }
                    }
                    
                    //an request error call back function, the parameter is an error object
                    function FBErrorCallback(Error) {
                        var errorPageId = $.trim(Error.facebookPostsRequestError.responseJSON.error.message.split(':')[1]);
                        Toolbox.assert(errorPageId + ' is not a corret page id in facebook, so we can not show facebook data of ' + errorPageId);
                        errorRequestNum += 1;
                        if (isRequestAllDone()) {
                            buildFanpageData();
                        }
                    }

                    //loop to get all fanpage facebook data
                    for (pageid in params.pageidList) {
                        if (params.pageidList.hasOwnProperty(pageid)) {
                            //use asynchronous to get facebook data(posts and reach) and put the follow steps in the callback function such as `buildTable`.
                            Facebook.genFacebookOperation($.extend({}, pageParams, {
                                'pageid': pageid
                            }), FBDataCallback, FBErrorCallback);
                        }
                    }
                }
            },
        
            //class GoogleAnalytics
            //---------------------

            //GoogleAnalytics class contain function relative Google Analytics and google.visualization.linechart
            //need to use GoogleAnalytics.ready to load google script and get google authorize before use other google method
            GoogleAnalytics = SocialReport.GoogleAnalytics = {
                //load google script and get authorize asynchronously
                ready: function (AccessToken, Callback) {
                    var googleAnalytic = this;
                    //make sure `AccessToken` is exist and `Callback` is a function
                    if (!AccessToken || !Toolbox.isFunction(Callback)) {
                        Toolbox.assert('Function SocialReport.Google.ready: `AccessToken` is undefined or `Callback` is not a function');
                        return false;
                    }
                    
                    //load google script
                    this.loadGoogleScript(function () {
                        //get google authorize
                        window.gapi.analytics.auth.authorize({
                            serverAuth: {
                                access_token: AccessToken
                            }
                        });
                        //finally after all is done we call `Callback`
                        Callback.call(googleAnalytic);
                    });
                },

                //load google script
                loadGoogleScript: function (Callback) {
                    //make sure `Callback` is a function
                    if (!Toolbox.isFunction(Callback)) {
                        Toolbox.assert('Function SocialReport.Google.loadGoogleScript: `Callback` is not a function');
                        return false;
                    }
                    //load google script
                    $.getScript('https://www.google.com/jsapi', function () {
                        $.getScript('https://www.gstatic.com/charts/loader.js', function () {
                            (function (w, d, s, g, js, fs) {
                                if (w.gapi) {
                                    g = w.gapi;
                                } else {
                                    g = w.gapi = {};
                                }
                                //g = w.gapi || (w.gapi = {});
                                g.analytics = {
                                    q: [],
                                    ready: function (f) {
                                        this.q.push(f);
                                    }
                                };
                                js = d.createElement(s);
                                fs = d.getElementsByTagName(s)[0];
                                js.src = 'https://apis.google.com/js/platform.js';
                                fs.parentNode.insertBefore(js, fs);
                                js.onload = function () {
                                    g.load('analytics');
                                };
                            }(window, document, 'script'));

                            //when google analytics is ready
                            window.gapi.analytics.ready(function () {
                                //load something for visualization linechart 
                                window.google.charts.load('current', {
                                    packages: ['corechart', 'line']
                                });
                                //after google script all loaded, get google authorize and load packages for visualization linechart, we call the Callback function
                                window.google.charts.setOnLoadCallback(function () {
                                    //after all google script is loaded
                                    Callback.call();
                                });
                            });
                        });
                    });
                },
                
                //a method to get google analytics data
                getGoogleAnalyticsData: function (Params, Callback) {
                    var params = $.extend({}, {
                        'start-date': moment().subtract(6, 'days').format("YYYY-MM-DD"),
                        'end-date': moment().format("YYYY-MM-DD")
                    }, Params);
                    //make sure `Params` is valid and `Callback` is a function
                    if (!params.ids || !params.metrics || !params.dimensions || !Toolbox.isFunction(Callback)) {
                        Toolbox.assert('Function SocialReport.GoogleAnalytics.getGoogleAnalyticsData: `Params` is invalid or `Callback` is not a function');
                        return false;
                    }
                    window.gapi.client.analytics.data.ga.get(params).execute(function (resp) {
                        Callback.call(GoogleAnalytics, resp);
                    });
                },
                
                // a method to draw line chart use google visualization api
                //lineChart in google visualization api(https://developers.google.com/chart/interactive/docs/gallery/linechart#data-format)
                drawLineChartByGoogleVisualization: function (Id, ChartData, Optioins) {
                    //make sure `Id` exist and `ChartData.rowData` is an array(in face it shoud be 2D array)
                    if (!Id || !ChartData || !Toolbox.isArray(ChartData.rowData) || !Toolbox.isArray(ChartData.columnData)) {
                        Toolbox.assert('Function SocialReport.GoogleAnalytics.drawLineChartByGoogleVisualization: `Id` is undefined or `ChartData.rowData` is not an array` or `ChartData.columnData` is not an array');
                        return false;
                    }

                    var data = new window.google.visualization.DataTable(),
                        chart,
                        columnDataKey,
                        formaterForToolTip,
                        formaterForToolTipSaver = [],
                        formaterForToolTipSaverKey,
                        columnIndex,
                        option = $.extend({}, {
                            width: '100%',
                            height: 300,
                            chartArea: {
                                width: '100%'
                            },
                            hAxis: {
                                format: 'yyyy-MM-dd',
                                gridlines: {
                                    color: 'transparent'
                                }
                            },
                            vAxis: {
                                gridlines: {
                                    color: 'transparent'
                                }
                            },
                            colors: ['#058DC7'],
                            lineWidth: 4,
                            pointsVisible: true,
                            legend: {
                                position: 'top',
                                textStyle: {
                                    fontSize: 12
                                }
                            }
                        }, Optioins || {});
                    //loop columnData
                    for (columnDataKey in ChartData.columnData) {
                        if (ChartData.columnData.hasOwnProperty(columnDataKey)) {
                            data.addColumn(ChartData.columnData[columnDataKey].type, ChartData.columnData[columnDataKey].name);
                            //if columnData has pattern attribute, we will use it to format tooltip
                            if (ChartData.columnData[columnDataKey].pattern) {
                                //create a formater by patter
                                formaterForToolTip = new window.google.visualization.DateFormat({
                                    pattern: ChartData.columnData[columnDataKey].pattern
                                });
                                //save the formater and the index of column. loop to format after data has been all set
                                formaterForToolTipSaver.push({
                                    formater: formaterForToolTip,
                                    index: columnDataKey
                                });
                            }
                        }
                    }
                    //set rowData
                    data.addRows(ChartData.rowData);
                    //format tooltip if we do have formater 
                    for (formaterForToolTipSaverKey in formaterForToolTipSaver) {
                        if (formaterForToolTipSaver.hasOwnProperty(formaterForToolTipSaverKey)) {
                            formaterForToolTip = formaterForToolTipSaver[formaterForToolTipSaverKey].formater;
                            columnIndex = formaterForToolTipSaver[formaterForToolTipSaverKey].index;
                            formaterForToolTip.format(data, parseInt(columnIndex, 0));
                        }
                    }
                    //finally draw linechart
                    chart = new window.google.visualization.LineChart(document.getElementById(Id));
                    chart.draw(data, option);
                }
            };
        
        //extend Event class prototype object
        $.extend(Event.prototype, {
            //an internal object to save different type of listeners, subclass should overwrite it 
            selfListeners: {},
            
            //default event handler
            //use it when `EventHandler` is not a function when addEvent
            defaultEventHandler: function () {
                
            },

            //check if event named `EventName` exist
            hasEvent: function (EventName) {
                if (Toolbox.isString(EventName)) {
                    return typeof (this.selfListeners[EventName]) !== 'undefined';
                } else {
                    Toolbox.assert('Function SocialReport.Event.hasEvent: `EventName` is not a string');
                    return false;
                }
            },

            //internal function to create event in `selfListeners`
            createEvent: function (EventName) {
                //check if `EventName` is valid and make sure this event does not exist
                if (Toolbox.isString(EventName) && !this.hasEvent(EventName)) {
                    this.selfListeners[EventName] = [];
                    return this.selfListeners[EventName];
                } else {
                    Toolbox.assert('Function SocialReport.Event.createEvent: `EventName` is not a string or already exist');
                    return false;
                }
            },

            //internal function to delete event name `EventName` in `selfListeners`
            deleteEvent: function (EventName) {
                //check if `EventName` is valid
                if (Toolbox.isString(EventName) && this.hasEvent(EventName)) {
                    delete this.selfListeners[EventName];
                } else {
                    Toolbox.assert('Function SocialReport.Event.deleteEvent: `EventName` is not a string or does not exist');
                    return false;
                }
            },
            
            //internal function to delete handler in event name `EventName`
            deleteHandlerInEvent: function (EventName, EventHandler) {
                var handlersArray,
                    handlerKey;

                //make `EventName` and `EventHandler` is valid and event name `EventName` exist
                if (Toolbox.isString(EventName) && this.hasEvent(EventName) && Toolbox.isFunction(EventHandler)) {
                    handlersArray = this.selfListeners[EventName];
                    //loop to search handler match `EventHandler` then delete it
                    for (handlerKey = 0; handlerKey < handlersArray.length; handlerKey += 1) {
                        if (EventHandler === handlersArray[handlerKey]) {
                            this.selfListeners[EventName].splice(handlerKey, 1);
                            break;
                        }
                    }
                } else {
                    Toolbox.assert('Function SocialReport.Event.deleteHandlerInEvent: `EventName` is not a string or does not exist or `EventHandler` is not a function');
                    return false;
                }
            },
            
            //internal function to get handler from event
            getHandlersFromEvent: function (EventName) {
                if (Toolbox.isString(EventName) && this.hasEvent(EventName)) {
                    return this.selfListeners[EventName];
                }
            },
            
            //internal function to set handler to event
            setHandlerFromEvent: function (EventName, EventHandler) {
                var defaultEventHandler = this.defaultEventHandler,
                    eventHandler = (Toolbox.isFunction(EventHandler)) ? EventHandler : defaultEventHandler;
                if (Toolbox.isString(EventName)) {
                    //if do not have event named `EventName`
                    if (!this.hasEvent(EventName)) {
                        this.createEvent(EventName);
                    }
                    this.selfListeners[EventName].push(eventHandler);
                } else {
                    Toolbox.assert('Function SocialReport.Event.setHandlerFromEvent: `EventName` is not a string');
                    return false;
                }
            },

            //add event name `EventName` in `selfListeners`
            addEvent: function (EventName, EventHandler) {
                this.setHandlerFromEvent(EventName, EventHandler);
            },

            //remove event from `EventName` event
            //if `EventHandler` is a function we will remove the matched handler in event
            removeEvent: function (EventName, EventHandler) {
                if (Toolbox.isFunction(EventHandler)) {
                    this.deleteHandlerInEvent(EventName, EventHandler);
                } else {
                    this.deleteEvent(EventName);
                }
            },
            
            //trigger event
            triggerEvent: function (EventName, Context) {
                var handlersArray = this.getHandlersFromEvent(EventName),
                    handlerKey,
                    paramsArray = Array.prototype.slice.call(arguments, 2);  //get the other parameters except `EventName` and `context`

                //check if parameter is valid and `EventName` event exist
                if (Toolbox.isString(EventName) && this.hasEvent(EventName)) {
                    //loop to apply handler in the event name `EventName`
                    for (handlerKey = 0; handlerKey < handlersArray.length; handlerKey += 1) {
                        handlersArray[handlerKey].apply(Context, paramsArray);
                    }
                } else {
                    Toolbox.assert('Function SocialReport.Event.triggerEvent: `EventName` is not a string or event does not exist');
                    return false;
                }
            }
        });
        
        //extend ComponentCombiner class prototype object
        $.extend(ComponentCombiner.prototype, {
            
            //`componentsList` is an object to save all component
            componentsList: {},

            //get component from componentsList
            getComponent: function (ComponentId) {
                //if `ComponentId` is undefined, we return the whole `componentsList`
                if (!ComponentId) {
                    return this.componentsList;
                } else {
                    return this.componentsList[ComponentId];
                }
            },
            
            //set components into componentsList
            setComponent: function (Components) {
                var componentsArray = Components,
                    componentKey,
                    component,
                    componentId;

                //make sure `componentsArray` is an array
                if (!Toolbox.isArray(componentsArray)) {
                    componentsArray = [Components];
                }
                
                //loop to set components into `componentsList`
                for (componentKey in componentsArray) {
                    if (componentsArray.hasOwnProperty(componentKey)) {
                        component = componentsArray[componentKey];
                        //check if this component has getId function
                        if (typeof (componentsArray[componentKey].getId) !== 'undefined') {
                            componentId = componentsArray[componentKey].getId();
                            this.componentsList[componentId] = component;
                        } else {
                            Toolbox.assert('Function SocialReport.Panel.setComponent: ' + component + ' whose Id is ' + componentId + ' does not have getId function');
                            return false;
                        }
                    }
                }
            },
            
            //initialize 
            //`Components` should be an array
            initialize: function (Components, Options) {
                this.setComponent(Components);
            }
        });

        //extend View class prototype object
        $.extend(View.prototype, Event.prototype, {
            //set `id`
            setId: function (Id) {
                //if `Id` is not undefined and not in de existInIdList then set to `this.id`
                if (Id && !this.existInIdList(Id)) {
                    this.id = Id;
                    this.insertInIdList();
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
            idList: {},

            //internal function check `id` exist in `idList`
            existInIdList: function () {
                var id = this.getId();
                return !!this.idList[id];
            },

            //insert `id` in `idList`
            insertInIdList: function () {
                var id = this.getId();
                this.idList[id] = true;
                return this.idList[id];
            },

            //delete `id` in `idList`
            deleteInIdList: function () {
                var id = this.getId();
                this.idList[id] = false;
                return !this.idList[id];
            },

            //template
            templateInArray: [],

            //set template
            setTemplate: function (Template) {
                var template = Template || '';
                if (Toolbox.isArray(template)) {
                    this.templateInArray = template;
                    return this.templateInArray;
                } else {
                    Toolbox.assert('Function SocialReport.View.setTemplate: `template` is empty or not a array');
                    return false;
                }
            },

            //get template
            getTemplate: function () {
                return this.templateInArray;
            },


            //initialize
            initialize: function () {

            },

            //render
            render: function () {

            }
        });

        //extend DateRangePicker class prototype object
        $.extend(DateRangePicker.prototype, View.prototype, {

            //set start time in `Moment` object
            setStart: function (Moment) {
                if (Toolbox.isInstance(Moment, moment)) {
                    this.start = Moment;
                    return this.start;
                } else {
                    Toolbox.assert('Function SocialReport.DateRangePicker.setStart: `Moment` is undefined or is invalid (need to be constructor by moment');
                    return false;
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

            //set end time in `Moment` object
            setEnd: function (Moment) {
                if (Toolbox.isInstance(Moment, moment)) {
                    this.end = Moment;
                    return this.end;
                } else {
                    Toolbox.assert('Function SocialReport.DateRangePicker.setEnd: `Moment` is undefined or is invalid (need to be constructor by moment');
                    return false;
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

            //wrap user's change handler to generate dateRangePicker change handler
            genDateRangePickerHandler: function () {
                var context = this,
                    id = this.getId(),
                    $obj = $('#' + id);

                return function (Start, End) {
                    //set current `start` and `end`
                    context.setStart(Start);
                    context.setEnd(End);
                    //change the content of the daterangepicker
                    $obj.find('span').html(context.getDateRangeInText());
                    //trigger change event
                    context.triggerEvent('change', context, context.getStart(), context.getEnd());
                };
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
                var context = this,
                    id = this.getId(),
                    $obj = $('#' + id),
                    start = this.getStart(),
                    end = this.getEnd(),
                    handler = this.genDateRangePickerHandler();
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
                }, handler);
            },

            //trigger dateRangepicker change event
            triggerChangeEvent: function () {
                var handler = this.genDateRangePickerHandler(),
                    start = this.getStart(),
                    end = this.getEnd();
                handler(start, end);
                return this;
            },

            //convert dateRange in text format
            getDateRangeInText: function () {
                return this.getStart('MMMM D, YYYY') + ' - ' + this.getEnd('MMMM D, YYYY');
            },

            //convert dateRange in day format
            getRangeInDay: function () {
                return Toolbox.secToDay((this.getEnd("x") - this.getStart("x")) / 1000);
            },

            //initialize the element obj
            initialize: function (Id, Options) {
                Options = (typeof (Options) !== 'undefined') ? Options : {};
                this.setId(Id);
                this.setStart(Options.start || moment().subtract(6, 'days').hours(0).minutes(0).seconds(0));
                this.setEnd(Options.end || moment().hours(23).minutes(59).seconds(59));
                this.addEvent('change', Options.changeHandler);
                this.setTemplate(['<button type="button" class="btn btn-default pull-right" id="', '%ID%', '"><span><i class="fa fa-calendar"></i> Date range picker</span><i class="fa fa-caret-down"></i></button>']);
                this.render();
                this.setDateRangePicker();
            }
        });

        //extend Select class Prototype object
        $.extend(Select.prototype, View.prototype, {
            //set selectOption
            setSelectOption: function (Obj) {
                //make sure `Obj` is object
                if (Toolbox.isInstance(Obj, Object)) {
                    this.selectOpion = Obj;
                    return this.selectOpion;
                } else {
                    Toolbox.assert('Function SocialReport.Select.setSelectOption: `Obj` is undefined or not a object');
                    return false;
                }
            },

            //get selectOption
            getSelectOption: function () {
                return this.selectOpion;
            },
            
            //find specified option in Select
            findOption: function (Value, Name) {
                var id = this.getId(),
                    $obj = $('#' + id),
                    value = Value || null,
                    name = Name || '',
                    results = [];

                $obj.find('option[value="' + value + '"]').each(function () {
                    if ($(this).html() === name) {
                        results.push($(this));
                    }
                });
                return results;
            },
            
            //check if Select has specified option by option's value and name
            hasOption: function (Value, Name) {
                var id = this.getId(),
                    $obj = $('#' + id),
                    value = Value || null,
                    name = Name || '',
                    optionExist = (this.findOption(value, name).length > 0) ? true : false;
                return optionExist;
            },
            
            //add option to the select
            //OptionObj is an object should be like this
            //{
            //    'valueOne': 'nameOne',
            //    'valueTwo': 'nameTwo'
            //}
            addOption: function (OptionObj) {
                var id = this.getId(),
                    $obj = $('#' + id),
                    options = Toolbox.isObject(OptionObj) ? OptionObj : {},
                    optionValue;
                for (optionValue in options) {
                    if (options.hasOwnProperty(optionValue)) {
                        //append this optionValue if Select does not have it
                        if (!this.hasOption(optionValue, options[optionValue])) {
                            $obj.append('<option value="' + optionValue + '">' + options[optionValue] + '</option>');
                        }
                    }
                }
            },
            
            //remove option from Select
            //OptionObj is an object should be like this
            //{
            //    'valueOne': 'nameOne',
            //    'valueTwo': 'nameTwo'
            //}
            removeOption: function (OptionObj) {
                var id = this.getId(),
                    $obj = $('#' + id),
                    options = Toolbox.isObject(OptionObj) ? OptionObj : {},
                    optionValue,
                    matchedOption,
                    matchedIndex;
                
                for (optionValue in options) {
                    if (options.hasOwnProperty(optionValue)) {
                        //find option
                        matchedOption = this.findOption(optionValue, options[optionValue]);
                        //loop to remove matched option
                        for (matchedIndex = 0; matchedIndex < matchedOption.length; matchedIndex += 1) {
                            matchedOption[matchedIndex].remove();
                        }
                    }
                }
            },
            
            //set default value
            setDefaultValue: function (DefaultValue) {
                if (DefaultValue) {
                    this.defaultValue = DefaultValue;
                    this.setCurrentValue(DefaultValue.toString());
                } else {
                    this.defaultValue = null;
                    Toolbox.assert('Function SocialReport.Select.setDefaultValue: `DefaultValue` is undefined');
                    return false;
                }
            },
            
            //get default value
            getDefaultValue: function () {
                return this.defaultValue;
            },

            //render
            render: function () {
                var id = this.getId(),
                    $obj = $('#' + id),
                    template = this.getTemplate().join('').replace('%ID%', id),
                    selectOpion = this.getSelectOption(),
                    opionHtml = '',
                    defaultValue = this.getDefaultValue();
                //check if there is element obj whose id attribute is `id`
                if ($obj.size() === 0) {
                    Toolbox.assert('Function SocialReport.Select.render: there is no element\'s id is ' + id);
                    return false;
                }
                $obj.prop('outerHTML', template);
                //get the new obj
                $obj = $('#' + id);
                //loop the selectOpion to render select
                $.each(selectOpion, function (value, name) {
                    opionHtml = opionHtml + '<option value="' + value + '" ' + ((value === defaultValue) ? 'selected' : '') + '>' + name + '</option>';
                });
                $obj.html(opionHtml);
                //only when `defaultValue` is undefined, we set the first value to currentValue
                if (!defaultValue) {
                    this.setCurrentValue($obj.find('option:first').val());
                }
            },

            //bind select change event
            bindChangeEvent: function () {
                var context = this,
                    id = this.getId(),
                    $obj = $('#' + id);
                $obj.change(function () {
                    var currentValue = $obj.find('option:selected').val();
                    context.setCurrentValue(currentValue);
                    //trigger change event
                    context.triggerEvent('change', context, currentValue);
                });
            },

            //set currentValue
            setCurrentValue: function (CurrentValue) {
                if (CurrentValue) {
                    this.currentValue = CurrentValue;
                    return this.currentValue;
                } else {
                    Toolbox.assert('Function SocialReport.Select.setCurrentValue: `CurrentValue` is undefined');
                    return false;
                }
            },

            //get currentValue
            getCurrentValue: function () {
                return this.currentValue;
            },

            //initialize function
            initialize: function (Id, Options) {
                Options = (typeof (Options) !== 'undefined') ? Options : {};
                this.setId(Id);
                if (Options.defaultValue) {
                    this.setDefaultValue(Options.defaultValue);
                }
                this.setSelectOption(Options.option);
                this.setTemplate(['<select class="form-control" id="', '%ID%', '"></select>']);
                this.render();
                this.addEvent('change', Options.changeHandler);
                this.bindChangeEvent();
            }
        });
        
        //extend SearchBox class prototype object
        $.extend(SearchBox.prototype, View.prototype, {
            //render
            render: function () {
                var id = this.getId(),
                    $obj = $('#' + id),
                    template = this.getTemplate().join('').replace('%ID%', id);
                //check if there is element obj whose id attribute is `id`
                if ($obj.size() === 0) {
                    Toolbox.assert('Function SocialReport.SearchBox.render: there is no element\'s id is ' + id);
                    return false;
                }
                $obj.prop('outerHTML', template);
            },

            //set searchValue
            setSearchValue: function (SearchValue) {
                this.searchValue = SearchValue || '';
            },
            
            //get searchValue
            getSearchValue: function () {
                return this.searchValue || '';
            },
            
            //bind input change event
            bindInputChangeEvent: function () {
                var context = this,
                    id = this.getId(),
                    $obj = $('#' + id),
                    $inputObj = $obj.find('input');
                $inputObj.change(function () {
                    context.setSearchValue($inputObj.val());
                });
            },
            
            //bind input enter event
            bindInputEnterEvent: function () {
                var context = this,
                    id = this.getId(),
                    $obj = $('#' + id),
                    $inputObj = $obj.find('input'),
                    $submitObj = $obj.find('button');
                $inputObj.bind('keypress', function (e) {
                    if (e.keyCode === 13) {
                        context.setSearchValue($inputObj.val());
                        $submitObj.click();
                    }
                });
            },
            
            //bind submit event to submitHandler
            bindSubmitEvent: function () {
                var context = this,
                    id = this.getId(),
                    $obj = $('#' + id),
                    $submitObj = $obj.find('button'),
                    searchValue;
                $submitObj.on('click', function () {
                    searchValue = context.getSearchValue();
                    context.triggerEvent('change', context, searchValue);
                });
                
            },

            //initialize function
            initialize: function (Id, Options) {
                Options = (typeof (Options) !== 'undefined') ? Options : {};
                this.setId(Id);
                this.setTemplate(['<div class="input-group input-group-sm" id="', '%ID%', '"><input type="text" class="form-control"><span class="input-group-btn"><button type="button" class="btn btn-info btn-flat">Go!</button></span></div>']);
                this.render();
                this.addEvent('change', Options.submitHandler);
                this.bindInputChangeEvent();
                this.bindInputEnterEvent();
                this.bindSubmitEvent();
            }
        });
        
        //extend Panel class prototype object
        $.extend(Panel.prototype, View.prototype, {
            //listen to component
            listenToComponents: function () {
                var components = this.componentCombiner.getComponent(),
                    context = this,
                    changeHandler = function () {
                        var componentList = context.componentCombiner.getComponent();
                        context.triggerEvent('change', context, componentList);
                    },
                    componentKey;

                //loop to listen to component
                for (componentKey in components) {
                    if (components.hasOwnProperty(componentKey)) {
                        components[componentKey].addEvent('change', changeHandler);
                    }
                }
            },
            
            //initialize
            initialize: function (Id, Options) {
                this.componentCombiner = new ComponentCombiner(Options.components);
                this.listenToComponents();
                if (Toolbox.isFunction(Options.changeHandler)) {
                    this.addEvent('change', Options.changeHandler);
                }
            }
        });

        //extend DateRangePickerSelectorPanel class prototype object
        $.extend(DateRangePickerSelectorPanel.prototype, View.prototype, {
            //set Select
            setSelect: function (Obj) {
                //set it if `Obj` is create by Select
                if (Toolbox.isInstance(Obj, SocialReport.Select)) {
                    this.select = Obj;
                    return this.select;
                } else {
                    Toolbox.assert('Function SocialReport.DateRangePickerSelectorPanel.setSelect: `Obj` is undefined or not create by SocialReport.Select');
                    return false;
                }
            },

            //get Select
            getSelect: function () {
                return this.select;
            },

            //set DateRangePicker
            setDateRangePicker: function (Obj) {
                //set it if `Obj` is create by DateRangePicker
                if (Toolbox.isInstance(Obj, SocialReport.DateRangePicker)) {
                    this.dateRangePicker = Obj;
                    return this.dateRangePicker;
                } else {
                    Toolbox.assert('Function SocialReport.DateRangePickerSelectorPanel.setDateRangePicker: `Obj` is undefined or not create by SocialReport.DateRangePicker');
                    return false;
                }
            },

            //get DateRangePicker
            getDateRangePicker: function () {
                return this.dateRangePicker;
            },

            //set currentValue
            setCurrentValue: function (CurrentValue) {
                var selectObj = this.getSelect();
                return selectObj.setCurrentValue(CurrentValue);
            },

            //get currentValue
            getCurrentValue: function () {
                var selectObj = this.getSelect();
                return selectObj.getCurrentValue();
            },

            //set start
            setStart: function (Start) {
                var dateRangePickerObj = this.getDateRangePicker();
                return dateRangePickerObj.setStart(Start);
            },

            //get start
            getStart: function () {
                var dateRangePickerObj = this.getDateRangePicker();
                return dateRangePickerObj.getStart();
            },

            //set end
            setEnd: function (End) {
                var dateRangePickerObj = this.getDateRangePicker();
                return dateRangePickerObj.setEnd(End);
            },

            //get End
            getEnd: function () {
                var dateRangePickerObj = this.getDateRangePicker();
                return dateRangePickerObj.getEnd();
            },

            //set user customized change handler function
            setChangeHandler: function (ChangeHandler) {
                if (Toolbox.isFunction(ChangeHandler)) {
                    this.changeHandler = ChangeHandler;
                } else {
                    Toolbox.assert('Function SocialReport.DateRangePickerSelectorPanel.setChangeHandler: `ChangeHandler` is not a function');
                    return false;
                }
            },

            //get user customized change handler function
            getChangeHandler: function () {
                return this.changeHandler;
            },
            
            //convert dateRange in text format
            getDateRangeInText: function () {
                var dateRangePickerObj = this.getDateRangePicker();
                return dateRangePickerObj.getStart('MMMM D, YYYY') + ' - ' + dateRangePickerObj.getEnd('MMMM D, YYYY');
            },

            //trigger DateRangePickerSelectorPanel change event
            triggerChange: function () {
                var currentValue = this.getCurrentValue(),
                    start = this.getStart(),
                    end = this.getEnd(),
                    changeHandler = this.getChangeHandler();
                changeHandler.call(this, currentValue, start, end);
            },

            //generate Select change event handler
            genSelectChangeHandler: function () {
                //save DateRangePickerSelectorPanel object
                var context = this;
                return function (CurrentValue) {
                    if (CurrentValue) {
                        context.setCurrentValue(CurrentValue);
                        context.triggerChange();
                    } else {
                        Toolbox.assert('Function SocialReport.DateRangePickerSelectorPanel.genSelectChangeHandler: `CurrentValue` is undefined');
                    }
                };
            },

            //generate DateRangePicker change event handler
            genDateRangePickerChangeHandler: function () {
                //save DateRangePickerSelectorPanel object
                var context = this;
                return function (Start, End) {
                    if (Toolbox.isInstance(Start, moment) && Toolbox.isInstance(End, moment)) {
                        context.setStart(Start);
                        context.setEnd(End);
                        context.triggerChange();
                    } else {
                        Toolbox.assert('Function SocialReport.DateRangePickerSelectorPanel.genDateRangePickerChangeHandler: `Start` or `End` is undefined or is invalid (need to be constructor by moment"');
                    }
                };

            },

            //render
            render: function () {
                var id = this.getId(),
                    $obj = $('#' + id),
                    template = this.getTemplate().join('').replace(/%ID%/g, id);
                //check if there is element obj whose id attribute is `id`
                if ($obj.size() === 0) {
                    Toolbox.assert('Function SocialReport.DateRangePickerSelectorPanel.render: there is no element\'s id is ' + id);
                    return false;
                }
                $obj.prop('outerHTML', template);
            },

            //initialize function
            initialize: function (Id, Options) {
                this.setId(Id);
                //set template
                if (Options.template) {
                    this.setTemplate(Options.template);
                } else {
                    this.setTemplate(['<div id="', '%ID%', '"><div class="form-group"><span id="', '%ID%Select"></span></div><div class="form-group"><label>Date range:</label><div class="input-group"><span id="', '%ID%DateRangePicker"></span></div></div></div>']);
                }
                this.setChangeHandler(Options.changeHandler);
                //need to reander before set Select and DateRangePicker
                this.render();
                //create new Select object and DateRangePicker object for the DateRangePickerSelectorPanel as internal members
                this.setSelect(new Select(Id + 'Select', {
                    option: Options.option,
                    defaultValue: Options.defaultValue,
                    changeHandler: this.genSelectChangeHandler()
                }));
                this.setDateRangePicker(new DateRangePicker(Id + 'DateRangePicker', {
                    changeHandler: this.genDateRangePickerChangeHandler()
                }));
                //DateRangePicker would trigger change event in the first time,need to trigger manually 
                this.getDateRangePicker().triggerChangeEvent();
            }
        });

        //extend DataTables class prototype object
        $.extend(DataTables.prototype, View.prototype, {
            //set dataTableObj which can use DataTable api
            setDataTableObj: function (Obj) {
                if (!Obj || typeof (Obj) !== 'object') {
                    Toolbox.assert('Function SocialReport.DataTables.setDataTableObj: Obj can not be undefined and should be an object');
                    return false;
                } else {
                    this.dataTableObj = Obj;
                }
            },

            //get dataTableObj
            getDataTableObj: function () {
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
                    this.tableAttrs = Attrs;
                    return this.tableAttrs;
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
                this.setDataTableObj(dataTableObj);
            },

            //destory the datatable
            destoryDataTables: function () {
                var dataTableObj = this.getDataTableObj();
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
        
        //extend LineChart class prototype object
        $.extend(LineChart.prototype, View.prototype, {
            //define a variable saving LineChartOptions
            lineChartOptions: {
                //Boolean - If we should show the scale at all
                showScale: true,
                //Boolean - Whether grid lines are shown across the chart
                scaleShowGridLines: false,
                //String - Colour of the grid lines
                scaleGridLineColor: "rgba(0,0,0,.05)",
                //Number - Width of the grid lines
                scaleGridLineWidth: 1,
                //Boolean - Whether to show horizontal lines (except X axis)
                scaleShowHorizontalLines: true,
                //Boolean - Whether to show vertical lines (except Y axis)
                scaleShowVerticalLines: true,
                //Boolean - Whether the line is curved between points
                bezierCurve: true,
                //Number - Tension of the bezier curve between points
                bezierCurveTension: 0.3,
                //Boolean - Whether to show a dot for each point
                pointDot: true,
                //Number - Radius of each point dot in pixels
                pointDotRadius: 4,
                //Number - Pixel width of point dot stroke
                pointDotStrokeWidth: 1,
                //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
                pointHitDetectionRadius: 20,
                //Boolean - Whether to show a stroke for datasets
                datasetStroke: true,
                //Number - Pixel width of dataset stroke
                datasetStrokeWidth: 2,
                //Boolean - Whether to fill the dataset with a color
                datasetFill: false,
                //String - A legend template
                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
                //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
                maintainAspectRatio: true,
                //Boolean - whether to make the chart responsive to window resizing
                responsive: true
            },
                 
            //set LineChartOptions
            setLineChartOptions: function (Attr) {
                //make sure `Attr` is an object
                if (Toolbox.isObject(Attr)) {
                    var key,
                        lineChartOptions = this.getLineChartOptions();
                    for (key in Attr) {
                        //make sure not create new attribute in origin lineChartOptions
                        if (Attr.hasOwnProperty(key) && lineChartOptions.hasOwnProperty(key)) {
                            lineChartOptions[key] = Attr[key];
                        }
                    }
                    this.lineChartOptions = lineChartOptions;
                }
            },
            
            //get LineChartOptions
            getLineChartOptions: function () {
                return this.lineChartOptions;
            },
            
            //set LineChart obj which can use ChartJs(http://www.chartjs.org/) api to paint line
            setLineChartObj: function (Obj) {
                if (Toolbox.isInstance(Obj, Object)) {
                    this.LineChartObj = Obj;
                } else {
                    Toolbox.assert('Function SocialReport.LineChart.setLineChartObj: Obj can not be undefined and should be an object');
                }
            },
            
            //get LineChart obj
            getLineChartObj: function () {
                return this.LineChartObj;
            },
            
            //check if `LineChartData` valid
            isLineChartDataVaild: function (LineChartData) {
                //if `LineChartData` is not an object return false
                if (!Toolbox.isObject(LineChartData)) {
                    Toolbox.assert('Function SocialReport.LineChart.setLineChartData: `LineChartData` is undefined or not an object');
                    return false;
                }
                //if `LineChartData.websiteLabelArr`,`LineChartData.competitorLabelArr`,`LineChartData.websiteDataArr` and `LineChartData.competitorDataArr` is not an arry return false
                if (!Toolbox.isArray(LineChartData.websiteLabelArr) || !Toolbox.isArray(LineChartData.competitorLabelArr) || !Toolbox.isArray(LineChartData.websiteDataArr) || !Toolbox.isArray(LineChartData.competitorDataArr)) {
                    Toolbox.assert('Function SocialReport.LineChart.setLineChartData: `LineChartData.labelArr` or `LineChartData.websiteDataArr` or `LineChartData.competitorDataArr` is undefined or not an array');
                    return false;
                }
                return true;
            },
            
            //set LineChartData contain: labelArr, websiteDataArr and competitorDataArr
            setLineChartData: function (LineChartData) {
                var websiteLabelArr = LineChartData.websiteLabelArr,
                    competitorLabelArr = LineChartData.competitorLabelArr,
                    maxLabelLength = Math.max(websiteLabelArr.length, competitorLabelArr.length),
                    labelIndex = 0;
                //initialize lineChartData
                this.lineChartData = this.lineChartData || {};
                this.lineChartData.labelArr = [];
                //loop to set the combine label
                for (labelIndex = 0; labelIndex < maxLabelLength; labelIndex += 1) {
                    this.lineChartData.labelArr.push((websiteLabelArr[labelIndex] || '-') + ' / ' + (competitorLabelArr[labelIndex] || '-'));
                }
                this.lineChartData.websiteDataArr = LineChartData.websiteDataArr;
                this.lineChartData.competitorDataArr = LineChartData.competitorDataArr;
                this.lineChartData.websiteName = LineChartData.websiteName || '';
                this.lineChartData.competitorName = LineChartData.competitorName || '';
                return this;
            },
            
            //get LineChartData
            //if `Attr` is string return lineChartData[Attr], else return the whole data
            getLineChartData: function (Attr) {
                //check if `Attr` is string
                if (Toolbox.isString(Attr)) {
                    return this.lineChartData[Attr];
                } else {
                    return this.lineChartData;
                }
            },
            
            //wrap data for CharJs to paint
            setChartData: function () {
                var labelArr = this.getLineChartData('labelArr'),
                    websiteName = this.getLineChartData('websiteName'),
                    websiteDataArr = this.getLineChartData('websiteDataArr'),
                    competitorName = this.getLineChartData('competitorName'),
                    competitorDataArr = this.getLineChartData('competitorDataArr'),
                    chartData;
                //if `labelArr`, `websiteDataArr` and `competitorDataArr` is not empty we set chartData
                if (labelArr && labelArr.length && websiteDataArr && websiteDataArr.length && competitorDataArr && competitorDataArr.length) {
                    chartData = {
                        labels: labelArr,
                        datasets: [
                            {
                                label: competitorName,
                                fillColor: "rgba(210, 214, 222, 1)",
                                strokeColor: "rgba(210, 214, 222, 1)",
                                pointColor: "rgba(210, 214, 222, 1)",
                                pointStrokeColor: "#c1c7d1",
                                pointHighlightFill: "#fff",
                                pointHighlightStroke: "rgba(220,220,220,1)",
                                data: competitorDataArr
                            }, {
                                label: websiteName,
                                fillColor: "rgba(60,141,188,0.9)",
                                strokeColor: "rgba(60,141,188,0.8)",
                                pointColor: "#3b8bba",
                                pointStrokeColor: "rgba(60,141,188,1)",
                                pointHighlightFill: "#fff",
                                pointHighlightStroke: "rgba(60,141,188,1)",
                                data: websiteDataArr
                            }

                        ]
                    };
                } else {
                    Toolbox.assert('Function SocialReport.LineChart.setChartData: `labelArr` or `websiteDataArr` or `competitorDataArr` is empty');
                }
                this.chartData = chartData;
                return this;
            },
            
            //get data for CharJs to paint
            getChartData: function () {
                return this.chartData;
            },
            
            //render the dom
            render: function () {
                var id = this.getId(),
                    $obj = $('#' + id),
                    template = this.getTemplate().join('').replace('%ID%', id);
                //check if there is element obj whose id attribute is `id`
                if ($obj.size() === 0) {
                    Toolbox.assert('Function SocialReport.LineChart.render: there is no element\'s id is ' + id);
                    return false;
                }
                $obj.prop('outerHTML', template);
                return this;
            },
            
            //set LineChart
            setLineChart: function () {
                var id = this.getId(),
                    $obj = $('#' + id),
                    lineChartCanvas = $obj.get(0).getContext("2d"),
                    lineChartObj = new Chart(lineChartCanvas),
                    chartData = this.getChartData(),
                    lineChartOptions = this.getLineChartOptions();
                //make sure chartData is not empty
                if (chartData) {
                    //use ChartJs api to paint line
                    lineChartObj.Line(chartData, lineChartOptions);
                    this.setLineChartObj(lineChartObj);
                }
                return this;
            },
            
            //destory the lineChart
            destoryLineChart: function () {
                var lineChartObj = this.getLineChartObj();
                if (lineChartObj) {
                    lineChartObj.destroy();
                }
            },

            //repaint the lineChart
            repaint: function (LineChartData, LineChartOptions, Options) {
                //only when LineChartData valid, we set variable to paint LineChart
                if (this.isLineChartDataVaild(LineChartData)) {
                    //set LineChartData
                    this.setLineChartData(LineChartData);
                    if (LineChartOptions) {
                        this.setLineChartOptions(LineChartOptions);
                    }
                    this.destoryDataTables();
                    this.setLineChart();
                }
            },
            
            //initialize
            initialize: function (Id, LineChartData, LineChartOptions, Options) {
                this.setId(Id);
                this.setTemplate(['<div class="chart"><canvas id="', '%ID%', '" style="height:300px"></canvas></div>']);
                this.render();
                //only when LineChartData valid, we set variable to paint LineChart
                if (this.isLineChartDataVaild(LineChartData)) {
                    //set LineChartData
                    this.setLineChartData(LineChartData);
                    this.setChartData();
                    //set LineChart Options
                    this.setLineChartOptions(LineChartOptions);
                    this.setLineChart();
                }
            }
        });

        //extend Operation class prototype object
        $.extend(Operation.prototype, {
            //parse Data
            parse: function () {
                var dataOrigin = this.getOptions('dataOrigin') || '';
                switch (dataOrigin.toLowerCase()) {
                case 'facebook':
                    return this.parseFacebookData();
                case 'google':
                    return this.parseGoogleData();
                default:
                    Toolbox.assert('Function Operation.prototype.parse: go to the default branch.');
                    return false;
                }
            },

            //parse facebook data in json format for further use
            parseFacebookData: function () {
                var parsedPostsData = [],
                    parsedReachData = [],
                    parsedFanpageData = {},
                    postsData = this.getData('postsData'),
                    reachData = this.getData('reachData'),
                    fanpageData = this.getData('fanpageData'),
                    size = this.getSize(),
                    postIndex = 0,
                    insightIndex = 0,
                    postObj = {},
                    reactionsObj = {},
                    consumptionsObj = {},
                    reactionsKey = '',
                    consumptionskey = '',
                    fanpagePostIndex = 0,
                    fanpagePostObject;
                //loop to set postsData
                for (postIndex = 0; postIndex < size; postIndex += 1) {
                    postObj = {};
                    postObj.comments = postsData[postIndex].comments ? postsData[postIndex].comments.summary.total_count : 0;
                    postObj.shares = postsData[postIndex].shares ? postsData[postIndex].shares.count : 0;
                    postObj.created_time = Toolbox.formatTime(postsData[postIndex].created_time) || '';
                    postObj.id = postsData[postIndex].id || '';
                    postObj.message = (postsData[postIndex].message || '').substring(0, 30) + '...';
                    postObj.permalink_url = postsData[postIndex].permalink_url || '';
                    postObj.type = postsData[postIndex].type || '';
                    postObj.authorId = (postsData[postIndex].admin_creator && postsData[postIndex].admin_creator.id) || '';
                    postObj.authorName = (postsData[postIndex].admin_creator && postsData[postIndex].admin_creator.name) || '';
                    postObj.insights = (postsData[postIndex].insights && postsData[postIndex].insights.data) || '';
                    //loop to set insights object data
                    for (insightIndex = 0; insightIndex < postObj.insights.length; insightIndex += 1) {
                        switch (postObj.insights[insightIndex].name) {
                        case 'post_impressions_organic':
                            postObj.post_impressions_organic = postObj.insights[insightIndex].values['0'].value;
                            break;
                        case 'post_impressions_by_story_type':
                            postObj.post_impressions_by_story_type = postObj.insights[insightIndex].values['0'].value.other;
                            break;
                        case 'post_impressions_paid':
                            postObj.post_impressions_paid = postObj.insights[insightIndex].values['0'].value;
                            break;
                        case 'post_impressions':
                            postObj.post_impressions = postObj.insights[insightIndex].values['0'].value;
                            break;
                        case 'post_impressions_unique':
                            postObj.post_impressions_unique = postObj.insights[insightIndex].values['0'].value;
                            break;
                        case 'post_impressions_paid_unique':
                            postObj.post_impressions_paid_unique = postObj.insights[insightIndex].values['0'].value;
                            break;
                        case 'post_reactions_by_type_total':
                            //`reactionsObj` has different types of reactions need to break it down
                            reactionsObj = postObj.insights[insightIndex].values['0'].value;
                            postObj.post_reactions_by_type_total = reactionsObj;
                            for (reactionsKey in reactionsObj) {
                                if (reactionsObj.hasOwnProperty(reactionsKey)) {
                                    postObj[reactionsKey] = reactionsObj[reactionsKey];
                                }
                            }
                            break;
                        case 'post_consumptions_by_type':
                            //`consumptionsObj` has different types of consumptions need to break it down
                            consumptionsObj = postObj.insights[insightIndex].values['0'].value;
                            postObj.post_consumptions_by_type = consumptionsObj;
                            for (consumptionskey in consumptionsObj) {
                                if (consumptionsObj.hasOwnProperty(consumptionskey)) {
                                    //make sure `type` is video and `consumptionskey` is photo view or `type` is not video and `consumptionskey` is video play not true
                                    if (!(postObj.type === 'video' && consumptionskey === 'photo view') && !(postObj.type !== 'video' && consumptionskey === 'video play')) {
                                        postObj[consumptionskey] = consumptionsObj[consumptionskey];
                                    }
                                }
                            }
                            break;
                        case 'post_video_views':
                            postObj.post_video_views = postObj.insights[insightIndex].values['0'].value;
                            break;
                        default:
                            break;
                        }
                    }
                    parsedPostsData[postIndex] = postObj;
                }
                
                //loop to set reachData
                $.each(reachData, function (key, value) {
                    switch (value.name) {
                    case 'page_fans':
                        parsedReachData.page_fans = value.values;
                        break;
                    default:
                        break;
                    }
                });
                
                //make sure `fanpageData[0].posts` is not undefine
                fanpageData[0].posts = fanpageData[0].posts || {};
                
                //parse fanPage data
                parsedFanpageData = {
                    id: fanpageData[0].id,
                    fan_count: fanpageData[0].fan_count,
                    name: fanpageData[0].name,
                    picture_src: fanpageData[0].picture.data.url,
                    postSize: Toolbox.getObjectSize(fanpageData[0].posts.data),
                    comments: 0,
                    likes: 0,
                    shares: 0,
                    reactioins: 0,
                    engagement: 0
                };
                //loop to get summary comments, likes, shares and reactions
                for (fanpagePostIndex in fanpageData[0].posts.data) {
                    if (fanpageData[0].posts.data.hasOwnProperty(fanpagePostIndex)) {
                        fanpagePostObject = fanpageData[0].posts.data[fanpagePostIndex];
                        parsedFanpageData.comments += parseInt((fanpagePostObject.comments && fanpagePostObject.comments.summary.total_count) || 0, 0);
                        parsedFanpageData.likes += parseInt((fanpagePostObject.likes && fanpagePostObject.likes.summary.total_count) || 0, 0);
                        parsedFanpageData.shares += parseInt((fanpagePostObject.shares && fanpagePostObject.shares.count) || 0, 0);
                        parsedFanpageData.reactioins += parseInt((fanpagePostObject.reactioins && fanpagePostObject.reactioins.summary.total_count) || 0, 0);
                    }
                }
                parsedFanpageData.engagement += parsedFanpageData.comments + parsedFanpageData.likes + parsedFanpageData.shares + parsedFanpageData.reactioins;

                this.setData({
                    postsData: parsedPostsData,
                    reachData: parsedReachData,
                    fanpageData: parsedFanpageData
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
                    this.dataOrigin = DataOrigin;
                    return this.dataOrigin;
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
                    this.data = Data;
                    return this.data;
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
                    this.dayRange = DayRange;
                    return this.dayRange;
                }
            },

            //calculate frequency
            frequency: function () {
                var dateRange = parseInt(this.getDayRange(), 0),
                    size = parseInt(this.getSize(), 0);
                if (dateRange) {
                    return parseFloat(size / dateRange).toFixed(2);
                } else {
                    return 0;
                }
            },

            //get standard format data from `TableType` to build datatable
            getFormatDataFromTableType: function (TableType, Options) {
                var dataOrigin = this.getOptions('dataOrigin') || '',
                    tableType = TableType.toLowerCase() || '';
                switch (dataOrigin.toLowerCase()) {
                case 'facebook':
                    switch (tableType) {
                    case 'postsdata':
                        return this.getPostsDataInFacebook();
                    case 'averagepostsdata':
                        return this.getAveragePostsDataInFacebook();
                    case 'reachrate':
                        return this.getReachRateInFacebook();
                    case 'engagementrate':
                        return this.getEngagementRateInFacebook();
                    case 'toplinks':
                        return this.getTopPostsDataInFacebookByType('link', 5);
                    case 'topphotos':
                        return this.getTopPostsDataInFacebookByType('photo', 5);
                    case 'topvideos':
                        return this.getTopPostsDataInFacebookByType('video', 5);
                    case 'postlog':
                        return this.getPostLogDataInFacebookByDate(Options);
                    case 'postlogsummary':
                        return this.getPostLogSummaryDataInFacebookByDate();
                    default:
                        Toolbox.assert('Function SocialReport.Operation.getFormatDataFromTableType: go into the default branch');
                        return this.getData();
                    }
                case 'google':
                    //return this._formatDataInGoogle();
                    break;
                default:
                    return this.getData();
                }
            },
            
            //get standard format data from `LineChartType` to build LineChart
            getFormatDataFromLineChartType: function (LineChartType) {
                var dataOrigin = this.getOptions('dataOrigin') || '',
                    lineChartType = LineChartType.toLowerCase() || '';
                switch (dataOrigin.toLowerCase()) {
                case 'facebook':
                    switch (lineChartType) {
                    case 'postsize':
                        return this.getPostSizeByDateInFacebook();
                    case 'avgreachbypost':
                        return this.getAvgReachByPostNumberInFacebook();
                    case 'avgpagefanlike':
                        return this.getAvgPageFanLikeInFacebook();
                    default:
                        Toolbox.assert('Function SocialReport.Operation.getFormatDataFromLineChartType: go into the default branch');
                        return this.getData();
                    }
                case 'google':
                    //return this._formatDataInGoogle();
                    break;
                default:
                    return this.getData();
                }
            },

            //build facebook postsdata in datatable format
            //return `columnTitle` and `data`
            getPostsDataInFacebook: function () {
                //set the variable for looping
                var columnTitle = [
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
                    },
                    {
                        title: "Author"
                    }],
                    data = [];
                //get postsdata in 2d array
                data = this.getPostsDataIn2DArray();
                return {
                    data: data,
                    columnTitle: columnTitle
                };
            },

            //build facebook average posts data in datatable format
            //return `columnTitle` and `data`
            getAveragePostsDataInFacebook: function () {
                //when postData size is 0, we just return empty `data`
                if (Toolbox.getObjectSize(this.getData('postsData')) === 0) {
                    return {
                        data: [],
                        columnTitle: [
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
                    };
                }
                
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
                    //get the summary of the posts data
                    summary = this.getPostsDataSummary(),
                    data = [],
                    //calculate some variable
                    paidReach = parseInt(summary.post_impressions_paid_unique, 0),
                    totalReach = parseInt(summary.post_impressions_unique, 0),
                    organicReach = totalReach - paidReach,
                    like = parseInt(summary.like, 0),
                    share = parseInt(summary.shares, 0),
                    comment = parseInt(summary.comments, 0),
                    videoPlay = parseInt(summary.post_video_views, 0),
                    haha = parseInt(summary.haha, 0),
                    wow = parseInt(summary.wow, 0),
                    love = parseInt(summary.love, 0),
                    sorry = parseInt(summary.sorry, 0),
                    anger = parseInt(summary.anger, 0),
                    reaction = (like + love + wow + haha + sorry + anger).toLocaleString() + '&nbsp;&nbsp;(<i class="fa fb_icon fb_like" title="like"></i><span> ' + like.toLocaleString() + '</span> ' + '&nbsp;&nbsp;<i class="fa fb_icon fb_love" title="love"></i><span> ' + love.toLocaleString() + '</span>' + '&nbsp;&nbsp;<i class="fa fb_icon fb_haha" title="haha"></i><span> ' + haha.toLocaleString() + '</span>' + '&nbsp;&nbsp;<i class="fa fb_icon fb_wow" title="wow"></i><span> ' + wow.toLocaleString() + '</span>' + '&nbsp;&nbsp;<i class="fa fb_icon fb_sad" title="sad"></i><span> ' + sorry.toLocaleString() + '</span>' + '&nbsp;&nbsp;<i class="fa fb_icon fb_anger" title="anger"></i><span> ' + anger.toLocaleString() + '</span>)',
                    averageReaction = Math.round((like + love + wow + haha + sorry + anger) / dataSize).toLocaleString() + '&nbsp;&nbsp;(<i class="fa fb_icon fb_like" title="like"></i><span> ' + Math.round(like / dataSize).toLocaleString() + '</span> ' + '&nbsp;&nbsp;<i class="fa fb_icon fb_love" title="love"></i><span> ' + Math.round(love / dataSize).toLocaleString() + '</span>' + '&nbsp;&nbsp;<i class="fa fb_icon fb_haha" title="haha"></i><span> ' + Math.round(haha / dataSize).toLocaleString() + '</span>' + '&nbsp;&nbsp;<i class="fa fb_icon fb_wow" title="wow"></i><span> ' + Math.round(wow / dataSize).toLocaleString() + '</span>' + '&nbsp;&nbsp;<i class="fa fb_icon fb_sad" title="sad"></i><span> ' + Math.round(sorry / dataSize).toLocaleString() + '</span>' + '&nbsp;&nbsp;<i class="fa fb_icon fb_anger" title="anger"></i><span> ' + Math.round(anger / dataSize).toLocaleString() + '</span>)',
                    vieworplays = parseInt(summary['video play'], 0) + parseInt(summary['photo view'], 0),
                    linkclick = parseInt(summary['link clicks'], 0),
                    otherclick = parseInt(summary['other clicks'], 0),
                    postclick = (vieworplays + linkclick + otherclick).toLocaleString() + '&nbsp;&nbsp;(<label>Photo Views & Clicks to Play:</label><span> ' + vieworplays.toLocaleString() + '</span>' + '&nbsp;&nbsp;<label>Link Clicks:</label><span> ' + linkclick.toLocaleString() + '</span>' + '&nbsp;&nbsp;<label>Other Clicks:</label><span> ' + otherclick.toLocaleString() + '</span>)',
                    averagePostclick = Math.round((vieworplays + linkclick + otherclick) / dataSize).toLocaleString() + '&nbsp;&nbsp;(<label>Photo Views & Clicks to Play:</label><span> ' + Math.round(vieworplays / dataSize).toLocaleString() + '</span>' + '&nbsp;&nbsp;<label>Link Clicks:</label><span> ' + Math.round(linkclick / dataSize).toLocaleString() + '</span>' + '&nbsp;&nbsp;<label>Other Clicks:</label><span> ' + Math.round(otherclick / dataSize).toLocaleString() + '</span>)',
                    paidImpression = parseInt(summary.post_impressions_paid, 0),
                    totalImpression = parseInt(summary.post_impressions, 0),
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
            getReachRateInFacebook: function () {
                //when postData size is 0, we just return empty `data`
                if (Toolbox.getObjectSize(this.getData('postsData')) === 0) {
                    return {
                        data: [],
                        columnTitle: [
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
                        ]
                    };
                }
                
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
                summary = this.getPostsDataSummary();
                totalReach = parseInt(summary.post_impressions_unique, 0);
                averageTotalReach = Math.round(totalReach / dataSize);
                //get fans likes summary
                $.each(reachData.page_fans, function (ken, value) {
                    fanLikeSummary = fanLikeSummary + value.value;
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
            getEngagementRateInFacebook: function () {
                //when postData size is 0, we just return empty `data`
                if (Toolbox.getObjectSize(this.getData('postsData')) === 0) {
                    return {
                        data: [],
                        columnTitle: [
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
                        ]
                    };
                }
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
                summary = this.getPostsDataSummary();
                likeCommentShareSummary = summary.like + summary.comments + summary.shares;
                reactionPostclickSummary = summary.like + summary.love + summary.haha + summary.wow + summary.sorry + summary.anger + summary['video play'] + summary['photo view'] + summary['link clicks'] + summary['other clicks'];
                reachSummary = summary.post_impressions_unique;
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
            getTopPostsDataInFacebookByType: function (Type, Limit) {
                //set the variable for looping
                var sortedPostsData = this.sortPostsData(),
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
                        },
                        {
                            title: "Author"
                        }
                    ],
                    data = [],
                    limit = Limit || 5,
                    type = Type || 'link',
                    postIndex = 0,
                    postAttrIndex = 0,
                    postAttrArray = [];
                for (postIndex = 0; postIndex < dataSize; postIndex += 1) {
                    //if type suited
                    if (sortedPostsData[postIndex][3] === type) {
                        //initialize the `postAttrArray` for save new attribute of suited post
                        postAttrArray = [];
                        //loop this post all attribute to build an array which will be added to the `data` array
                        for (postAttrIndex in sortedPostsData[postIndex]) {
                            if (sortedPostsData[postIndex].hasOwnProperty(postAttrIndex)) {
                                postAttrArray.push(sortedPostsData[postIndex][postAttrIndex]);
                            }
                        }
                        data.push(postAttrArray);
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
            
            //build facebook post log data in datatable format
            //return `columnTitle` and `data`
            getPostLogDataInFacebookByDate: function (Options) {
                var timeKeyInSourceData = 4,
                    editorKeyInSourceData = 17,
                    interval = parseInt(Options.interval, 0) || 1,
                    reservedEditor = Options.reservedEditor || 'all',
                    showEmptySlot = (Options.showEmptySlot === 'enable') || false,
                    startDate = Options.startDate || null,
                    endDate = Options.endDate || null,
                    websiteName = Options.websiteName || '',
                    sortedPostsData = this.sortPostsData(timeKeyInSourceData),
                    requiredPostsData = this.filter2DArrayBySpecifiedElement(sortedPostsData, editorKeyInSourceData, reservedEditor), //reserve specified post data by `reservedEditor`
                    columnTitle = [
                        {
                            title: "Editor"
                        },
                        {
                            title: "Time"
                        },
                        {
                            title: "Permalink"
                        },
                        {
                            title: "Short Description"
                        },
                        {
                            title: "Reach"
                        },
                        {
                            title: "Like"
                        },
                        {
                            title: "Share"
                        },
                        {
                            title: "Comment"
                        }
                    ],
                    data = [],
                    writingScheduleData = {},
                    writingScheduleDataKey,
                    writingScheduleExcelData = {};
                    
                //iterator
                function iterator(key, value, context) {
                    var postKeyDuringPeriod = 0;
                    
                    //empty data
                    if (value.length <= 0) {

                        //if `showEmptySlot` is true, we create an empty slot
                        if (showEmptySlot) {
                            context.push(['', '<div class="timeWrapper">' + key + '</div>', '', '', '', '', '', '']);
                        }
                    } else {
                        for (postKeyDuringPeriod = 0; postKeyDuringPeriod < value.length; postKeyDuringPeriod += 1) {
                            context.push([value[postKeyDuringPeriod][editorKeyInSourceData], (postKeyDuringPeriod === 0) ? '<div class="timeWrapper">' + key + '</div>' : '', value[postKeyDuringPeriod][1], value[postKeyDuringPeriod][2], value[postKeyDuringPeriod][7], value[postKeyDuringPeriod][8], value[postKeyDuringPeriod][9], value[postKeyDuringPeriod][10]]);
                        }
                    }
                }
                
                //generate `writingScheduleData` between `startDate` and `endDate` 
                writingScheduleData = this.generateWritingScheduleData(requiredPostsData, timeKeyInSourceData, editorKeyInSourceData, {
                    interval: interval,
                    reservedEditor: reservedEditor,
                    showEmptySlot: showEmptySlot
                });

                //loop to format data in datatable format
                for (writingScheduleDataKey in writingScheduleData) {
                    if (writingScheduleData.hasOwnProperty(writingScheduleDataKey)) {
                        data.push(['', '<div class="dateHeader">' + writingScheduleDataKey + '</div>', '', '', '', '', '', '']);
                        writingScheduleData[writingScheduleDataKey].map(iterator, data);
                    }
                }
                
                //generate `writingScheduleExcelData`
                writingScheduleExcelData = this.generateWritingScheduleExcelData(writingScheduleData, startDate, endDate, {
                    timeKeyInPostData: 4,
                    editorKeyInPostData: 17,
                    descriptioinKeyInPostData: 2,
                    metricsKeyInPostData: 7,
                    reportHeaderText: websiteName + ' Facebook\'s Writing Schedule '
                });

                return {
                    data: data,
                    columnTitle: columnTitle,
                    writingScheduleExcelData: writingScheduleExcelData
                };
            },
            
            //generate writingScheduleData from 2D array(data table format)
            //writingScheduleData = {
            //    'YYYY-MM-DD': oneDayDataMap,
            //    'YYYY-MM-DD': oneDayDataMap,
            //    ...
            //    'YYYY-MM-DD': oneDayDataMap,
            //}
            //oneDayDataMap = {
            //    '00:00:00-00:14:59': [[Editor, Time, Permalink, Short Description, Reach, ...],[],...,[]],
            //    '00:15:00-00:29:59': [[],[],...,[]],
            //    ...
            //    '23:45:00-23:59:59': [[],[],...,[]],
            //}
            generateWritingScheduleData: function (SourceData, TimeKeyInSourceData, EditorKeyInSourceData, Opinions) {

                //make sure params is valid
                if (!Toolbox.is2DArray(SourceData) || Toolbox.isUndefined(TimeKeyInSourceData) || Toolbox.isUndefined(EditorKeyInSourceData)) {
                    Toolbox.assert('Function SocialReport.Operation.generateWritingScheduleData: `SourceData` is not a 2D array or `TimeKeyInSourceData` is undefined or `EditorKeyInSourceData` is undefined');
                    return false;
                }
                
                var sourceData = SourceData,
                    timeKeyInSourceData = parseInt(TimeKeyInSourceData, 0),
                    editorKeyInSourceData = parseInt(EditorKeyInSourceData, 0),
                    opinions = Opinions || {},
                    interval = parseInt((opinions.interval || 1), 0),
                    reservedEditor = opinions.reservedEditor || 'all',
                    showEmptySlot = opinions.showEmptySlot || false,
                    dataSize = sourceData.length,
                    oneDayDataMap = new Toolbox.OrderedMapTable(), //it is an order map whose key is post's time in format like '00:00:00-00:15:59' and value is a 2DArray which contain post
                    postDataDuringPeriod,
                    writingScheduleData = {},
                    writingScheduleDatKey,
                    postIndex,
                    postYearMonthDay, //save current post's time in format like "YYYY-MM-DD"
                    postPeriod; //save current post's time in format like "00:00:00-00:15:59"


                //use `interval` to generate all time period in one day and add this time period to `oneDayDataMap`
                function formatOneDayDataMap(OneDayDataMap, Interval) {

                    //check if `OneDayDataMap` is build by constructor `Toolbox.OrderedMapTable`
                    if (!OneDayDataMap instanceof Toolbox.OrderedMapTable) {
                        Toolbox.assert('Function SocialReport.Operation.generateWritingScheduleData formatOneDayDataMap: `OneDayDataMap` is not build by ToolBox.OrderMapTable');
                        return false;
                    }

                    var oneDayDataMap = OneDayDataMap,
                        interval = parseInt(Interval, 0) || 1, //number of minutes
                        minutesInOneDay = 24 * 60, //the total minutes in one day
                        currentMinutes = 0,
                        mapAttribute = '00:00:00', //"HH:mm:ss"
                        hour,
                        minuteStart,
                        minuteEnd;


                    for (currentMinutes = 0; currentMinutes < minutesInOneDay; currentMinutes += interval) {
                        hour = Math.floor(currentMinutes / 60);
                        minuteStart = currentMinutes % 60;
                        minuteEnd = minuteStart + interval - 1;
                        //format `hour`, `minuteStart` and `minuteEnd`
                        hour = hour < 10 ? '0' + hour : String('') + hour;
                        minuteStart = minuteStart < 10 ? '0' + minuteStart : String('') + minuteStart;
                        minuteEnd = minuteEnd < 10 ? '0' + minuteEnd : String('') + minuteEnd;
                        mapAttribute = hour + ':' + minuteStart + ':' + '00' + ' - ' + hour + ':' + minuteEnd + ':' + '59';
                        //save mapAttribute to `oneDayDataMap`
                        oneDayDataMap.add(mapAttribute, []);
                    }
                }

                //a function parse post time to format like 'HH:mm:ss - HH:mm:ss'
                //`PostTime` should be a string like '2017-04-20 19:04:28'
                function parsePostTime(PostTime, Interval) {
                    var postTime = PostTime || null,
                        interval = parseInt(Interval, 0) || 1, //number of minutes
                        hour,
                        minute,
                        minuteStart,
                        minuteEnd,
                        parsedPostTime;

                    if (!Toolbox.isString(postTime)) {
                        Toolbox.assert('Function SocialReport.Operation.getPostLogDataInFacebookByDate parsePostTime: `PostTime` is not a string');
                        return false;
                    }

                    hour = moment(postTime).format("HH");
                    minute = moment(postTime).format("mm");
                    minuteStart = Math.floor(parseInt(minute, 0) / interval) * interval;
                    minuteEnd = minuteStart + interval - 1;
                    //format `minuteStart` and `minuteEnd`
                    minuteStart = minuteStart < 10 ? '0' + minuteStart : String('') + minuteStart;
                    minuteEnd = minuteEnd < 10 ? '0' + minuteEnd : String('') + minuteEnd;
                    parsedPostTime = hour + ':' + minuteStart + ':' + '00' + ' - ' + hour + ':' + minuteEnd + ':' + '59';

                    return parsedPostTime;
                }

                //format `oneDayDataMap`
                formatOneDayDataMap(oneDayDataMap, interval);

                //loop the `sourceData` to save post to `writingScheduleData`
                for (postIndex = dataSize - 1; postIndex >= 0; postIndex -= 1) {
                    postYearMonthDay = moment(sourceData[postIndex][timeKeyInSourceData]).format("YYYY-MM-DD");

                    //if `writingScheduleData` does not have attribute whose name is `oneDayDataMap` then create it
                    if (!writingScheduleData.hasOwnProperty(postYearMonthDay)) {
                        writingScheduleData[postYearMonthDay] = $.extend(true, {}, oneDayDataMap); //deecopy
                    }

                    postPeriod = parsePostTime(sourceData[postIndex][timeKeyInSourceData], interval);
                    postDataDuringPeriod = writingScheduleData[postYearMonthDay].getAttribute(postPeriod);
                    postDataDuringPeriod = postDataDuringPeriod.concat([sourceData[postIndex]]);
                    writingScheduleData[postYearMonthDay].setAttribute(postPeriod, postDataDuringPeriod);
                }
                
                return writingScheduleData;
            },
            
            //generate data in weekly report format
            generateWritingScheduleExcelData: function (WritingScheduleData, StartDate, EndDate, Opinions) {
                var startDate = StartDate || null,
                    endDate = EndDate || null,
                    writingScheduleData = WritingScheduleData || null,
                    opinions = Opinions || {},
                    writingScheduleExcelData = [],
                    oneWeekDataInitObj = {
                        header: {},
                        postLogData: {},
                        footer: {}
                    },
                    formatedPostLogData = [],
                    weekdayStringArray = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
                    reportHeaderText = opinions.reportHeaderText || 'Writing Schedule ',
                    writingScheduleExcelDataKey,
                    postLogDataKey,
                    periodKey,
                    timeKeyInPostData = opinions.hasOwnProperty('timeKeyInPostData') ? opinions.timeKeyInPostData : 4,
                    editorKeyInPostData = opinions.hasOwnProperty('editorKeyInPostData') ? opinions.editorKeyInPostData : 17,
                    descriptioinKeyInPostData = opinions.hasOwnProperty('descriptioinKeyInPostData') ? opinions.descriptioinKeyInPostData : 2,
                    metricsKeyInPostData = opinions.hasOwnProperty('metricsKeyInPostData') ? opinions.metricsKeyInPostData : 7;

                //iterator
                //context.postLogData = {
                //    '00:00:00-00:14:59': periodDataInitObj,
                //    ...
                //    '23:45:00-23:59:59': periodDataInitObj
                //};
                function iterator(postPeriod, postsDataInPeriod, context) {
                    var postDataIndex = 0,
                        currentWeekdayIndex,
                        defaultPlaceholder = '--',
                        periodDataInitObj = {
                            '%PERIOD%': defaultPlaceholder,
                            '%MON_EDITOR%': defaultPlaceholder,
                            '%MON_DESCRIPTION%': defaultPlaceholder,
                            '%MON_METRICS%': defaultPlaceholder,
                            '%TUE_EDITOR%': defaultPlaceholder,
                            '%TUE_DESCRIPTION%': defaultPlaceholder,
                            '%TUE_METRICS%': defaultPlaceholder,
                            '%WED_EDITOR%': defaultPlaceholder,
                            '%WED_DESCRIPTION%': defaultPlaceholder,
                            '%WED_METRICS%': defaultPlaceholder,
                            '%THU_EDITOR%': defaultPlaceholder,
                            '%THU_DESCRIPTION%': defaultPlaceholder,
                            '%THU_METRICS%': defaultPlaceholder,
                            '%FRI_EDITOR%': defaultPlaceholder,
                            '%FRI_DESCRIPTION%': defaultPlaceholder,
                            '%FRI_METRICS%': defaultPlaceholder,
                            '%SAT_EDITOR%': defaultPlaceholder,
                            '%SAT_DESCRIPTION%': defaultPlaceholder,
                            '%SAT_METRICS%': defaultPlaceholder,
                            '%SUN_EDITOR%': defaultPlaceholder,
                            '%SUN_DESCRIPTION%': defaultPlaceholder,
                            '%SUN_METRICS%': defaultPlaceholder
                        };
                    
                    //create `postPeriod` as context.postLogData attribute if it does not have any
                    context.postLogData[postPeriod] = Toolbox.isUndefined(context.postLogData[postPeriod]) ? [] : context.postLogData[postPeriod];

                    //loop every post in this period
                    for (postDataIndex = 0; postDataIndex < postsDataInPeriod.length; postDataIndex += 1) {
                        //large than exist period post number, create a new period post
                        if (postDataIndex >= context.postLogData[postPeriod].length) {
                            context.postLogData[postPeriod].push($.extend(true, {}, periodDataInitObj));
                        }

                        currentWeekdayIndex = moment(postsDataInPeriod[postDataIndex][timeKeyInPostData]).day();
                        context.postLogData[postPeriod][postDataIndex]['%PERIOD%'] = postPeriod;
                        context.postLogData[postPeriod][postDataIndex]['%' + weekdayStringArray[currentWeekdayIndex] + '_EDITOR%'] = postsDataInPeriod[postDataIndex][editorKeyInPostData];
                        context.postLogData[postPeriod][postDataIndex]['%' + weekdayStringArray[currentWeekdayIndex] + '_DESCRIPTION%'] = postsDataInPeriod[postDataIndex][descriptioinKeyInPostData].replace('<div class="post_message">', '').replace('</div>', '');
                        context.postLogData[postPeriod][postDataIndex]['%' + weekdayStringArray[currentWeekdayIndex] + '_METRICS%'] = postsDataInPeriod[postDataIndex][metricsKeyInPostData];

                        //init footer variable if do not create it
                        //feeds
                        context.footer[weekdayStringArray[currentWeekdayIndex] + '_TOTAL_FEEDS'] = (context.footer.hasOwnProperty(weekdayStringArray[currentWeekdayIndex] + '_TOTAL_FEEDS')) ? context.footer[weekdayStringArray[currentWeekdayIndex] + '_TOTAL_FEEDS'] : 0;
                        context.footer.WEEK_TOTAL_FEEDS = (context.footer.hasOwnProperty('WEEK_TOTAL_FEEDS')) ? context.footer.WEEK_TOTAL_FEEDS : 0;
                        //reach
                        context.footer[weekdayStringArray[currentWeekdayIndex] + '_TOTAL_METRICS'] = (context.footer.hasOwnProperty(weekdayStringArray[currentWeekdayIndex] + '_TOTAL_METRICS')) ? context.footer[weekdayStringArray[currentWeekdayIndex] + '_TOTAL_METRICS'] : 0;
                        context.footer.WEEK_TOTAL_METRICS = (context.footer.hasOwnProperty('WEEK_TOTAL_METRICS')) ? context.footer.WEEK_TOTAL_METRICS : 0;
                        //do summary
                        //feeds
                        context.footer[weekdayStringArray[currentWeekdayIndex] + '_TOTAL_FEEDS'] += 1;
                        context.footer.WEEK_TOTAL_FEEDS += 1;
                        context.footer['%' + weekdayStringArray[currentWeekdayIndex] + '_TOTAL_FEEDS%'] = context.footer[weekdayStringArray[currentWeekdayIndex] + '_TOTAL_FEEDS'].toLocaleString();
                        context.footer['%WEEK_TOTAL_FEEDS%'] = context.footer.WEEK_TOTAL_FEEDS.toLocaleString();
                        context.footer['%WEEK_AVG_FEEDS%'] = Math.round(context.footer.WEEK_TOTAL_FEEDS / parseInt(context.header.daysNum, 0)).toLocaleString();
                        //METRICS
                        context.footer[weekdayStringArray[currentWeekdayIndex] + '_TOTAL_METRICS'] += parseInt(postsDataInPeriod[postDataIndex][metricsKeyInPostData].toString().replace(',', ''), 0);
                        context.footer.WEEK_TOTAL_METRICS += parseInt(postsDataInPeriod[postDataIndex][metricsKeyInPostData].toString().replace(',', ''), 0);
                        context.footer['%' + weekdayStringArray[currentWeekdayIndex] + '_TOTAL_METRICS%'] = context.footer[weekdayStringArray[currentWeekdayIndex] + '_TOTAL_METRICS'].toLocaleString();
                        context.footer['%WEEK_TOTAL_METRICS%'] = context.footer.WEEK_TOTAL_METRICS.toLocaleString();
                        context.footer['%WEEK_AVG_METRICS%'] = Math.round(context.footer.WEEK_TOTAL_METRICS / parseInt(context.header.daysNum, 0)).toLocaleString();
                    }
                }
                
                //divide the dayRange up into several weeks, `DayIndex` is the index of the first day of the week
                //weeksArray:[
                //    ["2017-04-28", "2017-04-29", "2017-04-30"],
                //    ["2017-05-01", "2017-05-02", "2017-05-03", "2017-05-04"]
                //]
                function divideDayRangeIntoWeeks(StartDate, EndDate, SplitReferenceIndex) {
                    var startDate = StartDate || null,
                        endDate = EndDate || null,
                        splitReferenceIndex = SplitReferenceIndex || 1, //split by MON
                        weeksArray = [],
                        oneWeekArray = [],
                        currentDay;
                    
                    //loop all day between `startDate` and `endDate`
                    for (currentDay = moment(startDate.format("YYYY-MM-DD")); !currentDay.isAfter(endDate); currentDay.add(1, 'days')) {
                        
                        //check if `currentDay` reach the new week
                        if (currentDay.day() === SplitReferenceIndex && !currentDay.isSame(startDate)) {
                            weeksArray.push(oneWeekArray);
                            oneWeekArray = [];
                        }
                        
                        oneWeekArray.push(currentDay.format("YYYY-MM-DD"));
                    }
                    weeksArray.push(oneWeekArray);
                    
                    return weeksArray;
                }
                                
                //convert postLogData to array for excel 
                //resultData = [
                //    '00:00:00-00:14:59': [editor, date, ...],
                //    '00:00:00-00:14:59': [editor, date, ...],   //can duplicate
                //    ...
                //    '23:30:00-23:44:59': [editor, date, ...],
                //    '23:45:00-23:59:59': [editor, date, ...]
                //];
                function getPostLogDataForExcel(PostLogData) {
                    var postLogData = PostLogData || {},
                        resultData = [],
                        postPeriodKey,
                        postIndex;

                    //loop `postLogData`
                    for (postPeriodKey in postLogData) {
                        if (postLogData.hasOwnProperty(postPeriodKey)) {
                            
                            //empty slot
                            if (postLogData[postPeriodKey].length === 0) {
                                resultData.push({
                                    '%PERIOD%': postPeriodKey
                                });
                            }

                            //loop every post during `postPeriodKey`
                            for (postIndex in postLogData[postPeriodKey]) {
                                if (postLogData[postPeriodKey].hasOwnProperty(postIndex)) {

                                    resultData.push(postLogData[postPeriodKey][postIndex]);
                                }
                            }
                        }
                    }

                    return resultData;
                }
                
                //build `writingScheduleExcelData`
                //
                function buildWritingScheduleExcelData(StartDate, EndDate, SplitReferenceIndex) {
                    var startDate = StartDate || null,
                        endDate = EndDate || null,
                        splitReferenceIndex = SplitReferenceIndex || 1,   //split by MON
                        weeksArray = [],
                        weeksIndex = 0,
                        oneWeekData = $.extend(true, {}, oneWeekDataInitObj),
                        daysIndex = 0,
                        currentDateInYearMonthDay = '',
                        currentDay = '',
                        currentWeekdayIndex = '',
                        currentWeekdayString = '',
                        writingScheduleExcelData = [];
                        
                    //get weeksArray
                    weeksArray = divideDayRangeIntoWeeks(startDate, endDate, splitReferenceIndex);

                    //loop all weeks to save data to `writingScheduleExcelData`
                    for (weeksIndex = 0; weeksIndex < weeksArray.length; weeksIndex += 1) {
                        //initialize `oneWeekData`
                        oneWeekData = $.extend(true, {}, oneWeekDataInitObj);

                        //loop all days in one week
                        for (daysIndex = 0; daysIndex < weeksArray[weeksIndex].length; daysIndex += 1) {
                            currentDateInYearMonthDay = weeksArray[weeksIndex][daysIndex];
                            currentDay = moment(currentDateInYearMonthDay);
                            currentWeekdayIndex = currentDay.day();
                            currentWeekdayString = weekdayStringArray[currentWeekdayIndex];

                            //save header
                            oneWeekData.header['%REPORT_HEADER_TEXT%'] = reportHeaderText + weeksArray[weeksIndex][0] + ' to ' + weeksArray[weeksIndex][weeksArray[weeksIndex].length - 1];
                            //use Math.min because when sunday is the last one,it would shoud the wrong  week of the year
                            oneWeekData.header['%WEEKS%'] = Math.min(moment(weeksArray[weeksIndex][0]).week(), moment(weeksArray[weeksIndex][weeksArray[weeksIndex].length - 1]).week());
                            oneWeekData.header['%' + currentWeekdayString + '_DATE%'] = currentDateInYearMonthDay;
                            //save number of day in this week to footer
                            oneWeekData.header.daysNum = weeksArray[weeksIndex].length;

                            //save postLogData
                            if (writingScheduleData.hasOwnProperty(currentDateInYearMonthDay)) {

                                //loop every post in this day
                                writingScheduleData[currentDateInYearMonthDay].map(iterator, oneWeekData);

                            }
                        }

                        //convert postLogData
                        oneWeekData.postLogData = getPostLogDataForExcel(oneWeekData.postLogData);

                        //save one week data to `writingScheduleExcelData`
                        writingScheduleExcelData.push(oneWeekData);
                    }
                    return writingScheduleExcelData;
                }

                //check if param valid
                if (Toolbox.isNull(startDate) || Toolbox.isNull(endDate) || Toolbox.isNull(writingScheduleData)) {
                    Toolbox.assert('Function SocialReport.Operation.getPostLogDataInFacebookByDate generateWritingScheduleExcelData: `writingScheduleData` or `StartDate` or `EndDate` is undefined');
                    return false;
                }
                
                //build `writingScheduleExcelData`
                writingScheduleExcelData = buildWritingScheduleExcelData(moment(startDate), moment(endDate), 1);

                return writingScheduleExcelData;
            },
            
            //build facebook post log data in datatable format
            //return `columnTitle`, `data` and `editorList`
            getPostLogSummaryDataInFacebookByDate: function () {
                var postsDataIn2D = this.getPostsDataIn2DArray(),
                    dataSize = this.getSize(),
                    columnTitle = [
                        {
                            title: "Editor"
                        },
                        {
                            title: "Number Of Posts"
                        }
                    ],
                    data = [],
                    editorMemory = {},
                    editorList = {},
                    postIndex,
                    editor;
                //loop `postsDataIn2D` to save number of post to `editorMemory` sort by editor
                for (postIndex = 0; postIndex < dataSize; postIndex += 1) {
                    editor = postsDataIn2D[postIndex][17];
                    //make sure `editorMemory` has attribute name `editor`
                    editorMemory[editor] = (typeof (editorMemory[editor]) !== 'undefined') ? editorMemory[editor] : {
                        postNumber: 0
                    };
                    editorMemory[editor].postNumber += 1;
                }
                //loop the `editorMemory` to set data
                for (editor in editorMemory) {
                    if (editorMemory.hasOwnProperty(editor)) {
                        data.push([editor, editorMemory[editor].postNumber]);
                        editorList[editor] = editor;
                    }
                }

                return {
                    data: data,
                    columnTitle: columnTitle,
                    editorList: editorList
                };
            },
            
            //return an array contain all the date between start date and end date order by asc
            buildDurationDateInArray: function () {
                var dateStart = moment(this.getOptions('dateStart')),
                    dateEnd = moment(this.getOptions('dateEnd')),
                    dateIndex = moment(dateStart),
                    durationArr = [];
                //loop until reach the dateEnd
                while (!dateIndex.isAfter(dateEnd)) {
                    durationArr.push(dateIndex.format('YYYY-MM-DD'));
                    dateIndex.add(1, 'days');
                }
                return durationArr;
            },
            
            //build facebook post size by date
            //return `labelArr` and `dataArr` and `numberOfPost`(total post size)
            getPostSizeByDateInFacebook: function () {
                var postsData = this.getData('postsData'),
                    classifiedPostsData = this.ClassifyJson(postsData, 'created_time'),
                    labelArr = this.buildDurationDateInArray(),
                    dataArr = [],
                    label = '',
                    size = 0,
                    dateKey = '',
                    numberOfPost = 0;
                for (label in labelArr) {
                    if (labelArr.hasOwnProperty(label)) {
                        //`dateKey` is one of the duration date between dateStart and dateEnd
                        dateKey = labelArr[label];
                        //if classifiedPostsData has `date`
                        if (classifiedPostsData[dateKey]) {
                            size = Toolbox.getObjectSize(classifiedPostsData[dateKey]);
                            dataArr.push(size);
                            numberOfPost += size;
                        } else {
                            dataArr.push(0);
                        }
                    }
                }
                return {
                    labelArr: labelArr,
                    dataArr: dataArr,
                    numberOfPost: numberOfPost
                };
            },
            
            //build facebook avg reach by post number
            //return `labelArr` and `dataArr` and `avgReachByPost`(total reach over post)
            getAvgReachByPostNumberInFacebook: function () {
                var postsData = this.getData('postsData'),
                    classifiedPostsData = this.ClassifyJson(postsData, 'created_time'),
                    labelArr = this.buildDurationDateInArray(),
                    dataArr = [],
                    label = '',
                    size = 0,
                    reach = 0,
                    dateKey = '',
                    postIndex = 0,
                    totalSize = 0,
                    totalReach = 0;
                for (label in labelArr) {
                    if (labelArr.hasOwnProperty(label)) {
                        //`dateKey` is one of the duration date between dateStart and dateEnd
                        dateKey = labelArr[label];
                        reach = 0;
                        //make sure classifiedPostsData has `date`
                        if (classifiedPostsData[dateKey]) {
                            size = Toolbox.getObjectSize(classifiedPostsData[dateKey]);
                            totalSize += size;
                            //loop to get total reach in the same date
                            for (postIndex in classifiedPostsData[dateKey]) {
                                if (classifiedPostsData[dateKey].hasOwnProperty(postIndex)) {
                                    reach += (classifiedPostsData[dateKey][postIndex].post_impressions_unique || 0);
                                }
                            }
                            dataArr.push(Math.round(reach / size));
                            totalReach += reach;
                        } else {
                            dataArr.push(0);
                        }
                    }
                }
                return {
                    labelArr: labelArr,
                    dataArr: dataArr,
                    avgReachByPost: Math.round(totalReach / totalSize)
                };
            },
            
            //build facebook avg page fan like
            //return `labelArr` and `dataArr` and `avgPageFansLike`(total pagefanslike over dayrange)
            getAvgPageFanLikeInFacebook: function () {
                var reachData = this.getData('reachData'),
                    pageFansData = reachData.page_fans,
                    labelArr = this.buildDurationDateInArray(),
                    dataArr = [],
                    label = '',
                    key = '',
                    dateKey = '',
                    pageFansObj = {},
                    pageFansObjKey = '',
                    pageFansSummary = 0,
                    dayRange = this.getDayRange();
                //get pageFansObj whose key is date and value is pageFansLike
                for (key in pageFansData) {
                    if (pageFansData.hasOwnProperty(key)) {
                        pageFansObjKey = pageFansData[key].end_time.substring(0, 10);
                        pageFansObj[pageFansObjKey] = pageFansData[key].value;
                    }
                }
                for (label in labelArr) {
                    if (labelArr.hasOwnProperty(label)) {
                        //`dateKey` is one of the duration date between dateStart and dateEnd
                        dateKey = labelArr[label];
                        if (pageFansObj[dateKey]) {
                            dataArr.push(pageFansObj[dateKey]);
                            pageFansSummary += pageFansObj[dateKey];
                        } else {
                            dataArr.push(0);
                        }
                    }
                }
                return {
                    labelArr: labelArr,
                    dataArr: dataArr,
                    avgPageFansLike: Math.round(pageFansSummary / dayRange)
                };
            },
            
            //internal function to filter data of `origin2DArray` by specified element
            //`FilterIndex` is the index of the specified element
            //only return the data whose value is equal with `FilterKeyword`
            //when `filterKeywork` is 'all', return the whole `origin2DArray`
            filter2DArrayBySpecifiedElement: function (Origin2DArray, FilterIndex, FilterKeyword) {
                var filterIndex = FilterIndex || 0,
                    filterKeywork = FilterKeyword || 'all',
                    origin2DArray = Origin2DArray,
                    key,
                    resultArr = [];

                if (!Toolbox.is2DArray(origin2DArray)) {
                    Toolbox.assert('Function SocialReport.Operation.filter2DArrayBySpecifiedElement： `Origin2DArray` is not a 2DArray');
                    return origin2DArray;
                }

                //when `filterKeywork` is 'all', return the whole `origin2DArray`
                if (filterKeywork === 'all') {
                    return origin2DArray;
                }

                for (key = 0; key < origin2DArray.length; key += 1) {

                    if (origin2DArray[key][filterIndex] === filterKeywork) {
                        resultArr.push(origin2DArray[key]);
                    }
                }

                return resultArr;
            },

            //internal function to get postsData in two dimension array format
            getPostsDataIn2DArray: function () {
                //set the variable for looping
                var postsData = this.getData('postsData'),
                    dataSize = this.getSize(),
                    data = [],
                    postIndex = 0,
                    postArr = [],
                    type,
                    like,
                    love,
                    haha,
                    wow,
                    sorry,
                    anger,
                    reactionsTotal,
                    vieworplay,
                    linkClick,
                    otherClick,
                    postsClickTotal,
                    paidReached,
                    totalReached,
                    paidImpressions,
                    totalImpressions,
                    author;
                //loop to set a two dimension array to get datatable data
                for (postIndex = 0; postIndex < dataSize; postIndex += 1) {
                    //some middle variable
                    postArr = [];
                    type = postsData[postIndex].type;
                    author = postsData[postIndex].authorName;
                    like = postsData[postIndex].like || 0;
                    love = postsData[postIndex].love || 0;
                    haha = postsData[postIndex].haha || 0;
                    wow = postsData[postIndex].wow || 0;
                    sorry = postsData[postIndex].sorry || 0;
                    anger = postsData[postIndex].anger || 0;
                    reactionsTotal = like + love + haha + wow + sorry + anger;
                    vieworplay = ((type === 'video') ? postsData[postIndex]['video play'] : postsData[postIndex]['photo view']) || 0;
                    linkClick = postsData[postIndex]['link clicks'] || 0;
                    otherClick = postsData[postIndex]['other clicks'] || 0;
                    postsClickTotal = vieworplay + linkClick + otherClick;
                    paidReached = postsData[postIndex].post_impressions_paid_unique;
                    totalReached = postsData[postIndex].post_impressions_unique;
                    paidImpressions = postsData[postIndex].post_impressions_paid;
                    totalImpressions = postsData[postIndex].post_impressions;
                    //set data in `postArr` in order
                    postArr.push(postsData[postIndex].id);
                    postArr.push('<a href="' + postsData[postIndex].permalink_url + '" target="_blank">' + postsData[postIndex].permalink_url + '</a>');
                    postArr.push('<div class="post_message">' + (postsData[postIndex].message) + '</div>');
                    postArr.push(postsData[postIndex].type);
                    postArr.push(postsData[postIndex].created_time);
                    postArr.push((totalReached - paidReached).toLocaleString());
                    postArr.push(paidReached.toLocaleString());
                    postArr.push(totalReached.toLocaleString());
                    postArr.push(postsData[postIndex].like.toLocaleString());
                    postArr.push(postsData[postIndex].shares.toLocaleString());
                    postArr.push(postsData[postIndex].comments.toLocaleString());
                    postArr.push(postsData[postIndex].post_video_views.toLocaleString());
                    postArr.push('<p><label>' + reactionsTotal.toLocaleString() + '</label></p>' + '<p><i class="fa fb_icon fb_like" title="like"></i><span> ' + like.toLocaleString() + '</span></p> ' + '<p><i class="fa fb_icon fb_love" title="love"></i><span> ' + love.toLocaleString() + '</span></p>' + '<p><i class="fa fb_icon fb_haha" title="haha"></i><span> ' + haha.toLocaleString() + '</span></p>' + '<p><i class="fa fb_icon fb_wow" title="wow"></i><span> ' + wow.toLocaleString() + '</span></p>' + '<p><i class="fa fb_icon fb_sad" title="sad"></i><span> ' + sorry.toLocaleString() + '</span></p>' + '<p><i class="fa fb_icon fb_anger" title="anger"></i><span> ' + anger.toLocaleString() + '</span></p>');

                    postArr.push('<p><label>' + postsClickTotal.toLocaleString() + '</label></p>' + '<p><label>' + ((type === 'video') ? 'Clicks to Play:' : 'Photo Views:') + '</label><span> ' + vieworplay.toLocaleString() + '</span></p>' + '<p><label>Link Clicks:</label><span> ' + linkClick.toLocaleString() + '</span></p>' + '<p><label>Other Clicks:</label><span> ' + otherClick.toLocaleString() + '</span></p>');
                    postArr.push((totalImpressions - paidImpressions).toLocaleString());
                    postArr.push(paidImpressions.toLocaleString());
                    postArr.push(totalImpressions.toLocaleString());
                    postArr.push(postsData[postIndex].authorName);
                    //push in data array
                    data.push(postArr);
                }
                return data;
            },

            //internal function to sort postsData
            sortPostsData: function (Index) {
                //`Index` is the reference for sorting
                var index = Index || 7,
                    originPostsData = this.getPostsDataIn2DArray(),
                    resultPostsData = [];
                //a sort function for sorting
                function sortByIndex(a, b) {
                    var arrayB = b[index].replace(',', ''),
                        arrayA = a[index].replace(',', '');
                    return arrayB - arrayA;
                }
                //a sort function sort by date
                function sortByDate(a, b) {
                    var isBefore = moment(a[index]).isBefore(b[index]),
                        isSame = moment(a[index]).isSame(b[index]);
                    if (isBefore) {
                        return 1;
                    } else if (isSame) {
                        return 0;
                    } else {
                        return -1;
                    }
                }
                //Index is '4' meaning we sort by date
                if (index === 4) {
                    resultPostsData = originPostsData.sort(sortByDate);
                } else {
                    resultPostsData = originPostsData.sort(sortByIndex);
                }

                return resultPostsData;
            },

            //internal function to get summary of postsData
            getPostsDataSummary: function () {
                var originData = this.getData('postsData'),
                    dataSize = this.getSize(),
                    summary = [],
                    postIndex = 0,
                    postKey;
                //loop to get the summary of the posts data
                for (postIndex = 0; postIndex < dataSize; postIndex += 1) {
                    for (postKey in originData[postIndex]) {
                        if (originData[postIndex].hasOwnProperty(postKey)) {
                            //make sure `value` is integer
                            if (!isNaN(originData[postIndex][postKey])) {
                                //if summary[postKey] is not exist 
                                if (typeof summary[postKey] === 'undefined') {
                                    //init it 0
                                    summary[postKey] = 0;
                                }
                                summary[postKey] = summary[postKey] + parseInt(originData[postIndex][postKey], 0);
                            }
                        }
                    }
                }
                return summary;
            },
            
            //build an object which classify by `Attr`
            //input a json and attribute Name, return an object classify by attribute value
            //return object format like this:
            //   resultObj = {
            //      classNameOne: [
            //          objectOne, ObjectTwo...
            //      ],
            //      classNameTwo: [
            //           objectthree, objectFour
            //      ]
            //   }
            ClassifyJson: function (Json, Attr) {
                var resultObj = {},
                    className = '';
                //if `Json` is not an array or `Attr` is not a string return an empty object 
                if (!Toolbox.isArray(Json) || !Toolbox.isString(Attr)) {
                    return resultObj;
                }
                //loop the json element to classify
                $.each(Json, function (key, obj) {
                    //make sure `obj` has `Attr` attribute
                    if (obj.hasOwnProperty(Attr)) {
                        //if `Atrr` we need to accurate to day instead of accurate to minute
                        className = (Attr === 'created_time') ? obj[Attr].substring(0, 10) : obj[Attr];
                        //initialize `resultObj[className]` if it is not exist
                        resultObj[className] = (resultObj.hasOwnProperty(className)) ? resultObj[className] : [];
                        resultObj[className].push(obj);
                    } else {
                        Toolbox.assert('Function SocialReport.Operation.ClassifyJson：' + obj + ' is not an object or do not has ' + Attr + ' attribute');
                    }
                });
                return resultObj;
            },

            //get data size
            getSize: function () {
                var data = this.getData('postsData') || {},
                    type = (typeof data).toLowerCase();
                type = type === 'object' ? (Toolbox.isArray(data) ? 'array' : 'object') : type;

                switch (type) {
                case 'string':
                    return data.length;
                case 'array':
                    return data.length;
                case 'object':
                    return this.getObjectSize(data);
                default:
                    return 0;
                }
            },

            //internal function which is to get the Object size
            getObjectSize: function (Obj) {
                var size = 0,
                    obj = Obj || {},
                    key;
                //Object.keys could not support under IE9
                if (!!Object.keys) {
                    size = Object.keys(obj).length;
                } else {
                    for (key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            size += 1;
                        }
                    }
                }
                return size;
            }
        });


        return SocialReport;
    }());


}(jQuery, window, document, moment, Chart));
