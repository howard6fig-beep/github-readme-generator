import { useState, useEffect } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('unlocked') === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setCopied(false);
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>GitHub Profile README Generator</h1>
      <p style={{ color: '#666', textAlign: 'center' }}>Instantly generate a beautiful GitHub profile in seconds.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Enter GitHub Username (e.g., torvalds)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}

      {result && (
        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* FREE TEMPLATE */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#333' }}>Basic Template (Free)</h3>
              <button onClick={() => copyToClipboard(result.freeTemplate)} style={{ padding: '5px 10px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                {copied ? 'Copied!' : 'Copy Markdown'}
              </button>
            </div>
            <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px', whiteSpace: 'pre-wrap', color: '#333', fontSize: '14px' }}>
              {result.freeTemplate}
            </pre>
          </div>

          {/* PREMIUM TEMPLATE */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#9b59b6' }}>Premium Developer Template</h3>
            </div>
            <div style={{ filter: isUnlocked ? 'none' : 'blur(6px)', pointerEvents: isUnlocked ? 'auto' : 'none' }}>
              <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px', whiteSpace: 'pre-wrap', color: '#333', fontSize: '14px' }}>
                {result.premiumTemplate}
              </pre>
              {isUnlocked && (
                <button onClick={() => copyToClipboard(result.premiumTemplate)} style={{ marginTop: '10px', padding: '5px 10px', background: '#9b59b6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  Copy Premium Markdown
                </button>
              )}
            </div>
            
            {!isUnlocked && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '25px', border: '2px solid #9b59b6', borderRadius: '10px', textAlign: 'center', width: '300px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '18px' }}>Unlock Premium Template</p>
                <p style={{ fontSize: '14px', marginBottom: '20px', color: '#666' }}>Get dynamic stat cards, typing animations, and sleek borders.</p>
                <a href="https://buy.stripe.com/5kQ7sNdvTdDoaMV97a1B603" style={{ background: '#9b59b6', color: 'white', padding: '12px 25px', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold', display: 'inline-block' }}>
                  Unlock for $4
                </a>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
