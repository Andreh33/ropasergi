import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: '#050507',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#1E63FF',
        fontFamily: 'system-ui',
        fontWeight: 900,
        fontSize: 22,
        letterSpacing: '-0.06em',
      }}
    >
      P1
    </div>,
    size,
  );
}
