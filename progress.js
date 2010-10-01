progress = (typeof progress == "undefined") ? (function() {

    var progress = {};

    var rest   = 0;
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

    progress.build  = function(node) {
		var background = "black";

		var container = typeof node == "string" ? document.getElementById( node ) : node;

		var style = container.style;
		style.backgroundColor = background;
		style.width = "128px";
		style.height  = "64px";
		style.margin = "1px";
		style.overflow = "hidden";
		style.position = "relative";

		var leader = container.appendChild(document.createElement("span"));

		var style             = leader.style;
		style.height          = "100%";
		style.width           = "2px";
		style.display         = "inline-block";
		style.backgroundColor = background;

		var hiding = container.appendChild(document.createElement("div"));

		var style             = hiding.style;
		style.backgroundColor = background;
		style.position        = "absolute";
		style.width           = "100%";
		style.height          = "1%";
		style.bottom          = 0;

		var frag = document.createDocumentFragment(),
			clone = document.createElement("span"),
			style = clone.style;

		clone.className = "ACM_graphUnit"; 

		style.width       = "5px";
		style.height      = "1%";
		style.marginRight = "2px";
		style.padding     = 0;
		style.display     = "inline-block";
		style.backgroundColor = "yellow";

        for (var i=0; i<18; i++) {
            blocks.unshift( 
				frag.appendChild( clone.cloneNode(true) ) 
			);
        }

		container.appendChild( frag );
    }

    progress.do_next = function(height){
        var last   = blocks.pop(),
			parent = last.parentNode;

        blocks.unshift( last );

		parent.removeChild( last );

        // 1% is not visible, so, add every where +1
		last.style.height = ((height) >= 100 ? 100 : ++height) + "%"; // to keep showing something;

        parent.appendChild( last );
    }

    progress.do_test = function() {
        var counter = blocks.length;
        setTimeout(function scope(){
            var r = ~~(Math.random() * 100);
            this.do_next( r );
            if (--counter) {
                setTimeout( scope, 1000 );
            }
        },1000);
    }


    progress.push = function( arr, time ) {

        var values = getvalues( arr );

        // if result of the arr is bigger than the interval, calculate the rest:
        var result = values.r + rest;

        // console.debug('Progress result is',result,'perc',values.p);

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
        timer.collect();
        collector.start( progress );
    }

    progress.stop = function() {
        timer.stop();
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
            if (arr.length) {
                window.stack = [];
                indicator.push( arr, t );
            }
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
