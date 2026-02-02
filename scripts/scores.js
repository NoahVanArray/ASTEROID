let highScores = {
    solo: 0,
    duo: 0,
    pvp: 0
};

function loadHighScores() {
    highScores.solo = getItem('soloHigh') || 0;
    highScores.duo = getItem('duoHigh') || 0;
    highScores.pvp = getItem('pvpHigh') || 0;
}

function updateHighScore(mode, currentScore) {
    if (currentScore > highScores[mode]) {
        highScores[mode] = currentScore;
        
        // storeItem saves to web storage
        storeItem(mode + 'High', currentScore);
    }
}