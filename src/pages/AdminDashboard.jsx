import React, { useEffect, useState } from 'react';
export default function AdminDashboard({ token }){
  const [requests,setRequests]=useState([]);
  const [tasks,setTasks]=useState([]);
  const [users,setUsers]=useState([]);
  const [desc,setDesc]=useState(''); const [assignedTo,setAssignedTo]=useState('');
  const [loading,setLoading]=useState(true); const [error,setError]=useState(null);
  const headers={Authorization:`Bearer ${token}`,'Content-Type':'application/json'};
  const fetchAll=async()=>{try{setLoading(true);setError(null);
    const t=await fetch('https://fullstack-todo-backend-1-99kc.onrender.com/api/tasks/me',{headers:{Authorization:`Bearer ${token}`}});const tData=await t.json();if(!t.ok) throw new Error(tData.error||'Failed tasks');setTasks(tData);
    const r=await fetch('https://fullstack-todo-backend-1-99kc.onrender.com/api/requests',{headers:{Authorization:`Bearer ${token}`}});const rData=await r.json();if(!r.ok) throw new Error(rData.error||'Failed requests');setRequests(rData);
    const map=new Map();tData.forEach(x=>{ if(x.assignedTo) map.set(x.assignedTo._id,x.assignedTo.username);});rData.forEach(x=>{ if(x.createdBy) map.set(x.createdBy._id||x.createdBy, x.createdBy.username||x.createdBy);});setUsers(Array.from(map.entries()).map(([id,username])=>({id,username})));
  }catch(e){setError(e.message);}finally{setLoading(false);}}
  useEffect(()=>{fetchAll();},[]);
  const assignTask=async e=>{e.preventDefault();try{const res=await fetch('https://fullstack-todo-backend-1-99kc.onrender.com/api/tasks',{method:'POST',headers,body:JSON.stringify({description:desc,assignedTo})});const data=await res.json();if(!res.ok) throw new Error(data.error||'Failed to assign');setDesc('');setAssignedTo('');setTasks(p=>[data,...p]);}catch(e){alert(e.message);}}
  const approve=async id=>{const res=await fetch(`https://fullstack-todo-backend-1-99kc.onrender.com/api/requests/${id}`,{method:'PUT',headers,body:JSON.stringify({status:'approved'})});if(res.ok) setRequests(p=>p.map(r=>r._id===id?{...r,status:'approved'}:r));}
  return(<div className='card'><h2>Admin Dashboard</h2>{loading&&<div className='badge progress'>Loading...</div>}{error&&<div className='badge rejected'>{error}</div>}
    <h3 style={{marginTop:12}}>Assign Task</h3>
    <form onSubmit={assignTask} style={{display:'grid',gap:10}}>
      <input className='input' placeholder='Task description' value={desc} onChange={e=>setDesc(e.target.value)}/>
      <select className='select' value={assignedTo} onChange={e=>setAssignedTo(e.target.value)}>
        <option value=''>Select user</option>{users.map(u=><option key={u.id} value={u.id}>{u.username}</option>)}
      </select>
      <button className='primary' type='submit'>Assign</button>
    </form>
    <h3 style={{marginTop:20}}>All Tasks</h3>
    <div className='list'>{tasks.map(t=>(<div key={t._id} className='item'><div><div><strong>{t.description}</strong></div><div className='actions'><span className={`badge ${t.status==='completed'?'completed':t.status==='in-progress'?'progress':'pending'}`}>{t.status}</span><small>Assigned to: {t.assignedTo?.username||'unknown'}</small></div></div></div>))}</div>
    <h3 style={{marginTop:20}}>User Requests</h3>
    <div className='list'>{requests.map(r=>(<div key={r._id} className='item'><div><div><strong>{r.type}</strong> — {r.message}</div><span className={`badge ${r.status}`}>{r.status}</span></div>{r.status==='pending'&&<button className='ghost' onClick={()=>approve(r._id)}>Approve</button>}</div>))}</div>
  </div>);
}