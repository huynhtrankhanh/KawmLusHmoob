import { lessons } from './lessons.js';

export function normalizeAnswer(value) {
  return value.trim().toLowerCase();
}

export function isAnswerCorrect(input, expected) {
  return normalizeAnswer(input) === normalizeAnswer(expected);
}

let currentLessonIndex = 0;

export function renderLesson(index, elements) {
  const lesson = lessons[index];
  const { lessonTitle, lessonLevel, lessonGrammar, vocabList, questionText, answerInput, quizFeedback } = elements;
  lessonTitle.textContent = lesson.title;
  lessonLevel.textContent = lesson.level;
  lessonGrammar.textContent = lesson.grammar;
  vocabList.innerHTML = '';

  lesson.vocabulary.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.hmong} — ${item.english}`;
    vocabList.append(li);
  });

  questionText.textContent = lesson.quiz.prompt;
  answerInput.value = '';
  quizFeedback.textContent = '';
  quizFeedback.className = '';
}

if (typeof document !== 'undefined') {
  const elements = {
    lessonTitle: document.getElementById('lesson-title'),
    lessonLevel: document.getElementById('lesson-level'),
    lessonGrammar: document.getElementById('lesson-grammar'),
    vocabList: document.getElementById('vocab-list'),
    questionText: document.getElementById('question-text'),
    answerInput: document.getElementById('answer-input'),
    quizFeedback: document.getElementById('quiz-feedback')
  };

  document.getElementById('check-answer').addEventListener('click', () => {
    const expected = lessons[currentLessonIndex].quiz.answer;

    if (isAnswerCorrect(elements.answerInput.value, expected)) {
      elements.quizFeedback.textContent = 'Correct! Zoo heev!';
      elements.quizFeedback.className = 'correct';
    } else {
      elements.quizFeedback.textContent = `Not quite. Correct answer: ${expected}`;
      elements.quizFeedback.className = 'incorrect';
    }
  });

  document.getElementById('next-lesson').addEventListener('click', () => {
    currentLessonIndex = (currentLessonIndex + 1) % lessons.length;
    renderLesson(currentLessonIndex, elements);
  });

  document.getElementById('previous-lesson').addEventListener('click', () => {
    currentLessonIndex = (currentLessonIndex - 1 + lessons.length) % lessons.length;
    renderLesson(currentLessonIndex, elements);
  });

  renderLesson(currentLessonIndex, elements);
}
