import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const alt = 'Lingento - Learn Languages with Smart Flashcards'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Logo */}
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'white',
            borderRadius: '20px',
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#4f46e5',
          }}
        >
          L
        </div>
        
        {/* Yellow accent */}
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '120px',
            width: '16px',
            height: '16px',
            background: '#fbbf24',
            borderRadius: '50%',
          }}
        />
        
        {/* Main Title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: 'white',
            lineHeight: 1.1,
            marginTop: '40px',
          }}
        >
          Lingento
        </div>
        
        {/* Subtitle */}
        <div
          style={{
            fontSize: '32px',
            color: 'white',
            opacity: 0.9,
            marginTop: '20px',
            maxWidth: '800px',
          }}
        >
          Learn Languages with Smart Flashcards
        </div>
        
        {/* Description */}
        <div
          style={{
            fontSize: '24px',
            color: 'white',
            opacity: 0.8,
            marginTop: '30px',
            maxWidth: '900px',
            lineHeight: 1.4,
          }}
        >
          Master vocabulary with spaced repetition and interactive flashcards
        </div>
        
        {/* Website */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '60px',
            fontSize: '28px',
            color: 'white',
            opacity: 0.8,
            fontWeight: '600',
          }}
        >
          lingentoo.com
        </div>
        
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '150px',
            right: '100px',
            width: '120px',
            height: '120px',
            background: 'white',
            opacity: 0.1,
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '300px',
            right: '200px',
            width: '80px',
            height: '80px',
            background: 'white',
            opacity: 0.1,
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '100px',
            right: '150px',
            width: '60px',
            height: '60px',
            background: 'white',
            opacity: 0.1,
            borderRadius: '50%',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
