import { PagesRoutes } from '@/Routes';
import {
  Breadcrumb,
  type BreadcrumbLink,
  type BreadcrumbProps,
} from '@intlayer/design-system';
import { type Locales, getLocalizedUrl } from 'intlayer';
import { type FC, useMemo } from 'react';
import { getBlogSubSection } from './blogData';
import type { Section } from './types';

type BlogBreadCrumbProps = {
  activeSections: string[];
  blogData: Section;
  locale: Locales;
} & Omit<BreadcrumbProps, 'links'>;

export const BlogBreadCrumb: FC<BlogBreadCrumbProps> = ({
  activeSections,
  blogData,
  locale,
  ...props
}) => {
  const breadcrumbsLinks: BreadcrumbLink[] = useMemo(
    () => [
      {
        text: 'Blog',
        href: getLocalizedUrl(PagesRoutes.Blog, locale),
      },
      ...activeSections
        .filter((el) => el !== 'index')
        .map((el) => {
          const blogSection = getBlogSubSection(blogData, el);
          const sectionUrl = blogSection?.default?.url;

          return {
            text: blogSection?.title ?? '',
            href: sectionUrl,
          };
        }),
    ],
    [activeSections, blogData, locale]
  );

  return (
    <Breadcrumb
      links={breadcrumbsLinks}
      className="ml-10 mt-12"
      locale={locale}
      {...props}
    />
  );
};
