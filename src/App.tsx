import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { InstructionsScreen } from './components/InstructionsScreen';
import { QuestionnaireStep } from './components/QuestionnaireStep';
import { ResultsScreen } from './components/ResultsScreen';
import { ReviewScreen } from './components/ReviewScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import {
  GAD7_ITEMS,
  GAD7_META,
  PHQ9_ITEMS,
  PHQ9_META,
  type FrequencyValue,
  type FunctionalImpactValue,
} from './data/instruments';
import { evaluateAssessment } from './utils/scoring';

type AppStage =
  | 'welcome'
  | 'instructions'
  | 'questionnaire'
  | 'review'
  | 'results';

interface SessionDraft {
  stage: AppStage;
  questionStep: number;
  phq9Answers: (FrequencyValue | null)[];
  phq9Functional: FunctionalImpactValue | null;
  gad7Answers: (FrequencyValue | null)[];
  gad7Functional: FunctionalImpactValue | null;
}

const SESSION_KEY = 'espaco_acolher_temp_session';
const TOTAL_QUESTION_STEPS = 18; // 9 PHQ-9 + 1 PHQ-9 func + 7 GAD-7 + 1 GAD-7 func

function createEmptyDraft(): SessionDraft {
  return {
    stage: 'welcome',
    questionStep: 0,
    phq9Answers: Array<FrequencyValue | null>(9).fill(null),
    phq9Functional: null,
    gad7Answers: Array<FrequencyValue | null>(7).fill(null),
    gad7Functional: null,
  };
}

function loadInitialDraft(): SessionDraft {
  if (typeof window === 'undefined') {
    return createEmptyDraft();
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get('autostart') === '1') {
    return {
      ...createEmptyDraft(),
      stage: 'questionnaire',
      questionStep: 0,
    };
  }

  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return createEmptyDraft();
    const parsed = JSON.parse(raw) as Partial<SessionDraft>;
    if (
      Array.isArray(parsed.phq9Answers) &&
      parsed.phq9Answers.length === 9 &&
      Array.isArray(parsed.gad7Answers) &&
      parsed.gad7Answers.length === 7
    ) {
      return {
        stage: parsed.stage ?? 'welcome',
        questionStep:
          typeof parsed.questionStep === 'number' ? parsed.questionStep : 0,
        phq9Answers: parsed.phq9Answers,
        phq9Functional: parsed.phq9Functional ?? null,
        gad7Answers: parsed.gad7Answers,
        gad7Functional: parsed.gad7Functional ?? null,
      };
    }
  } catch {
    // Ignore storage read errors and start fresh
  }
  return createEmptyDraft();
}

export default function App() {
  const [draft, setDraft] = useState<SessionDraft>(loadInitialDraft);

  // Temporary tab-scoped persistence only; never stored in localStorage
  useEffect(() => {
    try {
      const hasAnyProgress =
        draft.stage !== 'welcome' ||
        draft.phq9Answers.some((v) => v !== null) ||
        draft.gad7Answers.some((v) => v !== null);
      if (hasAnyProgress) {
        window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(draft));
      } else {
        window.sessionStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, [draft]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [draft.stage, draft.questionStep]);

  const handleReset = () => {
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignore storage errors
    }
    setDraft(createEmptyDraft());
  };

  const isComplete =
    draft.phq9Answers.every((v): v is FrequencyValue => v !== null) &&
    draft.phq9Functional !== null &&
    draft.gad7Answers.every((v): v is FrequencyValue => v !== null) &&
    draft.gad7Functional !== null;

  const evaluation = useMemo(() => {
    if (!isComplete) return null;
    return evaluateAssessment({
      phq9Answers: draft.phq9Answers as FrequencyValue[],
      phq9Functional: draft.phq9Functional as FunctionalImpactValue,
      gad7Answers: draft.gad7Answers as FrequencyValue[],
      gad7Functional: draft.gad7Functional as FunctionalImpactValue,
    });
  }, [
    isComplete,
    draft.phq9Answers,
    draft.phq9Functional,
    draft.gad7Answers,
    draft.gad7Functional,
  ]);

  const stageLabel = useMemo(() => {
    switch (draft.stage) {
      case 'welcome':
        return 'Boas-vindas';
      case 'instructions':
        return 'Orientações';
      case 'questionnaire': {
        if (draft.questionStep < 9) {
          return `PHQ-9 · ${draft.questionStep + 1} de 9`;
        }
        if (draft.questionStep === 9) {
          return 'PHQ-9 · Impacto';
        }
        if (draft.questionStep < 17) {
          return `GAD-7 · ${draft.questionStep - 9} de 7`;
        }
        return 'GAD-7 · Impacto';
      }
      case 'review':
        return 'Revisão';
      case 'results':
        return 'Devolutiva';
    }
  }, [draft.stage, draft.questionStep]);

  const canReset =
    draft.stage !== 'welcome' ||
    draft.phq9Answers.some((v) => v !== null) ||
    draft.gad7Answers.some((v) => v !== null);

  const renderQuestionnaire = () => {
    const step = draft.questionStep;

    // 0..8 -> PHQ-9 Items 1..9
    if (step < 9) {
      const item = PHQ9_ITEMS[step];
      return (
        <QuestionnaireStep
          key={`phq9-${step}`}
          instrumentLabel={PHQ9_META.name}
          instrumentTitle={PHQ9_META.title}
          instrumentSubtitle={PHQ9_META.subtitle}
          introPrompt={PHQ9_META.introQuestion}
          questionNumber={item.number}
          totalQuestionsInInstrument={9}
          overallStep={step + 1}
          overallTotalSteps={TOTAL_QUESTION_STEPS}
          questionText={item.text}
          selectedFrequency={draft.phq9Answers[step]}
          selectedFunctional={null}
          onSelectFrequency={(val) =>
            setDraft((prev) => {
              const nextAnswers = [...prev.phq9Answers];
              nextAnswers[step] = val;
              return { ...prev, phq9Answers: nextAnswers };
            })
          }
          onSelectFunctional={() => {}}
          onBack={() => {
            if (step === 0) {
              setDraft((prev) => ({ ...prev, stage: 'instructions' }));
            } else {
              setDraft((prev) => ({ ...prev, questionStep: step - 1 }));
            }
          }}
          onNext={() =>
            setDraft((prev) => ({ ...prev, questionStep: step + 1 }))
          }
        />
      );
    }

    // 9 -> PHQ-9 Functional Impact
    if (step === 9) {
      return (
        <QuestionnaireStep
          key="phq9-functional"
          instrumentLabel={PHQ9_META.name}
          instrumentTitle={PHQ9_META.title}
          instrumentSubtitle={PHQ9_META.subtitle}
          introPrompt=""
          questionNumber={10}
          totalQuestionsInInstrument={9}
          overallStep={10}
          overallTotalSteps={TOTAL_QUESTION_STEPS}
          questionText={PHQ9_META.functionalQuestion}
          isFunctionalQuestion
          selectedFrequency={null}
          selectedFunctional={draft.phq9Functional}
          onSelectFrequency={() => {}}
          onSelectFunctional={(val) =>
            setDraft((prev) => ({ ...prev, phq9Functional: val }))
          }
          onBack={() => setDraft((prev) => ({ ...prev, questionStep: 8 }))}
          onNext={() => setDraft((prev) => ({ ...prev, questionStep: 10 }))}
          nextLabel="Continuar para o GAD-7"
        />
      );
    }

    // 10..16 -> GAD-7 Items 1..7
    if (step < 17) {
      const gadIdx = step - 10;
      const item = GAD7_ITEMS[gadIdx];
      return (
        <QuestionnaireStep
          key={`gad7-${gadIdx}`}
          instrumentLabel={GAD7_META.name}
          instrumentTitle={GAD7_META.title}
          instrumentSubtitle={GAD7_META.subtitle}
          introPrompt={GAD7_META.introQuestion}
          questionNumber={item.number}
          totalQuestionsInInstrument={7}
          overallStep={step + 1}
          overallTotalSteps={TOTAL_QUESTION_STEPS}
          questionText={item.text}
          selectedFrequency={draft.gad7Answers[gadIdx]}
          selectedFunctional={null}
          onSelectFrequency={(val) =>
            setDraft((prev) => {
              const nextAnswers = [...prev.gad7Answers];
              nextAnswers[gadIdx] = val;
              return { ...prev, gad7Answers: nextAnswers };
            })
          }
          onSelectFunctional={() => {}}
          onBack={() =>
            setDraft((prev) => ({ ...prev, questionStep: step - 1 }))
          }
          onNext={() =>
            setDraft((prev) => ({ ...prev, questionStep: step + 1 }))
          }
        />
      );
    }

    // 17 -> GAD-7 Functional Impact
    return (
      <QuestionnaireStep
        key="gad7-functional"
        instrumentLabel={GAD7_META.name}
        instrumentTitle={GAD7_META.title}
        instrumentSubtitle={GAD7_META.subtitle}
        introPrompt=""
        questionNumber={8}
        totalQuestionsInInstrument={7}
        overallStep={18}
        overallTotalSteps={TOTAL_QUESTION_STEPS}
        questionText={GAD7_META.functionalQuestion}
        isFunctionalQuestion
        selectedFrequency={null}
        selectedFunctional={draft.gad7Functional}
        onSelectFrequency={() => {}}
        onSelectFunctional={(val) =>
          setDraft((prev) => ({ ...prev, gad7Functional: val }))
        }
        onBack={() => setDraft((prev) => ({ ...prev, questionStep: 16 }))}
        onNext={() => setDraft((prev) => ({ ...prev, stage: 'review' }))}
        nextLabel="Revisar respostas"
      />
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#393833]">
        <Header
          stageLabel={stageLabel}
          canReset={canReset}
          onReset={handleReset}
          onGoHome={() => setDraft((prev) => ({ ...prev, stage: 'welcome' }))}
        />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={
                draft.stage === 'questionnaire'
                  ? `q-${draft.questionStep}`
                  : draft.stage
              }
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              {draft.stage === 'welcome' && (
                <WelcomeScreen
                  onStart={() =>
                    setDraft((prev) => ({ ...prev, stage: 'instructions' }))
                  }
                />
              )}

              {draft.stage === 'instructions' && (
                <InstructionsScreen
                  onBack={() =>
                    setDraft((prev) => ({ ...prev, stage: 'welcome' }))
                  }
                  onContinue={() =>
                    setDraft((prev) => ({
                      ...prev,
                      stage: 'questionnaire',
                      questionStep: 0,
                    }))
                  }
                />
              )}

              {draft.stage === 'questionnaire' && renderQuestionnaire()}

              {draft.stage === 'review' && (
                <ReviewScreen
                  phq9Answers={draft.phq9Answers}
                  phq9Functional={draft.phq9Functional}
                  gad7Answers={draft.gad7Answers}
                  gad7Functional={draft.gad7Functional}
                  onEditStep={(stepIdx) =>
                    setDraft((prev) => ({
                      ...prev,
                      stage: 'questionnaire',
                      questionStep: stepIdx,
                    }))
                  }
                  onBack={() =>
                    setDraft((prev) => ({
                      ...prev,
                      stage: 'questionnaire',
                      questionStep: 17,
                    }))
                  }
                  onSubmit={() => {
                    if (isComplete) {
                      setDraft((prev) => ({ ...prev, stage: 'results' }));
                    }
                  }}
                />
              )}

              {draft.stage === 'results' && evaluation && (
                <ResultsScreen
                  evaluation={evaluation}
                  onRestart={handleReset}
                  onEditAnswers={() =>
                    setDraft((prev) => ({ ...prev, stage: 'review' }))
                  }
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="border-t border-[#E6E1D6] bg-[#FAF9F6] py-6">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 text-xs text-[#77746D] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>
              Este é um espaço para compreender como você está, sem julgamentos
              e sem definições sobre quem você é.
            </p>
            <p className="whitespace-nowrap">
              PHQ-9 · GAD-7 · Uso informativo
            </p>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
