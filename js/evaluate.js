var PawnTable = [
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	,
10	,	10	,	0	,	-10	,	-10	,	0	,	10	,	10	,
5	,	0	,	0	,	5	,	5	,	0	,	0	,	5	,
0	,	0	,	10	,	20	,	20	,	10	,	0	,	0	,
5	,	5	,	5	,	10	,	10	,	5	,	5	,	5	,
10	,	10	,	10	,	20	,	20	,	10	,	10	,	10	,
20	,	20	,	20	,	30	,	30	,	20	,	20	,	20	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	
];


var KnightTable = [
0	,	-10	,	0	,	0	,	0	,	0	,	-10	,	0	,
0	,	0	,	0	,	5	,	5	,	0	,	0	,	0	,
0	,	0	,	10	,	10	,	10	,	10	,	0	,	0	,
0	,	0	,	10	,	20	,	20	,	10	,	5	,	0	,
5	,	10	,	15	,	20	,	20	,	15	,	10	,	5	,
5	,	10	,	10	,	20	,	20	,	10	,	10	,	5	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0		
];

var BishopTable = [
0	,	0	,	-10	,	0	,	0	,	-10	,	0	,	0	,
0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
0	,	0	,	10	,	15	,	15	,	10	,	0	,	0	,
0	,	10	,	15	,	20	,	20	,	15	,	10	,	0	,
0	,	10	,	15	,	20	,	20	,	15	,	10	,	0	,
0	,	0	,	10	,	15	,	15	,	10	,	0	,	0	,
0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	
];

var RookTable = [
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
25	,	25	,	25	,	25	,	25	,	25	,	25	,	25	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0		
];

var BishopPair = 40;


function EvalPosition() {
	
	var score = board.material[0] - board.material[1];
	
	var pce;
	var sq;
	var pceNum;
	
	pce = Pieces.wP;
	for(pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum) {
		sq = board.pList[PCEINDEX(pce,pceNum)];
		score += PawnTable[SQ64(sq)];
	}
	
	pce = Pieces.bP;
	for(pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum) {
		sq = board.pList[PCEINDEX(pce,pceNum)];
		score -= PawnTable[MIRROR64(SQ64(sq))];
	}
	
	pce = Pieces.wN;	
	for(pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum) {
		sq = board.pList[PCEINDEX(pce,pceNum)];
		score += KnightTable[SQ64(sq)];
	}	

	pce = Pieces.bN;	
	for(pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum) {
		sq = board.pList[PCEINDEX(pce,pceNum)];
		score -= KnightTable[MIRROR64(SQ64(sq))];
	}			
	
	pce = Pieces.wB;	
	for(pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum) {
		sq = board.pList[PCEINDEX(pce,pceNum)];
		score += BishopTable[SQ64(sq)];
	}	

	pce = Pieces.bB;	
	for(pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum) {
		sq = board.pList[PCEINDEX(pce,pceNum)];
		score -= BishopTable[MIRROR64(SQ64(sq))];
	}
	
	pce = Pieces.wR;	
	for(pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum) {
		sq = board.pList[PCEINDEX(pce,pceNum)];
		score += RookTable[SQ64(sq)];
	}	

	pce = Pieces.bR;	
	for(pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum) {
		sq = board.pList[PCEINDEX(pce,pceNum)];
		score -= RookTable[MIRROR64(SQ64(sq))];
	}
	
	pce = Pieces.wQ;	
	for(pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum) {
		sq = board.pList[PCEINDEX(pce,pceNum)];
		score += RookTable[SQ64(sq)];
	}	

	pce = Pieces.bQ;	
	for(pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum) {
		sq = board.pList[PCEINDEX(pce,pceNum)];
		score -= RookTable[MIRROR64(SQ64(sq))];
	}	
	
	if(board.pceNum[Pieces.wB] >= 2) {
		score += BishopPair;
	}
	
	if(board.pceNum[Pieces.bB] >= 2) {
		score -= BishopPair;
	}
	
	if(board.side == 0) {
		return score;
	} else {
		return -score;
	}

}































   
   
   
   
   
   
   
















