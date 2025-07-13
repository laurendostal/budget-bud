'use client';

import { useState, useEffect } from 'react';

export default function BudgetClient({ username }) {
  const storageKey = `budgetApp_${username}`;

  const [data, setData] = useState({ budget: 0, categories: [], entries: [], goals: [] });
  const [loaded, setLoaded] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [type, setType] = useState('expense');
  const [cat, setCat] = useState('');
  const [goalText, setGoalText] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          setData(JSON.parse(stored));
        } catch {}
      }
      setLoaded(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (loaded && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }, [data, loaded, storageKey]);

  const addCategory = () => {
    const c = newCat.trim();
    if (c && !data.categories.includes(c)) {
      setData(prev => ({ ...prev, categories: [...prev.categories, c] }));
    }
    setNewCat('');
  };

  const addEntry = () => {
    const val = parseFloat(amt);
    if (!desc.trim() || isNaN(val) || val <= 0 || !cat) {
      return alert('Fill all fields correctly');
    }
    setData(prev => ({
      ...prev,
      entries: [...prev.entries, { desc: desc.trim(), amt: val, type, category: cat }],
    }));
    setDesc(''); setAmt(''); setCat('');
  };

  const delEntry = i =>
    setData(prev => ({
      ...prev,
      entries: prev.entries.filter((_, idx) => idx !== i),
    }));

  const addGoal = () => {
    const g = goalText.trim();
    if (g) {
      setData(prev => ({
        ...prev,
        goals: [...(prev.goals || []), { text: g, completed: false }]
      }));
      setGoalText('');
    }
  };

  const toggleGoal = i => {
    setData(prev => {
      const goals = [...(prev.goals || [])];
      goals[i] = { ...goals[i], completed: !goals[i].completed };
      return { ...prev, goals };
    });
  };

  const deleteGoal = i => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, idx) => idx !== i)
    }));
  };

  const editGoal = (i, newText) => {
    setData(prev => {
      const goals = [...(prev.goals || [])];
      goals[i].text = newText;
      return { ...prev, goals };
    });
  };

  const balance =
    data.budget +
    data.entries.filter(e => e.type === 'saving').reduce((sum, e) => sum + e.amt, 0) -
    data.entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amt, 0);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Your Budget</h3>
      <input
        type="number"
        value={data.budget}
        onChange={e => setData(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
      />
      <h3>Categories</h3>
      <input
        type="text"
        value={newCat}
        onChange={e => setNewCat(e.target.value)}
        placeholder="New category"
      />
      <button onClick={addCategory}>Add Category</button>
      <select value={cat} onChange={e => setCat(e.target.value)}>
        <option value="">Select category</option>
        {data.categories.map(c0 => <option key={c0} value={c0}>{c0}</option>)}
      </select>
      <h3>Add Entry</h3>
      <input
        type="text"
        placeholder="Description"
        value={desc}
        onChange={e => setDesc(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amt}
        onChange={e => setAmt(e.target.value)}
      />
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="expense">Expense</option>
        <option value="saving">Saving</option>
      </select>
      <button onClick={addEntry}>Add Entry</button>

      <h3>Entries</h3>
      <ul>
        {data.entries.map((e, i) => (
          <li key={i}>
            {e.type} — {e.desc} (${e.amt.toFixed(2)}) [{e.category}]
            <button onClick={() => delEntry(i)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Remaining Balance: ${balance.toFixed(2)}</h3>

      <h3>Budget Goals</h3>
      <input
        type="text"
        value={goalText}
        onChange={e => setGoalText(e.target.value)}
        placeholder="Enter a goal"
      />
      <button onClick={addGoal}>Add Goal</button>

      <ul>
        {(data.goals || []).map((goal, i) => (
          <li key={i}>
            <input
              type="checkbox"
              checked={goal.completed}
              onChange={() => toggleGoal(i)}
            />
            <input
              type="text"
              value={goal.text}
              onChange={e => editGoal(i, e.target.value)}
              style={{ textDecoration: goal.completed ? 'line-through' : 'none' }}
            />
            <button onClick={() => deleteGoal(i)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}