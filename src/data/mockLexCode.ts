import {
  BadgeItem,
  ClozeItem,
  DilemaCase,
  GlossaryTerm,
  LeaderboardEntry,
  MemoramaCardItem,
  QuizModuleCard,
  QuizQuestion,
  TeacherModule,
  TeacherStudent,
} from '@/types/lexcode';

export const INITIAL_DILEMAS: DilemaCase[] = [
  {
    id: 'dilema-1',
    number: 1,
    title: 'Vender datos sin consentimiento?',
    category: 'DILEMA ACTIVO - LEGISLACIÓN',
    subtitle: 'Legislación TI - Análisis del Artículo 6 de la LFPDPPP',
    description:
      'Tu equipo quiere vender datos de sus usuarios sin su permiso para aumentar ingresos. Analiza la decisión y sus implicaciones bajo la LFPDPPP.',
    lawQuote:
      'LFPDPPP Art. 6: Los responsables del tratamiento de datos personales deberán observar los principios de licitud, consentimiento, información y calidad..."',
    status: 'active',
    options: [
      {
        id: 'A',
        text: 'Realizar la venta. El beneficio económico para la empresa es prioridad.',
        isCorrect: false,
        xpDelta: -50,
        feedbackTitle: 'Sanción Legal!',
        feedbackText:
          'Priorizar el beneficio económico sin consentimiento vulnera el Art. 6 de la LFPDPPP. Esto expone a la empresa a demandas millonarias y pérdida de reputación.',
      },
      {
        id: 'B',
        text: 'Negarme y exigir que se obtenga el consentimiento expreso de los usuarios.',
        isCorrect: true,
        xpDelta: 150,
        feedbackTitle: '¡Excelente decisión!',
        feedbackText:
          'Negarse a la venta sin consentimiento expreso cumple con la LFPDPPP, protegiendo tanto la privacidad de los usuarios como a la empresa de severas sanciones legales.',
      },
      {
        id: 'C',
        text: 'Anonimizar los datos de prisa sin validar el método de seguridad.',
        isCorrect: false,
        xpDelta: -30,
        feedbackTitle: 'Riesgo de Reidentificación!',
        feedbackText:
          'Una anonimización deficiente sin validar controles técnicos puede permitir reidentificar a los titulares y generar incidentes de privacidad.',
      },
      {
        id: 'D',
        text: 'Delegar la decisión al equipo de marketing para evitar el conflicto',
        isCorrect: false,
        xpDelta: -25,
        feedbackTitle: 'Responsabilidad Compartida!',
        feedbackText:
          'Evadir la responsabilidad técnica y legal no exime al equipo ni a la organización del cumplimiento normativo.',
      },
    ],
  },
  {
    id: 'dilema-2',
    number: 2,
    title: 'Ocultar una brecha de seguridad',
    category: 'DILEMA ACTIVO - CIBERSEGURIDAD',
    subtitle: 'Ciberseguridad - Notificación de incidentes a usuarios',
    description:
      'Se detectó una filtración de correos y hashes antiguos en un respaldo. Un directivo sugiere esperar hasta después del lanzamiento.',
    lawQuote:
      'LFPDPPP Art. 20: Todo responsable que lleve a cabo un tratamiento de datos personales deberá establecer y mantener medidas de seguridad administrativas, técnicas y físicas.',
    status: 'locked',
    options: [
      {
        id: 'A',
        text: 'Ocultar el incidente hasta terminar el lanzamiento.',
        isCorrect: false,
        xpDelta: -50,
        feedbackTitle: 'Sanción Legal!',
        feedbackText:
          'Retrasar la atención y comunicación de una vulneración crítica agrava el impacto sobre las cuentas de los usuarios.',
      },
      {
        id: 'B',
        text: 'Contener el incidente, rotar credenciales e informar con transparencia.',
        isCorrect: true,
        xpDelta: 150,
        feedbackTitle: '¡Excelente decisión!',
        feedbackText:
          'Actuar con contención inmediata y transparencia protege la integridad del sistema y la confianza de los usuarios.',
      },
      {
        id: 'C',
        text: 'Borrar los logs del servidor para evitar auditorías.',
        isCorrect: false,
        xpDelta: -50,
        feedbackTitle: 'Infracción Grave!',
        feedbackText:
          'Alterar o eliminar evidencia forense impide responder ante incidentes y vulnera las buenas prácticas de auditoría.',
      },
      {
        id: 'D',
        text: 'Esperar a que algún usuario lo reporte primero.',
        isCorrect: false,
        xpDelta: -30,
        feedbackTitle: 'Respuesta Reactiva Insuficiente!',
        feedbackText:
          'Esperar reportes externos retrasa la mitigación de accesos no autorizados.',
      },
    ],
  },
  {
    id: 'dilema-3',
    number: 3,
    title: 'Uso de software sin licencia en produccion',
    category: 'DILEMA ACTIVO - ÉTICA PROFESIONAL',
    subtitle: 'Ética Profesional - Derechos de autor y piratería',
    description:
      'Para entregar un proyecto a tiempo, se propone instalar software comercial crackeado en un entorno de producción.',
    lawQuote:
      'LFDA Art. 101 Bis: Los programas de computación se protegen en los mismos términos que las obras literarias.',
    status: 'locked',
    options: [
      {
        id: 'A',
        text: 'Instalar la versión crackeada temporalmente.',
        isCorrect: false,
        xpDelta: -50,
        feedbackTitle: 'Infracción de Derechos de Autor!',
        feedbackText:
          'El uso de software no licenciado en producción infringe la LFDA y expone a la empresa a contingencias legales y malware.',
      },
      {
        id: 'B',
        text: 'Usar alternativas open source con licencia compatible o licenciamiento válido.',
        isCorrect: true,
        xpDelta: 150,
        feedbackTitle: '¡Excelente decisión!',
        feedbackText:
          'Verificar licencias y optar por herramientas legítimas u open source compatible garantiza legalidad y seguridad.',
      },
      {
        id: 'C',
        text: 'Ocultar el binario dentro de otro contenedor sin documentarlo.',
        isCorrect: false,
        xpDelta: -40,
        feedbackTitle: 'Mala Práctica Ética y Técnica!',
        feedbackText:
          'Enmascarar dependencias sin licencia genera deuda legal grave y riesgos de seguridad en la cadena de suministro.',
      },
      {
        id: 'D',
        text: 'Subir el instalador pirata al repositorio interno.',
        isCorrect: false,
        xpDelta: -35,
        feedbackTitle: 'Riesgo de Seguridad y Legal!',
        feedbackText:
          'Almacenar software no autorizado compromete la integridad del repositorio y la ética profesional.',
      },
    ],
  },
];

export const QUIZ_MODULES: QuizModuleCard[] = [
  {
    id: 'ciberseguridad',
    title: 'Ciberseguridad',
    questionsCount: 10,
    description: 'Phishing, Malware y Redes.',
    xpReward: '+ 450 XP',
    accent: 'cyan',
  },
  {
    id: 'legislacion-ti',
    title: 'Legislacion TI',
    questionsCount: 15,
    description: 'Normativas LFPDPPP.',
    xpReward: '+ 600 XP',
    accent: 'pink',
  },
  {
    id: 'etica-profesional',
    title: 'Etica Profesional',
    questionsCount: 8,
    description: 'Dilemas y buenas practicas.',
    xpReward: '100% Correcto',
    accent: 'muted',
    completedBadge: 'Evaluacion superada',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    moduleTag: 'QUIZ ACTIVO - CIBERSEGURIDAD',
    question: 'Cual es el objetivo de un ataque de Phishing?',
    options: [
      { id: 'A', text: 'Sobrecargar un servidor.' },
      { id: 'B', text: 'Robar credenciales o datos.' },
      { id: 'C', text: 'Desencriptar contrasenas.' },
      { id: 'D', text: 'Infectar hardware fisico.' },
    ],
    correctId: 'B',
    xpCorrect: 150,
    xpWrong: -50,
    explanation:
      'Confundir un ataque DDoS (sobrecarga) con Phishing (robo de identidad) deja a tus usuarios vulnerables al fraude.',
  },
  {
    id: 'q2',
    moduleTag: 'QUIZ ACTIVO - CIBERSEGURIDAD',
    question: 'Cual es el protocolo cifrado estandar recomendado para conexiones seguras web?',
    options: [
      { id: 'A', text: 'HTTP 1.0 sin TLS.' },
      { id: 'B', text: 'HTTPS / TLS 1.3.' },
      { id: 'C', text: 'FTP / Telnet.' },
      { id: 'D', text: 'SNMP v1 en texto plano.' },
    ],
    correctId: 'B',
    xpCorrect: 150,
    xpWrong: -50,
    explanation:
      'HTTPS sobre TLS 1.3 cifra el canal en tránsito, autentica el servidor y reduce latencia y algoritmos obsoletos.',
  },
  {
    id: 'q3',
    moduleTag: 'QUIZ ACTIVO - CIBERSEGURIDAD',
    question: 'Que herramienta de analisis de puertos permite auditar servicios activos en una red?',
    options: [
      { id: 'A', text: 'Nmap.' },
      { id: 'B', text: 'Figma.' },
      { id: 'C', text: 'Prettier.' },
      { id: 'D', text: 'Markdown.' },
    ],
    correctId: 'A',
    xpCorrect: 150,
    xpWrong: -50,
    explanation:
      'Nmap permite descubrir hosts, puertos abiertos y versiones de servicios para evaluar la superficie expuesta.',
  },
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Regina Calderon', xp: 9850 },
  { rank: 2, name: 'Ian Mauricio Morales (Tu)', xp: 9120, isCurrentUser: true },
  { rank: 3, name: 'Luvia Magali', xp: 8400 },
];

export const MEMORAMA_CARDS: MemoramaCardItem[] = [
  {
    id: 'm1',
    pairId: 'p1',
    side: 'concept',
    content: 'Datos Sensibles',
  },
  {
    id: 'm2',
    pairId: 'p2',
    side: 'concept',
    content: 'Artículo 101 Bis',
  },
  {
    id: 'm3',
    pairId: 'p3',
    side: 'concept',
    content: 'Aviso de Privacidad',
  },
  {
    id: 'm4',
    pairId: 'p1',
    side: 'definition',
    content: 'Informacion que afecta la esfera mas intima del titular.',
  },
  {
    id: 'm5',
    pairId: 'p4',
    side: 'concept',
    content: 'Derechos ARCO',
  },
  {
    id: 'm6',
    pairId: 'p2',
    side: 'definition',
    content: 'Protección legal de software y programas de cómputo.',
  },
  {
    id: 'm7',
    pairId: 'p3',
    side: 'definition',
    content: 'Documento que informa cómo se tratan los datos personales.',
  },
  {
    id: 'm8',
    pairId: 'p4',
    side: 'definition',
    content: 'Acceso, Rectificación, Cancelación y Oposición de datos.',
  },
];

export const CLOZE_ITEMS: ClozeItem[] = [
  {
    id: 'c1',
    ruleTitle: 'Completar la Norma (Articulo 3 LFPDPPP)',
    prefix: 'Los datos personales',
    suffix: 'son aquellos que afectan la esfera mas intima de su titular.',
    answer: 'Sensibles',
    options: ['Publicos', 'Sensibles', 'Financieros', 'Biometricos'],
  },
  {
    id: 'c2',
    ruleTitle: 'Completar la Norma (Seguridad de Datos)',
    prefix: 'El responsable deberá implementar medidas de seguridad administrativas, técnicas y',
    suffix: 'para proteger los datos.',
    answer: 'Físicas',
    options: ['Públicas', 'Físicas', 'Opcionales', 'Temporales'],
  },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'datos-personales',
    letter: 'D',
    category: 'CONCEPTO - LEGISLACIÓN',
    term: 'DATOS PERSONALES',
    definition:
      'Cualquier información concerniente a una persona física identificada o identificable, como nombre, correo, matrícula, ubicación o identificadores digitales.',
    legalRef:
      'Art. 3, Frac. V de la LFPDPPP. Ley Federal de Protección de Datos Personales en Posesión de los Particulares.',
    lexisTip: '¡Recuerda! Identificar a alguien de forma indirecta también cuenta como dato personal.',
  },
  {
    id: 'datos-personales-sensibles',
    letter: 'D',
    category: 'CONCEPTO - LEGISLACIÓN',
    term: 'DATOS PERSONALES SENSIBLES',
    definition:
      'Aquellos que afecten a la esfera más íntima de su titular, o cuya utilización indebida pueda dar origen a discriminación o conlleve un riesgo grave para este. En particular, se consideran sensibles aquellos que puedan revelar aspectos como origen racial o étnico, estado de salud presente y futuro, información genética, creencias religiosas, filosóficas y morales, afiliación sindical, opiniones políticas, preferencias sexuales.',
    legalRef:
      'Art. 3, Frac. VI de la LFPDPPP. Ley Federal de Protección de Datos Personales de los Particulares',
    lexisTip:
      '¡Recuerda! El tratamiento de estos datos requiere consentimiento expreso y por escrito del titular',
  },
  {
    id: 'derechos-acceso',
    letter: 'D',
    category: 'CONCEPTO - LEGISLACIÓN',
    term: 'DERECHOS DE ACCESO',
    definition:
      'Facultad del titular de solicitar al responsable qué datos personales suyos están en posesión de la organización y cómo están siendo tratados.',
    legalRef: 'LFPDPPP · Derechos ARCO',
    lexisTip: '¡Recuerda! Todo usuario tiene derecho a saber qué información suya almacena tu sistema.',
  },
  {
    id: 'derechos-arco',
    letter: 'D',
    category: 'CONCEPTO - LEGISLACIÓN',
    term: 'DERECHOS ARCO',
    definition:
      'Conjunto de derechos de Acceso, Rectificación, Cancelación y Oposición que permiten al titular controlar sus datos personales.',
    legalRef: 'Capítulo IV de la LFPDPPP',
    lexisTip: '¡Recuerda! Diseña flujos claros para que los usuarios puedan ejercer sus derechos ARCO.',
  },
  {
    id: 'dilema-etico',
    letter: 'D',
    category: 'CONCEPTO - ÉTICA',
    term: 'DILEMA ÉTICO',
    definition:
      'Situación en la que entran en conflicto dos o más principios, valores o deberes profesionales y no existe una salida trivial sin consecuencias.',
    legalRef: 'Código de Ética Profesional IEEE / ACM',
    lexisTip: '¡Recuerda! Evalúa siempre el impacto en las personas antes de priorizar velocidad o métricas.',
  },
];

export const BADGES_LIST: BadgeItem[] = [
  {
    id: 'b1',
    title: 'Quiz completado',
    earned: true,
    variant: 'check_ribbon',
    meta: '10 oct · Obtenido',
  },
  {
    id: 'b2',
    title: 'Quiz ganado',
    earned: true,
    variant: 'star_laurel',
    meta: 'Hoy · Obtenido',
  },
  {
    id: 'b3',
    title: 'Guardián de datos',
    earned: true,
    variant: 'check_ribbon',
    meta: 'Obtenido',
  },
  {
    id: 'b4',
    title: 'Maestro Ético',
    earned: true,
    variant: 'star_laurel',
    meta: 'Obtenido ayer',
  },
  {
    id: 'b5',
    title: 'Racha de 14 días',
    earned: false,
    variant: 'flame_lock',
  },
  {
    id: 'b6',
    title: 'Auditor invicto',
    earned: false,
    variant: 'doc_lock',
  },
  {
    id: 'b7',
    title: 'Experto LFPDPPP',
    earned: false,
    variant: 'flame_lock',
  },
  {
    id: 'b8',
    title: 'Defensor digital',
    earned: false,
    variant: 'doc_lock',
  },
];

export const INITIAL_TEACHER_STUDENTS: TeacherStudent[] = [
  {
    id: 's1',
    name: 'Diana Hernández Gómez',
    matricula: 'UP240192',
    currentModule: 'Módulo 3: Dilemas Éticos',
    average: 94.5,
    status: 'Activo',
    group: 'TIID-7A',
  },
  {
    id: 's2',
    name: 'Kevin Mauricio Morales',
    matricula: 'UP240145',
    currentModule: 'Módulo 4: Ciberseguridad',
    average: 91.0,
    status: 'Activo',
    group: 'TIID-7A',
  },
  {
    id: 's3',
    name: 'Sofía Ramírez Cruz',
    matricula: 'UP240210',
    currentModule: 'Módulo 2: LFPDPPP',
    average: 82.0,
    status: 'Activo',
    group: 'TIID-7B',
  },
  {
    id: 's4',
    name: 'Alejandro Vázquez Ruiz',
    matricula: 'UP240088',
    currentModule: 'Módulo 1: Introducción',
    average: 74.5,
    status: 'Pendiente',
    group: 'TIID-7B',
  },
];

export const INITIAL_TEACHER_MODULES: TeacherModule[] = [
  {
    id: 'mod-1',
    order: '01',
    name: 'Módulo 1: Introducción',
    standard: 'Fundamentos y Marco General',
    enrolledCount: 42,
    interactionType: 'Opción Múltiple (Reactivos Teóricos)',
    clozeItems: [],
    memoramaPairs: [],
    quizQuestions: [],
  },
  {
    id: 'mod-2',
    order: '02',
    name: 'Módulo 2: LFPDPPP',
    standard: 'Protección de Datos Personales',
    enrolledCount: 38,
    interactionType: 'Completar Palabras (Espacios en Blanco)',
    clozeItems: [
      {
        id: 'cl-1',
        template:
          'Todo tratamiento de datos personales debe estar sujeto al consentimiento [tácito o expreso].',
      },
      {
        id: 'cl-2',
        template:
          'El responsable deberá implementar medidas de seguridad administrativas y [físicas].',
      },
      {
        id: 'cl-3',
        template:
          'Los datos personales sensibles afectan la esfera más íntima de su [titular].',
      },
    ],
    memoramaPairs: [],
    quizQuestions: [],
  },
  {
    id: 'mod-3',
    order: '03',
    name: 'Módulo 3: Dilemas Éticos',
    standard: 'LFDA y Propiedad Intelectual',
    enrolledCount: 35,
    interactionType: 'Memorama (Conexiones Legales)',
    clozeItems: [],
    memoramaPairs: [
      {
        id: 'mp-1',
        concept: 'Artículo 101 Bis (LFDA)',
        definition: 'Protección legal de software y compilados',
      },
      {
        id: 'mp-2',
        concept: 'Secreto Industrial',
        definition: 'Información confidencial de valor comercial',
      },
      {
        id: 'mp-3',
        concept: 'Aviso de Privacidad',
        definition: 'Documento físico o electrónico sobre uso de datos',
      },
    ],
    quizQuestions: [],
  },
];
