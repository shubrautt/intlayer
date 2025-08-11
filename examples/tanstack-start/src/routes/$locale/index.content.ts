import { md, type Dictionary } from 'intlayer';
import { t } from 'react-intlayer';

const routeContent = {
  key: 'app',
  content: {
    edit: md('Edit `src/routes/index.tsx` and save to reload'),
    learnReact: t({
      en: 'Learn React',
      fr: 'Apprendre React',
      es: 'Aprender React',
    }),
    learnTanStack: t({
      en: 'Learn TanStack',
      fr: 'Apprendre TanStack',
      es: 'Aprender TanStack',
    }),
  },
} satisfies Dictionary;

export default routeContent;
