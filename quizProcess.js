var questionIds;
var questions;
var rightAnswers;
var answerIds;
var processed = false;
var relatedHtmlHolders;

function processQuiz() {
	if (processed)
		return;
	var results = checkAnswers();
	if (results == null) {
		return;
	}
	var tableBody = document.getElementById("quizResults");
	relatedHtmlHolders = [];
	
	for (i = 0; i < results.length; i++) {
		var elementHolder = document.createElement("tr");
		var elementIndex = document.createElement("td");
		elementIndex.innerHTML = i + 1;
		var elementC = document.createElement("td");
		elementC.innerHTML = results[i];
		var elementA = document.createElement("td");
		elementA.innerHTML = rightAnswers[i];
		var elementLinkHolder = document.createElement("td");
		var elementLink = document.createElement("a");
		elementLink.className = "btn btn-secondary";
		elementLink.innerHTML = "Purchase " + rightAnswers[i];
		elementLink.href = "http://content.sls1.cdops.net/storefront/HTML/Flex/5.6.1_CSGHackIllinois/product.html?productId=" + answerIds[i];
		elementLinkHolder.appendChild(elementLink);
		
		elementHolder.appendChild(elementIndex);
		elementHolder.appendChild(elementC);
		elementHolder.appendChild(elementA);
		elementHolder.appendChild(elementLinkHolder);
		tableBody.appendChild(elementHolder);
		
		var productInfo = showRelatedMedia(answerIds[i]);
		if (productInfo != null) {
			var title = productInfo[0];
			var description = productInfo[1];
			var image = productInfo[2];	
			var overall = document.createElement("div");
			overall.className = "container spaced-out";
			var relatedElementHolder = document.createElement("div");
			relatedElementHolder.className = "row";
			var rehInfo = document.createElement("div");
			rehInfo.className = "col-md-4";
			var rehInfo2 = document.createElement("div");
			rehInfo2.className = "col-md-4";
			var relatedElementHeader = document.createElement("h4");
			relatedElementHeader.innerHTML = title;
			var relatedElementDesc = document.createElement("div");
			relatedElementDesc.className = "container";
			relatedElementDesc.innerHTML = description;
			var imageE = document.createElement("img");
			imageE.src = image;
			imageE.width = "200";
			imageE.height = "200";
			rehInfo.appendChild(relatedElementHeader);
			rehInfo.appendChild(relatedElementDesc);
			rehInfo2.appendChild(imageE);
			relatedElementHolder.appendChild(rehInfo);
			relatedElementHolder.appendChild(rehInfo2);
			overall.appendChild(relatedElementHolder);
			document.getElementById("relatedResults").appendChild(overall);
		}
	}
	
	document.getElementById("quizResultHolder").style.display = "block";
	document.getElementById("relatedResults").style.display = "block";
	resetElement = document.createElement("input");
	resetElement.onclick = resetQuiz;
	resetElement.className = "btn btn-info";
	resetElement.value = "Take another quiz";
	document.getElementById("quizResultHolder").appendChild(resetElement);
	processed = true;
	
}

function resetQuiz() {
	questionIds = [];
	questions = [];
	rightAnswers = [];
	document.getElementById("quizCreation").innerHTML = getPreviousCategoryHTML();
	document.getElementById("relatedResults").innerHTML = "<h2>Related</h2>";
	document.getElementById("quizResultHolder").style.display = "none";
	document.getElementById("relatedResults").style.display = "none";
	var blankQuizHTML = "<form class='form-group' method='post' id='quizForm' action='javascript:processQuiz()'></form>"
	document.getElementById("quiz").innerHTML = blankQuizHTML;
	processed = false;
}

function storeQuizProcessingInfo(qIds, ans,aIds) {
	questionIds = qIds;
	rightAnswers = ans;
	answerIds = aIds;
}

function checkAnswers() {
	var isAnswered = false;
	var results = []; //A true or false for whether the question was answered correctly.
	for (var i = 0; i < questionIds.length; i++) {
		var question = document.getElementById(questionIds[i]);
		var radios = document.getElementsByName(questionIds[i]);
		for (j = 0; j < radios.length; j++) {
			if (radios[j].checked) {
				isAnswered = true;
				answer = radios[j].value;
				if (rightAnswers[i] == answer) {
					results[i] = true;
					break;
				}
			}
			results[i] = false;
		}
		if (!isAnswered) {
			return null;
		}
		isAnswered = false;
	}
	return results;
}
