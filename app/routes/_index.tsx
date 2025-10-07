import type { Route } from './+types/_index';

export function meta({}: Route.MetaArgs) {
  const title = 'TZD — Share Your Time Across Time Zones';
  const description =
    'Create short, shareable links for local times. Instantly see what your time means in another person’s timezone — perfect for meetings, events, and remote work.';
  const ogImage =
    'https://tzd.fyi/api/og?from=America/New_York&to=Asia/Dhaka&fromTime=10:00&toTime=20:00&diffInHours=10';

  return [
    { title: 'TZD — Share Your Time Across Time Zones' },
    {
      name: 'description',
      content:
        'Create short, shareable links for local times. Instantly see what your time means in another person’s timezone — perfect for meetings, events, and remote work.',
    },
    {
      name: 'keywords',
      content:
        'timezone converter, share time, time difference calculator, meeting time link, timezones',
    },
    {
      rel: 'canonical',
      href: 'https://tzd.fyi/',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: 'https://tzd.fyi/',
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:image',
      content: ogImage,
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: description,
    },
    {
      name: 'twitter:image',
      content: ogImage,
    },
    {
      'script:ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How do I share a time across time zones?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Use TZD to generate a short link like https://tzd.fyi/Asia/Dhaka/12:00. When someone opens it, they instantly see what that time is in their timezone.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is TZD free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. TZD is completely free and doesn’t require an account.',
            },
          },
        ],
      }),
    },
  ];
}

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center">Hello World</div>
  );
}
