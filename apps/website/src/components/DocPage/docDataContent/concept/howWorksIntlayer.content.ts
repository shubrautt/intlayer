import { t, type DeclarationContent } from 'intlayer';
import { Metadata } from 'next';

const docContent = {
  key: 'doc-how-works-intlayer-metadata',
  content: {
    title: t({
      en: 'How Intlayer Works',
      'en-GB': 'How Intlayer Works',
      fr: 'Comment Intlayer fonctionne',
      es: 'Cómo funciona Intlayer',
      de: 'Wie Intlayer funktioniert',
      ja: 'Intlayerの仕組み',
      ko: 'Intlayer 작동 방식',
      zh: 'Intlayer 的工作原理',
      it: 'Come funziona Intlayer',
      pt: 'Como o Intlayer funciona',
      hi: 'Intlayer कैसे काम करता है',
      ar: 'كيف يعمل Intlayer',
      ru: 'Как работает Intlayer',
    }),

    description: t({
      en: 'Learn how Intlayer operates internally. Understand the architecture and components that make Intlayer powerful.',
      'en-GB':
        'Learn how Intlayer operates internally. Understand the architecture and components that make Intlayer powerful.',
      fr: "Apprenez comment Intlayer fonctionne en interne. Comprenez l'architecture et les composants qui rendent Intlayer puissant.",
      es: 'Aprenda cómo funciona Intlayer internamente. Comprenda la arquitectura y los componentes que hacen que Intlayer sea potente.',
      de: 'Erfahren Sie, wie Intlayer intern funktioniert. Verstehen Sie die Architektur und die Komponenten, die Intlayer leistungsstark machen.',
      ja: 'Intlayerが内部でどのように機能するかを学びます。Intlayerを強力にするアーキテクチャとコンポーネントを理解しましょう。',
      ko: 'Intlayer가 내부적으로 어떻게 작동하는지 알아보세요. Intlayer를 강력하게 만드는 아키텍처와 구성 요소를 이해하십시오.',
      zh: '了解Intlayer的内部运作方式。理解使Intlayer强大的架构和组件。',
      it: "Scopri come funziona Intlayer internamente. Comprendi l'architettura e i componenti che rendono Intlayer potente.",
      pt: 'Aprenda como o Intlayer opera internamente. Compreenda a arquitetura e os componentes que tornam o Intlayer poderoso.',
      hi: 'जानें कि Intlayer आंतरिक रूप से कैसे काम करता है। समझें कि Intlayer को शक्तिशाली बनाने वाली संरचना और घटक क्या हैं।',
      ar: 'تعلم كيف يعمل Intlayer داخليًا. افهم البنية والمكونات التي تجعل Intlayer قويًا.',
      ru: 'Узнайте, как Intlayer работает внутри. Поймите архитектуру и компоненты, которые делают Intlayer мощным.',
    }),
    keywords: t({
      en: [
        'Intlayer',
        'How it works',
        'Architecture',
        'Components',
        'Internal workings',
      ],
      'en-GB': [
        'Intlayer',
        'How it works',
        'Architecture',
        'Components',
        'Internal workings',
      ],
      fr: [
        'Intlayer',
        'Comment ça marche',
        'Architecture',
        'Composants',
        'Fonctionnement interne',
      ],
      es: [
        'Intlayer',
        'Cómo funciona',
        'Arquitectura',
        'Componentes',
        'Funcionamiento interno',
      ],
      de: [
        'Intlayer',
        'Wie es funktioniert',
        'Architektur',
        'Komponenten',
        'Interne Abläufe',
      ],
      ja: [
        'Intlayer',
        'どのように機能するか',
        'アーキテクチャ',
        'コンポーネント',
        '内部動作',
      ],
      ko: [
        'Intlayer',
        '어떻게 작동하는가',
        '아키텍처',
        '구성 요소',
        '내부 작동',
      ],
      zh: ['Intlayer', '如何运作', '架构', '组成部分', '内部运作'],
      it: [
        'Intlayer',
        'Come funziona',
        'Architettura',
        'Componenti',
        'Funzionamento interno',
      ],
      pt: [
        'Intlayer',
        'Como funciona',
        'Arquitetura',
        'Componentes',
        'Funcionamento interno',
      ],
      hi: [
        'Intlayer',
        'यह कैसे काम करता है',
        'आर्किटेक्चर',
        'घटक',
        'आंतरिक कार्यप्रणाली',
      ],
      ar: [
        'Intlayer',
        'كيف يعمل',
        'الهندسة المعمارية',
        'المكونات',
        'العمليات الداخلية',
      ],
      ru: [
        'Intlayer',
        'Как работает',
        'Архитектура',
        'Компоненты',
        'Внутренние процессы',
      ],
    }),
  },
} satisfies DeclarationContent<Metadata>;

export default docContent;
