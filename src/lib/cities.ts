export type City = {
  id: "buenos_aires" | "jerusalem" | "new_york";
  label: string;
  countryHint: string;
  latitude: number;
  longitude: number;
  tzid: string;
};

export const CITIES: City[] = [
  {
    id: "buenos_aires",
    label: "Buenos Aires",
    countryHint: "AR",
    latitude: -34.6037,
    longitude: -58.3816,
    tzid: "America/Argentina/Buenos_Aires"
  },
  {
    id: "jerusalem",
    label: "Jerusalem",
    countryHint: "IL",
    latitude: 31.7683,
    longitude: 35.2137,
    tzid: "Asia/Jerusalem"
  },
  {
    id: "new_york",
    label: "New York",
    countryHint: "US",
    latitude: 40.7128,
    longitude: -74.006,
    tzid: "America/New_York"
  }
];

export function getCityById(id: string): City {
  const city = CITIES.find((c) => c.id === id);
  return city ?? CITIES[0]!;
}

