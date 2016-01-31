Arena = function(){
    this.width = 7;
    this.height = 7;

    this.cells = [];
    this.newGame = function (){
        cells = [];

        //  1 2 3 4 5 6 7 8
        //0 b   b   b   b
        //1   b   b   b   b
        //2 b   b   b   b
        //3   E   E   E   E
        //4 E   E   E   E
        //5   w   w   w   w
        //6 w   w   w   w
        //7   w   w   w   w


        // empty cells
        cells_black = {
            1:{x:0,y:3},
            2:{x:2,y:3},
            3:{x:4,y:3},
            4:{x:6,y:3},
            5:{x:1,y:4},
            6:{x:3,y:4},
            7:{x:5,y:4},
            8:{x:7,y:4}
        };

        for(var i=1;i<=8;i++ )
        {
            this.cells[ cells_black[i].x, cells_black[i].y ] =  new Cell('empty');
        }
        //for(var cell in cells_black)
        //{
        //    this.cells[cell.x,cell.y] =  new Cell('empty');
        //}

        // black checkers
        cells_black ={1:{x:0,y:0},2:{x:2,y:0},3:{x:4,y:0},4:{x:6,y:0},5:{x:1,y:1},6:{x:3,y:1},7:{x:5,y:1},8:{x:7,y:1},9:{x:0,y:2},10:{x:2,y:2},11:{x:4,y:2},12:{x:6,y:2}};
        for(var cell in cells_black)
        {
            this.cells[cell.x,cell.y] = new Cell('black');
        }

        // white checkers
        cells_white =  {1:{x:1,y:5},2:{x:3,y:5},3:{x:5,y:5},4:{x:7,y:5},5:{x:0,y:6},6:{x:2,y:6},7:{x:4,y:6},8:{x:6,y:6},9:{x:1,y:7},10:{x:3,y:7},11:{x:5,y:7},12:{x:7,y:7}};
        for(var cell in cells_white)
        {
            this.cells[cell.x,cell.y] = new Cell('white');
        }
    };

    this.drowPoleToHtml = function(){
        var pole_html = document.getElementById('pole');

        for(var i=0;i<this.width; i++){
            for(var j=0;j<this.height; j++){

                var bar = document.createElement("div");

                if(typeof this.cells[i,j] != 'undefined'){
                    bar.setAttribute('class','bar cell');
                    bar.setIdAttribute('cell_'+j+'_'+i,true);
                } else {
                    bar.setAttribute('class','bar');
                }

                pole_html.appendChild(bar);
            }
        }

        var cell_element;
    }

    this.go = function(){

    }
}/**
 * Created by snenko on 25.01.2016.
 */


//function Cell(x, y){
Cell = function(status){
    this.status = 'empty';
    this.x;
    this.y;

    if(status == 'white' || status == 'black'){
        this.status = status;
    }

    this.dropeChecker = function(){
        this.status = 'empty';
    }
    this.setCheckerByPlayer = function(player){
        if(this.status == 'empty'){
            this.status = player;
        }
    }
}
