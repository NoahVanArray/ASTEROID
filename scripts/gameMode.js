
function preloadGameMode(){
    soloMode = loadImage('assets/graphics/modes/soloMode.png');
    duoMode = loadImage('assets/graphics/modes/duoMode.png');
    pvpMode = loadImage('assets/graphics/modes/pvpMode.png');
}
// le gamemode
function gameMode(){
    // loadHighScores();
    let width1 = 185;
    let width2 = 400;
    let width3 = 615;

    let scoreHeight = 100;
    let headerHeight = 180;
    let imageHeight = 285;
    let textHeight = 410;

    let imageSize = 175;

    imageMode(CENTER)
	textAlign(CENTER, CENTER);
  	fill(greenColor);
    textFont(texts);
	
	// solo gamemode
    textSize(24);
    text('Solo', width1, headerHeight); 
    image(soloMode, width1, imageHeight, imageSize, imageSize);
    textSize(14);
    text('(Press 1)\nPlay Solo.\nSurvive as long\nas you can.', width1, textHeight);

    // duo gamemode
    textSize(24);
    text('Duo', width2, headerHeight);
    image(duoMode, width2, imageHeight, imageSize, imageSize);
    textSize(14);
    text('(Press 2)\nPlay with\nanother player.\nSurvive  longer.', width2, textHeight);

    // pvp gamemode
    textSize(24);
    text('PVP', width3, headerHeight);
    image(pvpMode, width3, imageHeight, imageSize, imageSize);
    textSize(14);
    text('(Press 3)\nPlay with an\nopponent. Shoot to kill.\nWhoever survives\nthe longest, wins.', width3, textHeight);

    fill(goldColor); 
    textSize(14);
    text(`BEST: \n${highScores.solo}`, width1, scoreHeight);
    text(`BEST: \n${highScores.duo}`, width2, scoreHeight);
    text(`BEST: \n${highScores.pvp}`, width3, scoreHeight); 
    
    textSize(18);
    textAlign(RIGHT, CENTER);
    text('Back (esc).', 760, 560);
}