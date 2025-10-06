import {
  buildTimezone,
  diffInHours,
  padTime,
  resolveTimezone,
  zonify,
} from '~/lib/time';
import type { Route } from './+types/$region.$city.$time';
import { geolocation } from '~/lib/geo';

export function meta(args: Route.MetaArgs) {
  const { fromTZ, toTZ, fromTime, toTime, diffInHoursValue } = args.loaderData;

  return [
    {
      title: `${fromTZ} ${padTime(fromTime)} in ${toTZ}`,
    },
    {
      name: 'description',
      content: `Convert ${padTime(fromTime)} in ${fromTZ} to ${toTZ}. Instantly compare time zones and calculate the time difference (+${diffInHoursValue} hours).`,
    },
    {
      rel: 'canonical',
      href: `https://tzd.fyi/${fromTZ}/${padTime(fromTime)}`,
    },
    {
      property: 'og:title',
      content: `${fromTZ} ${padTime(fromTime)} in ${toTZ}`,
    },
    {
      property: 'og:description',
      content: `Convert ${padTime(fromTime)} in ${padTime(fromTZ)} to ${toTZ}. Instantly compare time zones and calculate the time difference (+${diffInHoursValue} hours).`,
    },
    {
      property: 'og:url',
      content: `https://tzd.fyi/${fromTZ}/${padTime(fromTime)}`,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:image',
      content: `https://tzd.fyi/api/og?from=${fromTZ}&to=${toTZ}&fromTime=${padTime(fromTime)}&toTime=${padTime(toTime)}&diffInHours=${diffInHoursValue}`,
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
  ];
}

export function loader(args: Route.LoaderArgs) {
  const { region, city, time } = args.params;
  const { countryCode, city: userCity } = geolocation(args.request.headers);

  const fromTZ = buildTimezone(region, city);
  const toTZ = resolveTimezone(countryCode, userCity);
  const toTime = zonify(fromTZ, toTZ!, time!);
  const diffInHoursValue = diffInHours(padTime(time), padTime(toTime));

  return {
    fromTZ,
    toTZ,
    toTime,
    diffInHoursValue,
    fromTime: time,
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
            {padTime(fromTime)}
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
          <span className="text-9xl font-extrabold tabular-nums">
            {padTime(toTime)}
          </span>
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
