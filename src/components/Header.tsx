import { RotateCcw } from 'lucide-react';

interface HeaderProps {
  stageLabel: string;
  canReset: boolean;
  onReset: () => void;
  onGoHome: () => void;
}

export function Header({
  stageLabel,
  canReset,
  onReset,
  onGoHome,
}: HeaderProps) {
  return (
    <header className="border-b border-[#E6E1D6] bg-[#FAF9F6]">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onGoHome}
          className="font-editorial text-lg font-medium tracking-tight text-[#393833] transition-colors hover:text-[#2E4B3A] whitespace-nowrap shrink-0 cursor-pointer"
        >
          Espaço Acolher
        </button>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#77746D] whitespace-nowrap">
            <span className="hidden sm:inline">Rastreamento emocional</span>
            <span className="hidden sm:inline" aria-hidden="true">
              ·
            </span>
            <span className="font-medium text-[#393833] tabular-nums">
              {stageLabel}
            </span>
          </div>

          {canReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#E6E1D6] bg-white px-3.5 py-2 text-xs font-medium text-[#393833] transition-colors hover:bg-[#F1EDE5] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-[#77746D]" aria-hidden="true" />
              <span className="hidden sm:inline">Limpar e recomeçar</span>
              <span className="sm:hidden">Recomeçar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
