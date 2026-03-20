const HEBCAL_BASE = "https://www.hebcal.com/hebcal";

const LOCATIONS = [
  {
    label: "Buenos Aires",
    value: "buenos-aires",
    geonameid: 3435910,
  },
  {
    label: "Jerusalem",
    value: "jerusalem",
    geonameid: 281184,
  },
  {
    label: "New York",
    value: "new-york",
    geonameid: 5128581,
  },
];

const LANGUAGE_MAP = {
  es: "es",
  en: "s",
  he: "he",
};

function getLocationByValue(value) {
  return LOCATIONS.find((location) => location.value === value) || null;
}

function getLanguageCode(lang) {
  return LANGUAGE_MAP[lang] || "s";
}

function getUpcomingFridays(count = 4) {
  const today = new Date();
  const result = [];

  const current = new Date(today);
  current.setHours(12, 0, 0, 0);

  while (result.length < count) {
    if (current.getDay() === 5) {
      result.push(current.toISOString().slice(0, 10));
    }
    current.setDate(current.getDate() + 1);
  }

  return result;
}

async function fetchHebcalRange({ geonameid, lang = "s", start, end }) {
  const params = new URLSearchParams({
    cfg: "json",
    geonameid: String(geonameid),
    start,
    end,
    v: "1",
    c: "on",
    M: "on",
    maj: "on",
    lg: lang,
  });

  const response = await fetch(`${HEBCAL_BASE}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Hebcal request failed: ${response.status}`);
  }

  return response.json();
}

function groupShabbatItemsByDate(items = []) {
  const grouped = {};

  for (const item of items) {
    const dateKey = item.date?.slice(0, 10);
    if (!dateKey) continue;

    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        date: dateKey,
        candles: null,
        havdalah: null,
        parashat: null,
      };
    }

    if (item.category === "candles") {
      grouped[dateKey].candles = item;
    }

    if (item.category === "havdalah") {
      grouped[dateKey].havdalah = item;
    }

    if (item.category === "parashat") {
      grouped[dateKey].parashat = item;
    }
  }

  return grouped;
}

function buildShabbatTableRows(items = []) {
  const grouped = groupShabbatItemsByDate(items);

  return Object.values(grouped)
    .filter((entry) => entry.candles || entry.havdalah || entry.parashat)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((entry) => ({
      id: entry.date,
      date: entry.date,
      parashat: entry.parashat?.title || "—",
      candleLightingText: entry.candles?.title || "—",
      havdalahText: entry.havdalah?.title || "—",
      candleLightingTime: entry.candles?.date || null,
      havdalahTime: entry.havdalah?.date || null,
    }));
}

async function fetchUpcomingShabbatTable({
  city,
  lang = "en",
  count = 4,
}) {
  const location = getLocationByValue(city);

  if (!location) {
    throw new Error("Invalid city");
  }

  const hebcalLang = getLanguageCode(lang);
  const fridays = getUpcomingFridays(count);

  if (!fridays.length) {
    return [];
  }

  const start = fridays[0];
  const lastFriday = fridays[fridays.length - 1];

  const endDate = new Date(lastFriday);
  endDate.setDate(endDate.getDate() + 2);
  const end = endDate.toISOString().slice(0, 10);

  const data = await fetchHebcalRange({
    geonameid: location.geonameid,
    lang: hebcalLang,
    start,
    end,
  });

  const rows = buildShabbatTableRows(data.items || []);
  return rows.slice(0, count);
}

export async function GET({ url }) {
  try {
    const city = url.searchParams.get("city");
    const lang = url.searchParams.get("lang") || "en";
    const count = Number(url.searchParams.get("count") || "4");

    const rows = await fetchUpcomingShabbatTable({
      city,
      lang,
      count,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        city,
        lang,
        rows,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        message: error.message || "Could not load Shabbat times.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}