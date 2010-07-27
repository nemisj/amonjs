progress = (typeof progress == "undefined") ? (function() {

    var progress = {};

    var blocks = [];

    var getvalues = function(arr) {

        var result = 0;
        var sum = 0;

        var b = (+bottomline);
        for(var i=0;i<arr.length;i++) {
            var offset = (+arr[i]);

            if (offset < bottomline) {
                // simultanious activity
                result += b;
            } else if( offset > topline) {
                // high activity, making wider
                result += offset;
            } else {
                // no activity
            } 

            sum += offset;
        }

        var unit = sum / 100;

        var line = result ? result / unit : 0;

        return {
            // 'p' can be bigger than 100
            // because bottomline is used as replacement for "< bottom"
            p : line > 100 ? 100 : line,
            r : result
        }
    }

    progress.build  = function() {
        var container = document.getElementById('progressbox');
        container.className = "progressbox";
        container.appendChild(document.createElement("span")).className = "lead";

        for (var i=0; i<18; i++) {
            var span = document.createElement("span");
            span.className = "graphUnit"; 
            container.appendChild( span );
            blocks.unshift( span );
        }

    }

    progress.do_next = function(height){

        var last = blocks.pop();
        blocks.unshift( last );

        // 1% is not visible, so, add every where +1
        last.style.height = (++height) + "%"; // to keep showing something;

        var parent = last.parentNode;
        parent.appendChild(parent.removeChild(last));
    }

    progress.do_test = function() {
        var counter = blocks.length;
        setTimeout(function(){
            var r = ~~(Math.random() * 100);
            this.do_next( r );
            if (--counter) {
                setTimeout(arguments.callee,1000);
            }
        },1000);
    }

    var rest = 0;

    progress.push = function( arr, time ) {

        var values = getvalues( arr );

        // if result of the arr is bigger than the interval, calculate the rest:
        var result = values.r + rest;

        console.debug('Progress result is',result,'perc',values.p);

        if (result > time) {
            // how much bigger?
            var count = ~~(result / time); 
            for(var i=0;i<count;i++) {
                this.do_next( 100 );
                result = result - time;
            }

            rest = result;
        } else {
            this.do_next( values.p );
            rest = 0;
        }
    }

    progress.collect = function() {
        collector.start( progress );
    }

    progress.stop = function() {
        collector.stop();
    }

    return progress;

})() : progress;

collector = (typeof collector == "undefined" ) ? (function() {
    var interval;
    var time = 1000;

    var collector = {};

    collector.start = function(indicator) {

        if (interval) {
            debug('Collector already started');
            return;
        }

        var t = time;
        interval = setInterval(function() {
            var arr = window.stack;
            window.stack = [];
            indicator.push( arr, t );
        }, time);
    }

    collector.stop = function() {
        if (interval) {
            clearInterval( interval );	
            interval = null;
        }
    }

    return collector;
})() : collector;
