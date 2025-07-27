'use client';

import { useState, useEffect } from 'react';

export default function BudgetClient({ username }) {
  const storageKey = `budgetApp_${username}`;
  const [data, setData] = useState({
    budget: 0,
    categories: [],
    entries: [],
    goals: [],
  });
  const [loaded, setLoaded] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [type, setType] = useState('expense');
  const [cat, setCat] = useState('');
  const [goalText, setGoalText] = useState('');

  // Load saved data and ensure default arrays
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const p = JSON.parse(stored);
        setData({
          budget: p.budget ?? 0,
          categories: Array.isArray(p.categories) ? p.categories : [],
          entries: Array.isArray(p.entries) ? p.entries : [],
          goals: Array.isArray(p.goals) ? p.goals : [],
        });
      } catch (e) {
        console.error('Error parsing saved data', e);
      }
    }
    setLoaded(true);
  }, [storageKey]);

  // Save on any data change
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
    const value = parseFloat(amt);
    if (!desc.trim() || isNaN(value) || value <= 0 || !cat) {
      return alert('Complete all entry fields');
    }
    setData(prev => ({
      ...prev,
      entries: [...prev.entries, { desc: desc.trim(), amt: value, type, category: cat }],
    }));
    setDesc('');
    setAmt('');
    setCat('');
  };

  const delEntry = i => {
    setData(prev => ({
      ...prev,
      entries: prev.entries.filter((_, idx) => idx !== i),
    }));
  };

  const addGoal = () => {
    const g = goalText.trim();
    if (g) {
      setData(prev => ({
        ...prev,
        goals: [...prev.goals, { text: g, completed: false }],
      }));
      setGoalText('');
    }
  };

  const toggleGoal = i => {
    setData(prev => {
      const goals = [...prev.goals];
      goals[i] = { ...goals[i], completed: !goals[i].completed };
      return { ...prev, goals };
    });
  };

  const deleteGoal = i => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, idx) => idx !== i),
    }));
  };

  const editGoal = (i, newText) => {
    setData(prev => {
      const goals = [...prev.goals];
      goals[i].text = newText;
      return { ...prev, goals };
    });
  };

  const balance =
    data.budget +
    data.entries.filter(e => e.type === 'saving').reduce((sum, e) => sum + e.amt, 0) -
    data.entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amt, 0);

  return (
    <div className="container">
      <div className="card">
        <h3 className="subTitle">Set Budget</h3>
        <input
          type="number"
          value={data.budget}
          onChange={e =>
            setData(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))
          }
          placeholder="$ Total Budget"
        />
      </div>

      <div className="card">
        <h3 className="subTitle">Budget Categories</h3>
        <input
          type="text"
          value={newCat}
          onChange={e => setNewCat(e.target.value)}
          placeholder="New Category"
        />
        <button onClick={addCategory} className="addBtn">Add Category</button>
        <div class="custom-select">
        <select value={cat} onChange={e => setCat(e.target.value)}>
          <option value="">Select Category</option>
          {data.categories.map(c0 => (
            <option key={c0} value={c0}>
              {c0}
            </option>
          ))}
        </select>
        </div>
      </div>

      <div className="card">
        <h3 className="subTitle">Entries</h3>
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
        <button onClick={addEntry} className="addBtn">Add Entry</button>

        <ul className="entry-list">
          {Array.isArray(data.entries) &&
            data.entries.map((e, i) => (
              <li key={i} className="entry-item">
                {e.desc} | {e.type} | ${e.amt.toFixed(2)} | [{e.category}]
                <button onClick={() => delEntry(i)}>Delete</button>
              </li>
            ))}
        </ul>

        <div className="balance-box">
          Remaining Balance: ${balance.toFixed(2)}
        </div>
      </div>

      <div className="card">
        <h3 className="subTitle">Goals</h3>
        <input
          type="text"
          placeholder="Enter a goal"
          value={goalText}
          onChange={e => setGoalText(e.target.value)}
        />
        <button onClick={addGoal} className="addBtn">Add Goal</button>

        <ul className="entry-list">
          {Array.isArray(data.goals) &&
            data.goals.map((goal, i) => (
              <li key={i} className="entry-item">
                <div className="checkbox">
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleGoal(i)}
                />
                </div>
                <input
                  type="text"
                  value={goal.text}
                  onChange={e => editGoal(i, e.target.value)}
                  style={{ textDecoration: goal.completed ? 'line-through' : 'none' }}
                />
                <button classsName="deleteGoalBtn" onClick={() => deleteGoal(i)}>Delete</button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}