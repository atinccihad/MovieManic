function openQuizCreation() {
	if (document.getElementById("quizCreation").style.display == "none") {
		document.getElementById("quizCreation").style.display = "block";
	} else {
		document.getElementById("quizCreation").style.display = "none";
	}
}

var url = "http://metadata.sls1.cdops.net/Categories/SystemId/e5ce3167-4e0b-4867-a8c3-c8f23aec5e71/DistributionChannel/20389393-b2e4-4f65-968e-75a5227e544c/IncludeChildren/True";
var string = "Text: ";

var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

		//alert (xmlhttp.responseText);
        var myArr = JSON.parse(xmlhttp.responseText);
		string += myArr["Categories"][0]["Children"][0]["Name"];
		//alert(string);
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

function addToString(c,d) {
	string += c;
}