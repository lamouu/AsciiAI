$('#TakeButton').click( function () {
	if(board.hisPly > 0) {
		TakeMove();
		board.ply = 0;
		SetInitialBoardPieces();
	}
});

$('#NewGameButton').click( function () {
	NewGame(StartFEN);
});

function NewGame(fenStr) {
	ParseFen(fenStr);
	if (DEBUG) PrintBoard();
	UpdateGui();
	CheckAndSet();
}

function ClearAllPieces() {
	$(".Piece").remove();
}

function DeSelectSq(sq) {
	$('.Square').each( function(index) {
		if(PieceIsOnSq(sq, $(this).position().top, $(this).position().left) == 1) {
				$(this).removeClass('SqSelected');
		}
	} );
}

function SetSqSelected(sq) {
	$('.Square').each( function(index) {
		if(PieceIsOnSq(sq, $(this).position().top, $(this).position().left) == 1) {
				$(this).addClass('SqSelected');
		}
	} );
}

function MakeUserMove() {

	if(UserMove.from != Squares.NO_SQ && UserMove.to != Squares.NO_SQ) {
	
		if (DEBUG) console.log("User Move:" + PrSq(UserMove.from) + PrSq(UserMove.to));	
		
		var parsed = ParseMove(UserMove.from,UserMove.to);
		
		if(parsed != NOMOVE) {
			MakeMove(parsed);
			CheckAndSet();
			PreSearch();
			if (DEBUG) PrintBoard();
			UpdateGui();
		}
	
		DeSelectSq(UserMove.from);
		DeSelectSq(UserMove.to);
		
		UserMove.from = Squares.NO_SQ;
		UserMove.to = Squares.NO_SQ;

	}

}

function PieceIsOnSq(sq, top, left) {

	if( (RanksBrd[sq] == 7 - Math.round(top/60) ) && 
		FilesBrd[sq] == Math.round(left/60) ) {
		return 1;
	}
		
	return 0;

}

function DrawMaterial() {

	if (board.pceNum[Pieces.wP]!=0 || board.pceNum[Pieces.bP]!=0) return 0;
	if (board.pceNum[Pieces.wQ]!=0 || board.pceNum[Pieces.bQ]!=0 ||
					board.pceNum[Pieces.wR]!=0 || board.pceNum[Pieces.bR]!=0) return 0;
	if (board.pceNum[Pieces.wB] > 1 || board.pceNum[Pieces.bB] > 1) {return 0;}
    if (board.pceNum[Pieces.wN] > 1 || board.pceNum[Pieces.bN] > 1) {return 0;}
	
	if (board.pceNum[Pieces.wN]!=0 && board.pceNum[Pieces.wB]!=0) {return 0;}
	if (board.pceNum[Pieces.bN]!=0 && board.pceNum[Pieces.bB]!=0) {return 0;}
	 
	return 1;
}

function ThreeFoldRep() {
	var i = 0, r = 0;
	
	for(i = 0; i < board.hisPly; ++i) {
		if (board.history[i].posKey == board.posKey) {
		    r++;
		}
	}
	return r;
}

function CheckResult() {
	if(board.fiftyMove >= 100) {
		 $("#GameStatus").text("GAME DRAWN {fifty move rule}"); 
		 return 1;
	}
	
	if (ThreeFoldRep() >= 2) {
     	$("#GameStatus").text("GAME DRAWN {3-fold repetition}"); 
     	return 1;
    }
	
	if (DrawMaterial() == 1) {
     	$("#GameStatus").text("GAME DRAWN {insufficient material to mate}"); 
     	return 1;
    }
    
    GenerateMoves();
      
    var MoveNum = 0;
	var found = 0;
	
	for(MoveNum = board.moveListStart[board.ply]; MoveNum < board.moveListStart[board.ply + 1]; ++MoveNum)  {	
       
        if ( MakeMove(board.moveList[MoveNum]) == 0)  {
            continue;
        }
        found++;
		TakeMove();
		break;
    }
	
	if(found != 0) return 0;
	
	var InCheck = SqAttacked(board.pList[PCEINDEX(Kings[board.side],0)], board.side^1);
	
	if(InCheck == 1) {
		if(board.side == COLOURS.WHITE) {
	      $("#GameStatus").text("GAME OVER {black mates}");
	      return 1;
        } else {
	      $("#GameStatus").text("GAME OVER {white mates}");
	      return 1;
        }
	} else {
		$("#GameStatus").text("GAME DRAWN {stalemate}");return 1;
	}
	
	return 0;	
}

function CheckAndSet() {
	if(CheckResult() == 1) {
		GameController.GameOver = 1;
	} else {
		GameController.GameOver = 0;
		$("#GameStatus").text('');
	}
}

function PreSearch() {
	if(GameController.GameOver == 0) {
		controller.thinking = 1;
		setTimeout( function() { StartSearch(); }, 200 );
	}
}

function StartSearch() {

	controller.depth = MaxDepth;
	var t = $.now();
	var tt = 2;
	
	controller.time = parseInt(tt) * 1000;
	SearchPosition();
	
	MakeMove(controller.best);
	CheckAndSet();
	
	if (DEBUG) PrintBoard();
    UpdateGui();
}

var boardArray = [
	[4,2,3,5,6,3,2,4],
	[1,1,1,1,1,1,1,1],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[7,7,7,7,7,7,7,7],
	[10,8,9,11,12,9,8,10]];
  
String.prototype.replaceAt = function(index, replacement) {
	return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}
  
function UpdateGui() {
	var boardId;
	var boardTile;

	var sq,file,rank,piece;

	for(rank = 7; rank >= 0; rank--) {
		var line =(RankChar[rank] + "  ");
		for(file = 0; file <= 7; file++) {
			sq = FR2SQ(file,rank);
			piece = board.Pieces[sq];
			boardArray[rank][file] = piece;
		}
	}

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
