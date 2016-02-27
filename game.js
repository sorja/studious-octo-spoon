window.debug = true;
$(document).ready(function(){
    // COLOR CONFIGURATION
    const colors = {};
    colors.RED = "#602A30";
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
    settings.HEIGHT = 4; // One box is 75 pixels ; 4 rows

    //GAME STATE
    const state = {};
    state.MAP = [];

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
                var color = colors.CURRENT = colors.get(n);
                $(color_selectors).css("margin", "inital");
                $(v).css("margin-top", "2px");
            })
        });
        //refactor
        const blocks = state.MAP;
        $(blocks).each(function(i,v) {
            $(v).click({i:i} ,handleClick);
        });
    }

    function handleClick(e){
        const pos = {};
        pos.n = e.data.i;
        const width = settings.WIDTH;
        const height = settings.HEIGHT;
        with (Math){
            const n = pos.n;
            const y = Math.floor(n / width);
            const x = Math.floor(n % width);
        }
        const curr = state.MAP[width * y+x];
        //colorize clicked block, even if nothing else happens
        colorize(curr);
        const neighbours = getNeighbours(x,y);
        const neighbourBgColor = curr.css("background-color");
        $(neighbours).each((v,i) => {
            var x2 = i[0];
            var y2 = i[1];

            const neighbour = state.MAP[width * y2+x2];
            const currBgColor = curr.css("background-color");

            if(colorsEqual(currBgColor, neighbourBgColor)){
                colorize(neighbour);
            }
            console.log(neighbour)
        });
    }

    function colorize(element){
        $(element).css('background-color', colors.CURRENT);
    }

    function colorsEqual(color1, color2){
        return color1 == color2;
    }

    // Integer -> Integer -> [[Integer]]
    function getNeighbours(x,y){
        const width = settings.WIDTH;
        const map = state.MAP;
        const curr = state.MAP[width * y+x];
        //for(var i = -1; i < 2; i += 2){
        //    console.log("X+i:", state.MAP[width * y+(x+i)]);
        //    console.log("Y+i:", state.MAP[width * (y+i)+x]);
        //}

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
        const width = settings.WIDTH-1;
        const height = settings.HEIGHT-1;
        return (x < 0 || x > width ) ||
            (y < 0 || y > height);
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
