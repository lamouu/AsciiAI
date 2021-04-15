function ClearPiece(sq) {

	var pce = board.Pieces[sq];
	var col = PieceCol[pce];
	var index;
	var t_pceNum = -1;
	
	HASH_PCE(pce, sq);
	
	board.Pieces[sq] = Pieces.EMPTY;
	board.material[col] -= PieceVal[pce];
	
	for(index = 0; index < board.pceNum[pce]; ++index) {
		if(board.pList[PCEINDEX(pce,index)] == sq) {
			t_pceNum = index;
			break;
		}
	}
	
	board.pceNum[pce]--;
	board.pList[PCEINDEX(pce, t_pceNum)] = board.pList[PCEINDEX(pce, board.pceNum[pce])];	

}

function AddPiece(sq, pce) {

	var col = PieceCol[pce];
	
	HASH_PCE(pce, sq);
	
	board.Pieces[sq] = pce;
	board.material[col] += PieceVal[pce];
	board.pList[PCEINDEX(pce, board.pceNum[pce])] = sq;
	board.pceNum[pce]++;

}

function MovePiece(from, to) {
	
	var index = 0;
	var pce = board.Pieces[from];
	
	HASH_PCE(pce, from);
	board.Pieces[from] = Pieces.EMPTY;
	
	HASH_PCE(pce,to);
	board.Pieces[to] = pce;
	
	for(index = 0; index < board.pceNum[pce]; ++index) {
		if(board.pList[PCEINDEX(pce,index)] == from) {
			board.pList[PCEINDEX(pce,index)] = to;
			break;
		}
	}
}

function MakeMove(move) {
	
	var from = FROMSQ(move);
    var to = TOSQ(move);
    var side = board.side;	

	board.history[board.hisPly].posKey = board.posKey;

	if( (move & MFLAGEP) != 0) {
		if(side == COLOURS.WHITE) {
			ClearPiece(to-10);
		} else {
			ClearPiece(to+10);
		}
	} else if( (move & MFLAGCA) != 0) {
		switch(to) {
			case Squares.C1:
                MovePiece(Squares.A1, Squares.D1);
			break;
            case Squares.C8:
                MovePiece(Squares.A8, Squares.D8);
			break;
            case Squares.G1:
                MovePiece(Squares.H1, Squares.F1);
			break;
            case Squares.G8:
                MovePiece(Squares.H8, Squares.F8);
			break;
            default: break;
		}
	}
	
	if(board.enPas != Squares.NO_SQ) HASH_EP();
	HASH_CA();
	
	board.history[board.hisPly].move = move;
    board.history[board.hisPly].fiftyMove = board.fiftyMove;
    board.history[board.hisPly].enPas = board.enPas;
    board.history[board.hisPly].castlePerm = board.castlePerm;
    
    board.castlePerm &= CastlePerm[from];
    board.castlePerm &= CastlePerm[to];
    board.enPas = Squares.NO_SQ;
    
    HASH_CA();
    
    var captured = CAPTURED(move);
    board.fiftyMove++;
    
    if(captured != Pieces.EMPTY) {
        ClearPiece(to);
        board.fiftyMove = 0;
    }
    
    board.hisPly++;
	board.ply++;
	
	if(PiecePawn[board.Pieces[from]] == 1) {
        board.fiftyMove = 0;
        if( (move & MFLAGPS) != 0) {
            if(side==COLOURS.WHITE) {
                board.enPas=from+10;
            } else {
                board.enPas=from-10;
            }
            HASH_EP();
        }
    }
    
    MovePiece(from, to);
    
    var prPce = PROMOTED(move);
    if(prPce != Pieces.EMPTY)   {       
        ClearPiece(to);
        AddPiece(to, prPce);
    }
    
    board.side ^= 1;
    HASH_SIDE();
    
    if(SqAttacked(board.pList[PCEINDEX(Kings[side],0)], board.side))  {
         TakeMove();
    	return 0;
    }
    
    return 1;
}

function TakeMove() {
	
	board.hisPly--;
    board.ply--;
    
    var move = board.history[board.hisPly].move;
	var from = FROMSQ(move);
    var to = TOSQ(move);
    
    if(board.enPas != Squares.NO_SQ) HASH_EP();
    HASH_CA();
    
    board.castlePerm = board.history[board.hisPly].castlePerm;
    board.fiftyMove = board.history[board.hisPly].fiftyMove;
    board.enPas = board.history[board.hisPly].enPas;
    
    if(board.enPas != Squares.NO_SQ) HASH_EP();
    HASH_CA();
    
    board.side ^= 1;
    HASH_SIDE();
    
    if( (MFLAGEP & move) != 0) {
        if(board.side == COLOURS.WHITE) {
            AddPiece(to-10, Pieces.bP);
        } else {
            AddPiece(to+10, Pieces.wP);
        }
    } else if( (MFLAGCA & move) != 0) {
        switch(to) {
        	case Squares.C1: MovePiece(Squares.D1, Squares.A1); break;
            case Squares.C8: MovePiece(Squares.D8, Squares.A8); break;
            case Squares.G1: MovePiece(Squares.F1, Squares.H1); break;
            case Squares.G8: MovePiece(Squares.F8, Squares.H8); break;
            default: break;
        }
    }
    
    MovePiece(to, from);
    
    var captured = CAPTURED(move);
    if(captured != Pieces.EMPTY) {      
        AddPiece(to, captured);
    }
    
    if(PROMOTED(move) != Pieces.EMPTY)   {        
        ClearPiece(from);
        AddPiece(from, (PieceCol[PROMOTED(move)] == COLOURS.WHITE ? Pieces.wP : Pieces.bP));
    }
    
}























































































