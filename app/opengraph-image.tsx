import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'JuanGuide - Philippine Government Services Guide'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #4F46E5, #7C3AED)', // Indigo-600 to Violet-600
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '20px',
            marginBottom: '40px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          {/* Logo Icon */}
          <div
             style={{
               width: '80px',
               height: '80px',
               background: 'white',
               borderRadius: '16px',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               marginRight: '24px',
             }}
          >
             <div style={{ color: '#4F46E5', fontSize: 48, fontWeight: 900, fontFamily: 'sans-serif' }}>JG</div>
          </div>
          
          <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: '-0.025em', fontFamily: 'sans-serif' }}>
            BAGO APP
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <div style={{ fontSize: 42, fontWeight: 700, marginBottom: '16px', textAlign: 'center', fontFamily: 'sans-serif' }}>
             Gov Services Made Simple 🇵🇭
           </div>
           <div style={{ fontSize: 28, opacity: 0.9, textAlign: 'center', maxWidth: '800px', fontFamily: 'sans-serif' }}>
             Instant requirements for SSS, PhilHealth, DFA, LTO & more!
           </div>
        </div>
        
        <div
          style={{
             position: 'absolute',
             bottom: 40,
             display: 'flex',
             alignItems: 'center',
             gap: '12px',
             opacity: 0.8,
             fontSize: 24,
             fontFamily: 'sans-serif',
          }}
        >
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }}></div>
          <div>bagoapp.ph</div>
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}
