var boardArray = [
  [10,8,9,11,12,9,8,10],
  [7,7,7,7,7,7,7,7],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1],
  [4,2,3,5,6,3,2,4]];


var fileNo = {"a":1,"b":2,"c":3,"d":4,"e":5,"f":6,"g":7,"h":8};

String.prototype.replaceAt = function(index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function placePieces() {
  var boardId;
  var boardTile;

  for (x = 0; x < 8; x++) {
    for (y = 0; y < 8; y++) {
      boardId = String.fromCharCode(97 + x) + String(y + 1);
      if ((y + 7 * x) % 2 != 0) {
        boardTile = ':::::::::::::::::<br>:::::::::::::::::<br>:::::::::::::::::<br>:::::::::::::::::<br>:::::::::::::::::<br>:::::::::::::::::<br>:::::::::::::::::<br>';
      } else {
        boardTile = '                 <br>                 <br>                 <br>                 <br>                 <br>                 <br>                 <br>';
      }
      if (boardArray[y][x] == 7) {
        boardTile = boardTile.replaceAt(29,    '_');
        boardTile = boardTile.replaceAt(49,   '( )');
        boardTile = boardTile.replaceAt(69,  '/   \\');
        boardTile = boardTile.replaceAt(90,  ')   (');
        boardTile = boardTile.replaceAt(110,'{_____}');
      } else if (boardArray[y][x] == 1) {
        boardTile = boardTile.replaceAt(29,    '_');
        boardTile = boardTile.replaceAt(49,   '(#)');
        boardTile = boardTile.replaceAt(69,  '/#%#\\');
        boardTile = boardTile.replaceAt(90,  ')%#%(');
        boardTile = boardTile.replaceAt(110,'{_#_#_}');
      } else if (boardArray[y][x] == 10) {
        boardTile = boardTile.replaceAt(26, '|\'\-\'\-\'\|');
        boardTile = boardTile.replaceAt(48,  '|   |');
        boardTile = boardTile.replaceAt(69,  '|   |');
        boardTile = boardTile.replaceAt(90,  '/___\\');
        boardTile = boardTile.replaceAt(110,'{_____}');
      } else if (boardArray[y][x] == 4) {
        boardTile = boardTile.replaceAt(26, '|\'\-\'\-\'\|');
        boardTile = boardTile.replaceAt(48,  '|#%#|');
        boardTile = boardTile.replaceAt(69,  '|%#%|');
        boardTile = boardTile.replaceAt(90,  '/#_#\\');
        boardTile = boardTile.replaceAt(110,'{#_#_#}');
      } else if (boardArray[y][x] == 8) {
        boardTile = boardTile.replaceAt(27,  '_^^');
        boardTile = boardTile.replaceAt(46,'/_ • |>');
        boardTile = boardTile.replaceAt(70,   '/ |>');
        boardTile = boardTile.replaceAt(90,  '/   \\');
        boardTile = boardTile.replaceAt(110,'{_____}');
      } else if (boardArray[y][x] == 2) {
        boardTile = boardTile.replaceAt(27,  '_^^');
        boardTile = boardTile.replaceAt(46,'/_ •%|>');
        boardTile = boardTile.replaceAt(70,   '/#|>');
        boardTile = boardTile.replaceAt(90,  '/#%#\\');
        boardTile = boardTile.replaceAt(110,'{#_#_#}');
      } else if (boardArray[y][x] == 9) {
        boardTile = boardTile.replaceAt(28,   '_^_');
        boardTile = boardTile.replaceAt(49,  '\\ /');
        boardTile = boardTile.replaceAt(70,   '} {');
        boardTile = boardTile.replaceAt(90,  '/   \\');
        boardTile = boardTile.replaceAt(110,'{_____}');
      } else if (boardArray[y][x] == 3) {
        boardTile = boardTile.replaceAt(28,   '_^_');
        boardTile = boardTile.replaceAt(49,  '\\%/');
        boardTile = boardTile.replaceAt(70,   '}#{');
        boardTile = boardTile.replaceAt(90,  '/#%#\\');
        boardTile = boardTile.replaceAt(110,'{#_#_#}');
      } else if (boardArray[y][x] == 11) {
        boardTile = boardTile.replaceAt(7,    '_◦_');
        boardTile = boardTile.replaceAt(28,   '/ \\');
        boardTile = boardTile.replaceAt(49,   '} {');
        boardTile = boardTile.replaceAt(69, '\/   \\');
        boardTile = boardTile.replaceAt(90,  ')   (');
        boardTile = boardTile.replaceAt(110,'{_____}');
      } else if (boardArray[y][x] == 5) {
        boardTile = boardTile.replaceAt(7,    '_◦_');
        boardTile = boardTile.replaceAt(28,   '/%\\');
        boardTile = boardTile.replaceAt(49,   '}#{');
        boardTile = boardTile.replaceAt(69, '\/#%#\\');
        boardTile = boardTile.replaceAt(90,  ')%#%(');
        boardTile = boardTile.replaceAt(110,'{_#_#_}');
      } else if (boardArray[y][x] == 12) {
        boardTile = boardTile.replaceAt(7,    '_+_');
        boardTile = boardTile.replaceAt(27,  '/   \\');
        boardTile = boardTile.replaceAt(48,  '}   {');
        boardTile = boardTile.replaceAt(69, '\/   \\');
        boardTile = boardTile.replaceAt(89, '(     )');
        boardTile = boardTile.replaceAt(110,'{_____}');
      } else if (boardArray[y][x] == 6) {
        boardTile = boardTile.replaceAt(7,    '_+_');
        boardTile = boardTile.replaceAt(27,  '/#%#\\');
        boardTile = boardTile.replaceAt(48,  '}%#%{');
        boardTile = boardTile.replaceAt(69, '\/#%#\\');
        boardTile = boardTile.replaceAt(89, '(#%#%#)');
        boardTile = boardTile.replaceAt(110,'{_#_#_}');
      }
      document.getElementById(boardId).innerHTML = boardTile;
    }
  }
}

var tmpfile = 'abcdefgh';
for (let x = 0; x < 8; x++) {
  for (let y = 0; y < 8; y++) {
    var rank = y + 1;
    let pos = tmpfile.charAt(x) + rank;

    document.getElementById(pos).addEventListener('click', function(e) {

      if (GameBoard.pieces[SQ120(x + (8 * y))] != 0) {
        console.log('Piece Click');

        if(UserMove.from == SQUARES.NO_SQ) {
          UserMove.from = SQ120(x + (8 * y));
          SetSqSelected(SQ120(x + (8 * y)));
        } else {
          UserMove.to = SQ120(x + (8 * y));
          SetSqSelected(SQ120(x + (8 * y)));
        }
        
        MakeUserMove();

      } else {
        console.log('Square Click');	
        if(UserMove.from != SQUARES.NO_SQ) {
          UserMove.to = SQ120(x + (8 * y));
          SetSqSelected(SQ120(x + (8 * y)));
          MakeUserMove();
        }
      }
    });
  }
}

function printState() {
  placePieces();
}
