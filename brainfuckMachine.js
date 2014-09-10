function BrainfuckMachine (code, renderer){
	this.memory = [0];
	this.index = 0;
	
	this.code = code === undefined ? "" : code;
	this.cursor = 0;
	this.parStack = [];
	this.parNum = 0;
	
	this.steps = 0;
	this.maxSteps = 1000;
	
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
		"[" : function (){
			if(_this.memory[_this.index])
				_this.parStack.push(_this.cursor);
			else{
				while(_this.code[_this.cursor] != "]" || _this.parNum){
					if(_this.code[_this.cursor] == "]")
						_this.parNum--;
					_this.cursor++;
					if(_this.cursor >= _this.code.length){
						console.warn("Syntax error - unended cycle!");
						break;
					}
					if(_this.code[_this.cursor] == "[")
						_this.parNum++;
					
				};
				_this.parNum = 0;
			}
		},
		"]" : function (){
			if(_this.parStack[_this.parStack.length-1] === undefined){
				console.warn("Syntax error, unstarted cycle!");
				return;
			}
			_this.cursor = _this.parStack[_this.parStack.length-1]-1;
			_this.parStack.splice(_this.parStack.length-1,1);
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
	this.steps = 0;
	while(this.cursor < this.code.length && this.steps < this.maxSteps){
		this.step();
	};
};
BrainfuckMachine.prototype.faire = function(code){
	this.code = code;
	this.cursor = 0;
	this.doAll();
};