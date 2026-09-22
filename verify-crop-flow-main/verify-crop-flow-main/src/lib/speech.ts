/** Farmer voice confirmation via the browser speech engine. */

export type VoiceLang = "en" | "hi" | "mr";

export const VOICE_LANGS: Array<{ code: VoiceLang; label: string; bcp47: string }> = [
  { code: "en", label: "English", bcp47: "en-IN" },
  { code: "hi", label: "हिंदी (Hindi)", bcp47: "hi-IN" },
  { code: "mr", label: "मराठी (Marathi)", bcp47: "mr-IN" },
];

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function confirmationScript(
  lang: VoiceLang,
  farmer: string,
  weight: string,
  grade: string,
): string {
  if (lang === "hi")
    return `किसान ${farmer}. आपकी फसल का वजन ${weight} किलोग्राम है. आपका ग्रेड ${grade} है. कृपया इस लेन-देन की पुष्टि करें.`;
  if (lang === "mr")
    return `शेतकरी ${farmer}. तुमच्या पिकाचे वजन ${weight} किलोग्रॅम आहे. तुमचा दर्जा ${grade} आहे. कृपया या व्यवहाराची खात्री करा.`;
  return `Farmer ${farmer}. Your crop weight is ${weight} kilograms. Your grade is ${grade}. Please confirm this transaction.`;
}

export function speak(text: string, lang: VoiceLang, onEnd?: () => void): boolean {
  if (!speechSupported()) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = VOICE_LANGS.find((l) => l.code === lang)?.bcp47 ?? "en-IN";
  u.rate = 0.92;
  u.pitch = 1;
  if (onEnd) u.onend = () => onEnd();
  synth.speak(u);
  return true;
}

export function pauseSpeech() {
  if (speechSupported()) window.speechSynthesis.pause();
}
export function resumeSpeech() {
  if (speechSupported()) window.speechSynthesis.resume();
}
export function stopSpeech() {
  if (speechSupported()) window.speechSynthesis.cancel();
}
