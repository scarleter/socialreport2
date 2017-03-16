//SocialReport.js

//It is dependent on jQuery.
//It has three subclassess: Data, vVew and Operation

;
(function ($, window) {
    window.SocialReport = function () {
        var SocialReport = {};

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

        //View class deal with UI 
        var View = SocialReport.View = {};



        //SocialReport.Operation
        //----------------------

        //Operatioin is a Abstract Data Type which define a pile of functions to help calculate the date from the data class before render by view class
        var Operation = SocialReport.Operation = function (Data, Options) {
            this.data = Data || {};
            this.options = Options || {};
        };

        //get Data
        Operation.prototype.getData = function () {
            return this.data;
        };

        //set Data
        Operation.prototype.setData = function (Data) {
            return this.data = Data || {};
        };

        //get dateRange
        Operation.prototype.getDateRange = function () {
            return this.data.dateRange || 0;
        };

        //set dateRange
        Operation.prototype.setDateRange = function (DateRange) {
            return this.data.dateRange = DateRange || 0;
        };

        //calculate frequency
        Operation.prototype.frequency = function () {
            var dateRange = parseInt(this.data.dateRange),
                size = parseInt(this.getSize());
            if (this.data.dateRange) {
                return Math.float(size / dateRange).toFixed(2);
            } else {
                return 0;
            }
        };

        //get data size
        Operation.prototype.getSize = function () {
            var data = this.data || {},
                type = (typeof data).toLowerCase();
            type = type === 'object' ? (this._isArray(data) ? 'array' : 'object') : type;

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

        };

        //internal function which is to get the Object size
        Operation.prototype._getObjectSize = function (Obj) {
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
        };

        //internal function which check Object is Array
        Operation.prototype._isArray = function (Obj) {
            var obj = Obj || {};
            return Object.prototype.toString.call(obj) === '[object Array]';
        };


        return SocialReport;
    }();


})($, window);

$(function () {
    //set facebook posts request params
    var params = {
        since: 1489075200,
        until: 1489679999,
        pageid: 'easttouchhk',
        access_token: 'EAAFXtii9o4kBAKORsZAcZCj2wSk3cNI1ZC5aXwR5IafH6lfLeBx3y8b8U7EdHPkNot4vzS5R8AJOfiZCHPFt7FZBAoP9fhsao3IlvTEo58tbKrFUOOzD3vIZAqqvdPpjhROoMfwW0EY4fbd7E9sL8rehd95wHXejnOcm4GNeLKKwMT2QUcvCccvsJzDZC1IX5UZD'
    };
    //set facebook posts request callback
    function FBPostsCallback(resp) {
        var postsOperation;
        postsOperation = new SocialReport.Operation(resp);
        console.info(postsOperation.getSize());
    };
    SocialReport.DataInterface.getFacebookPosts(params, FBPostsCallback);


});
