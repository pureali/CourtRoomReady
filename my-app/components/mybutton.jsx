
import { useState } from 'react';

export default function MyButton() {
  const [message, setMessage] = useState('');

  const buttonClick = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/status');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('API did not return JSON');
      }
      const data = await response.json();
      alert('API Response: ' + data.status);
      setMessage(data.status);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error: Could not fetch data from API');
    }
  };

  return (
    <div>
      <button onClick={buttonClick}>Click me!</button>
      <div id="status" style={{ marginTop: '10px', fontWeight: 'bold' }}>
        Div message: {message}
      </div>
      


    </div>
  )
}
