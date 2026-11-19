"use client";

import { useState } from "react";
import { formatUsd } from "@/components/ui/commerce";
import type { BookingStatus } from "@/lib/bookings/types";
import { X } from "lucide-react";

interface AdminBooking {
  id: string;
  ref: string;
  customerName: string;
  safariTitle: string;
  departureDate: string;
  days: number;
  adults: number;
  totalUsd: number;
  paidUsd: number;
  guide: string;
  vehicle: string;
  status: BookingStatus;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([
    {
      id: "b1",
      ref: "KA-2026-0814",
      customerName: "Eleanor & Marcus Vance",
      safariTitle: "5-Day Maasai Mara & Lake Nakuru Safari",
      departureDate: "2026-11-15",
      days: 5,
      adults: 2,
      totalUsd: 1780,
      paidUsd: 534,
      guide: "Joseph Ole Lenku",
      vehicle: "KDG 492A (Cruiser)",
      status: "confirmed",
    },
    {
      id: "b2",
      ref: "KA-2026-0815",
      customerName: "Dr. Andrew Peterson",
      safariTitle: "4-Day Amboseli & Tsavo Safari",
      departureDate: "2026-11-18",
      days: 4,
      adults: 4,
      totalUsd: 3120,
      paidUsd: 3120,
      guide: "Simon Kimani",
      vehicle: "KDA 812B (Cruiser)",
      status: "preparing",
    },
    {
      id: "b3",
      ref: "KA-2026-0816",
      customerName: "Claire Moreau",
      safariTitle: "7-Day Kenya Safari & Diani Beach",
      departureDate: "2026-11-20",
      days: 7,
      adults: 2,
      totalUsd: 3900,
      paidUsd: 0,
      guide: "Unassigned",
      vehicle: "Unassigned",
      status: "pending",
    },
  ]);

  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [guideInput, setGuideInput] = useState("");
  const [vehicleInput, setVehicleInput] = useState("");
  const [paymentAddAmount, setPaymentAddAmount] = useState(0);

  const availableGuides = [
    "Joseph Ole Lenku (Gold Badge)",
    "Simon Kimani (Silver Badge)",
    "David Kaptich (Silver Badge)",
    "Francis Kiprop (Birding Specialist)",
    "Alice Nduta (Cultural Guide)",
  ];

  const availableVehicles = [
    "KDG 492A (Toyota Land Cruiser 4x4)",
    "KDA 812B (Toyota Land Cruiser 4x4)",
    "KDC 714L (Toyota Land Cruiser 4x4 Extended)",
    "KCT 510M (Toyota Safari Minivan 4x4)",
  ];

  const saveAssignments = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id
          ? {
              ...b,
              guide: guideInput || b.guide,
              vehicle: vehicleInput || b.vehicle,
              paidUsd: b.paidUsd + paymentAddAmount,
              status:
                b.paidUsd + paymentAddAmount >= b.totalUsd
                  ? "confirmed"
                  : b.status,
            }
          : b
      )
    );
    setSelectedBooking(null);
    setPaymentAddAmount(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Operations
          </p>
          <h1 className="font-display mt-1 text-3xl sm:text-4xl text-green">
            Booking &amp; Fleet Operations
          </h1>
          <p className="mt-1 text-xs text-charcoal/70">
            Allocate professional guides, fleet vehicles, record payments, and manage trip preparation.
          </p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="border border-charcoal/15 bg-ivory rounded-ka overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-charcoal/15 bg-cream/30 text-charcoal/70 uppercase tracking-wider">
              <th className="py-3 px-4">Ref</th>
              <th>Customer</th>
              <th>Safari</th>
              <th>Departure</th>
              <th>Pax</th>
              <th>Guide</th>
              <th>Vehicle</th>
              <th>Financials</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/10">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-cream/20">
                <td className="py-3 px-4 font-semibold text-green">{b.ref}</td>
                <td className="font-medium text-sm">{b.customerName}</td>
                <td className="text-charcoal/80">{b.safariTitle}</td>
                <td>{b.departureDate} ({b.days}d)</td>
                <td>{b.adults} Pax</td>
                <td>
                  {b.guide === "Unassigned" ? (
                    <span className="text-red-700 font-semibold">Unassigned</span>
                  ) : (
                    b.guide
                  )}
                </td>
                <td>
                  {b.vehicle === "Unassigned" ? (
                    <span className="text-red-700 font-semibold">Unassigned</span>
                  ) : (
                    b.vehicle
                  )}
                </td>
                <td>
                  <span className="font-semibold block">{formatUsd(b.totalUsd)}</span>
                  <span className="text-[11px] text-charcoal/60">
                    Paid: {formatUsd(b.paidUsd)}
                  </span>
                </td>
                <td>
                  <span className="rounded bg-green/10 px-2 py-0.5 text-green font-semibold capitalize">
                    {b.status}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBooking(b);
                      setGuideInput(b.guide);
                      setVehicleInput(b.vehicle);
                    }}
                    className="rounded border border-gold px-2.5 py-1 text-green font-semibold hover:bg-cream"
                  >
                    Edit / Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assignment Modal / Drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4">
          <div className="max-w-lg w-full bg-ivory border border-gold/50 p-6 rounded-ka shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-charcoal/15 pb-3">
              <div>
                <h3 className="font-display text-2xl text-green">
                  Manage Booking: {selectedBooking.ref}
                </h3>
                <p className="text-xs text-charcoal/70">
                  Guest: {selectedBooking.customerName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="inline-flex items-center gap-1 text-xs uppercase font-semibold text-charcoal/60 hover:text-charcoal"
              >
                <X className="h-3.5 w-3.5" /> Close
              </button>
            </div>

            <form onSubmit={saveAssignments} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-green mb-1">
                  Assign Lead Guide:
                </label>
                <select
                  value={guideInput}
                  onChange={(e) => setGuideInput(e.target.value)}
                  className="h-10 w-full rounded border border-charcoal/30 bg-ivory px-3 text-xs"
                >
                  <option value="Unassigned">-- Select Available Guide --</option>
                  {availableGuides.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-green mb-1">
                  Assign Fleet Vehicle:
                </label>
                <select
                  value={vehicleInput}
                  onChange={(e) => setVehicleInput(e.target.value)}
                  className="h-10 w-full rounded border border-charcoal/30 bg-ivory px-3 text-xs"
                >
                  <option value="Unassigned">-- Select Available Vehicle --</option>
                  {availableVehicles.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-green mb-1">
                  Record Additional Payment ($ USD):
                </label>
                <input
                  type="number"
                  min={0}
                  max={selectedBooking.totalUsd - selectedBooking.paidUsd}
                  value={paymentAddAmount}
                  onChange={(e) => setPaymentAddAmount(Number(e.target.value))}
                  className="h-10 w-full rounded border border-charcoal/30 bg-ivory px-3 text-xs"
                />
                <p className="mt-1 text-[11px] text-charcoal/60">
                  Current Balance Remaining:{" "}
                  {formatUsd(selectedBooking.totalUsd - selectedBooking.paidUsd)}
                </p>
              </div>

              <div className="flex gap-3 pt-3 border-t border-charcoal/15">
                <button
                  type="submit"
                  className="rounded bg-green px-4 py-2 font-semibold text-ivory uppercase tracking-wider"
                >
                  Save Operations Update
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="rounded border border-charcoal/30 px-4 py-2 uppercase tracking-wider text-charcoal"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
