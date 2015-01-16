function Disassembler (){
	
	this.vars = [];
	this.vars["MEMORY"] = 0;
	this.vars["CURRENT"] = 0;
	
	this.errorLogSpan = false;
	this.errored = false;
	this.suffixes = ["st", "nd", "rd", "th"];
	
	var _this = this
	
	this.HARD = function (args){
		return args[0];
	};
	
	this.INCC = function (){
		return "+";
	};
	
	this.INCM = function (args){
		var out = "";
		if(!_this.isNumber(args[0])){
			_this.handleError("INCM: Argument not a number", args[args.length-1]);
			return "";
		}
		var n = parseInt(args[0]);
		for(var i = 0; i < n; i++){
			out += "+";
		};
		return out;
	};
	
	this.DECC = function (){
		return "-";
	};
	
	this.DECM = function (){
		var out = "";
		if(!_this.isNumber(args[0])){
			_this.handleError("INCM: Argument not a number", args[args.length-1]);
			return "";
		}
		var n = parseInt(args[0]);
		for(var i = 0; i < n; i++){
			out += "-";
		};
		return out;
	};
	
	this.ECHC = function (){
		return ".";
	};
	
	this.ECHO = function (args){
		var out = "";
		if(!_this.isVariable(args[0])){
			_this.handleError("ECHO: Unknown variable "+args[0], args[args.length-1]);
			return out;
		}
		out += _this.MOVT([args[0],args[args.length-1]]);
		out += _this.ECHC();
		return out;
	};
	
	this.INPC = function (){
		return ",";
	};
	
	this.RSRV = function (args){
		if(_this.isNumber(args[0]))
			_this.vars["MEMORY"]+=parseInt(args[0]);
		else
			_this.handleError("RSRV: Argument not a number", args[args.length-1]);
		return "";
	};
	
	this.MOVE = function (args){ // int index
		if(!_this.isNumber(args[0])){
			_this.handleError("MOVE: Argument not a number", args[args.length-1]);
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
	
	this.MOVM = function (args){ // přesun do ramky - memory
		var out = _this.MOVE([_this.vars["MEMORY"], args[0]]);
		return out;
	};
	
	this.INIT = function (args){ // string variable name
		if(_this.isNumber(args[0]) || _this.isVariable(args[0])){
			_this.handleError("INIT: Invalid variable name", args[args.length-1]);
			return "";
		}
		_this.vars[args[0]] = _this.vars["MEMORY"];
		_this.RSRV([1,args[args.length-1]]);
		return "";
	};
	
	this.DELV = function (args){ // string variable name
		var line = _this.getLineNumber(args);
		var name = args[0];
		if(!_this.isVariable(name)){
			_this.handleError("DELV: Unknown variable "+name, line);
			return "";
		};
		var start = _this.vars["CURRENT"];
		var out = "";
		out += _this.CLRV(args);
		var posledni = name;
		for(var i in _this.vars){
			if(!(i == "CURRENT" || i == "MEMORY")){
				if(_this.vars[i] > _this.vars[name]){
					posledni = i;
				}
			}
		};
		if(posledni != name){
			out += _this.COPX([_this.vars[posledni], _this.vars[name], line]);
			_this.vars[posledni] = _this.vars[name];
			delete _this.vars[name];
			_this.RSRV([-1, line]);
		}
		else{
			delete _this.vars[name];
			_this.RSRV([-1, line]);
		}
		out += _this.MOVE([start, line]);
		return out;
	};
	
	this.MOVT = function (args){ // string variable name
		if(!_this.isVariable(args[0])){
			_this.handleError("MOVT: Unknown variable "+args[0], args[args.length-1]);
			return "";
		}
		var out = _this.MOVE([_this.vars[args[0]], args[args.length-1]]);
		return out;
	};
	
	this.CLRC = function (){ // Vyčistí současnou buňku
		return "[-]";
	};
	
	this.CLRV = function (args){ // string variable name
		if(!_this.isVariable(args[0])){
			_this.handleError("CLRV: Unknown variable "+args[0], args[args.length-1]);
			return "";
		}
		var out = _this.MOVT(args)+_this.CLRC();
		return out;
	};
	
	this.ADDX = function (args){ // int source index, int index1, int index2, ... - přičte hodnotu source k cílovým indexům, zmizí hodnota source, končí v source
		for(var i = 0; i < args.length-1; i++){
			if(!_this.isNumber(args[i])){
				_this.handleError("ADDX: "+(i+1)+_this.getSuffix(i)+" argument is not a number",args[args.length-1]);
				return "";
			}
		};
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
	
	this.ADDS =  function (args){ // int target index - přičte hodnotu source buňky k cílovým buňkám
		for(var i = 0; i < args.length-1; i++){
			if(!_this.isNumber(args[i])){
				_this.handleError("ADDS: "+(i+1)+_this.getSuffix(i)+" argument is not a number",args[args.length-1]);
				return "";
			}
		};
		var line = _this.getLineNumber(args);
		_this.RSRV([1, line]);
		var out = _this.ADDX([args[0], _this.vars["MEMORY"]-1, line]);
		var arguments = [];
		arguments[0] = _this.vars["MEMORY"]-1;
		arguments[1] = args[0];
		for(var i = 2; i < args.length+1;i++){
			arguments[i] = args[i-1];
		};
		out+=_this.ADDX(arguments);
		_this.RSRV([-1,line]);
		return out;
	};
	
	this.ADDV = function (args){
		var arguments = [];
		for(var i = 0; i < args.length-1; i++){
			if(!_this.isVariable(args[i])){console.log(args);
				_this.handleError("ADDV: "+(i+1)+_this.getSuffix(i)+" variable ("+args[i]+") is unknown",args[args.length-1]);
				return "";
			}
			arguments[i] = _this.vars[args[i]];
		};
		arguments[arguments.length] = args[args.length-1];
		return _this.ADDS(arguments);
	};
	
	this.SETV = function (args){ // string variable name, int value
		var line = _this.getLineNumber(args);
		if(!_this.isVariable(args[0])){
			_this.handleError("SETV: Unknown variable "+args[0], line);
			return "";
		}
		if(!_this.isNumber(args[1])){
			_this.handleError("SETV: Second argument not a number", line);
			return "";
		}console.log(args);
		var out = _this.CLRV([args[0], line]);
		for(var i = 0; i < parseInt(args[1]); i++){
			out+="+";
		};
		return out;
	};
	
	this.COPX = function (args){ // int source index, int first destination index, int second destination index, ... - maže obsah source, pointer končí v source
		var line = _this.getLineNumber(args);
		var out = "";
		for(var i = 1; i < args.length-1; i++){
			out += _this.MOVE([args[i], line]);
			out += _this.CLRC();
		};
		out += _this.ADDX(args);
		return out;
	};
	
	this.COPY = function (args){ // int source index, int first destination index, int second destination index, ...
		var line = _this.getLineNumber(args);
		var out = _this.ADDX([args[0], _this.vars["MEMORY"], line]);
		var arguments = [];
		arguments[0] = _this.vars["MEMORY"];
		arguments[1] = args[0];
		for(var i = 2; i < args.length+1;i++){
			arguments[i] = args[i-1];
		};
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
	
	this.ITRI = function (args){ // int index, funkce
		var line = _this.getLineNumber(args);
		var block = args.slice(1,args.length-1).join(" ");
		
		var position = _this.vars["CURRENT"]; // uložení pozice
		var out = _this.MOVE([args[0],line]); // přemístění na pozici, dle které se iteruje
		out += "[-"+_this.MOVE([position, line]); // dekrementace a přemístění na kontext itri 
		out += _this.compileBlock(block, line); // Vnitřní příkazy musí končit na výchozím indexu
		out += _this.MOVE([args[0], line])+"]"; // přesun k buňce, dle které iterujeme
		
		return out;
	};
	
	this.ITER = function (args){ // int numberOfTimes, block funkce, oddělené středníkem bez mezer
		var line = _this.getLineNumber(args);
		var block = args.slice(1,args.length-1).join(" ");
		
		var position = _this.vars["CURRENT"];
		var out = _this.MOVM();
		var iIndex = _this.vars["CURRENT"];
		out += _this.INCM([args[0], line]);
		_this.RSRV([1,line]);
		out += "[-"+_this.MOVE([position, line]); // dekrementace a přemístění na kontext iter
		out += _this.compileBlock(block, line); // Vnitřní příkazy musí končit na výchozím indexu
		out += _this.MOVE([iIndex, line])+"]"; // zpět na pozici, dle které se iteruje
		_this.RSRV([-1, line]);
		return out;
	};
	
	this.ITVX = function (args){
		var line = _this.getLineNumber(args);
		var out = "";
		var index = _this.vars[args[0]];
		var arguments = [];
		arguments[0] = index;
		for(var i = 1; i < args.length; i++){
			arguments[i] = args[i];
		};
		out += _this.ITRI(arguments);
		return out;
	};
	
	this.NEGC = function (args){ // Neguje booleanovskou hodnotu současné buňky
		var line = _this.getLineNumber(args);
		var index = _this.vars["CURRENT"];
		var mem = _this.vars["MEMORY"];
		_this.RSRV([1, line]);
		var out = _this.MOVE([mem,line]);
		out += "+";
		out += _this.MOVE([index, line]);
		out += "["+_this.MOVE([mem, line])+"-"+_this.MOVE([index, line])+"[-]]";
		out += _this.MOVE([mem, line]);
		out += "[[-]"+_this.MOVE([index, line])+"+"+_this.MOVE([mem, line])+"]";
		out += _this.MOVE([index, line]);
		_this.RSRV([-1, line]);
		return out;
	};
	
	this.IFCX = function (args){ // Pokud je současná buňka větší než jedna, provede kód v bloku - argumenty jsou pouze blok
		var line = _this.getLineNumber(args);
		var block = args.slice(0,args.length-1).join(" ");
		return "["+_this.compileBlock(block)+"[-]]";
	};
	
	this.IFCI = function (args){
		var line = _this.getLineNumber(args);
		var start = _this.vars["CURRENT"];
		var mem = _this.vars["MEMORY"];
		_this.RSRV([1,line]);
		var out = _this.COPY([start, mem, line]);
		out += _this.MOVE([mem, line]);
		var arguments = [];
		args[0] = "{MOVE "+start+";"+args[0].substring(1,args[0].length);
		args[args.length-2] = args[args.length-2].substring(0,args[args.length-2].length-1)+"MOVE "+mem+";}";
		out += _this.IFCX(args);
		out += _this.MOVE([start, line]);
		_this.RSRV([-1,line]);
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
		output += this.compileOrder(lines[i], i+1);
	};
	
	outputElement.value = output;
};

Disassembler.prototype.compileOrder = function (code, lineID){
	output = "";
	line = code.split(" ");
	args = line.splice(1,line.length-1);
	this.importEnvironmentVariables(args);
	args[args.length] = lineID;
	if(this[line[0]])
		output += this[line[0]](args);
	else {
		this.handleError(line[0]+" is not defined", lineID);
	}
	return output+"\n";
};

Disassembler.prototype.compileBlock = function (code, line){
	
	var subCode = code.substring(1,code.length-1); // Odstranění koncových závorek
	// Nyní detekce a přiřazení prvního bloku příkazů
	var subBegin = subCode.indexOf("{");
	var out = "";
	if(subBegin == -1){
		var orders = subCode.split(";");
		for(var i = 0; i < orders.length-1; i++){
			out += this.compileOrder(orders[i]);
		};
		return out;
	}
	var subBlocks = 0;
	var subEnd = subBegin+1;
	var i = 0;
	var commandEnd = 0;
	var nmax = 100;
	var n = 0;
	while(i < subCode.length){
		n++;
		if(n > nmax) break;
		
		commandEnd = subCode.indexOf(";",i);
		if(i == commandEnd){
			i++;
			continue;
		}
		if(commandEnd < subBegin){
			out += this.compileOrder(subCode.substring(i,commandEnd), line);
			i = commandEnd+1;
		}
		else{
			for(var c = subBegin+1; subCode.charAt(c) != "";c++){
				subEnd = c;
				if(subCode.charAt(subEnd) == "}" && subBlocks == 0)
					break;
				if(subCode.charAt(c) == "{")
					subBlocks++;
				if(subCode.charAt(c) == "}")
					subBlocks--;
			};
			out += this.compileOrder(subCode.substring(i, subEnd+1), line);
			i=subEnd+2;
			subBegin = subCode.indexOf("{",i) == -1 ? Infinity : subCode.indexOf("{",i);
		}
		/*
		for(var c = subEnd; subCode.charAt(c) != "";c++){
			subEnd = c;
			if(subCode.charAt(subEnd) == "}" && subBlocks == 0)
				break;
			if(subCode.charAt(c) == "{")
				subBlocks++;
			if(subCode.charAt(c) == "}")
				subBlocks--;
		};
		
		console.log(subCode.substring(subBegin, subEnd+1));
		
		subBegin=subCode.indexOf("{",subEnd);*/
	};
	return out;
	/*var subBlocks = 0;
	var subEnd = subBegin+1;
	for(var c = subEnd; subCode.charAt(c) != "";c++){
		subEnd = c;
		if(subCode.charAt(subEnd) == "}" && subBlocks == 0)
			break;
		if(subCode.charAt(c) == "{")
			subBlocks++;
		if(subCode.charAt(c) == "}")
			subBlocks--;
	};
	var subSubCode = subCode.substring(subBegin,subEnd+1);
	// Rozdělení příkazů před blokem
	var predBlokovymPrikazem = subCode.lastIndexOf(";", subBegin);
	var ordersBefore = subCode.substring(0, predBlokovymPrikazem).split(";");
	var ordersBrainfuck = "";
	for(var i = 0; i < ordersBefore.length; i++){
		ordersBrainfuck += this.compileOrder(ordersBefore[i]);
	};
	console.log(subCode.substring(predBlokovymPrikazem+1, subCode.indexOf(" ")));
	var polePrikazu = this.compileBlock(subSubCode, line);
	console.log(polePrikazu+"HEHRE");
	var ordersInMiddle = subCode.substring(predBlokovymPrikazem+1, subBegin)+polePrikazu;
	var ordersPast = subCode.substring(subEnd+2, subCode.length).split(";");
	
	return [ordersBefore,ordersInMiddle, ordersPast];*/
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

Disassembler.prototype.handleError = function (type, lineNumber){console.log("error now");
	if(!type)
		var type = "Undefined";
	if(!lineNumber)
		var lineNumber = "undefined";
	this.errorLogSpan.innerHTML += type+" error on line "+lineNumber+"<br>";
};

Disassembler.prototype.isNumber = function (arg){
	if(parseInt(arg) || parseInt(arg) == 0){
		return true;
	}
	else {
		return false;
	}
};

Disassembler.prototype.isVariable = function (arg){
	if(this.vars[arg] == undefined){
		return false;
	}
	else{
		return true;
	}
};

Disassembler.prototype.getSuffix = function (num){
	if(num < 3){
		return this.suffixes[num];
	}
	else{
		return this.suffixes[3];
	}
};

Disassembler.prototype.getLineNumber = function (args){
	return args[args.length - 1];
};