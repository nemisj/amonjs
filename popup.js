popup = (typeof popup == "undefined") ? (function(){
    var popup = {};
    var win;

    popup.open = function() {
       window.open("index.html","child"); 
    }

    popup.collect = function() {

        // passing callibration info
        win.topline    = topline;
        win.bottomline = bottomline;

        win.progress.collect();

        collector.start( this );
    }

    popup.stop = function() {
        win.progress.stop();

        collector.stop();

        // win.close();
    }

    popup.push = function(arr) {

        if (win) {
            win.stack = arr;
        }
    }
   
    return popup;
})() : popup;
