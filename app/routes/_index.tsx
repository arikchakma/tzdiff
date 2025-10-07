import type { Route } from './+types/_index';
import { geolocation } from '~/lib/geo';
import { resolveTimezone, toTimezoneTime } from '~/lib/time';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

export function meta({}: Route.MetaArgs) {
  const title = 'TZD — Share Your Time Across Time Zones';
  const description =
    'Create short, shareable links for local times. Instantly see what your time means in another person’s timezone — perfect for meetings, events, and remote work.';
  const ogImage =
    'https://tzd.fyi/api/og?from=America/New_York&to=Asia/Dhaka&fromTime=10:00&toTime=20:00&diffInHours=10';

  return [
    { title },
    {
      name: 'description',
      content: description,
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

export function loader(args: Route.LoaderArgs) {
  const { countryCode, city } = geolocation(args.request.headers);
  const tz = resolveTimezone(countryCode, city) || 'UTC';
  const now = toTimezoneTime(new Date(), tz);

  return { tz, now };
}

export default function Home(props: Route.ComponentProps) {
  const { tz, now } = props.loaderData;
  const [region, city] = tz.split('/');

  return (
    <div className="mx-auto max-w-xl p-10 max-sm:px-5">
      <h1 className="text-4xl font-bold text-balance max-sm:text-3xl">
        Share Your Time Across Time Zones
      </h1>
      <p className="mt-5 text-lg text-balance text-zinc-600">
        Turn any time into a simple link. Send it to anyone, anywhere — and
        they’ll instantly see what that time means in their timezone.
      </p>

      <div className="mt-14 flex flex-col gap-4">
        <p className="text-lg text-zinc-600">See how it works:</p>
        <Link
          to={`/${region}/${city}/${now}`}
          className="text-2xl font-medium tracking-wide break-words text-rose-500 underline underline-offset-3 hover:text-rose-600"
        >
          https://tzd.fyi/{region}/{city}/{now}&ensp;
          <span className="text-3xl">↗</span>
        </Link>
        <p className="text-lg text-balance text-zinc-600">
          Send this link and others will see what <b>{now}</b> in <b>{city}</b>{' '}
          means for them.
        </p>
      </div>
    </div>
  );
}

export function headers(args: Route.HeadersArgs) {
  return {
    'Cache-Control': 'public, max-age=60, stale-while-revalidate=600',
    Vary: 'X-Vercel-IP-Country, X-Vercel-IP-City',
  };
}
