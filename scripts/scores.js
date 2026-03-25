let highScores = {
    solo: 0,
    duo: 0,
    pvpP1: 0, // Tracks Player 1 wins
    pvpP2: 0  // Tracks Player 2 wins
};

function loadHighScores() {
    highScores.solo = getItem('soloHigh') || 0;
    highScores.duo = getItem('duoHigh') || 0;
    highScores.pvpP1 = getItem('pvpP1Wins') || 0;
    highScores.pvpP2 = getItem('pvpP2Wins') || 0;
}

function updateHighScore(mode, currentScore) {
    if (currentScore > highScores[mode]) {
        highScores[mode] = currentScore;
        storeItem(mode + 'High', currentScore);
    }
}

// New function specifically for PvP wins
function addPvpWin(playerNum) {
    if (playerNum === 1) {
        highScores.pvpP1++;
        storeItem('pvpP1Wins', highScores.pvpP1);
    } else if (playerNum === 2) {
        highScores.pvpP2++;
        storeItem('pvpP2Wins', highScores.pvpP2);
    }
}