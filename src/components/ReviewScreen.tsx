import { ArrowLeft, ArrowRight, Pencil } from 'lucide-react';
import {
  FREQUENCY_OPTIONS,
  FUNCTIONAL_OPTIONS,
  GAD7_ITEMS,
  PHQ9_ITEMS,
  PHQ9_META,
  GAD7_META,
  type FrequencyValue,
  type FunctionalImpactValue,
} from '../data/instruments';

interface ReviewScreenProps {
  phq9Answers: (FrequencyValue | null)[];
  phq9Functional: FunctionalImpactValue | null;
  gad7Answers: (FrequencyValue | null)[];
  gad7Functional: FunctionalImpactValue | null;
  onEditStep: (stepIndex: number) => void;
  onBack: () => void;
  onSubmit: () => void;
}

function getFrequencyLabel(value: FrequencyValue | null): string {
  if (value === null) return 'Não respondida';
  return (
    FREQUENCY_OPTIONS.find((opt) => opt.value === value)?.label ??
    'Não respondida'
  );
}

function getFunctionalLabel(value: FunctionalImpactValue | null): string {
  if (value === null) return 'Não respondida';
  return (
    FUNCTIONAL_OPTIONS.find((opt) => opt.value === value)?.label ??
    'Não respondida'
  );
}

export function ReviewScreen({
  phq9Answers,
  phq9Functional,
  gad7Answers,
  gad7Functional,
  onEditStep,
  onBack,
  onSubmit,
}: ReviewScreenProps) {
  return (
    <section
      aria-labelledby="review-heading"
      className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12"
    >
      <div className="mb-6">
        <p className="text-xs font-medium tracking-widest uppercase text-[#77746D]">
          Revisão antes de finalizar
        </p>
        <h1
          id="review-heading"
          className="font-editorial mt-2 text-2xl font-medium text-[#393833] sm:text-3xl [text-wrap:balance]"
        >
          Confira suas respostas com tranquilidade
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#77746D]">
          Se quiser ajustar alguma escolha antes de gerar sua devolutiva, basta
          clicar em alterar ao lado da pergunta.
        </p>
      </div>

      <div className="space-y-6">
        {/* PHQ-9 Review Card */}
        <div className="rounded-2xl border border-[#E6E1D6] bg-white p-6 sm:p-7">
          <h2 className="font-editorial text-lg font-medium text-[#393833]">
            PHQ-9 · Humor, energia e bem-estar
          </h2>
          <ul className="mt-4 divide-y divide-[#E6E1D6]">
            {PHQ9_ITEMS.map((item, idx) => (
              <li
                key={item.id}
                className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <p className="text-sm leading-relaxed text-[#393833]">
                  <span className="mr-2 text-[#77746D] tabular-nums">
                    {item.number}.
                  </span>
                  {item.text}
                </p>
                <div className="flex items-center justify-between gap-3 shrink-0 sm:justify-end">
                  <span className="text-xs font-medium text-[#2E4B3A] tabular-nums">
                    {getFrequencyLabel(phq9Answers[idx])} (
                    {phq9Answers[idx] ?? '-'})
                  </span>
                  <button
                    type="button"
                    onClick={() => onEditStep(idx)}
                    aria-label={`Alterar resposta da pergunta ${item.number} do PHQ-9`}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-[#E6E1D6] px-2.5 py-1 text-xs font-medium text-[#77746D] transition-colors hover:bg-[#F1EDE5] hover:text-[#393833] cursor-pointer"
                  >
                    <Pencil className="h-3 w-3" aria-hidden="true" />
                    <span>Alterar</span>
                  </button>
                </div>
              </li>
            ))}
            <li className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <p className="text-sm leading-relaxed text-[#77746D]">
                {PHQ9_META.functionalQuestion}
              </p>
              <div className="flex items-center justify-between gap-3 shrink-0 sm:justify-end">
                <span className="text-xs font-medium text-[#393833]">
                  {getFunctionalLabel(phq9Functional)}
                </span>
                <button
                  type="button"
                  onClick={() => onEditStep(9)}
                  aria-label="Alterar resposta de impacto funcional do PHQ-9"
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-[#E6E1D6] px-2.5 py-1 text-xs font-medium text-[#77746D] transition-colors hover:bg-[#F1EDE5] hover:text-[#393833] cursor-pointer"
                >
                  <Pencil className="h-3 w-3" aria-hidden="true" />
                  <span>Alterar</span>
                </button>
              </div>
            </li>
          </ul>
        </div>

        {/* GAD-7 Review Card */}
        <div className="rounded-2xl border border-[#E6E1D6] bg-white p-6 sm:p-7">
          <h2 className="font-editorial text-lg font-medium text-[#393833]">
            GAD-7 · Preocupação e ansiedade
          </h2>
          <ul className="mt-4 divide-y divide-[#E6E1D6]">
            {GAD7_ITEMS.map((item, idx) => (
              <li
                key={item.id}
                className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <p className="text-sm leading-relaxed text-[#393833]">
                  <span className="mr-2 text-[#77746D] tabular-nums">
                    {item.number}.
                  </span>
                  {item.text}
                </p>
                <div className="flex items-center justify-between gap-3 shrink-0 sm:justify-end">
                  <span className="text-xs font-medium text-[#473C5E] tabular-nums">
                    {getFrequencyLabel(gad7Answers[idx])} (
                    {gad7Answers[idx] ?? '-'})
                  </span>
                  <button
                    type="button"
                    onClick={() => onEditStep(10 + idx)}
                    aria-label={`Alterar resposta da pergunta ${item.number} do GAD-7`}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-[#E6E1D6] px-2.5 py-1 text-xs font-medium text-[#77746D] transition-colors hover:bg-[#F1EDE5] hover:text-[#393833] cursor-pointer"
                  >
                    <Pencil className="h-3 w-3" aria-hidden="true" />
                    <span>Alterar</span>
                  </button>
                </div>
              </li>
            ))}
            <li className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <p className="text-sm leading-relaxed text-[#77746D]">
                {GAD7_META.functionalQuestion}
              </p>
              <div className="flex items-center justify-between gap-3 shrink-0 sm:justify-end">
                <span className="text-xs font-medium text-[#393833]">
                  {getFunctionalLabel(gad7Functional)}
                </span>
                <button
                  type="button"
                  onClick={() => onEditStep(17)}
                  aria-label="Alterar resposta de impacto funcional do GAD-7"
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-[#E6E1D6] px-2.5 py-1 text-xs font-medium text-[#77746D] transition-colors hover:bg-[#F1EDE5] hover:text-[#393833] cursor-pointer"
                >
                  <Pencil className="h-3 w-3" aria-hidden="true" />
                  <span>Alterar</span>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
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
          onClick={onSubmit}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#393833] px-7 py-3 text-sm font-medium text-[#FAF9F6] transition-colors hover:bg-[#2E4B3A] whitespace-nowrap cursor-pointer"
        >
          <span>Ver minha devolutiva</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
