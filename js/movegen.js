var MvvLvaValue = [ 0, 100, 200, 300, 400, 500, 600, 100, 200, 300, 400, 500, 600 ];
var MvvLvaScores = new Array(14 * 14);

function InitMvvLva() {
	var Attacker;
	var Victim;
	
	for(Attacker = Pieces.wP; Attacker <= Pieces.bK; ++Attacker) {
		for(Victim = Pieces.wP; Victim <= Pieces.bK; ++Victim) {
			MvvLvaScores[Victim * 14 + Attacker] = MvvLvaValue[Victim] + 6 - (MvvLvaValue[Attacker]/100);
		}
	}

}

function MoveExists(move) {
	
	GenerateMoves();
    
	var index;
	var moveFound = NOMOVE;
	for(index = board.moveListStart[board.ply]; index < board.moveListStart[board.ply + 1]; ++index) {
	
		moveFound = board.moveList[index];	
		if(MakeMove(moveFound) == 0) {
			continue;
		}				
		TakeMove();
		if(move == moveFound) {
			return 1;
		}
	}
	return 0;
}

function MOVE(from, to, captured, promoted, flag) {
	return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}

function AddCaptureMove(move) {
	board.moveList[board.moveListStart[board.ply+1]] = move;
	board.moveScores[board.moveListStart[board.ply+1]++] =  
		MvvLvaScores[CAPTURED(move) * 14 + board.Pieces[FROMSQ(move)]] + 1000000;	
}

function AddQuietMove(move) {
	board.moveList[board.moveListStart[board.ply+1]] = move;
	board.moveScores[board.moveListStart[board.ply+1]] =  0;
	
	if(move == board.searchKillers[board.ply]) {
		board.moveScores[board.moveListStart[board.ply+1]] = 900000;
	} else if(move == board.searchKillers[board.ply + MaxDepth]) {
		board.moveScores[board.moveListStart[board.ply+1]] = 800000;
	} else {
		board.moveScores[board.moveListStart[board.ply+1]] = 
			board.searchHistory[board.Pieces[FROMSQ(move)] * BrdSqNum + TOSQ(move)];
	}
	
	board.moveListStart[board.ply+1]++
}

function AddEnPassantMove(move) {
	board.moveList[board.moveListStart[board.ply+1]] = move;
	board.moveScores[board.moveListStart[board.ply + 1]++] = 105 + 1000000;
}

function AddWhitePawnCaptureMove(from, to, cap) {
	if(RanksBrd[from]==6) {
		AddCaptureMove(MOVE(from, to, cap, Pieces.wQ, 0));
		AddCaptureMove(MOVE(from, to, cap, Pieces.wR, 0));
		AddCaptureMove(MOVE(from, to, cap, Pieces.wB, 0));
		AddCaptureMove(MOVE(from, to, cap, Pieces.wN, 0));	
	} else {
		AddCaptureMove(MOVE(from, to, cap, Pieces.EMPTY, 0));	
	}
}

function AddBlackPawnCaptureMove(from, to, cap) {
	if(RanksBrd[from]==1) {
		AddCaptureMove(MOVE(from, to, cap, Pieces.bQ, 0));
		AddCaptureMove(MOVE(from, to, cap, Pieces.bR, 0));
		AddCaptureMove(MOVE(from, to, cap, Pieces.bB, 0));
		AddCaptureMove(MOVE(from, to, cap, Pieces.bN, 0));	
	} else {
		AddCaptureMove(MOVE(from, to, cap, Pieces.EMPTY, 0));	
	}
}

function AddWhitePawnQuietMove(from, to) {
	if(RanksBrd[from]==6) {
		AddQuietMove(MOVE(from,to,Pieces.EMPTY,Pieces.wQ,0));
		AddQuietMove(MOVE(from,to,Pieces.EMPTY,Pieces.wR,0));
		AddQuietMove(MOVE(from,to,Pieces.EMPTY,Pieces.wB,0));
		AddQuietMove(MOVE(from,to,Pieces.EMPTY,Pieces.wN,0));
	} else {
		AddQuietMove(MOVE(from,to,Pieces.EMPTY,Pieces.EMPTY,0));	
	}
}

function AddBlackPawnQuietMove(from, to) {
	if(RanksBrd[from]==1) {
		AddQuietMove(MOVE(from,to,Pieces.EMPTY,Pieces.bQ,0));
		AddQuietMove(MOVE(from,to,Pieces.EMPTY,Pieces.bR,0));
		AddQuietMove(MOVE(from,to,Pieces.EMPTY,Pieces.bB,0));
		AddQuietMove(MOVE(from,to,Pieces.EMPTY,Pieces.bN,0));
	} else {
		AddQuietMove(MOVE(from,to,Pieces.EMPTY,Pieces.EMPTY,0));	
	}
}

function GenerateMoves() {
	board.moveListStart[board.ply+1] = board.moveListStart[board.ply];
	
	var pceType;
	var pceNum;
	var sq;
	var pceIndex;
	var pce;
	var t_sq;
	var dir;
	
	if(board.side == COLOURS.WHITE) {
		pceType = Pieces.wP;
		
		for(pceNum = 0; pceNum < board.pceNum[pceType]; ++pceNum) {
			sq = board.pList[PCEINDEX(pceType, pceNum)];			
			if(board.Pieces[sq + 10] == Pieces.EMPTY) {
				AddWhitePawnQuietMove(sq, sq+10);
				if(RanksBrd[sq] == 1 && board.Pieces[sq + 20] == Pieces.EMPTY) {
					AddQuietMove( MOVE(sq, sq + 20, Pieces.EMPTY, Pieces.EMPTY, MFLAGPS ));
				}
			}
			
			if(SQOFFBOARD(sq + 9) == 0 && PieceCol[board.Pieces[sq+9]] == COLOURS.BLACK) {
				AddWhitePawnCaptureMove(sq, sq + 9, board.Pieces[sq+9]);
			}
			
			if(SQOFFBOARD(sq + 11) == 0 && PieceCol[board.Pieces[sq+11]] == COLOURS.BLACK) {
				AddWhitePawnCaptureMove(sq, sq + 11, board.Pieces[sq+11]);
			}			
			
			if(board.enPas != Squares.NO_SQ) {
				if(sq + 9 == board.enPas) {
					AddEnPassantMove( MOVE(sq, sq+9, Pieces.EMPTY, Pieces.EMPTY, MFLAGEP ) );
				}
				
				if(sq + 11 == board.enPas) {
					AddEnPassantMove( MOVE(sq, sq+11, Pieces.EMPTY, Pieces.EMPTY, MFLAGEP ) );
				}
			}			
			
		}
		
		if(board.castlePerm & CASTLEBIT.WKCA) {			
			if(board.Pieces[Squares.F1] == Pieces.EMPTY && board.Pieces[Squares.G1] == Pieces.EMPTY) {
				if(SqAttacked(Squares.F1, COLOURS.BLACK) == 0 && SqAttacked(Squares.E1, COLOURS.BLACK) == 0) {
					AddQuietMove( MOVE(Squares.E1, Squares.G1, Pieces.EMPTY, Pieces.EMPTY, MFLAGCA ));
				}
			}
		}
		
		if(board.castlePerm & CASTLEBIT.WQCA) {
			if(board.Pieces[Squares.D1] == Pieces.EMPTY && board.Pieces[Squares.C1] == Pieces.EMPTY && board.Pieces[Squares.B1] == Pieces.EMPTY) {
				if(SqAttacked(Squares.D1, COLOURS.BLACK) == 0 && SqAttacked(Squares.E1, COLOURS.BLACK) == 0) {
					AddQuietMove( MOVE(Squares.E1, Squares.C1, Pieces.EMPTY, Pieces.EMPTY, MFLAGCA ));
				}
			}
		}		

	} else {
		pceType = Pieces.bP;
		
		for(pceNum = 0; pceNum < board.pceNum[pceType]; ++pceNum) {
			sq = board.pList[PCEINDEX(pceType, pceNum)];
			if(board.Pieces[sq - 10] == Pieces.EMPTY) {
				AddBlackPawnQuietMove(sq, sq-10);		
				if(RanksBrd[sq] == 6 && board.Pieces[sq - 20] == Pieces.EMPTY) {
					AddQuietMove( MOVE(sq, sq - 20, Pieces.EMPTY, Pieces.EMPTY, MFLAGPS ));
				}
			}
			
			if(SQOFFBOARD(sq - 9) == 0 && PieceCol[board.Pieces[sq-9]] == COLOURS.WHITE) {
				AddBlackPawnCaptureMove(sq, sq - 9, board.Pieces[sq-9]);
			}
			
			if(SQOFFBOARD(sq - 11) == 0 && PieceCol[board.Pieces[sq-11]] == COLOURS.WHITE) {
				AddBlackPawnCaptureMove(sq, sq - 11, board.Pieces[sq-11]);
			}			
			
			if(board.enPas != Squares.NO_SQ) {
				if(sq - 9 == board.enPas) {
					AddEnPassantMove( MOVE(sq, sq-9, Pieces.EMPTY, Pieces.EMPTY, MFLAGEP ) );
				}
				
				if(sq - 11 == board.enPas) {
					AddEnPassantMove( MOVE(sq, sq-11, Pieces.EMPTY, Pieces.EMPTY, MFLAGEP ) );
				}
			}
		}
		if(board.castlePerm & CASTLEBIT.BKCA) {	
			if(board.Pieces[Squares.F8] == Pieces.EMPTY && board.Pieces[Squares.G8] == Pieces.EMPTY) {
				if(SqAttacked(Squares.F8, COLOURS.WHITE) == 0 && SqAttacked(Squares.E8, COLOURS.WHITE) == 0) {
					AddQuietMove( MOVE(Squares.E8, Squares.G8, Pieces.EMPTY, Pieces.EMPTY, MFLAGCA ));
				}
			}
		}
		
		if(board.castlePerm & CASTLEBIT.BQCA) {
			if(board.Pieces[Squares.D8] == Pieces.EMPTY && board.Pieces[Squares.C8] == Pieces.EMPTY && board.Pieces[Squares.B8] == Pieces.EMPTY) {
				if(SqAttacked(Squares.D8, COLOURS.WHITE) == 0 && SqAttacked(Squares.E8, COLOURS.WHITE) == 0) {
					AddQuietMove( MOVE(Squares.E8, Squares.C8, Pieces.EMPTY, Pieces.EMPTY, MFLAGCA ));
				}
			}
		}	
	}	
	
	pceIndex = LoopNonSlideIndex[board.side];
	pce = LoopNonSlidePce[pceIndex++];
	
	while (pce != 0) {
		for(pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum) {
			sq = board.pList[PCEINDEX(pce, pceNum)];
			
			for(index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;
				
				if(SQOFFBOARD(t_sq) == 1) {
					continue;
				}
				
				if(board.Pieces[t_sq] != Pieces.EMPTY) {
					if(PieceCol[board.Pieces[t_sq]] != board.side) {
						AddCaptureMove( MOVE(sq, t_sq, board.Pieces[t_sq], Pieces.EMPTY, 0 ));
					}
				} else {
					AddQuietMove( MOVE(sq, t_sq, Pieces.EMPTY, Pieces.EMPTY, 0 ));
				}
			}			
		}	
		pce = LoopNonSlidePce[pceIndex++];
	}
	
	pceIndex = LoopSlideIndex[board.side];
	pce = LoopSlidePce[pceIndex++];
	
	while(pce != 0) {		
		for(pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum) {
			sq = board.pList[PCEINDEX(pce, pceNum)];
			
			for(index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;
				
				while( SQOFFBOARD(t_sq) == 0 ) {	
				
					if(board.Pieces[t_sq] != Pieces.EMPTY) {
						if(PieceCol[board.Pieces[t_sq]] != board.side) {
							AddCaptureMove( MOVE(sq, t_sq, board.Pieces[t_sq], Pieces.EMPTY, 0 ));
						}
						break;
					}
					AddQuietMove( MOVE(sq, t_sq, Pieces.EMPTY, Pieces.EMPTY, 0 ));
					t_sq += dir;
				}
			}			
		}	
		pce = LoopSlidePce[pceIndex++];
	}
}

function GenerateCaptures() {
	board.moveListStart[board.ply+1] = board.moveListStart[board.ply];
	
	var pceType;
	var pceNum;
	var sq;
	var pceIndex;
	var pce;
	var t_sq;
	var dir;
	
	if(board.side == COLOURS.WHITE) {
		pceType = Pieces.wP;
		
		for(pceNum = 0; pceNum < board.pceNum[pceType]; ++pceNum) {
			sq = board.pList[PCEINDEX(pceType, pceNum)];				
			
			if(SQOFFBOARD(sq + 9) == 0 && PieceCol[board.Pieces[sq+9]] == COLOURS.BLACK) {
				AddWhitePawnCaptureMove(sq, sq + 9, board.Pieces[sq+9]);
			}
			
			if(SQOFFBOARD(sq + 11) == 0 && PieceCol[board.Pieces[sq+11]] == COLOURS.BLACK) {
				AddWhitePawnCaptureMove(sq, sq + 11, board.Pieces[sq+11]);
			}			
			
			if(board.enPas != Squares.NO_SQ) {
				if(sq + 9 == board.enPas) {
					AddEnPassantMove( MOVE(sq, sq+9, Pieces.EMPTY, Pieces.EMPTY, MFLAGEP ) );
				}
				
				if(sq + 11 == board.enPas) {
					AddEnPassantMove( MOVE(sq, sq+11, Pieces.EMPTY, Pieces.EMPTY, MFLAGEP ) );
				}
			}			
			
		}			

	} else {
		pceType = Pieces.bP;
		
		for(pceNum = 0; pceNum < board.pceNum[pceType]; ++pceNum) {
			sq = board.pList[PCEINDEX(pceType, pceNum)];			
			
			if(SQOFFBOARD(sq - 9) == 0 && PieceCol[board.Pieces[sq-9]] == COLOURS.WHITE) {
				AddBlackPawnCaptureMove(sq, sq - 9, board.Pieces[sq-9]);
			}
			
			if(SQOFFBOARD(sq - 11) == 0 && PieceCol[board.Pieces[sq-11]] == COLOURS.WHITE) {
				AddBlackPawnCaptureMove(sq, sq - 11, board.Pieces[sq-11]);
			}			
			
			if(board.enPas != Squares.NO_SQ) {
				if(sq - 9 == board.enPas) {
					AddEnPassantMove( MOVE(sq, sq-9, Pieces.EMPTY, Pieces.EMPTY, MFLAGEP ) );
				}
				
				if(sq - 11 == board.enPas) {
					AddEnPassantMove( MOVE(sq, sq-11, Pieces.EMPTY, Pieces.EMPTY, MFLAGEP ) );
				}
			}
		}			
	}	
	
	pceIndex = LoopNonSlideIndex[board.side];
	pce = LoopNonSlidePce[pceIndex++];
	
	while (pce != 0) {
		for(pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum) {
			sq = board.pList[PCEINDEX(pce, pceNum)];
			
			for(index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;
				
				if(SQOFFBOARD(t_sq) == 1) {
					continue;
				}
				
				if(board.Pieces[t_sq] != Pieces.EMPTY) {
					if(PieceCol[board.Pieces[t_sq]] != board.side) {
						AddCaptureMove( MOVE(sq, t_sq, board.Pieces[t_sq], Pieces.EMPTY, 0 ));
					}
				}
			}			
		}	
		pce = LoopNonSlidePce[pceIndex++];
	}
	
	pceIndex = LoopSlideIndex[board.side];
	pce = LoopSlidePce[pceIndex++];
	
	while(pce != 0) {		
		for(pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum) {
			sq = board.pList[PCEINDEX(pce, pceNum)];
			
			for(index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;
				
				while( SQOFFBOARD(t_sq) == 0 ) {	
				
					if(board.Pieces[t_sq] != Pieces.EMPTY) {
						if(PieceCol[board.Pieces[t_sq]] != board.side) {
							AddCaptureMove( MOVE(sq, t_sq, board.Pieces[t_sq], Pieces.EMPTY, 0 ));
						}
						break;
					}
					t_sq += dir;
				}
			}			
		}	
		pce = LoopSlidePce[pceIndex++];
	}
}



















































