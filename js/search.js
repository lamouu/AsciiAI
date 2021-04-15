var controller = {};

controller.nodes;
controller.fh;
controller.fhf;
controller.depth;
controller.time;
controller.start;
controller.stop;
controller.best;
controller.thinking;

function PickNextMove(MoveNum) {

	var index = 0;
	var bestScore = -1;
	var bestNum = MoveNum;
	
	for(index = MoveNum; index < board.moveListStart[board.ply+1]; ++index) {
		if(board.moveScores[index] > bestScore) {
			bestScore = board.moveScores[index];
			bestNum = index;			
		}
	} 
	
	if(bestNum != MoveNum) {
		var temp = 0;
		temp = board.moveScores[MoveNum];
		board.moveScores[MoveNum] = board.moveScores[bestNum];
		board.moveScores[bestNum] = temp;
		
		temp = board.moveList[MoveNum];
		board.moveList[MoveNum] = board.moveList[bestNum];
		board.moveList[bestNum] = temp;
	}

}

function ClearPvTable() {

	for(index = 0; index < PvEntries; index++) {
			board.PvTable[index].move = NOMOVE;
			board.PvTable[index].posKey = 0;		
	}
}

function CheckUp() {
	if (( $.now() - controller.start ) > controller.time) {
		controller.stop = 1;
	}
}

function IsRepetition() {
	var index = 0;
	
	for(index = board.hisPly - board.fiftyMove; index < board.hisPly - 1; ++index) {
		if(board.posKey == board.history[index].posKey) {
			return 1;
		}
	}
	
	return 0;
}

function Quiescence(alpha, beta) {

	if ((controller.nodes & 2047) == 0) {
		CheckUp();
	}
	
	controller.nodes++;
	
	if( (IsRepetition() || board.fiftyMove >= 100) && board.ply != 0) {
		return 0;
	}
	
	if(board.ply > MaxDepth -1) {
		return EvalPosition();
	}	
	
	var Score = EvalPosition();
	
	if(Score >= beta) {
		return beta;
	}
	
	if(Score > alpha) {
		alpha = Score;
	}
	
	GenerateCaptures();
	
	var MoveNum = 0;
	var Legal = 0;
	var OldAlpha = alpha;
	var BestMove = NOMOVE;
	var Move = NOMOVE;	
	
	for(MoveNum = board.moveListStart[board.ply]; MoveNum < board.moveListStart[board.ply + 1]; ++MoveNum) {
	
		PickNextMove(MoveNum);
		
		Move = board.moveList[MoveNum];	

		if(MakeMove(Move) == 0) {
			continue;
		}		
		Legal++;
		Score = -Quiescence( -beta, -alpha);
		
		TakeMove();
		
		if(controller.stop == 1) {
			return 0;
		}
		
		if(Score > alpha) {
			if(Score >= beta) {
				if(Legal == 1) {
					controller.fhf++;
				}
				controller.fh++;	
				return beta;
			}
			alpha = Score;
			BestMove = Move;
		}		
	}
	
	if(alpha != OldAlpha) {
		StorePvMove(BestMove);
	}
	
	return alpha;

}

function AlphaBeta(alpha, beta, depth) {

	
	if(depth <= 0) {
		return Quiescence(alpha, beta);
	}
	
	if ((controller.nodes & 2047) == 0) {
		CheckUp();
	}
	
	controller.nodes++;
	
	if( (IsRepetition() || board.fiftyMove >= 100) && board.ply != 0) {
		return 0;
	}
	
	if(board.ply > MaxDepth -1) {
		return EvalPosition();
	}	
	
	var InCheck = SqAttacked(board.pList[PCEINDEX(Kings[board.side],0)], board.side^1);
	if(InCheck == 1)  {
		depth++;
	}	
	
	var Score = -Infinite;
	
	GenerateMoves();
	
	var MoveNum = 0;
	var Legal = 0;
	var OldAlpha = alpha;
	var BestMove = NOMOVE;
	var Move = NOMOVE;	
	
	var PvMove = ProbePvTable();
	if(PvMove != NOMOVE) {
		for(MoveNum = board.moveListStart[board.ply]; MoveNum < board.moveListStart[board.ply + 1]; ++MoveNum) {
			if(board.moveList[MoveNum] == PvMove) {
				board.moveScores[MoveNum] = 2000000;
				break;
			}
		}
	}
	
	for(MoveNum = board.moveListStart[board.ply]; MoveNum < board.moveListStart[board.ply + 1]; ++MoveNum) {
	
		PickNextMove(MoveNum);	
		
		Move = board.moveList[MoveNum];	
		
		if(MakeMove(Move) == 0) {
			continue;
		}		
		Legal++;
		Score = -AlphaBeta( -beta, -alpha, depth-1);
		
		TakeMove();
		
		if(controller.stop == 1) {
			return 0;
		}
		
		if(Score > alpha) {
			if(Score >= beta) {
				if(Legal == 1) {
					controller.fhf++;
				}
				controller.fh++;		
				if((Move & MFLAGCAP) == 0) {
					board.searchKillers[MaxDepth + board.ply] = 
						board.searchKillers[board.ply];
					board.searchKillers[board.ply] = Move;
				}					
				return beta;
			}
			if((Move & MFLAGCAP) == 0) {
				board.searchHistory[board.Pieces[FROMSQ(Move)] * BrdSqNum + TOSQ(Move)]
						 += depth * depth;
			}
			alpha = Score;
			BestMove = Move;				
		}		
	}	
	
	if(Legal == 0) {
		if(InCheck == 1) {
			return -Mate + board.ply;
		} else {
			return 0;
		}
	}	
	
	if(alpha != OldAlpha) {
		StorePvMove(BestMove);
	}
	
	return alpha;
}

function ClearForSearch() {

	var index = 0;
	var index2 = 0;
	
	for(index = 0; index < 14 * BrdSqNum; ++index) {				
		board.searchHistory[index] = 0;	
	}
	
	for(index = 0; index < 3 * MaxDepth; ++index) {
		board.searchKillers[index] = 0;
	}	
	
	ClearPvTable();
	board.ply = 0;
	controller.nodes = 0;
	controller.fh = 0;
	controller.fhf = 0;
	controller.start = $.now();
	controller.stop = 0;
}

function SearchPosition() {

	var bestMove = NOMOVE;
	var bestScore = -Infinite;
	var Score = -Infinite;
	var currentDepth = 0;
	var line;
	var PvNum;
	var c;
	ClearForSearch();
	
	for( currentDepth = 1; currentDepth <= controller.depth; ++currentDepth) {	
	
		Score = AlphaBeta(-Infinite, Infinite, currentDepth);
					
		if(controller.stop == 1) {
			break;
		}
		
		bestScore = Score; 
		bestMove = ProbePvTable();
		line = 'D:' + currentDepth + ' Best:' + PrMove(bestMove) + ' Score:' + bestScore + 
				' nodes:' + controller.nodes;
				
		PvNum = GetPvLine(currentDepth);
		line += ' Pv:';
		for( c = 0; c < PvNum; ++c) {
			line += ' ' + PrMove(board.PvArray[c]);
		}
		if(currentDepth!=1) {
			line += (" Ordering:" + ((controller.fhf/controller.fh)*100).toFixed(2) + "%");
		}
		if (DEBUG) console.log(line);
						
	}	

	controller.best = bestMove;
	controller.thinking = 0;
	UpdateDOMStats(bestScore, currentDepth);
}

function UpdateDOMStats(dom_score, dom_depth) {

	var scoreText = "Score: " + (dom_score / 100).toFixed(2);
	if(Math.abs(dom_score) > Mate - MaxDepth) {
		scoreText = "Score: Mate In " + (Mate - (Math.abs(dom_score))-1) + " moves";
	}
	
	$("#OrderingOut").text("Ordering: " + ((controller.fhf/controller.fh)*100).toFixed(2) + "%");
	$("#DepthOut").text("Depth: " + dom_depth);
	$("#ScoreOut").text(scoreText);
	$("#NodesOut").text("Nodes: " + controller.nodes);
	$("#TimeOut").text("Time: " + (($.now()-controller.start)/1000).toFixed(1) + "s");
	$("#BestOut").text("BestMove: " + PrMove(controller.best));
}












































