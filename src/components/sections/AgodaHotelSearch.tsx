import React, { useMemo, useState } from "react";
import { Search, MapPin, Calendar, Users, BedDouble } from "lucide-react";

// Agoda Partners affiliate ID (CID). Set VITE_AGODA_CID in .env once approved.
const AGODA_CID = import.meta.env.VITE_AGODA_CID as string | undefined;

const POPULAR_DESTINATIONS = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Singapore",
  "Bangkok",
  "Kuala Lumpur",
  "Kochi",
  "Mumbai",
];

const toISO = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
};

const buildAgodaUrl = (p: {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
}) => {
  const params = new URLSearchParams({
    textToSearch: p.destination,
    checkIn: p.checkIn,
    checkOut: p.checkOut,
    adults: String(p.adults),
    children: String(p.children),
    rooms: String(p.rooms),
    locale: "en-us",
  });
  if (AGODA_CID) params.set("cid", AGODA_CID);
  return `https://www.agoda.com/search?${params.toString()}`;
};

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100";

const AgodaHotelSearch: React.FC = () => {
  const today = useMemo(() => new Date(), []);
  const [destination, setDestination] = useState("Dubai");
  const [checkIn, setCheckIn] = useState(toISO(addDays(today, 7)));
  const [checkOut, setCheckOut] = useState(toISO(addDays(today, 10)));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    const url = buildAgodaUrl({
      destination: destination.trim(),
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
          Find Hotels Worldwide
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Search and book hotels through our partner Agoda. Best available
          prices, free cancellation on many rooms.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="grid gap-4 rounded-2xl bg-white p-5 shadow-lg dark:bg-gray-900 md:grid-cols-6"
      >
        <label className="md:col-span-2">
          <span className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300">
            <MapPin size={14} /> Destination
          </span>
          <input
            list="agoda-destinations"
            className={inputCls}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="City or hotel name"
            required
          />
          <datalist id="agoda-destinations">
            {POPULAR_DESTINATIONS.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </label>

        <label>
          <span className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300">
            <Calendar size={14} /> Check-in
          </span>
          <input
            type="date"
            className={inputCls}
            value={checkIn}
            min={toISO(today)}
            onChange={(e) => {
              setCheckIn(e.target.value);
              if (e.target.value >= checkOut) {
                setCheckOut(toISO(addDays(new Date(e.target.value), 1)));
              }
            }}
            required
          />
        </label>

        <label>
          <span className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300">
            <Calendar size={14} /> Check-out
          </span>
          <input
            type="date"
            className={inputCls}
            value={checkOut}
            min={toISO(addDays(new Date(checkIn), 1))}
            onChange={(e) => setCheckOut(e.target.value)}
            required
          />
        </label>

        <label>
          <span className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300">
            <Users size={14} /> Adults
          </span>
          <input
            type="number"
            min={1}
            max={10}
            className={inputCls}
            value={adults}
            onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>

        <label>
          <span className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300">
            <BedDouble size={14} /> Rooms
          </span>
          <input
            type="number"
            min={1}
            max={5}
            className={inputCls}
            value={rooms}
            onChange={(e) => setRooms(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>

        <div className="md:col-span-6 flex flex-col items-center gap-2 md:flex-row md:justify-between">
          <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            Children
            <input
              type="number"
              min={0}
              max={6}
              className={`${inputCls} w-20`}
              value={children}
              onChange={(e) => setChildren(Math.max(0, Number(e.target.value) || 0))}
            />
          </label>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <Search size={16} /> Search on Agoda
          </button>
        </div>
      </form>

      <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
        You will be redirected to Agoda to complete your booking. We may earn a
        commission at no extra cost to you.
      </p>
    </section>
  );
};

export default AgodaHotelSearch;
