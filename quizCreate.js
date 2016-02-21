var previousCategoryHTML;
// reduce bandwidth
var basicLoad = true;

function toggleBasicLoad() {
	var tempVal = document.getElementById("loadTimeOption").name;
	document.getElementById("loadTimeOption").name = document.getElementById("loadTimeOption").value;
	document.getElementById("loadTimeOption").value = tempVal;
	basicLoad = !basicLoad;
}

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
		if(arr[i].Name == "Movie Bundles") {
			continue;
		}
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
	console.log("Done loading");
	storeQuizProcessingInfo(questionIds,correctAnswers)
}

function generateQuestion(questionId,answerProduct) {
	var answers = [];
	var question = getQuestionText(answerProduct);
	var questionText = question[1];
	
	var correctAnswer = answerProduct.Name;
	
	var regex = new RegExp( '(' + correctAnswer + ')', 'gi' );
	questionText = questionText.replace(regex, "[title]");
	answers.push(correctAnswer);
	var i;
	for(i = 0; i < 3; i++) {
		answers.push(findProduct(answers).Name);
	}
	
	shuffle(answers);
	createQuizQuestion(questionId,question[0],questionText,answers,correctAnswer);
}

function getQuestionText(product) {
	var retval = ["Which movie matches this description?", null];
	var typeIndex = Math.floor(Math.random() * 6);
	if(typeIndex == 0) {
		retval[1] = product.Description;
	} else if(typeIndex == 1 || basicLoad) {
		retval[1] = product.ShortDescription;
	} else if(typeIndex == 2) {
		retval[1] = product.SnippetDescription;
	} else if(typeIndex == 3) {
		retval[0] = "Which movie matches this tagline?";
		retval[1] = product.Tagline;
	} else if(typeIndex == 4 && product.ReleaseDate) {
		retval[0] = "Which movie was released on this date?";
		retval[1] = product.ReleaseDate.substring(5, 7) + "/" + product.ReleaseDate.substring(8, 10) + "/" + product.ReleaseDate.substring(0, 4);
	} else if(typeIndex == 5 && product.People) {
		retval[0] = "Which movie featured the following people?";
		var people = "";
		var i;
		for(i = 0; i < product.People.length; i++) {
			people += product.People[i].DisplayName;
			if(i < product.People.length - 1) people += ", ";
		}
		retval[1] = people;
	}
	if(!retval[1]) {
		return getQuestionText(product);
	}
	return retval;
}

// probably unnecessary function
function findProduct(previous=[]) {
		var product = productDataArray[Math.floor(Math.random() * productDataArray.length)];
		
		var count = 10;
		// filter out non movies products
		while(count > 0 && (previous.indexOf(product.Name) >= 0 || product.Name.toLowerCase().indexOf("bundle") >= 0 || product.Name.toLowerCase().indexOf("collection") >= 0)) {
			// TODO: not recurse forever
			product = productDataArray[Math.floor(Math.random() * productDataArray.length)];
			count--;
		}
		if(count == 0) console.log("Timed out retrieving valid product!");
		if(basicLoad) return product;
		var productDetail = retrieveProduct(product.Id);
	return productDetail;
}

function retrieveProduct(id) {
	var xmlhttp = new XMLHttpRequest();
	var url = "http://metadata.sls1.cdops.net/Product/SystemId/e5ce3167-4e0b-4867-a8c3-c8f23aec5e71/DistributionChannel/20389393-b2e4-4f65-968e-75a5227e544c/Id/"+id;
	var myArr;
	xmlhttp.onreadystatechange = function() {
  	  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			//alert(xmlhttp.responseText);
      	  	myArr = JSON.parse(xmlhttp.responseText).Product;
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
		elementDiv.className = "form-control radio";
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

