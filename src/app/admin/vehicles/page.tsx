"use client";

import { useState } from "react";

type VehicleStatus = "Available" | "Assigned" | "On Safari" | "Maintenance" | "Unavailable";

interface Vehicle {
  registration: string;
  type: string;
  model: string;
  capacity: number;
  driver: string;
  status: VehicleStatus;
  insuranceExpiry: string;
  inspectionExpiry: string;
  mileage: number;
  serviceNotes: string;
}

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      registration: "KDG 492A",
      type: "Custom Safari 4x4",
      model: "Toyota Land Cruiser HZJ78",
      capacity: 6,
      driver: "Joseph Ole Lenku",
      status: "On Safari",
      insuranceExpiry: "2027-04-15",
      inspectionExpiry: "2027-02-10",
      mileage: 148200,
      serviceNotes: "Fresh brake pads & bush shocks installed Sept 2026",
    },
    {
      registration: "KDA 812B",
      type: "Custom Safari 4x4",
      model: "Toyota Land Cruiser Extended",
      capacity: 8,
      driver: "Simon Kimani",
      status: "Assigned",
      insuranceExpiry: "2027-06-20",
      inspectionExpiry: "2027-05-15",
      mileage: 112450,
      serviceNotes: "Inverter and dual freezer fully tested",
    },
    {
      registration: "KDC 714L",
      type: "Custom Safari 4x4",
      model: "Toyota Land Cruiser Extended",
      capacity: 8,
      driver: "Unassigned",
      status: "Available",
      insuranceExpiry: "2027-08-30",
      inspectionExpiry: "2027-07-01",
      mileage: 94300,
      serviceNotes: "Full synthetic oil change completed",
    },
    {
      registration: "KCT 510M",
      type: "Safari Minivan 4x4",
      model: "Toyota HiAce Pop-Up Roof",
      capacity: 7,
      driver: "David Kaptich",
      status: "Available",
      insuranceExpiry: "2027-03-12",
      inspectionExpiry: "2027-01-20",
      mileage: 165800,
      serviceNotes: "Pop-up roof canopy oiled and checked",
    },
    {
      registration: "KDF 203W",
      type: "Custom Safari 4x4",
      model: "Toyota Land Cruiser HZJ78",
      capacity: 6,
      driver: "Unassigned",
      status: "Maintenance",
      insuranceExpiry: "2027-05-01",
      inspectionExpiry: "2027-03-15",
      mileage: 189100,
      serviceNotes: "Scheduled 190,000 km gearbox service in Nairobi workshop",
    },
  ]);

  const updateStatus = (reg: string, newStatus: VehicleStatus) => {
    setVehicles((prev) =>
      prev.map((v) => (v.registration === reg ? { ...v, status: newStatus } : v))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Fleet Operations
          </p>
          <h1 className="font-display mt-1 text-3xl sm:text-4xl text-green">
            Safari Vehicle Management
          </h1>
          <p className="mt-1 text-xs text-charcoal/70">
            Monitor custom 4x4 Land Cruisers and Safari minivans, status, road safety inspections, and double-booking prevention.
          </p>
        </div>
      </div>

      {/* Roster Table */}
      <div className="border border-charcoal/15 bg-ivory rounded-ka overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-charcoal/15 bg-cream/30 text-charcoal/70 uppercase tracking-wider">
              <th className="py-3 px-4">Registration</th>
              <th>Vehicle Model &amp; Type</th>
              <th>Pax Capacity</th>
              <th>Current Driver</th>
              <th>Status</th>
              <th>Inspection Expiry</th>
              <th>Mileage</th>
              <th>Maintenance Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/10">
            {vehicles.map((v) => (
              <tr key={v.registration} className="hover:bg-cream/20">
                <td className="py-3 px-4 font-semibold text-green text-sm">{v.registration}</td>
                <td>
                  <span className="font-medium block">{v.model}</span>
                  <span className="text-[11px] text-charcoal/60">{v.type}</span>
                </td>
                <td>{v.capacity} Window Seats</td>
                <td>{v.driver}</td>
                <td>
                  <select
                    value={v.status}
                    onChange={(e) => updateStatus(v.registration, e.target.value as VehicleStatus)}
                    className={`rounded border px-2 py-1 text-xs font-semibold ${
                      v.status === "Available"
                        ? "border-green bg-green/10 text-green"
                        : v.status === "On Safari"
                        ? "border-blue-600 bg-blue-50 text-blue-800"
                        : v.status === "Assigned"
                        ? "border-amber-600 bg-amber-50 text-amber-800"
                        : "border-red-600 bg-red-50 text-red-800"
                    }`}
                  >
                    <option value="Available">Available</option>
                    <option value="Assigned">Assigned</option>
                    <option value="On Safari">On Safari</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </td>
                <td>{v.inspectionExpiry}</td>
                <td>{v.mileage.toLocaleString()} km</td>
                <td className="max-w-xs truncate text-[11px] text-charcoal/75">{v.serviceNotes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
