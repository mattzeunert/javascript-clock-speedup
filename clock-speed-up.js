// Simulate a faster Date object.
// For example, if you wait one second, the date object could report a time difference of 10 seconds.
// Only the Date object will be affected, not setTimeout or setInterval.
// When creating a new Date object with year/month/day values but no time values the real time will be used as the result time, not the fake time.
// This code uses eval and is not save for production! It's meant to simulate real use for debugging purposes.

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
    var startDate = new Date();
    var speedupFactor = 5;
    
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
            // Use eval, because http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
            this.internalDate = eval("new NativeDate(" + argString + ")");
        }
        else
        {
            this.internalDate = new NativeDate(args[0].internalDate);
        }       
        
        if (args.length === 0) // adjust to fake "now"
        {
            var realNowValue = this.internalDate.valueOf();
            var millisecondsSinceStart = realNowValue - startDate.valueOf();
            var fakeNowValue = realNowValue + millisecondsSinceStart * (speedupFactor -1); // -1 because realNowVal already contains the real time difference
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
        speedupFactor = factor;
    };
    
    window.Date = CustomDate;
})()









