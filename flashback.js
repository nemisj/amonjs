flashback = (typeof flashback == "undefined") ? (function() {

    var flashback = {};

    var stacks = [];

    flashback.dump = function() {
        console.debug('Number of dumps',stacks.length);

        var s = [];
        // showing in progress
        for (var i=0;i<stacks.length;i++) {
            var current = stacks[i];
            progress.push( current );
            s = s.concat( current );
        }

        // showing in uline
        uline.dump( s );

        return s;
    }

    flashback.get = function() {
        return stacks;
    }

    flashback.push = function( arr ) {
        if (arr.length) {
            stacks.push( arr );
        }
    }
    
    flashback.collect = function() {
        stacks = [];
        collector.start( this );
    }

    flashback.stop = function() {
        collector.stop();
    }

    return flashback;

})() : flashback;
