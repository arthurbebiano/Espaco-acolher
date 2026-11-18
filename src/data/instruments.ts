export type FrequencyValue = 0 | 1 | 2 | 3;

export type FunctionalImpactValue =
  | 'nada'
  | 'um_pouco'
  | 'muito'
  | 'extremamente';

export interface FrequencyOption {
  value: FrequencyValue;
  label: string;
}

export interface FunctionalOption {
  value: FunctionalImpactValue;
  label: string;
  adverbialDescription: string;
}

export interface InstrumentItem {
  id: string;
  number: number;
  text: string;
  isSafetyItem?: boolean;
}

export const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { value: 0, label: 'Nenhuma vez' },
  { value: 1, label: 'Vários dias' },
  { value: 2, label: 'Mais da metade dos dias' },
  { value: 3, label: 'Quase todos os dias' },
];

export const FUNCTIONAL_OPTIONS: FunctionalOption[] = [
  {
    value: 'nada',
    label: 'Nada difícil',
    adverbialDescription: 'não tem trazido dificuldades significativas no dia a dia',
  },
  {
    value: 'um_pouco',
    label: 'Um pouco difícil',
    adverbialDescription: 'um pouco mais difícil de conduzir no dia a dia',
  },
  {
    value: 'muito',
    label: 'Muito difícil',
    adverbialDescription: 'muito mais difícil de lidar no trabalho, em casa ou nas relações',
  },
  {
    value: 'extremamente',
    label: 'Extremamente difícil',
    adverbialDescription: 'extremamente difícil de sustentar nas atividades e vínculos cotidianos',
  },
];

export const PHQ9_META = {
  id: 'phq9' as const,
  name: 'PHQ-9',
  fullName: 'Questionário sobre a Saúde do(a) Paciente — 9 itens',
  title: 'Como você tem se sentido?',
  subtitle:
    'Vamos começar com algumas perguntas sobre seu humor, energia, sono e bem-estar.',
  introQuestion:
    'Nas últimas 2 semanas, com que frequência você foi incomodada por qualquer um dos problemas abaixo?',
  functionalQuestion:
    'Se você marcou algum problema, quão difícil ele tornou o trabalho, as tarefas em casa ou o convívio com outras pessoas?',
  maxScore: 27,
};

export const PHQ9_ITEMS: InstrumentItem[] = [
  {
    id: 'phq9_1',
    number: 1,
    text: 'Pouco interesse ou prazer em fazer as coisas.',
  },
  {
    id: 'phq9_2',
    number: 2,
    text: 'Sentir-se para baixo, deprimida ou sem esperança.',
  },
  {
    id: 'phq9_3',
    number: 3,
    text: 'Dificuldade para pegar no sono, continuar dormindo ou dormir demais.',
  },
  {
    id: 'phq9_4',
    number: 4,
    text: 'Sentir-se cansada ou com pouca energia.',
  },
  {
    id: 'phq9_5',
    number: 5,
    text: 'Falta de apetite ou comer demais.',
  },
  {
    id: 'phq9_6',
    number: 6,
    text: 'Sentir-se mal consigo mesma, ou que é um fracasso, ou que decepcionou a si mesma ou à família.',
  },
  {
    id: 'phq9_7',
    number: 7,
    text: 'Dificuldade de concentração, como ao ler o jornal ou ver televisão.',
  },
  {
    id: 'phq9_8',
    number: 8,
    text: 'Lentidão para se mover ou falar, a ponto de outras pessoas notarem, ou o oposto: ficar agitada ou inquieta, movimentando-se muito mais que o habitual.',
  },
  {
    id: 'phq9_9',
    number: 9,
    text: 'Pensamentos de que seria melhor estar morta ou de se machucar de alguma maneira.',
    isSafetyItem: true,
  },
];

export const GAD7_META = {
  id: 'gad7' as const,
  name: 'GAD-7',
  fullName: 'Escala de Ansiedade Generalizada — 7 itens',
  title: 'Agora, vamos falar sobre preocupação e ansiedade.',
  subtitle:
    'Estas perguntas ajudam a observar como você tem vivenciado preocupações, tensão e inquietação.',
  introQuestion:
    'Nas últimas 2 semanas, com que frequência você foi incomodada pelos problemas abaixo?',
  functionalQuestion:
    'Se você marcou algum problema, quão difícil esses problemas tornaram seu trabalho, suas tarefas em casa ou seu convívio com outras pessoas?',
  maxScore: 21,
};

export const GAD7_ITEMS: InstrumentItem[] = [
  {
    id: 'gad7_1',
    number: 1,
    text: 'Sentir-se nervosa, ansiosa ou muito tensa.',
  },
  {
    id: 'gad7_2',
    number: 2,
    text: 'Não conseguir impedir ou controlar as preocupações.',
  },
  {
    id: 'gad7_3',
    number: 3,
    text: 'Preocupar-se demais com coisas diferentes.',
  },
  {
    id: 'gad7_4',
    number: 4,
    text: 'Dificuldade para relaxar.',
  },
  {
    id: 'gad7_5',
    number: 5,
    text: 'Ficar tão agitada que é difícil permanecer sentada.',
  },
  {
    id: 'gad7_6',
    number: 6,
    text: 'Ficar facilmente aborrecida ou irritada.',
  },
  {
    id: 'gad7_7',
    number: 7,
    text: 'Sentir medo como se algo horrível fosse acontecer.',
  },
];

export const SAFETY_CONTENT = {
  heading: 'Um cuidado importante sobre uma das suas respostas',
  primaryMessage:
    'Obrigada por compartilhar isso. Perceber pensamentos sobre a morte ou sobre se machucar pode ser algo muito difícil de enfrentar, e você merece receber acolhimento e apoio.',
  conversationGuidance:
    'Sua resposta indica que seria importante conversar diretamente com um profissional de saúde sobre como você está se sentindo e sobre sua segurança. Este questionário não consegue avaliar sozinho o risco de você se machucar. Por isso, é importante que essa questão seja conversada com alguém preparado para ajudar.',
  emergencyGuidance:
    'Se em algum momento você sentir que pode se machucar agora, que não consegue se manter segura ou que existe risco imediato, procure um serviço de emergência imediatamente, não permaneça sozinha e busque o apoio de alguém de confiança.',
  channels: [
    {
      name: 'SAMU — 192',
      detail: 'Atendimento médico móvel de urgência e emergência em todo o Brasil.',
    },
    {
      name: 'UPA 24h ou Pronto-Socorro',
      detail: 'Procure a unidade de pronto atendimento ou hospital mais próximo em caso de risco imediato.',
    },
    {
      name: 'CVV — 188',
      detail:
        'O Centro de Valorização da Vida oferece apoio emocional gratuito e sigiloso 24h por telefone ou chat (cvv.org.br), mas não substitui atendimento de emergência.',
    },
  ],
};

export const LIMITATIONS_CONTENT = {
  title: 'O que este resultado pode e não pode dizer?',
  intro:
    'Os questionários PHQ-9 e GAD-7 são ferramentas utilizadas para identificar e acompanhar sintomas relacionados à depressão e à ansiedade. Eles ajudam a organizar informações sobre como você tem se sentido, mas possuem limitações.',
  points: [
    'Eles não estabelecem diagnósticos.',
    'Não substituem uma consulta ou entrevista clínica.',
    'Não conseguem compreender completamente sua história, experiências e circunstâncias de vida.',
    'Uma pontuação elevada não significa necessariamente que você tenha um transtorno.',
    'Uma pontuação baixa não significa que você não esteja sofrendo.',
    'O resultado representa suas respostas referentes às últimas duas semanas, e não necessariamente como você se sentirá no futuro.',
  ],
  gad7Note:
    'No caso do GAD-7, pesquisas demonstram que sua capacidade de identificar transtornos de ansiedade pode variar conforme a população e o contexto de aplicação. Por isso, a interpretação deve sempre considerar outros aspectos da sua saúde e da sua vida.',
  closingHighlight: 'Você é muito mais do que o resultado de um questionário.',
};
