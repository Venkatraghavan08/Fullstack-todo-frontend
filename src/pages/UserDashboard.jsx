import React, { useEffect, useState } from 'react';

export default function UserDashboard({ token }) {
  const [tasks, setTasks] = useState([]);
  const [type, setType] = useState('leave');
  const [message, setMessage] = useState('');

  const API_BASE = "https://fullstack-todo-backend-1-99kc.onrender.com";
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const fetchTasks = async () => {
    const res = await fetch(`${API_BASE}/api/tasks/me`, { headers });
    const data = await res.json();
    if (res.ok) setTasks(data);
  };

  useEffect(() => { fetchTasks(); }, []);

  const updateStatus = async (id, status) => {
    const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status })
    });
    if (res.ok) setTasks(p => p.map(t => t._id === id ? { ...t, status } : t));
  };

  const submitRequest = async e => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/api/requests`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ type, message })
    });
    if (res.ok) {
      setType('leave');
      setMessage('');
      alert('Request submitted');
    }
  };

  return (
    <div className='card'>
      <h2>User Dashboard</h2>

      <h3>Your Tasks</h3>
      <div className='list'>
        {tasks.map(t => (
          <div key={t._id} className='item'>
            <div>
              <div><strong>{t.description}</strong></div>
              <div className='actions'>
                <span className={`badge ${t.status === 'completed' ? 'completed' : t.status === 'in-progress' ? 'progress' : 'pending'}`}>{t.status}</span>
                <select className='select' value={t.status} onChange={e => updateStatus(t._id, e.target.value)}>
                  <option value='pending'>Pending</option>
                  <option value='in-progress'>In Progress</option>
                  <option value='completed'>Completed</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 20 }}>New Request</h3>
      <form onSubmit={submitRequest} style={{ display: 'grid', gap: 10 }}>
        <select className='select' value={type} onChange={e => setType(e.target.value)}>
          <option value='leave'>Leave</option>
          <option value='compensation'>Compensation</option>
          <option value='other'>Other</option>
        </select>
        <textarea
          className='textarea'
          placeholder='Additional message...'
          rows='4'
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button className='primary' type='submit'>Submit Request</button>
      </form>
    </div>
  );
}
