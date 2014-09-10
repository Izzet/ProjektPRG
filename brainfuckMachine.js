function BrainfuckMachine (code, renderer){
	this.memory = [0];
	this.index = 0;
	
	this.code = code === undefined ? "" : code;
	this.cursor = 0;
	
	this.steps = 0;
	
	this.renderer = new BrainfuckRenderer();
	
	var _this = this;
	this.order = {
		"+" : function (){
			_this.memory[_this.index]++;
		},
		"-" : function (){
			_this.memory[_this.index]--;
		},
		">" : function (){
			if(_this.memory[_this.index+1] === undefined)
				_this.memory[_this.index+1] = 0;
			_this.index++;
		},
		"<" : function (){
			if(_this.memory[_this.index-1] === undefined)
				_this.memory[_this.index-1] = 0;
			_this.index--;
		},
		"." : function (){
			_this.renderer.add(_this.memory[_this.index]);
		},
	};
	
};
BrainfuckMachine.prototype.step = function (){
	if(this.code[this.cursor]){
		this.order[this.code[this.cursor]]();
		this.cursor++;
		this.steps++;
	}
	this.renderer.last = this.memory[this.index];
};
BrainfuckMachine.prototype.doAll = function (){
	while(this.cursor < this.code.length && this.steps < 100){
		this.step();
	};
};
BrainfuckMachine.prototype.faire = function(code){
	this.code = code;
	this.cursor = 0;
	this.doAll();
};