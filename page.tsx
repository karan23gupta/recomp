import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const meals={1:['Pre: Bread + Honey + Banana + Whey','Post: Eggs + Toast','Lunch: Chicken 220g + Rice 100g','Snack: Yogurt + Fruit','Dinner: Oats Bowl'],2:['Pre: Bread + Jam + Banana + Whey','Post: Eggs + Potato','Lunch: Chicken + Rice + Rajma','Snack: Whey + Apple','Dinner: Paneer + Roti'],3:['Pre: Bread + Honey + Banana + Whey','Post: Eggs','Lunch: Paneer + Rice','Snack: Yogurt + Almonds','Dinner: Oats Bowl'],4:['High Carb Leg Day Meals'],5:['Chicken Wrap Day Meals'],6:['Home Food Flex Day'],7:['Recovery Day Meals']};
const workouts={1:['Incline DB Press 4x8','Smith Incline 3x8','Lateral Raise 5x15'],2:['Pullups 4','Pulldown 4x10','Row 4x10'],3:['Hack Squat 4x8','RDL 4x8','Curl 4x12'],4:['Upper Specialization'],5:['Arms + Delts'],6:['Cardio + Mobility'],7:['Rest']};

export default function App(){
const today=new Date().getDay()===0?7:new Date().getDay();
const [day,setDay]=useState(today);
const [logs,setLogs]=useState({});
const [input,setInput]=useState({});
const [weights,setWeights]=useState([]);
const [bw,setBw]=useState('');
const [mode,setMode]=useState('bulk');
const [sleep,setSleep]=useState('7.5');
const [water,setWater]=useState(0);
const [timer,setTimer]=useState(90);
const [run,setRun]=useState(false);
useEffect(()=>{const l=localStorage.getItem('logs');const w=localStorage.getItem('weights');if(l)setLogs(JSON.parse(l));if(w)setWeights(JSON.parse(w));},[]);
useEffect(()=>localStorage.setItem('logs',JSON.stringify(logs)),[logs]);
useEffect(()=>localStorage.setItem('weights',JSON.stringify(weights)),[weights]);
useEffect(()=>{if(!run)return; if(timer<=0){setRun(false);return;} const t=setTimeout(()=>setTimer(timer-1),1000); return ()=>clearTimeout(t)},[run,timer]);
const addLog=(ex)=>{if(!input[ex])return;setLogs({...logs,[ex]:[...(logs[ex]||[]),{d:new Date().toLocaleDateString(),v:input[ex]}]});setInput({...input,[ex]:''})};
const addWeight=()=>{if(!bw)return;setWeights([...weights,{d:new Date().toLocaleDateString(),v:Number(bw)}]);setBw('')};
const avg=weights.length?(weights.reduce((a,b)=>a+b.v,0)/weights.length).toFixed(1):'-';
const latest=weights.length?weights[weights.length-1].v:'-';
const macros=mode==='bulk'?'155P / 320C / 60F':'170P / 220C / 55F';
const readiness=Math.min(100,Math.round((Number(sleep)/8)*50+water*10));
return <div className='p-6 max-w-6xl mx-auto space-y-6'>
<h1 className='text-3xl font-bold'>V6.1 OLYMPUS OS 👑⚡</h1>
<div className='grid md:grid-cols-6 gap-3'>
{[['Day','Day '+day],['Latest BW',latest],['Avg BW',avg],['Mode',mode],['Readiness',readiness+'%'],['Timer',timer+'s']].map((x,i)=><Card key={i}><CardContent className='p-3'><div className='text-sm text-muted-foreground'>{x[0]}</div><div className='text-2xl font-bold'>{x[1]}</div></CardContent></Card>)}
</div>
<div className='flex gap-2 flex-wrap'>{[1,2,3,4,5,6,7].map(d=><Button key={d} variant={day===d?'default':'outline'} onClick={()=>setDay(d)}>Day {d}</Button>)}</div>
<Tabs defaultValue='meals'>
<TabsList><TabsTrigger value='meals'>Meals</TabsTrigger><TabsTrigger value='workout'>Workout</TabsTrigger><TabsTrigger value='stats'>Stats</TabsTrigger><TabsTrigger value='coach'>Coach</TabsTrigger></TabsList>
<TabsContent value='meals'><Card><CardContent className='p-4 space-y-2'>{meals[day].map((m,i)=><div key={i}>{m}</div>)}</CardContent></Card></TabsContent>
<TabsContent value='workout'><Card><CardContent className='p-4 space-y-3'><div className='flex gap-2'><Button onClick={()=>{setTimer(90);setRun(true)}}>90s</Button><Button onClick={()=>{setTimer(180);setRun(true)}}>180s</Button><Button onClick={()=>setRun(false)} variant='outline'>Pause</Button></div>{workouts[day].map((ex,i)=><div key={i} className='border-b pb-2'><div>{ex}</div><div className='flex gap-2 mt-2'><Input value={input[ex]||''} onChange={e=>setInput({...input,[ex]:e.target.value})} placeholder='25kg x10'/><Button onClick={()=>addLog(ex)}>Save</Button></div><div className='text-sm text-muted-foreground'>Last: {logs[ex]?.slice(-1)[0]?.v || 'No log'}</div></div>)}</CardContent></Card></TabsContent>
<TabsContent value='stats'><div className='grid md:grid-cols-2 gap-4'><Card><CardContent className='p-4'><ResponsiveContainer width='100%' height={240}><LineChart data={weights}><XAxis dataKey='d'/><YAxis/><Tooltip/><Line type='monotone' dataKey='v' strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer></CardContent></Card><Card><CardContent className='p-4 space-y-3'><Input placeholder='Bodyweight kg' value={bw} onChange={e=>setBw(e.target.value)}/><Button onClick={addWeight}>Log Weight</Button><div>Macros: {macros}</div></CardContent></Card></div></TabsContent>
<TabsContent value='coach'><Card><CardContent className='p-4 space-y-3'><div className='flex gap-2'><Button onClick={()=>setMode('bulk')}>Bulk</Button><Button variant='outline' onClick={()=>setMode('cut')}>Cut</Button></div><div className='flex gap-2'><Input value={sleep} onChange={e=>setSleep(e.target.value)} placeholder='Sleep hrs'/><Button onClick={()=>setWater(water+1)}>+ Water</Button></div><div>Water: {water} L</div><div>Macros: {macros}</div><div>{mode==='bulk'?'If BW stalls 14d: +150 kcal':'If weak during cut: add refeed day'}</div><div>{readiness>80?'Train heavy today':'Pump / lighter session today'}</div></CardContent></Card></TabsContent>
</Tabs>
</div>
}
