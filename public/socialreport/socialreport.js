//SocialReport.js

//It is dependent on jQuery.
//It has three subclassess: Data, vVew and Operation

;
(function ($, window) {
    window.SocialReport = function () {
        var SocialReport = {};

        //SocialReport.Data
        //-----------------

        //Data class is designed to get the facebook and google data by ajax.
        var Data = SocialReport.Data = {};

        //url for get data from server
        Data.url = '';

        //wrap ajax
        Data.ajax = function (data, options) {
            $.ajax({
                url: options.url || Data.url,
                type: options.type || 'GET',
                data: data,
                dataType: options.datatype || 'json',
                success: options.success || '',
                error: options.error || ''
            });
        };

        //get data from server by ajax.
        Data.get = function (data, options) {
            Data.ajax(data, options || '');
        };

        //post data to server by ajax.
        Data.post = function (data, options) {
            Data.ajax(data, options || '');
        };

        //update the whole data to server.
        Data.put = function (data, options) {
            //use Data.post for now, do not figure out the best way to simulate RESTful api.
            Data.post(data, options);
        };

        //update the property of data to server.
        Data.patch = function (data, options) {
            //use Data.post for now, do not figure out the best way to simulate RESTful api.
            Data.post(data, options);
        };

        //delete data from server by ajax simulate RESTful api.
        Data.delete = function (data, options) {
            //use Data.post for now, do not figure out the best way to simulate RESTful api.
            Data.post(data, options);
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
            type = type === 'object' ? (Operation._isArray(data) ? 'array' : 'object') : type;

            switch (type) {
                case 'string':
                    return data.length;
                    break;
                case 'array':
                    return data.length;
                    break;
                case 'object':
                    return Operation._getObjectSize(data);
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
