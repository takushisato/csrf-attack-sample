import { useEffect, useState } from "react";
import { api } from "@/api.js";
import TransferForm from "@/components/TransferForm.jsx";
import HistoryList from "@/components/HistoryList.jsx";

export default function Dashboard({ me, onChange, onLogout }) {
  const [history, setHistory] = useState([]);

  const reloadHistory = async () => {
    try {
      const data = await api.history();
      setHistory(data.items);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    reloadHistory();
  }, [me.balance]);

  return (
    <>
      <section className="card">
        <div className="row">
          <div>
            <p className="label">ようこそ</p>
            <p className="username">{me.username} さん</p>
          </div>
          <button className="logout" onClick={onLogout}>
            ログアウト
          </button>
        </div>
        <p className="balance">
          残高: <strong>{me.balance.toLocaleString()}</strong> 円
        </p>
      </section>

      <TransferForm
        onTransferred={async () => {
          await onChange();
          await reloadHistory();
        }}
      />

      <HistoryList items={history} />
    </>
  );
}
