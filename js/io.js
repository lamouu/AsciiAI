function PrSq(sq) {
	return (FileChar[FilesBrd[sq]] + RankChar[RanksBrd[sq]]);
}

function PrMove(move) {	
	var MvStr;
	
	var ff = FilesBrd[FROMSQ(move)];
	var rf = RanksBrd[FROMSQ(move)];
	var ft = FilesBrd[TOSQ(move)];
	var rt = RanksBrd[TOSQ(move)];
	
	MvStr = FileChar[ff] + RankChar[rf] + FileChar[ft] + RankChar[rt];
	
	var promoted = PROMOTED(move);

	if(promoted != Pieces.EMPTY) {
		var pchar = 'q';
		if(PieceKnight[promoted] == 1) {
			pchar = 'n';
		} else if(PieceRookQueen[promoted] == 1 && PieceBishopQueen[promoted] == 0)  {
			pchar = 'r';
		} else if(PieceRookQueen[promoted] == 0 && PieceBishopQueen[promoted] == 1)   {
			pchar = 'b';
		}
		MvStr += pchar;
	}
	return MvStr;
}

function PrintMoveList() {

	var index;
	var move;
	var num = 1;
	console.log('MoveList:');

	for(index = board.moveListStart[board.ply]; index < board.moveListStart[board.ply+1]; ++index) {
		move = board.moveList[index];
		console.log('IMove:' + num + ':(' + index + '):' + PrMove(move) + ' Score:' +  board.moveScores[index]);
		num++;
	}
	console.log('End MoveList');
}

function ParseMove(from, to) {

	GenerateMoves();
	
	var Move = NOMOVE;
	var PromPce = Pieces.EMPTY;
	var found = 0;
	
	for(index = board.moveListStart[board.ply]; 
							index < board.moveListStart[board.ply + 1]; ++index) {	
		Move = board.moveList[index];
		if(FROMSQ(Move) == from && TOSQ(Move) == to) {
			PromPce = PROMOTED(Move);
			if(PromPce != Pieces.EMPTY) {
				if( (PromPce == Pieces.wQ && board.side == COLOURS.WHITE) ||
					(PromPce == Pieces.bQ && board.side == COLOURS.BLACK) ) {
					found = 1;
					break;
				}
				continue;
			}
			found = 1;
			break;
		}		
	}
	
	if(found != 0) {
		if(MakeMove(Move) == 0) {
			return NOMOVE;
		}
		TakeMove();
		return Move;
	}
	
	return NOMOVE;
}




















































