function GetPvLine(depth) {
	
	var move = ProbePvTable();
	var count = 0;
	
	while(move != NOMOVE && count < depth) {
	
		if( MoveExists(move) == 1) {
			MakeMove(move);
			board.PvArray[count++] = move;			
		} else {
			break;
		}		
		move = ProbePvTable();	
	}
	
	while(board.ply > 0) {
		TakeMove();
	}
	
	return count;
	
}

function ProbePvTable() {
	var index = board.posKey % PvEntries;
	
	if(board.PvTable[index].posKey == board.posKey) {
		return board.PvTable[index].move;
	}
	
	return NOMOVE;
}

function StorePvMove(move) {
	var index = board.posKey % PvEntries;
	board.PvTable[index].posKey = board.posKey;
	board.PvTable[index].move = move;
}