var questionIds;
var questions;
var rightAnswers;

function processQuiz() {
	var results = checkAnswers();
	var tableBody = document.createElement("quizResults");
	for (i = 0; i < results.length; i++) {
		var elementHolder = document.createElement("tr");
		var elementIndex = document.createElement("td");
		elementIndex.innerHTML = i;
		var elementC = document.createElement("td");
		elementC.innerHTML = results;
		var elementQ = document.createElement("td");
		elementQ.innerHTML = questions[i];
		var elementA = document.createElement("td");
		elementA.innerHTML = rightAnswers[i];
		
		elementHolder.appendChild(elementIndex);
		elementHolder.appendChild(elementC);
		elementHolder.appendChild(elementQ);
		elementHolder.appendChild(elementA);
	}
}

function storeQuizProcessingInfo(qIds, q, ans) {
	questionIds = qIds;
	questions = q;
	rightAnswers = ans;
}

function checkAnswers() {
	var results = []; //A true or false for whether the question was answered correctly.
	for (var i = 0; i < questionIds.length; i++) {
		var question = document.getElementById(questionIds[i]);
		var radios = question.getElementsById(questionIds[i]);
		for (j = 0; j < radios.length; j++) {
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
