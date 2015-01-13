function BrainfuckRenderer(output, memory){
	this.outputElement = output === undefined ? document.createElement("p") : output;
	this.memoryElement = memory === undefined ? document.createElement("tr") : memory;
	
	this.prefix = "<span style='background-color: #CC333F'>";
	this.postfix = "</span>";
	
	this.content = [];
	
	this.memory = [0];
	this.current = 0;
	
	this.lettersValue = false;
};

BrainfuckRenderer.prototype.render = function (){
	var t = "";
	for(var i =0; i < this.content.length;i++){
		t+=this.adapt(this.content[i]+" ");
	};
	this.outputElement.innerHTML = t+this.prefix+this.adapt(this.memory[this.current])+this.postfix;
};

BrainfuckRenderer.prototype.updateMemory = function (){
  var t="";
	for(var i = 0; i < this.memory.length; i++){
    if(i == this.index){
      t += "<td>"+this.prefix+this.memory[i]+this.postfix+"</td>";
    }
    else{
      t += "<td>"+this.memory[i]+"</td>";
    }
  };
  this.memoryElement.innerHTML = t;
};

BrainfuckRenderer.prototype.add = function (a){
	this.content.push(a);
};

Object.defineProperty(BrainfuckRenderer.prototype, "letters", {
	get : function (){return this.lettersValue;},
	set : function (value){this.lettersValue = value; this.render();},
});

Object.defineProperty(BrainfuckRenderer.prototype, "index", {
  get : function (){return this.current;},
  set : function (value){this.current = value; this.updateMemory(); this.render();},
});

BrainfuckRenderer.prototype.adapt = function (n){
	if(this.letters){
		return String.fromCharCode(n);
	}
	else return n;
};
BrainfuckRenderer.prototype.reset = function (){
	this.content = [];
	this.outputElement.innerHTML = "";
	this.last = 0;
};
