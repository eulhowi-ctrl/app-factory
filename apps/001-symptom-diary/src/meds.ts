/**
 * 약 기능 DB — 흔한 약물의 제네릭 이름 → 카테고리 + 한 줄 효과.
 * ⚠️ 참고용 정보입니다. 진단·처방 대체가 아니며, 복약은 반드시 의사·약사와 확인하세요.
 * 약 이름은 국제 제네릭(영문) 기준. 한국어 등 별칭은 medAliases.ts 참조.
 */
import { MED_ALIASES } from './medAliases'

export interface MedInfo {
  cat: string // 카테고리 (짧은 라벨)
  info: string // 한 줄 효과 설명
}

export const MEDS: Record<string, MedInfo> = {
  // ── 통증·염증·면역 (만성질환 핵심) ──────────────
  'acetaminophen': { cat: 'Pain & fever', info: 'Relieves mild pain and lowers fever.' },
  'paracetamol': { cat: 'Pain & fever', info: 'Relieves mild pain and lowers fever.' },
  'ibuprofen': { cat: 'NSAID', info: 'Relieves pain, inflammation, and fever.' },
  'naproxen': { cat: 'NSAID', info: 'Relieves pain and inflammation, long-lasting.' },
  'diclofenac': { cat: 'NSAID', info: 'Relieves pain and inflammation.' },
  'meloxicam': { cat: 'NSAID', info: 'Relieves arthritis pain and inflammation.' },
  'aspirin': { cat: 'NSAID', info: 'Relieves pain and fever; low dose prevents blood clots.' },
  'celecoxib': { cat: 'NSAID', info: 'Relieves pain and inflammation with less stomach irritation.' },
  'tramadol': { cat: 'Pain reliever', info: 'Relieves moderate to severe pain.' },
  'codeine': { cat: 'Pain reliever', info: 'Relieves pain and cough.' },
  'prednisone': { cat: 'Corticosteroid', info: 'Reduces inflammation and calms immune activity.' },
  'prednisolone': { cat: 'Corticosteroid', info: 'Reduces inflammation and calms immune activity.' },
  'methylprednisolone': { cat: 'Corticosteroid', info: 'Reduces inflammation.' },
  'dexamethasone': { cat: 'Corticosteroid', info: 'Reduces inflammation and allergic reactions.' },
  'hydrocortisone': { cat: 'Corticosteroid', info: 'Relieves skin irritation and inflammation.' },
  'methotrexate': { cat: 'DMARD', info: 'Treats autoimmune disease such as rheumatoid arthritis.' },
  'hydroxychloroquine': { cat: 'DMARD', info: 'Treats lupus and rheumatoid arthritis.' },
  'sulfasalazine': { cat: 'DMARD', info: 'Treats inflammatory bowel disease and arthritis.' },
  'azathioprine': { cat: 'Immunosuppressant', info: 'Calms an overactive immune system in autoimmune disease.' },
  'mycophenolate': { cat: 'Immunosuppressant', info: 'Reduces immune activity in autoimmune disease.' },
  'adalimumab': { cat: 'Biologic', info: 'Reduces inflammation in autoimmune disease.' },
  'infliximab': { cat: 'Biologic', info: 'Reduces inflammation in IBD and autoimmune disease.' },
  'tocilizumab': { cat: 'Biologic', info: 'Reduces inflammation in RA and related conditions.' },
  'rituximab': { cat: 'Biologic', info: 'Treats certain autoimmune and blood conditions.' },
  'colchicine': { cat: 'Anti-inflammatory', info: 'Treats gout attacks and related inflammation.' },

  // ── 위장관 (역류·메스꺼움·설사·변비) ─────────────
  'omeprazole': { cat: 'Acid reducer', info: 'Reduces stomach acid for heartburn and reflux.' },
  'esomeprazole': { cat: 'Acid reducer', info: 'Reduces stomach acid for heartburn and reflux.' },
  'pantoprazole': { cat: 'Acid reducer', info: 'Reduces stomach acid for reflux and ulcers.' },
  'lansoprazole': { cat: 'Acid reducer', info: 'Reduces stomach acid for reflux.' },
  'famotidine': { cat: 'Acid reducer', info: 'Reduces stomach acid for heartburn.' },
  'metoclopramide': { cat: 'Antiemetic', info: 'Relieves nausea, vomiting, and slow stomach emptying.' },
  'ondansetron': { cat: 'Antiemetic', info: 'Prevents nausea and vomiting.' },
  'loperamide': { cat: 'Antidiarrheal', info: 'Stops diarrhea.' },
  'bismuth': { cat: 'Stomach relief', info: 'Relieves diarrhea and upset stomach.' },
  'mesalamine': { cat: '5-ASA', info: 'Reduces colon inflammation in ulcerative colitis.' },
  'budesonide': { cat: 'Corticosteroid', info: 'Reduces bowel inflammation in IBD.' },
  'dicyclomine': { cat: 'Antispasmodic', info: 'Relieves stomach cramps and IBS pain.' },
  'polyethylene': { cat: 'Laxative', info: 'Relieves constipation.' },
  'lactulose': { cat: 'Laxative', info: 'Relieves constipation.' },
  'senna': { cat: 'Laxative', info: 'Relieves constipation.' },
  'psyllium': { cat: 'Fiber supplement', info: 'Relieves constipation or diarrhea.' },

  // ── 대사 (당뇨·갑상선·통풍) ───────────────────
  'metformin': { cat: 'Antidiabetic', info: 'Lowers blood sugar in type 2 diabetes.' },
  'glipizide': { cat: 'Antidiabetic', info: 'Lowers blood sugar in type 2 diabetes.' },
  'empagliflozin': { cat: 'Antidiabetic', info: 'Lowers blood sugar; also protects heart and kidneys.' },
  'liraglutide': { cat: 'GLP-1', info: 'Lowers blood sugar and supports weight loss.' },
  'semaglutide': { cat: 'GLP-1', info: 'Lowers blood sugar and supports weight loss.' },
  'insulin': { cat: 'Antidiabetic', info: 'Lowers blood sugar in diabetes.' },
  'levothyroxine': { cat: 'Thyroid hormone', info: 'Replaces missing thyroid hormone.' },
  'allopurinol': { cat: 'Uric acid reducer', info: 'Prevents gout attacks by lowering uric acid.' },
  'febuxostat': { cat: 'Uric acid reducer', info: 'Prevents gout attacks by lowering uric acid.' },

  // ── 심혈관 ───────────────────────────────────
  'atorvastatin': { cat: 'Statin', info: 'Lowers cholesterol to protect the heart.' },
  'rosuvastatin': { cat: 'Statin', info: 'Lowers cholesterol.' },
  'simvastatin': { cat: 'Statin', info: 'Lowers cholesterol.' },
  'amlodipine': { cat: 'Blood pressure', info: 'Lowers blood pressure.' },
  'lisinopril': { cat: 'Blood pressure', info: 'Lowers blood pressure; protects the kidneys.' },
  'losartan': { cat: 'Blood pressure', info: 'Lowers blood pressure.' },
  'metoprolol': { cat: 'Beta blocker', info: 'Lowers blood pressure and heart rate.' },
  'propranolol': { cat: 'Beta blocker', info: 'Lowers blood pressure; also prevents migraines.' },
  'furosemide': { cat: 'Diuretic', info: 'Removes excess fluid from the body (edema).' },
  'hydrochlorothiazide': { cat: 'Diuretic', info: 'Lowers blood pressure and removes excess fluid.' },
  'spironolactone': { cat: 'Diuretic', info: 'Removes excess fluid; used for heart failure and hormonal conditions.' },
  'warfarin': { cat: 'Anticoagulant', info: 'Prevents blood clots.' },
  'apixaban': { cat: 'Anticoagulant', info: 'Prevents blood clots.' },
  'clopidogrel': { cat: 'Antiplatelet', info: 'Prevents blood clots and heart attacks.' },
  'nitroglycerin': { cat: 'Chest pain', info: 'Relieves angina (chest pain).' },
  'digoxin': { cat: 'Heart medication', info: 'Treats heart failure and irregular heartbeat.' },

  // ── 호흡기 (천식·COPD) ───────────────────────
  'albuterol': { cat: 'Bronchodilator', info: 'Relieves wheezing and shortness of breath.' },
  'salbutamol': { cat: 'Bronchodilator', info: 'Relieves wheezing and shortness of breath.' },
  'fluticasone': { cat: 'Corticosteroid', info: 'Reduces airway inflammation in asthma.' },
  'montelukast': { cat: 'Asthma', info: 'Prevents asthma symptoms and allergies.' },
  'ipratropium': { cat: 'Bronchodilator', info: 'Relieves breathing difficulty in COPD.' },
  'salmeterol': { cat: 'Bronchodilator', info: 'Prevents asthma and COPD symptoms.' },

  // ── 정신·신경 (우울·불안·신경통·편두통) ─────────
  'sertraline': { cat: 'Antidepressant', info: 'Treats depression and anxiety.' },
  'fluoxetine': { cat: 'Antidepressant', info: 'Treats depression and anxiety.' },
  'escitalopram': { cat: 'Antidepressant', info: 'Treats depression and anxiety.' },
  'venlafaxine': { cat: 'Antidepressant', info: 'Treats depression and anxiety.' },
  'duloxetine': { cat: 'Antidepressant', info: 'Treats depression, anxiety, and nerve pain.' },
  'amitriptyline': { cat: 'Nerve pain', info: 'Treats nerve pain, migraine, and depression.' },
  'gabapentin': { cat: 'Anticonvulsant', info: 'Treats nerve pain and seizures.' },
  'pregabalin': { cat: 'Anticonvulsant', info: 'Treats nerve pain and anxiety.' },
  'topiramate': { cat: 'Migraine', info: 'Prevents migraines and treats seizures.' },
  'sumatriptan': { cat: 'Migraine', info: 'Relieves migraine attacks.' },
  'levodopa': { cat: 'Parkinson’s', info: 'Relieves Parkinson’s symptoms.' },
  'methylphenidate': { cat: 'ADHD', info: 'Treats ADHD.' },
  'alprazolam': { cat: 'Anti-anxiety', info: 'Relieves anxiety (short-term).' },
  'zolpidem': { cat: 'Sleep aid', info: 'Helps with insomnia.' },
  'melatonin': { cat: 'Sleep aid', info: 'Helps regulate sleep.' },

  // ── 감염 (항생제·항바이러스) ─────────────────
  'amoxicillin': { cat: 'Antibiotic', info: 'Treats bacterial infections.' },
  'azithromycin': { cat: 'Antibiotic', info: 'Treats bacterial infections.' },
  'ciprofloxacin': { cat: 'Antibiotic', info: 'Treats bacterial infections.' },
  'doxycycline': { cat: 'Antibiotic', info: 'Treats bacterial infections.' },
  'fluconazole': { cat: 'Antifungal', info: 'Treats fungal infections.' },
  'acyclovir': { cat: 'Antiviral', info: 'Treats herpes infections.' },
  'oseltamivir': { cat: 'Antiviral', info: 'Treats influenza.' },

  // ── 알레르기 ─────────────────────────────────
  'cetirizine': { cat: 'Antihistamine', info: 'Relieves allergy symptoms.' },
  'loratadine': { cat: 'Antihistamine', info: 'Relieves allergy symptoms.' },
  'fexofenadine': { cat: 'Antihistamine', info: 'Relieves allergy symptoms.' },
  'diphenhydramine': { cat: 'Antihistamine', info: 'Relieves allergies and helps sleep.' },
  'desloratadine': { cat: 'Antihistamine', info: 'Relieves allergy symptoms.' },

  // ── 확장 추가 (배치3) ─────────────────────────
  'bupropion': { cat: 'Antidepressant', info: 'Treats depression and anxiety.' },
  'citalopram': { cat: 'Antidepressant', info: 'Treats depression and anxiety.' },
  'mirtazapine': { cat: 'Antidepressant', info: 'Treats depression and anxiety.' },
  'trazodone': { cat: 'Antidepressant', info: 'Treats depression and anxiety.' },
  'carbamazepine': { cat: 'Anticonvulsant', info: 'Treats nerve pain and seizures.' },
  'lamotrigine': { cat: 'Anticonvulsant', info: 'Treats nerve pain and seizures.' },
  'diazepam': { cat: 'Anti-anxiety', info: 'Relieves anxiety (short-term).' },
  'lorazepam': { cat: 'Anti-anxiety', info: 'Relieves anxiety (short-term).' },
  'carvedilol': { cat: 'Beta blocker', info: 'Lowers blood pressure and heart rate.' },
  'diltiazem': { cat: 'Blood pressure', info: 'Lowers blood pressure and heart rate.' },
  'valsartan': { cat: 'Blood pressure', info: 'Lowers blood pressure.' },
  'telmisartan': { cat: 'Blood pressure', info: 'Lowers blood pressure.' },
  'ezetimibe': { cat: 'Statin', info: 'Lowers cholesterol.' },
  'rivaroxaban': { cat: 'Anticoagulant', info: 'Prevents blood clots.' },
  'dabigatran': { cat: 'Anticoagulant', info: 'Prevents blood clots.' },
  'glimepiride': { cat: 'Antidiabetic', info: 'Lowers blood sugar in type 2 diabetes.' },
  'sitagliptin': { cat: 'Antidiabetic', info: 'Lowers blood sugar in type 2 diabetes.' },
  'domperidone': { cat: 'Antiemetic', info: 'Relieves nausea, vomiting, and slow stomach emptying.' },
  'ketorolac': { cat: 'NSAID', info: 'Relieves pain and inflammation.' },
  'piroxicam': { cat: 'NSAID', info: 'Relieves pain and inflammation.' },
  'indomethacin': { cat: 'NSAID', info: 'Treats gout attacks and related inflammation.' },
  'cephalexin': { cat: 'Antibiotic', info: 'Treats bacterial infections.' },
  'clarithromycin': { cat: 'Antibiotic', info: 'Treats bacterial infections.' },
  'metronidazole': { cat: 'Antibiotic', info: 'Treats bacterial infections.' },
  'theophylline': { cat: 'Bronchodilator', info: 'Relieves wheezing and shortness of breath.' },
}

/** 정확히 또는 일부 일치하는 약 정보 찾기 (영어명 + 한국어 별칭). 없으면 null. */
export function lookupMed(input: string): MedInfo | null {
  const q = input.trim().toLowerCase()
  if (!q) return null
  if (MEDS[q]) return MEDS[q]
  // 별칭(한국어 등) 정확 일치
  const byAlias = Object.entries(MED_ALIASES).find(([, aliases]) =>
    aliases.some((a) => a.toLowerCase() === q)
  )
  if (byAlias) return MEDS[byAlias[0]]
  // 부분 일치 (영어명 또는 별칭의 접두) — 일치 항목 1개일 때만
  if (q.length >= 3) {
    const hits = Object.keys(MEDS).filter(
      (name) =>
        name.startsWith(q) ||
        (MED_ALIASES[name] ?? []).some((a) => a.toLowerCase().startsWith(q))
    )
    if (hits.length === 1) return MEDS[hits[0]]
  }
  return null
}

/** 자동완성용 후보 목록 — 영어명 또는 한국어 별칭 접두 매칭 */
export function suggestMeds(input: string, limit = 6): { name: string; info: MedInfo }[] {
  const q = input.trim().toLowerCase()
  if (!q) return []
  const res: { name: string; info: MedInfo }[] = []
  for (const [name, info] of Object.entries(MEDS)) {
    const aliases = MED_ALIASES[name] ?? []
    if (name.startsWith(q) || aliases.some((a) => a.toLowerCase().startsWith(q))) {
      res.push({ name, info })
    }
  }
  return res.slice(0, limit)
}

/** 입력(영어/한국어 별칭) → 정식 영어 제네릭명. 못 찾으면 입력 그대로. */
export function canonicalName(input: string): string {
  const q = input.trim().toLowerCase()
  if (!q) return q
  if (MEDS[q]) return q
  const byAlias = Object.entries(MED_ALIASES).find(([, a]) => a.some((x) => x.toLowerCase() === q))
  return byAlias ? byAlias[0] : q
}
