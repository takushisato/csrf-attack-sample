export default function HistoryList({ items }) {
  return (
    <section className="card">
      <h2>送金履歴</h2>
      {items.length === 0 ? (
        <p className="hint">履歴はまだありません。</p>
      ) : (
        <table className="history">
          <thead>
            <tr>
              <th>日時</th>
              <th>送金先</th>
              <th>金額</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td>{new Date(item.created_at).toLocaleString()}</td>
                <td>{item.to}</td>
                <td>{item.amount.toLocaleString()} 円</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
