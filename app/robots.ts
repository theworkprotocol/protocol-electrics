import { MetadataRoute } from 'next'

/**
 * Reputable AI crawlers are named explicitly (agent-bookability-spec.md): the wildcard
 * already allows them, but naming them means a future tightening of `*` can't silently
 * cut off the agent channel.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/quote/'],
      },
      {
        userAgent: AI_CRAWLERS,
        allow: '/',
        disallow: ['/admin/', '/api/', '/quote/'],
      },
    ],
    sitemap: 'https://www.protocolelectrics.com.au/sitemap.xml',
  }
}
