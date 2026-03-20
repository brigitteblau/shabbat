import { useEffect, useState } from "react";

export default function ShabbatView({ city, language }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!city || !language) return;

    const loadShabbat = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/shabbat?city=${city}&lang=${language}&count=4`
        );

        const result = await response.json();

        if (!response.ok || !result.ok) {
          throw new Error(result.message || "Could not load Shabbat times.");
        }

        setRows(result.rows || []);
      } catch (err) {
        console.error(err);
        setError("Could not load Shabbat times.");
      } finally {
        setLoading(false);
      }
    };

    loadShabbat();
  }, [city, language]);

  if (loading) {
    return <p>Loading Shabbat times...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      {rows.map((row) => (
        <div key={row.id}>
          <h3>{row.date}</h3>
          <p>{row.parashat}</p>
          <p>{row.candleLightingText}</p>
          <p>{row.havdalahText}</p>
        </div>
      ))}
    </div>
  );
}