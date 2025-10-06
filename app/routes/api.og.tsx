import satori from 'satori';
import type { Route } from './+types/api.og';
import fs from 'node:fs/promises';

export async function loader(args: Route.LoaderArgs) {
  const searchParams = new URL(args.request.url).searchParams;
  const from = searchParams.get('from');
  const fromTime = searchParams.get('fromTime');
  const to = searchParams.get('to');
  const toTime = searchParams.get('toTime');
  const diffInHours = searchParams.get('diffInHours');

  const interBuffer = await fs.readFile(
    new URL('../../public/fonts/Inter-ExtraBold.ttf', import.meta.url)
  );
  const interBoldBuffer = await fs.readFile(
    new URL('../../public/fonts/Inter-Bold.ttf', import.meta.url)
  );

  const svg = await satori(
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <span style={{ fontSize: 48, fontWeight: 700, color: '#9f9fa9' }}>
            {from}
          </span>
          <span
            style={{
              fontSize: 128,
              fontWeight: 800,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {fromTime}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 48, fontWeight: 700, color: '#9f9fa9' }}>
            &nbsp;
          </span>
          <span style={{ fontSize: 128, fontWeight: 800, color: '#e4e4e7' }}>
            &rarr;
          </span>
          <span
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: '#d4d4d8',
            }}
          >
            +{diffInHours} hour{Number(diffInHours) > 1 ? 's' : ''}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <span style={{ fontSize: 48, fontWeight: 700, color: '#9f9fa9' }}>
            {to}
          </span>
          <span
            style={{
              fontSize: 128,
              fontWeight: 800,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {toTime}
          </span>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: interBuffer,
          weight: 800,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: interBoldBuffer,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
    },
  });
}
