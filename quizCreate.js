var previousCategoryHTML;

function getPreviousCategoryHTML() {
	return previousCategoryHTML;
}

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
			previousCategoryHTML = document.getElementById("quizCreation").innerHTML;
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
	
	document.getElementById("quizCreation").innerHTML = "";
	elementHolder.className = "btn-group";

    for(i = 0; i < arr.length; i++) {
//        out += '<a href="' + arr[i].ThumbnailUrl + '">' +
//        arr[i].Name + '</a><br>';

		var element = document.createElement("input");
		element.categoryId = arr[i].Id;
		element.arr = arr[i].Children;
		element.type = "button";
		element.className = "btn btn-secondary btn-default";
		element.name = arr[i].Name;
		element.value = arr[i].Name;
		element.onclick = categoryClickListener;
		elementHolder.appendChild(element);
		document.getElementById("quizCreation").appendChild(elementHolder);
    }
	makeBackButton(previousCategoryHTML);
    //document.getElementById("id01").innerHTML = out;
}

function categoryClickListener() {
	categoryId = this.categoryId;
	parseGenres(this.arr);
}

var genreId;

function makeBackButton(prevHTML) {
	var backElement = document.createElement("input");
	backElement.id = "selectionBackButton";
	backElement.className = "btn btn-secondary btn-default";
	backElement.value = "Back";
	backElement.type = "button";
	backElement.onclick = goBackInSelection;
	backElement.name = prevHTML;
	document.getElementById("quizCreation").appendChild(backElement);
	//alert(prevPrevHTML);
}

function goBackInSelection() {
	document.getElementById("quizCreation").innerHTML = previousCategoryHTML;
}

function parseGenres(arr) {
	var i;
	document.getElementById("quizCreation").innerHTML = "";
	for(i = 0; i < arr.length; i++) {
//        out += '<a href="' + arr[i].ThumbnailUrl + '">' +
//        arr[i].Name + '</a><br>';
		var element = document.createElement("input");
		element.genreId = arr[i].Id;
		element.type = "button";
		element.className = "btn btn-secondary btn-default";
		element.name = arr[i].Name;
		element.value = arr[i].Name;
		element.onclick = genreClickListener;
		document.getElementById("quizCreation").appendChild(element);
    }
	//alert(evenMorePreviousCategoryHTML);
	makeBackButton(previousCategoryHTML);
}

function genreClickListener() {
	genreId = this.genreId;
	queryQuestions();
}

var productDataArray;
function queryQuestions() {
	var xmlhttp = new XMLHttpRequest();
var url = "https://services.sls1.cdops.net/Subscriber/SearchProducts";

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        productDataArray = JSON.parse(xmlhttp.responseText).Products;
		generateQuestions();
    }
};
xmlhttp.open("POST", url, true);

xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
xmlhttp.setRequestHeader("CD-DistributionChannel", "20389393-b2e4-4f65-968e-75a5227e544c");
xmlhttp.setRequestHeader("CD-SystemId", "e5ce3167-4e0b-4867-a8c3-c8f23aec5e71")
xmlhttp.send("{\"Categories\": ["+genreId+"]}");
}
function generateQuestions() {	
	var questionIds = [];
	var correctAnswers = [];
	
	//Does not check for unique products yet
	for (var i = 0; i < 5; i++) {
		var answerProduct = findProduct();
		questionIds[i] = "Question " + i;
		correctAnswers[i] = answerProduct.Name;
		generateQuestion(questionIds[i],answerProduct);
	}
	var submitButtonHolder = document.createElement("div");
	submitButtonHolder.className = "form-group";
	submitButtonHolder.innerHTML = "<input class='btn btn-info' type='button' onclick='processQuiz()' value='Submit Quiz'>";
	document.getElementById("quizForm").appendChild(submitButtonHolder);
	
	storeQuizProcessingInfo(questionIds,correctAnswers)
}

function generateQuestion(questionId,answerProduct) {
	var answers = [];
	var questionText = answerProduct.ShortDescription;
	var correctAnswer = answerProduct.Name;
	
	var regex = new RegExp( '(' + correctAnswer + ')', 'gi' );
	questionText = questionText.replace(regex, "[title]");
	
	var i;
	for(i = 0; i < 3; i++) {
		answers.push(findProduct(answers).Name);
	}
	answers.push(correctAnswer);
	shuffle(answers);
	createQuizQuestion(questionId,"What movie?\n",questionText,answers,correctAnswer);
}

// probably unnecessary function
function findProduct(previous=[]) {
		var product = productDataArray[Math.floor(Math.random() * productDataArray.length)];
		var productDetail = retrieveProduct(product.Id);
		var count = 10;
		// filter out non movies products
		while(count > 0 && (previous.includes(product.Name) || product.Name.toLowerCase().includes("bundle") || product.Name.toLowerCase().includes("collection"))) {
			// TODO: not recurse forever
			product = productDataArray[Math.floor(Math.random() * productDataArray.length)];
			count--;
		}
	return product;
}

function retrieveProduct(id) {
	var xmlhttp = new XMLHttpRequest();
	var url = "http://metadata.sls1.cdops.net/Product/SystemId/e5ce3167-4e0b-4867-a8c3-c8f23aec5e71/DistributionChannel/20389393-b2e4-4f65-968e-75a5227e544c/Id/"+id;
	var myArr;
	xmlhttp.onreadystatechange = function() {
  	  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			//alert(xmlhttp.responseText);
      	  	myArr = JSON.parse(xmlhttp.responseText);
			//console.dir(myArr["Product"]);
      	  //parseCategories(myArr["Categories"]);
    	}
	};
	xmlhttp.open("GET", url, false);
	xmlhttp.send();

	return myArr;
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

function openQuiz() {
	if (document.getElementById("quiz").style.display == "none") {
		document.getElementById("quiz").style.display = "block";
	}
}

