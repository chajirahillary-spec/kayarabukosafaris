"use client";

import { useState } from "react";
import { destinations } from "@/data/destinations";
import { countyNames } from "@/data/counties";
import type { Destination } from "@/lib/types";
import { X } from "lucide-react";

export default function AdminDestinationsPage() {
  const [items, setItems] = useState<Destination[]>(destinations);
  const [search, setSearch] = useState("");
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);

  const filtered = items.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Destinations Directory
          </p>
          <h1 className="font-display mt-1 text-3xl sm:text-4xl text-green">
            Kenyan Destinations CMS
          </h1>
          <p className="mt-1 text-xs text-charcoal/70">
            Manage National Parks, Reserves, Lakes, Mountains, and Coastal Conservancies across all counties.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 border-y border-charcoal/15 py-3 text-xs">
        <input
          type="search"
          placeholder="Filter destinations by name or region..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 rounded border border-charcoal/25 bg-ivory px-3 text-xs min-w-[260px]"
        />
        <span className="text-charcoal/60 ml-auto">
          {filtered.length} Destinations loaded
        </span>
      </div>

      <div className="border border-charcoal/15 bg-ivory rounded-ka overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-charcoal/15 bg-cream/30 text-charcoal/70 uppercase tracking-wider">
              <th className="py-3 px-4">Destination</th>
              <th>Region</th>
              <th>County / Ecosystem</th>
              <th>Type</th>
              <th>Signature Experience</th>
              <th>Status</th>
              <th className="text-right px-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/10">
            {filtered.map((d) => (
              <tr key={d.slug} className="hover:bg-cream/20">
                <td className="py-3 px-4">
                  <span className="font-semibold text-green block text-sm">{d.name}</span>
                  <span className="text-[11px] text-charcoal/60">/destinations/{d.slug}</span>
                </td>
                <td>{d.region}</td>
                <td>{countyNames(d.countySlugs)}</td>
                <td className="capitalize">{d.type.replace("-", " ")}</td>
                <td className="max-w-xs truncate">{d.signatureExperience}</td>
                <td>
                  <span className="rounded bg-green/10 px-2 py-0.5 text-[10px] uppercase font-semibold text-green">
                    Active
                  </span>
                </td>
                <td className="text-right px-4">
                  <button
                    type="button"
                    onClick={() => setSelectedDest(d)}
                    className="rounded border border-gold px-2.5 py-1 text-green font-semibold hover:bg-cream"
                  >
                    View / Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4">
          <div className="max-w-lg w-full bg-ivory border border-gold/50 p-6 rounded-ka shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto text-xs">
            <div className="flex justify-between items-center border-b border-charcoal/15 pb-3">
              <div>
                <h3 className="font-display text-2xl text-green">{selectedDest.name}</h3>
                <p className="text-charcoal/60">{selectedDest.tagline}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDest(null)}
                className="inline-flex items-center gap-1 text-xs uppercase font-semibold text-charcoal/60 hover:text-charcoal"
              >
                <X className="h-3.5 w-3.5" /> Close
              </button>
            </div>

            <div className="space-y-3">
              <p><strong>Region / Counties:</strong> {countyNames(selectedDest.countySlugs)} ({selectedDest.region})</p>
              <p><strong>Summary:</strong> {selectedDest.summary}</p>
              <p><strong>Best Time to Visit:</strong> {selectedDest.bestTime}</p>
              <p><strong>Getting There:</strong> {selectedDest.gettingThere}</p>
              <p><strong>Wildlife Highlights:</strong> {selectedDest.wildlife.join(", ")}</p>
            </div>

            <div className="pt-3 border-t border-charcoal/15 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDest(null)}
                className="rounded bg-green px-4 py-2 text-ivory font-semibold uppercase"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
