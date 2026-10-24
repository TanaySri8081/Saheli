import { PeriodLog, UserProfile, CyclePhaseInfo, PredictionResult, BiologicalPhase } from "@/types";

/**
 * Format a Date object to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Parse YYYY-MM-DD to local Date object at midnight
 */
export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Calculate difference in whole days between two Date objects (b - a)
 */
export function diffInDays(a: Date, b: Date): number {
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utcB - utcA) / (1000 * 60 * 60 * 24));
}

/**
 * Calculate transparent rolling average of past cycle lengths
 */
export function calculateRollingAverageCycleLength(
  logs: PeriodLog[],
  fallbackLength: number = 28
): number {
  if (!logs || logs.length < 2) {
    return fallbackLength;
  }

  // Sort descending by start date
  const sorted = [...logs].sort(
    (a, b) => parseDate(b.start_date).getTime() - parseDate(a.start_date).getTime()
  );

  const cycleLengths: number[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const currentStart = parseDate(sorted[i].start_date);
    const previousStart = parseDate(sorted[i + 1].start_date);
    const length = diffInDays(previousStart, currentStart);

    // Standard clinical filter: ignore anomalies < 20 days or > 60 days
    if (length >= 20 && length <= 60) {
      cycleLengths.push(length);
    }
  }

  if (cycleLengths.length === 0) {
    return fallbackLength;
  }

  // Take the most recent 4 cycles and compute average
  const recent = cycleLengths.slice(0, 4);
  const sum = recent.reduce((acc, curr) => acc + curr, 0);
  return Math.round(sum / recent.length);
}

/**
 * Determine biological phase and clinical details for any day in the cycle
 */
export function getPhaseForCycleDay(
  dayInCycle: number,
  cycleLength: number = 28,
  periodDuration: number = 5
): CyclePhaseInfo {
  // Ovulation is clinically approximated at 14 days prior to next expected menses
  const ovulationDay = Math.max(10, cycleLength - 14);
  const fertileStart = ovulationDay - 2;
  const fertileEnd = ovulationDay + 1;

  let phase: BiologicalPhase;
  let phaseNameEn: string;
  let phaseNameHi: string;
  let colorHex: string;
  let containerColorHex: string;
  let textColorHex: string;
  let summaryEn: string;
  let summaryHi: string;
  let nutritionTipEn: string;
  let nutritionTipHi: string;

  if (dayInCycle <= periodDuration) {
    phase = "menstrual";
    phaseNameEn = "Menstrual Phase";
    phaseNameHi = "माहवारी चरण (रक्तस्राव)";
    colorHex = "#724038";
    containerColorHex = "#ffdad4";
    textColorHex = "#350f0a";
    summaryEn =
      "Your body is releasing the uterine lining. Hormones are at baseline. Prioritize rest, slow somatic breathing, and warm nourishment.";
    summaryHi =
      "शरीर गर्भाशय की परत को मुक्त कर रहा है। हार्मोन न्यूनतम स्तर पर हैं। आराम, गहरी सांस और गर्म पौष्टिक आहार को प्राथमिकता दें।";
    nutritionTipEn =
      "Warm ginger-jaggery tea, soft moong khichdi with ghee, iron-dense spinach and beetroot.";
    nutritionTipHi =
      "अदरक-गुड़ का गर्म काढ़ा, घी वाली मूंग दाल खिचड़ी, पालक और चुकंदर से भरपूर आयरन आहार।";
  } else if (dayInCycle < fertileStart) {
    phase = "follicular";
    phaseNameEn = "Follicular Phase";
    phaseNameHi = "कणिका विकास चरण (ऊर्जा उदय)";
    colorHex = "#482e47";
    containerColorHex = "#f9eaf3";
    textColorHex = "#211920";
    summaryEn =
      "FSH and estrogen are rising, stimulating ovarian follicles. Energy, mental clarity, and metabolic renewal are increasing.";
    summaryHi =
      "एस्ट्रोजन हार्मोन बढ़ रहा है। शारीरिक ऊर्जा, एकाग्रता और ताजगी में सुधार हो रहा है। रचनात्मक कार्यों के लिए उत्तम समय।";
    nutritionTipEn =
      "Sprouted salads, homemade chaas/curd, pumpkin & flax seeds, lightly steamed green vegetables.";
    nutritionTipHi =
      "अंकुरित मूंग सलाद, घर की बनी छाछ, कद्दू और अलसी के बीज, हल्की पकी हरी सब्जियां।";
  } else if (dayInCycle <= fertileEnd) {
    phase = "ovulatory";
    phaseNameEn = "Ovulatory Window";
    phaseNameHi = "अंडोत्सर्ग चरण (सर्वोच्च ऊर्जा)";
    colorHex = "#44664d";
    containerColorHex = "#c5eccc";
    textColorHex = "#00210e";
    summaryEn =
      "LH surge triggers the mature egg release. Peak estrogen, vibrant mood, and heightened verbal fluidity.";
    summaryHi =
      "परिपक्व डिंब का निष्कासन। एस्ट्रोजन अपने चरम पर है। शरीर में सर्वाधिक ऊर्जा, उत्साह और आत्मविश्वास का समय।";
    nutritionTipEn =
      "Fresh coconut water, seasonal berries, cooling pomegranate, and hydration from earthen matka.";
    nutritionTipHi =
      "ताजा नारियल पानी, अनार, मौसमी फल और मटके का शीतल जल। शरीर को ठंडा और हाइड्रेटेड रखें।";
  } else {
    phase = "luteal";
    phaseNameEn = "Luteal Phase";
    phaseNameHi = "पीत पिंड चरण (धैर्य व विश्राम)";
    colorHex = "#60445f";
    containerColorHex = "#ffeff9";
    textColorHex = "#2a132b";
    summaryEn =
      "Progesterone dominates, warming body temperature and calming the nervous system. As progesterone dips, gentle PMS awareness is key.";
    summaryHi =
      "प्रोजेस्टेरोन प्रमुख है। शरीर को सहज गर्माहट और पौष्टिकता की आवश्यकता होती है। मन को शांत और सहज रखें।";
    nutritionTipEn =
      "Roasted chana, baked sweet potato with cinnamon, sesame & sunflower seeds, magnesium-rich dark greens.";
    nutritionTipHi =
      "भुने चने, शकरकंद चाट, तिल और सूरजमुखी के बीज, मैग्नीशियम युक्त हरी पत्तेदार सब्जियां।";
  }

  return {
    phase,
    phaseNameEn,
    phaseNameHi,
    dayInCycle,
    totalCycleDays: cycleLength,
    colorHex,
    containerColorHex,
    textColorHex,
    summaryEn,
    summaryHi,
    nutritionTipEn,
    nutritionTipHi,
  };
}

/**
 * Predict next cycle windows, ovulation, and uncertainty bounds
 */
export function predictCycle(
  profile: UserProfile,
  logs: PeriodLog[],
  targetDate?: Date
): PredictionResult {
  const target = targetDate || new Date();
  const avgCycleLength = calculateRollingAverageCycleLength(logs, profile.avg_cycle_length || 28);
  const avgDuration = profile.avg_period_duration || 5;

  // Use most recent period start date from logs, or fall back to profile.last_period_date
  let lastStartStr = profile.last_period_date;
  if (logs.length > 0) {
    const sorted = [...logs].sort(
      (a, b) => parseDate(b.start_date).getTime() - parseDate(a.start_date).getTime()
    );
    lastStartStr = sorted[0].start_date;
  }

  const lastStartDate = parseDate(lastStartStr);

  // Compute next period start date
  const nextStartDate = new Date(lastStartDate);
  nextStartDate.setDate(nextStartDate.getDate() + avgCycleLength);

  const nextEndDate = new Date(nextStartDate);
  nextEndDate.setDate(nextEndDate.getDate() + avgDuration - 1);

  // Estimated ovulation: 14 days before next period
  const ovulationDate = new Date(nextStartDate);
  ovulationDate.setDate(ovulationDate.getDate() - 14);

  // Fertile window: 4 days before ovulation to 1 day after
  const fertileStart = new Date(ovulationDate);
  fertileStart.setDate(fertileStart.getDate() - 4);

  const fertileEnd = new Date(ovulationDate);
  fertileEnd.setDate(fertileEnd.getDate() + 1);

  // Days until next period
  const diff = diffInDays(target, nextStartDate);
  const isLate = diff < 0;
  const daysLate = isLate ? Math.abs(diff) : 0;
  const daysUntilNextPeriod = isLate ? 0 : diff;

  // Uncertainty bounds based on rhythm type
  let uncertaintyDays = 2;
  if (profile.cycle_rhythm_type === "irregular") {
    uncertaintyDays = 4;
  } else if (profile.cycle_rhythm_type === "pcos") {
    uncertaintyDays = 7;
  }

  return {
    nextPeriodStartDate: formatDate(nextStartDate),
    nextPeriodEndDate: formatDate(nextEndDate),
    estimatedOvulationDate: formatDate(ovulationDate),
    fertileWindowStart: formatDate(fertileStart),
    fertileWindowEnd: formatDate(fertileEnd),
    uncertaintyDays,
    daysUntilNextPeriod,
    isLate,
    daysLate,
  };
}

/**
 * Compute current day in cycle (1-indexed) based on last period date
 */
export function getCurrentCycleDay(lastPeriodDateStr: string, currentDate?: Date): number {
  const lastStart = parseDate(lastPeriodDateStr);
  const current = currentDate || new Date();
  const diff = diffInDays(lastStart, current);
  // Cycle day 1 is the start day
  return Math.max(1, diff + 1);
}
