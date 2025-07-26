import React, { useState } from 'react';

function Chat() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleQuery = async () => {
    const q = question.toLowerCase();

    if (q.includes('top 5') && q.includes('sold')) {
      const res = await fetch('http://localhost:5000/api/order_items');
      const items = await res.json();

      const countMap = {};
      items.forEach(item => {
        const id = item.product_id;
        countMap[id] = (countMap[id] || 0) + Number(item.quantity);
      });

      const topProducts = Object.entries(countMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, qty]) => `Product ID: ${id} (Sold: ${qty})`)
        .join('\n');

      setAnswer(topProducts);
    } else if (q.includes('order') && q.match(/\d+/)) {
      const id = q.match(/\d+/)[0];
      const res = await fetch('http://localhost:5000/api/orders');
      const orders = await res.json();
      const order = orders.find(o => o.id === id);
      setAnswer(order ? `Order ${id} status: ${order.status || 'Not specified'}` : `No order found with ID ${id}`);
    } else if (q.includes('classic t-shirt')) {
      const res = await fetch('http://localhost:5000/api/inventory_items');
      const items = await res.json();
      const matching = items.filter(item => item.product_name?.toLowerCase().includes('classic t-shirt'));
      const total = matching.reduce((acc, item) => acc + Number(item.stock_quantity || 0), 0);
      setAnswer(`Total Classic T-Shirts in stock: ${total}`);
    } else {
      setAnswer("Sorry, I can't answer that yet.");
    }
  };

  return (
    <div>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
        style={{ width: '80%', padding: '0.5rem' }}
      />
      <button onClick={handleQuery} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
        Ask
      </button>
      <pre style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>{answer}</pre>
    </div>
  );
}

export default Chat;
