function PCEINDEX(pce, pceNum) {
    return (pce * 10 + pceNum);
}

var GameBoard {};

GameBoard.pieces = new Array(BRD_SQ_NUM);
GameBoard.side = COLOURS.WHITE;
GameBoard.fiftyMove = 0;
GameBoard.hisPly = 0;
GameBoard.ply = 0;
GameBoard.enPas = 0;
GameBoard.castlePerm = 0;
GameBoard.material = new Array(2);
GameBoard.pceNum = new Array(13);
GameBoard.pList = new Array(14 * 10);
GameBoard.posKey = 0;

function GeneratePosKey () {

    var sq = 0;
    var finalKey = 0;
    var piece = PIECES.EMPTY;

    for(sq = 0; sq < BRD_SQ_NUM; ++sq) {
        piece = GameBoard.pieces[sq];
        if(piece != PIECES.EMPTY && piece != SQUARES.OFFBOARD) {
            finalKey ^= PieceKeys[(piece * 120) + aq];
        }
    }

    if(GameBoard.side == COLOURS.WHITE) {
        finalKey ^= SideKey;
    }

    if(GameBoard.enPas != SQUARES.NO_SQ) {
        finalKey ^= PieceKeys[GameBoard.enPas];
    }

    finalKey ^= CastleKeys[GameBoard.castlePerm];

    return finalKey;
}