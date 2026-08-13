/**
 * 약 설명 다국어화 — 카테고리 라벨 + 개별 설명 문장을 16개 언어로 제공.
 * meds.ts(약 DB, 영어 소스) + medsInfo.ts(설명 문장 번역)를 조합한다.
 * 번역이 없는 언어/문장이면 영어로 폴백한다.
 */
import type { MedInfo } from './meds'
import { INFOS } from './medsInfo'

export type Lang =
  | 'en' | 'ja' | 'zh' | 'es' | 'fr' | 'de' | 'pt' | 'it'
  | 'ko' | 'th' | 'vi' | 'id' | 'tr' | 'ru' | 'ar' | 'hi'

export const LANGS: Lang[] = ['en','ja','zh','es','fr','de','pt','it','ko','th','vi','id','tr','ru','ar','hi']

export interface Localized {
  en: string; ja: string; zh: string; es: string; fr: string; de: string
  pt: string; it: string; ko: string; th: string; vi: string; id: string
  tr: string; ru: string; ar: string; hi: string
}

/** 카테고리 라벨 번역 */
export const CATS: Record<string, Localized> = {
  'Pain & fever': { en: 'Pain & fever', ja: '痛み・解熱', zh: '止痛·退烧', es: 'Dolor y fiebre', fr: 'Douleur et fièvre', de: 'Schmerz & Fieber', pt: 'Dor e febre', it: 'Dolore e febbre', ko: '통증·해열', th: 'ปวดและไข้', vi: 'Giảm đau, hạ sốt', id: 'Nyeri dan demam', tr: 'Ağrı ve ateş', ru: 'Боль и жар', ar: 'ألم وحمى', hi: 'दर्द और बुखार' },
  'NSAID': { en: 'NSAID', ja: 'NSAID', zh: 'NSAID', es: 'AINE', fr: 'AINS', de: 'NSAR', pt: 'AINE', it: 'FANS', ko: 'NSAID', th: 'NSAID', vi: 'NSAID', id: 'NSAID', tr: 'NSAİİ', ru: 'НПВП', ar: 'مضاد التهابي غير ستيرويدي', hi: 'NSAID' },
  'Pain reliever': { en: 'Pain reliever', ja: '鎮痛薬', zh: '止痛药', es: 'Analgésico', fr: 'Antalgique', de: 'Schmerzmittel', pt: 'Analgésico', it: 'Antidolorifico', ko: '진통제', th: 'ยาแก้ปวด', vi: 'Thuốc giảm đau', id: 'Pereda nyeri', tr: 'Ağrı kesici', ru: 'Обезболивающее', ar: 'مسكن للألم', hi: 'दर्दनिवारक' },
  'Corticosteroid': { en: 'Corticosteroid', ja: 'コルチコステロイド', zh: '皮质类固醇', es: 'Corticosteroide', fr: 'Corticostéroïde', de: 'Kortikosteroid', pt: 'Corticosteroide', it: 'Corticosteroide', ko: '코르티코스테로이드', th: 'คอร์ติโคสเตียรอยด์', vi: 'Corticosteroid', id: 'Kortikosteroid', tr: 'Kortikosteroid', ru: 'Кортикостероид', ar: 'كورتيكوستيرويد', hi: 'कॉर्टिकोस्टेरॉइड' },
  'DMARD': { en: 'DMARD', ja: '疾患修飾薬', zh: '改善病情药', es: 'FARME', fr: 'ARMM', de: 'DMARD', pt: 'DMARD', it: 'FANS', ko: 'DMARD', th: 'DMARD', vi: 'DMARD', id: 'DMARD', tr: 'DMARD', ru: 'БПВП', ar: 'دواء معدل للمرض', hi: 'DMARD' },
  'Immunosuppressant': { en: 'Immunosuppressant', ja: '免疫抑制薬', zh: '免疫抑制剂', es: 'Inmunosupresor', fr: 'Immunosuppresseur', de: 'Immunsuppressivum', pt: 'Imunossupressor', it: 'Immunosoppressore', ko: '면역억제제', th: 'ยากดภูมิคุ้มกัน', vi: 'Thuốc ức chế miễn dịch', id: 'Imunosupresan', tr: 'İmmünosupresan', ru: 'Иммунодепрессант', ar: 'مثبط المناعة', hi: 'प्रतिरक्षादमनकारी' },
  'Biologic': { en: 'Biologic', ja: '生物学的製剤', zh: '生物制剂', es: 'Biológico', fr: 'Biothérapie', de: 'Biologikum', pt: 'Biológico', it: 'Farmaco biologico', ko: '생물학적 제제', th: 'ชีววิทยา', vi: 'Sinh học', id: 'Biologis', tr: 'Biyolojik', ru: 'Биопрепарат', ar: 'بيولوجي', hi: 'जैविक' },
  'Anti-inflammatory': { en: 'Anti-inflammatory', ja: '抗炎症薬', zh: '抗炎药', es: 'Antiinflamatorio', fr: 'Anti-inflammatoire', de: 'Entzündungshemmer', pt: 'Anti-inflamatório', it: 'Antinfiammatorio', ko: '항염증제', th: 'ต้านการอักเสบ', vi: 'Chống viêm', id: 'Anti-inflamasi', tr: 'Antiinflamatuvar', ru: 'Противовоспалительное', ar: 'مضاد للالتهاب', hi: 'सूजनरोधी' },
  'Acid reducer': { en: 'Acid reducer', ja: '胃酸抑制薬', zh: '抑酸药', es: 'Reduce acidez', fr: 'Anti-acide', de: 'Säurehemmer', pt: 'Redutor de acidez', it: 'Riduttore di acidità', ko: '위산 억제제', th: 'ยาลดกรด', vi: 'Giảm axit dạ dày', id: 'Penurun asam lambung', tr: 'Asit azaltıcı', ru: 'Снижает кислотность', ar: 'مخفف الحموضة', hi: 'अम्ल कम करने वाला' },
  'Antiemetic': { en: 'Antiemetic', ja: '制吐薬', zh: '止吐药', es: 'Antiemético', fr: 'Antiémétique', de: 'Antiemetikum', pt: 'Antiemético', it: 'Antiemetico', ko: '항구토제', th: 'ยาแก้อาเจียน', vi: 'Chống nôn', id: 'Antiemetik', tr: 'Antiemetik', ru: 'Противорвотное', ar: 'مضاد للقيء', hi: 'वमनरोधी' },
  'Antidiarrheal': { en: 'Antidiarrheal', ja: '止瀉薬', zh: '止泻药', es: 'Antidiarreico', fr: 'Antidiarrhéique', de: 'Mittel gegen Durchfall', pt: 'Antidiarreico', it: 'Antidiarroico', ko: '지사제', th: 'ยาแก้ท้องเสีย', vi: 'Chống tiêu chảy', id: 'Antidiare', tr: 'İshal önleyici', ru: 'Противодиарейное', ar: 'مضاد للإسهال', hi: 'अतिसाररोधी' },
  'Stomach relief': { en: 'Stomach relief', ja: '胃の不快感緩和', zh: '缓解胃部不适', es: 'Alivio estomacal', fr: 'Soulagement de l’estomac', de: 'Magenlinderung', pt: 'Alívio estomacal', it: 'Sollievo gastrico', ko: '위장 완화', th: 'บรรเทาอาการท้อง', vi: 'Giảm khó chịu dạ dày', id: 'Pereda perut', tr: 'Mide rahatlatıcı', ru: 'Облегчение желудка', ar: 'تخفيف المعدة', hi: 'पेट राहत' },
  '5-ASA': { en: '5-ASA', ja: '5-ASA', zh: '5-氨基水杨酸', es: '5-ASA', fr: '5-ASA', de: '5-ASA', pt: '5-ASA', it: '5-ASA', ko: '5-ASA', th: '5-ASA', vi: '5-ASA', id: '5-ASA', tr: '5-ASA', ru: '5-АСК', ar: '5-ASA', hi: '5-ASA' },
  'Antispasmodic': { en: 'Antispasmodic', ja: '鎮痙薬', zh: '解痉药', es: 'Antiespasmódico', fr: 'Antispasmodique', de: 'Krampflöser', pt: 'Antiespasmódico', it: 'Antispastico', ko: '진경제', th: 'ยาคลายกล้ามเนื้อ', vi: 'Chống co thắt', id: 'Antispasmodik', tr: 'Antispazmodik', ru: 'Спазмолитик', ar: 'مضاد للتشنج', hi: 'ऐंठनरोधी' },
  'Laxative': { en: 'Laxative', ja: '下剤', zh: '泻药', es: 'Laxante', fr: 'Laxatif', de: 'Abführmittel', pt: 'Laxante', it: 'Lassativo', ko: '완하제', th: 'ยาระบาย', vi: 'Thuốc nhuận tràng', id: 'Pencahar', tr: 'Müshil', ru: 'Слабительное', ar: 'ملين', hi: 'रेचक' },
  'Fiber supplement': { en: 'Fiber supplement', ja: '食物繊維', zh: '膳食纤维补充剂', es: 'Suplemento de fibra', fr: 'Complément de fibres', de: 'Ballaststoffe', pt: 'Suplemento de fibras', it: 'Integratore di fibre', ko: '식이섬유 보충제', th: 'อาหารเสริมไฟเบอร์', vi: 'Bổ sung chất xơ', id: 'Suplemen serat', tr: 'Lif takviyesi', ru: 'Клетчатка', ar: 'مكمل ألياف', hi: 'फाइबर सप्लीमेंट' },
  'Antidiabetic': { en: 'Antidiabetic', ja: '糖尿病治療薬', zh: '降糖药', es: 'Antidiabético', fr: 'Antidiabétique', de: 'Diabetesmittel', pt: 'Antidiabético', it: 'Antidiabetico', ko: '혈당강하제', th: 'ยาลดน้ำตาล', vi: 'Thuốc tiểu đường', id: 'Antidiabetes', tr: 'Diyabet ilacı', ru: 'Противодиабетическое', ar: 'مضاد للسكري', hi: 'मधुमेहरोधी' },
  'GLP-1': { en: 'GLP-1', ja: 'GLP-1', zh: 'GLP-1', es: 'GLP-1', fr: 'GLP-1', de: 'GLP-1', pt: 'GLP-1', it: 'GLP-1', ko: 'GLP-1', th: 'GLP-1', vi: 'GLP-1', id: 'GLP-1', tr: 'GLP-1', ru: 'ГПП-1', ar: 'GLP-1', hi: 'GLP-1' },
  'Thyroid hormone': { en: 'Thyroid hormone', ja: '甲状腺ホルモン', zh: '甲状腺激素', es: 'Hormona tiroidea', fr: 'Hormone thyroïdienne', de: 'Schilddrüsenhormon', pt: 'Hormônio da tireoide', it: 'Ormone tiroideo', ko: '갑상선 호르몬', th: 'ฮอร์โมนไทรอยด์', vi: 'Hormone tuyến giáp', id: 'Hormon tiroid', tr: 'Tiroid hormonu', ru: 'Гормон щитовидной железы', ar: 'هرمون الغدة الدرقية', hi: 'थायराइड हार्मोन' },
  'Uric acid reducer': { en: 'Uric acid reducer', ja: '尿酸降下薬', zh: '降尿酸药', es: 'Reduce ácido úrico', fr: 'Réducteur d’acide urique', de: 'Harnsäuresenker', pt: 'Redutor de ácido úrico', it: 'Riduttore di acido urico', ko: '요산 저하제', th: 'ยาลดกรดยูริก', vi: 'Giảm axit uric', id: 'Penurun asam urat', tr: 'Ürik asit düşürücü', ru: 'Снижает мочевую кислоту', ar: 'مخفض حمض اليوريك', hi: 'यूरिक एसिड कम करने वाला' },
  'Statin': { en: 'Statin', ja: 'スタチン', zh: '他汀类', es: 'Estatina', fr: 'Statine', de: 'Statin', pt: 'Estatina', it: 'Statina', ko: '스타틴', th: 'สแตติน', vi: 'Statin', id: 'Statin', tr: 'Statin', ru: 'Статин', ar: 'ستاتين', hi: 'स्टैटिन' },
  'Blood pressure': { en: 'Blood pressure', ja: '血圧降下薬', zh: '降压药', es: 'Presión arterial', fr: 'Tension artérielle', de: 'Blutdruck', pt: 'Pressão arterial', it: 'Pressione sanguigna', ko: '혈압약', th: 'ความดันโลหิต', vi: 'Huyết áp', id: 'Tekanan darah', tr: 'Tansiyon', ru: 'Давление', ar: 'ضغط الدم', hi: 'रक्तचाप' },
  'Beta blocker': { en: 'Beta blocker', ja: 'β遮断薬', zh: 'β受体阻滞剂', es: 'Betabloqueante', fr: 'Bêta-bloquant', de: 'Betablocker', pt: 'Betabloqueador', it: 'Betabloccante', ko: '베타차단제', th: 'ยาบล็อกเบตา', vi: 'Thuốc chẹn beta', id: 'Penghambat beta', tr: 'Beta bloker', ru: 'Бета-блокатор', ar: 'حاصر بيتا', hi: 'बीटा-ब्लॉकर' },
  'Diuretic': { en: 'Diuretic', ja: '利尿薬', zh: '利尿剂', es: 'Diurético', fr: 'Diurétique', de: 'Entwässerungsmittel', pt: 'Diurético', it: 'Diuretico', ko: '이뇨제', th: 'ยาขับปัสสาวะ', vi: 'Lợi tiểu', id: 'Diuretik', tr: 'Diüretik', ru: 'Мочегонное', ar: 'مدر للبول', hi: 'मूत्रवर्धक' },
  'Anticoagulant': { en: 'Anticoagulant', ja: '抗凝固薬', zh: '抗凝药', es: 'Anticoagulante', fr: 'Anticoagulant', de: 'Gerinnungshemmer', pt: 'Anticoagulante', it: 'Anticoagulante', ko: '항응고제', th: 'ยาต้านการแข็งตัวของเลือด', vi: 'Chống đông máu', id: 'Antikoagulan', tr: 'Antikoagülan', ru: 'Антикоагулянт', ar: 'مضاد للتخثر', hi: 'थक्कारोधी' },
  'Antiplatelet': { en: 'Antiplatelet', ja: '抗血小板薬', zh: '抗血小板药', es: 'Antiagregante', fr: 'Antiplaquettaire', de: 'Thrombozytenhemmer', pt: 'Antiplaquetário', it: 'Antiaggregante', ko: '항혈소판제', th: 'ยาต้านเกล็ดเลือด', vi: 'Chống kết tập tiểu cầu', id: 'Antiplatelet', tr: 'Antiplatelet', ru: 'Антиагрегант', ar: 'مضاد للصفيحات', hi: 'प्लेटलेटरोधी' },
  'Chest pain': { en: 'Chest pain', ja: '胸痛薬', zh: '胸痛药', es: 'Dolor de pecho', fr: 'Douleur thoracique', de: 'Brustschmerz', pt: 'Dor no peito', it: 'Dolore al petto', ko: '흉통약', th: 'อาการเจ็บหน้าอก', vi: 'Đau ngực', id: 'Nyeri dada', tr: 'Göğüs ağrısı', ru: 'Боль в груди', ar: 'ألم الصدر', hi: 'सीने में दर्द' },
  'Heart medication': { en: 'Heart medication', ja: '心臓病治療薬', zh: '心脏药', es: 'Medicamento cardíaco', fr: 'Médicament cardiaque', de: 'Herzmedikament', pt: 'Medicamento cardíaco', it: 'Farmaco per il cuore', ko: '심장약', th: 'ยารักษาโรคหัวใจ', vi: 'Thuốc tim', id: 'Obat jantung', tr: 'Kalp ilacı', ru: 'Сердечный препарат', ar: 'دواء القلب', hi: 'हृदय की दवा' },
  'Bronchodilator': { en: 'Bronchodilator', ja: '気管支拡張薬', zh: '支气管扩张剂', es: 'Broncodilatador', fr: 'Bronchodilatateur', de: 'Bronchodilatator', pt: 'Broncodilatador', it: 'Broncodilatatore', ko: '기관지확장제', th: 'ยาขยายหลอดลม', vi: 'Thuốc giãn phế quản', id: 'Bronkodilator', tr: 'Bronkodilatör', ru: 'Бронходилататор', ar: 'موسع قصبي', hi: 'ब्रोन्कोडायलेटर' },
  'Asthma': { en: 'Asthma', ja: '喘息', zh: '哮喘', es: 'Asma', fr: 'Asthme', de: 'Asthma', pt: 'Asma', it: 'Asma', ko: '천식', th: 'หอบหืด', vi: 'Hen suyễn', id: 'Asma', tr: 'Astım', ru: 'Астма', ar: 'ربو', hi: 'अस्थमा' },
  'Antidepressant': { en: 'Antidepressant', ja: '抗うつ薬', zh: '抗抑郁药', es: 'Antidepresivo', fr: 'Antidépresseur', de: 'Antidepressivum', pt: 'Antidepressivo', it: 'Antidepressivo', ko: '항우울제', th: 'ยาต้านเศร้า', vi: 'Thuốc chống trầm cảm', id: 'Antidepresan', tr: 'Antidepresan', ru: 'Антидепрессант', ar: 'مضاد للاكتئاب', hi: 'अवसादरोधी' },
  'Nerve pain': { en: 'Nerve pain', ja: '神経痛', zh: '神经痛', es: 'Dolor nervioso', fr: 'Douleur nerveuse', de: 'Nervenschmerz', pt: 'Dor neuropática', it: 'Dolore neuropatico', ko: '신경통', th: 'ปวดเส้นประสาท', vi: 'Đau thần kinh', id: 'Nyeri saraf', tr: 'Sinir ağrısı', ru: 'Невралгия', ar: 'ألم عصبي', hi: 'तंत्रिका दर्द' },
  'Anticonvulsant': { en: 'Anticonvulsant', ja: '抗てんかん薬', zh: '抗惊厥药', es: 'Anticonvulsivo', fr: 'Anticonvulsivant', de: 'Antikonvulsivum', pt: 'Anticonvulsivante', it: 'Anticonvulsivante', ko: '항경련제', th: 'ยากันชัก', vi: 'Chống co giật', id: 'Antikonvulsan', tr: 'Antikonvülsan', ru: 'Противосудорожное', ar: 'مضاد للاختلاج', hi: 'आक्षेपरोधी' },
  'Migraine': { en: 'Migraine', ja: '片頭痛', zh: '偏头痛', es: 'Migraña', fr: 'Migraine', de: 'Migräne', pt: 'Enxaqueca', it: 'Emicrania', ko: '편두통', th: 'ไมเกรน', vi: 'Đau nửa đầu', id: 'Migrain', tr: 'Migren', ru: 'Мигрень', ar: 'صداع نصفي', hi: 'माइग्रेन' },
  'Parkinson’s': { en: 'Parkinson’s', ja: 'パーキンソン病', zh: '帕金森病', es: 'Párkinson', fr: 'Parkinson', de: 'Parkinson', pt: 'Parkinson', it: 'Parkinson', ko: '파킨슨병', th: 'พาร์กินสัน', vi: 'Parkinson', id: 'Parkinson', tr: 'Parkinson', ru: 'Паркинсон', ar: 'باركنسون', hi: 'पार्किंसंस' },
  'ADHD': { en: 'ADHD', ja: 'ADHD', zh: 'ADHD', es: 'TDAH', fr: 'TDAH', de: 'ADHS', pt: 'TDAH', it: 'ADHD', ko: 'ADHD', th: 'ADHD', vi: 'ADHD', id: 'ADHD', tr: 'DEHB', ru: 'СДВГ', ar: 'فرط الحركة', hi: 'ADHD' },
  'Anti-anxiety': { en: 'Anti-anxiety', ja: '抗不安薬', zh: '抗焦虑药', es: 'Ansiolítico', fr: 'Anxiolytique', de: 'Angstlösend', pt: 'Ansiolítico', it: 'Ansiolitico', ko: '항불안제', th: 'ยาคลายกังวล', vi: 'Chống lo âu', id: 'Antiansietas', tr: 'Anksiyolitik', ru: 'Противотревожное', ar: 'مضاد للقلق', hi: 'चिंतारोधी' },
  'Sleep aid': { en: 'Sleep aid', ja: '睡眠薬', zh: '安眠药', es: 'Ayuda para dormir', fr: 'Aide au sommeil', de: 'Schlafmittel', pt: 'Auxílio ao sono', it: 'Sonnifero', ko: '수면제', th: 'ยานอนหลับ', vi: 'Hỗ trợ giấc ngủ', id: 'Bantuan tidur', tr: 'Uyku ilacı', ru: 'Снотворное', ar: 'مساعد للنوم', hi: 'नींद की दवा' },
  'Antibiotic': { en: 'Antibiotic', ja: '抗生物質', zh: '抗生素', es: 'Antibiótico', fr: 'Antibiotique', de: 'Antibiotikum', pt: 'Antibiótico', it: 'Antibiotico', ko: '항생제', th: 'ยาปฏิชีวนะ', vi: 'Kháng sinh', id: 'Antibiotik', tr: 'Antibiyotik', ru: 'Антибиотик', ar: 'مضاد حيوي', hi: 'एंटीबायोटिक' },
  'Antifungal': { en: 'Antifungal', ja: '抗真菌薬', zh: '抗真菌药', es: 'Antifúngico', fr: 'Antifongique', de: 'Antimykotikum', pt: 'Antifúngico', it: 'Antifungino', ko: '항진균제', th: 'ยาต้านเชื้อรา', vi: 'Kháng nấm', id: 'Antijamur', tr: 'Antifungal', ru: 'Противогрибковое', ar: 'مضاد للفطريات', hi: 'एंटीफंगल' },
  'Antiviral': { en: 'Antiviral', ja: '抗ウイルス薬', zh: '抗病毒药', es: 'Antiviral', fr: 'Antiviral', de: 'Virostatikum', pt: 'Antiviral', it: 'Antivirale', ko: '항바이러스제', th: 'ยาต้านไวรัส', vi: 'Kháng virus', id: 'Antivirus', tr: 'Antiviral', ru: 'Противовирусное', ar: 'مضاد للفيروسات', hi: 'एंटीवायरल' },
  'Antihistamine': { en: 'Antihistamine', ja: '抗ヒスタミン薬', zh: '抗组胺药', es: 'Antihistamínico', fr: 'Antihistaminique', de: 'Antihistaminikum', pt: 'Anti-histamínico', it: 'Antistaminico', ko: '항히스타민제', th: 'ยาแก้แพ้', vi: 'Kháng histamin', id: 'Antihistamin', tr: 'Antihistaminik', ru: 'Антигистаминное', ar: 'مضاد للهيستامين', hi: 'एंटीहिस्टामिन' },
}

/** 현재 언어의 약 정보 반환 (번역 없으면 영어 폴백) */
export function medInfo(lang: string, med: MedInfo): { cat: string; info: string } {
  const l = (lang as Lang) || 'en'
  const catL = CATS[med.cat]?.[l] ?? med.cat
  const infoL = (INFOS[med.info] as Record<string, string> | undefined)?.[l] ?? med.info
  return { cat: catL, info: infoL }
}
