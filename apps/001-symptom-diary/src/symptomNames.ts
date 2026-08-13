// 흔한 증상 이름 목록 (영어) — 증상 자동완성용
export const SYMPTOM_NAMES: string[] = [
  'Pain', 'Headache', 'Fatigue', 'Fever', 'Nausea', 'Dizziness',
  'Joint pain', 'Muscle pain', 'Rash', 'Itching', 'Shortness of breath', 'Cough',
  'Sore throat', 'Abdominal pain', 'Diarrhea', 'Constipation', 'Bloating', 'Heartburn',
  'Chest pain', 'Palpitations', 'Brain fog', 'Memory problems', 'Vision changes', 'Sensitivity to light',
  'Ringing in ears', 'Sleeplessness', 'Anxiety', 'Depression', 'Mood swings', 'Loss of appetite',
  'Weight loss', 'Weight gain', 'Swelling', 'Numbness', 'Tingling', 'Tremor',
  'Stiffness', 'Sweating', 'Chills', 'Mouth sores', 'Dry eyes', 'Hair loss',
  'Weakness', 'Sleepiness', 'Low energy', 'Irritability',
]

export function suggestSymptoms(input: string, limit = 6): string[] {
  const q = input.trim().toLowerCase()
  if (!q) return []
  return SYMPTOM_NAMES.filter((n) => n.toLowerCase().startsWith(q)).slice(0, limit)
}
