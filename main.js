/*
 players:
 black
 white

 cells status:
 empty
 black
 white
 */

/**
 *
 * @param x
 * @param y
 * @constructor
 */
Position = function(x, y){
    this.x = x;
    this.y = y;
    this.getMinusPosition = function(positionFrom, positionTo){
        return new Position(positionFrom.x - positionTo.x, positionFrom.y - positionTo.y);
    }
};

Player = function(name){
    this.name = name;
    this.point = 0;
    this.addPoint = function(){
        this.point++;
    };
    this.drowToHTML = function(){
        var id = 'player_point_'+this.name;

        var player_point_htlm = document.getElementById(id);
        if(player_point_htlm === null) {
            var player_point_htlm = document.createElement("p");
            player_point_htlm.setAttribute('class', 'player point ' + this.name);
            player_point_htlm.setAttribute('id', id);

            var control_panel = document.getElementById("control_panel");
            if(control_panel){
                control_panel.appendChild(player_point_htlm);
            }
        }

        player_point_htlm.innerText = this.point;

    };
    this.drowToHTML();
};

/**
 *
 * @param id
 * @param position
 * @param player
 * @constructor
 */
Figure = function(id, position, player){
    this.id = id;
    this.player = player;
    this.status = 'live';
    this.position = position;

    this.drowToHTML = function(){
        if(typeof position === "undefined") return;

        var cell_htlm = document.getElementById('cell_'+this.position.x+'_'+this.position.y);
        if(cell_htlm != null)
        {
            var figure_html = document.createElement("div");
            figure_html.setAttribute('class', 'figure checker ' + this.player.name);
            figure_html.setAttribute('id', 'figure_'+this.id);
          //  figure_html.setAttribute('onclick', 'Arena.figures.onClick(this)');
            figure_html.setAttribute('onclick', 'game.arena.onClick(this)');

            cell_htlm.appendChild(figure_html);
        }

    };
    this.removeFromHTML = function(){
        if(typeof position === "undefined") return;

        var cell_htlm = document.getElementById('cell_'+this.position.x+'_'+this.position.y);
        var figure_html = document.getElementById('figure_'+this.id);
        if(cell_htlm && figure_html){
            cell_htlm.removeChild(figure_html);
        }
    };

    this.setActiveInHtml = function(){
        var figure_html = document.getElementById('figure_'+this.id);
        figure_html.classList.add("active");
    };
    this.unsActiveInHtml = function(){
        var figure_html = document.getElementById('figure_'+this.id);
        if(figure_html){
            figure_html.classList.remove("active");
        }
    };

    this.onRemove = function(){
        this.status = 'die'
        this.removeFromHTML();
    };
    this.onActive = function(){
        this.status = 'active';
        this.setActiveInHtml();
    };
    this.onDeactive = function(){
        this.status = 'live';
        this.unsActiveInHtml();
    };
    this.onMove = function(position){
        if(position instanceof  Position){
            this.position.x = position.x;
            this.position.y = position.y;
        }
        var figure_html = document.getElementById('figure_'+this.id);

        document.getElementById( 'cell_'+position.x+'_'+position.y ).appendChild( figure_html );

        //$(figure_html ).after("<p>Element was there</p>").appendTo("body");
        //figure_html.setAttribute('id', );
    };
    this.isActive = function(){
        return this.status == 'active';
    };
    this.isLive = function(){
        return this.status == 'live';
    };
    this.isDie = function(){
        return this.status == 'die';
    };
    this.onClick = function(){
        if(this.status=='die'){
            return;
        }
        //var a =1;
        if(this.isActive()){
            this.onDeactive();
        }else{
            this.onActive();
        }


    };

    this.drowToHTML();

};

Cell = function(position, status){
    this.position = position;
    this.status = status;

    this.drowToHtml = function(widthHtml, heightHtml){
        var pole_html = document.getElementById('pole');

        if(typeof pole_html != 'undefined')
        {
            var cell_html = document.createElement("div");
            if(typeof this.position != 'undefined')
            {
                cell_html.setAttribute('id', 'cell_'+this.position.x+'_'+this.position.y);
                cell_html.setAttribute('onclick', 'game.arena.onClick(this)');

                if(typeof widthHtml != 'undefined' && typeof widthHtml != 'undefined'){
                    cell_html.setAttribute('style','top:' +  heightHtml*this.position.y + 'px; left:'+ widthHtml*this.position.x + 'px');
                }
            }
            if(typeof this.status != 'undefined') {
                cell_html.setAttribute('class','bar '+this.status);
            }

            pole_html.appendChild(cell_html);
        }
    };
    this.onClick = function(_obj){

    };

    this.drowToHtml(50,50);
    //  figure_html.setAttribute('onclick', 'Arena.figures.onClick(this)');
};

// --- ROOLS ---

/**
 *
 * @param course Position
 * @param enemy Position
 * @constructor
 */
Rool = function(player, name, course, enemy, nextPlayer){
    this.player = player;
    this.name = name;
    this.course = course;
    this.enemy = enemy;
    this.nextPlayer = nextPlayer;
};

/**
 *
 * @param positionTo
 * @param positionKill
 * @constructor
 */
Action = function(positionTo, positionKill, nextPlayer){
    this.positionTo = positionTo;
    this.positionKill = positionKill;
    this.nextPlayer = nextPlayer;
};

//   -2/-2 |                  |2/-1 |
//  --------------      -------------
//         |-1/-1 |     | 1/-1|
//         --------------------
//                | 0/0 |
//         --------------------
//         |-1/1  |     | 1/1 |
//  ---------------      -------------
//   -2/2  |                   |2/2  |
TurnsRools = function() {
    this.rools = [];

    this.addRool = function(id, value){
        if(typeof id == "undefined" || id === null) {
            return;
        }
        if(value instanceof Rool){
            this.rools[id] = value;
        }
    };

    this.getRool = function(position, currentPlayer){
        if(position instanceof Position && currentPlayer instanceof Player) {
            //var currentRull = Rool;

            for (var prop in this.rools) {
                var rool = this.rools[prop];
                if(rool.course.x === position.x &&
                    rool.course.y === position.y &&
                    rool.player === currentPlayer
                ) {
                    return rool;
                }
            }
        }
        return undefined;
    };

    this.getAction = function(currentPlayer, positionFrom, positionTo){

        if(currentPlayer instanceof Player && positionFrom instanceof Position && positionTo instanceof Position)
        {
            var positionDiff = new Position(Number.parseInt(positionTo.x)-Number.parseInt(positionFrom.x), Number.parseInt(positionTo.y)-Number.parseInt(positionFrom.y));
            var rool = this.getRool(positionDiff, currentPlayer);

            if(rool instanceof Rool){
                var enemy = undefined;
                if(typeof rool.enemy != "undefined"){
                    enemy = new Position(Number.parseInt(positionTo.x) -Number.parseInt(rool.enemy.x) , Number.parseInt(positionTo.y)-Number.parseInt(rool.enemy.y));
                }
                return new Action(positionTo, enemy, rool.nextPlayer);
            }
        }
    };

    this.inRools = function(position){
        if(position instanceof Position){
            var rool = this.getRool(position);
            if(typeof rool != "undefined"){
                return true;
            }
            return false;
        }
    };
};

// --- ARENA ---
/**
 *
 * @param turnsRools
 * @param players
 * @param figures
 * @param cells
 * @constructor
 */
Arena = function(){
    this.width = 7;
    this.height = 7;
    this.cells = [];
    this.figures = [];
    this.players=[];
    this.activePlayer=[];
    this.activeFigure=[];
    this.turnsRools = new TurnsRools;
    this.message = '';

    this.activateNextPlayer = function() {
        if(this.activePlayer == this.players[0]) {
            this.activePlayer = this.players[1];
        } else {
            this.activePlayer = this.players[0];
        }
    };
    this.setActiveFigure = function(figure){
        if(figure instanceof Figure){
            this.activeFigure = figure;
        }

    };

    this.killFigure = function(figure){
        if(figure instanceof Figure){
            figure.onRemove();
            delete this.figures[figure.id];
        }
    };

    this.getActivePlayer = function(){
        if(typeof this.activePlayer == 'undefined'){
            this.activateNextPlayer();
        }
        return this.activePlayer;
    };
    this.setActivePlayer = function(player){
        if(player instanceof Player){
            this.activePlayer = player;
        }
    };
    this.getFigureByXY = function(position){

        if(position instanceof Position){
            for(var index in this.figures)
            {
                var figure = this.figures[index];
                if(figure instanceof Figure){
                    if(figure.isDie()==false &&
                        figure.position.x == position.x &&
                        figure.position.y == position.y){
                        return figure;
                    }
                }
            }
        }
        return undefined;
    };
    this.getFigureById = function(id){
        var figure_id = id.toString().replace('figure_','');

        var figure = this.figures[figure_id];
        if(typeof this.figures != 'undefined'){
            return figure;
        };
    };
    this.unactiveAllFigures = function(player) {
        this.activeFigure = [];
        if(player instanceof Player){
            this.figures.forEach(function(figure, i) {
                figure.onDeactive();
            });
        }else{
            this.figures.forEach(function(figure, i) {
                figure.onDeactive();
            });
        }
    };

    this.getPositionByCellId = function(id){
        var parms = id.split("_");
        if(typeof parms[1] != 'undefined'){
            return new Position(parms[1], parms[2])
        }
    };
    this.addFigure = function(id, figure){
        if(typeof id == "undefined" || id === null) {
            return;
        }
        if(figure instanceof Figure){
            this.figures[id] = figure;
        }
    };
    this.addCell = function(id, value){
        if(typeof id == "undefined" || id === null) {
            return;
        }
        if(value instanceof Cell){
            this.cells[id] = value;
        }
    };
    this.addPlayer = function(id, value){
        if(typeof id == "undefined" || id === null) {
            return;
        }
        if(value instanceof Player){
            this.players[id] = value;
        }
    };
    this.setTurnRool = function(turnsRools){
        if(turnsRools instanceof TurnsRools){
            this.turnsRools = turnsRools;
        }
    };
    this.drowAllToHTML = function(){
        for(var x=0;x<=7;x++ ){
            for(var y=0;y<=7;y++ ){
                var c = this.cells[x+':'+y];
                c.drowToHTML(50,50);
            }
        }
        //this.cells.forEach(function(element,index,array ){
        //    element.drowToHtml(50, 50);
        //});
        this.figures.forEach(function(element,index,array){
            element.drowToHtml();
        });

    };

    // users click on arena
    this.onClick = function(element){

        var id = element.getAttribute('id');
        // figure
        if(hasClass(element, 'figure'))
        {
            var figure = this.getFigureById(id);
            var currentPlayer = this.getActivePlayer();

            // відсікаємо
            if(figure.player != currentPlayer) return;

            this.unactiveAllFigures(currentPlayer);
            figure.onClick();
            if(figure.isActive()){
                this.setActiveFigure(figure);
            }
        } else if(hasClass(element, 'cell')) {
            var positionTo = this.getPositionByCellId(id);
            var positionFrom = this.activeFigure.position;

            if(positionTo instanceof Position &&
               positionFrom instanceof Position)
            {
                // якщо на позиції фігура
                var _figure = this.getFigureByXY(positionTo);
                if(_figure instanceof Figure){ return;}

                // якщо фігура ходить по правилах(Rools)
                var action = this.turnsRools.getAction(this.activePlayer, positionFrom, positionTo);

                if(action instanceof Action){
                    var killFigure = this.getFigureByXY(action.positionKill);
                    if(killFigure instanceof Figure) {
                        if (killFigure.player == this.activePlayer) return;
                        this.killFigure(killFigure);
                        this.activePlayer.addPoint();
                        this.activePlayer.drowToHTML();

                    }

                    this.activeFigure.onMove(action.positionTo);

                    // передаємо хід наступному гравцеві
                    if(typeof action.nextPlayer != "undefined"){
                        this.unactiveAllFigures(this.activePlayer);
                        this.setActivePlayer(action.nextPlayer);
                    }

                }
            }
        }


    };

    hasClass = function( target, className ) {
        return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
    };
};

Game = function(){
    //this.turnsRools = turnsRools;
    //this.players = players;
    //this.cells = cells;
    this.arena=[];

    this.message = '';

    this.newGame = function(arena){
        this.arena = arena;
        //this.arena = new Arena(this.turnsRools, this.players, figures, this.cells);
        this.arena.activePlayer = this.arena.players[0];
        //this.arena.drowAllToHTML()
    };
};

// --- MAIN ---------------------------------------------------------------

arena = new Arena();

arena.addPlayer(0, new Player('white'));
arena.addPlayer(1, new Player('black'));

for(var x=0;x<=7;x++ ){
    for(var y=0;y<=7;y++ ) {
        var status = 'empty';
        //вставляємо клітинки для ходів
        if((x%2==0 && y%2==0) || (x%2!=0 && y%2!=0)) {
            status = 'cell';
        }
        arena.addCell(x+':'+y, new Cell(new Position(x,y), status));
    }
}

figure_white =  {0:{x:1,y:5},1:{x:3,y:5},2:{x:5,y:5},3:{x:7,y:5},4:{x:0,y:6},5:{x:2,y:6},6:{x:4,y:6},7:{x:6,y:6},8:{x:1,y:7},9:{x:3,y:7},10:{x:5,y:7},11:{x:7,y:7}};
for(var i=0;i<12;i++){
    arena.addFigure(i, new Figure(i, new Position(figure_white[i].x, figure_white[i].y), arena.players[0]))
}
figure_black ={0:{x:0,y:0},1:{x:2,y:0},2:{x:4,y:0},3:{x:6,y:0},4:{x:1,y:1},5:{x:3,y:1},6:{x:5,y:1},7:{x:7,y:1},8:{x:0,y:2},9:{x:2,y:2},10:{x:4,y:2},11:{x:6,y:2}};
for(i=0;i<12;i++){
    arena.addFigure(12+i, new Figure(12+i, new Position(figure_black[i].x, figure_black[i].y), arena.players[1]))
}

arena.turnsRools.addRool(0, new Rool(arena.players[0], 'left-up', new Position(-1,-1), undefined, arena.players[1]));
arena.turnsRools.addRool(1, new Rool(arena.players[0], 'right-up', new Position(1,-1), undefined, arena.players[1]));
arena.turnsRools.addRool(2, new Rool(arena.players[0], 'left-up-beat', new Position(-2,-2), new Position(-1,-1)));
arena.turnsRools.addRool(3, new Rool(arena.players[0], 'right-up-beat', new Position(2,-2), new Position(1,-1)));
arena.turnsRools.addRool(4, new Rool(arena.players[0], 'left-down-beat', new Position(-2,2), new Position(-1,1)));
arena.turnsRools.addRool(5, new Rool(arena.players[0], 'right-down-beat', new Position(2,2), new Position(1,1)));

arena.turnsRools.addRool(6, new Rool(arena.players[1], 'left-down', new Position(-1,1), undefined, arena.players[0]));
arena.turnsRools.addRool(7, new Rool(arena.players[1], 'right-down', new Position(1,1), undefined, arena.players[0]));
arena.turnsRools.addRool(8, new Rool(arena.players[1], 'left-up-beat', new Position(-2,-2), new Position(-1,-1)));
arena.turnsRools.addRool(9, new Rool(arena.players[1], 'right-up-beat', new Position(2,-2), new Position(1,-1)));
arena.turnsRools.addRool(10,new Rool(arena.players[1], 'left-down-beat', new Position(-2,2), new Position(-1,1)));
arena.turnsRools.addRool(11,new Rool(arena.players[1], 'right-down-beat', new Position(2,2), new Position(1,1)));

var game = new Game();
game.newGame(arena);