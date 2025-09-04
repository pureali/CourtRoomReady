import { useState } from 'react'
import courtLogo from '../assets/court_prep_logo.jpeg'
import viteLogo from '/vite.svg'
import './App.css'
import MyButton from '../components/mybutton.jsx'
import Avatar from '../components/avatar.jsx'
import UserVideo from '../components/uservideo.jsx'
export default function App() {
return (
  <div className="app-container" style={{ 
    padding: '20px', 
    minHeight: '100vh',
    //backgroundImage: 'url(./assets/civil-court-bg.webp)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative'
  }}>
    {/* Top Bar */}
    <div style={{
      width: '100%',
      background: 'rgba(0,0,0,0.85)',
      color: 'white',
      textAlign: 'center',
      padding: '18px 0',
      fontSize: '2rem',
      fontWeight: 'bold',
      letterSpacing: '2px',
      borderRadius: '0 0 16px 16px',
      marginBottom: '30px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      <img src={courtLogo} alt="Logo" style={{ width: '90px', height: '90px', objectFit: 'contain', borderRadius: '8px', marginRight: '16px', verticalAlign: 'middle' }} />
      Welcome to Virtual CourtRoom
    </div>
    <div className="header" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '20px',
      marginBottom: '30px'
    }}>
      
    </div>
    <div className="content" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '50vh'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        marginTop: '-70px',
      }}>
        <Avatar style={{ transform: 'scale(1.0)' }} title="Judge" />
      </div>
      <div style={{ width: '65%', marginTop: '20px' }}>
        <MyButton />
      </div>
    </div>
    <div className="bottom-section" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      marginTop: '20px'
    }}>
      {/* User Video */}
      <div className="video-box" style={{ border: '1px solid #ccc', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ background: 'black', color: 'white', width: '100%', textAlign: 'center', padding: '6px 0', marginBottom: '8px', borderRadius: '4px' }}>You</div>
        <div style={{ flex: 1, width: '100%' }}><UserVideo /></div>
      </div>
      {/* Judge Avatar */}
      <div className="avatar-box" style={{ border: '1px solid #ccc', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar title="Opposing Counsellor" />
      </div>
      {/* Opposing Counsellor Video */}
      <div className="video-box" style={{ border: '1px solid #ccc', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ background: 'black', color: 'white', width: '100%', textAlign: 'center', padding: '6px 0', marginBottom: '8px', borderRadius: '4px' }}>Witness</div>
        <div style={{ flex: 1 }}>Additional Video</div>
      </div>
    </div>
  <div className="footer" style={{ marginTop: '20px' }}>
    <div>Footer Content</div>
  </div>
</div>
  
)
}




