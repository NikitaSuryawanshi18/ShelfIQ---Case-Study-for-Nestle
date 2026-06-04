# ShelfIQ — AI-Powered SKU Portfolio Decisioning for FMCG

**A PM case study prototype built around Nestlé's SKU portfolio complexity and rationalization challenge.**

🔗 **[View Live Demo](https://NikitaSuryawanshi18.github.io/ShelfIQ---Case-Study-for-Nestle)**

---

## What is ShelfIQ?

ShelfIQ is an AI-powered portfolio decisioning tool that gives FMCG strategy teams a unified, real-time view of their SKU portfolio — with intelligent recommendations on what to cut, grow, or invest in, and a scenario simulator to model the impact of portfolio changes before any decision is made.

This prototype is built as a PM case study for Nestlé, addressing the challenge of managing 2,000+ brands and tens of thousands of SKUs across global zones — a problem that currently costs companies like Nestlé hundreds of millions in trapped capital tied up in underperforming products.

---

## Features

- **Portfolio Overview** — KPI cards, recommendation distribution by zone, and a "bottom 5 immediate action" panel
- **Regional Tabs (Americas / Europe / AOA)** — Full SKU table with health scores, trend indicators, and AI recommendation tags per Nestlé's actual zone structure
- **SKU Detail Panel** — Click any SKU to view the full AI analysis, health score breakdown by dimension, and a 6-quarter revenue trend chart
- **Scenario Simulator** — Select SKUs to remove, run a simulation, and instantly see projected margin improvement, revenue at risk, supply chain complexity reduction, and cannibalization warnings
- **Simulated Live Data** — Revenue figures drift every 30 seconds to simulate a live data feed, with health scores and recommendations recalculated dynamically

---

## Health Score Methodology

Each SKU is scored 0–100 using a weighted formula across 5 dimensions:

| Dimension | Weight |
|---|---|
| Margin Score | 30% |
| Revenue Trend | 25% |
| Market Share Trend | 20% |
| Consumer Demand Signal | 15% |
| Cannibalization Risk | 10% |

**Recommendation tiers:**
- 🟢 **Invest** — Health ≥ 72
- 🔵 **Maintain** — Health 52–71
- 🟠 **Watch** — Health 35–51
- 🔴 **Divest** — Health < 35

---

## Running Locally

**Prerequisites:** Node.js v16+

```bash
# Clone the repo
git clone https://github.com/NikitaSuryawanshi18/ShelfIQ---Case-Study-for-Nestle.git
cd ShelfIQ---Case-Study-for-Nestle

# Install dependencies
npm install

# Run locally
npm start
```

The app will open at `http://localhost:3000`

---

## Deploying to GitHub Pages

```bash
# Install gh-pages if not already installed
npm install gh-pages --save-dev

# Deploy
npm run deploy
```

This will build the app and push it to the `gh-pages` branch automatically.

---

## Tech Stack

- **React 18** — UI framework
- **Recharts** — Charts and sparklines
- **CSS Variables** — Theming and design tokens
- **GitHub Pages** — Hosting

No backend. No API keys. Fully static and free to host.

---

## Project Structure

```
src/
├── App.js        # Main application — all components
├── data.js       # SKU data, health score formula, AI rationale
├── index.js      # Entry point
└── index.css     # Global styles and CSS variables
```

---

## About This Case Study

This prototype was built to demonstrate how AI can solve a real, material problem in the FMCG industry. The SKU data is grounded in Nestlé's actual regional structure (Zone Americas, Zone Europe, Zone AOA) and real brand portfolio, with revenue figures modeled realistically for demonstration purposes.

**Built by:** Nikita Suryawanshi  
**Role:** Product Management Portfolio Project
