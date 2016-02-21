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
	var questionIds = [];
	var correctAnswers = [];
	
	//Does not check for unique products yet
	for (var i = 0; i < 5; i++) {
		var answerProduct = productDataArray[Math.floor(Math.random() * productDataArray.length)];
		questionIds[i] = "Question " + i;
		correctAnswers[i] = answerProduct.Name;
		generateQuestion(answerProduct);
	}
	
	storeQuizProcessingInfo(questionIds,correctAnswers)
}

function generateQuestion(answerProduct) {
	var answers = [];
	var questionText = answerProduct.ShortDescription;
	var correctAnswer = answerProduct.Name;
	
	var i;
	for(i = 0; i < 3; i++) {
		answers.push(productDataArray[Math.floor(Math.random() * productDataArray.length)].Name);
	}
	answers.push(correctAnswer);
	shuffle(answers);
	createQuizQuestion("Question 1","Which movie?",questionText,answers,correctAnswer);
}

function createQuizQuestion(questionId,questionName,questionText,answers,correctAnswer,questionHolder = "quizForm") {
	var question = document.createElement("div");
	question.id = questionId;
	question.innerHTML = questionName + " " + questionText;
	for (i = 0; i < answers.length; i++) {
		var elementDiv = document.createElement("div");
		elementDiv.className = "radio";
		var elementHolder = document.createElement("label");
		var element = document.createElement("input");
		//element.className = "form-control";
		//alert(answers[i] + "  " + element.innerHTML);
		elementHolder.innerHTML = "<input type='radio' name='" + questionId + "' value='" + answers[i] + "'>" + answers[i];
		elementDiv.appendChild(elementHolder);
		question.appendChild(elementDiv);
	}
	document.getElementById(questionHolder).appendChild(question);
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

// Quiz process----------------------------------------------------------
var questionIds;
var rightAnswers;

function processQuiz() {
	var results = []; //A true or false for whether the question was answered correctly.
	for (var i = 0; i < questionIds.length; i++) {
		var question = document.getElementById(questionIds[i]);
		var radios = question.getElementsById(questionIds[i]);
		for (var j = 0; j < radios.length; j++) {
			if (radios[j].checked) {
				answer = radios[j].value;
				if (rightAnswers[i] == answer) {
					results[i] = true;
				} else results[i] = false;
			}
		}
	}
	return results;
}

function storeQuizProcessingInfo(questions, ans) {
	questionNames = questions;
	rightAnswers = ans;
}
