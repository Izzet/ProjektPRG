function choseCharOnIndex ( i ){
	this.selectionStart = i;
	this.selectionEnd = i+1;
}

function insertString(string, inString, start, end){
	var start = start === undefined ? string.length-1 : start;
	var end = end === undefined ? string.length-1 : end;
	
	string = string.slice(0,start)+inString+string.slice(end, string.length-1-end);
	return string;
}