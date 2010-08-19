window.topline    = null;
window.bottomline = null;
window.stack      = [];

timer = (typeof timer == "undefined") ? (function(){

    var timer = {};

    var timeout = null;
    var started = false;

    timer.busy = function() {
        return started; 
    }

    timer.stop = function() {

        if (timeout) {
            clearTimeout( timeout );
            timeout = false;
        }

        started = false;
    }

    timer.callibrate = function(callback) {

        timer.collect(1, function() {
            var arr = stack;
            var map = {};

            for (var i=0;i < arr.length;i++) {
               var c = arr[i]; 
                if (map[c]) {
                    map[c]++;
                } else {
                    map[c] = 1; 
                }
            }

            var u = arr.length / 100;

            var maxline, 
                minline,
                above = [],
                all   = [];

            for (var i in map) {
                var c   = map[i];
                var per = c / u;
                all.push([ per, i ]);
            }

            all.sort(function(a,b){
                var one = a[0];
                var two = b[0];
                if (one > two) {
                    return -1;
                } else if (one < two) {
                    return 1;
                }
                return 0;
            });

            var one = all[0];
            var two = all[1];

            above = all.length ? [ one[1], all.length == 1 ? one[1] : two[1] ] : [];
            above.sort();

            minline = above[0];
            maxline = above[1];
            
            if (maxline!=null && minline!=null) {

                topline    = maxline;
                bottomline = minline;

                callback && callback();
            } else {
                alert('scream');
            }
        });
    }

    timer.collect = function(sec, callback) {

        if (started) { return; }

        started = true;

        var counter = 0;

        if (sec) {
            // limited version
            var sum = sec * 1000;

            var nr = ~~(sum / (topline ? topline : 1));

            // allocating approx number of items in array
            // not to load CPU with dynamic arrray
            stack = new Array(nr);

            var i = 0;
            (function() {

                var scope = arguments.callee;
                var s = (+new Date());
                
                timeout = setTimeout(function(){
                    var e = (+new Date());
                    var offset = e-s;

                    counter += offset;

                    stack[i++] = ( offset );

                    if (counter < sum) {
                        scope();
                    } else {
                        timer.stop();
                        // cleaning the rest
                        while(stack.length) {
                            if (stack[stack.length-1] != null) {
                                break;
                            }
                            stack.pop();
                        }

                        if (callback) { 
                            callback();
                        } 
                    }
                },0);
            })();
        } else {
            stack = [];
            (function scope() {
                var s = (+new Date());
                if (started) {
                    timeout = setTimeout(function(info){
                        var e = (+new Date());
                        var offset = e - s;
                        stack.push( offset );
                        scope();
                    }, 0);
                }
            })();
        }

        return stack;
    }


    // 1. check how 0 works
    //  - collecting the offset between timeouts
    //  - based on loadtime you can define what js is doing
    //  - building simple rendering stuff to show the gaps and hops
    //
    // * every browser has it's own baseline, write callibrate
    //
    // *. looking at the line
    //  - js keeps doing something, in firefox for example you can see firefox keep having peeks 
    //  - chrome is stable as statue
    //
    //
    // * full picture with intercept
    //   - graph in firefox shows are the reality
    //
    // *. Way to render things runtime
    //  - doing this in different window, but still to descover if it has effect on performance of parent window ( interval intercept inside window ) : 
    //  - chrome nature to be thread isoluated shows it really nice in a graph
    //  - firefox is attacked by the window performance ( 10 secs approcimitly 10 hops );
    //  
    // * Still trying to make progress bar by callculating the ms it took to build previous bar
    //  - it reflects cpu ussage of firefox
    //  - it's not always visible what kind of execution happening with monitor
    //  - using a usage line is better to see how engine behavouse with timer (drag and drop of the widow, resize);

    return timer;
})() : timer;

