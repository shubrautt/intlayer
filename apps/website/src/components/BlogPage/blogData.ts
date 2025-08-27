import type { BlogKey, BlogMetadata } from '@intlayer/docs';
import { Locales, getIntlayer } from 'intlayer';
import type { CategorizedBlogData, Section } from './types';

export const getBlogData = (
  locale = Locales.ENGLISH
): Record<string, CategorizedBlogData> => {
  const blog = getIntlayer('blog-data', locale);

  return blog satisfies Record<string, CategorizedBlogData>;
};

const findDocBySectionKey = (
  docData: CategorizedBlogData,
  sectionKey: string
): CategorizedBlogData | undefined => {
  if (docData[sectionKey as keyof typeof docData]) {
    return docData[sectionKey as keyof typeof docData] as CategorizedBlogData;
  }

  for (const key of Object.keys(docData)) {
    const subSections = (
      docData[key as keyof typeof docData] as CategorizedBlogData
    ).subSections;

    if (subSections) {
      let foundDataFound = findDocBySectionKey(
        subSections as unknown as CategorizedBlogData,
        sectionKey
      );

      if (foundDataFound) {
        return foundDataFound;
      }
    }
  }

  return undefined;
};

export const getBlogSubSection = (
  docData: Record<string, CategorizedBlogData>,
  sectionKey: string
) => {
  let current = docData as unknown as CategorizedBlogData;

  return findDocBySectionKey(current, sectionKey);
};

type BlogSectionPaths = {
  paths: string[][];
  blog: BlogMetadata[];
  title: string[];
};

export const getBlogSection = (
  docData: Section,
  presetKeys: string[] = []
): BlogSectionPaths => {
  const paths: string[][] = [];
  const blog: BlogMetadata[] = [];
  const title: string[] = [];

  for (const key of Object.keys(docData)) {
    const docDataValue = docData[key];

    if (typeof docDataValue.default !== 'undefined') {
      blog.push(docDataValue.default);
      paths.push([...presetKeys, key]);
      title.push(docDataValue.title);
    }
    if (typeof docDataValue.subSections !== 'undefined') {
      const {
        paths: subSectionsPaths,
        blog: subSectionsBlogs,
        title: subTitle,
      } = getBlogSection(docDataValue.subSections, [...presetKeys, key]);

      blog.push(...subSectionsBlogs);
      paths.push(...subSectionsPaths);
      title.push(...subTitle);
    }
  }

  return { paths, blog, title };
};

export const getPreviousNextBlogData = (docKey: BlogKey, locale: Locales) => {
  const docData = getBlogData(locale);
  const { blog, paths, title } = getBlogSection(docData);

  const blogIndex = blog.findIndex((blog) => blog.docKey === docKey);
  const nextBlogIndex = blogIndex + 1;
  const prevBlogIndex = blogIndex - 1;

  return {
    prevBlogData: {
      blogs: blog[prevBlogIndex] as BlogMetadata,
      paths: paths[prevBlogIndex],
      title: title[prevBlogIndex],
    },
    nextBlogData: {
      blogs: blog[nextBlogIndex] as BlogMetadata,
      paths: paths[nextBlogIndex],
      title: title[nextBlogIndex],
    },
  };
};
