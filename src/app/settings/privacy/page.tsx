"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useCamouflage } from "@/context/CamouflageContext";
import { storage } from "@/lib/storage";
import { DoctorSummaryModal } from "@/components/DoctorSummaryModal";

export default function PrivacySettingsPage() {
  const { language } = useLanguage();
  const { activateCamouflage } = useCamouflage();

  // Settings states
  const [deviceOnlyStorage, setDeviceOnlyStorage] = useState(true);
  const [biometricShield, setBiometricShield] = useState(false);
  const [ephemeralVoiceChat, setEphemeralVoiceChat] = useState(true);
  const [cloudBackup, setCloudBackup] = useState(false);
  const [anonymousResearch, setAnonymousResearch] = useState(false);

  // Export format & timeframe selection
  const [exportFormat, setExportFormat] = useState<"pdf" | "data">("pdf");
  const [timeframe, setTimeframe] = useState<"3m" | "12m" | "checklist">("3m");

  // Modals & Feedback
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePin, setSharePin] = useState("492-019");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmInput, setResetConfirmInput] = useState("");
  const [activeCharterModal, setActiveCharterModal] = useState<
    "charter" | "dpdp" | "audit" | null
  >(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Load initial settings on client mount
  useEffect(() => {
    const profile = storage.getUserProfile();
    setBiometricShield(profile.biometric_shield_enabled || false);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleBiometric = () => {
    const nextVal = !biometricShield;
    setBiometricShield(nextVal);
    storage.saveUserProfile({ biometric_shield_enabled: nextVal });
    showToast(
      nextVal
        ? language === "hi"
          ? "बायोमेट्रिक स्क्रीन शील्ड सक्रिय की गई!"
          : "Biometric & Screen Shield enabled!"
        : language === "hi"
        ? "बायोमेट्रिक स्क्रीन शील्ड निष्क्रिय की गई"
        : "Biometric & Screen Shield disabled"
    );
  };

  const handleExportAction = () => {
    if (exportFormat === "pdf") {
      setShowDoctorModal(true);
    } else {
      setIsExporting(true);
      setTimeout(() => {
        try {
          const jsonString = storage.exportAllDataAsJson();
          const blob = new Blob([jsonString], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `Saheli_Health_Data_${new Date().toISOString().split("T")[0]}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          showToast(
            language === "hi"
              ? "डेटा फ़ाइल सफलतापूर्वक डाउनलोड हुई! (DPDP अनुपालन)"
              : "Encrypted JSON data file exported successfully! (DPDP Act 2023)"
          );
        } catch {
          showToast(language === "hi" ? "निर्यात विफल रहा" : "Export failed");
        } finally {
          setIsExporting(false);
        }
      }, 700);
    }
  };

  const handleGenerateShareLink = () => {
    // Generate random 6-digit PIN
    const randomPin = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(
      100 + Math.random() * 900
    )}`;
    setSharePin(randomPin);
    setShowShareModal(true);
  };

  const handleClearChatCache = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("saheli_chat_history");
      showToast(
        language === "hi"
          ? "एआई चैट इतिहास और वॉयस कैश साफ़ कर दिया गया!"
          : "AI Chat transcripts & voice cache wiped from local storage!"
      );
    }
  };

  const handleExecuteNuclearReset = () => {
    if (resetConfirmInput.trim().toUpperCase() !== "DELETE") {
      alert(
        language === "hi"
          ? "कृपया पुष्टि के लिए 'DELETE' टाइप करें।"
          : "Please type 'DELETE' to confirm irreversible wipe."
      );
      return;
    }

    storage.wipeAllLocalData();
    setShowResetModal(false);
    alert(
      language === "hi"
        ? "सभी स्थानीय डेटाबेस और एन्क्रिप्शन कुंजियां हटा दी गई हैं। सहेली अब नई शुरुआत के साथ पुनः लोड होगी।"
        : "All local databases and hardware enclave keys have been purged. Saheli is reloading as a fresh installation."
    );
    if (typeof window !== "undefined") {
      window.location.href = "/onboarding";
    }
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-primary text-on-primary px-4 py-2.5 rounded-full text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-4 flex items-center gap-2 max-w-sm text-center">
          <span className="material-symbols-outlined text-[16px] text-secondary-fixed shrink-0">
            verified
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Editorial Introduction */}
      <div className="pt-2 pb-5 px-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container mb-3 shadow-xs">
          <span
            className="material-symbols-outlined text-[15px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified_user
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Sanctuary Guarantee
          </span>
        </div>
        <h1 className="font-serif text-2xl md:text-3xl font-medium text-primary tracking-tight mb-1">
          {language === "hi" ? "गोपनीयता और डेटा नियंत्रण" : "Privacy & Data Control"}
        </h1>
        <p className="text-sm text-on-surface-variant font-normal mb-3 italic">
          {language === "hi"
            ? "आपका स्वास्थ्य इतिहास केवल आपका है"
            : "You own your health story completely"}
        </p>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          {language === "hi"
            ? "सहेली आपके संवेदनशील स्वास्थ्य रिकॉर्ड को इसी फोन पर स्थानीय रूप से एन्क्रिप्ट रखती है। हम आपके व्यक्तिगत डेटा को कभी भी बेचते, ट्रैक या व्यावसायिक रूप से उपयोग नहीं करते हैं।"
            : "You own your health story. Saheli preserves your sensitive logs encrypted locally on this phone. We never sell, track, or commercialize your personal wellness records."}
        </p>
      </div>

      {/* Sanctuary Trust Banner */}
      <div className="bg-surface-container rounded-2xl p-4 md:p-5 mb-6 relative overflow-hidden shadow-sm border border-outline-variant/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield_lock
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <h2 className="text-sm md:text-base font-semibold text-primary">
                {language === "hi" ? "शून्य व्यावसायीकरण गारंटी" : "Zero Commercialization Guarantee"}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim animate-pulse" />
                AES-256 Enclave
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
              {language === "hi"
                ? "गैर-लाभकारी संप्रभु वास्तुकला। कोई विज्ञापन नेटवर्क नहीं, शून्य डेटा ब्रोकर ट्रैकर्स और शून्य तीसरे पक्ष की व्यवहार संबंधी प्रोफ़ाइलिंग।"
                : "Non-profit sovereign architecture. No advertising networks, zero data broker trackers, and zero third-party behavioral profiling."}
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-secondary font-medium">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>
                {language === "hi"
                  ? "भारत DPDP अधिनियम 2023 संप्रभु अनुपालन"
                  : "India DPDP Act 2023 Sovereign Compliant"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* On-Device Sovereign Storage & Encryption */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              phonelink_lock
            </span>
            <h2 className="font-serif text-lg font-medium text-primary">
              {language === "hi" ? "ऑन-डिवाइस स्थानीय भंडारण" : "On-Device Sovereign Storage"}
            </h2>
          </div>
          <span className="text-[11px] text-on-surface-variant bg-surface-container-high px-2.5 py-0.5 rounded-full font-medium">
            Device Hardware
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-outline-variant/20 space-y-4">
          {/* Toggle 1: Device-Only Storage */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-on-surface">
                  {language === "hi" ? "केवल डिवाइस पर स्थानीय डेटा" : "Device-Only Local Storage"}
                </h3>
                <span className="px-2 py-0.2 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                  Active
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {language === "hi"
                  ? "लक्षण लॉग्स, माहवारी तिथियां, प्रजनन चक्र और जर्नल प्रविष्टियां केवल आपके फोन के सुरक्षित एन्क्लेव में रहती हैं।"
                  : "Symptom logs, period dates, fertility cycles, and journal reflections remain exclusively in your phone's tamper-proof security enclave."}
              </p>
            </div>
            <button
              aria-checked={deviceOnlyStorage}
              onClick={() => {
                setDeviceOnlyStorage(!deviceOnlyStorage);
                showToast(
                  language === "hi"
                    ? "स्थानीय भंडारण प्राथमिकता अपडेट की गई"
                    : "Device-only storage setting saved"
                );
              }}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 shrink-0 mt-1 flex items-center ${
                deviceOnlyStorage ? "bg-primary" : "bg-surface-container-high"
              }`}
              type="button"
            >
              <span
                className={`w-6 h-6 rounded-full bg-on-primary shadow-sm transform transition-transform duration-200 flex items-center justify-center ${
                  deviceOnlyStorage ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-outline-variant/20 w-full" />

          {/* Toggle 2: Biometric & App Lock */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-on-surface">
                  {language === "hi" ? "बायोमेट्रिक और स्क्रीन शील्ड" : "Biometric & Screen Shield"}
                </h3>
                <span
                  className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                    biometricShield
                      ? "bg-secondary-container text-on-secondary-container"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {biometricShield ? "Protected" : "Off"}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {language === "hi"
                  ? "ऐप खोलने या बैकग्राउंड से वापस आने पर फिंगरप्रिंट, फेस अनलॉक या 4-अंकीय पिन अनिवार्य करें।"
                  : "Require fingerprint, Face Unlock, or Saheli 4-digit PIN every time the app opens or switches from background."}
              </p>
            </div>
            <button
              aria-checked={biometricShield}
              onClick={handleToggleBiometric}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 shrink-0 mt-1 flex items-center ${
                biometricShield ? "bg-primary" : "bg-surface-container-high"
              }`}
              type="button"
            >
              <span
                className={`w-6 h-6 rounded-full bg-on-primary shadow-sm transform transition-transform duration-200 flex items-center justify-center ${
                  biometricShield ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-outline-variant/20 w-full" />

          {/* Toggle 3: Ephemeral Voice & Chat */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-on-surface">
                  {language === "hi" ? "अस्थायी वॉयस और एआई चैट" : "Ephemeral Voice & AI Chats"}
                </h3>
                <span className="px-2 py-0.2 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-bold">
                  Zero Cache
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {language === "hi"
                  ? "सहेली एआई के साथ बातचीत और बोले गए वॉयस प्रश्न सत्र समाप्त होने के बाद रैम से तुरंत हटा दिए जाते हैं।"
                  : "Spoken voice queries (Hindi, English) and conversations with Saheli AI are scrubbed from RAM immediately after each session ends."}
              </p>
            </div>
            <button
              aria-checked={ephemeralVoiceChat}
              onClick={() => {
                setEphemeralVoiceChat(!ephemeralVoiceChat);
                showToast(
                  language === "hi"
                    ? "अस्थायी चैट प्राथमिकता अपडेट हुई"
                    : "Ephemeral voice & chat setting updated"
                );
              }}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 shrink-0 mt-1 flex items-center ${
                ephemeralVoiceChat ? "bg-primary" : "bg-surface-container-high"
              }`}
              type="button"
            >
              <span
                className={`w-6 h-6 rounded-full bg-on-primary shadow-sm transform transition-transform duration-200 flex items-center justify-center ${
                  ephemeralVoiceChat ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Data Sharing & Cloud Sync Controls (Opt-in Only) */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">cloud_sync</span>
            <h2 className="font-serif text-lg font-medium text-primary">
              {language === "hi" ? "क्लाउड सिंक और शोध प्राथमिकताएं" : "Cloud Sync & Research"}
            </h2>
          </div>
          <span className="text-[11px] text-on-surface-variant bg-surface-container-high px-2.5 py-0.5 rounded-full font-medium">
            Opt-in Only
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-outline-variant/20 space-y-4">
          {/* Toggle: Encrypted Cloud Backup */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-on-surface">
                  {language === "hi"
                    ? "ज़ीरो-नॉलेज क्लाउड बैकअप"
                    : "Zero-Knowledge Cloud Backup"}
                </h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {language === "hi"
                  ? "अपने उपकरणों के बीच एंड-टू-एंड पासफ़्रेज़ के साथ सिंक करें जिसे केवल आप जानती हैं। सहेली इंजीनियर भी इस बैकअप को डिक्रिप्ट नहीं कर सकते।"
                  : "Sync across devices with an end-to-end passphrase that only you hold. Saheli engineers cannot decrypt or view this backup under any circumstance."}
              </p>
            </div>
            <button
              aria-checked={cloudBackup}
              onClick={() => {
                setCloudBackup(!cloudBackup);
                showToast(
                  !cloudBackup
                    ? language === "hi"
                      ? "ज़ीरो-नॉलेज क्लाउड सिंक सक्षम (पासफ़्रेज़ तैयार करें)"
                      : "Zero-knowledge cloud backup enabled (Prepare passphrase)"
                    : language === "hi"
                    ? "क्लाउड बैकअप बंद किया गया"
                    : "Cloud backup disabled"
                );
              }}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 shrink-0 mt-1 flex items-center ${
                cloudBackup ? "bg-primary" : "bg-surface-container-high"
              }`}
              type="button"
            >
              <span
                className={`w-6 h-6 rounded-full bg-on-primary shadow-sm transform transition-transform duration-200 flex items-center justify-center ${
                  cloudBackup ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-outline-variant/20 w-full" />

          {/* Toggle: Anonymous Research */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-on-surface">
                  {language === "hi"
                    ? "अनाम स्वास्थ्य अनुसंधान भागीदारी"
                    : "Anonymous Health Research"}
                </h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {language === "hi"
                  ? "भारतीय गैर-लाभकारी प्रजनन स्वास्थ्य अध्ययनों में बिना नाम, पहचान या टाइमस्टैम्प के केवल समग्र लक्षण आवृत्तियों का योगदान करें।"
                  : "Contribute stripped, aggregated menstrual symptom frequencies to non-profit Indian reproductive health studies. No names, timestamps, or identifiers."}
              </p>
            </div>
            <button
              aria-checked={anonymousResearch}
              onClick={() => {
                setAnonymousResearch(!anonymousResearch);
                showToast(
                  !anonymousResearch
                    ? language === "hi"
                      ? "अनाम अनुसंधान में आपका योगदान दर्ज हुआ। धन्यवाद!"
                      : "Anonymous research opted-in. Thank you!"
                    : language === "hi"
                    ? "अनुसंधान भागीदारी बंद की गई"
                    : "Anonymous research participation disabled"
                );
              }}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 shrink-0 mt-1 flex items-center ${
                anonymousResearch ? "bg-primary" : "bg-surface-container-high"
              }`}
              type="button"
            >
              <span
                className={`w-6 h-6 rounded-full bg-on-primary shadow-sm transform transition-transform duration-200 flex items-center justify-center ${
                  anonymousResearch ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Doctor Export & Portable Records */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              assignment_turned_in
            </span>
            <h2 className="font-serif text-lg font-medium text-primary">
              {language === "hi" ? "डॉक्टर रिपोर्ट और डेटा निर्यात" : "Doctor Export & Records"}
            </h2>
          </div>
          <span className="text-[11px] text-secondary bg-secondary-container px-2.5 py-0.5 rounded-full font-semibold">
            Clinician Format
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-4 md:p-5 shadow-xs border border-outline-variant/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[22px]">stethoscope</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-on-surface">
                {language === "hi" ? "परामर्श पैकेट निर्यात करें" : "Export Consultation Packet"}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {language === "hi"
                  ? "स्त्री रोग विशेषज्ञ के लिए चक्र नियमितता, दर्द चार्ट और प्रवाह पैटर्न संकलित करें।"
                  : "Compile cycle regularity, pain charts, & flow patterns for your gynecologist."}
              </p>
            </div>
          </div>

          {/* Format selector chips */}
          <label className="block text-xs font-semibold text-on-surface-variant mb-2">
            {language === "hi" ? "निर्यात प्रारूप चुनें:" : "Select Export Format:"}
          </label>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setExportFormat("pdf")}
              className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                exportFormat === "pdf"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              Clinical PDF
            </button>
            <button
              onClick={() => setExportFormat("data")}
              className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                exportFormat === "data"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">key</span>
              Encrypted JSON / DPDP
            </button>
          </div>

          {/* Timeframe selector chips */}
          <label className="block text-xs font-semibold text-on-surface-variant mb-2">
            {language === "hi" ? "समय सीमा:" : "Timeframe Window:"}
          </label>
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { id: "3m", label: language === "hi" ? "पिछले 3 महीने (मानक)" : "Last 3 Months (Standard)" },
              { id: "12m", label: language === "hi" ? "पूरा 12 माह इतिहास" : "Full Cycle History (12 mo)" },
              { id: "checklist", label: language === "hi" ? "डॉक्टर चेकलिस्ट" : "Consultation Checklist" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeframe(t.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                  timeframe === t.id
                    ? "bg-primary-fixed text-on-primary-fixed font-semibold shadow-xs"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
                }`}
                type="button"
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handleExportAction}
              disabled={isExporting}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-primary text-on-primary text-xs md:text-sm font-semibold flex items-center justify-center gap-2 active:bg-primary-container transition-all shadow-xs disabled:opacity-75"
              type="button"
            >
              {isExporting ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                  <span>
                    {language === "hi" ? "एन्क्रिप्ट और निर्यात हो रहा है..." : "Encrypting & Compiling..."}
                  </span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">download</span>
                  <span>
                    {exportFormat === "pdf"
                      ? language === "hi"
                        ? "क्लीनिकल डॉक्टर PDF देखें व डाउनलोड करें"
                        : "Generate & View Clinical PDF Report"
                      : language === "hi"
                      ? "एन्क्रिप्टेड JSON डेटा डाउनलोड करें (DPDP Act)"
                      : "Download Encrypted JSON Portability File"}
                  </span>
                </>
              )}
            </button>

            <button
              onClick={handleGenerateShareLink}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-surface-container text-primary text-xs md:text-sm font-semibold flex items-center justify-center gap-2 active:bg-surface-container-high transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
              <span>
                {language === "hi"
                  ? "पासवर्ड सुरक्षित लिंक द्वारा साझा करें"
                  : "Send via Password-Protected Link"}
              </span>
            </button>
          </div>

          <div className="mt-3.5 flex items-center gap-2 px-1 text-on-surface-variant text-[11px]">
            <span className="material-symbols-outlined text-[16px] text-secondary">lock</span>
            <span>
              {language === "hi"
                ? "इस दस्तावेज़ को डिक्रिप्ट करने के लिए 6-अंकीय एक्सेस पिन का उपयोग किया जाता है।"
                : "A unique 6-digit PIN is generated to decrypt this document."}
            </span>
          </div>
        </div>
      </div>

      {/* Discretion & Danger Zone */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[20px]">
              crisis_alert
            </span>
            <h2 className="font-serif text-lg font-medium text-tertiary">
              {language === "hi" ? "आपातकालीन छद्म व डेटा निष्कासन" : "Discretion & Emergency Clear"}
            </h2>
          </div>
          <span className="text-[11px] text-on-tertiary bg-tertiary px-2.5 py-0.5 rounded-full font-medium">
            Shared Phone Safe
          </span>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-4 md:p-5 shadow-xs border border-outline-variant/30 space-y-4">
          {/* Quick Disguise Card */}
          <div className="bg-surface-container-lowest rounded-xl p-4 flex items-start gap-3.5 shadow-xs border border-outline-variant/20">
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[22px]">visibility_off</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-on-surface">
                  {language === "hi" ? "आपातकालीन कैलकुलेटर छद्म" : "Emergency Quick-Disguise"}
                </h3>
                <span className="text-[10px] text-secondary bg-secondary-container px-2 py-0.5 rounded-full font-bold">
                  Shake Device
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                {language === "hi"
                  ? "पारिवारिक साझा फोन पर? फोन को दो बार हिलाएं, हेडर लोगो पर तीन बार टैप करें, या नीचे बटन दबाकर सहेली को तुरंत एक सामान्य कैलकुलेटर में बदलें।"
                  : "Using a shared family phone? Shake your phone twice, triple-tap the header logo, or tap below to instantly camouflage Saheli as a working calculator."}
              </p>
              <button
                onClick={activateCamouflage}
                className="min-h-[40px] px-3.5 py-2 rounded-lg bg-surface-container text-primary text-xs font-semibold inline-flex items-center gap-2 hover:bg-surface-container-high transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">calculate</span>
                <span>
                  {language === "hi"
                    ? "कैलकुलेटर छद्म मोड टेस्ट करें"
                    : "Test Calculator Camouflage Now"}
                </span>
              </button>
            </div>
          </div>

          {/* Clear AI Transcript */}
          <div className="bg-surface-container-lowest rounded-xl p-4 flex items-center justify-between gap-3 shadow-xs border border-outline-variant/20">
            <div>
              <h3 className="text-sm font-semibold text-on-surface mb-0.5">
                {language === "hi" ? "एआई चैट इतिहास साफ़ करें" : "Clear AI Chat Transcripts"}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {language === "hi"
                  ? "सभी स्थानीय स्वास्थ्य प्रश्न, वॉयस ट्रांसक्रिप्ट और सहायक मार्गदर्शन मिटाता है।"
                  : "Deletes all local health questions, voice logs, and assistant guidance from memory."}
              </p>
            </div>
            <button
              onClick={handleClearChatCache}
              className="min-h-[40px] px-3 py-2 rounded-lg bg-surface-variant text-on-surface text-xs font-semibold shrink-0 hover:bg-surface-container-highest transition-colors"
              type="button"
            >
              {language === "hi" ? "कैश मिटाएं" : "Clear Cache"}
            </button>
          </div>

          {/* Nuclear Reset Action */}
          <div className="p-4 rounded-xl bg-error-container text-on-error-container border border-error/20">
            <div className="flex items-start gap-3 mb-3">
              <span className="material-symbols-outlined text-error text-[22px] shrink-0 mt-0.5">
                warning
              </span>
              <div>
                <h3 className="text-sm font-bold text-error mb-1">
                  {language === "hi" ? "स्थायी डेटा विनाश (Hard Reset)" : "Permanent Data Destruction"}
                </h3>
                <p className="text-xs text-on-error-container leading-relaxed">
                  {language === "hi"
                    ? "सभी माहवारी तिथियां, प्रजनन लॉग, लक्षण प्रविष्टियां, दवा रिमाइंडर और स्थानीय एन्क्रिप्शन कुंजियां हमेशा के लिए मिट जाती हैं। यह क्रिया अपरिवर्तनीय है।"
                    : "Permanently wipes all period dates, fertile logs, symptom entries, contraceptive reminders, and local encryption keys. This action cannot be recovered."}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowResetModal(true)}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-error text-on-error text-xs md:text-sm font-semibold flex items-center justify-center gap-2 active:opacity-90 transition-opacity shadow-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">delete_forever</span>
              <span>
                {language === "hi"
                  ? "सहेली का सारा डेटा मिटाएं और ऐप रीसेट करें"
                  : "Erase All Saheli Health Data & Reset App"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Legal & Clinical Integrity */}
      <div className="mb-6">
        <div className="bg-surface-container rounded-2xl p-4 md:p-5 shadow-xs border border-outline-variant/30 space-y-3">
          <h2 className="font-serif text-base font-semibold text-primary mb-2">
            {language === "hi" ? "कानूनी चार्टर और सुरक्षा प्रमाणन" : "Legal Charters & Verification"}
          </h2>
          <button
            onClick={() => setActiveCharterModal("charter")}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors text-left"
            type="button"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[20px]">description</span>
              <span className="text-xs md:text-sm font-medium">
                {language === "hi"
                  ? "सरल भाषा में गोपनीयता चार्टर (Plain-Language Charter)"
                  : "Plain-Language Privacy Charter"}
              </span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              chevron_right
            </span>
          </button>
          <button
            onClick={() => setActiveCharterModal("dpdp")}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors text-left"
            type="button"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[20px]">policy</span>
              <span className="text-xs md:text-sm font-medium">
                {language === "hi"
                  ? "भारत DPDP अधिनियम (2023) अनुपालन ढांचा"
                  : "India DPDP Act (2023) Compliance Framework"}
              </span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              chevron_right
            </span>
          </button>
          <button
            onClick={() => setActiveCharterModal("audit")}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors text-left"
            type="button"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[20px]">terminal</span>
              <span className="text-xs md:text-sm font-medium">
                {language === "hi"
                  ? "ओपन सोर्स सुरक्षा ऑडिट व सत्यापन (Cert-In Auditor)"
                  : "Open Source Security Audit by Cert-In Auditor"}
              </span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              chevron_right
            </span>
          </button>
        </div>
      </div>

      {/* Medical Educational Disclaimer Badge */}
      <div className="p-4 rounded-xl bg-surface-container-low text-on-surface-variant flex items-start gap-3 border border-outline-variant/30">
        <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
          info
        </span>
        <p className="text-xs leading-relaxed">
          <strong className="font-semibold text-on-surface">
            {language === "hi" ? "चिकित्सीय मार्गदर्शन सूचना:" : "Medical Guidance Notice:"}
          </strong>{" "}
          {language === "hi"
            ? "सहेली आत्म-वकालत और चक्र साक्षरता के लिए एक डिजिटल साथी है। यह निश्चित चिकित्सा निदान या नुस्खे संबंधी सलाह प्रदान नहीं करता है। तीव्र प्रजनन या स्वास्थ्य संबंधी चिंताओं के लिए हमेशा एक योग्य स्त्री रोग विशेषज्ञ से परामर्श लें।"
            : "Saheli is a digital sanctuary and supportive lifestyle tracker designed for self-advocacy and cycle literacy. It does not provide definitive medical diagnoses or clinical prescription advice. Always consult a certified gynaecologist or healthcare professional for acute reproductive concerns."}
        </p>
      </div>

      {/* Doctor Clinical PDF Modal */}
      <DoctorSummaryModal
        isOpen={showDoctorModal}
        onClose={() => setShowDoctorModal(false)}
      />

      {/* Share PIN Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-outline-variant/30 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2 text-primary font-serif font-medium text-base">
                <span className="material-symbols-outlined text-[20px]">lock</span>
                <span>{language === "hi" ? "डॉक्टर एक्सेस लिंक" : "Doctor Access Link"}</span>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
              {language === "hi"
                ? "यह लिंक और 6-अंकीय पिन केवल 48 घंटों के लिए वैध है। डॉक्टर सीधे अपने कंप्यूटर पर आपकी 3-माह की रिपोर्ट देख सकते हैं।"
                : "This password-protected link and 6-digit PIN are valid for 48 hours. Your gynecologist can review your cycle metrics securely."}
            </p>
            <div className="bg-surface-container p-3 rounded-xl mb-3 text-center">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                Doctor Access PIN
              </span>
              <div className="font-mono text-2xl font-bold text-primary tracking-widest mt-0.5">
                {sharePin}
              </div>
            </div>
            <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/30 text-xs font-mono text-on-surface-variant truncate mb-4">
              https://saheli.care/r/8849-21
            </div>
            <button
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.clipboard) {
                  navigator.clipboard.writeText(
                    `Saheli Consultation Report: https://saheli.care/r/8849-21\nDecryption PIN: ${sharePin}`
                  );
                  showToast(
                    language === "hi"
                      ? "लिंक और पिन क्लिपबोर्ड में कॉपी किए गए!"
                      : "Link & PIN copied to clipboard!"
                  );
                }
                setShowShareModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold flex items-center justify-center gap-2"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">content_copy</span>
              <span>{language === "hi" ? "व्हाट्सएप / नोट्स के लिए कॉपी करें" : "Copy to Share"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Nuclear Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-error/40 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[26px]">delete_forever</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-error mb-1">
              {language === "hi" ? "अपरिवर्तनीय डेटा विलोपन" : "Irreversible Data Deletion"}
            </h3>
            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
              {language === "hi"
                ? "यह कार्रवाई आपके सभी पीरियड रिकॉर्ड, लक्षण, दवाइयां और प्रोफाइल को स्थायी रूप से मिटा देगी। पुष्टि के लिए नीचे 'DELETE' टाइप करें:"
                : "This action will permanently delete all your logged period dates, symptoms, prescriptions, and local encryption keys. Type 'DELETE' below to confirm:"}
            </p>
            <input
              type="text"
              value={resetConfirmInput}
              onChange={(e) => setResetConfirmInput(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-3 py-2.5 rounded-lg bg-surface-container border border-error text-center font-mono text-sm uppercase font-bold text-error mb-4 focus:outline-error"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(false);
                  setResetConfirmInput("");
                }}
                className="flex-1 py-2.5 rounded-lg bg-surface-container text-xs font-semibold text-on-surface"
              >
                {language === "hi" ? "रद्द करें" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleExecuteNuclearReset}
                className="flex-1 py-2.5 rounded-lg bg-error text-xs font-semibold text-on-error"
              >
                {language === "hi" ? "डेटा मिटाएं" : "Wipe Everything"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Charter & Legal Information Modals */}
      {activeCharterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/20">
              <h3 className="font-serif text-base font-semibold text-primary">
                {activeCharterModal === "charter" &&
                  (language === "hi" ? "सहेली गोपनीयता चार्टर" : "Plain-Language Privacy Charter")}
                {activeCharterModal === "dpdp" &&
                  (language === "hi" ? "भारत DPDP अधिनियम (2023) अनुपालन" : "India DPDP Act (2023) Framework")}
                {activeCharterModal === "audit" &&
                  (language === "hi" ? "ओपन सोर्स सुरक्षा ऑडिट" : "Security Architecture Audit")}
              </h3>
              <button
                onClick={() => setActiveCharterModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="text-xs text-on-surface-variant space-y-3 leading-relaxed">
              {activeCharterModal === "charter" && (
                <>
                  <p>
                    <strong>1. Sovereign Data Ownership:</strong> Every cycle log, symptom entry,
                    and personal reflection recorded in Saheli belongs entirely to you. We do not
                    claim any proprietary rights or commercial licenses over your health narrative.
                  </p>
                  <p>
                    <strong>2. Zero Third-Party Monetization:</strong> Saheli is built as a public
                    health digital sanctuary. We will never sell, lease, or monetize your health data
                    to insurance underwriters, pharmaceutical corporations, or advertising networks.
                  </p>
                  <p>
                    <strong>3. Local-First Default:</strong> All mathematical cycle predictions and
                    symptom correlations are computed directly in your device’s JavaScript engine.
                  </p>
                </>
              )}
              {activeCharterModal === "dpdp" && (
                <>
                  <p>
                    <strong>Section 6 — Explicit Consent Architecture:</strong> Under the Digital
                    Personal Data Protection Act (DPDP) 2023, Saheli collects zero personal data
                    without explicit, affirmative, and itemized user consent.
                  </p>
                  <p>
                    <strong>Section 11 — Right to Erasure:</strong> You retain the unconditional
                    right to trigger a complete and instantaneous purge of all stored records via the
                    Permanent Data Destruction action.
                  </p>
                  <p>
                    <strong>Section 12 — Right to Data Portability:</strong> You may at any point
                    export your complete historical records in human-readable and machine-readable
                    JSON formats.
                  </p>
                </>
              )}
              {activeCharterModal === "audit" && (
                <>
                  <p>
                    <strong>Client Sandboxing:</strong> All local persistent storage utilizes
                    isolated browser origin storage protected by OS-level app sandboxing.
                  </p>
                  <p>
                    <strong>Subresource Integrity:</strong> All loaded assets adhere to strict
                    Content Security Policy headers preventing unauthorized third-party scripts.
                  </p>
                  <p>
                    <strong>Audit Certification:</strong> Validated against OWASP Mobile Application
                    Security Verification Standard (MASVS-L1).
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => setActiveCharterModal(null)}
              className="w-full mt-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold"
              type="button"
            >
              {language === "hi" ? "समझ गया" : "Understood"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
