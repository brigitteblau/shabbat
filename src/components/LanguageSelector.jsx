const languageOptions = [
  { label: "Español", value: "es" },
  { label: "English", value: "en" },
  { label: "עברית", value: "he" },
];

export default function LanguageSelector({ selectedLanguage, onSelect }) {
  return (
    <div className="option-group">
      {languageOptions.map((lang) => (
        <button
          key={lang.value}
          onClick={() => onSelect(lang.value)}
          className={`option-button ${selectedLanguage === lang.value ? "active" : ""}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}