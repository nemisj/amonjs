uline = (typeof uline == "undefined") ? (function(){
    var uline = {};
    var box = null;

    uline.setbin = function(node) {
        box = node;
        box.className = "ulinebox";
    }

    uline.clear = function() {
        box.innerHTML = "";
    }

    uline.dump = function( arr ) {
        box.innerHTML = "";

        var container = document.createElement("div");
        container.appendChild( document.createElement("span")).className = "lead";

        var strNode = document.createElement("div");

        box.appendChild( container );
        box.appendChild( strNode );

        for(var i=0;i<arr.length;i++) {
            var offset = arr[i];

            var div = document.createElement("span");
            var style = div.style;

            div.className = "unit";

            if (offset < bottomline) {
                // simulatinous activity
                style.height = "20px";
            } else if( offset > topline) {
                // high activity, making wider
                style.height = "20px";            
                style.width  = ((~~(offset / topline)) * 2) + "px";
                style.backgroundColor = "red";
            } else {
                // no activity
            } 

            container.appendChild(div);
        }

        strNode.appendChild(document.createTextNode("[ " + arr.join(", ") + " ]"));
    }

    return uline;

})() : uline;
