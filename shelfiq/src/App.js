import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip, RadialBarChart, RadialBar, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ALL_SKUS, SKUS_BY_REGION, REC_COLORS, AI_RATIONALE, computeHealth, getRecommendation } from './data';

// ─── Utility ────────────────────────────────────────────────────────────────

function healthColor(h) {
  if (h >= 72) return 'var(--invest)';
  if (h >= 52) return 'var(--maintain)';
  if (h >= 35) return 'var(--watch)';
  return 'var(--divest)';
}

function RecBadge({ rec }) {
  const c = REC_COLORS[rec];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
      letterSpacing: '0.04em', color: c.color, background: c.bg,
      fontFamily: 'var(--font-display)',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.color, display: 'inline-block' }} />
      {rec.toUpperCase()}
    </span>
  );
}

function TrendPill({ val }) {
  const map = { growing: ['↑', 'var(--invest)', 'var(--invest-bg)'], stable: ['→', 'var(--maintain)', 'var(--maintain-bg)'], declining: ['↓', 'var(--divest)', 'var(--divest-bg)'], rising: ['↑', 'var(--invest)', 'var(--invest-bg)'], falling: ['↓', 'var(--divest)', 'var(--divest-bg)'] };
  const [icon, color, bg] = map[val] || ['–', 'var(--text-2)', 'var(--surface2)'];
  return <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, color, background: bg }}>{icon} {val}</span>;
}

function MiniSparkline({ data }) {
  const min = Math.min(...data), max = Math.max(...data);
  const points = data.map((v, i) => ({ v, i }));
  const last = data[data.length - 1], first = data[0];
  const trend = last > first ? 'var(--invest)' : last < first ? 'var(--divest)' : 'var(--maintain)';
  return (
    <ResponsiveContainer width={80} height={28}>
      <LineChart data={points} margin={{ top: 2, bottom: 2 }}>
        <Line type="monotone" dataKey="v" stroke={trend} strokeWidth={1.8} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function HealthBar({ score }) {
  const color = healthColor(score);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 60, height: 6, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: 'var(--font-display)' }}>{score}</span>
    </div>
  );
}

// ─── SKU Detail Panel ────────────────────────────────────────────────────────

function SkuPanel({ sku, onClose }) {
  if (!sku) return null;
  const c = REC_COLORS[sku.recommendation];
  const factors = [
    { label: 'Margin Score', value: sku.marginScore, max: 10 },
    { label: 'Revenue Trend', value: sku.revenueTrend === 'growing' ? 8 : sku.revenueTrend === 'stable' ? 5 : 2, max: 10 },
    { label: 'Market Share Trend', value: sku.marketShareTrend === 'growing' ? 8 : sku.marketShareTrend === 'stable' ? 5 : 2, max: 10 },
    { label: 'Consumer Demand', value: sku.consumerDemand === 'rising' ? 9 : sku.consumerDemand === 'stable' ? 6 : 2, max: 10 },
    { label: 'Cannibalization Risk', value: sku.cannibalizationRisk === 'low' ? 9 : sku.cannibalizationRisk === 'medium' ? 5 : 1, max: 10 },
  ];
  const quarters = ['Q1 \'23', 'Q2 \'23', 'Q3 \'23', 'Q4 \'23', 'Q1 \'24', 'Q2 \'24'];
  const chartData = sku.quarterlyRevenue.map((v, i) => ({ q: quarters[i], v }));

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }} onClick={onClose}>
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }} />
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 480, background: 'var(--surface)', overflowY: 'auto',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column',
          animation: 'fadeUp 0.25s ease',
        }}
      >
        {/* Header */}
        <div style={{ padding: '28px 28px 20px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-display)', marginBottom: 6 }}>
                {sku.region} · {sku.category}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', lineHeight: 1.3 }}>{sku.name}</div>
              <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
                <RecBadge rec={sku.recommendation} />
                <HealthBar score={sku.health} />
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'var(--surface2)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: 'var(--text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
        </div>

        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Revenue chart */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-display)', marginBottom: 12 }}>Revenue Trend (USD M)</div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="q" tick={{ fontSize: 10, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="v" stroke={healthColor(sku.health)} strokeWidth={2.5} dot={{ fill: healthColor(sku.health), r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Health breakdown */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-display)', marginBottom: 12 }}>Health Score Breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {factors.map(f => (
                <div key={f.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{f.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{f.value}/{f.max}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
                    <div style={{ width: `${(f.value / f.max) * 100}%`, height: '100%', background: healthColor(sku.health), borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI rationale */}
          <div style={{ background: 'var(--red-soft)', borderRadius: 10, padding: '16px 18px', borderLeft: '3px solid var(--red)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--red)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-display)', marginBottom: 8 }}>AI Analysis</div>
            <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7 }}>{AI_RATIONALE[sku.id] || 'No analysis available for this SKU.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SKU Table ───────────────────────────────────────────────────────────────

function SkuTable({ skus, onSelect }) {
  const [sort, setSort] = useState({ key: 'health', dir: -1 });
  const [filter, setFilter] = useState('All');
  const cats = ['All', ...Array.from(new Set(skus.map(s => s.category)))];

  const sorted = [...skus]
    .filter(s => filter === 'All' || s.category === filter)
    .sort((a, b) => (a[sort.key] > b[sort.key] ? sort.dir : -sort.dir));

  const th = (label, key) => (
    <th
      onClick={() => setSort(s => ({ key, dir: s.key === key ? -s.dir : -1 }))}
      style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap', userSelect: 'none', background: 'var(--surface2)' }}
    >
      {label} {sort.key === key ? (sort.dir === -1 ? '↓' : '↑') : ''}
    </th>
  );

  return (
    <div>
      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: '5px 14px', borderRadius: 99, border: '1.5px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-display)',
            borderColor: filter === c ? 'var(--red)' : 'var(--border)',
            background: filter === c ? 'var(--red)' : 'var(--surface)',
            color: filter === c ? '#fff' : 'var(--text-2)',
            transition: 'all 0.15s',
          }}>{c}</button>
        ))}
      </div>

      <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 860 }}>
          <thead>
            <tr>{th('SKU Name', 'name')}{th('Category', 'category')}{th('Revenue Trend', 'revenueTrend')}{th('Margin', 'marginScore')}{th('Market Share', 'marketShareTrend')}{th('Demand Signal', 'consumerDemand')}{th('Cannib. Risk', 'cannibalizationRisk')}{th('6-Quarter', 'id')}{th('Health', 'health')}{th('Recommendation', 'recommendation')}</tr>
          </thead>
          <tbody>
            {sorted.map((sku, i) => (
              <tr
                key={sku.id}
                onClick={() => onSelect(sku)}
                style={{ borderTop: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: 'var(--text)', maxWidth: 200 }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{sku.name}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-display)', marginTop: 2 }}>{sku.id}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-2)' }}>{sku.category}</td>
                <td style={{ padding: '12px 14px' }}><TrendPill val={sku.revenueTrend} /></td>
                <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{sku.marginScore}/10</td>
                <td style={{ padding: '12px 14px' }}><TrendPill val={sku.marketShareTrend} /></td>
                <td style={{ padding: '12px 14px' }}><TrendPill val={sku.consumerDemand} /></td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: sku.cannibalizationRisk === 'low' ? 'var(--invest)' : sku.cannibalizationRisk === 'medium' ? 'var(--watch)' : 'var(--divest)' }}>
                    {sku.cannibalizationRisk}
                  </span>
                </td>
                <td style={{ padding: '12px 14px' }}><MiniSparkline data={sku.quarterlyRevenue} /></td>
                <td style={{ padding: '12px 14px' }}><HealthBar score={sku.health} /></td>
                <td style={{ padding: '12px 14px' }}><RecBadge rec={sku.recommendation} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function Overview({ onSelectSku }) {
  const recs = ['Invest', 'Maintain', 'Watch', 'Divest'];
  const counts = recs.map(r => ({ name: r, count: ALL_SKUS.filter(s => s.recommendation === r).length }));
  const total = ALL_SKUS.length;

  const regionStats = ['Americas', 'Europe', 'AOA'].map(region => {
    const skus = ALL_SKUS.filter(s => s.region === region);
    const avgHealth = Math.round(skus.reduce((a, b) => a + b.health, 0) / skus.length);
    const invest = skus.filter(s => s.recommendation === 'Invest').length;
    const divest = skus.filter(s => s.recommendation === 'Divest').length;
    return { region, total: skus.length, avgHealth, invest, divest };
  });

  const barData = ['Americas', 'Europe', 'AOA'].map(region => {
    const skus = ALL_SKUS.filter(s => s.region === region);
    return {
      region,
      Invest: skus.filter(s => s.recommendation === 'Invest').length,
      Maintain: skus.filter(s => s.recommendation === 'Maintain').length,
      Watch: skus.filter(s => s.recommendation === 'Watch').length,
      Divest: skus.filter(s => s.recommendation === 'Divest').length,
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        {[
          { label: 'Total SKUs Tracked', value: total, sub: 'Across all zones', color: 'var(--text)' },
          { label: 'Invest', value: counts[0].count, sub: `${Math.round((counts[0].count/total)*100)}% of portfolio`, color: 'var(--invest)' },
          { label: 'Watch / At Risk', value: counts[2].count, sub: `${Math.round((counts[2].count/total)*100)}% of portfolio`, color: 'var(--watch)' },
          { label: 'Divest', value: counts[3].count, sub: `${Math.round((counts[3].count/total)*100)}% of portfolio`, color: 'var(--divest)' },
        ].map((k, i) => (
          <div key={k.label} className={`fade-up fade-up-${i+1}`} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '20px 22px', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-display)', marginBottom: 10 }}>{k.label}</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: k.color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart + region table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '22px', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-display)', marginBottom: 18 }}>Recommendation Distribution by Zone</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="region" tick={{ fontSize: 11, fill: 'var(--text-2)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-3)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="Invest" stackId="a" fill="var(--invest)" radius={[0,0,0,0]} />
              <Bar dataKey="Maintain" stackId="a" fill="var(--maintain)" />
              <Bar dataKey="Watch" stackId="a" fill="var(--watch)" />
              <Bar dataKey="Divest" stackId="a" fill="var(--divest)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '22px', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-display)', marginBottom: 18 }}>Zone Summary</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Zone', 'SKUs', 'Avg Health', 'Invest', 'Divest'].map(h => (
                  <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {regionStats.map(r => (
                <tr key={r.region} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 700, fontSize: 13, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{r.region}</td>
                  <td style={{ padding: '12px 10px', fontSize: 13, color: 'var(--text-2)' }}>{r.total}</td>
                  <td style={{ padding: '12px 10px' }}><HealthBar score={r.avgHealth} /></td>
                  <td style={{ padding: '12px 10px', fontSize: 13, fontWeight: 700, color: 'var(--invest)', fontFamily: 'var(--font-display)' }}>{r.invest}</td>
                  <td style={{ padding: '12px 10px', fontSize: 13, fontWeight: 700, color: 'var(--divest)', fontFamily: 'var(--font-display)' }}>{r.divest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom SKUs to watch */}
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '22px', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-display)', marginBottom: 16 }}>⚠ Immediate Action Required — Bottom 5 SKUs</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...ALL_SKUS].sort((a, b) => a.health - b.health).slice(0, 5).map(sku => (
            <div key={sku.id} onClick={() => onSelectSku(sku)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 8, background: 'var(--divest-bg)', cursor: 'pointer', border: '1px solid rgba(196,28,28,0.12)', transition: 'opacity 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{sku.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{sku.region} · {sku.category}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <HealthBar score={sku.health} />
                <RecBadge rec={sku.recommendation} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Scenario Simulator ──────────────────────────────────────────────────────

function Simulator() {
  const [selected, setSelected] = useState(new Set());
  const [result, setResult] = useState(null);

  const toggle = (id) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const simulate = () => {
    const cut = ALL_SKUS.filter(s => selected.has(s.id));
    const remaining = ALL_SKUS.filter(s => !selected.has(s.id));
    const totalRevenueLost = cut.reduce((a, s) => a + s.quarterlyRevenue[s.quarterlyRevenue.length - 1], 0);
    const avgMarginGain = cut.length > 0 ? (cut.reduce((a, s) => a + (10 - s.marginScore), 0) / cut.length * 1.8).toFixed(1) : 0;
    const complexityReduction = Math.round((cut.length / ALL_SKUS.length) * 100);
    const canniWarnings = cut.filter(s => s.cannibalizationRisk === 'high').map(s => s.name);
    const avgRemainingHealth = Math.round(remaining.reduce((a, b) => a + b.health, 0) / remaining.length);
    setResult({ totalRevenueLost: totalRevenueLost.toFixed(1), avgMarginGain, complexityReduction, canniWarnings, cutCount: cut.length, avgRemainingHealth, cutNames: cut.map(s => s.name) });
  };

  const reset = () => { setSelected(new Set()); setResult(null); };
  const divestSkus = ALL_SKUS.filter(s => s.recommendation === 'Divest' || s.recommendation === 'Watch');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: 'var(--red-soft)', borderRadius: 10, padding: '16px 20px', borderLeft: '3px solid var(--red)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>How to use the Simulator</div>
        <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4, lineHeight: 1.7 }}>Select SKUs below to simulate cutting them from the portfolio. ShelfIQ will instantly model the impact on revenue, margin, supply chain complexity, and flag any cannibalization risks to sibling SKUs. Start with <strong>Watch</strong> and <strong>Divest</strong> candidates.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: 20 }}>
        {/* SKU selector */}
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '22px', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>Select SKUs to Remove ({selected.size} selected)</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={reset} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface2)', cursor: 'pointer', fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Reset</button>
              <button onClick={simulate} disabled={selected.size === 0} style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: selected.size > 0 ? 'var(--red)' : 'var(--border)', cursor: selected.size > 0 ? 'pointer' : 'not-allowed', fontSize: 12, color: selected.size > 0 ? '#fff' : 'var(--text-3)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Run Simulation →</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 420, overflowY: 'auto' }}>
            {divestSkus.map(sku => (
              <label key={sku.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, border: `1.5px solid ${selected.has(sku.id) ? 'var(--red)' : 'var(--border)'}`, cursor: 'pointer', background: selected.has(sku.id) ? 'var(--red-soft)' : 'var(--surface)', transition: 'all 0.15s' }}>
                <input type="checkbox" checked={selected.has(sku.id)} onChange={() => toggle(sku.id)} style={{ accentColor: 'var(--red)', width: 15, height: 15 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{sku.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{sku.region} · {sku.category}</div>
                </div>
                <RecBadge rec={sku.recommendation} />
              </label>
            ))}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeUp 0.3s ease' }}>
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '22px', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-display)', marginBottom: 18 }}>Simulation Results — {result.cutCount} SKUs removed</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { label: 'Revenue at Risk', value: `$${result.totalRevenueLost}M`, sub: 'quarterly exposure', color: 'var(--divest)' },
                  { label: 'Margin Improvement', value: `+${result.avgMarginGain}%`, sub: 'projected uplift', color: 'var(--invest)' },
                  { label: 'Complexity Reduction', value: `${result.complexityReduction}%`, sub: 'SKU count reduction', color: 'var(--maintain)' },
                  { label: 'Remaining Portfolio Health', value: result.avgRemainingHealth, sub: 'avg health score', color: healthColor(result.avgRemainingHealth) },
                ].map(k => (
                  <div key={k.label} style={{ padding: '14px', borderRadius: 10, background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--font-display)', marginBottom: 6 }}>{k.label}</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: k.color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{k.value}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{k.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {result.canniWarnings.length > 0 && (
              <div style={{ background: 'var(--watch-bg)', borderRadius: 10, padding: '16px 18px', border: '1px solid rgba(180,83,9,0.2)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--watch)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-display)', marginBottom: 8 }}>⚠ Cannibalization Warning</div>
                <p style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.7 }}>The following SKUs carry high cannibalization risk — removing them may negatively impact sibling SKUs in the same category: <strong>{result.canniWarnings.join(', ')}</strong>. Validate with category managers before proceeding.</p>
              </div>
            )}

            <div style={{ background: 'var(--red-soft)', borderRadius: 10, padding: '16px 18px', borderLeft: '3px solid var(--red)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--red)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-display)', marginBottom: 8 }}>AI Summary</div>
              <p style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.8 }}>
                Removing <strong>{result.cutCount} underperforming SKU{result.cutCount > 1 ? 's' : ''}</strong> ({result.cutNames.slice(0, 2).join(', ')}{result.cutNames.length > 2 ? ` and ${result.cutNames.length - 2} more` : ''}) is projected to improve portfolio gross margin by approximately <strong>{result.avgMarginGain}%</strong> while reducing supply chain complexity by <strong>{result.complexityReduction}%</strong>. The revenue exposure of <strong>${result.totalRevenueLost}M/quarter</strong> represents manageable short-term risk that should be offset by reallocating investment toward Invest-tier SKUs. {result.canniWarnings.length > 0 ? `Exercise caution with high-cannibalization SKUs before finalising the divestment plan.` : `No significant cannibalization risk was identified in this scenario.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

const TABS = ['Overview', 'Americas', 'Europe', 'AOA', 'Simulator'];

export default function App() {
  const [tab, setTab] = useState('Overview');
  const [selectedSku, setSelectedSku] = useState(null);
  const [liveSkus, setLiveSkus] = useState(ALL_SKUS);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate live data drift every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSkus(prev => prev.map(sku => {
        const drift = (Math.random() - 0.48) * 0.3;
        const newRevenue = [...sku.quarterlyRevenue];
        newRevenue[newRevenue.length - 1] = Math.max(0.5, +(newRevenue[newRevenue.length - 1] + drift).toFixed(2));
        const newMargin = Math.max(1, Math.min(10, sku.marginScore + (Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0)));
        const updated = { ...sku, quarterlyRevenue: newRevenue, marginScore: newMargin };
        const health = computeHealth(updated);
        return { ...updated, health, recommendation: getRecommendation(health) };
      }));
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: 'var(--red)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 14, fontWeight: 800, fontFamily: 'var(--font-display)' }}>S</span>
            </div>
            <div>
              <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>ShelfIQ</span>
              <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 8, fontFamily: 'var(--font-display)' }}>Nestlé · Portfolio Decisioning</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--invest)', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
              <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>Live · Updated {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div style={{ padding: '4px 12px', borderRadius: 99, background: 'var(--red-soft)', fontSize: 11, fontWeight: 700, color: 'var(--red)', fontFamily: 'var(--font-display)', border: '1px solid rgba(226,0,26,0.15)' }}>
              {liveSkus.length} SKUs
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 2 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 18px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              fontFamily: 'var(--font-display)', background: 'transparent', transition: 'all 0.15s',
              color: tab === t ? 'var(--red)' : 'var(--text-2)',
              borderBottom: `2px solid ${tab === t ? 'var(--red)' : 'transparent'}`,
              marginBottom: -1,
            }}>{t}</button>
          ))}
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        {tab === 'Overview' && <Overview onSelectSku={setSelectedSku} />}
        {(tab === 'Americas' || tab === 'Europe' || tab === 'AOA') && (
          <div className="fade-up">
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Zone {tab}</h2>
              <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>Click any row to view full AI analysis and health breakdown.</p>
            </div>
            <SkuTable skus={liveSkus.filter(s => s.region === tab)} onSelect={setSelectedSku} />
          </div>
        )}
        {tab === 'Simulator' && (
          <div className="fade-up">
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Scenario Simulator</h2>
              <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>Model the impact of portfolio changes before committing to a decision.</p>
            </div>
            <Simulator />
          </div>
        )}
      </main>

      {/* SKU detail panel */}
      <SkuPanel sku={selectedSku} onClose={() => setSelectedSku(null)} />
    </div>
  );
}
