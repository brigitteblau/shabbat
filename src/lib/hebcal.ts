import type { City } from "./cities";

type HebcalItem = {
  title?: string;
  category?: string;
  date?: string;
};

type HebcalResponse = {
  title?: string;
  date?: string;
  location?: { title?: string; tzid?: string };
  items?: HebcalItem[];
};

export type ShabbatTimes = {
  locationLabel: string;
  isoDate: string;
  parashaTitle?: string;
  startsAtISO: string;
  endsAtISO: string;
  startsAtLabel: string;
  endsAtLabel: string;
};

function formatTime(iso: string, timeZone: string, locale: string) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone
  }).format(date);
}

function formatDate(iso: string, timeZone: string, locale: string) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone
  }).format(date);
}

export function hebcalUrlForCity(city: City) {
  const url = new URL("https://www.hebcal.com/shabbat");
  url.searchParams.set("cfg", "json");
  url.searchParams.set("geo", "pos");
  url.searchParams.set("latitude", String(city.latitude));
  url.searchParams.set("longitude", String(city.longitude));
  url.searchParams.set("tzid", city.tzid);
  url.searchParams.set("b", "18");
  url.searchParams.set("m", "50");
  return url.toString();
}

export async function fetchShabbatTimes(city: City): Promise<ShabbatTimes> {
  const res = await fetch(hebcalUrlForCity(city), {
    headers: { accept: "application/json" }
  });

  if (!res.ok) {
    throw new Error(`Hebcal error: ${res.status}`);
  }

  const data = (await res.json()) as HebcalResponse;
  const items = data.items ?? [];

  const candles = items.find((i) => i.category === "candles" && i.date);
  const havdalah = items.find((i) => i.category === "havdalah" && i.date);
  const parashaItem = items.find(
    (i) =>
      (i.category === "parashat" ||
        i.category === "parashah" ||
        i.category === "parsha") &&
      i.title
  );

  if (!candles?.date || !havdalah?.date) {
    throw new Error("Hebcal response missing candles/havdalah times");
  }

  const timeZone = city.tzid;
  const locale = city.id === "buenos_aires" ? "es-AR" : "en-US";
  const isoDate = formatDate(candles.date, timeZone, locale);

  const locationLabel =
    data.location?.title?.trim() ||
    `${city.label}${city.countryHint ? `, ${city.countryHint}` : ""}`;

  return {
    locationLabel,
    isoDate,
    parashaTitle: parashaItem?.title?.trim() || undefined,
    startsAtISO: candles.date,
    endsAtISO: havdalah.date,
    startsAtLabel: formatTime(candles.date, timeZone, locale),
    endsAtLabel: formatTime(havdalah.date, timeZone, locale)
  };
}
