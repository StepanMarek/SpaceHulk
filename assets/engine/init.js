var game;

$(document).ready(function(){
	game = new Game();
	
	game.init();
	
	onStart( game ); // Předání startu mimo engine
});