function PCEINDEX(pce, pceNum) {
	return (pce * 10 + pceNum);
}

var board = {};

board.Pieces = new Array(BrdSqNum);
board.side = 0;
board.fiftyMove = 0;
board.hisPly = 0;
board.history = [];
board.ply = 0;
board.enPas = 0;
board.castlePerm = 0;
board.material = new Array(2); // WHITE,BLACK material of Pieces
board.pceNum = new Array(13); // indexed by Pce
board.pList = new Array(14 * 10);
board.posKey = 0;
board.moveList = new Array(MaxDepth * MaxPositionMoves);
board.moveScores = new Array(MaxDepth * MaxPositionMoves);
board.moveListStart = new Array(MaxDepth);
board.PvTable = [];
board.PvArray = new Array(MaxDepth);
board.searchHistory = new Array( 14 * BrdSqNum);
board.searchKillers = new Array(3 * MaxDepth);



function CheckBoard() {   
 
	var t_pceNum = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var t_material = [ 0, 0];
	var sq64, t_piece, t_pce_num, sq120, colour, pcount;
	
	for(t_piece = Pieces.wP; t_piece <= Pieces.bK; ++t_piece) {
		for(t_pce_num = 0; t_pce_num < board.pceNum[t_piece]; ++t_pce_num) {
			sq120 = board.pList[PCEINDEX(t_piece,t_pce_num)];
			if(board.Pieces[sq120] != t_piece) {
				console.log('Error Pce Lists');
				return 0;
			}
		}	
	}
	
	for(sq64 = 0; sq64 < 64; ++sq64) {
		sq120 = SQ120(sq64);
		t_piece = board.Pieces[sq120];
		t_pceNum[t_piece]++;
		t_material[PieceCol[t_piece]] += PieceVal[t_piece];
	}
	
	for(t_piece = Pieces.wP; t_piece <= Pieces.bK; ++t_piece) {
		if(t_pceNum[t_piece] != board.pceNum[t_piece]) {
				console.log('Error t_pceNum');
				return 0;
			}	
	}
	
	if(t_material[0] != board.material[0] ||
			 t_material[1] != board.material[1]) {
				console.log('Error t_material');
				return 0;
	}	
	
	if(board.side!=0 && board.side!=1) {
				console.log('Error board.side');
				return 0;
	}
	
	if(GeneratePosKey()!=board.posKey) {
				console.log('Error board.posKey');
				return 0;
	}	
	return 1;
}

function PrintBoard() {
	
	var sq,file,rank,piece;

	console.log("\nGame Board:\n");
	for(rank = 7; rank >= 0; rank--) {
		var line =(RankChar[rank] + "  ");
		for(file = 0; file <= 7; file++) {
			sq = FR2SQ(file,rank);
			piece = board.Pieces[sq];
			boardArray[rank][file] = piece;
			line += (" " + PceChar[piece] + " ");
		}
		console.log(line);
	}
	
	console.log("");
	var line = "   ";
	for(file = 0; file <= 7; file++) {
		line += (' ' + FileChar[file] + ' ');	
	}
	
	console.log(line);
	console.log("side:" + SideChar[board.side] );
	console.log("enPas:" + board.enPas);
	line = "";	
	
	if(board.castlePerm & 1) line += 'K';
	if(board.castlePerm & 2) line += 'Q';
	if(board.castlePerm & 4) line += 'k';
	if(board.castlePerm & 8) line += 'q';
	console.log("castle:" + line);
	console.log("key:" + board.posKey.toString(16));
}

function GeneratePosKey() {

	var sq = 0;
	var finalKey = 0;
	var piece = Pieces.empty;

	for(sq = 0; sq < BrdSqNum; ++sq) {
		piece = board.Pieces[sq];
		if(piece != Pieces.empty && piece != Squares.offboard) {			
			finalKey ^= PieceKeys[(piece * 120) + sq];
		}		
	}

	if(board.side == 0) {
		finalKey ^= SideKey;
	}
	
	if(board.enPas != Squares.NoSq) {		
		finalKey ^= PieceKeys[board.enPas];
	}
	
	finalKey ^= CastleKeys[board.castlePerm];
	
	return finalKey;

}

function PrintPieceLists() {

	var piece, pceNum;
	
	for(piece = Pieces.wP; piece <= Pieces.bK; ++piece) {
		for(pceNum = 0; pceNum < board.pceNum[piece]; ++pceNum) {
			console.log('Piece ' + PceChar[piece] + ' on ' + PrSq( board.pList[PCEINDEX(piece,pceNum)] ));
		}
	}

}

function UpdateListsMaterial() {	
	
	var piece,sq,index,colour;
	
	for(index = 0; index < 14 * 120; ++index) {
		board.pList[index] = Pieces.empty;
	}
	
	for(index = 0; index < 2; ++index) {		
		board.material[index] = 0;		
	}	
	
	for(index = 0; index < 13; ++index) {
		board.pceNum[index] = 0;
	}
	
	for(index = 0; index < 64; ++index) {
		sq = SQ120(index);
		piece = board.Pieces[sq];
		if(piece != Pieces.empty) {
			
			colour = PieceCol[piece];		
			
			board.material[colour] += PieceVal[piece];
			
			board.pList[PCEINDEX(piece,board.pceNum[piece])] = sq;
			board.pceNum[piece]++;			
		}
	}
	
}

function ResetBoard() {
	
	var index = 0;
	
	for(index = 0; index < BrdSqNum; ++index) {
		board.Pieces[index] = Squares.offboard;
	}
	
	for(index = 0; index < 64; ++index) {
		board.Pieces[SQ120(index)] = Pieces.empty;
	}
	
	board.side = 2;
	board.enPas = Squares.NoSq;
	board.fiftyMove = 0;	
	board.ply = 0;
	board.hisPly = 0;	
	board.castlePerm = 0;	
	board.posKey = 0;
	board.moveListStart[board.ply] = 0;
	
}

//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

function ParseFen(fen) {

	ResetBoard();
	
	var rank = 7;
    var file = 0;
    var piece = 0;
    var count = 0;
    var i = 0;  
	var sq120 = 0;
	var fenCnt = 0; // fen[fenCnt]
	
	while ((rank >= 0) && fenCnt < fen.length) {
	    count = 1;
		switch (fen[fenCnt]) {
			case 'p': piece = Pieces.bP; break;
            case 'r': piece = Pieces.bR; break;
            case 'n': piece = Pieces.bN; break;
            case 'b': piece = Pieces.bB; break;
            case 'k': piece = Pieces.bK; break;
            case 'q': piece = Pieces.bQ; break;
            case 'P': piece = Pieces.wP; break;
            case 'R': piece = Pieces.wR; break;
            case 'N': piece = Pieces.wN; break;
            case 'B': piece = Pieces.wB; break;
            case 'K': piece = Pieces.wK; break;
            case 'Q': piece = Pieces.wQ; break;

            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
                piece = Pieces.empty;
                count = fen[fenCnt].charCodeAt() - '0'.charCodeAt();
                break;
            
            case '/':
            case ' ':
                rank--;
                file = 0;
                fenCnt++;
                continue;  
            default:
                console.log("FEN error");
                return;

		}
		
		for (i = 0; i < count; i++) {	
			sq120 = FR2SQ(file,rank);            
            board.Pieces[sq120] = piece;
			file++;
        }
		fenCnt++;
	} // while loop end
	
	//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
	board.side = (fen[fenCnt] == 'w') ? 0 : 1;
	fenCnt += 2;
	
	for (i = 0; i < 4; i++) {
        if (fen[fenCnt] == ' ') {
            break;
        }		
		switch(fen[fenCnt]) {
			case 'K': board.castlePerm |= 1; break;
			case 'Q': board.castlePerm |= 2; break;
			case 'k': board.castlePerm |= 4; break;
			case 'q': board.castlePerm |= 8; break;
			default:	     break;
        }
		fenCnt++;
	}
	fenCnt++;	
	
	if (fen[fenCnt] != '-') {        
		file = fen[fenCnt].charCodeAt() - 'a'.charCodeAt();
		rank = fen[fenCnt + 1].charCodeAt() - '1'.charCodeAt();	
		console.log("fen[fenCnt]:" + fen[fenCnt] + " File:" + file + " Rank:" + rank);	
		board.enPas = FR2SQ(file,rank);		
    }
	
	board.posKey = GeneratePosKey();	
	UpdateListsMaterial();
}

function PrintSqAttacked() {
	
	var sq,file,rank,piece;

	console.log("\nAttacked:\n");
	
	for(rank = 7; rank >= 0; rank--) {
		var line =((rank+1) + "  ");
		for(file = 0; file <= 7; file++) {
			sq = FR2SQ(file,rank);
			if(SqAttacked(sq, board.side^1) == 1) piece = "X";
			else piece = "-";
			line += (" " + piece + " ");
		}
		console.log(line);
	}
	
	console.log("");
	
}

function SqAttacked(sq, side) {
	var pce;
	var t_sq;
	var index;
	
	if(side == 0) {
		if(board.Pieces[sq - 11] == Pieces.wP || board.Pieces[sq - 9] == Pieces.wP) {
			return 1;
		}
	} else {
		if(board.Pieces[sq + 11] == Pieces.bP || board.Pieces[sq + 9] == Pieces.bP) {
			return 1;
		}	
	}
	
	for(index = 0; index < 8; index++) {
		pce = board.Pieces[sq + KnDir[index]];
		if(pce != Squares.offboard && PieceCol[pce] == side && PieceKnight[pce] == 1) {
			return 1;
		}
	}
	
	for(index = 0; index < 4; ++index) {		
		dir = RkDir[index];
		t_sq = sq + dir;
		pce = board.Pieces[t_sq];
		while(pce != Squares.offboard) {
			if(pce != Pieces.empty) {
				if(PieceRookQueen[pce] == 1 && PieceCol[pce] == side) {
					return 1;
				}
				break;
			}
			t_sq += dir;
			pce = board.Pieces[t_sq];
		}
	}
	
	for(index = 0; index < 4; ++index) {		
		dir = BiDir[index];
		t_sq = sq + dir;
		pce = board.Pieces[t_sq];
		while(pce != Squares.offboard) {
			if(pce != Pieces.empty) {
				if(PieceBishopQueen[pce] == 1 && PieceCol[pce] == side) {
					return 1;
				}
				break;
			}
			t_sq += dir;
			pce = board.Pieces[t_sq];
		}
	}
	
	for(index = 0; index < 8; index++) {
		pce = board.Pieces[sq + KiDir[index]];
		if(pce != Squares.offboard && PieceCol[pce] == side && PieceKing[pce] == 1) {
			return 1;
		}
	}
	return 0;
}





































































