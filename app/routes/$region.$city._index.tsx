import { buildTimezone, toTimezoneTime } from '~/lib/time';
import type { Route } from './+types/$region.$city._index';
import { redirect } from 'react-router';

export function loader(args: Route.LoaderArgs) {
  const { region, city } = args.params;
  const timeNow = toTimezoneTime(new Date(), buildTimezone(region, city));
  throw redirect(`/${region}/${city}/${timeNow}`);
}
