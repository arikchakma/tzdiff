import {
  buildTimezone,
  diffInHours,
  formatTime,
  hasDivider,
  padTime,
  parseTzTime,
  resolveTimezone,
  zonify,
} from '~/lib/time';
import type { Route } from './+types/$region.$city.$time';
import { geolocation } from '~/lib/geo';
import { redirect } from 'react-router';

export function meta(args: Route.MetaArgs) {
  const { fromTZ, toTZ, fromTime, toTime, diffInHoursValue } = args.loaderData;
  const { region, city, time } = parseTzTime(fromTZ, fromTime);

  const ogTitle = `${fromTZ} ${fromTime} = ${toTime} in ${toTZ} (+${diffInHoursValue} hours)`;
  const ogDescription = `Convert ${fromTime} in ${fromTZ} to ${toTZ} (+${diffInHoursValue} hours). Share this link to instantly see local equivalents across time zones.`;
  const ogImage = `https://tzd.fyi/api/og?from=${fromTZ}&to=${toTZ}&fromTime=${fromTime}&toTime=${toTime}&diffInHours=${diffInHoursValue}`;
  const ogUrl = `https://tzd.fyi/${fromTZ}/${fromTime}`;

  return [
    {
      title: ogTitle,
    },
    {
      name: 'description',
      content: ogDescription,
    },
    {
      rel: 'canonical',
      href: ogUrl,
    },
    {
      property: 'og:site_name',
      content: 'TZD',
    },
    {
      property: 'og:title',
      content: ogTitle,
    },
    {
      property: 'og:description',
      content: ogDescription,
    },
    {
      property: 'og:url',
      content: ogUrl,
    },
    {
      property: 'og:type',
      content: 'website',
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
      content: ogTitle,
    },
    {
      name: 'twitter:description',
      content: ogDescription,
    },
    {
      name: 'twitter:image',
      content: ogImage,
    },
    {
      property: 'og:image:alt',
      content: ogTitle,
    },
    {
      property: 'og:image:width',
      content: '1200',
    },
    {
      property: 'og:image:height',
      content: '630',
    },
    {
      property: 'og:image:type',
      content: 'image/png',
    },
    {
      'script:ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: ogTitle,
        description: ogDescription,
        url: ogUrl,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: region,
              item: `https://tzd.fyi/${region}`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: city,
              item: `https://tzd.fyi/${region}/${city}`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: time,
              item: ogUrl,
            },
          ],
        },
      }),
    },
  ];
}

export function loader(args: Route.LoaderArgs) {
  const { region, city, time } = args.params;
  if (!hasDivider(time)) {
    const normalizedTime = formatTime(time);
    throw redirect(`/${region}/${city}/${normalizedTime}`);
  }

  const { countryCode, city: userCity } = geolocation(args.request.headers);

  const fromTZ = buildTimezone(region, city);
  const toTZ = resolveTimezone(countryCode, userCity);
  const toTime = zonify(fromTZ, toTZ!, time!);
  const diffInHoursValue = diffInHours(padTime(time), padTime(toTime));

  return {
    fromTZ,
    toTZ: toTZ,
    toTime: padTime(toTime),
    diffInHoursValue,
    fromTime: padTime(time),
  };
}

export default function Time(props: Route.ComponentProps) {
  const { fromTZ, toTZ, toTime, diffInHoursValue, fromTime } = props.loaderData;

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-12">
        <div className="flex flex-col items-end gap-2">
          <span className="text-5xl font-bold text-zinc-400">{fromTZ}</span>
          <span className="text-9xl font-extrabold tabular-nums">
            {fromTime}
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-5xl font-bold text-zinc-200">&nbsp;</span>
          <span className="text-9xl font-extrabold text-zinc-200">&rarr;</span>
          <span className="text-4xl font-bold text-zinc-300">
            +{diffInHoursValue} hour{diffInHoursValue > 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex flex-col items-start gap-2">
          <span className="text-5xl font-bold text-zinc-400">{toTZ}</span>
          <span className="text-9xl font-extrabold tabular-nums">{toTime}</span>
        </div>
      </div>
    </div>
  );
}

export function headers(args: Route.HeadersArgs) {
  return {
    'Cache-Control': 'public, max-age=600, stale-while-revalidate=600', // 10 minutes
    Vary: 'X-Vercel-IP-Country',
  };
}
