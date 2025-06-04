import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'
 
// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 72,
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '32px',
          fontWeight: 'bold',
          position: 'relative',
        }}
      >
        L
        <div
          style={{
            position: 'absolute',
            top: '24px',
            right: '32px',
            width: '16px',
            height: '16px',
            background: '#fbbf24',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            left: '28px',
            width: '8px',
            height: '8px',
            background: '#fbbf24',
            borderRadius: '50%',
            opacity: 0.7,
          }}
        />
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}
