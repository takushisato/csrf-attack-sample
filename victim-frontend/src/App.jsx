import { useEffect, useState } from "react";
import { api } from "./api.js";
import LoginForm from "./components/LoginForm.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await api.me();
      setMe(data);
    } catch (e) {
      if (e.status === 401) setMe(null);
      else console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleLogout = async () => {
    await api.logout();
    setMe(null);
  };

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <div className="container">
      <header className="header">
        <h1>🏦 Victim Bank</h1>
        <p className="warning">⚠️ これは CSRF 脆弱性を学習するための、わざと脆弱に作られたサイトです。</p>
      </header>

      {me ? <Dashboard me={me} onChange={refresh} onLogout={handleLogout} /> : <LoginForm onLoggedIn={refresh} />}
    </div>
  );
}
