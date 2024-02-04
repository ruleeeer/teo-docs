import withLinaria from 'next-with-linaria'
import mdx from '@next/mdx'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'
import onThisPage from './plugins/onThisPage.mjs'
import dataCopy from './plugins/dataCopy.mjs'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeMdxTitle from 'rehype-mdx-title'
import recmaNextjsStaticProps from 'recma-nextjs-static-props'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import { getHighlighter, BUNDLED_LANGUAGES } from 'shiki'

let withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      remarkToc, remarkGfm, remarkFrontmatter
    ],
    rehypePlugins: [
      rehypeMdxTitle,
      rehypeSlug,
      [rehypePrettyCode, {
        theme: 'css-variables',
        onVisitLine(node) {
          // Prevent lines from collapsing in `display: grid` mode, and
          // allow empty lines to be copy/pasted
          if (node.children.length === 0) {
            node.children = [{type: 'text', value: ' '}];
          }
        },
        // Feel free to add classNames that suit your docs
        onVisitHighlightedLine(node) {
          node.properties.className.push('highlighted');
        },
        onVisitHighlightedWord(node) {
          node.properties.className = ['word'];
        },
        getHighlighter: (options) => getHighlighter({
          ...options,
          langs: [
            ...BUNDLED_LANGUAGES,
            {
              id: 'teo',
              scopeName: 'source.teo',
              path: '../../langs/teo.json',
            },
          ],
        }),
      }],
      dataCopy,
      onThisPage
    ],
    recmaPlugins: [recmaNextjsStaticProps],
  },
})

/** @type {import('next-with-linaria').LinariaConfig} */
const config = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: true,
  },
}

export default withMDX(withLinaria(config))