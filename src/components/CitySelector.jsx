import { LOCATIONS } from "../pages/api/shabbat";

export default function CitySelector({ selectedCity, onSelect }) {
  return (
    <div className="option-group">
      {LOCATIONS.map((city) => (
        <button
          key={city.value}
          onClick={() => onSelect(city.value)}
          className={`option-button ${selectedCity === city.value ? "active" : ""}`}
        >
          {city.label}
        </button>
      ))}
    </div>
  );
}