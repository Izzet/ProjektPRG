function Disassembler (){
	
	this.vars = [];
	this.vars["MEMORY"] = 0;
	this.vars["CURRENT"] = 0;
	
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
	
	this.INPC = function (){
		return ",";
	};
	
	this.RSRV = function (args){
		_this.vars["MEMORY"]+=parseInt(args[0]);
		return "";
	};
	
	this.MOVE = function (args){ // int index
		if(!parseInt(args[0]) && parseInt(args[0]) != 0){
			handleError(_this.errorLogSpan, "MOVE: Argument not a number", args[args.length-1]);
			return "";
		}
		var x = parseInt(args[0]);
		var out = "";
		var pointer = _this.vars["CURRENT"];
		
		if(x-pointer > 0){
			for(var i = 0; i < x-pointer; i++){
				out += ">";
				_this.vars["CURRENT"]++;
			};
		}
		else {
			for(var i = 0; i < pointer-x; i++){
				out += "<";
				_this.vars["CURRENT"]--;
			};
		}
		return out;
	};
	
	this.MOVM = function (){ // přesun do ramky - memory
		var out = _this.MOVE([_this.vars["MEMORY"]]);
		return out;
	};
	
	this.INIT = function (args){ // string variable name
		if((parseInt(args[0]) == 0 || parseInt(args[0])) && (args[0] != "MEMORY" && args[0] != "CURRENT")){
			handleError(_this.errorLogSpan, "Invalid variable name", args[args.length-1]);
			return "";
		}
		_this.vars[args[0]] = _this.vars["MEMORY"];
		_this.RSRV([1,args[args.length-1]]);
		return "";
	};
	
	this.DELV = function (){ // bude mazat proměnné - je třeba vyřešit přemístění proměnných v poli
		
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
		var out = _this.MOVT(args[0])+_this.CLRC();
		return out;
	};
	
	this.ADDX = function (args){ // int target index - přičte hodnotu současné buňky k cílové, zmizí hodnota buňky
		var argsL = args.length;
		var out = _this.MOVE([args[0], args[argsL-1]]);
		if(args[0] == args[1]){
			return out;
		}
		else {
			out+="[-";
			for(var i = 1; i < args.length-1;i++){
				if(args[0] == args[i])
					continue;
				out+=_this.MOVE([args[i],args[argsL-1]])+"+";
			};
			out+=_this.MOVE([args[0],args[argsL-1]])+"]";
			return out;
		}
	};
	
	this.ADDS =  function (args){ // int target index - přičte hodnotu současné buňky k cílové buňce
		var line = args[args.length-1];
		_this.RSRV([1, line]);
		var out = _this.ADDX([args[0], _this.vars["MEMORY"]-1, line]);
		var arguments = [];
		arguments[0] = _this.vars["MEMORY"]-1;
		arguments[1] = args[0];
		for(var i = 2; i < args.length+1;i++){
			arguments[i] = args[i-1];
		};console.log(arguments);
		out+=_this.ADDX(arguments);
		_this.RSRV([-1,line]);
		return out;
	};
	
	this.SETV = function (args){ // string variable name, int value
		var out = _this.CLRV(args);
		for(var i = 0; i < parseInt(args[1]); i++){
			out+="+";
		};
		return out;
	};
	
	this.COPX = function (args){ // int source index, int first destination index, int second destination index, ... - maže obsah source, pointer končí v source
		var argsL = args.length;
		var out = _this.MOVE([args[0], args[argsL-1]]);
		if(args[0] == args[1]){
			return out;
		}
		else {
			out+="[-";
			for(var i = 1; i < args.length-1;i++){
				if(args[0] == args[i])
					continue;
				out+=_this.MOVE([args[i],args[argsL-1]])+"+";
			};
			out+=_this.MOVE([args[0],args[argsL-1]])+"]";
			return out;
		}
	};
	
	this.COPY = function (args){ // int source index, int first destination index, int second destination index, ...
		var out = _this.COPX([args[0], _this.vars["MEMORY"], args[args.length-1]]);
		var arguments = [];
		arguments[0] = _this.vars["MEMORY"];
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
	
	this.ITER = function (args){ // Oddělování pouze středníkem, bez mezery
		var out = "";
		var zpet = _this.vars["CURRENT"];
		out += _this.MOVM()+_this.RSRV(1);
		for(var i = 0; i < parseInt(args[0])+1; i++){
			out+="+";
		};
		out += _this.MOVE(zpet, args[args.length-1]);
		funcs = args.slice(1,args.length-2);
		funcs = funcs.join(" ").split(";");
		out+= "[";
		for(var i = 0; i < funcs.length; i++){
			out += _this.compileOrder(funcs[i]);
		};
		zpet = _this.vars["CURRENT"];
		out += _this.MOVM()+"<";
		out += "-]"+_this.RSRV(-1)+_this.MOVE(zpet);
		return out;
	};
};
Disassembler.prototype.compile = function (code, outputElement){
	
	this.vars = [];
	this.vars["MEMORY"] = 0;
	this.vars["CURRENT"] = 0;
	
	this.errorLogSpan.innerHTML = "";
	
	var lines = code.split("\n");
	
	var line = [];
	var args = [];
	var output = "";
	
	for(var i = 0; i < lines.length; i++){
		line = lines[i].split(" ");
		args = line.splice(1,line.length-1);
		this.importEnvironmentVariables(args);
		args[args.length] = i+1;
		if(this[line[0]])
			output += this[line[0]](args);
		else {
			handleError(this.errorLogSpan, line[0]+" is not defined", i+1);
		}
	};
	
	outputElement.value = output;
};

Disassembler.prototype.compileOrder = function (code){
	output = "";
	line = code.split(" ");
	args = line.splice(1,line.length-1);
	if(this[line[0]])
		output += this[line[0]](args);
	else {
		handleError(this.errorLogSpan, line[0]+" is not defined", i+1);
	}
	return output;
};

Disassembler.prototype.importEnvironmentVariables = function (args){
	for(var i = 0; i < args.length; i++){
		if(args[i] == "MEMORY"){
			args[i] = this.vars["MEMORY"];
		}
		else if(args[i] == "CURRENT"){
			args[i] = this.vars["CURRENT"];
		}
	};
};

function handleError(errorLogElement, type, lineNumber){console.log("error now");
	if(!type)
		var type = "Undefined";
	if(!lineNumber)
		var lineNumber = "undefined";
	errorLogElement.innerHTML += type+" error on line "+lineNumber+"<br>";
};