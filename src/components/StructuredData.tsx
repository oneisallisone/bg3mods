import Head from 'next/head'

interface StructuredDataProps {
  type: 'WebSite' | 'Article' | 'Product' | 'FAQPage';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const generateWebSiteSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BG3 Mods Navigation',
    description: 'Your ultimate guide to Baldur\'s Gate 3 mods',
    url: 'https://bg3mods.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://bg3mods.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  })

  const generateArticleSchema = (articleData: any) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: articleData.title,
    description: articleData.description,
    image: articleData.image,
    datePublished: articleData.publishedTime,
    dateModified: articleData.modifiedTime,
    author: {
      '@type': 'Person',
      name: articleData.author
    }
  })

  const generateProductSchema = (productData: any) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productData.name,
    description: productData.description,
    image: productData.image,
    category: productData.category,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: productData.rating,
      reviewCount: productData.reviewCount
    }
  })

  const generateFAQSchema = (faqData: any) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.questions.map((q: any) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer
      }
    }))
  })

  const schemaGenerators = {
    WebSite: generateWebSiteSchema,
    Article: generateArticleSchema,
    Product: generateProductSchema,
    FAQPage: generateFAQSchema
  }

  const schema = schemaGenerators[type](data)

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  )
}
