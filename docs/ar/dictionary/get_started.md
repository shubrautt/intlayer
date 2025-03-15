# بدء إعلان المحتوى الخاص بك

## امتدادات الملفات

بشكل افتراضي، يراقب Intlayer جميع الملفات ذات الامتدادات التالية لإعلانات المحتوى:

- `.content.json`
- `.content.ts`
- `.content.tsx`
- `.content.js`
- `.content.jsx`
- `.content.mjs`
- `.content.mjx`
- `.content.cjs`
- `.cintent.cjx`

سيبحث التطبيق عن الملفات التي تطابق النمط `./src/**/*.content.{ts,tsx,js,jsx,mjs,cjs}` بشكل افتراضي.

هذه الامتدادات الافتراضية مناسبة لمعظم التطبيقات. ومع ذلك، إذا كانت لديك متطلبات محددة، راجع [دليل تخصيص امتداد المحتوى](https://github.com/aymericzip/intlayer/blob/main/docs/ar/configuration.md#content-configuration) للحصول على تعليمات حول كيفية إدارتها.

للحصول على قائمة كاملة بخيارات التكوين، قم بزيارة وثائق التكوين.

## إعلان المحتوى الخاص بك

قم بإنشاء وإدارة القواميس الخاصة بك:

```tsx fileName="src/example.content.ts" codeFormat="typescript"
import { t, enu, cond, nest, md, type Dictionary } from "intlayer";

interface Content {
  imbricatedContent: {
    imbricatedContent2: {
      stringContent: string;
      numberContent: number;
      booleanContent: boolean;
    };
    multilingualContent: string;
    quantityContent: string;
    conditionalContent: string;
    nestedContent: string;
    markdownContent: string;
    externalContent: string;
  };
}

export default {
  key: "page",
  content: {
    imbricatedContent: {
      imbricatedContent2: {
        stringContent: "مرحبًا بالعالم",
        numberContent: 123,
        booleanContent: true,
        javaScriptContent: `${process.env.NODE_ENV}`,
      },
    },
    multilingualContent: t({
      en: "English content",
      "en-GB": "English content (UK)",
      fr: "French content",
      es: "Spanish content",
      ar: "محتوى عربي",
    }),
    quantityContent: enu({
      "<-1": "أقل من سيارة واحدة بالسالب",
      "-1": "سيارة واحدة بالسالب",
      "0": "لا توجد سيارات",
      "1": "سيارة واحدة",
      ">5": "بعض السيارات",
      ">19": "العديد من السيارات",
    }),
    conditionalContent: cond({
      true: "التحقق مفعل",
      false: "التحقق معطل",
    }),
    nestedContent: nest(
      "navbar", // مفتاح القاموس للتداخل
      "login.button" // [اختياري] المسار إلى المحتوى للتداخل
    ),
    externalContent: async () => await fetch("https://example.com"),
    markdownContent: md("# مثال Markdown"),

    /*
     * متاح فقط باستخدام `react-intlayer` أو `next-intlayer`
     */
    jsxContent: <h1>عنواني</h1>,
  },
} satisfies Dictionary<Content>; // [اختياري] القاموس هو عام ويسمح لك بتقوية تنسيق القاموس الخاص بك
```

```javascript fileName="src/example.content.mjs" codeFormat="esm"
import { t, enu, cond, nest, md } from "intlayer";

/** @type {import('intlayer').Dictionary} */
export default {
  key: "page",
  content: {
    imbricatedContent: {
      imbricatedContent2: {
        stringContent: "مرحبًا بالعالم",
        numberContent: 123,
        booleanContent: true,
        javaScriptContent: `${process.env.NODE_ENV}`,
      },
      imbricatedArray: [1, 2, 3],
    },
    multilingualContent: t({
      en: "English content",
      "en-GB": "English content (UK)",
      fr: "French content",
      es: "Spanish content",
      ar: "محتوى عربي",
    }),
    quantityContent: enu({
      "<-1": "أقل من سيارة واحدة بالسالب",
      "-1": "سيارة واحدة بالسالب",
      "0": "لا توجد سيارات",
      "1": "سيارة واحدة",
      ">5": "بعض السيارات",
      ">19": "العديد من السيارات",
    }),
    conditionalContent: cond({
      true: "التحقق مفعل",
      false: "التحقق معطل",
    }),
    nestedContent: nest(
      "navbar", // مفتاح القاموس للتداخل
      "login.button" // [اختياري] المسار إلى المحتوى للتداخل
    ),
    markdownContent: md("# مثال Markdown"),
    externalContent: async () => await fetch("https://example.com"),

    // متاح فقط باستخدام `react-intlayer` أو `next-intlayer`
    jsxContent: <h1>عنواني</h1>,
  },
};
```

```javascript fileName="src/example.content.cjs" codeFormat="commonjs"
const { t, enu, cond, nest, md } = require("intlayer");

/** @type {import('intlayer').Dictionary} */
module.exports = {
  key: "page",
  content: {
    imbricatedContent: {
      imbricatedContent2: {
        stringContent: "مرحبًا بالعالم",
        numberContent: 123,
        booleanContent: true,
        javaScriptContent: `${process.env.NODE_ENV}`,
      },
      imbricatedArray: [1, 2, 3],
    },
    multilingualContent: t({
      en: "English content",
      "en-GB": "English content (UK)",
      fr: "French content",
      es: "Spanish content",
      ar: "محتوى عربي",
    }),
    quantityContent: enu({
      "<-1": "أقل من سيارة واحدة بالسالب",
      "-1": "سيارة واحدة بالسالب",
      "0": "لا توجد سيارات",
      "1": "سيارة واحدة",
      ">5": "بعض السيارات",
      ">19": "العديد من السيارات",
    }),
    conditionalContent: cond({
      true: "التحقق مفعل",
      false: "التحقق معطل",
    }),
    nestedContent: nest(
      "navbar", // مفتاح القاموس للتداخل
      "login.button" // [اختياري] المسار إلى المحتوى للتداخل
    ),
    markdownContent: md("# مثال Markdown"),
    externalContent: async () => await fetch("https://example.com"),

    // متاح فقط باستخدام `react-intlayer` أو `next-intlayer`
    jsxContent: <h1>عنواني</h1>,
  },
};
```

```json5 fileName="src/example.content.json"  codeFormat="json"
{
  "$schema": "https://intlayer.org/schema.json",
  "key": "page",
  "content": {
    "imbricatedContent": {
      "imbricatedContent2": {
        "stringContent": "مرحبًا بالعالم",
        "numberContent": 123,
        "booleanContent": true,
      },
      "imbricatedArray": [1, 2, 3],
    },
    "multilingualContent": {
      "nodeType": "translation",
      "translation": {
        "en": "English content",
        "en-GB": "English content (UK)",
        "fr": "French content",
        "es": "Spanish content",
        "ar": "محتوى عربي",
      },
    },
    "quantityContent": {
      "nodeType": "enumeration",
      "enumeration": {
        "0": "لا توجد سيارات",
        "1": "سيارة واحدة",
        "<-1": "أقل من سيارة واحدة بالسالب",
        "-1": "سيارة واحدة بالسالب",
        ">5": "بعض السيارات",
        ">19": "العديد من السيارات",
      },
    },
    "conditionalContent": {
      "nodeType": "condition",
      "condition": {
        "true": "التحقق مفعل",
        "false": "التحقق معطل",
      },
    },
    "nestedContent": {
      "nodeType": "nested",
      "nested": { "dictionaryKey": "app" },
    },
    "markdownContent": {
      "nodeType": "markdown",
      "markdown": "# مثال Markdown",
    },
    "jsxContent": {
      "type": "h1",
      "key": null,
      "ref": null,
      "props": {
        "children": ["عنواني"],
      },
    },
  },
}
```

## تداخل الوظائف

يمكنك بدون مشكلة تداخل الوظائف داخل بعضها البعض.

مثال:

```javascript fileName="src/example.content.ts" codeFormat="typescript"
import { t, enu, cond, nest, md, type Dictionary } from "intlayer";

const getName = async () => "جون دو";

export default {
  key: "page",
  content: {
    // `getIntlayer('page','ar').hiMessage` يعيد `['مرحبًا', ' ', 'جون دو']`
    hiMessage: [
      t({
        en: "Hi",
        fr: "Salut",
        es: "Hola",
        ar: "مرحبًا",
      }),
      " ",
      getName(),
    ],
    // محتوى مركب يتداخل فيه الشرط، التعداد، والمحتوى متعدد اللغات
    // `getIntlayer('page','ar').advancedContent(true)(10) يعيد 'تم العثور على عناصر متعددة'`
    advancedContent: cond({
      true: enu({
        "0": t({
          en: "No items found",
          fr: "Aucun article trouvé",
          es: "No se encontraron artículos",
          ar: "لم يتم العثور على عناصر",
        }),
        "1": t({
          en: "One item found",
          fr: "Un article trouvé",
          es: "Se encontró un artículo",
          ar: "تم العثور على عنصر واحد",
        }),
        ">1": t({
          en: "Multiple items found",
          fr: "Plusieurs articles trouvés",
          es: "Se encontraron múltiples artículos",
          ar: "تم العثور على عناصر متعددة",
        }),
      }),
      false: t({
        en: "No valid data available",
        fr: "Aucune donnée valide disponible",
        es: "No hay datos válidos disponibles",
        ar: "لا توجد بيانات صالحة متاحة",
      }),
    }),
  },
} satisfies Dictionary;
```

```javascript fileName="src/example.content.mjs" codeFormat="esm"
import { t, enu, cond, nest, md } from "intlayer";

const getName = async () => "جون دو";

/** @type {import('intlayer').Dictionary} */
export default {
  key: "page",
  content: {
    // `getIntlayer('page','ar').hiMessage` يعيد `['مرحبًا', ' ', 'جون دو']`
    hiMessage: [
      t({
        en: "Hi",
        fr: "Salut",
        es: "Hola",
        ar: "مرحبًا",
      }),
      " ",
      getName(),
    ],
    // محتوى مركب يتداخل فيه الشرط، التعداد، والمحتوى متعدد اللغات
    // `getIntlayer('page','ar').advancedContent(true)(10) يعيد 'تم العثور على عناصر متعددة'`
    advancedContent: cond({
      true: enu({
        "0": t({
          en: "No items found",
          fr: "Aucun article trouvé",
          es: "No se encontraron artículos",
          ar: "لم يتم العثور على عناصر",
        }),
        "1": t({
          en: "One item found",
          fr: "Un article trouvé",
          es: "Se encontró un artículo",
          ar: "تم العثور على عنصر واحد",
        }),
        ">1": t({
          en: "Multiple items found",
          fr: "Plusieurs articles trouvés",
          es: "Se encontraron múltiples artículos",
          ar: "تم العثور على عناصر متعددة",
        }),
      }),
      false: t({
        en: "No valid data available",
        fr: "Aucune donnée valide disponible",
        es: "No hay datos válidos disponibles",
        ar: "لا توجد بيانات صالحة متاحة",
      }),
    }),
  },
};
```

```javascript fileName="src/example.content.cjs" codeFormat="commonjs"
const { t, enu, cond, nest, md } = require("intlayer");

const getName = async () => "جون دو";

/** @type {import('intlayer').Dictionary} */
module.exports = {
  key: "page",
  content: {
    // `getIntlayer('page','ar').hiMessage` يعيد `['مرحبًا', ' ', 'جون دو']`
    hiMessage: [
      t({
        en: "Hi",
        fr: "Salut",
        es: "Hola",
        ar: "مرحبًا",
      }),
      " ",
      getName(),
    ],
    // محتوى مركب يتداخل فيه الشرط، التعداد، والمحتوى متعدد اللغات
    // `getIntlayer('page','ar').advancedContent(true)(10) يعيد 'تم العثور على عناصر متعددة'`
    advancedContent: cond({
      true: enu({
        "0": t({
          en: "No items found",
          fr: "Aucun article trouvé",
          es: "No se encontraron artículos",
          ar: "لم يتم العثور على عناصر",
        }),
        "1": t({
          en: "One item found",
          fr: "Un article trouvé",
          es: "Se encontró un artículo",
          ar: "تم العثور على عنصر واحد",
        }),
        ">1": t({
          en: "Multiple items found",
          fr: "Plusieurs articles trouvés",
          es: "Se encontraron múltiples artículos",
          ar: "تم العثور على عناصر متعددة",
        }),
      }),
      false: t({
        en: "No valid data available",
        fr: "Aucune donnée valide disponible",
        es: "No hay datos válidos disponibles",
        ar: "لا توجد بيانات صالحة متاحة",
      }),
    }),
  },
};
```

```json5 fileName="src/example.content.json"  codeFormat="json"
{
  "$schema": "https://intlayer.org/schema.json",
  "key": "page",
  "content": {
    "hiMessage": {
      "nodeType": "composite",
      "composite": [
        {
          "nodeType": "translation",
          "translation": {
            "en": "Hi",
            "fr": "Salut",
            "es": "Hola",
            "ar": "مرحبًا",
          },
        },
        " ",
        "جون دو",
      ],
    },
    "advancedContent": {
      "nodeType": "condition",
      "condition": {
        "true": {
          "nodeType": "enumeration",
          "enumeration": {
            "0": {
              "nodeType": "translation",
              "translation": {
                "en": "No items found",
                "fr": "Aucun article trouvé",
                "es": "No se encontraron artículos",
                "ar": "لم يتم العثور على عناصر",
              },
            },
            "1": {
              "nodeType": "translation",
              "translation": {
                "en": "One item found",
                "fr": "Un article trouvé",
                "es": "Se encontró un artículo",
                "ar": "تم العثور على عنصر واحد",
              },
            },
            ">1": {
              "nodeType": "translation",
              "translation": {
                "en": "Multiple items found",
                "fr": "Plusieurs articles trouvés",
                "es": "Se encontraron múltiples artículos",
                "ar": "تم العثور على عناصر متعددة",
              },
            },
          },
        },
        "false": {
          "nodeType": "translation",
          "translation": {
            "en": "No valid data available",
            "fr": "Aucune donnée valide disponible",
            "es": "No hay datos válidos disponibles",
            "ar": "لا توجد بيانات صالحة متاحة",
          },
        },
      },
    },
  },
}
```
