"use client";
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const meals={1:['Pre: Bread + Honey + Banana + Whey','Post: Eggs + Toast','Lunch: Chicken 220g + Rice 100g','Snack: Yogurt + Fruit','Dinner: Oats Bowl'],2:['Pre: Bread + Jam + Banana + Whey','Post: Eggs + Potato','Lunch: Chicken + Rice + Rajma','Snack: Whey + Apple','Dinner: Paneer + Roti'],3:['Pre: Bread + Honey + Banana + Whey','Post: Eggs','Lunch: Paneer + Rice','Snack: Yogurt + Almonds','Dinner: Oats Bowl'],4:['High Carb Leg Day'],5:['Chicken Wrap Day'],6:['Home Food Flex Day'],7:['Recovery Day']};
const workouts={1:['Incline DB Press 4x8','Smith Incline 3x8','Lateral Raise 5x15'],2:['Pullups 4','Pulldown 4x10','Row 4x10'],3:['Hack Squat 4x8','RDL 4x8','Leg Curl 4x12'],4:['Upper Specialization'],5:['Arms + Delts'],6:['Cardio + Mobility'],7:['Rest']};

function Card({children}){return <div className='rounded-2xl shadow border p-4 bg-white'>{children}</div>}
function Btn({children,onClick,active}){return <button onClick={onClick} className={`px-4 py-2 rounded-xl border ${active?'bg-black text-white':'bg-white'}`}>{children}</button>}

export default function Page(){
const today=new Date().getDay()===0?7:new Date().getDay();
const [day,setDay]=useState(today); const [logs,setLogs]=useState({}); const [weights,setWeights]=useState([]); const [bw,setBw]=useState(''); const [tab,setTab]=useState('meals'); const [mode,setMode]=useState('bulk');
useEffect(()=>{const l=localStorage.getItem('logs');const w=localStorage.getItem('weights'); if(l) setLogs(JSON.parse(l)); if(w) setWeights(JSON.parse(w));},[]);
useEffect(()=>localStorage.setItem('logs',JSON.stringify(logs)),[logs]); useEffect(()=>localStorage.setItem('weights',JSON.stringify(weights)),[weights]);
const addLog=(ex,val)=>{if(!val)return; setLogs({...logs,[ex]:[...(logs[ex]||[]),{d:new Date().toLocaleDateString(),v:val}]})};
const addWeight=()=>{if(!bw)return; setWeights([...weights,{d:new Date().toLocaleDateString(),v:Number(bw)}]); setBw('')};
const avg=weights.length?(weights.reduce((a,b)=>a+b.v,0)/weights.length).toFixed(1):'-'; const latest=weights.length?weights[weights.length-1].v:'-'; const macros=mode==='bulk'?'155P / 320C / 60F':'170P / 220C / 55F';
return <main className='min-h-screen bg-gray-50 p-6'><div className='max-w-6xl mx-auto space-y-6'>
<h1 className='text-3xl font-bold'>OLYMPUS OS Production 🚀</h1>
<div className='grid md:grid-cols-4 gap-3'>{[['Day','Day '+day],['Latest BW',latest],['Avg BW',avg],['Mode',mode]].map((x,i)=><Card key={i}><div className='text-sm text-gray-500'>{x[0]}</div><div className='text-2xl font-bold'>{x[1]}</div></Card>)}</div>
<div className='flex flex-wrap gap-2'>{[1,2,3,4,5,6,7].map(d=><Btn key={d} onClick={()=>setDay(d)} active={day===d}>Day {d}</Btn>)}</div>
<div className='flex flex-wrap gap-2'>{['meals','workout','stats','coach'].map(t=><Btn key={t} onClick={()=>setTab(t)} active={tab===t}>{t}</Btn>)}</div>
{tab==='meals' && <Card><div className='space-y-2'>{meals[day].map((m,i)=><div key={i}>{m}</div>)}</div></Card>}
{tab==='workout' && <Card><div className='space-y-4'>{workouts[day].map((ex,i)=><WorkoutRow key={i} ex={ex} last={logs[ex]?.slice(-1)[0]?.v} onSave={addLog}/>)}</div></Card>}
{tab==='stats' && <div className='grid md:grid-cols-2 gap-4'><Card><ResponsiveContainer width='100%' height={260}><LineChart data={weights}><XAxis dataKey='d'/><YAxis/><Tooltip/><Line type='monotone' dataKey='v' stroke='#111827' strokeWidth={2}/></LineChart></ResponsiveContainer></Card><Card><input className='border p-2 rounded w-full mb-3' placeholder='Bodyweight kg' value={bw} onChange={e=>setBw(e.target.value)}/><Btn onClick={addWeight}>Log Weight</Btn><div className='mt-4'>Macros: {macros}</div></Card></div>}
{tab==='coach' && <Card><div className='flex gap-2 mb-4'><Btn onClick={()=>setMode('bulk')} active={mode==='bulk'}>Bulk</Btn><Btn onClick={()=>setMode('cut')} active={mode==='cut'}>Cut</Btn></div><div className='space-y-2'><div>Macros: {macros}</div><div>{mode==='bulk'?'If weight stalls 14d: +150 kcal':'If weak during cut: add refeed day'}</div></div></Card>}
</div></main>}

function WorkoutRow({ex,last,onSave}){const [val,setVal]=useState(''); return <div className='border-b pb-3'><div className='font-medium'>{ex}</div><input className='border p-2 rounded w-full my-2' placeholder='25kg x10' value={val} onChange={e=>setVal(e.target.value)}/><div className='flex gap-2 items-center'><Btn onClick={()=>{onSave(ex,val);setVal('')}}>Save</Btn><span className='text-sm text-gray-500'>Last: {last||'No log'}</span></div></div>}
