// 1.make board clickable
// 2.link clicks to piece move
// 3.make pieces bold on selection
// 4.limit move options
// 5.lower brightness on non-selectable

var boardArray = [
  ['R','N','B','Q','K','B','N','R'],
  ['P','P','P','P','P','P','P','P'],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['p','p','p','p','p','p','p','p'],
  ['r','n','b','q','k','b','n','r']];

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function placePieces () {
  var boardId;
  var boardTile;
  for (x = 0; x < 8; x++) {
    for (y = 0; y < 8; y++) {
      boardId = String.fromCharCode(97 + x) + String(8 - y);
      if ((y + 7 * x) % 2 == 0) {
        boardTile = '                 <br>                 <br>                 <br>                 <br>                 <br>                 <br>                 <br>';
      } else {
        boardTile = ':::::::::::::::::<br>:::::::::::::::::<br>:::::::::::::::::<br>:::::::::::::::::<br>:::::::::::::::::<br>:::::::::::::::::<br>:::::::::::::::::<br>';
      }
      if (boardArray[y][x] == 'P') {
        boardTile = boardTile.replaceAt(29,    '_');
        boardTile = boardTile.replaceAt(49,   '( )');
        boardTile = boardTile.replaceAt(69,  '/   \\');
        boardTile = boardTile.replaceAt(90,  ')   (');
        boardTile = boardTile.replaceAt(110, '{_____}');
      } else if (boardArray[y][x] == 'p') {
        boardTile = boardTile.replaceAt(29,    '_');
        boardTile = boardTile.replaceAt(49,   '(#)');
        boardTile = boardTile.replaceAt(69,  '/#%#\\');
        boardTile = boardTile.replaceAt(90,  ')%#%(');
        boardTile = boardTile.replaceAt(110, '{_#_#_}');
      } else if (boardArray[y][x] == 'R') {
        boardTile = boardTile.replaceAt(26, '|\'\-\'\-\'\|');
        boardTile = boardTile.replaceAt(48,  '|   |');
        boardTile = boardTile.replaceAt(69,  '|   |');
        boardTile = boardTile.replaceAt(90,  '/___\\');
        boardTile = boardTile.replaceAt(110, '{_____}');
      } else if (boardArray[y][x] == 'r') {
        boardTile = boardTile.replaceAt(26, '|\'\-\'\-\'\|');
        boardTile = boardTile.replaceAt(48,  '|#%#|');
        boardTile = boardTile.replaceAt(69,  '|%#%|');
        boardTile = boardTile.replaceAt(90,  '/#_#\\');
        boardTile = boardTile.replaceAt(110, '{#_#_#}');
      } else if (boardArray[y][x] == 'N') {
        boardTile = boardTile.replaceAt(27,  '_^^');
        boardTile = boardTile.replaceAt(46,'/_ • |>');
        boardTile = boardTile.replaceAt(70,   '/ |>');
        boardTile = boardTile.replaceAt(90,  '/   \\');
        boardTile = boardTile.replaceAt(110, '{_____}');
      } else if (boardArray[y][x] == 'n') {
        boardTile = boardTile.replaceAt(27,  '_^^');
        boardTile = boardTile.replaceAt(46,'/_ •%|>');
        boardTile = boardTile.replaceAt(70,   '/#|>');
        boardTile = boardTile.replaceAt(90,  '/#%#\\');
        boardTile = boardTile.replaceAt(110, '{#_#_#}');
      } else if (boardArray[y][x] == 'B') {
        boardTile = boardTile.replaceAt(28,   '_^_');
        boardTile = boardTile.replaceAt(49,  '\\ /');
        boardTile = boardTile.replaceAt(70,   '} {');
        boardTile = boardTile.replaceAt(90,  '/   \\');
        boardTile = boardTile.replaceAt(110, '{_____}');
      } else if (boardArray[y][x] == 'b') {
        boardTile = boardTile.replaceAt(28,   '_^_');
        boardTile = boardTile.replaceAt(49,  '\\%/');
        boardTile = boardTile.replaceAt(70,   '}#{');
        boardTile = boardTile.replaceAt(90,  '/#%#\\');
        boardTile = boardTile.replaceAt(110, '{#_#_#}');
      } else if (boardArray[y][x] == 'Q') {
        boardTile = boardTile.replaceAt(7,     '_◦_');
        boardTile = boardTile.replaceAt(28,   '/ \\');
        boardTile = boardTile.replaceAt(49,   '} {');
        boardTile = boardTile.replaceAt(69, '\/   \\');
        boardTile = boardTile.replaceAt(90,  ')   (');
        boardTile = boardTile.replaceAt(110, '{_____}');
      } else if (boardArray[y][x] == 'q') {
        boardTile = boardTile.replaceAt(7,     '_◦_');
        boardTile = boardTile.replaceAt(28,   '/%\\');
        boardTile = boardTile.replaceAt(49,   '}#{');
        boardTile = boardTile.replaceAt(69, '\/#%#\\');
        boardTile = boardTile.replaceAt(90,  ')%#%(');
        boardTile = boardTile.replaceAt(110, '{_#_#_}');
      } else if (boardArray[y][x] == 'K') {
        boardTile = boardTile.replaceAt(7,     '_+_');
        boardTile = boardTile.replaceAt(27,  '/   \\');
        boardTile = boardTile.replaceAt(48,  '}   {');
        boardTile = boardTile.replaceAt(69, '\/   \\');
        boardTile = boardTile.replaceAt(89, '(     )');
        boardTile = boardTile.replaceAt(110, '{_____}');
      } else if (boardArray[y][x] == 'k') {
        boardTile = boardTile.replaceAt(7,     '_+_');
        boardTile = boardTile.replaceAt(27,  '/#%#\\');
        boardTile = boardTile.replaceAt(48,  '}%#%{');
        boardTile = boardTile.replaceAt(69, '\/#%#\\');
        boardTile = boardTile.replaceAt(89, '(#%#%#)');
        boardTile = boardTile.replaceAt(110, '{_#_#_}');
      }
      document.getElementById(boardId).innerHTML = boardTile;
    }
  }
}

var clicked = 0;
var a8 = document.getElementById("a8");
a8.onclick = function(){
  console.log("a8");
  if (clicked == 0) {
    document.getElementById("a8").style.fontWeight = "bold";
    clicked = 1;
  } else {
    document.getElementById("a8").style.fontWeight = "normal";
    clicked = 0;
  }
}
var b8 = document.getElementById("b8");
b8.onclick = function(){
  console.log("b8");
  if (clicked == 0) {
    document.getElementById("b8").style.fontWeight = "bold";
    clicked = 1;
  } else {
    document.getElementById("b8").style.fontWeight = "normal";
    clicked = 0;
  }
}

function printState() {
  placePieces();
}
