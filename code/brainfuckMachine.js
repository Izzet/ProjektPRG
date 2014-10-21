function BrainfuckMachine (code, input, output){
	this.memory = [0];
	this.index = 0;
	this.cellLimit = 255;
	
	this.code = code === undefined ? ",." : code;
	this.cursor = 0;
	this.parStack = [];
	this.parNum = 0;
	
	this.steps = 0;
	this.maxSteps = 100000;
	this.interval = 5;
	
	this.waitingForInput = false;
	this.doingAll = false;
	
	this.renderer = new BrainfuckRenderer(output);
	this.inputElement = input;
	
	var _this = this;
	this.order = {
		"+" : function (){
			if(_this.memory[_this.index] < _this.cellLimit)
				_this.memory[_this.index]++;
			else
				_this.memory[_this.index] = 0;
		},
		"-" : function (){
			if(_this.memory[_this.index] > 0)
				_this.memory[_this.index]--;
			else
				_this.memory[_this.index] = _this.cellLimit;
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
		"," : function (){
			_this.waitingForInput = true;
			_this.inputElement.disabled = false;
		},
	};
	
};
BrainfuckMachine.prototype.step = function (){
	if(this.waitingForInput)
		return;
	if(this.code[this.cursor]){
		if(this.order[this.code[this.cursor]]){
			this.order[this.code[this.cursor]]();
			this.steps++;
		}
		this.cursor++;
	}
	this.renderer.last = this.memory[this.index];
};
BrainfuckMachine.prototype.doAll = function (){
	this.doingAll = true;
	this.steps = 0;
	while(this.cursor < this.code.length && this.steps < this.maxSteps && !this.waitingForInput){
		this.step();
	};
};
BrainfuckMachine.prototype.doAllSlow = function (s){
	this.steps = s === undefined ? 0 : s;
	var _this = this;
	if(this.cursor < this.code.length && this.steps < this.maxSteps){
		this.step();
		setTimeout(function (){_this.doAllSlow(_this.steps);}, _this.interval);
	};
};
BrainfuckMachine.prototype.doCode = function (code, slow){
	code = code === undefined ? "" : code;
	this.reset();
	this.code = code;
	slow ? this.doAllSlow() : this.doAll();
};
BrainfuckMachine.prototype.reset = function (){
	this.memory = [0];
	this.index = 0;
	
	this.code = "";
	this.cursor = 0;
	this.parStack = [];
	this.parNum = 0;
	
	this.steps = 0;
	this.maxSteps = 10000000;
	
	this.waitingForInput = false;
	this.doingAll = false;
	
	this.renderer.reset();
};
BrainfuckMachine.prototype.input = function ( input ){
	this.memory[this.index] = input;
	this.inputElement.disabled = true;
	this.inputElement.value = "";
	this.waitingForInput = false;
	if(this.doingAll)
		this.doAll();
};