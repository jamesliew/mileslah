import { useState, useMemo } from "react";

/* ─── Data ───────────────────────────────────────────────────── */
const BANKS = [
  { id:"uob_ladies",   name:"UOB Lady's",           currency:"UNI$",          ratio:2,   note:"1 UNI$ = 2 miles",  mine:true  },
  { id:"uob_ppv",      name:"UOB Pref. Platinum",    currency:"UNI$",          ratio:2,   note:"1 UNI$ = 2 miles",  mine:true  },
  { id:"citi_prestige",name:"Citi Prestige",         currency:"ThankYou Pts",  ratio:0.4, note:"2.5 pts = 1 mile",  mine:true  },
  { id:"citi_rewards", name:"Citi Rewards",          currency:"ThankYou Pts",  ratio:0.4, note:"2.5 pts = 1 mile",  mine:true  },
  { id:"dbs_wwmc",     name:"DBS Woman's World",     currency:"DBS Points",    ratio:2,   note:"1 pt = 2 miles",    mine:true  },
  { id:"dbs_wplat",    name:"DBS Woman's Platinum",  currency:"DBS Points",    ratio:2,   note:"1 pt = 2 miles",    mine:true  },
  { id:"dbs_altitude", name:"DBS Altitude",          currency:"DBS Points",    ratio:2,   note:"1 pt = 2 miles",    mine:false },
  { id:"uob_prvi",     name:"UOB PRVI Miles",        currency:"UNI$",          ratio:2,   note:"1 UNI$ = 2 miles",  mine:false },
  { id:"ocbc_voyage",  name:"OCBC Voyage",           currency:"VOYAGE Miles",  ratio:1,   note:"1:1 direct",        mine:false },
  { id:"citi_premier", name:"Citi PremierMiles",     currency:"Citi Miles",    ratio:1,   note:"1:1 direct",        mine:false },
  { id:"hsbc_travel",  name:"HSBC TravelOne",        currency:"HSBC Points",   ratio:0.4, note:"2.5 pts = 1 mile",  mine:false },
  { id:"sc_journey",   name:"SC Journey",            currency:"360\u00b0 Rewards", ratio:0.5, note:"2 pts = 1 mile", mine:false },
];

const DESTINATIONS = [
  { region:"Malaysia",        flag:"\ud83c\uddf2\ud83c\uddfe", economy:7500,  business:20000,  first:null   },
  { region:"Southeast Asia",  flag:"\ud83c\udf0f",             economy:12500, business:32500,  first:null   },
  { region:"Northeast Asia",  flag:"\ud83d\uddfe",             economy:22500, business:58000,  first:null   },
  { region:"South Asia",      flag:"\ud83c\uddee\ud83c\uddf3", economy:25000, business:62500,  first:null   },
  { region:"Australia & NZ",  flag:"\ud83c\udde6\ud83c\uddfa", economy:35000, business:80000,  first:110000 },
  { region:"Middle East",     flag:"\ud83c\udf19",             economy:35000, business:80000,  first:110000 },
  { region:"Europe & UK",     flag:"\ud83c\uddea\ud83c\uddfa", economy:62500, business:132500, first:172500 },
  { region:"USA West Coast",  flag:"\ud83c\uddfa\ud83c\uddf8", economy:75000, business:155000, first:215000 },
  { region:"USA East Coast",  flag:"\ud83c\uddfa\ud83c\uddf8", economy:87500, business:165000, first:228500 },
];

const CARDS = [
  { id:"uob_ladies",   name:"UOB Lady's Card",             bank:"UOB",      mine:true,  bestMpd:4,   bestCat:"2 chosen categories",          localMpd:0.4, fxMpd:0.4,  fee:"S$194", feeWaive:true,  kfRatio:"1 UNI$ = 2 miles",        cap:"S$1,000/mth per category",        partners:"KrisFlyer, Asia Miles",                 perk:"Pick any 2 bonus categories per quarter",                  tag:"4mpd"    },
  { id:"uob_ppv",      name:"UOB Preferred Platinum Visa", bank:"UOB",      mine:true,  bestMpd:4,   bestCat:"Online & mobile contactless",   localMpd:0.4, fxMpd:0.4,  fee:"S$194", feeWaive:true,  kfRatio:"1 UNI$ = 2 miles",        cap:"S$600/mth mobile + S$600 online", partners:"KrisFlyer, Asia Miles",                 perk:"4 mpd just by tapping your phone to pay",                  tag:"4mpd"    },
  { id:"citi_prestige",name:"Citi Prestige",               bank:"Citibank", mine:true,  bestMpd:2,   bestCat:"FCY / overseas",                localMpd:1.3, fxMpd:2.0,  fee:"S$652", feeWaive:false, kfRatio:"2.5 TYP = 1 mile",        cap:"Uncapped",                        partners:"11 programmes \u2013 all 3 alliances + IHG", perk:"80,000 TYP (32,000 miles) on annual fee payment",          tag:"premium" },
  { id:"citi_rewards", name:"Citi Rewards",                bank:"Citibank", mine:true,  bestMpd:4,   bestCat:"Online shopping & contactless", localMpd:0.4, fxMpd:0.4,  fee:"S$194", feeWaive:true,  kfRatio:"2.5 TYP = 1 mile",        cap:"S$1,000/mth",                     partners:"11 programmes \u2013 widest in Singapore",   perk:"Same 4 mpd but transfers to 11 airlines vs UOB's 2",       tag:"4mpd"    },
  { id:"dbs_wwmc",     name:"DBS Woman's World Mastercard",bank:"DBS",      mine:true,  bestMpd:4,   bestCat:"All online spend (any MCC)",    localMpd:0.4, fxMpd:1.2,  fee:"S$196", feeWaive:true,  kfRatio:"1 DBS Point = 2 miles",   cap:"S$1,000/mth",                     partners:"KrisFlyer, Asia Miles, Qantas",          perk:"Broadest online coverage \u2013 any merchant category counts", tag:"4mpd"    },
  { id:"dbs_wplat",    name:"DBS Woman's Platinum",        bank:"DBS",      mine:true,  bestMpd:0.4, bestCat:"Base rate only",                localMpd:0.4, fxMpd:1.2,  fee:"S$30",  feeWaive:true,  kfRatio:"1 DBS Point = 2 miles",   cap:"Uncapped",                        partners:"KrisFlyer, Asia Miles, Qantas",          perk:"Keep to pool DBS Points with your Woman's World card",      tag:"base"    },
  { id:"dbs_altitude", name:"DBS Altitude Visa",           bank:"DBS",      mine:false, bestMpd:6,   bestCat:"Airlines & hotels (Expedia)",  localMpd:1.3, fxMpd:2.2,  fee:"S$196", feeWaive:true,  kfRatio:"1 DBS Point = 2 miles",   cap:"Uncapped on local & overseas",    partners:"KrisFlyer, Asia Miles, Qantas",          perk:"DBS Points never expire \u2013 best for long-term accumulation", tag:"everyday"},
  { id:"uob_prvi",     name:"UOB PRVI Miles Visa",         bank:"UOB",      mine:false, bestMpd:3,   bestCat:"Regional (MY/TH/ID/VN)",       localMpd:1.4, fxMpd:2.4,  fee:"S$262", feeWaive:false, kfRatio:"1 UNI$ = 2 miles",        cap:"Uncapped",                        partners:"KrisFlyer, Asia Miles",                 perk:"Strong overseas rate; UNI$ pools with your Lady's & PPV",  tag:"overseas"},
  { id:"ocbc_voyage",  name:"OCBC Voyage",                 bank:"OCBC",     mine:false, bestMpd:2.3, bestCat:"FCY & overseas",               localMpd:1.6, fxMpd:2.3,  fee:"S$488", feeWaive:false, kfRatio:"1 VOYAGE = 1 KF mile",    cap:"Uncapped",                        partners:"KrisFlyer (no transfer fee)",            perk:"Highest local base rate in SG at 1.6 mpd; no transfer fee", tag:"local"   },
  { id:"citi_premier", name:"Citi PremierMiles",           bank:"Citibank", mine:false, bestMpd:2.2, bestCat:"FCY spend",                    localMpd:1.2, fxMpd:2.2,  fee:"S$194", feeWaive:true,  kfRatio:"1 Citi Mile = 1 KF mile", cap:"Uncapped",                        partners:"11 programmes \u2013 same as Citi Prestige",  perk:"Citi Miles never expire; 10,000 bonus miles on annual fee", tag:"everyday"},
  { id:"hsbc_travel",  name:"HSBC TravelOne",              bank:"HSBC",     mine:false, bestMpd:2.4, bestCat:"FCY spend",                    localMpd:1.2, fxMpd:2.4,  fee:"S$194", feeWaive:false, kfRatio:"2.5 HSBC Pts = 1 mile",   cap:"Uncapped",                        partners:"21 programmes \u2013 most in Singapore",     perk:"Only SG card with instant, fee-free KrisFlyer transfers",   tag:"overseas"},
  { id:"kf_uob",       name:"KrisFlyer UOB",               bank:"UOB",      mine:false, bestMpd:3,   bestCat:"SIA Group (SQ/Scoot/KrisShop)",localMpd:1.2, fxMpd:1.2,  fee:"S$196", feeWaive:false, kfRatio:"Direct \u2013 no conversion", cap:"Uncapped on SIA Group",         partners:"KrisFlyer only",                         perk:"Miles auto-credited monthly \u2013 no transfer step, no fee", tag:"direct"  },
];

const TAG_META = {
  "4mpd":    { label:"4 mpd",        lc:"#0a5a28", dc:"#a3e635" },
  "everyday":{ label:"Everyday",     lc:"#1a4a00", dc:"#bef264" },
  "overseas":{ label:"Overseas",     lc:"#5a3a00", dc:"#fbbf24" },
  "local":   { label:"Local earn",   lc:"#1a4a00", dc:"#bef264" },
  "premium": { label:"Premium",      lc:"#444444", dc:"#999999" },
  "direct":  { label:"Direct miles", lc:"#0a5a28", dc:"#a3e635" },
  "base":    { label:"Base only",    lc:"#888888", dc:"#555555" },
};

/* ─── Theme tokens ──────────────────────────────────────────── */
function mkT(dark) {
  return {
    dark,
    outerBg:          dark ? "#1a1a1a"           : "#F2F0EF",
    cardBg:           "#ffffff",
    cardBorder:       dark ? "1px solid #333333" : "none",
    text:             dark ? "#f0ede8"           : "#111111",
    textSec:          dark ? "#888888"           : "#777777",
    textTer:          dark ? "#555555"           : "#aaaaaa",
    textMuted:        dark ? "#3a3a3a"           : "#cccccc",
    border:           dark ? "#333333"           : "#e8e6e2",
    borderInput:      dark ? "#3a3a3a"           : "#d8d6d2",
    borderTab:        dark ? "#333333"           : "#dddbd8",
    segBg:            "#FFDE21",
    segActive:        "#ffffff",
    segShadow:        dark ? "0 1px 5px rgba(0,0,0,0.5)" : "0 1px 6px rgba(0,0,0,0.10)",
    selectBg:         dark ? "#2a2a2a"           : "#eceae8",
    inputBg:          "transparent",
    summaryBg:        dark ? "#2a2a2a"           : "#eceae8",
    heroBg:           "#fdfa72",
    heroText:         "#111111",
    green:            "#111111",
    greenFaint:       dark ? "rgba(253,250,114,0.1)" : "#fefee8",
    myCardBg:         "#ffffff",
    myCardBorder:     dark ? "1px solid #4a4a20" : "1px solid #ede800",
    myCardBadgeBg:    dark ? "#3a3a18"           : "#fefccc",
    myCardBadgeColor: dark ? "#fdfa72"           : "#7a7000",
    toggleBg:         "#FFDE21",
    toggleColor:      "#111111",
    cardShadow:       dark ? "0 2px 20px rgba(0,0,0,0.5)" : "0 2px 16px rgba(0,0,0,0.06)",
    ct:       "#111111",
    ctSec:    "#777777",
    ctTer:    "#aaaaaa",
    ctMute:   "#cccccc",
    ctBorder: "#e8e6e2",
  };
}

/* ─── Shared ──────────────────────────────────────────────────── */
function SegControl({ options, value, onChange, t }) {
  return (
    <div style={{ display:"flex", background:t.segBg, borderRadius:999, padding:3, gap:2 }}>
      {options.map(([k,v]) => (
        <button key={k} onClick={() => onChange(k)} style={{
          flex:1, padding:"8px 16px", borderRadius:999, border:"none", cursor:"pointer",
          fontSize:14, fontFamily:"inherit", fontWeight:value===k?500:400, whiteSpace:"nowrap",
          background: value===k ? t.segActive : "transparent",
          color: value===k ? "#111111" : "#555555",
          boxShadow: value===k ? t.segShadow : "none",
          transition:"all 0.15s",
        }}>{v}</button>
      ))}
    </div>
  );
}

function Card({ children, t, style={}, mine=false }) {
  return (
    <div style={{
      background: mine ? t.myCardBg : t.cardBg,
      borderRadius: 24,
      padding: "26px",
      boxShadow: t.cardShadow,
      border: mine ? t.myCardBorder : t.cardBorder,
      ...style,
    }}>{children}</div>
  );
}

/* ─── Calculator Tab ──────────────────────────────────────────── */
function CalculatorTab({ t }) {
  const [entries, setEntries] = useState([{ id:1, bankId:"uob_ladies", points:0 }]);
  const [cabin, setCabin]     = useState("economy");
  const [trip, setTrip]       = useState("oneway");
  const mul = trip === "return" ? 2 : 1;

  const totalMiles = useMemo(() =>
    entries.reduce((sum, e) => {
      const b = BANKS.find(x => x.id === e.bankId);
      return sum + Math.floor((Number(e.points)||0) * b.ratio);
    }, 0), [entries]);

  const addEntry    = () => setEntries(p => [...p, { id:Date.now(), bankId:"dbs_altitude", points:0 }]);
  const removeEntry = id => setEntries(p => p.filter(e => e.id !== id));
  const upd         = (id,f,v) => setEntries(p => p.map(e => e.id===id?{...e,[f]:v}:e));

  const dests       = DESTINATIONS.filter(d => d[cabin] !== null);
  const unreachable = dests.filter(d => totalMiles < d[cabin]*mul);
  const nextTarget  = unreachable.length ? unreachable.reduce((a,b) => a[cabin]<b[cabin]?a:b) : null;
  const CABINS      = [["economy","Economy"],["business","Business"],["first","First"]];
  const MAX         = 500000;
  const lbl         = { fontSize:13, color:t.textSec, marginBottom:10, letterSpacing:"0.02em" };

  return (
    <div className="ml-calc-grid">
      <Card t={t}>
        <p style={lbl}>Trip type</p>
        <div style={{ marginBottom:22 }}>
          <SegControl options={[["oneway","One-way"],["return","Return"]]} value={trip} onChange={setTrip} t={t} />
        </div>
        <p style={lbl}>Cabin class</p>
        <div style={{ marginBottom:26 }}>
          <SegControl options={CABINS} value={cabin} onChange={setCabin} t={t} />
        </div>

        {entries.map((entry, i) => {
          const bank  = BANKS.find(b => b.id === entry.bankId);
          const miles = Math.floor((Number(entry.points)||0) * bank.ratio);
          return (
            <div key={entry.id} style={{ marginBottom:26 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <p style={{ ...lbl, marginBottom:0 }}>Card {entries.length>1?i+1:""} \u2013 points balance</p>
                {entries.length>1 && (
                  <button onClick={() => removeEntry(entry.id)} style={{ background:"none", border:"none", fontSize:13, color:t.textTer, cursor:"pointer", fontFamily:"inherit" }}>Remove</button>
                )}
              </div>

              <select value={entry.bankId} onChange={e => upd(entry.id,"bankId",e.target.value)} style={{
                width:"100%", background:t.selectBg, border:"none", borderRadius:12,
                padding:"10px 12px", fontSize:14, fontFamily:"inherit", color:t.text,
                marginBottom:16, cursor:"pointer", outline:"none",
              }}>
                <optgroup label="My Cards">{BANKS.filter(b=>b.mine).map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</optgroup>
                <optgroup label="Other Cards">{BANKS.filter(b=>!b.mine).map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</optgroup>
              </select>

              <input type="number" min={0} max={MAX} step={1000}
                value={entry.points||""}
                placeholder="0"
                onChange={e => upd(entry.id,"points",Math.min(MAX,Math.max(0,Number(e.target.value))))}
                style={{
                  width:"100%", border:"none", borderBottom:"1.5px solid #d8d6d2",
                  outline:"none", fontSize:52, fontWeight:700, color:"#111111",
                  background:t.inputBg, fontFamily:"'DM Sans',system-ui",
                  letterSpacing:"-0.02em", padding:"0 0 4px", lineHeight:1, boxSizing:"border-box",
                }}
              />
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:4, marginBottom:10 }}>
                <span style={{ fontSize:12, color:t.ctMute }}>{bank.currency} \u00b7 {bank.note}</span>
                <span style={{ fontSize:12, color:t.ctMute }}>Max {MAX/1000}k</span>
              </div>

              <input type="range" min={0} max={MAX} step={1000}
                value={entry.points||0}
                onChange={e => upd(entry.id,"points",Number(e.target.value))}
                className="ml-slider"
                style={{ width:"100%", cursor:"pointer" }}
              />

              {miles > 0 && (
                <div style={{ marginTop:10, background:t.heroBg, borderRadius:12, padding:"10px 14px", display:"inline-block" }}>
                  <span style={{ fontSize:14, fontWeight:700, color:t.heroText }}>= {miles.toLocaleString()} KrisFlyer miles</span>
                </div>
              )}
            </div>
          );
        })}

        <button onClick={addEntry} style={{
          background:"none", border:`1.5px dashed ${t.borderInput}`, borderRadius:12,
          width:"100%", padding:"10px", fontSize:13, color:t.textTer, cursor:"pointer", fontFamily:"inherit",
        }}>+ Add another card</button>

        <p style={{ fontSize:11, color:t.textMuted, marginTop:20, lineHeight:1.6 }}>
          Based on KrisFlyer Saver award rates. Transfer fees may apply. First class not available to all destinations.
        </p>
      </Card>

      <div className="ml-right-col" style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div style={{ background:t.heroBg, borderRadius:24, padding:"26px", boxShadow:t.cardShadow }}>
          <p style={{ fontSize:13, color:"rgba(0,0,0,0.5)", margin:"0 0 6px" }}>Your KrisFlyer miles</p>
          <p style={{ fontSize:56, fontWeight:700, color:t.heroText, margin:"0 0 4px", letterSpacing:"-0.03em", lineHeight:1 }} className="ml-hero-miles">
            {totalMiles.toLocaleString()}
          </p>
          <p style={{ fontSize:13, color:"rgba(0,0,0,0.45)", margin:"6px 0 0" }}>
            {trip==="return"?"Return":"One-way"} \u00b7 {cabin.charAt(0).toUpperCase()+cabin.slice(1)}
          </p>
        </div>

        {nextTarget && totalMiles > 0 && (
          <Card t={t} style={{ padding:"16px 20px" }}>
            <p style={{ fontSize:12, color:t.textTer, margin:"0 0 4px" }}>Next unlock</p>
            <p style={{ fontSize:16, fontWeight:600, color:t.text, margin:"0 0 2px" }}>{nextTarget.flag} {nextTarget.region}</p>
            <p style={{ fontSize:13, color:t.textSec, margin:0 }}>
              {((nextTarget[cabin]*mul)-totalMiles).toLocaleString()} more miles needed
            </p>
          </Card>
        )}

        <Card t={t} style={{ padding:"20px 24px" }}>
          {dests.map((dest, idx) => {
            const needed = dest[cabin]*mul;
            const ok  = totalMiles >= needed;
            const pct = totalMiles > 0 ? Math.min(1, totalMiles/needed) : 0;
            return (
              <div key={dest.region} style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"10px 0",
                borderBottom: idx < dests.length-1 ? `1px solid ${t.ctBorder}` : "none",
                opacity: ok ? 1 : 0.45,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:18 }}>{dest.flag}</span>
                  <div>
                    <p style={{ fontSize:14, fontWeight:ok?500:400, color:t.ct, margin:0 }}>{dest.region}</p>
                    <div style={{ width:80, height:2, background:t.ctBorder, borderRadius:2, marginTop:4, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct*100}%`, background:ok?"#111111":t.ctTer, borderRadius:2, transition:"width 0.4s" }} />
                    </div>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <span style={{ fontSize:13, fontWeight:500, color:ok?"#111111":t.ctSec }}>{needed.toLocaleString()}</span>
                  {ok && <div style={{ fontSize:10, color:"#111111", marginTop:1 }}>\u2713</div>}
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

/* ─── Card Comparison Tab ─────────────────────────────────────── */
function ComparisonTab({ t }) {
  const [filter, setFilter]     = useState("all");
  const [expanded, setExpanded] = useState(null);

  const FILTERS = [["all","All"],["mine","My cards"],["4mpd","4 mpd"],["overseas","Overseas"],["everyday","Everyday"]];

  const filtered = CARDS.filter(c => {
    if (filter==="mine")     return c.mine;
    if (filter==="4mpd")     return c.bestMpd >= 4;
    if (filter==="overseas") return c.fxMpd >= 2.2;
    if (filter==="everyday") return c.localMpd >= 1.3;
    return true;
  });

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <SegControl options={FILTERS} value={filter} onChange={setFilter} t={t} />
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map(card => {
          const isExp = expanded === card.id;
          const tag   = TAG_META[card.tag];
          const tagColor = t.dark ? tag.dc : tag.lc;
          return (
            <div key={card.id} onClick={() => setExpanded(isExp?null:card.id)}
              style={{
                background: card.mine ? t.myCardBg : t.cardBg,
                borderRadius: 20, padding:"18px 22px", cursor:"pointer",
                boxShadow: t.cardShadow,
                border: card.mine ? t.myCardBorder : t.cardBorder,
              }}>

              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:6 }}>
                    <span style={{ fontSize:15, fontWeight:500, color:t.ct }}>{card.name}</span>
                    {card.mine && (
                      <span style={{ fontSize:11, padding:"2px 9px", borderRadius:999, background:t.myCardBadgeBg, color:t.myCardBadgeColor, fontWeight:500 }}>My card</span>
                    )}
                    <span style={{ fontSize:11, padding:"2px 9px", borderRadius:999, background:t.dark?"rgba(255,255,255,0.07)":t.summaryBg, color:tagColor, fontWeight:500 }}>{tag.label}</span>
                  </div>
                  <p style={{ fontSize:13, color:t.ctSec, margin:0, lineHeight:1.5 }}>{card.perk}</p>
                </div>

                <div style={{ textAlign:"right", flexShrink:0, paddingLeft:16 }}>
                  <span style={{ fontSize:32, fontWeight:700, color:t.ct, letterSpacing:"-0.02em", lineHeight:1 }}>{card.bestMpd}</span>
                  <span style={{ fontSize:14, color:t.ctSec, marginLeft:2 }}>mpd</span>
                  <p style={{ fontSize:11, color:t.ctTer, margin:"3px 0 0", maxWidth:110, lineHeight:1.4 }}>{card.bestCat}</p>
                </div>
              </div>

              <div className="ml-card-row-stats" style={{ display:"flex", gap:24, marginTop:14, paddingTop:14, borderTop:`1px solid ${t.ctBorder}`, flexWrap:"wrap" }}>
                {[["Local",card.localMpd+" mpd"],["Overseas",card.fxMpd+" mpd"],["Annual fee",card.fee+(card.feeWaive?" *":"")]].map(([l,v]) => (
                  <div key={l}>
                    <p style={{ fontSize:11, color:t.ctTer, margin:"0 0 2px", textTransform:"uppercase", letterSpacing:"0.05em" }}>{l}</p>
                    <p style={{ fontSize:13, fontWeight:500, color:t.ct, margin:0 }}>{v}</p>
                  </div>
                ))}
              </div>

              {isExp && (
                <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${t.ctBorder}` }}>
                  {[["KF conversion",card.kfRatio],["Bonus cap",card.cap],["Transfer partners",card.partners]].map(([l,v]) => (
                    <div key={l} style={{ display:"flex", justifyContent:"space-between", gap:16, padding:"8px 0", borderBottom:`1px solid ${t.ctBorder}` }}>
                      <span style={{ fontSize:13, color:t.ctSec }}>{l}</span>
                      <span style={{ fontSize:13, color:t.ct, textAlign:"right", maxWidth:280 }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p style={{ fontSize:11, color:t.textMuted, marginTop:20, lineHeight:1.6 }}>
        * Annual fee waiver available on request. Earn rates as of early 2026 \u2013 subject to change. Tap any card to expand.
      </p>
    </div>
  );
}

/* ─── Dark/light toggle ─────────────────────────────────────── */
function DarkToggle({ dark, onToggle }) {
  return (
    <button onClick={onToggle} aria-label="Toggle dark mode" style={{
      position:"relative", width:51, height:31, borderRadius:999,
      border:"none", cursor:"pointer", padding:0, flexShrink:0,
      background: dark ? "#FFDE21" : "#d8d6d2",
      transition:"background 0.25s",
    }}>
      <span style={{
        position:"absolute", top:3, left: dark ? 23 : 3,
        width:25, height:25, borderRadius:"50%",
        background:"#ffffff",
        boxShadow:"0 1px 4px rgba(0,0,0,0.22)",
        transition:"left 0.22s cubic-bezier(0.4,0,0.2,1)",
        display:"block",
      }} />
    </button>
  );
}

/* ─── App Shell ─────────────────────────────────────────────── */
export default function App() {
  const [tab,  setTab]  = useState("calculator");
  const [dark, setDark] = useState(false);
  const t = mkT(dark);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />
      <style>{`
        .ml-slider { -webkit-appearance:none; appearance:none; width:100%; height:4px; border-radius:2px; background:#FFDE21; outline:none; display:block; margin:0; padding:0; }
        .ml-slider::-webkit-slider-runnable-track { -webkit-appearance:none; appearance:none; background:#FFDE21; border-radius:2px; height:4px; }
        .ml-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:20px; height:20px; border-radius:50%; background:#FFDE21; cursor:pointer; box-shadow:0 1px 6px rgba(0,0,0,0.25); margin-top:-8px; border:2.5px solid #fff; }
        .ml-slider::-moz-range-track { background:#FFDE21; border-radius:2px; height:4px; }
        .ml-slider::-moz-range-thumb { width:16px; height:16px; border-radius:50%; background:#FFDE21; cursor:pointer; border:2.5px solid #fff; box-shadow:0 1px 6px rgba(0,0,0,0.25); }
        * { box-sizing:border-box; }
        .ml-calc-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; align-items:start; }
        @media (max-width:680px) {
          .ml-hero-miles { font-size:44px !important; }
          .ml-calc-grid { grid-template-columns:1fr !important; }
          .ml-card-row-stats { flex-wrap:wrap; gap:14px !important; }
          .ml-header h1 { font-size:22px !important; }
          .ml-tabs button { padding:10px 14px !important; font-size:14px !important; }
        }
      `}</style>
      <div style={{ minHeight:"100vh", background:t.outerBg, padding:"20px 14px 40px", fontFamily:"'DM Sans',system-ui,sans-serif", transition:"background 0.3s" }}>
        <div style={{ maxWidth:900, margin:"0 auto", width:"100%" }}>

          <div className="ml-header" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
            <div>
              <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:4 }}>
                <h1 style={{ fontSize:28, fontWeight:700, color:t.text, margin:0, letterSpacing:"-0.03em" }}>MilesLah</h1>
                <span style={{ fontSize:13, color:t.textTer, fontWeight:400 }}>mileslah.com</span>
              </div>
              <p style={{ fontSize:14, color:t.textSec, margin:0 }}>Your KrisFlyer miles, organised.</p>
            </div>
            <DarkToggle dark={dark} onToggle={() => setDark(d => !d)} />
          </div>

          <div className="ml-tabs" style={{ display:"flex", borderBottom:`1.5px solid ${t.borderTab}`, marginBottom:24 }}>
            {[["calculator","Calculator"],["comparison","Card comparison"]].map(([k,v]) => (
              <button key={k} onClick={() => setTab(k)} style={{
                padding:"10px 22px", background:"none", border:"none", cursor:"pointer",
                fontSize:15, fontFamily:"inherit", fontWeight:tab===k?500:400,
                color: tab===k ? t.text : t.textSec,
                borderBottom: tab===k ? `2px solid ${t.text}` : "2px solid transparent",
                marginBottom:"-1.5px", transition:"color 0.15s",
              }}>{v}</button>
            ))}
          </div>

          {tab === "calculator" ? <CalculatorTab t={t} /> : <ComparisonTab t={t} />}
        </div>
      </div>
    </>
  );
}
