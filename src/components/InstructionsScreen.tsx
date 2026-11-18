import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { FREQUENCY_OPTIONS } from '../data/instruments';

interface InstructionsScreenProps {
  onBack: () => void;
  onContinue: () => void;
}

export function InstructionsScreen({
  onBack,
  onContinue,
}: InstructionsScreenProps) {
  return (
    <section
      aria-labelledby="instructions-heading"
      className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14"
    >
      <div className="rounded-2xl border border-[#E6E1D6] bg-white p-6 sm:p-10 shadow-[0_2px_18px_rgba(57,56,51,0.03)]">
        <p className="text-xs font-medium tracking-widest uppercase text-[#77746D]">
          Orientações iniciais
        </p>

        <h1
          id="instructions-heading"
          className="font-editorial mt-3 text-2xl font-medium text-[#393833] sm:text-3xl [text-wrap:balance]"
        >
          Como responder às próximas perguntas
        </h1>

        <div className="mt-5 space-y-3 text-base leading-relaxed text-[#393833]/90">
          <p>
            Nas próximas perguntas, pense em como você se sentiu{' '}
            <strong className="font-medium text-[#393833]">
              durante as últimas duas semanas
            </strong>
            .
          </p>
          <p>
            Para cada afirmação, escolha a alternativa que melhor representa a
            frequência com que você vivenciou aquela situação:
          </p>
        </div>

        <ul className="mt-6 divide-y divide-[#E6E1D6] rounded-xl border border-[#E6E1D6] bg-[#FAF9F6]">
          {FREQUENCY_OPTIONS.map((option) => (
            <li
              key={option.value}
              className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm sm:text-base"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#EAE5F2] text-xs font-semibold text-[#473C5E] tabular-nums">
                  {option.value}
                </span>
                <span className="font-medium text-[#393833]">
                  {option.label}
                </span>
              </div>
              <span className="text-xs text-[#77746D] tabular-nums">
                {option.value === 0
                  ? 'Ausente'
                  : option.value === 1
                    ? 'Ocasional'
                    : option.value === 2
                      ? 'Frequente'
                      : 'Constante'}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#DCE8DF]/65 p-4 text-sm leading-relaxed text-[#2E4B3A]">
          <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            Suas respostas são individuais e não há pressa. Você poderá voltar a
            qualquer pergunta e revisar todas as suas escolhas antes de
            finalizar.
          </p>
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
            onClick={onContinue}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#393833] px-6 py-3 text-sm font-medium text-[#FAF9F6] transition-colors hover:bg-[#2E4B3A] whitespace-nowrap cursor-pointer"
          >
            <span>Iniciar questionário</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
