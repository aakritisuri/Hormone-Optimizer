// v2 white theme
import { useState } from "react";

const HORMONES = [
  { id: "cortisol", name: "Cortisol", unit: "\u00b5g/dL", low: 6, high: 18, optimal: [8, 14], cat: "hpa", color: "#E8754A", desc: "Primary glucocorticoid. Mobilizes glucose, suppresses immune function, modulates wakefulness via SCN-driven pulsatile release.", moa: "Binds mineralocorticoid receptors (low dose) and glucocorticoid receptors (high dose) in hippocampus, PFC, and amygdala." },
  { id: "tsh", name: "TSH", unit: "mIU/L", low: 0.4, high: 4.0, optimal: [1.0, 2.5], cat: "thyroid", color: "#4A9FE8", desc: "Anterior pituitary signal to the thyroid. When elevated, the brain is asking for more thyroid output.", moa: "Binds TSH-R on follicular cells, activates adenylyl cyclase, increases iodide uptake and T4/T3 secretion." },
  { id: "freeT3", name: "Free T3", unit: "pg/mL", low: 2.3, high: 4.2, optimal: [3.0, 3.8], cat: "thyroid", color: "#3D8BD4", desc: "Active thyroid hormone. Sets metabolic rate, thermogenesis, heart rate, and neuronal myelination.", moa: "Binds nuclear TR-alpha/beta, modulates gene transcription for metabolic enzymes and mitochondrial biogenesis." },
  { id: "freeT4", name: "Free T4", unit: "ng/dL", low: 0.8, high: 1.8, optimal: [1.1, 1.5], cat: "thyroid", color: "#3178C0", desc: "Thyroid prohormone reservoir. 80% of circulating thyroid hormone. Converted to T3 by deiodinase enzymes.", moa: "Converted by Type 1/2 deiodinase (liver, brain) to T3 or by Type 3 to reverse T3 (inactivation, stress-upregulated)." },
  { id: "testosterone", name: "Testosterone", unit: "ng/dL", low: 300, high: 1000, optimal: [500, 800], cat: "gonadal", color: "#E8A84A", desc: "Primary androgen. Drives muscle protein synthesis, bone density, erythropoiesis, libido, and spatial cognition.", moa: "Binds AR in muscle/bone/brain for anabolic gene transcription. Aromatized to estradiol via CYP19A1." },
  { id: "freeT", name: "Free Testosterone", unit: "pg/mL", low: 5, high: 21, optimal: [9, 18], cat: "gonadal", color: "#D4963A", desc: "Bioavailable fraction not bound to SHBG or albumin. Only 2-3% of total T. The fraction that actually acts.", moa: "Diffuses directly into target cells without carrier proteins. The true effector molecule of androgen signaling." },
  { id: "estradiol", name: "Estradiol (E2)", unit: "pg/mL", low: 20, high: 55, optimal: [25, 40], cat: "gonadal", color: "#D44A78", desc: "Primary estrogen. Neuroprotective, cardioprotective, critical for bone turnover.", moa: "Binds ER-alpha (reproductive) and ER-beta (brain, bone, CV). Modulates serotonin receptor density and BDNF." },
  { id: "progesterone", name: "Progesterone", unit: "ng/mL", low: 0.2, high: 1.4, optimal: [0.5, 1.0], cat: "gonadal", color: "#9B4AE8", desc: "Neurosteroid and GABA-A modulator. Promotes deep sleep N3, calms neural excitability.", moa: "Metabolized to allopregnanolone, a potent GABA-A positive allosteric modulator with anxiolytic/sedative effects." },
  { id: "lh", name: "LH", unit: "mIU/mL", low: 1.5, high: 9.3, optimal: [3.0, 7.0], cat: "gonadal", color: "#E8C24A", desc: "Luteinizing hormone. Pulsatile release drives Leydig cell testosterone production.", moa: "Binds LH/CG receptors on Leydig cells, activates cAMP/PKA cascade, upregulates StAR protein." },
  { id: "fsh", name: "FSH", unit: "mIU/mL", low: 1.5, high: 12.4, optimal: [2.0, 8.0], cat: "gonadal", color: "#C8A83A", desc: "Follicle-stimulating hormone. Drives spermatogenesis and follicular development.", moa: "Binds FSH-R on Sertoli cells, activates aromatase and inhibin B production." },
  { id: "shbg", name: "SHBG", unit: "nmol/L", low: 10, high: 57, optimal: [20, 40], cat: "gonadal", color: "#A0884A", desc: "Sex hormone-binding globulin. Binds T and E2, making them inactive. High SHBG = low bioavailable T.", moa: "Produced by liver. Suppressed by insulin, androgens, GH. Increased by estrogens, thyroid hormones, aging." },
  { id: "prolactin", name: "Prolactin", unit: "ng/mL", low: 2, high: 18, optimal: [4, 12], cat: "gonadal", color: "#8A6AE8", desc: "Elevated in both sexes indicates dopamine deficiency or pituitary adenoma. Suppresses GnRH and T.", moa: "Tonically inhibited by dopamine. Elevation suppresses GnRH pulse generator, reducing LH/FSH and sex steroids." },
  { id: "dhea", name: "DHEA-S", unit: "\u00b5g/dL", low: 100, high: 400, optimal: [200, 350], cat: "adrenal", color: "#4AE8B8", desc: "Most abundant circulating steroid. Precursor to androgens and estrogens. Declines ~2%/year after 25.", moa: "Converts to androstenedione then T/E2 peripherally. Has direct anti-glucocorticoid effects at receptor level." },
  { id: "insulin", name: "Fasting Insulin", unit: "\u00b5IU/mL", low: 2, high: 25, optimal: [3, 8], cat: "metabolic", color: "#E8D44A", desc: "Master metabolic switch. Low=fat oxidation. High=storage. #1 driver of metabolic syndrome.", moa: "Binds IR, triggers IRS-1/PI3K/Akt/GLUT4 cascade. Chronic elevation causes resistance via IRS-1 serine phosphorylation." },
  { id: "vitD", name: "Vitamin D", unit: "ng/mL", low: 30, high: 100, optimal: [50, 80], cat: "neuroimmune", color: "#E8964A", desc: "Secosteroid hormone. Modulates 1000+ genes. Critical for immunity, T synthesis, mood.", moa: "Converted to calcitriol, binds VDR, forms RXR heterodimer, regulates antimicrobial peptides and calcium channels." },
  { id: "hba1c", name: "HbA1c", unit: "%", low: 4.0, high: 5.7, optimal: [4.5, 5.2], cat: "metabolic", color: "#D4A03D", desc: "Glycated hemoglobin. 90-day glucose average. Gold standard for metabolic health.", moa: "Non-enzymatic glycation of Hb beta-chain. Proportional to average glucose over RBC lifespan (~120 days)." },
  { id: "igf1", name: "IGF-1", unit: "ng/mL", low: 100, high: 300, optimal: [150, 250], cat: "growth", color: "#4AE8D4", desc: "Growth hormone effector. Drives tissue repair, muscle hypertrophy, cellular regeneration.", moa: "GH stimulates liver IGF-1 secretion. Binds IGF-1R, activates PI3K/Akt and MAPK/ERK pathways." },
];

const CATS = {
  hpa: { n: "HPA Axis", s: "Stress Response" },
  thyroid: { n: "Thyroid Axis", s: "Metabolic Thermostat" },
  gonadal: { n: "HPG Axis", s: "Sex Hormones & Gonadotropins" },
  adrenal: { n: "Adrenal", s: "Resilience Reserve" },
  metabolic: { n: "Metabolic", s: "Energy & Storage" },
  neuroimmune: { n: "Neuro-Immune", s: "Defense & Repair" },
  growth: { n: "Growth", s: "Repair & Regeneration" },
};

const CIRCADIAN = {
  cortisol: { wave: [5, 30, 95, 85, 60, 45, 35, 25, 18, 12, 8, 5], peak: "6\u20138 AM", nadir: "10 PM\u201312 AM", protocol: "Test fasted 7\u20139 AM, seated 15 min.", science: "CAR produces 50\u201375% spike within 30 min of waking via light\u2192SCN\u2192PVN\u2192CRH\u2192ACTH." },
  testosterone: { wave: [20, 50, 90, 80, 65, 55, 45, 35, 28, 22, 18, 20], peak: "7\u201310 AM", nadir: "8\u201310 PM", protocol: "Test fasted before 10 AM. Morning levels 30% higher.", science: "T peaks during REM. Each cycle triggers GnRH\u2192LH\u2192Leydig. Sleep under 5h reduces T 10\u201315%." },
  tsh: { wave: [70, 85, 55, 40, 30, 22, 18, 15, 20, 35, 55, 70], peak: "2\u20134 AM", nadir: "4\u20138 PM", protocol: "Always AM fasted. Afternoon TSH can be 50% lower.", science: "Inverse circadian to cortisol. Nocturnal surge suppressed by glucocorticoids." },
  insulin: { wave: [10, 8, 15, 55, 30, 20, 50, 35, 15, 40, 25, 12], peak: "Post-meal", nadir: "Extended fast", protocol: "12h fast minimum. No exercise 24h prior. AM draw.", science: "Biphasic: first-phase (stored granules) and second-phase (new synthesis). Loss of first-phase = earliest beta-cell dysfunction." },
  dhea: { wave: [8, 35, 80, 70, 55, 45, 38, 30, 22, 15, 10, 8], peak: "7\u20139 AM", nadir: "Evening", protocol: "Morning fasted. DHEA-S more stable than free DHEA.", science: "DHEA opposes cortisol at receptor sites. Cortisol:DHEA ratio is a better stress biomarker." },
};

const PATHWAYS = [
  { from: "cortisol", to: "testosterone", type: "inhibit", text: "Cortisol activates 11-beta-HSD in Leydig cells, suppressing T synthesis. GnRH pulse frequency decreases." },
  { from: "cortisol", to: "tsh", type: "inhibit", text: "Glucocorticoids suppress TRH/TSH and inhibit deiodinase, reducing T4\u2192T3 conversion." },
  { from: "cortisol", to: "insulin", type: "amplify", text: "Cortisol increases hepatic gluconeogenesis and reduces GLUT4 uptake, causing hyperinsulinemia." },
  { from: "insulin", to: "shbg", type: "inhibit", text: "Hyperinsulinemia suppresses hepatic SHBG, shifting free T:E2 ratio toward estrogen dominance." },
  { from: "dhea", to: "testosterone", type: "amplify", text: "DHEA converts to androstenedione then testosterone. Critical when gonadal production declines." },
  { from: "vitD", to: "testosterone", type: "amplify", text: "VDR in Leydig cells upregulates StAR protein and CYP steroidogenic enzymes." },
  { from: "freeT3", to: "testosterone", type: "amplify", text: "T3 potentiates LH receptor expression on Leydig cells and increases StAR protein." },
  { from: "testosterone", to: "estradiol", type: "amplify", text: "Aromatase in adipose/brain/bone converts T to E2. More body fat = more aromatization." },
  { from: "prolactin", to: "testosterone", type: "inhibit", text: "Elevated prolactin suppresses GnRH pulse generator, reducing LH/FSH and all downstream sex steroids." },
];

const BLOG = [
  { title: "The Cortisol Awakening Response", tag: "HPA AXIS", color: "#E8754A", read: "6 min", body: "Within 30 minutes of waking, cortisol surges 50\u201375% above baseline. This is the cortisol awakening response (CAR), essential for memory consolidation, immune activation, and circadian cortisol slope.\n\nThe CAR is triggered by light hitting melanopsin-containing retinal ganglion cells, signaling the SCN, activating the PVN to release CRH, stimulating ACTH, driving adrenal cortisol.\n\nA blunted CAR is associated with burnout and depression. An exaggerated CAR appears in anticipatory anxiety and PTSD. The diurnal cortisol slope (morning-to-evening decline) predicts all-cause mortality better than any single measurement.\n\nProtocol: Get 10 minutes of sunlight within 30 minutes of waking. This is the single most powerful tool for setting the CAR. Overcast days still deliver 10\u2013100x more lux than indoor lighting." },
  { title: "Why Fasting Insulin Matters More Than Glucose", tag: "METABOLIC", color: "#E8D44A", read: "5 min", body: "Your doctor checks fasting glucose. It is normal. You are told you are fine. But fasting insulin is already 3x optimal, and nobody tested it.\n\nGlucose is the last domino to fall. Insulin rises years \u2014 sometimes a decade \u2014 before glucose becomes abnormal. By the time fasting glucose hits 100, you have been insulin resistant for years with elevated lipogenesis, suppressed SHBG, and progressive visceral fat.\n\nOptimal fasting insulin is 3\u20138. Above 8 = compensating. Above 12 = established resistance. Above 20 = pre-diabetic trajectory.\n\nThe fix: time-restricted eating (16:8) drops insulin below 3 where AMPK activates. Post-meal walking activates GLUT4 independent of insulin. Eating protein and fiber before carbs in the same meal blunts glucose spikes 40\u201370%." },
  { title: "The Testosterone-Sleep Connection", tag: "HPG AXIS", color: "#E8A84A", read: "5 min", body: "Testosterone is produced in pulses locked to sleep architecture. Each REM cycle triggers a GnRH pulse from the hypothalamus, causing an LH surge, driving Leydig cell secretion. You get 4\u20136 REM cycles per night. Each is a testosterone pulse.\n\nSleeping 5 hours instead of 8 reduces next-day testosterone by 10\u201315% \u2014 equivalent to aging 10\u201315 years. The effect is dose-dependent.\n\nThe temperature connection: core body temp must drop 1\u20133 degrees F for sleep onset. Room at 65\u201367F is optimal. A hot bath 90 min before bed paradoxically helps \u2014 vasodilation accelerates core cooling.\n\nSleep apnea is the hidden testosterone killer. Fragmented sleep destroys REM. CPAP alone can raise T 15\u201325% in OSA patients." },
  { title: "SHBG: The Hidden Controller", tag: "HPG AXIS", color: "#A0884A", read: "4 min", body: "Total testosterone gets all the attention. But SHBG determines how much is actually usable.\n\nSHBG binds testosterone with high affinity, rendering it inactive. Only 2\u20133% circulates as free T. Two men with identical total T of 500 can have vastly different free T depending on SHBG.\n\nWhat raises SHBG: estrogens, thyroid excess, aging, low-calorie diets, liver disease. What lowers it: insulin (why insulin resistance lowers SHBG), androgens, growth hormone, obesity.\n\nTotal T without SHBG and free T is an incomplete picture. Always test all three together." },
];

const DIET = [
  { cond: "High Cortisol", title: "Anti-Cortisol Nutrition", items: ["Eat within 60 min of waking \u2014 fasting elevates cortisol via HPA", "Magnesium-rich foods (dark chocolate 85%+, spinach, pumpkin seeds)", "Omega-3 at 2g EPA/day \u2014 reduces cortisol reactivity 19%", "Complex carbs at dinner \u2014 boosts serotonin then melatonin for sleep", "No caffeine after 12 PM. L-theanine 200mg as alternative", "Phosphatidylserine-rich foods (soy lecithin, mackerel)"] },
  { cond: "Low Testosterone", title: "Pro-Androgen Nutrition", items: ["Dietary fat 30\u201340% of calories \u2014 cholesterol is the steroid precursor", "Zinc: oysters, beef, pumpkin seeds \u2014 required for 5-alpha reductase", "Vitamin D foods: wild salmon, sardines, egg yolks", "Cruciferous vegetables \u2014 DIM and I3C promote estrogen metabolism", "Pomegranate juice 8oz daily \u2014 increases salivary T 24%", "Eliminate alcohol \u2014 toxic to Leydig cells, increases aromatase"] },
  { cond: "Insulin Resistance", title: "Metabolic Reset Nutrition", items: ["Protein + fiber first, carbs last \u2014 blunts glucose spike 40\u201370%", "ACV 1 tbsp before meals \u2014 slows gastric emptying, reduces glucose 20\u201334%", "TRE 16:8 \u2014 allows insulin to drop below 3 for AMPK activation", "Fiber 35\u201350g/day from whole food \u2014 feeds Akkermansia", "Berberine 500mg with largest meal \u2014 AMPK activator", "Ceylon cinnamon 1g/day \u2014 enhances insulin receptor sensitivity"] },
  { cond: "Thyroid Support", title: "Thyroid-Optimizing Nutrition", items: ["Brazil nuts 2\u20133 daily \u2014 68\u201391 mcg selenium per nut", "Iodine from sea vegetables, not supplements", "Gluten elimination 30 days \u2014 molecular mimicry with TPO", "Zinc-rich foods with dinner \u2014 needed for TRH synthesis", "Cook cruciferous vegetables \u2014 raw goitrogens inhibit iodide uptake", "Ferritin target 70\u2013100 \u2014 TPO is iron-dependent"] },
];

const EXERCISE = [
  { cond: "Low Testosterone", title: "Androgen-Optimizing Training", sub: "3\u20134x/week, compound movements, morning", items: ["Compound lifts: squat, deadlift, bench, OHP, rows", "6\u20138 sets, 6\u201310 reps at 70\u201385% 1RM for max T response", "Rest 60\u201390 sec \u2014 shorter rest = greater metabolic/hormonal stress", "Sessions 45\u201360 min max \u2014 beyond 60 min cortisol inverts T:C ratio", "Train within 4h of waking for amplified circadian T peak", "Leg training non-negotiable \u2014 2\u20133x systemic hormonal response vs upper body"] },
  { cond: "High Cortisol", title: "Cortisol-Conscious Training", sub: "Moderate intensity, avoid overtraining", items: ["No HIIT when cortisol is already elevated \u2014 you are adding stress to stress", "Zone 2 cardio 3\u20134x/week, 30\u201345 min \u2014 improves slope without HPA spike", "Moderate loads 60\u201370% 1RM, 10\u201315 reps, mind-muscle focus", "Yoga/mobility 2x/week \u2014 activates parasympathetic via vagal tone", "Never train fasted with high cortisol \u2014 eat protein+carbs 60 min pre", "Post-workout: 20g protein + carbs within 30 min to clear cortisol"] },
  { cond: "Insulin Resistance", title: "Insulin Sensitizing Protocol", sub: "Daily movement, post-meal priority", items: ["15-min walk after every meal \u2014 GLUT4 activation independent of insulin", "Resistance training 3x/week \u2014 increases sensitivity 48\u201372h per session", "Large muscle groups (legs, back) = more glucose disposal capacity", "Cold: 2 min cold shower \u2014 BAT glucose uptake 300% without insulin", "Morning exercise preferred \u2014 insulin sensitivity highest in AM", "Break sitting every 30 min \u2014 2 min movement improves sensitivity"] },
];

const LIFESTYLE = [
  { title: "Light Exposure Architecture", icon: "\u2600\uFE0F", items: ["0\u201330 min post-wake: 10 min outdoor light. Sets clock, triggers CAR, suppresses melatonin", "10 AM\u20132 PM: UVB 15\u201320 min for vitamin D. No sunscreen this window only", "6\u20138 PM: View sunset. Long-wavelength signals SCN that nightfall approaches", "After sunset: dim lights, blue-blockers. Bright light 10PM\u201312AM suppresses melatonin 50%", "Bedroom: absolute darkness. Even dim light through eyelids fragments sleep"] },
  { title: "Temperature Manipulation", icon: "\u2744\uFE0F", items: ["Bedroom 65\u201367F \u2014 core temp must drop 1\u20133F for sleep onset", "Hot bath 90 min before bed \u2014 vasodilation paradoxically cools core faster", "Morning cold 1\u20133 min \u2014 norepinephrine +200\u2013300%, dopamine +250%", "Sauna 3\u20134x/week, 20 min at 170\u2013180F \u2014 GH +200\u2013300%, heat shock proteins", "Post-workout cold: save for non-training days to preserve hypertrophy signal"] },
  { title: "Sleep Architecture", icon: "\u{1F319}", items: ["Consistent wake time 7 days/week \u2014 more important than bedtime", "Last meal 3+ hours before bed \u2014 digestion raises core temp", "Magnesium threonate 144mg or glycinate 400mg before bed \u2014 promotes N3", "No alcohol \u2014 even 1 drink fragments REM 20\u201340%, reducing GH and T pulses", "Apigenin 50mg before bed \u2014 chloride channel agonist, gentle GABA sedation"] },
  { title: "Wearable-to-Hormone Mapping", icon: "\u231A", items: ["HRV (Oura/Whoop) inversely correlates with cortisol. 7-day declining trend = rising baseline", "Resting HR tracks thyroid. Persistent +5\u201310 bpm = check thyroid panel", "Deep sleep % correlates with GH and T production. Below 15% = suboptimal pulses", "Body temp deviation (Oura): rising baseline = inflammation. Dropping = possible low thyroid", "Respiratory rate elevation during sleep = sympathetic dominance = HPA hyperactivation"] },
];

function getStatus(h, v) {
  if (v === "" || v === null || v === undefined) return "empty";
  const n = parseFloat(v);
  if (isNaN(n)) return "empty";
  if (n < h.low) return "low";
  if (n > h.high) return "high";
  if (n >= h.optimal[0] && n <= h.optimal[1]) return "optimal";
  return "suboptimal";
}

const ST = {
  optimal: { c: "#3AAE6F", bg: "rgba(58,174,111,0.08)", l: "Optimal" },
  suboptimal: { c: "#E8A84A", bg: "rgba(232,168,74,0.08)", l: "Suboptimal" },
  low: { c: "#E8544A", bg: "rgba(232,84,74,0.08)", l: "Below Range" },
  high: { c: "#E8544A", bg: "rgba(232,84,74,0.08)", l: "Above Range" },
  empty: { c: "#4A5568", bg: "transparent", l: "\u2014" },
};

function analyze(values) {
  const filled = HORMONES.filter(h => values[h.id] !== "").map(h => ({
    ...h, value: parseFloat(values[h.id]), status: getStatus(h, values[h.id])
  }));
  if (!filled.length) return null;
  const score = Math.round(filled.reduce((a, r) => a + (r.status === "optimal" ? 100 : r.status === "suboptimal" ? 65 : 25), 0) / filled.length);
  const findings = [];
  const protocols = [];
  const c = filled.find(r => r.id === "cortisol");
  const tsh = filled.find(r => r.id === "tsh");
  const t3 = filled.find(r => r.id === "freeT3");
  const t = filled.find(r => r.id === "testosterone");
  const ins = filled.find(r => r.id === "insulin");
  const vd = filled.find(r => r.id === "vitD");
  const prl = filled.find(r => r.id === "prolactin");
  const shbg = filled.find(r => r.id === "shbg");

  if (c && c.status === "high" && t && t.status !== "optimal" && ins && ins.value > 8) {
    findings.push({ sev: 3, title: "Stress-Metabolic-Hormonal Triad", text: "High cortisol drives insulin resistance, which suppresses testosterone, which reduces metabolic rate. Address cortisol first.", color: "#E8544A" });
  }
  if (c && c.status === "high") {
    findings.push({ sev: 2, title: "Elevated Cortisol", text: "Cortisol at " + c.value + " indicates sustained HPA activation. Expect hippocampal volume reduction, PFC suppression, amygdala sensitization.", color: "#E8754A" });
    protocols.push({ title: "HPA Axis Reset", time: "Evening", items: ["Ashwagandha KSM-66 600mg with dinner \u2014 reduces cortisol 23% in 8 weeks", "Morning sunlight 10 min within 30 min of waking", "Phosphatidylserine 400mg with dinner \u2014 blunts ACTH", "NSDR/Yoga Nidra 10 min midday", "Caffeine cutoff 12 PM strict"] });
  }
  if (tsh && tsh.value > 2.5) {
    findings.push({ sev: 2, title: "Subclinical Hypothyroid", text: "TSH " + tsh.value + " is functionally suboptimal." + (t3 && t3.status !== "optimal" ? " Free T3 " + t3.value + " confirms poor conversion." : ""), color: "#4A9FE8" });
    protocols.push({ title: "Thyroid Optimization", time: "With meals", items: ["Selenium 200mcg \u2014 deiodinase cofactor", "Zinc 30mg with dinner", "Gluten elimination 30 days", "Check TPO/TG antibodies", "Brazil nuts 2\u20133 daily"] });
  }
  if (t && (t.status === "low" || t.status === "suboptimal")) {
    findings.push({ sev: t.status === "low" ? 2 : 1, title: "Testosterone " + (t.status === "low" ? "Deficiency" : "Suboptimal"), text: "Testosterone at " + t.value + " ng/dL " + (t.status === "low" ? "is below clinical symptom threshold." : "is below functional optimum."), color: "#E8A84A" });
    protocols.push({ title: "Androgen Optimization", time: "AM/Training", items: ["Compound resistance 3\u20134x/week at 70\u201385% 1RM", "Sleep 7\u20139h at 65\u201367F", "Tongkat Ali 400mg AM", "Boron 10mg daily", "Eliminate alcohol"] });
  }
  if (prl && prl.value > 18) {
    findings.push({ sev: 2, title: "Elevated Prolactin", text: "Prolactin " + prl.value + " suppresses GnRH. Rule out pituitary adenoma and medication effects.", color: "#8A6AE8" });
    protocols.push({ title: "Prolactin Management", time: "Consult", items: ["Repeat fasted prolactin", "Pituitary MRI if persistent", "Vitamin B6 (P5P) 100mg", "Vitamin E 400 IU", "Mucuna pruriens 300mg (L-DOPA)", "Review SSRIs/antipsychotics"] });
  }
  if (shbg && shbg.value > 45) {
    findings.push({ sev: 1, title: "Elevated SHBG", text: "SHBG " + shbg.value + " is sequestering testosterone. Bioavailable T may be critically low even with adequate total T.", color: "#A0884A" });
  }
  if (ins && ins.value > 8) {
    findings.push({ sev: ins.value > 15 ? 2 : 1, title: "Insulin Resistance", text: "Fasting insulin " + ins.value + (ins.value > 15 ? " \u2014 established resistance." : " \u2014 early resistance, best intervention window."), color: "#E8D44A" });
    protocols.push({ title: "Metabolic Reset", time: "Daily", items: ["TRE 16:8", "15-min post-meal walks", "Berberine 500mg with largest meal", "Protein+fiber first, carbs last", "Cold exposure 2 min"] });
  }
  if (vd && vd.value < 50) {
    findings.push({ sev: 1, title: "Vitamin D Insufficiency", text: "At " + vd.value + " ng/mL, VDR gene transcription incomplete. Affects immunity, T synthesis, serotonin.", color: "#E8964A" });
    protocols.push({ title: "Vitamin D Protocol", time: "With fat", items: ["D3 5000 IU with fattiest meal", "K2 MK-7 200mcg", "Magnesium glycinate 400mg", "20 min midday sun"] });
  }
  const ap = PATHWAYS.filter(p => { const f = filled.find(x => x.id === p.from); const to = filled.find(x => x.id === p.to); return f && to && f.status !== "optimal"; });
  const dr = [];
  const er = [];
  if (c && c.status === "high") { dr.push(DIET[0]); er.push(EXERCISE[1]); }
  if (t && (t.status === "low" || t.status === "suboptimal")) { dr.push(DIET[1]); er.push(EXERCISE[0]); }
  if (ins && ins.value > 8) { dr.push(DIET[2]); er.push(EXERCISE[2]); }
  if (tsh && tsh.value > 2.5) { dr.push(DIET[3]); }
  return { score, findings, protocols, filled, total: HORMONES.length, activePathways: ap, dietRecs: dr, exRecs: er };
}

function Wave({ wave, color, w, h }) {
  w = w || 320;
  h = h || 56;
  const mx = Math.max(...wave);
  const pts = wave.map((v, i) => ((i / (wave.length - 1)) * w) + "," + (h - 4 - (v / mx) * (h - 12))).join(" ");
  const area = "0," + h + " " + pts + " " + w + "," + h;
  const labels = ["12AM", "6AM", "12PM", "6PM", "12AM"];
  return (
    <svg width={w} height={h + 16} viewBox={"0 0 " + w + " " + (h + 16)} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={"w" + color.replace("#", "")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={"url(#w" + color.replace("#", "") + ")"} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {wave.map((v, i) => v === mx ? (
        <circle key={i} cx={(i / (wave.length - 1)) * w} cy={h - 4 - (v / mx) * (h - 12)} r="4" fill={color} stroke="#0F172A" strokeWidth="2.5" />
      ) : null)}
      {labels.map((t, i) => (
        <text key={i} x={(i / 4) * w} y={h + 14} textAnchor="middle" fontSize="9" fill="#64748B" fontFamily="IBM Plex Mono, monospace">{t}</text>
      ))}
    </svg>
  );
}

function Arc({ score, size }) {
  size = size || 120;
  const r = size / 2 - 8;
  const circ = Math.PI * r;
  const off = circ - (score / 100) * circ;
  const col = score >= 80 ? "#3AAE6F" : score >= 55 ? "#E8A84A" : "#E8544A";
  const d = "M 8," + (size / 2 + 4) + " A " + r + "," + r + " 0 0 1 " + (size - 8) + "," + (size / 2 + 4);
  return (
    <svg width={size} height={size / 2 + 16} viewBox={"0 0 " + size + " " + (size / 2 + 16)}>
      <path d={d} fill="none" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
      <path d={d} fill="none" stroke={col} strokeWidth="6" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} style={{ transition: "stroke-dashoffset 1s ease" }} />
      <text x={size / 2} y={size / 2 - 2} textAnchor="middle" fontSize="28" fontWeight="700" fill={col} fontFamily="IBM Plex Mono, monospace">{score}</text>
      <text x={size / 2} y={size / 2 + 14} textAnchor="middle" fontSize="8" fill="#64748B" letterSpacing="2">ENDOCRINE SCORE</text>
    </svg>
  );
}

function Card({ children, border }) {
  return (
    <div style={{ background: "#151D2E", border: "1px solid " + (border || "#1E293B"), borderRadius: 12, padding: "16px 20px", marginBottom: 10 }}>
      {children}
    </div>
  );
}

function ItemList({ items }) {
  return items.map((item, j) => {
    const di = item.indexOf(" \u2014 ");
    const main = di > -1 ? item.slice(0, di) : item;
    const detail = di > -1 ? item.slice(di) : "";
    return (
      <div key={j} style={{ display: "flex", gap: 9, marginBottom: 8, alignItems: "flex-start" }}>
        <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 10, color: "#475569", marginTop: 2, flexShrink: 0 }}>{String(j + 1).padStart(2, "0")}</span>
        <div>
          <span style={{ fontSize: 12, color: "#E2E8F0", fontWeight: 500 }}>{main}</span>
          {detail && <span style={{ fontSize: 11.5, color: "#64748B" }}>{detail}</span>}
        </div>
      </div>
    );
  });
}

function SectionLabel({ label }) {
  return <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 10, fontWeight: 600, letterSpacing: 2, color: "#64748B", textTransform: "uppercase", display: "block", marginBottom: 12 }}>{label}</span>;
}

export default function HormoneOptimizer() {
  const [values, setValues] = useState(() => HORMONES.reduce((a, h) => ({ ...a, [h.id]: "" }), {}));
  const [sex, setSex] = useState("male");
  const [age, setAge] = useState("30");
  const [view, setView] = useState("input");
  const [exp, setExp] = useState(null);
  const [result, setResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [blogOpen, setBlogOpen] = useState(null);
  const filled = Object.values(values).filter(v => v !== "").length;

  const run = () => { const r = analyze(values); setResult(r); if (r) setView("results"); };
  const load = () => setValues({ cortisol: "22", tsh: "3.2", freeT3: "2.5", freeT4: "1.0", testosterone: "380", freeT: "6.2", estradiol: "35", progesterone: "0.4", lh: "4.5", fsh: "5.2", shbg: "48", prolactin: "22", dhea: "140", insulin: "14", vitD: "28", hba1c: "5.4", igf1: "165" });

  const runAI = async () => {
    setAiLoading(true);
    setAiResult(null);
    const fh = HORMONES.filter(h => values[h.id] !== "").map(h => h.name + ": " + values[h.id] + " " + h.unit + " (ref " + h.low + "\u2013" + h.high + ", optimal " + h.optimal[0] + "\u2013" + h.optimal[1] + ")").join("\n");
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: "You are Andrew Huberman analyzing a hormone panel for a " + age + "yo " + sex + ". Be mechanistic, cite studies.\n\n" + fh + "\n\nJSON only:\n{\"synthesis\":\"4-5 sentence synthesis\",\"root_mechanism\":\"Single upstream driver\",\"first_intervention\":\"ONE thing with dose+timing\",\"cascade_prediction\":\"What improves downstream\",\"monitoring_plan\":\"Markers + timeline\"}" }]
        })
      });
      const d = await r.json();
      const t = (d.content || []).map(i => i.text || "").join("");
      setAiResult(JSON.parse(t.replace(/```json|```/g, "").trim()));
    } catch (e) {
      setAiResult({ synthesis: "AI unavailable.", root_mechanism: "\u2014", first_intervention: "\u2014", cascade_prediction: "\u2014", monitoring_plan: "\u2014" });
    }
    setAiLoading(false);
  };

  const cats = Object.entries(CATS).map(([k, v]) => ({ key: k, ...v, hormones: HORMONES.filter(h => h.cat === k) }));
  const tabs = [{ k: "input", l: "Panel" }, { k: "results", l: "Analysis" }, { k: "circadian", l: "Circadian" }, { k: "lifestyle", l: "Lifestyle" }, { k: "learn", l: "Learn" }];

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", color: "#E2E8F0", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Serif:wght@400;500;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0}input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}input[type=number]{-moz-appearance:textfield}::selection{background:rgba(232,168,74,0.3)}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#1E293B;border-radius:3px}@keyframes su{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 32px" }}>
        {/* HEADER */}
        <header style={{ marginBottom: 40, borderBottom: "1px solid #1E293B", paddingBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
            <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 11, fontWeight: 600, letterSpacing: 3, color: "#E8A84A", textTransform: "uppercase" }}>Endocrine Intelligence Lab</span>
            <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 10, color: "#475569" }}>v3.0</span>
          </div>
          <h1 style={{ fontFamily: "'IBM Plex Serif'", fontSize: "clamp(30px, 5vw, 46px)", fontWeight: 700, color: "#F8FAFC", lineHeight: 1.1, marginBottom: 8 }}>Hormone Optimizer</h1>
          <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.7, maxWidth: 640 }}>Comprehensive endocrine panel analysis with mechanisms, personalized diet/exercise protocols, circadian architecture, and lifestyle optimization.</p>
          <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap", alignItems: "center" }}>
            {["male", "female"].map(s => (
              <button key={s} onClick={() => setSex(s)} style={{ padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", background: sex === s ? "rgba(232,168,74,0.12)" : "transparent", border: "1px solid " + (sex === s ? "#E8A84A40" : "#1E293B"), color: sex === s ? "#E8A84A" : "#64748B", textTransform: "capitalize" }}>{s}</button>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "0 10px", borderRadius: 6, border: "1px solid #1E293B" }}>
              <span style={{ fontSize: 11, color: "#64748B" }}>Age</span>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} style={{ width: 36, background: "transparent", border: "none", color: "#E2E8F0", fontSize: 13, fontFamily: "'IBM Plex Mono'", outline: "none", textAlign: "center" }} />
            </div>
            <button onClick={load} style={{ padding: "5px 14px", borderRadius: 6, fontSize: 11, cursor: "pointer", background: "transparent", border: "1px solid #1E293B", color: "#64748B" }}>Load sample</button>
            <div style={{ marginLeft: "auto", display: "flex", gap: 3, background: "#1E293B", borderRadius: 8, padding: 3 }}>
              {tabs.map(tab => (
                <button key={tab.k} onClick={() => setView(tab.k)} style={{ padding: "5px 12px", borderRadius: 5, fontSize: 10, fontWeight: 600, cursor: "pointer", background: view === tab.k ? "#0F172A" : "transparent", border: "none", color: view === tab.k ? "#E2E8F0" : "#64748B" }}>{tab.l}</button>
              ))}
            </div>
          </div>
        </header>

        {/* INPUT */}
        {view === "input" && (
          <div>
            {cats.map(cat => (
              <div key={cat.key} style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontFamily: "'IBM Plex Serif'", fontSize: 16, fontWeight: 600, color: "#F1F5F9" }}>{cat.n}</span>
                  <span style={{ fontSize: 11, color: "#475569", fontStyle: "italic" }}>{cat.s}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {cat.hormones.map(h => {
                    const s = getStatus(h, values[h.id]);
                    const sc = ST[s];
                    const isE = exp === h.id;
                    const mn = h.low * 0.4, mx = h.high * 1.5, rng = mx - mn;
                    const oL = ((h.optimal[0] - mn) / rng) * 100;
                    const oW = ((h.optimal[1] - h.optimal[0]) / rng) * 100;
                    const vP = values[h.id] !== "" && !isNaN(parseFloat(values[h.id])) ? Math.max(0, Math.min(100, ((parseFloat(values[h.id]) - mn) / rng) * 100)) : null;
                    return (
                      <div key={h.id}>
                        <div onClick={() => setExp(isE ? null : h.id)} style={{ display: "grid", gridTemplateColumns: "170px 100px 1fr 95px", gap: 10, alignItems: "center", padding: "9px 14px", background: isE ? "#1E293B" : "#151D2E", border: "1px solid " + (isE ? h.color + "30" : "#1E293B"), borderRadius: isE ? "10px 10px 0 0" : "10px", cursor: "pointer" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: h.color, boxShadow: s !== "empty" ? "0 0 6px " + h.color + "50" : "none" }} />
                            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#E2E8F0" }}>{h.name}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <input type="number" value={values[h.id]} onChange={e => { e.stopPropagation(); setValues(p => ({ ...p, [h.id]: e.target.value })); }} onClick={e => e.stopPropagation()} placeholder="\u2014" style={{ width: 56, background: "rgba(255,255,255,0.04)", border: "1px solid #2D3748", borderRadius: 5, padding: "3px 6px", color: "#F1F5F9", fontSize: 12, textAlign: "right", fontFamily: "'IBM Plex Mono'", outline: "none" }} />
                            <span style={{ fontSize: 8.5, color: "#64748B", fontFamily: "'IBM Plex Mono'" }}>{h.unit}</span>
                          </div>
                          <div style={{ position: "relative", height: 4, background: "#1E293B", borderRadius: 2 }}>
                            <div style={{ position: "absolute", left: oL + "%", width: oW + "%", height: "100%", background: h.color + "20", borderRadius: 2 }} />
                            {vP !== null && <div style={{ position: "absolute", left: vP + "%", top: -2, width: 8, height: 8, borderRadius: "50%", background: sc.c, transform: "translateX(-4px)", transition: "left 0.3s" }} />}
                          </div>
                          <div style={{ textAlign: "right" }}>
                            {s !== "empty" && <span style={{ fontSize: 8.5, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: sc.bg, color: sc.c, textTransform: "uppercase", letterSpacing: 0.7, fontFamily: "'IBM Plex Mono'" }}>{sc.l}</span>}
                          </div>
                        </div>
                        {isE && (
                          <div style={{ background: "#1A2332", borderRadius: "0 0 10px 10px", border: "1px solid " + h.color + "20", borderTop: "none", padding: "14px 18px", animation: "su 0.3s ease" }}>
                            <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.7, marginBottom: 10 }}>{h.desc}</p>
                            <div style={{ background: "rgba(232,168,74,0.04)", border: "1px solid rgba(232,168,74,0.1)", borderRadius: 8, padding: "10px 14px", marginBottom: 10 }}>
                              <span style={{ fontSize: 9, fontWeight: 600, color: "#E8A84A", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'IBM Plex Mono'" }}>Mechanism</span>
                              <p style={{ fontSize: 11, color: "#CBD5E1", lineHeight: 1.7, marginTop: 4 }}>{h.moa}</p>
                            </div>
                            <div style={{ fontSize: 10.5, color: "#64748B" }}>
                              Ref: {h.low}{"\u2013"}{h.high} {h.unit} {"\u00B7"} <span style={{ color: h.color }}>Optimal: {h.optimal[0]}{"\u2013"}{h.optimal[1]}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <button onClick={run} disabled={filled < 3} style={{ width: "100%", padding: 13, borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: filled < 3 ? "not-allowed" : "pointer", background: filled >= 3 ? "linear-gradient(135deg, #E8A84A, #E8754A)" : "#1E293B", border: "none", color: filled >= 3 ? "#0F172A" : "#475569", marginTop: 8 }}>
              {filled < 3 ? "Enter " + (3 - filled) + " more markers" : "Run Endocrine Analysis \u2192"}
            </button>
          </div>
        )}

        {/* RESULTS */}
        {view === "results" && result && (
          <div style={{ animation: "su 0.4s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20, marginBottom: 24 }}>
              <Card>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0" }}>
                  <Arc score={result.score} size={140} />
                  <div style={{ fontSize: 11, color: "#64748B", marginTop: 8 }}>{result.filled.length}/{result.total} markers</div>
                  <div style={{ display: "flex", gap: 3, marginTop: 10, flexWrap: "wrap", justifyContent: "center" }}>
                    {result.filled.map(h => <div key={h.id} title={h.name} style={{ width: 9, height: 9, borderRadius: 2, background: ST[h.status].c, opacity: 0.8 }} />)}
                  </div>
                </div>
              </Card>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <SectionLabel label="AI Synthesis" />
                  <button onClick={runAI} disabled={aiLoading} style={{ padding: "5px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", background: "rgba(232,168,74,0.1)", border: "1px solid rgba(232,168,74,0.2)", color: "#E8A84A" }}>{aiLoading ? "Analyzing\u2026" : "Generate Huberman Analysis"}</button>
                </div>
                {aiResult ? (
                  <div>
                    <p style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.8, marginBottom: 12 }}>{aiResult.synthesis}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {[{ l: "Root Mechanism", v: aiResult.root_mechanism, c: "#E8544A" }, { l: "First Intervention", v: aiResult.first_intervention, c: "#3AAE6F" }, { l: "Cascade Prediction", v: aiResult.cascade_prediction, c: "#E8A84A" }, { l: "Monitoring Plan", v: aiResult.monitoring_plan, c: "#4A9FE8" }].map(i => (
                        <div key={i.l} style={{ background: "#0F172A", borderRadius: 8, padding: 10, border: "1px solid #1E293B" }}>
                          <div style={{ fontSize: 8, fontWeight: 700, color: i.c, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3, fontFamily: "'IBM Plex Mono'" }}>{i.l}</div>
                          <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.5 }}>{i.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : <p style={{ fontSize: 12, color: "#475569", textAlign: "center", padding: 16 }}>Generate a Huberman-style mechanistic synthesis</p>}
              </Card>
            </div>

            {result.activePathways.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <SectionLabel label="Active Pathways" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {result.activePathways.slice(0, 6).map((p, i) => {
                    const fH = HORMONES.find(h => h.id === p.from);
                    const tH = HORMONES.find(h => h.id === p.to);
                    return (
                      <Card key={i}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: fH.color }}>{fH.name}</span>
                          <span style={{ fontSize: 10, color: p.type === "inhibit" ? "#E8544A" : "#3AAE6F" }}>{p.type === "inhibit" ? "\u22A3" : "\u2192"}</span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: tH.color }}>{tH.name}</span>
                        </div>
                        <p style={{ fontSize: 10.5, color: "#94A3B8", lineHeight: 1.6 }}>{p.text}</p>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {result.findings.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <SectionLabel label="Clinical Findings" />
                {result.findings.map((f, i) => (
                  <div key={i} style={{ background: "#151D2E", border: "1px solid " + f.color + "20", borderLeft: "3px solid " + f.color, borderRadius: 10, padding: "14px 18px", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                      <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: f.color + "15", color: f.color, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'IBM Plex Mono'" }}>{f.sev === 3 ? "Critical" : f.sev === 2 ? "Significant" : "Notable"}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0" }}>{f.title}</span>
                    </div>
                    <p style={{ fontSize: 12.5, color: "#94A3B8", lineHeight: 1.8 }}>{f.text}</p>
                  </div>
                ))}
              </div>
            )}

            {result.protocols.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <SectionLabel label="Clinical Protocols" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 12 }}>
                  {result.protocols.map((p, i) => (
                    <Card key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9", fontFamily: "'IBM Plex Serif'" }}>{p.title}</span>
                        <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "rgba(232,168,74,0.08)", color: "#E8A84A", fontFamily: "'IBM Plex Mono'", letterSpacing: 1 }}>{p.time}</span>
                      </div>
                      <ItemList items={p.items} />
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {result.dietRecs.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <SectionLabel label="Personalized Diet Protocol" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 12 }}>
                  {result.dietRecs.map((d, i) => (
                    <Card key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9", fontFamily: "'IBM Plex Serif'" }}>{d.title}</span>
                        <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "rgba(74,232,184,0.08)", color: "#4AE8B8", fontFamily: "'IBM Plex Mono'", letterSpacing: 1 }}>{d.cond}</span>
                      </div>
                      <ItemList items={d.items} />
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {result.exRecs.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <SectionLabel label="Exercise Prescription" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 12 }}>
                  {result.exRecs.map((ex, i) => (
                    <Card key={i}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9", fontFamily: "'IBM Plex Serif'", display: "block" }}>{ex.title}</span>
                      <span style={{ fontSize: 10, color: "#E8A84A", fontFamily: "'IBM Plex Mono'", display: "block", marginBottom: 10 }}>{ex.sub}</span>
                      <ItemList items={ex.items} />
                    </Card>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setView("input")} style={{ padding: "8px 20px", borderRadius: 6, fontSize: 12, cursor: "pointer", background: "transparent", border: "1px solid #1E293B", color: "#64748B" }}>{"\u2190"} Back</button>
          </div>
        )}

        {/* CIRCADIAN */}
        {view === "circadian" && (
          <div style={{ animation: "su 0.4s ease" }}>
            <h2 style={{ fontFamily: "'IBM Plex Serif'", fontSize: 22, fontWeight: 700, color: "#F1F5F9", marginBottom: 6 }}>Circadian Hormone Architecture</h2>
            <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7, marginBottom: 24 }}>Every hormone has a time signature. Testing at the wrong time gives the wrong answer.</p>
            <Card>
              <SectionLabel label="24-Hour Overlay" />
              <svg width="100%" viewBox="0 0 640 160" style={{ overflow: "visible" }}>
                <defs>
                  <linearGradient id="dn" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4A9FE8" stopOpacity="0.04" />
                    <stop offset="25%" stopColor="#E8A84A" stopOpacity="0.06" />
                    <stop offset="50%" stopColor="#E8D44A" stopOpacity="0.03" />
                    <stop offset="75%" stopColor="#E8A84A" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#4A9FE8" stopOpacity="0.04" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="640" height="140" fill="url(#dn)" rx="6" />
                {[0, 1, 2, 3, 4].map(i => (
                  <g key={i}>
                    <line x1={i * 160} y1="0" x2={i * 160} y2="140" stroke="#1E293B" strokeWidth="0.8" />
                    <text x={i * 160} y="156" textAnchor="middle" fontSize="10" fill="#475569" fontFamily="IBM Plex Mono, monospace">{["12AM", "6AM", "12PM", "6PM", "12AM"][i]}</text>
                  </g>
                ))}
                {[0.25, 0.5, 0.75].map(p => <line key={p} x1="0" y1={140 - p * 130} x2="640" y2={140 - p * 130} stroke="#1E293B" strokeWidth="0.5" />)}
                {Object.entries(CIRCADIAN).map(([id, d]) => {
                  const h = HORMONES.find(x => x.id === id);
                  const mx = Math.max(...d.wave);
                  const pts = d.wave.map((v, i) => ((i / (d.wave.length - 1)) * 640) + "," + (140 - (v / mx) * 125)).join(" ");
                  return <polyline key={id} points={pts} fill="none" stroke={h.color} strokeWidth="2" strokeLinejoin="round" opacity="0.85" />;
                })}
              </svg>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 12, justifyContent: "center" }}>
                {Object.keys(CIRCADIAN).map(id => {
                  const h = HORMONES.find(x => x.id === id);
                  return <div key={id} style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 14, height: 2.5, borderRadius: 1, background: h.color }} /><span style={{ fontSize: 10, color: "#94A3B8" }}>{h.name}</span></div>;
                })}
              </div>
            </Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
              {Object.entries(CIRCADIAN).map(([id, data]) => {
                const h = HORMONES.find(x => x.id === id);
                const s = getStatus(h, values[h.id]);
                return (
                  <div key={id} style={{ background: "#151D2E", border: "1px solid #1E293B", borderRadius: 14, padding: "20px 22px", display: "grid", gridTemplateColumns: "1fr 350px", gap: 20, alignItems: "start" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: h.color }} />
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", fontFamily: "'IBM Plex Serif'" }}>{h.name}</span>
                        {values[h.id] !== "" && <span style={{ fontSize: 11, fontWeight: 600, color: ST[s].c, fontFamily: "'IBM Plex Mono'", marginLeft: 6 }}>{values[h.id]} {h.unit}</span>}
                      </div>
                      <div style={{ display: "flex", gap: 18, marginBottom: 10 }}>
                        <div><span style={{ fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: 1, fontFamily: "'IBM Plex Mono'", fontWeight: 600 }}>Peak</span><div style={{ fontSize: 12, color: "#3AAE6F", fontWeight: 600, marginTop: 2 }}>{data.peak}</div></div>
                        <div><span style={{ fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: 1, fontFamily: "'IBM Plex Mono'", fontWeight: 600 }}>Nadir</span><div style={{ fontSize: 12, color: "#E8544A", fontWeight: 600, marginTop: 2 }}>{data.nadir}</div></div>
                      </div>
                      <div style={{ background: "rgba(232,168,74,0.04)", border: "1px solid rgba(232,168,74,0.1)", borderRadius: 8, padding: "8px 12px", marginBottom: 8 }}>
                        <span style={{ fontSize: 9, fontWeight: 600, color: "#E8A84A", letterSpacing: 1, textTransform: "uppercase", fontFamily: "'IBM Plex Mono'" }}>Testing Protocol</span>
                        <p style={{ fontSize: 11, color: "#CBD5E1", lineHeight: 1.6, marginTop: 3 }}>{data.protocol}</p>
                      </div>
                      <p style={{ fontSize: 11, color: "#64748B", lineHeight: 1.7, fontStyle: "italic" }}>{data.science}</p>
                    </div>
                    <div style={{ paddingTop: 6 }}>
                      <Wave wave={data.wave} color={h.color} w={330} h={60} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LIFESTYLE */}
        {view === "lifestyle" && (
          <div style={{ animation: "su 0.4s ease" }}>
            <h2 style={{ fontFamily: "'IBM Plex Serif'", fontSize: 22, fontWeight: 700, color: "#F1F5F9", marginBottom: 6 }}>Lifestyle Architecture</h2>
            <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7, marginBottom: 24 }}>Light, temperature, sleep, and wearable data that modulate your endocrine system more than most supplements.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {LIFESTYLE.map((sec, i) => (
                <Card key={i}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: 22 }}>{sec.icon}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", fontFamily: "'IBM Plex Serif'" }}>{sec.title}</span>
                  </div>
                  <ItemList items={sec.items} />
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* LEARN */}
        {view === "learn" && (
          <div style={{ animation: "su 0.4s ease" }}>
            <h2 style={{ fontFamily: "'IBM Plex Serif'", fontSize: 22, fontWeight: 700, color: "#F1F5F9", marginBottom: 6 }}>Deep Dives</h2>
            <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7, marginBottom: 24 }}>Mechanism-level education. Understand why, not just what.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {BLOG.map((post, i) => (
                <div key={i} style={{ background: "#151D2E", border: "1px solid #1E293B", borderRadius: 12, overflow: "hidden" }}>
                  <div onClick={() => setBlogOpen(blogOpen === i ? null : i)} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: post.color + "15", color: post.color, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'IBM Plex Mono'", marginRight: 10 }}>{post.tag}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9", fontFamily: "'IBM Plex Serif'" }}>{post.title}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 10, color: "#475569", fontFamily: "'IBM Plex Mono'" }}>{post.read}</span>
                      <span style={{ color: "#64748B", fontSize: 14, transform: blogOpen === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>{"\u25BE"}</span>
                    </div>
                  </div>
                  {blogOpen === i && (
                    <div style={{ padding: "0 20px 20px", animation: "su 0.3s ease" }}>
                      <div style={{ borderTop: "1px solid #1E293B", paddingTop: 16 }}>
                        {post.body.split("\n\n").map((para, pi) => (
                          <p key={pi} style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.85, marginBottom: 12 }}>{para}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <footer style={{ marginTop: 52, paddingTop: 20, borderTop: "1px solid #1E293B", textAlign: "center" }}>
          <p style={{ fontSize: 10, color: "#334155", lineHeight: 2 }}>
            Built by Aakriti Suri {"\u00B7"} Educational tool {"\u00B7"} Not medical advice {"\u00B7"} Consult an endocrinologist
            <br />Protocols informed by Huberman Lab, Attia, and peer-reviewed literature
          </p>
        </footer>
      </div>
    </div>
  );
}
