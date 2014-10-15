function Disassembler (){
	this.pointer = 0;
	this.vars = [];
	this.freeRam = 0;
	
	this.errorLogSpan = false;
	this.errored = false;
	
	var _this = this
	
	this.HARD = function (args){
		return args[0];
	};
	
	this.INCC = function (){
		return "+";
	};
	
	this.DECC = function (){
		return "-";
	};
	
	this.ECHC = function (){
		return ".";
	};
	
	this.RSRV = function (args){
		this.freeRam += parseInt(args[0]);
		return "";
	};
	
	this.MOVE = function (args){ // int index
		if(!parseInt(args[0]) && parseInt(args[0]) != 0){
			handleError(_this.errorLogSpan, "Argument not a number", args[args.length-1]);
			return "";
		}
		var x = parseInt(args[0]);
		var out = "";
		var pointer = _this.pointer;
		
		if(x-pointer > 0){
			for(var i = 0; i < x-pointer; i++){
				out += ">";
				_this.pointer++;
			};
		}
		else {
			for(var i = 0; i < pointer-x; i++){
				out += "<";
				_this.pointer--;
			};
		}
		return out;
	};
	
	this.MOVM = function (){ // přesun do ramky - memory
		var out = _this.MOVE([_this.freeRam]);
		return out;
	};
	
	this.INIT = function (args){ // string variable name
		if(parseInt(args[0]) == 0 || parseInt(args[0])){
			handleError(_this.errorLogSpan, "Invalid variable name", args[args.length-1]);
			return "";
		}
		_this.vars[args[0]] = _this.freeRam;
		_this.RSRV([1,args[args.length-1]]);
		return "";
	};
	
	this.MOVT = function (args){ // string variable name
		if(!_this.vars[args[0]] && _this.vars[args[0]] !== 0){
			handleError(_this.errorLogSpan, "Unknown variable", args[args.length-1]);
			return "";
		}
		var out = _this.MOVE([_this.vars[args[0]], args[args.length-1]]);
		return out;
	};
	
	this.CLRC = function (){ // Vyčistí současnou buňku
		return "[-]";
	};
	
	this.CLRV = function (args){ // string variable name
		var out = _this.MOVT(args)+_this.CLRC();
		return out;
	};
	
	this.ADXC = function (args){ // int target index - přičte hodnotu současné buňky k cílové
		var position = _this.pointer;
		var out = "[-"+_this.MOVE(args)+"+"+_this.MOVE([position, args[args.length-1]])+"]";
		return out;
	};
	
	this.SETV = function (args){ // string variable name, int value
		var out = _this.CLRV(args);
		for(var i = 0; i < parseInt(args[1]); i++){
			out+="+";
		};
		return out;
	};
	
	this.COPX = function (args){ // int source index, int first destination index, int second destination index, ... - maže obsah source
		var argsL = args.length;
		var out = _this.MOVE([args[0], argsL]);
		out+="[-";
		for(var i = 1; i < args.length-1;i++){
			out+=_this.MOVE([args[i],argsL])+"+";
		};
		out+=_this.MOVE([args[0],argsL])+"]";
		return out;
	};
	
	this.COPY = function (args){ // int source index, int first destination index, int second destination index, ...
		var out = _this.COPX([args[0], _this.freeRam, args[args.length-1]]);
		var arguments = [];
		arguments[0] = _this.freeRam;
		arguments[1] = args[0];
		for(var i = 2; i < args.length+1;i++){
			arguments[i] = args[i-1];
		};
		arguments[arguments.length-1] = args[args.length-1];
		out+=_this.COPX(arguments);
		return out;
	};
	
	this.COPV = function (args){
		var arguments = [];
		for(var i = 0; i < args.length-1; i++){
			arguments[i] = _this.vars[args[i]];
		};
		arguments[args.length-1] = args[args.length-1];
		return _this.COPY(arguments);
	};
};
Disassembler.prototype.compile = function (code, outputElement){
	
	this.pointer = 0;
	this.vars = [];
	this.freeRam = 0;
	this.errorLogSpan.innerHTML = "";
	
	var lines = code.split("\n");
	
	var line = [];
	var args = [];
	var output = "";
	
	for(var i = 0; i < lines.length; i++){
		line = lines[i].split(" ");
		args = line.splice(1,line.length-1);
		args[args.length] = i+1;
		if(this[line[0]])
			output += this[line[0]](args);
		else {
			handleError(this.errorLogSpan, line[0]+" is not defined", i+1);
		}
	};
	
	outputElement.value = output;
};

function handleError(errorLogElement, type, lineNumber){
	if(!type)
		var type = "Undefined";
	if(!lineNumber)
		var lineNumber = "undefined";
	errorLogElement.innerHTML += type+" error on line "+lineNumber+"<br>";
};