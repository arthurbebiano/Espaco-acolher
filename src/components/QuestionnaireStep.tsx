import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';
import {
  FREQUENCY_OPTIONS,
  FUNCTIONAL_OPTIONS,
  type FrequencyValue,
  type FunctionalImpactValue,
} from '../data/instruments';

interface QuestionnaireStepProps {
  instrumentLabel: string;
  instrumentTitle: string;
  instrumentSubtitle: string;
  introPrompt: string;
  questionNumber: number;
  totalQuestionsInInstrument: number;
  overallStep: number;
  overallTotalSteps: number;
  questionText: string;
  isFunctionalQuestion?: boolean;
  selectedFrequency: FrequencyValue | null;
  selectedFunctional: FunctionalImpactValue | null;
  onSelectFrequency: (value: FrequencyValue) => void;
  onSelectFunctional: (value: FunctionalImpactValue) => void;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}

export function QuestionnaireStep({
  instrumentLabel,
  instrumentTitle,
  instrumentSubtitle,
  introPrompt,
  questionNumber,
  totalQuestionsInInstrument,
  overallStep,
  overallTotalSteps,
  questionText,
  isFunctionalQuestion = false,
  selectedFrequency,
  selectedFunctional,
  onSelectFrequency,
  onSelectFunctional,
  onBack,
  onNext,
  nextLabel = 'Próxima',
}: QuestionnaireStepProps) {
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null
  );

  const hasAnswer = isFunctionalQuestion
    ? selectedFunctional !== null
    : selectedFrequency !== null;

  const progressPercent = Math.round((overallStep / overallTotalSteps) * 100);

  const handleNextClick = () => {
    if (!hasAnswer) {
      setValidationMessage(
        'Por favor, escolha uma das opções acima antes de continuar.'
      );
      return;
    }
    setValidationMessage(null);
    onNext();
  };

  const handlePickFrequency = (value: FrequencyValue) => {
    setValidationMessage(null);
    onSelectFrequency(value);
  };

  const handlePickFunctional = (value: FunctionalImpactValue) => {
    setValidationMessage(null);
    onSelectFunctional(value);
  };

  return (
    <section
      aria-labelledby="question-heading"
      className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12"
    >
      {/* Delicate Progress Bar & Section Context */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 text-xs text-[#77746D]">
          <span className="font-medium text-[#393833]">
            {instrumentLabel}{' '}
            <span className="font-normal text-[#77746D]">
              ·{' '}
              {isFunctionalQuestion
                ? 'Impacto no dia a dia'
                : `Pergunta ${questionNumber} de ${totalQuestionsInInstrument}`}
            </span>
          </span>
          <span className="tabular-nums">
            Etapa {overallStep} de {overallTotalSteps}
          </span>
        </div>

        <div
          className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[#F1EDE5]"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progresso do preenchimento: ${progressPercent}%`}
        >
          <div
            className="h-full rounded-full bg-[#8FAE9B] transition-[width] duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Instrument Framing Header (calm, low density) */}
      <div className="mb-5 px-1">
        <h1 className="font-editorial text-xl font-medium text-[#393833] sm:text-2xl [text-wrap:balance]">
          {instrumentTitle}
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-[#77746D]">
          {instrumentSubtitle}
        </p>
      </div>

      {/* Focused Single-Question Card */}
      <div className="rounded-2xl border border-[#E6E1D6] bg-white p-6 sm:p-8 shadow-[0_2px_18px_rgba(57,56,51,0.03)]">
        {!isFunctionalQuestion && (
          <p className="text-xs font-medium leading-relaxed text-[#77746D]">
            {introPrompt}
          </p>
        )}

        <h2
          id="question-heading"
          className={`font-editorial text-lg leading-snug font-medium text-[#393833] sm:text-xl [text-wrap:balance] ${
            isFunctionalQuestion ? '' : 'mt-3'
          }`}
        >
          {!isFunctionalQuestion && (
            <span className="mr-2 text-[#77746D] tabular-nums">
              {questionNumber}.
            </span>
          )}
          {questionText}
        </h2>

        {/* Answer Choices */}
        <div
          role="radiogroup"
          aria-labelledby="question-heading"
          className="mt-6 space-y-3"
        >
          {isFunctionalQuestion
            ? FUNCTIONAL_OPTIONS.map((option) => {
                const isSelected = selectedFunctional === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handlePickFunctional(option.value)}
                    className={`group flex min-h-[52px] w-full items-center justify-between gap-4 rounded-xl border px-4 py-3.5 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#8FAE9B] bg-[#DCE8DF]/65 text-[#393833]'
                        : 'border-[#E6E1D6] bg-[#FAF9F6]/60 text-[#393833] hover:border-[#8FAE9B]/70 hover:bg-[#F1EDE5]/60'
                    }`}
                  >
                    <span className="text-sm font-medium sm:text-base">
                      {option.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        isSelected
                          ? 'border-[#2E4B3A] bg-[#2E4B3A] text-white'
                          : 'border-[#C9C3B8] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </span>
                  </button>
                );
              })
            : FREQUENCY_OPTIONS.map((option) => {
                const isSelected = selectedFrequency === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handlePickFrequency(option.value)}
                    className={`group flex min-h-[54px] w-full items-center justify-between gap-4 rounded-xl border px-4 py-3.5 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#8FAE9B] bg-[#DCE8DF]/65 text-[#393833]'
                        : 'border-[#E6E1D6] bg-[#FAF9F6]/60 text-[#393833] hover:border-[#8FAE9B]/70 hover:bg-[#F1EDE5]/60'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold tabular-nums transition-colors ${
                          isSelected
                            ? 'bg-[#2E4B3A] text-white'
                            : 'bg-[#F1EDE5] text-[#77746D]'
                        }`}
                      >
                        {option.value}
                      </span>
                      <span className="text-sm font-medium sm:text-base">
                        {option.label}
                      </span>
                    </div>
                    <span
                      aria-hidden="true"
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        isSelected
                          ? 'border-[#2E4B3A] bg-[#2E4B3A] text-white'
                          : 'border-[#C9C3B8] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </span>
                  </button>
                );
              })}
        </div>

        {isFunctionalQuestion && (
          <p className="mt-4 text-xs text-[#77746D]">
            Esta pergunta ajuda a compreender o impacto na rotina e não altera o
            cálculo numérico da escala.
          </p>
        )}

        {validationMessage && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-[#F2E4E1] px-4 py-2.5 text-sm text-[#6B3D38]"
          >
            {validationMessage}
          </p>
        )}

        {/* Navigation Controls */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#E6E1D6] pt-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#E6E1D6] bg-white px-5 py-2.5 text-sm font-medium text-[#393833] transition-colors hover:bg-[#F1EDE5] whitespace-nowrap cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Voltar</span>
          </button>

          <button
            type="button"
            onClick={handleNextClick}
            className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              hasAnswer
                ? 'bg-[#393833] text-[#FAF9F6] hover:bg-[#2E4B3A]'
                : 'bg-[#E6E1D6] text-[#77746D] hover:bg-[#DBD4C6]'
            }`}
          >
            <span>{nextLabel}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
