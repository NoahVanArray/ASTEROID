// le gamemode
function gameMode(){
	let headerHeight = 4.5;
	let textHeight = 1.70;

	let width1 = 4.3;
	let width2 = 2;
	let width3 = 1.3;

	textAlign(CENTER);
  	fill(55, 255, 0);
    textFont(texts);
	
	// solo gamemode
    textSize(windowWidth/44);
    text('Solo', width / width1, height / headerHeight);

    textSize(windowWidth/77);
    text('(Press 1)\nPlay Solo.\nSurvive as long\nas you can.', width / width1, height / textHeight);

	// duo gamemode
    textSize(windowWidth/44);
    text('Duo', width / width2, height / headerHeight);

    textSize(windowWidth/77);
    text('(Press 2)\nPlay with\nanother player.\nSurvive  longer.', width / width2, height / textHeight);

    // pvp gamemode
    textSize(windowWidth/44);
    text('PVP', width / width3, height / headerHeight);

    textSize(windowWidth/77);
    text('(Press 3)\nPlay with an\nopponent. Shoot to kill.\nWhoever survives\nthe longest, wins.', width / width3, height / textHeight);

    textSize(windowWidth/55);
	textAlign(CENTER);
    text('Back (esc).', width / 1.1, height / 1.05);

    fill(255, 200, 0); 
    textSize(18);
    text(`SOLO BEST: \n${highScores.solo}`, width / width1, height - 150);
    text(`DUO BEST: \n${highScores.duo}`, width / width2, height - 150);
    text(`PVP BEST: \n${highScores.pvp}`, width / width3, height - 150);

}