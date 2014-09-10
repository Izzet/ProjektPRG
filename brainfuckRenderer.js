function BrainfuckRenderer(el){
	this.element = el === undefined ? document.createElement("p") : el;
	
	this.prefix = "<span style='background-color: red'>";
	this.postfix = "</span>";
	
	this.lastValue = "";
	this.content = [];
	
	this.lettersValue = false;
};

BrainfuckRenderer.prototype.render = function (){
	var t = "";
	for(var i =0; i < this.content.length;i++){
		t+=this.adapt(this.content[i]);
	};
	this.element.innerHTML = t+this.prefix+this.adapt(this.last)+this.postfix;
};

BrainfuckRenderer.prototype.add = function (a){
	this.content.push(a);
};

Object.defineProperty(BrainfuckRenderer.prototype, "last", {
	get : function (){return this.lastValue;},
	set : function (value){this.lastValue = value; this.render();},
});

Object.defineProperty(BrainfuckRenderer.prototype, "letters", {
	get : function (){return this.lettersValue;},
	set : function (value){this.lettersValue = value; this.render();},
});

BrainfuckRenderer.prototype.adapt = function (n){
	if(this.letters){
		return String.fromCharCode(n);
	}
	else return n;
};