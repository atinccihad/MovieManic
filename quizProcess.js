var questionIds;
var rightAnswers;

function processQuiz() {
	var results; //A true or false for whether the question was answered correctly.
	for (var i = 0; i < questionIds.length; i++) {
		var question = document.getElementById(questionIds[i]);
		var radios = question.getElementsById(questionIds[i]);
		for (int j = 0; j < radios.length; j++) {
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
