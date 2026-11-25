import {
  BadgeItem,
  ClozeItem,
  DilemaCase,
  GlossaryTerm,
  LeaderboardEntry,
  MemoramaCard,
  QuizQuestion,
  TeacherModule,
  TeacherStudent,
} from '@/types/lexcode';

export const INITIAL_DILEMAS: DilemaCase[] = [
  {
    id: 'dilema-1',
    number: 1,
    title: '¿Vender datos sin consentimiento?',
    subtitle: 'Privacidad de datos · LFPDPPP',
    category: 'LEGISLACIÓN · LFPDPPP',
    status: 'active',
    description:
      'Tu equipo quiere vender los datos de sus usuarios sin su permiso para aumentar ingresos. Analiza la decisión y sus implicaciones bajo la LFPDPPP.',
    lawQuote:
      'El responsable del tratamiento de datos personales deberá obtener el consentimiento expreso del titular cuando se trate de transferencia de datos a terceros no afiliados.',
    options: [
      {
        id: 'A',
        text: 'Exportar la base en CSV y enviarla a un broker externo sin avisar',
        isCorrect: false,
        xpDelta: -50,
        feedbackTitle: 'Infraccion de seguridad!',
        feedbackText:
          'Transferir datos personales sin consentimiento vulnera la LFPDPPP y expone a sanciones administrativas y daño reputacional.',
      },
      {
        id: 'B',
        text: 'Solicitar consentimiento expreso e informar en el Aviso de Privacidad',
        isCorrect: true,
        xpDelta: 150,
        feedbackTitle: '¡Decisión ética y legal!',
        feedbackText:
          'Cumples con los principios de licitud, información y consentimiento de la LFPDPPP antes de compartir datos.',
      },
      {
        id: 'C',
        text: 'Ocultar la transferencia en una cláusula ambigua al final del contrato',
        isCorrect: false,
        xpDelta: -50,
        feedbackTitle: 'Infraccion de seguridad!',
        feedbackText:
          'El consentimiento debe ser libre, específico e informado; las cláusulas ambiguas no validan el tratamiento.',
      },
      {
        id: 'D',
        text: 'Compartir correos y teléfonos a cambio de acceso anticipado a otra app',
        isCorrect: false,
        xpDelta: -25,
        feedbackTitle: 'Riesgo de privacidad!',
        feedbackText:
          'Condicionar o transferir datos personales sin autorización clara infringe la normativa de protección de datos.',
      },
    ],
  },
  {
    id: 'dilema-2',
    number: 2,
    title: 'Un acceso que no te corresponde',
    subtitle: 'Control de accesos · Ética en TI',
    category: 'ÉTICA · CIBERSEGURIDAD',
    status: 'locked',
    description:
      'Durante una migración de base de datos obtienes credenciales de producción de otra área. ¿Cómo debes actuar?',
    lawQuote:
      'El acceso no autorizado o fuera del ámbito de funciones asignadas compromete la confidencialidad e integridad de los sistemas.',
    options: [
      {
        id: 'A',
        text: 'Notificar al responsable de seguridad y revocar o aislar el acceso',
        isCorrect: true,
        xpDelta: 150,
        feedbackTitle: '¡Actuación responsable!',
        feedbackText:
          'Reportar el exceso de privilegios protege la integridad del sistema y respeta el principio de mínimo privilegio.',
      },
      {
        id: 'B',
        text: 'Conservar las credenciales por si necesitas consultar algo rápido luego',
        isCorrect: false,
        xpDelta: -50,
        feedbackTitle: 'Infraccion de seguridad!',
        feedbackText:
          'Mantener accesos no autorizados viola el principio de mínimo privilegio y políticas de seguridad.',
      },
      {
        id: 'C',
        text: 'Descargar registros para analizarlos en tu equipo personal',
        isCorrect: false,
        xpDelta: -50,
        feedbackTitle: 'Infraccion de seguridad!',
        feedbackText:
          'Extraer información a dispositivos no autorizados representa una fuga potencial de datos.',
      },
      {
        id: 'D',
        text: 'Ignorarlo sin dejar registro ni avisar a nadie',
        isCorrect: false,
        xpDelta: -25,
        feedbackTitle: 'Riesgo operativo!',
        feedbackText:
          'Sin reporte oportuno, la vulnerabilidad de control de accesos puede permanecer abierta.',
      },
    ],
  },
  {
    id: 'dilema-3',
    number: 3,
    title: 'Software propietario sin licencia',
    subtitle: 'Propiedad intelectual · LFDA',
    category: 'LEGISLACIÓN · LFDA',
    status: 'locked',
    description:
      'Para entregar un proyecto a tiempo, un compañero propone usar un compilador o herramienta comercial crackeada.',
    lawQuote:
      'Los programas de cómputo están protegidos por la Ley Federal del Derecho de Autor en los mismos términos que las obras literarias.',
    options: [
      {
        id: 'A',
        text: 'Rechazar el uso no autorizado y proponer alternativas licenciadas u open source',
        isCorrect: true,
        xpDelta: 150,
        feedbackTitle: '¡Correcto!',
        feedbackText:
          'Respetar las licencias de software evita infracciones a la LFDA y riesgos legales para la organización.',
      },
      {
        id: 'B',
        text: 'Usarlo solo en entorno local mientras dura el desarrollo',
        isCorrect: false,
        xpDelta: -50,
        feedbackTitle: 'Infraccion legal!',
        feedbackText:
          'El uso de software sin licencia constituye una infracción en materia de derechos de autor.',
      },
      {
        id: 'C',
        text: 'Incluir el parche en el repositorio del cliente',
        isCorrect: false,
        xpDelta: -50,
        feedbackTitle: 'Infraccion grave!',
        feedbackText:
          'Distribuir o incorporar software no licenciado compromete legalmente al equipo y al cliente.',
      },
      {
        id: 'D',
        text: 'No documentar la herramienta utilizada en la entrega final',
        isCorrect: false,
        xpDelta: -25,
        feedbackTitle: 'Falta de trazabilidad!',
        feedbackText:
          'La transparencia en dependencias y licencias es clave en ingeniería de software.',
      },
    ],
  },
  {
    id: 'dilema-4',
    number: 4,
    title: 'Reporte de vulnerabilidad crítica',
    subtitle: 'Divulgación responsable · Ciberseguridad',
    category: 'CIBERSEGURIDAD · ÉTICA',
    status: 'locked',
    description:
      'Detectas un endpoint expuesto que permite consultar perfiles sin autenticación antes de un lanzamiento.',
    lawQuote:
      'La prevención y notificación oportuna de vulnerabilidades reducen el impacto de incidentes de seguridad.',
    options: [
      {
        id: 'A',
        text: 'Reportarlo de inmediato al equipo técnico y documentar la remediación',
        isCorrect: true,
        xpDelta: 150,
        feedbackTitle: '¡Excelente criterio!',
        feedbackText:
          'Actuar con diligencia y confidencialidad protege a los usuarios antes de exponer el fallo.',
      },
      {
        id: 'B',
        text: 'Publicar la prueba de concepto en redes antes de avisar',
        isCorrect: false,
        xpDelta: -50,
        feedbackTitle: 'Infraccion de seguridad!',
        feedbackText:
          'Exponer una vulnerabilidad sin dar margen de corrección facilita su explotación maliciosa.',
      },
      {
        id: 'C',
        text: 'Esperar a que ocurra algún incidente real para priorizarlo',
        isCorrect: false,
        xpDelta: -50,
        feedbackTitle: 'Riesgo elevado!',
        feedbackText:
          'La seguridad proactiva exige corregir fallos críticos antes de su explotación.',
      },
      {
        id: 'D',
        text: 'Probar extracción masiva de datos para demostrar el impacto',
        isCorrect: false,
        xpDelta: -25,
        feedbackTitle: 'Riesgo innecesario!',
        feedbackText:
          'Validar el fallo no requiere comprometer ni extraer datos sensibles.',
      },
    ],
  },
];

export const QUIZ_MODULES = [
  {
    id: 'ciberseguridad',
    title: 'Ciberseguridad',
    questionsCount: 10,
    description: 'Vulnerabilidades, cifrado y respuesta a incidentes.',
    xpReward: '+ 450 XP',
    completedBadge: null,
    accent: 'cyan' as const,
  },
  {
    id: 'legislacion',
    title: 'Legislación TI',
    questionsCount: 15,
    description: 'Derechos ARCO, propiedad intelectual y LFPDPPP.',
    xpReward: 'Completado (600 XP)',
    completedBadge: 'Completado (600 XP)',
    accent: 'pink' as const,
  },
  {
    id: 'etica',
    title: 'Ética Profesional',
    questionsCount: 8,
    description: 'Código de conducta y responsabilidad algorítmica.',
    xpReward: '+ 320 XP',
    completedBadge: null,
    accent: 'muted' as const,
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    moduleTag: 'MÓDULO: CIBERSEGURIDAD',
    question: '¿Qué es un ataque de Phishing?',
    options: [
      { id: 'A', text: 'Un virus que daña el hardware' },
      { id: 'B', text: 'Engaño para robar credenciales' },
      { id: 'C', text: 'Un tipo de firewall avanzado' },
      { id: 'D', text: 'Cifrado de extremo a extremo' },
    ],
    correctId: 'B',
    xpCorrect: 150,
    xpWrong: -50,
    explanation:
      'El Phishing utiliza engaños o suplantación de identidad para que la víctima entregue contraseñas o datos sensibles.',
  },
  {
    id: 'q-2',
    moduleTag: 'MÓDULO: CIBERSEGURIDAD',
    question: '¿Qué principio establece dar solo los permisos mínimos necesarios?',
    options: [
      { id: 'A', text: 'Mínimo privilegio' },
      { id: 'B', text: 'Disponibilidad abierta' },
      { id: 'C', text: 'Repudio de origen' },
      { id: 'D', text: 'Ofuscación por defecto' },
    ],
    correctId: 'A',
    xpCorrect: 150,
    xpWrong: -50,
    explanation:
      'El principio de mínimo privilegio limita el acceso de cada usuario o proceso únicamente a lo indispensable para su tarea.',
  },
  {
    id: 'q-3',
    moduleTag: 'MÓDULO: LEGISLACIÓN TI',
    question: '¿Qué significan las siglas ARCO en protección de datos?',
    options: [
      { id: 'A', text: 'Acceso, Rectificación, Cancelación y Oposición' },
      { id: 'B', text: 'Auditoría, Registro, Control y Operación' },
      { id: 'C', text: 'Autenticación, Respaldo, Cifrado y Origen' },
      { id: 'D', text: 'Autorización, Revisión, Copia y Olvido' },
    ],
    correctId: 'A',
    xpCorrect: 150,
    xpWrong: -50,
    explanation:
      'Los derechos ARCO garantizan al titular el control sobre sus datos personales en posesión de un responsable.',
  },
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Elena Rostova', xp: 2950 },
  { rank: 2, name: 'Carlos Mendoza', xp: 2720 },
  { rank: 3, name: 'Regina Calderón', xp: 2450, isCurrentUser: true },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'datos-personales-sensibles',
    letter: 'D',
    term: 'DATOS PERSONALES SENSIBLES',
    category: 'LFPDPPP · ARTÍCULO 3',
    definition:
      'Aquellos datos personales que afecten a la esfera más íntima de su titular, o cuya utilización indebida pueda dar origen a discriminación o conlleve un riesgo grave para éste. En particular, se consideran sensibles aquellos que puedan revelar aspectos como origen racial o étnico, estado de salud presente y futuro, información genética, creencias religiosas, filosóficas y morales, afiliación sindical, opiniones políticas, preferencia sexual.',
    legalRef:
      'De acuerdo con la LFPDPPP, su tratamiento requiere consentimiento expreso y por escrito del titular, salvo excepciones legales.',
    lexisTip:
      'Tip de Lexis: Nunca guardes datos sensibles en logs ni los compartas sin consentimiento expreso.',
  },
  {
    id: 'derechos-arco',
    letter: 'D',
    term: 'DERECHOS ARCO',
    category: 'LFPDPPP · PROTECCIÓN DE DATOS',
    definition:
      'Conjunto de derechos del titular de datos personales para solicitar Acceso a sus datos, su Rectificación cuando sean inexactos o incompletos, su Cancelación cuando considere que no se requieren para las finalidades señaladas, u Oponerse al tratamiento por causa legítima.',
    legalRef:
      'Todo responsable debe establecer un procedimiento sencillo y gratuito para atender solicitudes ARCO en los plazos de ley.',
    lexisTip:
      'Tip de Lexis: Diseña tus sistemas pensando en cómo exportar, corregir o eliminar los datos de un usuario.',
  },
  {
    id: 'consentimiento-expreso',
    letter: 'C',
    term: 'CONSENTIMIENTO EXPRESO',
    category: 'LFPDPPP · PRINCIPIOS',
    definition:
      'Manifestación de la voluntad del titular de manera inequívoca —por escrito, de forma verbal, por medios electrónicos o cualquier otra tecnología— para autorizar el tratamiento o transferencia de sus datos personales.',
    legalRef:
      'Es obligatorio cuando la ley lo exige o cuando se trata de datos personales sensibles.',
    lexisTip:
      'Tip de Lexis: Las casillas premarcadas no constituyen un consentimiento válido.',
  },
  {
    id: 'lfda-software',
    letter: 'L',
    term: 'LFDA Y PROGRAMAS DE CÓMPUTO',
    category: 'PROPIEDAD INTELECTUAL · LFDA',
    definition:
      'La Ley Federal del Derecho de Autor protege los programas de cómputo en los mismos términos que las obras literarias, resguardando tanto su código fuente como su código objeto.',
    legalRef:
      'El uso, reproducción o distribución sin autorización del titular de derechos puede acarrear sanciones.',
    lexisTip:
      'Tip de Lexis: Verifica siempre el tipo de licencia antes de integrar librerías o herramientas.',
  },
];

export const BADGES_LIST: BadgeItem[] = [
  {
    id: 'b-1',
    title: 'Guardián de Privacidad',
    earned: true,
    meta: 'Completado el 15 Oct',
    theme: 'cyan',
  },
  {
    id: 'b-2',
    title: 'Maestro Ético',
    earned: true,
    meta: 'Nivel 5 alcanzado',
    theme: 'yellow',
  },
  {
    id: 'b-3',
    title: 'Cazador de Vulnerabilidades',
    earned: true,
    meta: 'Racha de 7 días',
    theme: 'blue',
  },
  {
    id: 'b-4',
    title: 'Experto en LFPDPPP',
    earned: true,
    meta: '100% en Módulo Legal',
    theme: 'purple',
  },
  {
    id: 'b-5',
    title: 'Auditor Senior',
    earned: false,
    meta: 'Bloqueado',
    theme: 'locked',
  },
  {
    id: 'b-6',
    title: 'Defensor de Derechos ARCO',
    earned: false,
    meta: 'Bloqueado',
    theme: 'locked',
  },
  {
    id: 'b-7',
    title: 'Arquitecto de Confianza',
    earned: false,
    meta: 'Bloqueado',
    theme: 'locked',
  },
  {
    id: 'b-8',
    title: 'Leyenda LexCode',
    earned: false,
    meta: 'Bloqueado',
    theme: 'locked',
  },
];

export const MEMORAMA_CARDS: MemoramaCard[] = [
  {
    id: 'm1',
    pairId: 'p1',
    side: 'concept',
    content: 'Phishing',
  },
  {
    id: 'm2',
    pairId: 'p2',
    side: 'concept',
    content: 'LFPDPPP',
  },
  {
    id: 'm3',
    pairId: 'p3',
    side: 'concept',
    content: 'Derechos ARCO',
  },
  {
    id: 'm4',
    pairId: 'p1',
    side: 'definition',
    content: 'Suplantación para robar datos',
  },
  {
    id: 'm5',
    pairId: 'p4',
    side: 'concept',
    content: 'Código Ético',
  },
  {
    id: 'm6',
    pairId: 'p2',
    side: 'definition',
    content: 'Protección de datos personales',
  },
  {
    id: 'm7',
    pairId: 'p3',
    side: 'definition',
    content: 'Acceso, Rectificación, Cancelación y Oposición',
  },
  {
    id: 'm8',
    pairId: 'p4',
    side: 'definition',
    content: 'Principios de conducta profesional',
  },
];

export const CLOZE_ITEMS: ClozeItem[] = [
  {
    id: 'c1',
    ruleTitle: 'LFPDPPP - Articulo 15',
    prefix: 'El responsable del tratamiento de datos debe obtener el',
    answer: 'consentimiento',
    suffix: 'del titular antes de divulgar su informacion.',
    options: ['consentimiento', 'cifrado', 'respaldo', 'permiso'],
  },
  {
    id: 'c2',
    ruleTitle: 'Ciberseguridad - Control de Acceso',
    prefix: 'Aplicar el principio de',
    answer: 'minimo privilegio',
    suffix: 'reduce el impacto si una cuenta es comprometida.',
    options: ['minimo privilegio', 'acceso total', 'red abierta', 'copia publica'],
  },
];

export const INITIAL_TEACHER_STUDENTS: TeacherStudent[] = [
  {
    id: 'st-1',
    name: 'Regina Calderón',
    matricula: 'UP240102',
    currentModule: 'Módulo 3: Dilemas Éticos',
    average: 94.5,
    status: 'Activo',
    group: 'TIID-7A',
  },
  {
    id: 'st-2',
    name: 'Luvia Hidalgo',
    matricula: 'UP240118',
    currentModule: 'Módulo 2: LFPDPPP',
    average: 89.0,
    status: 'Activo',
    group: 'TIID-7A',
  },
  {
    id: 'st-3',
    name: 'Ian Morales',
    matricula: 'UP240145',
    currentModule: 'Módulo 4: Propiedad Intelectual',
    average: 92.8,
    status: 'Activo',
    group: 'TIID-7A',
  },
  {
    id: 'st-4',
    name: 'Mateo Silva',
    matricula: 'UP240201',
    currentModule: 'Módulo 1: Introducción',
    average: 76.2,
    status: 'Pendiente',
    group: 'TIID-7B',
  },
];

export const INITIAL_TEACHER_MODULES: TeacherModule[] = [
  {
    id: 'mod-1',
    order: '01',
    name: 'Módulo 1: Introducción y Ética',
    standard: 'Código ACM / IEEE',
    enrolledCount: 42,
    interactionType: 'Opción Múltiple (Reactivos Teóricos)',
    clozeItems: [],
    memoramaPairs: [],
    quizQuestions: [
      {
        id: 'qq-1',
        question: '¿Qué principio prioriza el bienestar público en ingeniería de software?',
        correctAnswer: 'Interés público y seguridad',
        distractors: ['Entrega más rápida posible', 'Ahorro en pruebas'],
      },
    ],
  },
  {
    id: 'mod-2',
    order: '02',
    name: 'Módulo 2: LFPDPPP y Privacidad',
    standard: 'Ley Federal de Datos Personales',
    enrolledCount: 42,
    interactionType: 'Completar Palabras (Espacios en Blanco)',
    clozeItems: [
      {
        id: 'cl-1',
        template:
          'Todo tratamiento de datos personales debe sujetarse a los principios de licitud, [consentimiento] y finalidad.',
      },
    ],
    memoramaPairs: [],
    quizQuestions: [],
  },
  {
    id: 'mod-3',
    order: '03',
    name: 'Módulo 3: Dilemas Éticos y Casos',
    standard: 'Casos Prácticos de Industria',
    enrolledCount: 38,
    interactionType: 'Memorama (Conexiones Legales)',
    clozeItems: [],
    memoramaPairs: [
      {
        id: 'mp-1',
        concept: 'Datos Sensibles',
        definition: 'Requieren consentimiento expreso y por escrito',
      },
      {
        id: 'mp-2',
        concept: 'Derechos ARCO',
        definition: 'Acceso, Rectificación, Cancelación y Oposición',
      },
    ],
    quizQuestions: [],
  },
  {
    id: 'mod-4',
    order: '04',
    name: 'Módulo 4: Propiedad Intelectual',
    standard: 'LFDA / Licenciamiento OSS',
    enrolledCount: 35,
    interactionType: 'Opción Múltiple (Reactivos Teóricos)',
    clozeItems: [],
    memoramaPairs: [],
    quizQuestions: [],
  },
];
