import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.protocolelectrics.com.au'
  const now = new Date()

  // Priority: homepage 1.0, service/location pages 0.9, supporting pages 0.8, info pages 0.7
  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/locations`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/locations/noosa`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/locations/buderim`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/locations/maroochydore`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/locations/mooloolaba`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/locations/sippy-downs`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/locations/coolum-beach`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/book`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]
}
