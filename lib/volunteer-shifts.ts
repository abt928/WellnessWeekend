export interface Shift {
  shift_id: string;
  phase: "setup" | "during" | "sunday_evening";
  role: string;
  day: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  hours: number;
  capacity: number;
  notes: string | null;
}

export const SHIFTS: Shift[] = [
  // ── Setup · Thursday Aug 6 — all 4-hour shifts ──
  { shift_id: "SU-01", phase: "setup", role: "Pavilion setup",                   day: "Thursday", date: "2026-08-06", start_time: null, end_time: null, hours: 4, capacity: 2, notes: null },
  { shift_id: "SU-02", phase: "setup", role: "Lodge staging",                    day: "Thursday", date: "2026-08-06", start_time: null, end_time: null, hours: 4, capacity: 2, notes: null },
  { shift_id: "SU-03", phase: "setup", role: "Labyrinth garden",                 day: "Thursday", date: "2026-08-06", start_time: null, end_time: null, hours: 4, capacity: 2, notes: null },
  { shift_id: "SU-04", phase: "setup", role: "Kitchen / grills",                 day: "Thursday", date: "2026-08-06", start_time: null, end_time: null, hours: 4, capacity: 2, notes: null },
  { shift_id: "SU-05", phase: "setup", role: "Silks, paddleboards & docks",      day: "Thursday", date: "2026-08-06", start_time: null, end_time: null, hours: 4, capacity: 2, notes: null },
  { shift_id: "SU-06", phase: "setup", role: "Tents – tea lounge & guest svc",  day: "Thursday", date: "2026-08-06", start_time: null, end_time: null, hours: 4, capacity: 2, notes: null },
  { shift_id: "SU-07", phase: "setup", role: "Lighting",                         day: "Thursday", date: "2026-08-06", start_time: null, end_time: null, hours: 4, capacity: 2, notes: null },
  { shift_id: "SU-08", phase: "setup", role: "Stage",                            day: "Thursday", date: "2026-08-06", start_time: null, end_time: null, hours: 4, capacity: 2, notes: null },
  { shift_id: "SU-09", phase: "setup", role: "Decor",                            day: "Thursday", date: "2026-08-06", start_time: null, end_time: null, hours: 4, capacity: 2, notes: null },
  { shift_id: "SU-10", phase: "setup", role: "Supplies",                         day: "Thursday", date: "2026-08-06", start_time: null, end_time: null, hours: 4, capacity: 2, notes: null },
  { shift_id: "SU-11", phase: "setup", role: "Green room",                       day: "Thursday", date: "2026-08-06", start_time: null, end_time: null, hours: 4, capacity: 2, notes: null },

  // ── During · Friday Aug 7 ──
  { shift_id: "DU-01", phase: "during", role: "Marketing / Press",               day: "Friday",   date: "2026-08-07", start_time: null, end_time: null, hours: 4, capacity: 3, notes: null },
  { shift_id: "DU-04", phase: "during", role: "Check-In / Gate Security",        day: "Friday",   date: "2026-08-07", start_time: null, end_time: null, hours: 4, capacity: 3, notes: null },
  { shift_id: "DU-07", phase: "during", role: "Parking",                         day: "Friday",   date: "2026-08-07", start_time: null, end_time: null, hours: 2, capacity: 2, notes: null },
  { shift_id: "DU-10", phase: "during", role: "Mobile transport",                day: "Friday",   date: "2026-08-07", start_time: null, end_time: null, hours: 2, capacity: 2, notes: null },
  { shift_id: "DU-13", phase: "during", role: "Guest services",                  day: "Friday",   date: "2026-08-07", start_time: null, end_time: null, hours: 4, capacity: 2, notes: null },
  { shift_id: "DU-16", phase: "during", role: "Cacao bar",                       day: "Friday",   date: "2026-08-07", start_time: null, end_time: null, hours: 4, capacity: 2, notes: null },
  { shift_id: "DU-19", phase: "during", role: "Tea lounge",                      day: "Friday",   date: "2026-08-07", start_time: null, end_time: null, hours: 4, capacity: 2, notes: null },

  // ── During · Saturday Aug 8 ──
  { shift_id: "DU-02", phase: "during", role: "Marketing / Press",               day: "Saturday", date: "2026-08-08", start_time: null, end_time: null, hours: 4, capacity: 3, notes: null },
  { shift_id: "DU-05", phase: "during", role: "Check-In / Gate Security",        day: "Saturday", date: "2026-08-08", start_time: null, end_time: null, hours: 4, capacity: 3, notes: null },
  { shift_id: "DU-08", phase: "during", role: "Parking",                         day: "Saturday", date: "2026-08-08", start_time: null, end_time: null, hours: 2, capacity: 2, notes: null },
  { shift_id: "DU-11", phase: "during", role: "Mobile transport",                day: "Saturday", date: "2026-08-08", start_time: null, end_time: null, hours: 2, capacity: 2, notes: null },
  { shift_id: "DU-14", phase: "during", role: "Guest services",                  day: "Saturday", date: "2026-08-08", start_time: null, end_time: null, hours: 4, capacity: 2, notes: null },
  { shift_id: "DU-17", phase: "during", role: "Cacao bar",                       day: "Saturday", date: "2026-08-08", start_time: null, end_time: null, hours: 4, capacity: 2, notes: null },
  { shift_id: "DU-20", phase: "during", role: "Tea lounge",                      day: "Saturday", date: "2026-08-08", start_time: null, end_time: null, hours: 4, capacity: 2, notes: null },

  // ── During · Sunday Aug 9 ──
  { shift_id: "DU-03", phase: "during", role: "Marketing / Press",               day: "Sunday",   date: "2026-08-09", start_time: null, end_time: null, hours: 4, capacity: 3, notes: null },
  { shift_id: "DU-06", phase: "during", role: "Check-In / Gate Security",        day: "Sunday",   date: "2026-08-09", start_time: null, end_time: null, hours: 4, capacity: 3, notes: null },
  { shift_id: "DU-09", phase: "during", role: "Parking",                         day: "Sunday",   date: "2026-08-09", start_time: null, end_time: null, hours: 2, capacity: 2, notes: null },
  { shift_id: "DU-12", phase: "during", role: "Mobile transport",                day: "Sunday",   date: "2026-08-09", start_time: null, end_time: null, hours: 2, capacity: 2, notes: null },
  { shift_id: "DU-15", phase: "during", role: "Guest services",                  day: "Sunday",   date: "2026-08-09", start_time: null, end_time: null, hours: 4, capacity: 2, notes: null },
  { shift_id: "DU-18", phase: "during", role: "Cacao bar",                       day: "Sunday",   date: "2026-08-09", start_time: null, end_time: null, hours: 4, capacity: 2, notes: null },
  { shift_id: "DU-21", phase: "during", role: "Tea lounge",                      day: "Sunday",   date: "2026-08-09", start_time: null, end_time: null, hours: 4, capacity: 2, notes: null },

  // ── Sunday Evening Teardown ──
  { shift_id: "SE-01", phase: "sunday_evening", role: "Take down",                  day: "Sunday", date: "2026-08-09", start_time: null, end_time: null, hours: 4, capacity: 4, notes: null },
  { shift_id: "SE-02", phase: "sunday_evening", role: "Check-out table",            day: "Sunday", date: "2026-08-09", start_time: null, end_time: null, hours: 2, capacity: 2, notes: null },
  { shift_id: "SE-03", phase: "sunday_evening", role: "Housekeeping",               day: "Sunday", date: "2026-08-09", start_time: null, end_time: null, hours: 4, capacity: 3, notes: null },
  { shift_id: "SE-04", phase: "sunday_evening", role: "Garbage / cleanup",          day: "Sunday", date: "2026-08-09", start_time: null, end_time: null, hours: 2, capacity: 3, notes: null },
  { shift_id: "SE-05", phase: "sunday_evening", role: "Lodge / pavilion breakdown", day: "Sunday", date: "2026-08-09", start_time: null, end_time: null, hours: 4, capacity: 3, notes: null },
];

export const SHIFT_MAP: Record<string, Shift> = Object.fromEntries(
  SHIFTS.map((s) => [s.shift_id, s])
);

export type RewardKey = "lodging" | "weekend_pass" | "day_pass" | "lodging_discount" | "none";

export interface RewardResult {
  key: RewardKey;
  label: string;
  desc: string;
  totalHours: number;
}

export function calcReward(selectedShifts: Shift[]): RewardResult {
  if (selectedShifts.length === 0) {
    return { key: "none", label: "No reward yet", desc: "Select shifts to see your reward.", totalHours: 0 };
  }

  const totalHours = selectedShifts.reduce((sum, s) => sum + s.hours, 0);

  // Hours per day — Thursday now counts toward comped lodging
  const thuHours = selectedShifts.filter((s) => s.day === "Thursday").reduce((sum, s) => sum + s.hours, 0);
  const friHours = selectedShifts.filter((s) => s.day === "Friday").reduce((sum, s) => sum + s.hours, 0);
  const satHours = selectedShifts.filter((s) => s.day === "Saturday").reduce((sum, s) => sum + s.hours, 0);
  const sunHours = selectedShifts.filter((s) => s.day === "Sunday").reduce((sum, s) => sum + s.hours, 0);

  // Comped lodging: 12+ total hours, with 4+ on at least 3 of the 4 days (Thu counts)
  const daysWithFourPlus = [thuHours, friHours, satHours, sunHours].filter((h) => h >= 4).length;

  if (totalHours >= 12 && daysWithFourPlus >= 3) {
    return {
      key: "lodging",
      label: "Comped Lodging",
      desc: `${totalHours} hrs across ${daysWithFourPlus} days — cabin lodging comped for the weekend.`,
      totalHours,
    };
  }
  if (totalHours >= 8) {
    return {
      key: "weekend_pass",
      label: "Weekend Pass",
      desc: `${totalHours} hrs total — full 3-day weekend pass.`,
      totalHours,
    };
  }
  if (totalHours >= 3) {
    return {
      key: "day_pass",
      label: "Day Pass",
      desc: `${totalHours} hrs total — single-day pass for the day you volunteer.`,
      totalHours,
    };
  }

  return {
    key: "lodging_discount",
    label: "Lodging Discount",
    desc: `${totalHours} hrs — you qualify for a discounted lodging rate as a volunteer.`,
    totalHours,
  };
}
