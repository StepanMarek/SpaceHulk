function Game(){
	this.objects = {};
	this.level = {};

	this.canvas = document.createElement("canvas");
	this.ctx = this.canvas.getContext("2d");

	this.width = 800;
	this.height = 480;

	this.gui = new GUI(this.canvas.width, this.canvas.height);
	this.eventhandler = new Eventhandler(this.canvas);
	this.loader = new Loader();
	this.jukebox = new Jukebox();
	
	this.camera = new Vector2();
	this.nonLinked = 0;
};

Game.prototype.init = function (){
	document.body.appendChild(this.canvas);

	var _this = this;
	this.interval = setInterval(function (){_this.tick();},1000/60);

	$(window).resize(function() {
		_this.adjustCanvas();
	});
};

Game.prototype.adjustCanvas = function(width, height) {
	this.canvas.width = width === undefined ? this.width : (this.width = width);
	this.canvas.height = height === undefined ? this.height : (this.height = height);

	this.canvas.style.left = (window.innerWidth - this.width)/2 + "px";
	this.canvas.style.top = (window.innerHeight - this.height)/3 + "px";

	this.eventhandler.offset = $(this.canvas).offset();
	this.gui.width = this.width * this.scale;
	this.gui.height = this.height * this.scale;

	this.disableInterpolation();
};

// Vypne interpolaci canvasu = lepší pro pixelart
Game.prototype.disableInterpolation = function() {
	this.ctx.webkitImageSmoothingEnabled = this.ctx.mozImageSmoothingEnabled = false;
};

Game.prototype.tick = function (){
	//~ console.log("engine running");
	this.eventhandler.loop();
	for(var i in this.objects){
		this.objects[i].tick();
	};
	game.gui.tick();
	this.render(this.ctx);
};

Game.prototype.render = function (ctx){
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
	// GUI je na hře
	for(var i in this.objects){
		this.objects[i].render(ctx);
	};
	this.gui.render(ctx);
	return true;
};

Game.prototype.levelLoad = function (src){
	var _this = this;
	$.get(src,function (data){
		var json = eval(data);
		_this.loader.loadAssets(json,function (lvl){
			_this.level = lvl;
			_this.level.afterLoad = json.afterLoad;
			_this.level.afterLoad();
		})
	});
};

Game.prototype.checkCollision = function (obj){
	return false;
};

Game.prototype.add = function (obj,id){
	if(id === undefined){
		this.objects[this.nonLinked] = obj;
		this.nonLinked++;
	}
	else{
		this.objects[id] = obj;
	}
};