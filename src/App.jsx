import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

export default function App(){
  const [token,setToken]=useState(localStorage.getItem('token'));
  const [user,setUser]=useState(()=>{ const u=localStorage.getItem('user'); return u? JSON.parse(u): null;});
  useEffect(()=>{ if(token) localStorage.setItem('token',token); else localStorage.removeItem('token'); },[token]);
  const onLogin=(t,u)=>{ setToken(t); setUser(u); localStorage.setItem('user',JSON.stringify(u)); };
  const onLogout=()=>{ setToken(null); setUser(null); localStorage.removeItem('user'); };
  return (<Router>
    <Navbar user={user} onLogout={onLogout}/>
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Login onLogin={onLogin}/>}/>
        <Route path="/admin" element={ token && user?.role==='admin'? <AdminDashboard token={token}/> : <Navigate to='/'/> }/>
        <Route path="/user" element={ token && user?.role==='user'? <UserDashboard token={token}/> : <Navigate to='/'/> }/>
      </Routes>
    </div>
  </Router>);
}