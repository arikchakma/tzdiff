export const DEFAULT_COUNTRY_CODE = 'BD';
export const DEFAULT_CITY_NAME = 'Dhaka';

export function geolocation(headers: Headers) {
  const countryCode =
    headers.get('X-Vercel-IP-Country') || DEFAULT_COUNTRY_CODE;
  const city = headers.get('X-Vercel-IP-City');
  return { countryCode, city };
}
