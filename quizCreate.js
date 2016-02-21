function startGame() {
	//queryQuestions();
			//generateQuestions();
	//return;
var xmlhttp = new XMLHttpRequest();
var url = "http://metadata.sls1.cdops.net/Categories/SystemId/e5ce3167-4e0b-4867-a8c3-c8f23aec5e71/DistributionChannel/20389393-b2e4-4f65-968e-75a5227e544c/IncludeChildren/True";

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		//alert(xmlhttp.responseText);
        var myArr = JSON.parse(xmlhttp.responseText);
		//alert(myArr["Categories"][0]["Children"][0]["Name"]);
		//alert(myArr["Categories"][0]["Children"][0]["Id"]);
        parseCategories(myArr["Categories"]);
		//console.dir(myArr);
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();
}

var categoryId;

function parseCategories(arr) {
    var out = "";
    var i;
	var elementHolder = document.createElement("div");
	elementHolder.className = "btn-group";

    for(i = 0; i < arr.length; i++) {
		console.log("Found " + arr[i].Name);
//        out += '<a href="' + arr[i].ThumbnailUrl + '">' +
//        arr[i].Name + '</a><br>';

		var element = document.createElement("input");
		element.i = i;
		element.arr = arr[i].Children;
		element.type = "button";
		element.className = "btn btn-secondary btn-default";
		element.name = arr[i];
		element.value = arr[i].Name;
		element.onclick = categoryClickListener;
		elementHolder.appendChild(element);
		document.getElementById("quizSelection").appendChild(elementHolder);
    }
    //document.getElementById("id01").innerHTML = out;
}

function categoryClickListener() {
	parseGenres(this.arr);
}

function parseGenres(arr) {
	var i;
	//console.dir(arr);
	document.getElementById("quizSelection").innerHTML = "";
	//console.dir(arr);
	for(i = 0; i < arr.length; i++) {
//        out += '<a href="' + arr[i].ThumbnailUrl + '">' +
//        arr[i].Name + '</a><br>';
		var element = document.createElement("input");
		element.type = "button";
		element.className = "btn btn-secondary btn-default";
		element.name = Number(i);
		element.value = arr[i].Name;
		element.onclick = function() {
			//parseCategories(arr[i]["Children"]);
			//alert(arr[id].Name);
			queryQuestions();
		}
		document.getElementById("quizSelection").appendChild(element);
    }
}
var productDataArray;
function queryQuestions() {
	var xmlhttp = new XMLHttpRequest();
var url = "https://services.sls1.cdops.net/Subscriber/SearchProducts";

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		//alert(xmlhttp.responseText);
        productDataArray = JSON.parse(xmlhttp.responseText).Products;
		//console.dir(productDataArray);
		generateQuestions();
        //myFunction(myArr["Categories"]);
    }
};
xmlhttp.open("GET", url, true);

xmlhttp.setRequestHeader("CD-DistributionChannel", "20389393-b2e4-4f65-968e-75a5227e544c");
xmlhttp.setRequestHeader("CD-SystemId", "e5ce3167-4e0b-4867-a8c3-c8f23aec5e71");


xmlhttp.send("{\"Categories\":[3338],\"SearchString\",:\""+Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1)+"\"");
}

function generateQuestions() {
	var answers = [];
	var answerProduct = productDataArray[Math.floor(Math.random() * productDataArray.length)];
	var questionText = answerProduct.ShortDescription;
	var correctAnswer = answerProduct.Name;
	
	var i;
	for(i = 0; i < 3; i++) {
		answers.push(productDataArray[Math.floor(Math.random() * productDataArray.length)].Name);
	}
	answers.push(correctAnswer);
	shuffle(answers);
	
	createQuizQuestion("Which movie?",questionText,answers,correctAnswer);
}

function shuffle(o) {
  var j, x, i;
  for (i = o.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = o[i-1];
    o[i-1] = o[j];
    o[j] = x;
  }

  return o;
}