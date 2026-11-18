import { HeartHandshake, PhoneCall } from 'lucide-react';
import { SAFETY_CONTENT } from '../data/instruments';

export function SafetyAlertCard() {
  return (
    <section
      aria-labelledby="safety-alert-heading"
      role="region"
      data-testid="safety-alert-card"
      className="rounded-2xl border border-[#DEC4BF] bg-[#F2E4E1]/75 p-6 sm:p-8"
    >
      <div className="flex items-start gap-3.5">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 text-[#6B3D38]">
          <HeartHandshake className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium tracking-widest uppercase text-[#6B3D38]/80">
            Sinalização de cuidado e segurança
          </p>
          <h2
            id="safety-alert-heading"
            className="font-editorial mt-1.5 text-xl font-medium text-[#393833] sm:text-2xl [text-wrap:balance]"
          >
            {SAFETY_CONTENT.heading}
          </h2>
        </div>
      </div>

      <div className="mt-5 space-y-3.5 text-sm leading-relaxed text-[#393833] sm:text-base">
        <p>{SAFETY_CONTENT.primaryMessage}</p>
        <p className="font-medium text-[#393833]">
          {SAFETY_CONTENT.conversationGuidance}
        </p>
        <p className="rounded-xl bg-white/75 p-4 text-sm leading-relaxed text-[#6B3D38]">
          {SAFETY_CONTENT.emergencyGuidance}
        </p>
      </div>

      <div className="mt-6 border-t border-[#DEC4BF] pt-5">
        <p className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-[#6B3D38]">
          <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Canais de atendimento e apoio no Brasil</span>
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {SAFETY_CONTENT.channels.map((channel) => (
            <div
              key={channel.name}
              className="rounded-xl border border-[#E6D1CD] bg-white/90 p-4"
            >
              <p className="text-sm font-semibold text-[#393833] tabular-nums">
                {channel.name}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#77746D]">
                {channel.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
