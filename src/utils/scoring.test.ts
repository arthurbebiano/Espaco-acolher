import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateAssessment, classifyPhq9, classifyGad7 } from './scoring';
import type { FrequencyValue } from '../data/instruments';

const makeAnswers = (length: number, fill: FrequencyValue = 0): FrequencyValue[] =>
  Array.from({ length }, () => fill);

test('PHQ-9 classification boundaries match clinical bands (0-27)', () => {
  assert.equal(classifyPhq9(0).classification, 'Sintomas mínimos');
  assert.equal(classifyPhq9(4).classification, 'Sintomas mínimos');
  assert.equal(classifyPhq9(5).classification, 'Sintomas leves');
  assert.equal(classifyPhq9(9).classification, 'Sintomas leves');
  assert.equal(classifyPhq9(10).classification, 'Sintomas moderados');
  assert.equal(classifyPhq9(14).classification, 'Sintomas moderados');
  assert.equal(classifyPhq9(15).classification, 'Sintomas moderadamente graves');
  assert.equal(classifyPhq9(19).classification, 'Sintomas moderadamente graves');
  assert.equal(classifyPhq9(20).classification, 'Sintomas graves');
  assert.equal(classifyPhq9(27).classification, 'Sintomas graves');
});

test('GAD-7 classification boundaries match clinical bands (0-21)', () => {
  assert.equal(classifyGad7(0).classification, 'Sintomas mínimos');
  assert.equal(classifyGad7(4).classification, 'Sintomas mínimos');
  assert.equal(classifyGad7(5).classification, 'Sintomas leves');
  assert.equal(classifyGad7(9).classification, 'Sintomas leves');
  assert.equal(classifyGad7(10).classification, 'Sintomas moderados');
  assert.equal(classifyGad7(14).classification, 'Sintomas moderados');
  assert.equal(classifyGad7(15).classification, 'Sintomas graves');
  assert.equal(classifyGad7(21).classification, 'Sintomas graves');
});

test('Mandatory PHQ-9 exact test cases: 0, 5, 10, 15, 20 and functional question excluded from sum', () => {
  const case0 = evaluateAssessment({
    phq9Answers: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    phq9Functional: 'extremamente', // must NOT alter total score
    gad7Answers: makeAnswers(7, 0),
    gad7Functional: 'nada',
  });
  assert.equal(case0.phq9.score, 0);
  assert.equal(case0.phq9.classification, 'Sintomas mínimos');
  assert.equal(case0.safetyAlert, false);

  const case5 = evaluateAssessment({
    phq9Answers: [1, 1, 1, 1, 1, 0, 0, 0, 0],
    phq9Functional: 'um_pouco',
    gad7Answers: makeAnswers(7, 0),
    gad7Functional: 'nada',
  });
  assert.equal(case5.phq9.score, 5);
  assert.equal(case5.phq9.classification, 'Sintomas leves');

  const case10 = evaluateAssessment({
    phq9Answers: [2, 2, 2, 2, 2, 0, 0, 0, 0],
    phq9Functional: 'muito',
    gad7Answers: makeAnswers(7, 0),
    gad7Functional: 'nada',
  });
  assert.equal(case10.phq9.score, 10);
  assert.equal(case10.phq9.classification, 'Sintomas moderados');
  assert.equal(case10.phq9.isAtOrAboveCutoff, true);

  const case15 = evaluateAssessment({
    phq9Answers: [3, 3, 3, 3, 3, 0, 0, 0, 0],
    phq9Functional: 'muito',
    gad7Answers: makeAnswers(7, 0),
    gad7Functional: 'nada',
  });
  assert.equal(case15.phq9.score, 15);
  assert.equal(case15.phq9.classification, 'Sintomas moderadamente graves');

  const case20 = evaluateAssessment({
    phq9Answers: [3, 3, 3, 3, 3, 3, 2, 0, 0],
    phq9Functional: 'extremamente',
    gad7Answers: makeAnswers(7, 0),
    gad7Functional: 'nada',
  });
  assert.equal(case20.phq9.score, 20);
  assert.equal(case20.phq9.classification, 'Sintomas graves');
});

test('Mandatory GAD-7 exact test cases: 0, 5, 10, 15 and functional question excluded from sum', () => {
  const gad0 = evaluateAssessment({
    phq9Answers: makeAnswers(9, 0),
    phq9Functional: 'nada',
    gad7Answers: [0, 0, 0, 0, 0, 0, 0],
    gad7Functional: 'extremamente', // must NOT alter GAD-7 score
  });
  assert.equal(gad0.gad7.score, 0);
  assert.equal(gad0.gad7.classification, 'Sintomas mínimos');

  const gad5 = evaluateAssessment({
    phq9Answers: makeAnswers(9, 0),
    phq9Functional: 'nada',
    gad7Answers: [1, 1, 1, 1, 1, 0, 0],
    gad7Functional: 'um_pouco',
  });
  assert.equal(gad5.gad7.score, 5);
  assert.equal(gad5.gad7.classification, 'Sintomas leves');

  const gad10 = evaluateAssessment({
    phq9Answers: makeAnswers(9, 0),
    phq9Functional: 'nada',
    gad7Answers: [2, 2, 2, 2, 2, 0, 0],
    gad7Functional: 'muito',
  });
  assert.equal(gad10.gad7.score, 10);
  assert.equal(gad10.gad7.classification, 'Sintomas moderados');
  assert.equal(gad10.gad7.isAtOrAboveCutoff, true);

  const gad15 = evaluateAssessment({
    phq9Answers: makeAnswers(9, 0),
    phq9Functional: 'nada',
    gad7Answers: [3, 3, 3, 3, 3, 0, 0],
    gad7Functional: 'extremamente',
  });
  assert.equal(gad15.gad7.score, 15);
  assert.equal(gad15.gad7.classification, 'Sintomas graves');
});

test('Mandatory Clinical Safety Rule: Item 9 positive with total score 2 triggers safety alert and blocks false reassurance', () => {
  const result = evaluateAssessment({
    phq9Answers: [0, 0, 0, 0, 0, 0, 0, 0, 2], // total = 2 (mínimo), item 9 = 2
    phq9Functional: 'nada',
    gad7Answers: makeAnswers(7, 0),
    gad7Functional: 'nada',
  });

  assert.equal(result.phq9.score, 2);
  assert.equal(result.phq9.classification, 'Sintomas mínimos');
  assert.equal(result.safetyAlert, true);
  assert.equal(result.item9Value, 2);
  assert.equal(result.nextSteps.tier, 'safety_priority');
  assert.match(result.phq9.plainExplanation, /não deve ser interpretada como suficiente/i);
  assert.match(result.phq9.shortImageSummary, /item 9 requer conversa direta sobre segurança/i);
  assert.match(result.nextSteps.supportingActions.join(' '), /192/);
  assert.match(result.nextSteps.supportingActions.join(' '), /188/);
});

test('Joint interpretation distinguishes elevated PHQ-9, elevated GAD-7, and both elevated without summing scores', () => {
  const phqOnly = evaluateAssessment({
    phq9Answers: [2, 2, 2, 2, 2, 0, 0, 0, 0],
    phq9Functional: 'um_pouco',
    gad7Answers: [1, 0, 0, 0, 0, 0, 0],
    gad7Functional: 'nada',
  });
  assert.equal(phqOnly.joint.pattern, 'phq9_elevated_gad7_low');

  const gadOnly = evaluateAssessment({
    phq9Answers: [1, 0, 0, 0, 0, 0, 0, 0, 0],
    phq9Functional: 'nada',
    gad7Answers: [2, 2, 2, 2, 2, 0, 0],
    gad7Functional: 'um_pouco',
  });
  assert.equal(gadOnly.joint.pattern, 'gad7_elevated_phq9_low');

  const both = evaluateAssessment({
    phq9Answers: [2, 2, 2, 2, 2, 0, 0, 0, 0],
    phq9Functional: 'muito',
    gad7Answers: [2, 2, 2, 2, 2, 0, 0],
    gad7Functional: 'muito',
  });
  assert.equal(both.joint.pattern, 'both_elevated');
});
