window.debug = true;
if(!window.debug) console.log = function(){}
$(document).ready(function(){
    // COLOR CONFIGURATION
    const colors = {};
    colors.RED = "rgb(96, 42, 48)";
    colors.BLUE = "#038A8F";
    colors.YELLOW = "#BE9032";
    colors.ORANGE = "#BB4921";
    colors.get = function(n){
        //lazy hard coding...
        if(n > 4) return;
        if (n == 1) return colors.RED;
        if (n == 2) return colors.BLUE;
        if (n == 3) return colors.YELLOW;
        if (n == 4) return colors.ORANGE;
        return null;
    }
    colors.CURRENT = colors.RED;

    //SETTINGS CONFIGURATION
    const settings = {};
    settings.CONTAINER = $("#container");
    settings.SELECTION = $("#sel");
    settings.WIDTH = 8; // One box is 75 pixels ; 8 columns
    settings.HEIGHT = 10; // One box is 75 pixels ; 4 rows

    //GAME STATE
    const state = {};
    state.MAP = [];
    state.TRIES = 0;

    function init(){
        setupGrid();
        setupEventHandlers();
    }

    //Setting up onclick events
    function setupEventHandlers(){
        const color_selectors = $("#sel div");
        color_selectors.each(function(i,v){
            $(v).on('click', function(a){
                //Lazy hack
                const n = a.target.className.split("-")[1];
                var color = colors.CURRENT = $(v).css('background-color');
                $(color_selectors).css("margin-top", "0");
                $(v).css("margin-top", "2px");////////////;
            })
        });
        //refactor
        const blocks = state.MAP;
        $(blocks).each(function(i,v) {
            $(v).click({i:i} ,handleClick);
        });
    }

    function handleClick(e){
        const pos = indexToPosition(e.data.i);
        recursivelySetColor(null, pos);
        $("#tries").html(state.TRIES);
        state.TRIES++;
    }

    function recursivelySetColor(prevColor, node){
        if(!node) return;

        const x             = node[0];
        const y             = node[1];
        const nodeBlock     = getBlock(x,y);
        const nodeColor     = getColor(nodeBlock);

        if(colorsEqual(nodeColor, colors.CURRENT)){
            return;
        }

        //Making sure that prevNodeColor is not null
        if(prevColor && !colorsEqual(prevColor, nodeColor)) {
            return;
        }

        colorize(nodeBlock);
        const _ = getNeighbours(x,y);

        _.map((v,i) => {
            recursivelySetColor(nodeColor, v);
        })
    }

    function getBlocks(arr){
        return arr.map(getBlock);
    }

    function getBlock(x,y){
        const width = settings.WIDTH;
        return state.MAP[width*y + x];
    }

    function indexToPosition(i){
        const width = settings.WIDTH;
        with (Math){
            const y = Math.floor(i / width);
            const x = Math.floor(i % width);
        }
        return [x,y];
    }

    function colorize(element){
        $(element).css('background-color', colors.CURRENT);
    }

    function blocksHaveSameBGColor(block1, block2){
        return colorsEqual(getColor(block1), getColor(block2));
    }

    function colorsEqual(color1, color2){
        return color1 === color2;
    }

    function getColor(block){
        return block.css('background-color');
    }

    // Integer -> Integer -> [[Integer]]
    function getNeighbours(x,y){
        if (typeof x !== 'number') {
            console.error(x);
        }
        if (typeof y !== 'number') {
            console.error(y);
        }
        const width = settings.WIDTH;
        const map = state.MAP;
        const curr = getBlock(x,y)

        const up = [x, y-1];
        const down = [x, y+1];
        const left = [x-1, y];
        const right = [x+1, y];

        const neighbours = [];

        if(notOutsideOfBorders(up))    neighbours.push(up);
        if(notOutsideOfBorders(down))  neighbours.push(down);
        if(notOutsideOfBorders(left))  neighbours.push(left);
        if(notOutsideOfBorders(right)) neighbours.push(right);

        return neighbours;
    }

    function outOfBorders(block){
        const x = block[0];
        const y = block[1];
        const width = settings.WIDTH;
        const height = settings.HEIGHT;
        return (x < 0 || x > width-1 ) ||
            (y < 0 || y > height-1);
    }

    function notOutsideOfBorders(block){
        return !outOfBorders(block);
    }

    function setupGrid(){
        const width = settings.WIDTH;
        const height = settings.HEIGHT;
        for (i = 0; i < height; i++) {
            var e = settings.CONTAINER.append("<div class='row'/>");
            for (l = 0; l < width; l++) {
                var r = random(4)
                var block = $("<div class='n-"+ r +"'/>");
                $(e).append(block);
                //magical 2D да да
                state.MAP[width * i+l] = block;
            }
        }
    }

    function random(n) {
        var r = null;
        with(Math) {
            r = floor(random() * n) + 1
        }
        return r;
    }

    //init
    init();

    if(window.debug){
        //Click something cause can't bother to move my mouse
        with(Math){
            $(state.MAP[floor(random() * state.MAP.length)]).click();
        }
    }
});
