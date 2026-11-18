import { CheckCircle2, Download, RotateCcw, ShieldCheck } from 'lucide-react';
import { useRef, useState } from 'react';
import { LIMITATIONS_CONTENT } from '../data/instruments';
import {
  generateResultPngDataUrl,
  triggerPngDownload,
} from '../utils/exportResultImage';
import type { AssessmentEvaluation } from '../utils/scoring';
import { IntensityMeter } from './IntensityMeter';
import { SafetyAlertCard } from './SafetyAlertCard';
import { ShareableResultCard } from './ShareableResultCard';

interface ResultsScreenProps {
  evaluation: AssessmentEvaluation;
  onRestart: () => void;
  onEditAnswers: () => void;
}

export function ResultsScreen({
  evaluation,
  onRestart,
  onEditAnswers,
}: ResultsScreenProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [exportStatus, setExportStatus] = useState<
    'idle' | 'generating' | 'done' | 'error'
  >('idle');
  const [lastGeneratedPreview, setLastGeneratedPreview] = useState<string | null>(
    null
  );

  const handleDownloadImage = async () => {
    if (!cardRef.current || exportStatus === 'generating') return;
    setExportStatus('generating');
    try {
      const dataUrl = await generateResultPngDataUrl(cardRef.current);
      setLastGeneratedPreview(dataUrl);
      triggerPngDownload(dataUrl);
      setExportStatus('done');
    } catch {
      setExportStatus('error');
    }
  };

  return (
    <article
      aria-labelledby="results-welcome-heading"
      className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
    >
      <div className="space-y-8">
        {/* A. Mensagem de acolhimento */}
        <section className="rounded-2xl border border-[#E6E1D6] bg-white p-6 sm:p-9 shadow-[0_2px_18px_rgba(57,56,51,0.03)]">
          <p className="text-xs font-medium tracking-widest uppercase text-[#77746D]">
            Devolutiva individualizada · Sem caráter diagnóstico
          </p>
          <h1
            id="results-welcome-heading"
            className="font-editorial mt-3 text-2xl leading-snug font-medium text-[#393833] sm:text-3xl [text-wrap:balance]"
          >
            Obrigada por dedicar um momento para olhar para si mesma.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#393833]/90">
            Reconhecer e expressar como estamos nos sentindo nem sempre é fácil.
            Suas respostas são um primeiro passo para compreender melhor seu
            momento atual — lembrando que este resultado é um ponto de partida
            para uma conversa, e não uma definição sobre quem você é.
          </p>
        </section>

        {/* Regra obrigatória de segurança — Item 9 do PHQ-9 */}
        {evaluation.safetyAlert && <SafetyAlertCard />}

        {/* B e C. Cartões de Resultado PHQ-9 e GAD-7 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* B. PHQ-9 */}
          <section
            aria-labelledby="phq9-result-heading"
            data-testid="phq9-result-card"
            className="flex flex-col justify-between rounded-2xl border border-[#E6E1D6] bg-white p-6 sm:p-7"
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium tracking-wider uppercase text-[#77746D]">
                    PHQ-9 · Rastreio de humor
                  </p>
                  <h2
                    id="phq9-result-heading"
                    className="font-editorial mt-1.5 text-xl font-medium text-[#393833]"
                  >
                    {evaluation.phq9.classification}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="font-editorial text-3xl font-medium text-[#2E4B3A] tabular-nums">
                    {evaluation.phq9.score}
                    <span className="text-base font-normal text-[#77746D]">
                      /{evaluation.phq9.maxScore}
                    </span>
                  </p>
                </div>
              </div>

              <IntensityMeter
                score={evaluation.phq9.score}
                maxScore={evaluation.phq9.maxScore}
                accentTone="sage"
                cutoffValue={10}
              />

              <p className="mt-5 text-sm leading-relaxed text-[#393833]/90">
                {evaluation.phq9.plainExplanation}
              </p>
            </div>

            <div className="mt-6 space-y-2 border-t border-[#E6E1D6] pt-4 text-xs leading-relaxed text-[#77746D]">
              <p>{evaluation.phq9.cutoffNote}</p>
              <p className="text-[#393833]">
                <span className="font-medium">Conduta clínica sugerida: </span>
                {evaluation.phq9.clinicalConduct}
              </p>
            </div>
          </section>

          {/* C. GAD-7 */}
          <section
            aria-labelledby="gad7-result-heading"
            data-testid="gad7-result-card"
            className="flex flex-col justify-between rounded-2xl border border-[#E6E1D6] bg-white p-6 sm:p-7"
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium tracking-wider uppercase text-[#77746D]">
                    GAD-7 · Rastreio de ansiedade
                  </p>
                  <h2
                    id="gad7-result-heading"
                    className="font-editorial mt-1.5 text-xl font-medium text-[#393833]"
                  >
                    {evaluation.gad7.classification}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="font-editorial text-3xl font-medium text-[#473C5E] tabular-nums">
                    {evaluation.gad7.score}
                    <span className="text-base font-normal text-[#77746D]">
                      /{evaluation.gad7.maxScore}
                    </span>
                  </p>
                </div>
              </div>

              <IntensityMeter
                score={evaluation.gad7.score}
                maxScore={evaluation.gad7.maxScore}
                accentTone="lavender"
                cutoffValue={10}
              />

              <p className="mt-5 text-sm leading-relaxed text-[#393833]/90">
                {evaluation.gad7.plainExplanation}
              </p>
            </div>

            <div className="mt-6 space-y-2 border-t border-[#E6E1D6] pt-4 text-xs leading-relaxed text-[#77746D]">
              <p>{evaluation.gad7.cutoffNote}</p>
              <p className="text-[#393833]">
                <span className="font-medium">Conduta clínica sugerida: </span>
                {evaluation.gad7.clinicalConduct}
              </p>
            </div>
          </section>
        </div>

        {/* D. Impacto na vida cotidiana */}
        <section
          aria-labelledby="functional-impact-heading"
          className="rounded-2xl border border-[#E6E1D6] bg-white p-6 sm:p-8"
        >
          <h2
            id="functional-impact-heading"
            className="font-editorial text-xl font-medium text-[#393833]"
          >
            Impacto na vida cotidiana
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#77746D]">
            Além da frequência dos sintomas, observamos separadamente o quanto
            essas experiências interferem no trabalho, nas tarefas em casa e nos
            vínculos. Essas respostas não entram na soma das escalas, mas são
            essenciais para entender sua rotina.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[#DCE8DF]/45 p-5">
              <p className="text-xs font-medium tracking-wider uppercase text-[#2E4B3A]">
                Sobre humor, sono e energia (PHQ-9)
              </p>
              <p className="font-editorial mt-1.5 text-lg font-medium text-[#393833]">
                {evaluation.phq9Functional.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#393833]/85">
                {evaluation.phq9Functional.summary}
              </p>
            </div>

            <div className="rounded-xl bg-[#EAE5F2]/60 p-5">
              <p className="text-xs font-medium tracking-wider uppercase text-[#473C5E]">
                Sobre preocupações e tensão (GAD-7)
              </p>
              <p className="font-editorial mt-1.5 text-lg font-medium text-[#393833]">
                {evaluation.gad7Functional.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#393833]/85">
                {evaluation.gad7Functional.summary}
              </p>
            </div>
          </div>
        </section>

        {/* E. Compreendendo os resultados em conjunto */}
        <section
          aria-labelledby="joint-interpretation-heading"
          className="rounded-2xl border border-[#E6E1D6] bg-[#F1EDE5]/65 p-6 sm:p-8"
        >
          <p className="text-xs font-medium tracking-widest uppercase text-[#77746D]">
            Compreendendo os resultados em conjunto
          </p>
          <h2
            id="joint-interpretation-heading"
            className="font-editorial mt-2 text-xl font-medium text-[#393833] sm:text-2xl [text-wrap:balance]"
          >
            {evaluation.joint.title}
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#393833]/90 sm:text-base">
            {evaluation.joint.paragraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* F. Próximos passos */}
        <section
          aria-labelledby="next-steps-heading"
          className="rounded-2xl border border-[#E6E1D6] bg-white p-6 sm:p-8"
        >
          <p className="text-xs font-medium tracking-widest uppercase text-[#77746D]">
            Próximos passos
          </p>
          <h2
            id="next-steps-heading"
            className="font-editorial mt-2 text-xl font-medium text-[#393833] sm:text-2xl [text-wrap:balance]"
          >
            {evaluation.nextSteps.headline}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#393833]/90 sm:text-base">
            {evaluation.nextSteps.primaryGuidance}
          </p>

          <ul className="mt-5 space-y-2.5 border-t border-[#E6E1D6] pt-5 text-sm leading-relaxed text-[#393833]/90">
            {evaluation.nextSteps.supportingActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8FAE9B]"
                />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* G. Limitações dos instrumentos */}
        <section
          aria-labelledby="limitations-heading"
          className="rounded-2xl border border-[#E6E1D6] bg-white p-6 sm:p-8"
        >
          <h2
            id="limitations-heading"
            className="font-editorial text-xl font-medium text-[#393833] sm:text-2xl [text-wrap:balance]"
          >
            {LIMITATIONS_CONTENT.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#393833]/90 sm:text-base">
            {LIMITATIONS_CONTENT.intro}
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#77746D]">
            {LIMITATIONS_CONTENT.points.map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <span aria-hidden="true" className="text-[#8FAE9B]">
                  —
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-[#77746D]">
            {LIMITATIONS_CONTENT.gad7Note}
          </p>
          <div className="mt-6 rounded-xl bg-[#DCE8DF]/55 p-5 text-center">
            <p className="font-editorial text-lg font-medium text-[#2E4B3A] sm:text-xl">
              {LIMITATIONS_CONTENT.closingHighlight}
            </p>
          </div>
        </section>

        {/* H. Gerador de imagem para download */}
        <section
          aria-labelledby="download-image-heading"
          className="rounded-2xl border border-[#E6E1D6] bg-white p-6 sm:p-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-[#77746D]">
                Registro visual para guardar ou levar à consulta
              </p>
              <h2
                id="download-image-heading"
                className="font-editorial mt-1.5 text-xl font-medium text-[#393833] sm:text-2xl"
              >
                Salvar panorama em imagem
              </h2>
              <p className="mt-1.5 max-w-xl text-sm text-[#77746D]">
                A imagem abaixo reúne apenas seus resultados consolidados, sem
                dados pessoais ou respostas individuais.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={exportStatus === 'generating'}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#393833] px-6 py-3 text-sm font-medium text-[#FAF9F6] transition-colors hover:bg-[#2E4B3A] disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>
                {exportStatus === 'generating'
                  ? 'Gerando imagem...'
                  : 'Baixar meu resultado'}
              </span>
            </button>
          </div>

          {exportStatus === 'done' && lastGeneratedPreview && (
            <div
              role="status"
              data-testid="export-success-banner"
              className="mt-4 flex items-center gap-2 rounded-xl bg-[#DCE8DF]/65 px-4 py-3 text-sm text-[#2E4B3A]"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                Imagem PNG gerada com sucesso. Caso o download não inicie
                automaticamente, você pode clicar novamente no botão acima.
              </span>
            </div>
          )}

          {exportStatus === 'error' && (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-[#F2E4E1] px-4 py-3 text-sm text-[#6B3D38]"
            >
              Não foi possível gerar o arquivo PNG neste momento. Tente
              novamente em instantes.
            </p>
          )}

          <div className="mt-6 rounded-2xl bg-[#F1EDE5]/55 p-4 sm:p-6">
            <div className="mx-auto w-full max-w-[540px]">
              <ShareableResultCard ref={cardRef} evaluation={evaluation} />
            </div>
          </div>
        </section>

        {/* Privacidade e Ações Finais */}
        <footer className="flex flex-col gap-5 rounded-2xl border border-[#E6E1D6] bg-[#FAF9F6] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-[#8FAE9B]"
              aria-hidden="true"
            />
            <p className="text-xs leading-relaxed text-[#77746D]">
              Suas respostas são utilizadas para calcular esta devolutiva. Esta
              versão da ferramenta não exige identificação pessoal e não armazena
              suas respostas permanentemente.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onEditAnswers}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#E6E1D6] bg-white px-4 py-2.5 text-xs font-medium text-[#393833] transition-colors hover:bg-[#F1EDE5] whitespace-nowrap cursor-pointer"
            >
              Revisar respostas
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#E6E1D6] bg-white px-4 py-2.5 text-xs font-medium text-[#393833] transition-colors hover:bg-[#F1EDE5] whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reiniciar avaliação</span>
            </button>
          </div>
        </footer>
      </div>
    </article>
  );
}
