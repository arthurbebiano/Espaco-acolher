import { ArrowRight, Clock, ShieldCheck } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <section
      aria-labelledby="welcome-heading"
      className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
        {/* Main Editorial Welcome Column */}
        <div className="lg:col-span-7">
          <p className="text-xs font-medium tracking-widest uppercase text-[#77746D]">
            Autopercepção e cuidado · PHQ-9 e GAD-7
          </p>

          <h1
            id="welcome-heading"
            className="font-editorial mt-4 text-3xl leading-tight font-medium text-[#393833] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.18] [text-wrap:balance]"
          >
            Um momento para cuidar de você.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#393833]/90 sm:text-lg">
            Este espaço foi criado para ajudar você a observar como tem se
            sentido nas últimas duas semanas. Não existem respostas certas ou
            erradas. Responda com sinceridade, respeitando sua experiência.
          </p>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#77746D]">
            Você responderá a algumas perguntas sobre seu bem-estar emocional. Ao
            final, receberá um resumo das suas respostas e algumas informações
            para compreender melhor seus resultados.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-xl bg-[#393833] px-7 py-3.5 text-sm font-medium text-[#FAF9F6] transition-colors hover:bg-[#2E4B3A] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Começar avaliação</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-2 text-sm text-[#77746D]">
              <Clock className="h-4 w-4 shrink-0 text-[#8FAE9B]" aria-hidden="true" />
              <span>Leva apenas alguns minutos, no seu ritmo</span>
            </div>
          </div>
        </div>

        {/* Side Editorial Context & Privacy Card */}
        <aside className="lg:col-span-5">
          <div className="rounded-2xl border border-[#E6E1D6] bg-white p-6 sm:p-8 shadow-[0_2px_16px_rgba(57,56,51,0.03)]">
            <h2 className="font-editorial text-lg font-medium text-[#393833]">
              Antes de começar
            </h2>

            <div className="mt-5 space-y-5 text-sm leading-relaxed text-[#77746D]">
              <div className="rounded-xl bg-[#F1EDE5] p-4 text-[#393833]">
                <p className="font-medium">Rastreamento, não diagnóstico</p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#393833]/85">
                  Estes questionários são instrumentos de rastreamento e não
                  substituem uma avaliação profissional ou estabelecem um
                  diagnóstico.
                </p>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <ShieldCheck
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#8FAE9B]"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-medium text-[#393833]">
                    Privacidade e processamento local
                  </p>
                  <p className="mt-1">
                    Suas respostas são utilizadas apenas no seu navegador para
                    calcular esta devolutiva. Esta versão da ferramenta não exige
                    identificação pessoal, nome, CPF ou e-mail.
                  </p>
                </div>
              </div>

              <div className="border-t border-[#E6E1D6] pt-4 text-xs text-[#77746D]">
                <p>
                  Este é um espaço para compreender como você está, sem
                  julgamentos e sem definições sobre quem você é.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
