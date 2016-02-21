var questionIds;
var questions;
var rightAnswers;
var answerIds;

function processQuiz() {
	var results = checkAnswers();
	if (results == null) {
		return;
	}
	var tableBody = document.getElementById("quizResults");
	for (i = 0; i < results.length; i++) {
		var elementHolder = document.createElement("tr");
		var elementIndex = document.createElement("td");
		elementIndex.innerHTML = i + 1;
		var elementC = document.createElement("td");
		elementC.innerHTML = results[i];
		var elementA = document.createElement("td");
		elementA.innerHTML = rightAnswers[i];
		var relatedHolder = document.createElement("td");
		var related = document.createElement("input")
		related.type = "button";
		related.className = "btn btn-neutral btn-default";
		$(related).on('click', showRelatedMedia(answerIds[i]));
		related.onclick = showRelatedMedia;
		relatedHolder.appendChild(related);
		var elementLink = document.createElement("td");
		elementLink.innerHTML = "http://content.sls1.cdops.net/storefront/HTML/Flex/5.6.1_CSGHackIllinois/product.html?productId=" + answerIds[i];
		
		elementHolder.appendChild(elementIndex);
		elementHolder.appendChild(elementC);
		elementHolder.appendChild(elementA);
		elementHolder.appendChild(relatedHolder);
		elementHolder.appendChild(elementLink);
		tableBody.appendChild(elementHolder);
	}
	document.getElementById("quizResultHolder").style.display = "block";
	resetElement = document.createElement("input");
	resetElement.onclick = resetQuiz;
	resetElement.className = "btn btn-info";
	resetElement.value = "Take another quiz";
	document.getElementById("quizResultHolder").appendChild(resetElement);
}

function resetQuiz() {
	questionIds = [];
	questions = [];
	rightAnswers = [];
	document.getElementById("quizCreation").innerHTML = getPreviousCategoryHTML();
	document.getElementById("quizResultHolder").style.display = "none";
	var blankQuizHTML = "<form class='form-group' method='post' id='quizForm' action='javascript:processQuiz()'></form>"
	document.getElementById("quiz").innerHTML = blankQuizHTML;
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
