import { useState, useEffect, useRef } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const FIREBASE_CONFIG = {
	apiKey: "AIzaSyDCbEeDBLWOMh4UEJqCqB6idTbcWkJJwiQ",
	projectId: "actionmodel-quiz",
};
const MOD_PASSWORD = "actionmod2026";
const FB = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents`;
const AK = FIREBASE_CONFIG.apiKey;

// ─── QUESTION BANK ────────────────────────────────────────────────────────────
const DEFAULT_QUESTIONS = [
	{ id:1,  type:"mcq", category:"Core Concept", difficulty:"Recruit",
		question:"What does LAM stand for in the Action Model ecosystem?",
		options:["Large Automated Machine","Large Action Model","Layered Automation Module","Language Action Module"],
		answer:1, explanation:"LAM stands for Large Action Model — the next evolution beyond LLMs that can actually perform tasks, not just generate text." },
	{ id:2,  type:"mcq", category:"Core Concept", difficulty:"Recruit",
		question:"What is the key difference between an LLM and a LAM?",
		options:["LLMs are faster","LAMs can perform real computer tasks, LLMs can only generate text","LLMs support blockchain","LAMs are open source"],
		answer:1, explanation:"LLMs are advisors trapped behind a text box. LAMs actually execute tasks — clicking, typing, navigating — just like a human would." },
	{ id:3,  type:"tf",  category:"Core Concept", difficulty:"Recruit",
		question:"Action Model is the world's first community-owned Large Action Model.",
		options:["True","False"], answer:0,
		explanation:"Correct — contributors who train and build the AI earn ownership through $LAM tokens." },
	{ id:4,  type:"mcq", category:"Core Concept", difficulty:"Vanguard",
		question:"How many jobs does Action Model say are at risk from AI automation by 2030?",
		options:["500 million","1 billion","2 billion","250 million"],
		answer:1, explanation:"1 billion people employed behind computers face displacement by 2030, as AI costs 95% less than human workers." },
	{ id:5,  type:"tf",  category:"Core Concept", difficulty:"Recruit",
		question:"Action Model requires programming knowledge to use the Actionist app.",
		options:["True","False"], answer:1,
		explanation:"False — Actionist requires no programming. Just describe what you want done and it acts like a human employee." },
	{ id:6,  type:"mcq", category:"Core Concept", difficulty:"OG",
		question:"What analogy does Action Model use to describe the Action Tree?",
		options:["Wikipedia for websites","Google Maps for GUI interactions","GitHub for automation scripts","Bloomberg for financial data"],
		answer:1, explanation:"The Action Tree is 'Google Maps for GUI interactions' — it knows every button, form, and workflow across the internet." },
	{ id:7,  type:"tf",  category:"Tokenomics", difficulty:"Recruit",
		question:"Every GUI action performed by the LAM consumes $LAM tokens as fuel.",
		options:["True","False"], answer:0,
		explanation:"$LAM tokens are the fuel powering every action in the Action Loop, creating real utility and constant demand." },
	{ id:8,  type:"mcq", category:"Tokenomics", difficulty:"Vanguard",
		question:"What percentage of used $LAM tokens are burned?",
		options:["10%","20%","34%","50%"],
		answer:2, explanation:"34% of used tokens are burned, creating deflationary pressure as usage grows and supply decreases." },
	{ id:9,  type:"mcq", category:"Tokenomics", difficulty:"Vanguard",
		question:"What is ActionFi's maximum earning multiplier for training on partner platforms?",
		options:["10x","25x","50x","100x"],
		answer:2, explanation:"ActionFi bounties offer up to 50x multipliers for training on high-value partner platforms." },
	{ id:10, type:"tf",  category:"Tokenomics", difficulty:"Vanguard",
		question:"$LAM token holders have the right to vote on platform decisions.",
		options:["True","False"], answer:0,
		explanation:"Governance Rights are a core $LAM utility — token holders vote on platform decisions." },
	{ id:11, type:"mcq", category:"Tokenomics", difficulty:"OG",
		question:"What does the $LAM burn mechanism primarily achieve?",
		options:["Rewards validators","Creates deflationary pressure on supply","Funds the foundation","Pays for cloud infrastructure"],
		answer:1, explanation:"Burning 34% of used tokens means as usage grows, circulating supply decreases — deflationary pressure." },
	{ id:12, type:"tf",  category:"Tokenomics", difficulty:"OG",
		question:"$LAM tokens can only be earned through training — they cannot be purchased on the open market.",
		options:["True","False"], answer:1,
		explanation:"False — $LAM can be both earned through contributions AND traded on open markets, giving it dual utility." },
	{ id:13, type:"mcq", category:"Action Loop", difficulty:"Recruit",
		question:"What is the correct order of the Action Loop?",
		options:["Decide → View → Action → Loop","View Screen → Decide → Action → Loop","Action → View → Loop → Decide","Loop → Decide → View → Action"],
		answer:1, explanation:"View Screen → Decide (using the Action Tree) → Execute Action → Loop back until task is complete." },
	{ id:14, type:"mcq", category:"Action Loop", difficulty:"OG",
		question:"What does the LAM do when it encounters a GUI it hasn't seen before?",
		options:["It stops and asks for help","Uses its Action Tree knowledge to infer likely interactions","Downloads an update","Falls back to natural language only"],
		answer:1, explanation:"The Action Tree's knowledge of GUI patterns lets the LAM infer interactions on unfamiliar interfaces." },
	{ id:15, type:"mcq", category:"Technology", difficulty:"Vanguard",
		question:"What does the Action Tree use to build its knowledge?",
		options:["API integrations","Web scraping bots","User training contributions (Action Branches)","Manual coding by the team"],
		answer:2, explanation:"The Action Tree grows through user-contributed training journeys called Action Branches." },
	{ id:16, type:"mcq", category:"Technology", difficulty:"OG",
		question:"What unique advantage does Action Model have over traditional automation tools?",
		options:["Requires APIs","Only works on Windows","Works with any app with a GUI — no APIs needed","Limited to browsers"],
		answer:2, explanation:"Universal compatibility — Action Model works with ANY software that has a GUI, requiring no APIs at all." },
	{ id:17, type:"tf",  category:"Technology", difficulty:"Recruit",
		question:"The more people train the LAM, the smarter it becomes due to network effects.",
		options:["True","False"], answer:0,
		explanation:"Every user interaction improves the model. This network effect creates an insurmountable moat against competitors." },
	{ id:18, type:"mcq", category:"Technology", difficulty:"OG",
		question:"What does 'blockchain-verified actions' mean in the Action Model context?",
		options:["All actions are on Ethereum","Actions are verified before execution","Execution is transparent, auditable, and cryptographically secured","The LAM mines crypto while working"],
		answer:2, explanation:"Every task the LAM performs is transparent, auditable, and secured with cryptographic verification." },
	{ id:19, type:"mcq", category:"Ecosystem", difficulty:"Recruit",
		question:"What is the Actionist app best described as?",
		options:["A crypto wallet","A browser extension","A desktop app that acts as your AI employee","A staking dashboard"],
		answer:2, explanation:"The Actionist desktop app transforms your computer into an AI-powered workforce." },
	{ id:20, type:"tf",  category:"Ecosystem", difficulty:"Recruit",
		question:"The Action Model browser extension can run passively in the background while you browse.",
		options:["True","False"], answer:0,
		explanation:"Passive Training mode earns tokens automatically in the background while you browse normally." },
	{ id:21, type:"mcq", category:"Ecosystem", difficulty:"Vanguard",
		question:"Which of these is a mode available in the Actionist app?",
		options:["Mining Mode","Cloud VPC Mode","Staking Mode","Bridge Mode"],
		answer:1, explanation:"Cloud VPC Mode lets Actionist run 24/7 in cloud virtual machines with multiple parallel agents." },
	{ id:22, type:"tf",  category:"Ecosystem", difficulty:"OG",
		question:"The Actionist app can only automate tasks within a web browser.",
		options:["True","False"], answer:1,
		explanation:"False — Actionist works across any software with a GUI, seamlessly navigating between different apps." },
	{ id:23, type:"mcq", category:"Ecosystem", difficulty:"OG",
		question:"What does ActionFi primarily incentivize?",
		options:["Holding $LAM long-term","Training on specific high-value partner platforms for boosted rewards","Referring new users only","Running validator nodes"],
		answer:1, explanation:"ActionFi creates targeted bounties with up to 50x multipliers to incentivize training on partner platforms." },
	{ id:24, type:"mcq", category:"Community", difficulty:"Recruit",
		question:"How does Action Model describe the traditional Big Tech AI model?",
		options:["Collaborative and fair","You provide data → Big Tech builds AI → They profit → You get displaced","Open source","Users own the models"],
		answer:1, explanation:"Big Tech takes user data, builds AI, profits, then displaces the same workers whose data trained the system." },
	{ id:25, type:"tf",  category:"Community", difficulty:"Recruit",
		question:"In Action Model's model, contributors who train the AI earn ownership through $LAM tokens.",
		options:["True","False"], answer:0,
		explanation:"This is the core flip — instead of Big Tech owning everything, contributors earn ownership via $LAM tokens." },
	{ id:26, type:"mcq", category:"Community", difficulty:"Vanguard",
		question:"What are the four ways to participate in the Action Model ecosystem?",
		options:["Trade, Stake, Hold, Burn","Train the LAM, ActionFi Bounties, Create Workflows, Spread the Word","Mine, Validate, Bridge, Govern","Buy, Sell, Stake, Burn"],
		answer:1, explanation:"Train the LAM, ActionFi Bounties (up to 50x), Create Workflows (marketplace), and Spread the Word (referrals)." },
	{ id:27, type:"mcq", category:"Community", difficulty:"OG",
		question:"What makes Action Model's community moat 'insurmountable'?",
		options:["Patent protections","Being first to market","Network effect: more trainers = smarter AI = more value = more trainers","Bigger compute than Big Tech"],
		answer:2, explanation:"The flywheel: more training → smarter LAM → more value → more contributors. Self-reinforcing loop." },
	{ id:28, type:"mcq", category:"Marketplace", difficulty:"Vanguard",
		question:"How do workflow creators earn income on the Action Model marketplace?",
		options:["One-time listing fee","They earn $LAM every time their workflow is used","Fixed monthly salary","Ad revenue"],
		answer:1, explanation:"Workflow creators earn $LAM every time their automation is used — true passive income from the creator economy." },
	{ id:29, type:"tf",  category:"Marketplace", difficulty:"Vanguard",
		question:"The Action Model marketplace allows anyone to buy and sell automation workflows.",
		options:["True","False"], answer:0, explanation:"The marketplace is an open creator economy — build automations, sell them, earn $LAM per use." },
	{ id:30, type:"mcq", category:"Core Concept", difficulty:"OG",
		question:"What is Action Model's stated end goal?",
		options:["Most profitable AI company","Replace all human workers","The unstoppable, community-owned automation layer of the internet","Largest token by market cap"],
		answer:2, explanation:"'The unstoppable, community-owned automation layer of the internet' — AI built by the people, owned by the people." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const shuffle = arr => { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const fmt = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
const genCode = () => "ACT-" + Array.from({length:4},()=>"ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random()*32)]).join("");

function pickQuestions(difficulty, extras=[]) {
	const all = [...DEFAULT_QUESTIONS, ...extras];
	const pool = difficulty==="all" ? all : all.filter(q=>q.difficulty===difficulty);
	return shuffle(pool).slice(0,10);
}

const DIFF = {
	Recruit:  { color:"#34d399", icon:"🌱", desc:"Basics & core concepts" },
	Vanguard: { color:"#a78bfa", icon:"⚡", desc:"Tokenomics & ecosystem" },
	OG:       { color:"#f59e0b", icon:"👑", desc:"Deep knowledge only" },
};
const CAT_COLORS = {
	"Core Concept":"#a78bfa","Tokenomics":"#f59e0b","Token":"#f59e0b",
	"Action Loop":"#f472b6","Technology":"#34d399","Ecosystem":"#60a5fa",
	"Community":"#fb923c","Marketplace":"#e879f9",
};

// ─── Firebase REST ─────────────────────────────────────────────────────────────
async function fbGet(col) {
	try {
		const r = await fetch(`${FB}/${col}?key=${AK}`);
		if (!r.ok) return [];
		const d = await r.json();
		if (!d.documents) return [];
		return d.documents.map(doc => {
			const id = doc.name.split("/").pop();
			const out = { _id:id };
			for (const [k,v] of Object.entries(doc.fields||{})) {
				out[k] = v.stringValue ?? (v.integerValue!=null ? Number(v.integerValue) : null) ?? v.booleanValue ?? null;
			}
			return out;
		});
	} catch { return []; }
}
async function fbPost(col, fields) {
	try {
		const body = { fields:{} };
		for (const [k,v] of Object.entries(fields)) {
			if (typeof v==="string") body.fields[k]={stringValue:v};
			else if (typeof v==="number") body.fields[k]={integerValue:String(v)};
			else if (typeof v==="boolean") body.fields[k]={booleanValue:v};
		}
		const r = await fetch(`${FB}/${col}?key=${AK}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
		return r.ok;
	} catch { return false; }
}
async function fbDelete(col, id) {
	try { const r=await fetch(`${FB}/${col}/${id}?key=${AK}`,{method:"DELETE"}); return r.ok; }
	catch { return false; }
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
	// screens: home | freePlay | tournament | quiz | result | freeLeaderboard | tourLeaderboard | modLogin | modDash
	const [screen, setScreen]           = useState("home");
	const [mode, setMode]               = useState(null); // "free" | "tournament"
	const [nameInput, setNameInput]     = useState("");
	const [playerName, setPlayerName]   = useState("");

	// Free play
	const [freeDiff, setFreeDiff]       = useState(null);

	// Tournament
	const [codeInput, setCodeInput]     = useState("");
	const [codeError, setCodeError]     = useState("");
	const [activeTour, setActiveTour]   = useState(null); // { name, code, difficulty }

	// Quiz state
	const [questions, setQuestions]     = useState([]);
	const [difficulty, setDifficulty]   = useState(null);
	const [current, setCurrent]         = useState(0);
	const [selected, setSelected]       = useState(null);
	const [confirmed, setConfirmed]     = useState(false);
	const [score, setScore]             = useState(0);
	const [answers, setAnswers]         = useState([]);
	const [timeLeft, setTimeLeft]       = useState(20);
	const [totalTime, setTotalTime]     = useState(0);
	const [saving, setSaving]           = useState(false);
	const [saved, setSaved]             = useState(false);

	// Leaderboards
	const [freeBoard, setFreeBoard]     = useState([]);
	const [tourBoard, setTourBoard]     = useState([]);
	const [lbLoading, setLbLoading]     = useState(false);
	const [tourFilter, setTourFilter]   = useState("all");

	// Mod
	const [modPw, setModPw]             = useState("");
	const [modError, setModError]       = useState("");
	const [isMod, setIsMod]             = useState(false);
	const [modTab, setModTab]           = useState("tournaments");
	const [tournaments, setTournaments] = useState([]);
	const [customQs, setCustomQs]       = useState([]);
	const [newTour, setNewTour]         = useState({ name:"", code:"", difficulty:"Recruit" });
	const [newQ, setNewQ]               = useState({ type:"mcq", category:"Core Concept", difficulty:"Recruit", question:"", options:["","","",""], answer:0, explanation:"" });
	const [modLoading, setModLoading]   = useState(false);

	const [toast, setToast]             = useState(null);
	const timerRef                      = useRef(null);
	const totalRef                      = useRef(null);

	const isConfigured = FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY";

	const showToast = (msg, type="info") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

	// ── Timers ──
	useEffect(() => {
		if (screen!=="quiz"||confirmed) return;
		setTimeLeft(20);
		timerRef.current = setInterval(()=>{
			setTimeLeft(t=>{ if(t<=1){clearInterval(timerRef.current);doConfirm(null,true);return 0;} return t-1; });
		},1000);
		return ()=>clearInterval(timerRef.current);
	},[current,screen,confirmed]);

	useEffect(()=>{
		if(screen!=="quiz") return;
		totalRef.current = setInterval(()=>setTotalTime(t=>t+1),1000);
		return ()=>clearInterval(totalRef.current);
	},[screen]);

	// ── Quiz logic ──
	const doConfirm = (sel, timedOut=false) => {
		clearInterval(timerRef.current);
		setConfirmed(true);
		const q = questions[current];
		const correct = !timedOut && sel===q.answer;
		const tl = timedOut?0:timeLeft;
		const pts = correct?(tl>=15?100:tl>=10?80:tl>=5?60:40):0;
		setScore(s=>s+pts);
		setAnswers(a=>[...a,{questionId:q.id,selected:sel,correct,timedOut,pts}]);
	};

	const handleConfirm = () => { if(selected===null||confirmed)return; doConfirm(selected,false); };

	const handleNext = () => {
		setSelected(null); setConfirmed(false);
		if(current+1<questions.length) setCurrent(c=>c+1);
		else { clearInterval(totalRef.current); setScreen("result"); }
	};

	const launchQuiz = (diff, qs, playerN) => {
		setPlayerName(playerN); setDifficulty(diff); setQuestions(qs);
		setCurrent(0); setScore(0); setAnswers([]); setTotalTime(0); setSaved(false);
		setScreen("quiz");
	};

	// ── Free play ──
	const startFree = (diff) => {
		if(!nameInput.trim()) return;
		setMode("free"); setFreeDiff(diff);
		launchQuiz(diff, pickQuestions(diff, customQs), nameInput.trim());
	};

	// ── Tournament join ──
	const joinTournament = async () => {
		setCodeError("");
		if(!nameInput.trim()) { setCodeError("Enter your name first"); return; }
		if(!codeInput.trim()) { setCodeError("Enter a tournament code"); return; }
		const code = codeInput.toUpperCase().trim();
		if(isConfigured) {
			const tours = await fbGet("tournaments");
			const found = tours.find(t=>t.code===code);
			if(!found) { setCodeError("Code not found. Check with your mod."); return; }
			setActiveTour(found);
			setMode("tournament");
			launchQuiz(found.difficulty||"Recruit", pickQuestions(found.difficulty||"Recruit", customQs), nameInput.trim());
		} else {
			setActiveTour({ name:"Demo Tournament", code, difficulty:"Recruit" });
			setMode("tournament");
			launchQuiz("Recruit", pickQuestions("Recruit",[]), nameInput.trim());
			showToast("Demo mode — configure Firebase for real tournaments","info");
		}
	};

	// ── Save score ──
	const handleSave = async () => {
		if(saved||saving) return;
		setSaving(true);
		const correct = answers.filter(a=>a.correct).length;
		const entry = { name:playerName, score, time:totalTime, difficulty, correct, timestamp:Date.now() };
		if(mode==="tournament") {
			entry.tournament = activeTour?.code||"";
			entry.tournamentName = activeTour?.name||"";
		}
		const col = mode==="tournament" ? "tourLeaderboard" : "freeLeaderboard";
		if(isConfigured) {
			const ok = await fbPost(col, entry);
			if(ok){showToast("Score saved! 🏆","success");setSaved(true);}
			else showToast("Save failed — check Firebase config","error");
		} else {
			if(mode==="tournament") setTourBoard(p=>[...p,entry].sort((a,b)=>b.score-a.score||a.time-b.time));
			else setFreeBoard(p=>[...p,entry].sort((a,b)=>b.score-a.score||a.time-b.time));
			setSaved(true); showToast("Saved locally","info");
		}
		setSaving(false);
		if(mode==="tournament"){
			setScreen("tourLeaderboard");
			if(isConfigured) loadTourBoard(activeTour?.code);
		} else {
			setScreen("freeLeaderboard");
			if(isConfigured) loadFreeBoard();
		}
	};

	// ── Leaderboards ──
	const loadFreeBoard = async () => {
		setLbLoading(true);
		if(isConfigured){
			const d = await fbGet("freeLeaderboard");
			setFreeBoard(d.sort((a,b)=>b.score-a.score||a.time-b.time).slice(0,20));
		}
		setLbLoading(false);
	};

	const loadTourBoard = async (filterCode="all") => {
		setLbLoading(true);
		if(isConfigured){
			const d = await fbGet("tourLeaderboard");
			const filtered = filterCode==="all" ? d : d.filter(e=>e.tournament===filterCode);
			setTourBoard(filtered.sort((a,b)=>b.score-a.score||a.time-b.time).slice(0,20));
		}
		setLbLoading(false);
	};

	// ── Share ──
	const handleShare = () => {
		const pct = Math.round((answers.filter(a=>a.correct).length/questions.length)*100);
		const emoji = pct>=80?"🏆":pct>=60?"⚡":"📚";
		const tourLine = mode==="tournament"&&activeTour ? `\nTournament: ${activeTour.name} (${activeTour.code})` : "";
		const text = `${emoji} I scored ${score} pts (${pct}% correct) on the Action Model LAM Quiz!\nDifficulty: ${difficulty} | Time: ${fmt(totalTime)}${tourLine}\n\nTest your knowledge → actionmodel.com\n\n#ActionModel #LAM #Web3`;
		if(navigator.clipboard) navigator.clipboard.writeText(text);
		window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,"_blank");
	};

	// ── Mod ──
	const handleModLogin = () => {
		if(modPw===MOD_PASSWORD){setIsMod(true);setModError("");setScreen("modDash");loadModData();}
		else setModError("Wrong password");
	};
	const loadModData = async () => {
		setModLoading(true);
		if(isConfigured){
			const [qs,tours]=await Promise.all([fbGet("customQuestions"),fbGet("tournaments")]);
			setCustomQs(qs); setTournaments(tours);
		}
		setModLoading(false);
	};
	const createTournament = async () => {
		if(!newTour.name||!newTour.code){showToast("Name and code required","error");return;}
		const entry={...newTour,code:newTour.code.toUpperCase(),createdAt:Date.now()};
		if(isConfigured){await fbPost("tournaments",entry);showToast("Tournament created ✅","success");loadModData();}
		else{setTournaments(p=>[...p,{...entry,_id:Date.now().toString()}]);showToast("Saved locally","info");}
		setNewTour({name:"",code:"",difficulty:"Recruit"});
	};
	const deleteTour = async id => {
		if(isConfigured)await fbDelete("tournaments",id);
		setTournaments(p=>p.filter(t=>t._id!==id));showToast("Deleted","info");
	};

	const addCustomQ = async () => {
		if(!newQ.question.trim()){showToast("Question text required","error");return;}
		const entry={...newQ,options:newQ.options.join("|||"),id:Date.now()};
		if(isConfigured){await fbPost("customQuestions",entry);showToast("Question added ✅","success");loadModData();}
		else{setCustomQs(p=>[...p,{...entry,_id:Date.now().toString()}]);showToast("Saved locally","info");}
		setNewQ({type:"mcq",category:"Core Concept",difficulty:"Recruit",question:"",options:["","","",""],answer:0,explanation:""});
	};

	const deleteCustomQ = async id => {
		if(isConfigured)await fbDelete("customQuestions",id);
		setCustomQs(p=>p.filter(q=>q._id!==id));showToast("Deleted","info");
	};

	const pct = questions.length ? Math.round((answers.filter(a=>a.correct).length/questions.length)*100) : 0;
	const q   = questions[current];

	// ── Style tokens ──
	const C = { purple:"#7c3aed", purpleLight:"#a78bfa", bg:"rgba(255,255,255,0.04)", border:"rgba(167,139,250,0.15)", text:"#e2d9f3", muted:"#7c6fa0" };
	const card  = (x={}) => ({ background:C.bg, border:`1px solid ${C.border}`, borderRadius:16, padding:"18px 20px", ...x });
	const col   = (gap=14,x={}) => ({ display:"flex", flexDirection:"column", gap, ...x });
	const row   = (gap=10,x={}) => ({ display:"flex", alignItems:"center", gap, ...x });
	const inp   = (x={}) => ({ width:"100%", padding:"11px 14px", borderRadius:10, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(167,139,250,0.3)", color:C.text, fontSize:14, outline:"none", boxSizing:"border-box", ...x });
	const lbl   = { fontSize:12, color:C.muted, marginBottom:5, display:"block" };
	const btn   = (v="primary",x={}) => ({
		padding:"12px 18px", borderRadius:12, fontWeight:800, fontSize:14, border:"none", cursor:"pointer",
		...(v==="primary"?{background:"linear-gradient(135deg,#7c3aed,#6d28d9)",color:"#fff"}:{}),
		...(v==="ghost"  ?{background:"transparent",border:"1px solid rgba(167,139,250,0.3)",color:C.purpleLight}:{}),
		...(v==="danger" ?{background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.3)",color:"#f87171"}:{}),
		...(v==="tour"   ?{background:"linear-gradient(135deg,#b45309,#d97706)",color:"#fff"}:{}),
		...x,
	});

	const BoardRow = ({e,i}) => (
		<div style={{ display:"flex", alignItems:"center", gap:12,
			background:i===0?"rgba(245,158,11,0.08)":"rgba(255,255,255,0.03)",
			border:`1px solid ${i===0?"rgba(245,158,11,0.2)":"rgba(255,255,255,0.06)"}`,
			borderRadius:12, padding:"12px 16px" }}>
			<span style={{ width:27,height:27,borderRadius:8,flexShrink:0,
				background:i===0?"#f59e0b":i===1?"rgba(192,192,192,0.3)":i===2?"rgba(180,100,50,0.4)":"rgba(255,255,255,0.07)",
				color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:i<3?13:12,fontWeight:800 }}>
				{i===0?"👑":i+1}
			</span>
			<div style={{flex:1,minWidth:0}}>
				<div style={{fontWeight:700,fontSize:14,color:i===0?"#fbbf24":C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.name}</div>
				<div style={{fontSize:11,color:C.muted,marginTop:2}}>
					<span style={{color:DIFF[e.difficulty]?.color||C.purpleLight}}>{e.difficulty}</span>
					{e.tournament&&<span style={{color:"#f59e0b"}}> · {e.tournamentName||e.tournament}</span>}
					{" · "}{e.correct}/{questions.length||10} correct
				</div>
			</div>
			<div style={{textAlign:"right",flexShrink:0}}>
				<div style={{fontSize:14,fontWeight:800,color:C.purpleLight}}>{e.score} pts</div>
				<div style={{fontSize:11,color:C.muted}}>{fmt(e.time||0)}</div>
			</div>
		</div>
	);

	return (
		<div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0f0a1e 0%,#1a0f3a 50%,#0d1a2e 100%)", fontFamily:"'Inter','Segoe UI',sans-serif", color:C.text, display:"flex", flexDirection:"column", alignItems:"center", padding:"24px 16px", position:"relative" }}>

			{/* Toast */}
			{toast&&<div style={{ position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:999, background:toast.type==="success"?"rgba(52,211,153,0.2)":toast.type==="error"?"rgba(248,113,113,0.2)":"rgba(124,58,237,0.2)", border:`1px solid ${toast.type==="success"?"#34d399":toast.type==="error"?"#f87171":C.purpleLight}`, color:"#fff",padding:"10px 20px",borderRadius:12,fontSize:13,fontWeight:600,backdropFilter:"blur(8px)",whiteSpace:"nowrap" }}>{toast.msg}</div>}

			{/* Header */}
			<div style={{textAlign:"center",marginBottom:22,width:"100%",maxWidth:640}}>
				<div style={row(8,{justifyContent:"center",marginBottom:6})}>
					<div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#7c3aed,#a78bfa)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>⚡</div>
					<span style={{fontSize:11,fontWeight:700,letterSpacing:3,color:C.purpleLight,textTransform:"uppercase"}}>Action Model</span>
				</div>
				<h1 style={{fontSize:24,fontWeight:900,margin:0,color:"#fff"}}>LAM Quiz</h1>
				<p style={{fontSize:11,color:C.muted,margin:"3px 0 0"}}>Test your knowledge. Own the future.</p>
			</div>

			<div style={{width:"100%",maxWidth:640}}>

				{/* ... rest of component (unchanged) ... */}
			</div>
		</div>
	);
}
