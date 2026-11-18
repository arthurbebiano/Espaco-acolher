import {
  FUNCTIONAL_OPTIONS,
  GAD7_META,
  PHQ9_META,
  type FrequencyValue,
  type FunctionalImpactValue,
} from '../data/instruments';

export type Phq9BandKey =
  | 'minimo'
  | 'leve'
  | 'moderado'
  | 'moderadamente_grave'
  | 'grave';

export type Gad7BandKey = 'minimo' | 'leve' | 'moderado' | 'grave';

export interface ScaleInterpretation<TBand extends string> {
  score: number;
  maxScore: number;
  bandKey: TBand;
  classification: string;
  frequencyDescriptor: string;
  clinicalConduct: string;
  cutoffNote: string;
  plainExplanation: string;
  shortImageSummary: string;
  isAtOrAboveCutoff: boolean;
}

export interface FunctionalInterpretation {
  value: FunctionalImpactValue;
  label: string;
  summary: string;
}

export interface JointInterpretation {
  pattern:
    | 'both_low'
    | 'phq9_elevated_gad7_low'
    | 'gad7_elevated_phq9_low'
    | 'both_elevated';
  title: string;
  paragraphs: string[];
  shortImageSummary: string;
}

export interface NextStepsGuidance {
  tier: 'minimo' | 'leve' | 'moderado' | 'elevado' | 'safety_priority';
  headline: string;
  primaryGuidance: string;
  supportingActions: string[];
  shortImageSummary: string;
}

export interface AssessmentEvaluation {
  phq9: ScaleInterpretation<Phq9BandKey>;
  gad7: ScaleInterpretation<Gad7BandKey>;
  phq9Functional: FunctionalInterpretation;
  gad7Functional: FunctionalInterpretation;
  safetyAlert: boolean;
  item9Value: FrequencyValue;
  joint: JointInterpretation;
  nextSteps: NextStepsGuidance;
}

export function classifyPhq9(score: number): {
  bandKey: Phq9BandKey;
  classification: string;
  frequencyDescriptor: string;
  clinicalConduct: string;
} {
  if (score <= 4) {
    return {
      bandKey: 'minimo',
      classification: 'Sintomas mínimos',
      frequencyDescriptor: 'pouco frequente ou pontual',
      clinicalConduct:
        'Sem indicação de intervenção específica com base apenas no rastreio; acompanhar ou repetir conforme o contexto clínico e pessoal.',
    };
  }
  if (score <= 9) {
    return {
      bandKey: 'leve',
      classification: 'Sintomas leves',
      frequencyDescriptor: 'leve ou ocasional',
      clinicalConduct:
        'Acompanhar os sintomas e observar como eles evoluem ao longo das próximas semanas.',
    };
  }
  if (score <= 14) {
    return {
      bandKey: 'moderado',
      classification: 'Sintomas moderados',
      frequencyDescriptor: 'moderada',
      clinicalConduct:
        'Recomenda-se avaliação clínica aprofundada e consideração de possibilidades de cuidado ou tratamento.',
    };
  }
  if (score <= 19) {
    return {
      bandKey: 'moderadamente_grave',
      classification: 'Sintomas moderadamente graves',
      frequencyDescriptor: 'frequente e significativa',
      clinicalConduct:
        'Considerar cuidado ativo, como psicoterapia, acompanhamento médico ou ambos, conforme avaliação profissional individualizada.',
    };
  }
  return {
    bandKey: 'grave',
    classification: 'Sintomas graves',
    frequencyDescriptor: 'muito frequente e intensa',
    clinicalConduct:
      'Indica necessidade de avaliação clínica prioritária, consideração de tratamento ativo e eventual encaminhamento especializado.',
  };
}

export function classifyGad7(score: number): {
  bandKey: Gad7BandKey;
  classification: string;
  frequencyDescriptor: string;
  clinicalConduct: string;
} {
  if (score <= 4) {
    return {
      bandKey: 'minimo',
      classification: 'Sintomas mínimos',
      frequencyDescriptor: 'pouco frequente ou pontual',
      clinicalConduct:
        'Sem indicação de intervenção específica com base apenas no rastreio.',
    };
  }
  if (score <= 9) {
    return {
      bandKey: 'leve',
      classification: 'Sintomas leves',
      frequencyDescriptor: 'leve ou ocasional',
      clinicalConduct:
        'Monitorar os sintomas e observar como essas experiências evoluem no seu cotidiano.',
    };
  }
  if (score <= 14) {
    return {
      bandKey: 'moderado',
      classification: 'Sintomas moderados',
      frequencyDescriptor: 'moderada',
      clinicalConduct:
        'Recomenda-se avaliação adicional com profissional de saúde e consideração de tratamento, se necessário.',
    };
  }
  return {
    bandKey: 'grave',
    classification: 'Sintomas graves',
    frequencyDescriptor: 'muito frequente e intensa',
    clinicalConduct:
      'Indica importância de avaliação clínica aprofundada e consideração de cuidado ativo.',
  };
}

export function interpretFunctionalImpact(
  value: FunctionalImpactValue
): FunctionalInterpretation {
  const found =
    FUNCTIONAL_OPTIONS.find((opt) => opt.value === value) ??
    FUNCTIONAL_OPTIONS[0];
  return {
    value: found.value,
    label: found.label,
    summary: `Você relatou que essas dificuldades tornaram o trabalho, as tarefas em casa ou o convívio com outras pessoas ${found.label.toLowerCase()}.`,
  };
}

export function evaluateAssessment(params: {
  phq9Answers: FrequencyValue[];
  phq9Functional: FunctionalImpactValue;
  gad7Answers: FrequencyValue[];
  gad7Functional: FunctionalImpactValue;
}): AssessmentEvaluation {
  const { phq9Answers, phq9Functional, gad7Answers, gad7Functional } = params;

  if (phq9Answers.length !== 9) {
    throw new Error('O questionário PHQ-9 exige exatamente 9 respostas.');
  }
  if (gad7Answers.length !== 7) {
    throw new Error('O questionário GAD-7 exige exatamente 7 respostas.');
  }

  const phq9Score = phq9Answers.reduce<number>((sum, val) => sum + val, 0);
  const gad7Score = gad7Answers.reduce<number>((sum, val) => sum + val, 0);

  const item9Value = phq9Answers[8];
  const safetyAlert = item9Value > 0;

  const phq9Class = classifyPhq9(phq9Score);
  const gad7Class = classifyGad7(gad7Score);

  const phq9CutoffNote =
    phq9Score >= 10
      ? 'Pontuações a partir de 10 costumam ser usadas como sinal de alerta no rastreamento de quadros depressivos, mas não estabelecem diagnóstico por si só.'
      : 'Na prática clínica, o ponto de corte de 10 ou mais costuma ser usado como referência de rastreamento, sempre avaliado junto à história da pessoa.';

  const phq9PlainExplanation = safetyAlert
    ? `Neste questionário, sua pontuação total foi de ${phq9Score} pontos, dentro da faixa de ${phq9Class.classification.toLowerCase()}. Ainda assim, como você indicou pensamentos sobre morte ou sobre se machucar, a pontuação total não deve ser interpretada como suficiente para avaliar sua segurança ou tranquilizar a situação. Esse resultado não define quem você é, mas sinaliza a importância de uma conversa cuidadosa com um profissional preparado para acolher você.`
    : `Neste questionário, sua pontuação foi de ${phq9Score} pontos, dentro da faixa de ${phq9Class.classification.toLowerCase()}. Isso sugere uma frequência ${phq9Class.frequencyDescriptor} de dificuldades relacionadas ao humor, interesse, energia, sono e outros aspectos avaliados. Esse resultado não significa, por si só, que você tenha depressão; ele ajuda a observar com mais atenção como você tem se sentido considerando sua história e seu momento de vida.`;

  const phq9ShortImageSummary = safetyAlert
    ? `Faixa: ${phq9Class.classification}. Atenção: resposta positiva no item 9 requer conversa direta sobre segurança com um profissional.`
    : `Faixa: ${phq9Class.classification}. Sugere presença ${phq9Class.frequencyDescriptor} de sintomas ligados a humor, sono e energia nas últimas 2 semanas.`;

  const gad7CutoffNote =
    gad7Score >= 10
      ? 'Pontuações a partir de 10 costumam ser utilizadas como referência no rastreamento de ansiedade generalizada, mas não substituem uma avaliação clínica.'
      : 'O ponto de corte de 10 ou mais costuma ser utilizado como referência no rastreamento clínico de ansiedade generalizada, sem caráter diagnóstico.';

  const gad7PlainExplanation = `Neste questionário, sua pontuação foi de ${gad7Score} pontos, dentro da faixa de ${gad7Class.classification.toLowerCase()}. Suas respostas sugerem que você pode estar vivenciando preocupações, tensão ou inquietação com uma frequência ${gad7Class.frequencyDescriptor}. Isso não significa automaticamente que você tenha um transtorno de ansiedade; o resultado funciona como um sinal para compreender melhor como essas experiências têm afetado seu dia a dia.`;

  const gad7ShortImageSummary = `Faixa: ${gad7Class.classification}. Sugere vivência ${gad7Class.frequencyDescriptor} de preocupação, tensão ou inquietação nas últimas 2 semanas.`;

  const phq9Eval: ScaleInterpretation<Phq9BandKey> = {
    score: phq9Score,
    maxScore: PHQ9_META.maxScore,
    bandKey: phq9Class.bandKey,
    classification: phq9Class.classification,
    frequencyDescriptor: phq9Class.frequencyDescriptor,
    clinicalConduct: safetyAlert
      ? 'Priorizar conversa direta com profissional de saúde para acolhimento e avaliação cuidadosa de segurança, independentemente da pontuação total.'
      : phq9Class.clinicalConduct,
    cutoffNote: phq9CutoffNote,
    plainExplanation: phq9PlainExplanation,
    shortImageSummary: phq9ShortImageSummary,
    isAtOrAboveCutoff: phq9Score >= 10,
  };

  const gad7Eval: ScaleInterpretation<Gad7BandKey> = {
    score: gad7Score,
    maxScore: GAD7_META.maxScore,
    bandKey: gad7Class.bandKey,
    classification: gad7Class.classification,
    frequencyDescriptor: gad7Class.frequencyDescriptor,
    clinicalConduct: gad7Class.clinicalConduct,
    cutoffNote: gad7CutoffNote,
    plainExplanation: gad7PlainExplanation,
    shortImageSummary: gad7ShortImageSummary,
    isAtOrAboveCutoff: gad7Score >= 10,
  };

  const phq9Elevated = phq9Score >= 10;
  const gad7Elevated = gad7Score >= 10;

  let joint: JointInterpretation;
  if (!phq9Elevated && !gad7Elevated) {
    if (safetyAlert) {
      joint = {
        pattern: 'both_low',
        title: 'Olhar integrado e prioridade de acolhimento',
        paragraphs: [
          'Embora as pontuações totais dos dois questionários não tenham atingido as faixas mais elevadas, a presença de pensamentos sobre morte ou sobre se machucar torna indispensável um olhar atento e uma conversa direta com um profissional de saúde.',
          'Uma pontuação baixa na soma geral nunca deve esconder ou minimizar esse tipo de sofrimento. Seus sentimentos merecem escuta e cuidado individualizado.',
        ],
        shortImageSummary:
          'Mesmo sem elevação na soma das duas escalas, a sinalização de segurança no PHQ-9 indica necessidade de conversa direta com profissional de saúde.',
      };
    } else {
      joint = {
        pattern: 'both_low',
        title: 'Equilíbrio atual sem elevação significativa nas escalas',
        paragraphs: [
          'Observando os dois questionários juntos, suas pontuações ficaram nas faixas mais baixas, sem elevação significativa simultânea nos indicadores de humor e ansiedade.',
          'Ainda assim, ausência de pontuação elevada não significa ausência de sofrimento emocional. Uma pontuação não consegue contar toda a sua história — seus sentimentos merecem atenção sempre que algo pesar no cotidiano.',
        ],
        shortImageSummary:
          'Sem elevação significativa simultânea nas duas escalas; lembre-se de que pontuações baixas não invalidam o que você sente no cotidiano.',
      };
    }
  } else if (phq9Elevated && !gad7Elevated) {
    joint = {
      pattern: 'phq9_elevated_gad7_low',
      title: 'Maior peso em aspectos ligados ao humor e à energia',
      paragraphs: [
        'Quando olhamos para os dois resultados em conjunto, suas respostas apontam mais dificuldades relacionadas ao humor, disposição, sono e prazer nas atividades do que sintomas ansiosos intensos.',
        'Esses resultados não formam um diagnóstico, mas oferecem um ponto de partida claro para conversar sobre como sua energia e seu bem-estar emocional vêm sendo afetados.',
      ],
      shortImageSummary:
        'As respostas apontam mais dificuldades relacionadas ao humor, sono e energia (PHQ-9) em comparação com sintomas ansiosos.',
    };
  } else if (!phq9Elevated && gad7Elevated) {
    joint = {
      pattern: 'gad7_elevated_phq9_low',
      title: 'Maior peso em preocupação, tensão e inquietação',
      paragraphs: [
        'Em conjunto, suas respostas apontam com mais força para dificuldades ligadas à preocupação contínua, tensão física e dificuldade de relaxar, com menor impacto nos itens de humor avaliados pelo PHQ-9.',
        'Esse contraste ajuda você e um profissional de saúde a compreenderem melhor por onde o cansaço emocional tem aparecido no seu dia a dia.',
      ],
      shortImageSummary:
        'As respostas apontam mais dificuldades relacionadas à preocupação, tensão e inquietação (GAD-7) nas últimas duas semanas.',
    };
  } else {
    joint = {
      pattern: 'both_elevated',
      title: 'Sintomas de humor e ansiedade acontecendo ao mesmo tempo',
      paragraphs: [
        'Suas respostas mostram elevação tanto nos indicadores ligados ao humor e à energia quanto nos ligados à preocupação e à tensão. É comum que essas duas dimensões caminhem juntas e se retroalimentem no cotidiano.',
        'Por isso, vale olhar para esse conjunto com cuidado clínico, considerando sua rotina, seu contexto de vida e formas de apoio que façam sentido para você.',
      ],
      shortImageSummary:
        'Sintomas ligados ao humor e à ansiedade aparecem elevados simultaneamente e merecem atenção clínica cuidadosa.',
    };
  }

  const maxFunctionalIsSevere =
    phq9Functional === 'muito' ||
    phq9Functional === 'extremamente' ||
    gad7Functional === 'muito' ||
    gad7Functional === 'extremamente';

  let nextSteps: NextStepsGuidance;
  if (safetyAlert) {
    nextSteps = {
      tier: 'safety_priority',
      headline: 'Priorizar conversa de acolhimento e segurança',
      primaryGuidance:
        'Independentemente da sua pontuação total, a resposta positiva sobre pensamentos de morte ou de se machucar torna muito importante conversar diretamente com um profissional de saúde preparado para acolher você.',
      supportingActions: [
        'Procure agendar ou conversar o quanto antes com um médico, psicólogo ou equipe da Unidade Básica de Saúde (UBS) de referência.',
        'Se perceber risco imediato de se machucar ou não conseguir se manter segura, busque atendimento de emergência (SAMU 192, UPA ou pronto-socorro) e não fique sozinha.',
        'Você também pode buscar apoio emocional gratuito pelo CVV ligando para 188 (lembrando que o serviço não substitui atendimento de emergência).',
      ],
      shortImageSummary:
        'Converse diretamente com um profissional de saúde sobre sua segurança. Em emergência imediata, acione SAMU (192) ou UPA/pronto-socorro.',
    };
  } else if (phq9Score >= 15 || gad7Score >= 15) {
    nextSteps = {
      tier: 'elevado',
      headline: 'Buscar avaliação profissional cuidadosa',
      primaryGuidance:
        'Suas respostas indicam dificuldades frequentes que merecem atenção cuidadosa. Recomendamos procurar avaliação com um profissional de saúde para compreender melhor seus sintomas e discutir possibilidades de cuidado.',
      supportingActions: [
        'Leve este resumo ou compartilhe como tem se sentido nas últimas semanas em uma consulta médica ou psicológica.',
        'Existem diferentes formas de cuidado, que podem ser construídas em conjunto de acordo com suas necessidades e sua rotina.',
        'Se sentir que o sofrimento está difícil de sustentar sozinha, converse com alguém de confiança para acompanhar você nesse passo.',
      ],
      shortImageSummary:
        'Suas respostas indicam dificuldades que merecem atenção cuidadosa. Procure avaliação profissional para discutir possibilidades de cuidado.',
    };
  } else if (phq9Score >= 10 || gad7Score >= 10 || maxFunctionalIsSevere) {
    nextSteps = {
      tier: 'moderado',
      headline: 'Considerar uma avaliação clínica aprofundada',
      primaryGuidance:
        'Vale a pena realizar uma avaliação mais aprofundada com um profissional de saúde mental ou médico de confiança. Uma conversa acolhedora ajuda a entender melhor o que está acontecendo e quais caminhos de cuidado fazem sentido.',
      supportingActions: [
        'Observe quais momentos da semana têm pesado mais no trabalho, em casa ou nas relações.',
        'Este resultado é um ponto de partida para uma conversa, não uma definição sobre você.',
      ],
      shortImageSummary:
        'Vale a pena conversar com um profissional de saúde para compreender melhor seus sintomas e avaliar possibilidades de cuidado.',
    };
  } else if (phq9Score >= 5 || gad7Score >= 5) {
    nextSteps = {
      tier: 'leve',
      headline: 'Acompanhar com gentileza e considerar apoio',
      primaryGuidance:
        'Pode ser interessante conversar sobre essas experiências em um acompanhamento profissional, especialmente se elas estiverem persistindo há semanas ou causando desconforto na rotina.',
      supportingActions: [
        'Observe como seu sono, energia e preocupações evoluem ao longo dos próximos dias.',
        'Se notar aumento do cansaço ou do impacto no dia a dia, não hesite em buscar orientação clínica.',
      ],
      shortImageSummary:
        'Acompanhe a evolução desses sintomas e considere conversar com um profissional caso persistam ou gerem desconforto.',
    };
  } else {
    nextSteps = {
      tier: 'minimo',
      headline: 'Seguir cuidando do seu bem-estar emocional',
      primaryGuidance:
        'Continue observando seu bem-estar emocional. Mesmo quando as pontuações são baixas, é importante respeitar suas emoções e procurar apoio caso perceba mudanças, desgaste ou sofrimento.',
      supportingActions: [
        'Seus sentimentos merecem atenção, independentemente do resultado.',
        'Se desejar, repita esta auto-observação em outro momento ou compartilhe suas percepções em consultas de rotina.',
      ],
      shortImageSummary:
        'Continue observando seu bem-estar e procure apoio profissional sempre que perceber mudanças ou sofrimento.',
    };
  }

  return {
    phq9: phq9Eval,
    gad7: gad7Eval,
    phq9Functional: interpretFunctionalImpact(phq9Functional),
    gad7Functional: interpretFunctionalImpact(gad7Functional),
    safetyAlert,
    item9Value,
    joint,
    nextSteps,
  };
}
