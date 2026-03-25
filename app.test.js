import test from 'node:test';
import assert from 'node:assert/strict';

import { isAnswerCorrect, normalizeAnswer, renderLesson } from './app.js';
import { lessons } from './lessons.js';

test('normalizeAnswer trims and lowercases values', () => {
  assert.equal(normalizeAnswer('  NyOb ZoO  '), 'nyob zoo');
});

test('isAnswerCorrect handles casing and extra spaces', () => {
  assert.equal(isAnswerCorrect('  hnub no ', 'Hnub no'), true);
});

test('lesson data keeps content and quiz separated from app logic', () => {
  assert.ok(lessons.length >= 3);
  assert.ok(lessons.every((lesson) => lesson.vocabulary.length > 0));
  assert.ok(lessons.every((lesson) => typeof lesson.quiz.answer === 'string'));
});

test('renderLesson updates provided elements and clears quiz state', () => {
  const makeList = () => {
    const items = [];
    return {
      items,
      innerHTML: 'already-set',
      append(node) {
        this.items.push(node);
      }
    };
  };

  const elements = {
    lessonTitle: { textContent: '' },
    lessonLevel: { textContent: '' },
    lessonGrammar: { textContent: '' },
    vocabList: makeList(),
    questionText: { textContent: '' },
    answerInput: { value: 'previous input' },
    quizFeedback: { textContent: 'old feedback', className: 'incorrect' }
  };

  global.document = {
    createElement() {
      return { textContent: '' };
    }
  };

  renderLesson(0, elements);

  assert.equal(elements.lessonTitle.textContent, lessons[0].title);
  assert.equal(elements.lessonLevel.textContent, lessons[0].level);
  assert.equal(elements.lessonGrammar.textContent, lessons[0].grammar);
  assert.equal(elements.questionText.textContent, lessons[0].quiz.prompt);
  assert.equal(elements.answerInput.value, '');
  assert.equal(elements.quizFeedback.textContent, '');
  assert.equal(elements.quizFeedback.className, '');
  assert.equal(elements.vocabList.innerHTML, '');
  assert.equal(elements.vocabList.items.length, lessons[0].vocabulary.length);
  assert.match(elements.vocabList.items[0].textContent, /Nyob zoo/);

  delete global.document;
});
