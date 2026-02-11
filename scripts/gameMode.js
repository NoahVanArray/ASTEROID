
function preloadGameMode(){
    soloMode = loadImage(soloModeBase64);
    duoMode = loadImage(duoModeBase64);
    pvpMode = loadImage(pvpModeBase64);
}
// le gamemode
function gameMode(){
    // loadHighScores();
	let headerHeight = 3.2;
	let textHeight = 1.55;
    let imageHeight = 2.1;
    let scoreHeight = 6;

    let imageSize = 175;

	let width1 = 4.3;
	let width2 = 2;
	let width3 = 1.3;

    imageMode(CENTER)
	textAlign(CENTER);
  	fill(greenColor);
    textFont(texts);
	
	// solo gamemode
    textSize(windowWidth/44);
    text('Solo', width / width1, height / headerHeight);

    image(soloMode, width / width1, height / imageHeight, imageSize, imageSize);

    textSize(windowWidth/77);
    text('(Press 1)\nPlay Solo.\nSurvive as long\nas you can.', width / width1, height / textHeight);

	// duo gamemode
    textSize(windowWidth/44);
    text('Duo', width / width2, height / headerHeight);

    image(duoMode, width / width2, height / imageHeight, imageSize, imageSize);

    textSize(windowWidth/77);
    text('(Press 2)\nPlay with\nanother player.\nSurvive  longer.', width / width2, height / textHeight);

    // pvp gamemode
    textSize(windowWidth/44);
    text('PVP', width / width3, height / headerHeight);

    image(pvpMode, width / width3, height / imageHeight, imageSize, imageSize);

    textSize(windowWidth/77);
    text('(Press 3)\nPlay with an\nopponent. Shoot to kill.\nWhoever survives\nthe longest, wins.', width / width3, height / textHeight);

    fill(goldColor); 
    textSize(windowWidth/77);
    text(`BEST: \n${highScores.solo}`, width / width1 + 2.5, height / scoreHeight);
    text(`BEST: \n${highScores.duo}`, width / width2 + 2.5, height / scoreHeight);
    text(`BEST: \n${highScores.pvp}`, width / width3 + 2.5, height / scoreHeight); // not needed
    
    textSize(windowWidth/55);
	textAlign(RIGHT);
    text('Back (esc).', width / 1.1, height / 1.05);


}