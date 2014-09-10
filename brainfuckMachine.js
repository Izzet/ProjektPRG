function BrainfuckMachine (code){
	this.memory = [0];
	this.index = 0;
	
	this.code = code === undefined ? "" : code;
	this.cursor = 0;
	
	this.steps = 0;
	
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
	};
	
};
BrainfuckMachine.prototype.step = function (){
	if(this.code[this.cursor]){
		this.order[this.code[this.cursor]]();
		this.cursor++;
		this.steps++;
	}
	
};
BrainfuckMachine.prototype.doAll = function (){
	while(this.cursor < this.code.length && this.steps < 100){
		this.step();
	};
};