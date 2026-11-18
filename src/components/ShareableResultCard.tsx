import { forwardRef } from 'react';
import type { AssessmentEvaluation } from '../utils/scoring';

interface ShareableResultCardProps {
  evaluation: AssessmentEvaluation;
}

export const ShareableResultCard = forwardRef<
  HTMLDivElement,
  ShareableResultCardProps
>(function ShareableResultCard({ evaluation }, ref) {
  const phqPct = Math.round((evaluation.phq9.score / evaluation.phq9.maxScore) * 100);
  const gadPct = Math.round((evaluation.gad7.score / evaluation.gad7.maxScore) * 100);

  return (
    <div
      ref={ref}
      data-testid="shareable-result-card"
      className="w-full rounded-2xl border border-[#E6E1D6] bg-[#FAF9F6] p-6 sm:p-8 text-[#393833]"
    >
      {/* Cabeçalho */}
      <div className="border-b border-[#E6E1D6] pb-5">
        <p className="text-[11px] font-medium tracking-widest uppercase text-[#77746D]">
          Rastreamento de bem-estar · PHQ-9 e GAD-7
        </p>
        <h3 className="font-editorial mt-2 text-2xl leading-snug font-medium text-[#393833]">
          Seu panorama de bem-estar emocional
        </h3>
        <p className="mt-1.5 text-sm text-[#77746D]">
          Um registro das suas respostas nas últimas duas semanas.
        </p>
      </div>

      {/* Sinalização obrigatória de segurança caso Item 9 > 0 */}
      {evaluation.safetyAlert && (
        <div className="mt-5 rounded-xl border border-[#DEC4BF] bg-[#F2E4E1]/85 p-4">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#6B3D38]">
            Atenção à segurança
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#393833]">
            Uma das respostas indica necessidade de conversa direta com um
            profissional de saúde sobre como você está se sentindo e sobre sua
            segurança. A pontuação total sozinha não avalia esse risco. Em
            situação de emergência, procure SAMU (192), UPA ou pronto-socorro.
          </p>
        </div>
      )}

      <div className="mt-5 space-y-4">
        {/* Cartão 1: PHQ-9 */}
        <div className="rounded-xl border border-[#E6E1D6] bg-white p-5">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="text-xs font-medium tracking-wider uppercase text-[#77746D]">
                PHQ-9 · Humor e energia
              </p>
              <p className="font-editorial mt-1 text-lg font-medium text-[#393833]">
                {evaluation.phq9.classification}
              </p>
            </div>
            <p className="text-right font-editorial text-2xl font-medium text-[#2E4B3A] tabular-nums">
              {evaluation.phq9.score}
              <span className="text-sm font-normal text-[#77746D]">
                /{evaluation.phq9.maxScore}
              </span>
            </p>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#DCE8DF]/60">
            <div
              className="h-full rounded-full bg-[#8FAE9B]"
              style={{ width: `${phqPct}%` }}
            />
          </div>

          <p className="mt-3 text-xs leading-relaxed text-[#77746D]">
            {evaluation.phq9.shortImageSummary}
          </p>
        </div>

        {/* Cartão 2: GAD-7 */}
        <div className="rounded-xl border border-[#E6E1D6] bg-white p-5">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="text-xs font-medium tracking-wider uppercase text-[#77746D]">
                GAD-7 · Preocupação e ansiedade
              </p>
              <p className="font-editorial mt-1 text-lg font-medium text-[#393833]">
                {evaluation.gad7.classification}
              </p>
            </div>
            <p className="text-right font-editorial text-2xl font-medium text-[#473C5E] tabular-nums">
              {evaluation.gad7.score}
              <span className="text-sm font-normal text-[#77746D]">
                /{evaluation.gad7.maxScore}
              </span>
            </p>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#EAE5F2]/80">
            <div
              className="h-full rounded-full bg-[#9E92B8]"
              style={{ width: `${gadPct}%` }}
            />
          </div>

          <p className="mt-3 text-xs leading-relaxed text-[#77746D]">
            {evaluation.gad7.shortImageSummary}
          </p>
        </div>

        {/* Cartão 3: Compreendendo seus resultados */}
        <div className="rounded-xl border border-[#E6E1D6] bg-[#F1EDE5]/75 p-5">
          <p className="font-editorial text-base font-medium text-[#393833]">
            Compreendendo seus resultados
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[#393833]/90">
            {evaluation.joint.shortImageSummary}
          </p>
          <p className="mt-2.5 border-t border-[#E6E1D6] pt-2.5 text-xs leading-relaxed text-[#393833]">
            <span className="font-medium">Próximos passos: </span>
            {evaluation.nextSteps.shortImageSummary}
          </p>
        </div>
      </div>

      {/* Rodapé */}
      <div className="mt-5 border-t border-[#E6E1D6] pt-4">
        <p className="text-[11px] leading-relaxed text-[#77746D]">
          Este material é informativo e não constitui diagnóstico médico ou
          psicológico. A interpretação deve considerar avaliação profissional e
          contexto individual.
        </p>
      </div>
    </div>
  );
});
