export const REGIONS = ['Americas', 'Europe', 'AOA'];

export const CATEGORIES = {
  Americas: ['Coffee', 'Confectionery', 'Dairy', 'Frozen', 'Pet Care'],
  Europe: ['Coffee', 'Confectionery', 'Dairy', 'Plant-Based'],
  AOA: ['Coffee & Malt', 'Noodles', 'Dairy', 'Confectionery'],
};

// Weight config for health score
const W = {
  marginScore: 0.30,
  revenuetrend: 0.25,
  marketShareTrend: 0.20,
  consumerDemand: 0.15,
  cannibalizationRisk: 0.10,
};

const trendVal = (t) => t === 'growing' ? 10 : t === 'stable' ? 6 : 2;
const canniVal = (c) => c === 'low' ? 10 : c === 'medium' ? 5 : 1;
const demandVal = (d) => d === 'rising' ? 10 : d === 'stable' ? 6 : 2;

export function computeHealth(sku) {
  const score =
    sku.marginScore * W.marginScore * 10 +
    trendVal(sku.revenueTrend) * W.revenuetrend * 10 +
    trendVal(sku.marketShareTrend) * W.marketShareTrend * 10 +
    demandVal(sku.consumerDemand) * W.consumerDemand * 10 +
    canniVal(sku.cannibalizationRisk) * W.cannibalizationRisk * 10;
  return Math.round(score);
}

export function getRecommendation(health) {
  if (health >= 72) return 'Invest';
  if (health >= 52) return 'Maintain';
  if (health >= 35) return 'Watch';
  return 'Divest';
}

const RAW_SKUS = [
  // ── AMERICAS ──
  { id: 'AM01', name: 'Nescafé Gold Blend 200g', region: 'Americas', category: 'Coffee', marginScore: 8, revenueTrend: 'growing', marketShareTrend: 'growing', cannibalizationRisk: 'low', consumerDemand: 'rising', quarterlyRevenue: [18.2, 19.1, 20.4, 21.8, 23.0, 24.5] },
  { id: 'AM02', name: 'Nescafé Clásico 7oz', region: 'Americas', category: 'Coffee', marginScore: 7, revenueTrend: 'stable', marketShareTrend: 'stable', cannibalizationRisk: 'medium', consumerDemand: 'stable', quarterlyRevenue: [14.0, 14.2, 13.9, 14.1, 14.0, 13.8] },
  { id: 'AM03', name: 'Nescafé Taster\'s Choice 12ct', region: 'Americas', category: 'Coffee', marginScore: 4, revenueTrend: 'declining', marketShareTrend: 'declining', cannibalizationRisk: 'low', consumerDemand: 'falling', quarterlyRevenue: [9.1, 8.4, 7.9, 7.1, 6.5, 5.9] },
  { id: 'AM04', name: 'KitKat Original 45g', region: 'Americas', category: 'Confectionery', marginScore: 9, revenueTrend: 'growing', marketShareTrend: 'growing', cannibalizationRisk: 'low', consumerDemand: 'rising', quarterlyRevenue: [22.1, 23.5, 25.0, 26.8, 28.1, 30.0] },
  { id: 'AM05', name: 'KitKat Chunky PB 42g', region: 'Americas', category: 'Confectionery', marginScore: 7, revenueTrend: 'growing', marketShareTrend: 'stable', cannibalizationRisk: 'medium', consumerDemand: 'rising', quarterlyRevenue: [8.0, 8.9, 9.5, 10.1, 10.8, 11.4] },
  { id: 'AM06', name: 'Crunch Bar 44g', region: 'Americas', category: 'Confectionery', marginScore: 5, revenueTrend: 'declining', marketShareTrend: 'declining', cannibalizationRisk: 'high', consumerDemand: 'falling', quarterlyRevenue: [7.2, 6.8, 6.3, 5.9, 5.4, 4.9] },
  { id: 'AM07', name: 'Carnation Evaporated Milk 354ml', region: 'Americas', category: 'Dairy', marginScore: 6, revenueTrend: 'stable', marketShareTrend: 'stable', cannibalizationRisk: 'low', consumerDemand: 'stable', quarterlyRevenue: [11.0, 11.2, 11.1, 11.3, 11.0, 11.2] },
  { id: 'AM08', name: 'Carnation Condensed Milk 300g', region: 'Americas', category: 'Dairy', marginScore: 3, revenueTrend: 'declining', marketShareTrend: 'declining', cannibalizationRisk: 'medium', consumerDemand: 'falling', quarterlyRevenue: [6.5, 6.0, 5.4, 4.9, 4.3, 3.8] },
  { id: 'AM09', name: 'Stouffer\'s Lasagna 96oz', region: 'Americas', category: 'Frozen', marginScore: 8, revenueTrend: 'growing', marketShareTrend: 'growing', cannibalizationRisk: 'low', consumerDemand: 'rising', quarterlyRevenue: [15.0, 16.2, 17.5, 18.9, 20.1, 21.6] },
  { id: 'AM10', name: 'Stouffer\'s Mac & Cheese 12oz', region: 'Americas', category: 'Frozen', marginScore: 6, revenueTrend: 'stable', marketShareTrend: 'stable', cannibalizationRisk: 'medium', consumerDemand: 'stable', quarterlyRevenue: [9.8, 9.9, 10.0, 9.8, 10.1, 10.0] },
  { id: 'AM11', name: 'Purina ONE SmartBlend 31.1lb', region: 'Americas', category: 'Pet Care', marginScore: 9, revenueTrend: 'growing', marketShareTrend: 'growing', cannibalizationRisk: 'low', consumerDemand: 'rising', quarterlyRevenue: [28.5, 30.1, 32.4, 34.8, 37.0, 39.5] },
  { id: 'AM12', name: 'Purina Pro Plan Savor Adult 35lb', region: 'Americas', category: 'Pet Care', marginScore: 8, revenueTrend: 'growing', marketShareTrend: 'stable', cannibalizationRisk: 'low', consumerDemand: 'rising', quarterlyRevenue: [19.0, 20.2, 21.0, 22.1, 23.4, 24.8] },
  { id: 'AM13', name: 'Purina Fancy Feast Classic 3oz', region: 'Americas', category: 'Pet Care', marginScore: 4, revenueTrend: 'declining', marketShareTrend: 'declining', cannibalizationRisk: 'high', consumerDemand: 'falling', quarterlyRevenue: [5.5, 5.1, 4.7, 4.2, 3.9, 3.5] },

  // ── EUROPE ──
  { id: 'EU01', name: 'Nespresso Vertuo Next (Black)', region: 'Europe', category: 'Coffee', marginScore: 9, revenueTrend: 'growing', marketShareTrend: 'growing', cannibalizationRisk: 'low', consumerDemand: 'rising', quarterlyRevenue: [31.0, 33.5, 36.2, 39.0, 42.1, 45.5] },
  { id: 'EU02', name: 'Nescafé Gold Barista 170g', region: 'Europe', category: 'Coffee', marginScore: 8, revenueTrend: 'growing', marketShareTrend: 'stable', cannibalizationRisk: 'medium', consumerDemand: 'rising', quarterlyRevenue: [14.5, 15.2, 16.0, 16.9, 17.8, 18.9] },
  { id: 'EU03', name: 'Nescafé 3in1 Original 20ct', region: 'Europe', category: 'Coffee', marginScore: 3, revenueTrend: 'declining', marketShareTrend: 'declining', cannibalizationRisk: 'low', consumerDemand: 'falling', quarterlyRevenue: [8.8, 8.0, 7.3, 6.5, 5.8, 5.0] },
  { id: 'EU04', name: 'KitKat Original 4-finger 41.5g', region: 'Europe', category: 'Confectionery', marginScore: 9, revenueTrend: 'growing', marketShareTrend: 'growing', cannibalizationRisk: 'low', consumerDemand: 'rising', quarterlyRevenue: [25.0, 26.8, 28.5, 30.2, 32.5, 34.9] },
  { id: 'EU05', name: 'KitKat Senses Caramel 112g', region: 'Europe', category: 'Confectionery', marginScore: 6, revenueTrend: 'stable', marketShareTrend: 'stable', cannibalizationRisk: 'medium', consumerDemand: 'stable', quarterlyRevenue: [7.5, 7.6, 7.4, 7.7, 7.5, 7.6] },
  { id: 'EU06', name: 'Smarties Hexatube 130g', region: 'Europe', category: 'Confectionery', marginScore: 5, revenueTrend: 'declining', marketShareTrend: 'declining', cannibalizationRisk: 'high', consumerDemand: 'falling', quarterlyRevenue: [6.2, 5.8, 5.3, 4.8, 4.4, 3.9] },
  { id: 'EU07', name: 'Mövenpick Ice Cream Stracciatella 900ml', region: 'Europe', category: 'Dairy', marginScore: 7, revenueTrend: 'stable', marketShareTrend: 'stable', cannibalizationRisk: 'low', consumerDemand: 'stable', quarterlyRevenue: [10.5, 10.7, 10.4, 10.8, 10.6, 10.9] },
  { id: 'EU08', name: 'Mövenpick Ice Cream Praline 500ml', region: 'Europe', category: 'Dairy', marginScore: 4, revenueTrend: 'declining', marketShareTrend: 'declining', cannibalizationRisk: 'high', consumerDemand: 'falling', quarterlyRevenue: [4.9, 4.5, 4.1, 3.7, 3.3, 2.9] },
  { id: 'EU09', name: 'Garden Gourmet Incredible Burger 226g', region: 'Europe', category: 'Plant-Based', marginScore: 7, revenueTrend: 'growing', marketShareTrend: 'growing', cannibalizationRisk: 'low', consumerDemand: 'rising', quarterlyRevenue: [9.0, 10.2, 11.5, 13.0, 14.5, 16.2] },
  { id: 'EU10', name: 'Garden Gourmet Vuna Tuna-Style 150g', region: 'Europe', category: 'Plant-Based', marginScore: 5, revenueTrend: 'stable', marketShareTrend: 'stable', cannibalizationRisk: 'low', consumerDemand: 'rising', quarterlyRevenue: [3.5, 3.8, 4.0, 4.2, 4.5, 4.8] },
  { id: 'EU11', name: 'Nescafé Dolce Gusto Cappuccino 16ct', region: 'Europe', category: 'Coffee', marginScore: 6, revenueTrend: 'declining', marketShareTrend: 'declining', cannibalizationRisk: 'high', consumerDemand: 'falling', quarterlyRevenue: [11.0, 10.2, 9.4, 8.6, 7.9, 7.1] },
  { id: 'EU12', name: 'KitKat Ruby Chocolate 41.5g', region: 'Europe', category: 'Confectionery', marginScore: 8, revenueTrend: 'growing', marketShareTrend: 'growing', cannibalizationRisk: 'low', consumerDemand: 'rising', quarterlyRevenue: [5.0, 6.2, 7.8, 9.5, 11.2, 13.0] },

  // ── AOA ──
  { id: 'AO01', name: 'Milo Activ-Go 1kg Tin', region: 'AOA', category: 'Coffee & Malt', marginScore: 9, revenueTrend: 'growing', marketShareTrend: 'growing', cannibalizationRisk: 'low', consumerDemand: 'rising', quarterlyRevenue: [24.0, 25.8, 27.5, 29.4, 31.5, 33.8] },
  { id: 'AO02', name: 'Milo Fuze Chocolate 240ml RTD', region: 'AOA', category: 'Coffee & Malt', marginScore: 7, revenueTrend: 'growing', marketShareTrend: 'stable', cannibalizationRisk: 'medium', consumerDemand: 'rising', quarterlyRevenue: [10.0, 11.0, 12.0, 13.1, 14.3, 15.5] },
  { id: 'AO03', name: 'Nescafé Classic 50g Sachet', region: 'AOA', category: 'Coffee & Malt', marginScore: 6, revenueTrend: 'stable', marketShareTrend: 'stable', cannibalizationRisk: 'medium', consumerDemand: 'stable', quarterlyRevenue: [12.5, 12.7, 12.4, 12.8, 12.6, 12.9] },
  { id: 'AO04', name: 'Maggi 2-Minute Noodles Masala 70g', region: 'AOA', category: 'Noodles', marginScore: 9, revenueTrend: 'growing', marketShareTrend: 'growing', cannibalizationRisk: 'low', consumerDemand: 'rising', quarterlyRevenue: [30.5, 32.8, 35.5, 38.2, 41.0, 44.5] },
  { id: 'AO05', name: 'Maggi Hot & Sweet Sauce 400g', region: 'AOA', category: 'Noodles', marginScore: 7, revenueTrend: 'growing', marketShareTrend: 'stable', cannibalizationRisk: 'low', consumerDemand: 'rising', quarterlyRevenue: [8.5, 9.2, 9.8, 10.5, 11.2, 11.9] },
  { id: 'AO06', name: 'Maggi Vegetable Atta Noodles 80g', region: 'AOA', category: 'Noodles', marginScore: 4, revenueTrend: 'declining', marketShareTrend: 'declining', cannibalizationRisk: 'high', consumerDemand: 'falling', quarterlyRevenue: [5.0, 4.6, 4.1, 3.7, 3.3, 2.9] },
  { id: 'AO07', name: 'Nestlé MUNCH 18g Bar', region: 'AOA', category: 'Confectionery', marginScore: 8, revenueTrend: 'growing', marketShareTrend: 'growing', cannibalizationRisk: 'low', consumerDemand: 'rising', quarterlyRevenue: [14.0, 15.2, 16.5, 18.0, 19.5, 21.2] },
  { id: 'AO08', name: 'KitKat Matcha Green Tea 35g', region: 'AOA', category: 'Confectionery', marginScore: 8, revenueTrend: 'growing', marketShareTrend: 'growing', cannibalizationRisk: 'low', consumerDemand: 'rising', quarterlyRevenue: [7.0, 8.2, 9.6, 11.0, 12.5, 14.2] },
  { id: 'AO09', name: 'KitKat Chunky Original 38g', region: 'AOA', category: 'Confectionery', marginScore: 5, revenueTrend: 'stable', marketShareTrend: 'declining', cannibalizationRisk: 'high', consumerDemand: 'stable', quarterlyRevenue: [6.5, 6.4, 6.2, 6.0, 5.9, 5.8] },
  { id: 'AO10', name: 'Nestlé Bear Brand Sterilized Milk 140ml', region: 'AOA', category: 'Dairy', marginScore: 8, revenueTrend: 'growing', marketShareTrend: 'growing', cannibalizationRisk: 'low', consumerDemand: 'rising', quarterlyRevenue: [16.0, 17.5, 19.0, 20.8, 22.5, 24.5] },
  { id: 'AO11', name: 'Nestlé Coffeemate Original 400g', region: 'AOA', category: 'Dairy', marginScore: 5, revenueTrend: 'declining', marketShareTrend: 'declining', cannibalizationRisk: 'medium', consumerDemand: 'falling', quarterlyRevenue: [7.8, 7.2, 6.7, 6.1, 5.6, 5.0] },
  { id: 'AO12', name: 'Milo Chocolate Powder 200g Pouch', region: 'AOA', category: 'Coffee & Malt', marginScore: 3, revenueTrend: 'declining', marketShareTrend: 'declining', cannibalizationRisk: 'medium', consumerDemand: 'falling', quarterlyRevenue: [5.5, 5.0, 4.5, 4.0, 3.5, 3.0] },
];

// Attach computed fields
export const ALL_SKUS = RAW_SKUS.map(sku => {
  const health = computeHealth(sku);
  return { ...sku, health, recommendation: getRecommendation(health) };
});

export const SKUS_BY_REGION = {
  Americas: ALL_SKUS.filter(s => s.region === 'Americas'),
  Europe: ALL_SKUS.filter(s => s.region === 'Europe'),
  AOA: ALL_SKUS.filter(s => s.region === 'AOA'),
};

export const REC_COLORS = {
  Invest: { color: 'var(--invest)', bg: 'var(--invest-bg)' },
  Maintain: { color: 'var(--maintain)', bg: 'var(--maintain-bg)' },
  Watch: { color: 'var(--watch)', bg: 'var(--watch-bg)' },
  Divest: { color: 'var(--divest)', bg: 'var(--divest-bg)' },
};

export const AI_RATIONALE = {
  AM01: "Nescafé Gold Blend 200g is the top-performing coffee SKU in Zone Americas, with three consecutive quarters of revenue growth and rising consumer demand aligned with the premiumization trend. Low cannibalization risk makes this an ideal candidate for increased marketing investment and capacity expansion.",
  AM02: "Nescafé Clásico holds steady volume with stable market share, but faces growing private-label pressure in the value segment. Recommend maintaining current investment levels while monitoring price-sensitivity signals over the next two quarters.",
  AM03: "Taster's Choice is in structural decline — six quarters of consecutive revenue erosion, shrinking market share, and falling consumer relevance signal category exit risk. With no adjacent SKU cannibalization concern, this is a strong candidate for controlled divestment.",
  AM04: "KitKat Original is the single highest-performing confectionery SKU in the Americas portfolio. Strong brand equity, growing market share, and surging consumer demand make this an immediate investment priority for shelf expansion and promotional uplift.",
  AM05: "KitKat Chunky PB shows healthy growth momentum but operates close to KitKat Original in consumer perception. Recommend investing selectively in markets where PB flavour has distinct differentiation rather than blanket expansion.",
  AM06: "Crunch Bar faces a structurally challenged position — declining revenue, falling consumer demand, and high cannibalization risk from KitKat variants. Recommend phased divestment over two quarters with volume absorbed by KitKat family.",
  AM07: "Carnation Evaporated Milk demonstrates stable, defensive performance with consistent volumes and stable market share. Low growth expectations but reliable margin contribution makes this a maintain hold with no immediate action required.",
  AM08: "Carnation Condensed Milk is losing volume to both private label and lower-priced regional competitors. Six-quarter decline trend combined with medium cannibalization risk from Evaporated Milk suggests accelerated divestment planning.",
  AM09: "Stouffer's Lasagna is the standout performer in the Frozen category, benefiting from the ongoing convenience food trend. Consistent margin improvement and growing market share make this a high-confidence investment SKU.",
  AM10: "Stouffer's Mac & Cheese holds stable volumes in a competitive frozen category. Performance is steady but not differentiated. Maintain at current investment levels while assessing promotional sensitivity.",
  AM11: "Purina ONE SmartBlend is the highest-revenue SKU in the Americas portfolio, with sustained growth driven by premiumization in pet nutrition. Strong brand affinity and low competitive threat make this the top investment priority across the zone.",
  AM12: "Purina Pro Plan Savor Adult shows consistent revenue growth and strong consumer loyalty in the premium segment. Recommend investing in bundle formats and subscription channels to deepen retention.",
  AM13: "Purina Fancy Feast Classic is losing relevance to premium wet cat food variants. Declining revenue, falling consumer demand, and high cannibalization risk from newer Fancy Feast lines signal a divestment recommendation.",
  EU01: "Nespresso Vertuo Next is the fastest-growing high-margin SKU in Zone Europe, driven by the at-home barista trend and razor-and-blade revenue from capsule sales. This SKU anchors the premium coffee strategy and warrants aggressive investment.",
  EU02: "Nescafé Gold Barista is gaining traction as a bridge between instant and premium coffee, with growing demand in the UK and DACH markets. Recommend investing in a targeted trial campaign to accelerate adoption.",
  EU03: "Nescafé 3in1 Original is structurally declining across Zone Europe as consumer preferences shift away from sachet coffee. Low cannibalization risk makes this a candidate for orderly phase-out over the next three quarters.",
  EU04: "KitKat Original 4-finger is the flagship confectionery SKU in Europe with strong brand equity, consistent margin performance, and growing market share. This is a maintain-with-investment priority — protect shelf presence and seasonal promotional spend.",
  EU05: "KitKat Senses Caramel performs steadily within the premium tier but lacks meaningful growth momentum. Maintain at current levels while assessing whether flavour extension is diluting vs. expanding the KitKat audience.",
  EU06: "Smarties Hexatube faces category headwinds in Europe with declining retail shelf allocation and falling consumer demand. High cannibalization risk from KitKat variants warrants a structured divestment plan.",
  EU07: "Mövenpick Stracciatella maintains stable volumes in the premium ice cream segment with consistent margin contribution. Brand prestige supports a maintain recommendation, though distribution should be tightened to highest-performing markets.",
  EU08: "Mövenpick Praline 500ml shows sustained volume decline and is being out-positioned by own-brand premium alternatives. High cannibalization risk from Stracciatella in the same tier supports a divestment recommendation.",
  EU09: "Garden Gourmet Incredible Burger is the breakout growth SKU in the European plant-based category, with accelerating revenue and growing retail distribution. Recommend investing in production capacity and expanding to food service channels.",
  EU10: "Garden Gourmet Vuna shows strong consumer demand momentum in the plant-based seafood niche. Revenue base is still small but trajectory is strong — recommend a focused investment in two lead markets before broader rollout.",
  EU11: "Nescafé Dolce Gusto Cappuccino is losing market share to Nespresso Vertuo within the same portfolio, creating significant internal cannibalization. Recommend accelerating the brand migration strategy and planning controlled phase-out.",
  EU12: "KitKat Ruby Chocolate is the fastest-growing variant in the European confectionery portfolio, capitalizing on the Ruby chocolate trend and gifting occasions. Recommend extending into larger format sizes to capture incremental revenue.",
  AO01: "Milo Activ-Go 1kg Tin is the anchor SKU in the AOA zone and one of Nestlé's most iconic emerging-market brands. Strong growth, high margin, and deep consumer loyalty across Southeast Asia and Africa make this the top investment priority in the zone.",
  AO02: "Milo Fuze RTD is gaining strong traction in on-the-go consumption occasions across Southeast Asia. Growing distribution and rising demand in convenience channels make this a near-term investment priority.",
  AO03: "Nescafé Classic Sachet performs steadily in price-sensitive markets where sachet format is the primary access point. Stable volumes and consistent margin contribution support a maintain recommendation.",
  AO04: "Maggi 2-Minute Noodles Masala is the highest-revenue SKU in the AOA zone, with dominant market share in India and strong growth across South Asia and Africa. This is a core portfolio pillar warranting sustained investment in capacity and innovation.",
  AO05: "Maggi Hot & Sweet Sauce is growing steadily on the back of expanding condiment consumption occasions. Low cannibalization risk and rising consumer demand support a selective investment recommendation in lead markets.",
  AO06: "Maggi Vegetable Atta Noodles is declining across all key metrics, facing both consumer preference shifts and quality perception challenges. High cannibalization risk from the core Maggi Masala SKU supports a divestment recommendation.",
  AO07: "Nestlé MUNCH is a high-growth confectionery SKU in the AOA zone, benefiting from strong brand recognition and impulse consumption occasions in South Asia. Recommend investing in distribution width and pack size innovation.",
  AO08: "KitKat Matcha Green Tea is a premium innovation success in East Asia with accelerating revenue and strong gifting demand. Recommend expanding distribution from Japan and South Korea into broader APAC markets.",
  AO09: "KitKat Chunky Original is showing early signs of structural decline in the AOA market, with volume erosion driven by KitKat Matcha cannibalizing the same consumer occasion. Recommend monitoring for two quarters before divestment decision.",
  AO10: "Nestlé Bear Brand Sterilized Milk is a high-margin market leader in Southeast Asia with growing demand driven by functional nutrition positioning. Recommend investing in new pack formats and rural distribution expansion.",
  AO11: "Coffeemate Original is losing relevance as liquid creamer formats and plant-based alternatives gain share. Six-quarter revenue decline and falling consumer demand support a managed divestment over the next year.",
  AO12: "Milo Chocolate Powder 200g Pouch is being cannibalized by the larger tin format and the RTD variant, with declining volumes across all tracked markets. Recommend phased divestment while protecting the core Milo brand equity.",
};
