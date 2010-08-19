window.view = {
    nodes : {
    timer : null,
        timer_sec : null,
        monitor : null,
        code : null,
        do_nothing_button : null
    },
    enable : function(bt) {
         var node = this.nodes[bt];
         if (node) {
             node.disabled = false;
         }
    },
    disable : function(bt) {
        var node = this.nodes[bt];
        if (node) {
            node.disabled = true;
        }
    },
    caption : function(bt,str) {
        var node = this.nodes[bt];
        if (node) {
            node.innerHTML = str;
        }
    },
    value : function(node) {
        var node = this.nodes[node];
        return (node) ?  node.value : null;
    }
};

window.controller = {
    states : {},

    state : function(sys, v) {
        if (v == null) {
            return this.states[sys];
        } else {
            this.states[sys] = ~~v;
        }
    },	

    'swit4' : function(sys) {
        var non = sys + "_switch";
        var fc = this[non];
        if (fc) {
            this[non]();
        }
    },

    monitor_switch : function() {
        var is = this.state('monitor');
        this.state( 'monitor', !is );

        if (is) {
            progress.stop();

            view.enable('timer');
            view.caption('monitor','Start');
            view.caption('timer','Start');
        } else {
            progress.collect();

            view.disable('timer');
            view.caption('timer','Stop');
            view.caption('monitor','Stop');
        }
    },

    timer_switch : function() {

        var is = this.state( 'timer' );
        this.state( 'timer', !is );

        if (is) {
            view.caption( 'timer', 'Start' );
            timer.stop();	
        } else {
            view.caption( 'timer', 'Stop' );

            var sec = view.value('timer_sec');
            if (!sec || isNaN( sec )) {
                timer.collect();                                               
            } else {
                view.disable('timer');
                timer.collect(Number(sec), function() {
                    controller.timer_switch();
                    view.enable( 'timer' );
                });
            }
        }
    },
    
    intercept : function() {
        var code = view.value('code');
        eval( code );
    },

    nothing : function() {
        var is = this.state('nothing');
        this.state('nothing', !is);
        view.caption('nothing', is ? 'Do Nothing' : 'Do Something');
    },

	flashback_switch : function() {
        var is = this.state('flashback');
        this.state('flashback', !is);

        if (is) {
            flashback.stop();
            view.caption("flashback", "Start");
            view.enable("timer");
            view.enable("monitor");
        } else {
            flashback.collect();
            view.caption("flashback", "Stop");
            view.disable("timer");
            view.disable("monitor");
        }
    }
}
