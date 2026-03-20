import { useState } from "react";
import "../styles/intro.css";

const CITIES = [
  { label: "Buenos Aires", value: "buenos-aires", lang: "es" },
  { label: "New York",     value: "new-york",     lang: "en" },
  { label: "Jerusalem",    value: "jerusalem",    lang: "he" },
];

export default function IntroSelector() {
  const [selectedCity, setSelectedCity] = useState(null);

  const handleSelect = (city) => setSelectedCity(city);

  const handleEnter = () => {
    if (!selectedCity) return;
    window.location.href = `/shabbat?city=${selectedCity.value}&lang=${selectedCity.lang}`;
  };

  return (
    <main className="intro-page">
      <section className="intro-center">
        <h1 className="intro-title typing">SHABBES</h1>

        <p className="intro-text boom delay-1">Choose your city</p>

        <div className="option-group boom delay-2">
          {CITIES.map((city) => (
            <button
              key={city.value}
              className={`option-button${selectedCity?.value === city.value ? " active" : ""}`}
              onClick={() => handleSelect(city)}
            >
              {city.label}
            </button>
          ))}
        </div>

        {selectedCity && (
          <button className="enter-button boom" onClick={handleEnter}>
            Enter
          </button>
        )}
      </section>
    </main>
  );
}