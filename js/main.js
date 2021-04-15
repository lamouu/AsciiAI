// Set debug mode for engine output
var DEBUG = 0;

$(function() {
	init();
	if (DEBUG) console.log("Main Init Called");	
	NewGame(StartFEN);
});

function InitFilesRanksBrd() {
	
	var index = 0;
	var file = 0;
	var rank = 0;
	var sq = Squares.A1;
	
	for(index = 0; index < BrdSqNum; ++index) {
		FilesBrd[index] = Squares.offboard;
		RanksBrd[index] = Squares.offboard;
	}
	
	for(rank = 0; rank <= 7; ++rank) {
		for(file = 0; file <= 7; ++file) {
			sq = FR2SQ(file,rank);
			FilesBrd[sq] = file;
			RanksBrd[sq] = rank;
		}
	}
}

function InitHashKeys() {
    var index = 0;
	
	for(index = 0; index < 14 * 120; ++index) {				
		PieceKeys[index] = RAND_32();
	}
	
	SideKey = RAND_32();
	
	for(index = 0; index < 16; ++index) {
		CastleKeys[index] = RAND_32();
	}
}

function InitSq120To64() {

	var index = 0;
	var file = 0;
	var rank = 0;
	var sq = Squares.A1;
	var sq64 = 0;

	for(index = 0; index < BrdSqNum; ++index) {
		Sq120ToSq64[index] = 65;
	}
	
	for(index = 0; index < 64; ++index) {
		Sq64ToSq120[index] = 120;
	}
	
	for(rank = 0; rank <= 7; ++rank) {
		for(file = 0; file <= 7; ++file) {
			sq = FR2SQ(file,rank);
			Sq64ToSq120[sq64] = sq;
			Sq120ToSq64[sq] = sq64;
			sq64++;
		}
	}

}

function InitBoardVars() {

	var index = 0;
	for(index = 0; index < MaxGameMoves; ++index) {
		board.history.push( {
			move : NOMOVE,
			castlePerm : 0,
			enPas : 0,
			fiftyMove : 0,
			posKey : 0
		});
	}	
	
	for(index = 0; index < PvEntries; ++index) {
		board.PvTable.push({
			move : NOMOVE,
			posKey : 0
		});
	}
}

function InitBoardSquares() {
	var light = 0;
	var rankName;
	var fileName;
	var divString;
	var lastLight = 0;
	var rankIter = 0;
	var fileIter = 0;
	var lightString;
	
	for(rankIter = 7; rankIter >= 0; rankIter--) {
		light = lastLight ^ 1;
		lastLight ^= 1;
		rankName = "rank" + (rankIter+1);
		for(fileIter = 0; fileIter <= 7; fileIter++) {
			fileName = "file" + (fileIter+1);
			
			if(light==0) lightString="Light";
			else lightString = "Dark";
			divString = "<div class=\"Square " + rankName + " " + fileName + " " + lightString + "\"/>";
			light^=1;
			$("#Board").append(divString);
 		}
 	}
}

function InitBoardSquares() {
	var light = 1;
	var rankName;
	var fileName;
	var divString;
	var rankIter;
	var fileIter;
	var lightString;
	
	for(rankIter = 7; rankIter >= 0; rankIter--) {
		light ^= 1;
		rankName = "rank" + (rankIter + 1);
		for(fileIter = 0; fileIter <= 7; fileIter++) {
			fileName = "file" + (fileIter + 1);
			if(light == 0) lightString="Light";
			else lightString = "Dark";
			light^=1;
			divString = "<div class=\"Square " + rankName + " " + fileName + " " + lightString + "\"/>";
			$("#Board").append(divString);
		}
	}
	
}

function InitAsciiSquares() {

	for (let x = 0; x < 8; x++) {
		for (let y = 0; y < 8; y++) {
		  var rank = y + 1;
		  let pos = FileChar.charAt(x) + rank;
	  
		  document.getElementById(pos).addEventListener('click', function(e) {
	  
			if (board.Pieces[SQ120(x + (8 * y))] != 0) {
			  if(UserMove.from == Squares.NoSq) {
				UserMove.from = SQ120(x + (8 * y));
				SetSqSelected(SQ120(x + (8 * y)));
			  } else {
				UserMove.to = SQ120(x + (8 * y));
				SetSqSelected(SQ120(x + (8 * y)));
			  }
			  
			  MakeUserMove();
	  
			} else {
			  if(UserMove.from != Squares.NoSq) {
				UserMove.to = SQ120(x + (8 * y));
				SetSqSelected(SQ120(x + (8 * y)));
				MakeUserMove();
			  }
			}
		  });
		}
	  }
}

function init() {
	if (DEBUG) console.log("init() called");
	InitFilesRanksBrd();
	InitHashKeys();
	InitSq120To64();
	InitBoardVars();
	InitMvvLva();
	InitBoardSquares();
	InitAsciiSquares();
	UpdateGui();
}















































