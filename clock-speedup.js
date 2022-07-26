// Simulate a faster Date object.
// For example, if you wait one second, the date object could report a time difference of 10 seconds.
// Only the Date object will be affected, not setTimeout or setInterval.
// When creating a new Date object with year/month/day values but no time values the real time will be used as the result time, not the fake time.

(function(){

    // from https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/prototype#Methods
    // Can't get the list from the Date object because of DontEnum
    var dateInstanceMethods = [
        "getDate", "getDay", "getFullYear", "getHours", "getMilliseconds",
        "getMinutes", "getMonth", "getSeconds", "getTime", "getTimezoneOffset",
        "getUTCDate", "getUTCDay", "getUTCFullYear", "getUTCHours",
        "getUTCMilliseconds", "getUTCMinutes", "getUTCMonth", "getUTCSeconds",
        "getYear", "setDate", "setFullYear", "setHours", "setMilliseconds",
        "setMinutes", "setMonth", "setSeconds", "setTime", "setUTCDate",
        "setMonth", "setSeconds", "setTime", "setUTCDate", "setUTCFullYear",
        "setUTCHours", "setUTCMilliseconds", "setUTCMinutes", "setUTCMonth",
        "setUTCSeconds", "setYear", "toDateString", "toISOString", "toJSON",
        "toGMTString", "toLocaleString", "toLocaleFormat", "toLocaleString",
        "toLocaleTimeString", "toString", "toTimeString", "toUTCString",
        "valueOf"];

    var NativeDate = window.Date;
    var startDate = new NativeDate();
    var speedupFactor = 1;
    var factorAdjustment = 0; // used when the speedup factor changes and the startDate is reset....

    var CustomDate = function(){
        var args = [].slice.apply(arguments);
        var definedArgs = []; // need to filter because we use `args.join` later
        for (var i=0; i< args.length; i++)
        {
            if (args[i] !== undefined)
            {
                definedArgs.push(args[i]);
            }
        }
        var args = definedArgs

        if (! (args[0] instanceof CustomDate))
        {
            var argString;
            if (typeof args[0] === "string") // Date constructor accepts strings too...
            {
                argString = '"' + args[0].replace(new RegExp('\"'), "\\\"") + '"';
            }
            else
            {
                argString = args.join(",");
            }
            var F = function(){};
            F.prototype = NativeDate.prototype;
            this.internalDate = new NativeDate()
            this.internalDate.constructor.apply(this.internalDate, args);
        }
        else
        {
            this.internalDate = new NativeDate(args[0].internalDate);
        }

        if (args.length === 0) // adjust to fake "now"
        {
            var realNowValue = this.internalDate.valueOf();
            var millisecondsSinceStart = realNowValue - startDate.valueOf();
            var fakeNowValue = realNowValue + factorAdjustment + millisecondsSinceStart * (speedupFactor -1); // -1 because realNowVal already contains the real time difference
            this.internalDate = new NativeDate(fakeNowValue);
        }
    };

    for (var i=0; i<dateInstanceMethods.length; i++)
    {
        (function(){ // wrap in closure to keep scope
            var methodName = dateInstanceMethods[i];
            CustomDate.prototype[methodName] = function(){
                return this.internalDate[methodName].apply(this.internalDate, arguments);
            };
        })();
    }

    // Static methods...
    CustomDate.now = function(){
        return new CustomDate();
    };
    CustomDate.parse = function(str){
        var date = new CustomDate(str);
        return date.valueOf();
    };
    CustomDate.UTC = function(year, month, date, hrs, min, sec, ms){
        var data = new CustomDate(year, month, date, hrs, min, sec, ms);
        return data.valueOf();
    };
    // -----------------

    CustomDate.NativeDate = NativeDate;
    CustomDate.setSpeedupFactor = function(factor){
        factorAdjustment = new CustomDate().valueOf() - startDate.valueOf();
        startDate = new NativeDate();
        speedupFactor = factor;
    };

    var showUi = true; // set to false by hideUi, in case document ready is triggered after calling hideUi
    if (window.jQuery)
    {
        var $ = window.jQuery;
        var container = $("<div>")
            .css({
                "position": "absolute",
                "bottom": "1px",
                "padding": "10px",
                "background": "#eee",
                "border": "1px solid #999",
                "left": "1px"
            })
            .prop("title", "Use Date.hideUi() to hide this programmatically.");
        var nowDiv = $("<div>")
            .css("display", "inline-block");
        container.append(nowDiv);
        var increaseSpeedupButton = $("<button>")
            .css("display", "inline-block")
            .css("margin-left", "10px")
            .click(function(){
                CustomDate.setSpeedupFactor(speedupFactor * 2);
                speedupFactorInfo.text(speedupFactor + "x");
            })
            .text("+");
        var decreaseSpeedupButton = $("<button>")
            .css("display", "inline-block")
             .click(function(){
                CustomDate.setSpeedupFactor(speedupFactor / 2);
                speedupFactorInfo.text(speedupFactor + "x");
            })
            .text("-");
        var speedupFactorInfo = $("<div>")
            .css({"display": "inline-block",
                "margin-left": "2px",
                "margin-right": "2px",
                "text-align": "center",
                "min-width": "48px" // avoid buttons moving away from under the cursor
                })
            .text(speedupFactor + "x");
        var hideUiButton = $("<button>")
            .css("display", "inline-block")
            .css("font-size", "10px")
            .css("margin-left", "10px")
            .click(function(){
                CustomDate.hideUi();
            })
            .text("Close");

        container.append(decreaseSpeedupButton, speedupFactorInfo, increaseSpeedupButton, hideUiButton);
        var nowDivInterval = setInterval(function(){
            var now = new CustomDate();

            var month = now.getMonth() + 1;
            if (month < 10){
               month = '0' + month;
            }
            var day = now.getDate();
            if (day < 10){
               day = '0' + day;
            }
            nowDiv.text(now.getFullYear() + "-" + (month) + "-" +
                day + " "+ now.toTimeString().split(" ")[0]);
        }, 200);

        $(document).ready(function(){
            if (showUi)
            {
                $("body").append(container);
            }
        })
    }

    CustomDate.hideUi = function(){
        container.remove();
        showUi = false;
    };

    window.Date = CustomDate;
})()









