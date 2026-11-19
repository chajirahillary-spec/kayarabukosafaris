"use client";

import { useState } from "react";
import { formatUsd } from "@/components/ui/commerce";

export default function AdminReportsPage() {
  const [period, setPeriod] = useState<"30d" | "90d" | "1y">("90d");

  // Performance numbers
  const metrics = {
    grossBookingUsd: 148900,
    totalGuests: 84,
    avgSafarisLengthDays: 6.2,
    fleetUtilizationPct: 82.5,
    leadConversionPct: 34.8,
    guideDaysInField: 312,
  };

  const monthlyRevenue = [
    { month: "May 2026", amount: 18200, bookings: 6, height: "35%" },
    { month: "Jun 2026", amount: 24500, bookings: 8, height: "48%" },
    { month: "Jul 2026", amount: 48900, bookings: 16, height: "95%" },
    { month: "Aug 2026", amount: 51200, bookings: 18, height: "100%" },
    { month: "Sep 2026", amount: 39400, bookings: 14, height: "76%" },
    { month: "Oct 2026", amount: 28600, bookings: 10, height: "55%" },
  ];

  const destinationDistribution = [
    { circuit: "Maasai Mara National Reserve", percentage: 44, valueUsd: 65500, color: "bg-forest" },
    { circuit: "Amboseli & Kilimanjaro Ecosystem", percentage: 22, valueUsd: 32750, color: "bg-gold" },
    { circuit: "Tsavo East & West / Chyulu", percentage: 14, valueUsd: 20800, color: "bg-green" },
    { circuit: "Swahili Coast (Diani & Watamu)", percentage: 12, valueUsd: 17800, color: "bg-amber-600" },
    { circuit: "Samburu & Northern Rangelands", percentage: 8, valueUsd: 11920, color: "bg-charcoal" },
  ];

  const originMarkets = [
    { country: "United States", share: 38, pax: 32 },
    { country: "United Kingdom", share: 24, pax: 20 },
    { country: "Germany & DACH", share: 15, pax: 13 },
    { country: "France & Benelux", share: 9, pax: 8 },
    { country: "Domestic (Kenya / East Africa)", share: 8, pax: 7 },
    { country: "UAE & Middle East", share: 6, pax: 4 },
  ];

  const exportFinancialReport = () => {
    const headers = ["Circuit / Ecosystem", "Percentage Share", "Revenue USD"];
    const rows = destinationDistribution.map((d) => [
      `"${d.circuit}"`,
      `${d.percentage}%`,
      d.valueUsd,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encoded = encodeURI(csvContent);
    const a = document.createElement("a");
    a.href = encoded;
    a.download = `kayarabuko_operations_report_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-forest">Operations & Revenue Analytics</h1>
          <p className="text-xs text-charcoal/70">
            Real-time financial performance, circuit demand distribution, fleet efficiency, and guest origins.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-ka border border-charcoal/20 bg-ivory p-0.5 text-xs">
            {(["30d", "90d", "1y"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded px-3 py-1 font-semibold transition-colors ${
                  period === p ? "bg-forest text-ivory" : "text-charcoal hover:bg-cream/40"
                }`}
              >
                {p === "30d" ? "Past 30 Days" : p === "90d" ? "Past 90 Days" : "Year to Date"}
              </button>
            ))}
          </div>
          <button
            onClick={exportFinancialReport}
            className="rounded-ka bg-forest px-4 py-2 text-xs font-semibold text-ivory hover:bg-green transition-colors"
          >
            Export Full Financial CSV
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/60">Gross Bookings</p>
          <p className="mt-1 font-serif text-xl font-bold text-forest">{formatUsd(metrics.grossBookingUsd)}</p>
          <p className="mt-0.5 text-[10px] text-green font-medium">+18.4% vs last period</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/60">Total Guests Hosted</p>
          <p className="mt-1 font-serif text-xl font-bold text-charcoal">{metrics.totalGuests} Travellers</p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">42 Custom parties</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/60">Average Duration</p>
          <p className="mt-1 font-serif text-xl font-bold text-charcoal">{metrics.avgSafarisLengthDays} Days</p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">Rift + Coast combo</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/60">Fleet Utilization</p>
          <p className="mt-1 font-serif text-xl font-bold text-gold">{metrics.fleetUtilizationPct}%</p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">Land Cruisers active</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/60">Lead Conversion</p>
          <p className="mt-1 font-serif text-xl font-bold text-forest">{metrics.leadConversionPct}%</p>
          <p className="mt-0.5 text-[10px] text-green font-medium">Inquiry to booked</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/60">Guide Field Days</p>
          <p className="mt-1 font-serif text-xl font-bold text-charcoal">{metrics.guideDaysInField} Days</p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">Zero safety incidents</p>
        </div>
      </div>

      {/* Revenue Chart Section */}
      <div className="rounded-ka border border-charcoal/10 bg-ivory p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
          <div>
            <h2 className="font-serif text-base font-bold text-forest">Monthly Revenue & Volume Trend</h2>
            <p className="text-xs text-charcoal/70">
              Peak migration spikes in July & August followed by solid autumn private departures.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-forest">Currency: USD ($)</span>
        </div>

        {/* Visual Bar Graph */}
        <div className="mt-6 flex h-48 items-end justify-between gap-2 border-b border-charcoal/20 pb-2 sm:gap-6">
          {monthlyRevenue.map((item) => (
            <div key={item.month} className="group relative flex flex-1 flex-col items-center">
              {/* Tooltip */}
              <div className="absolute -top-10 hidden rounded bg-charcoal px-2 py-1 text-[10px] text-ivory group-hover:block whitespace-nowrap z-10">
                {formatUsd(item.amount)} ({item.bookings} safaris)
              </div>
              <div
                style={{ height: item.height }}
                className="w-full max-w-[50px] rounded-t-sm bg-forest transition-all group-hover:bg-gold"
              />
              <span className="mt-2 text-[10px] text-charcoal/70">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Circuit Demand Distribution */}
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-serif text-base font-bold text-forest">Revenue by Circuit & Destination</h3>
            <p className="text-xs text-charcoal/70">Share of booking value per ecological corridor.</p>
          </div>

          <div className="space-y-3">
            {destinationDistribution.map((d) => (
              <div key={d.circuit} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-charcoal">{d.circuit}</span>
                  <span className="font-mono font-semibold text-forest">
                    {formatUsd(d.valueUsd)} ({d.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-cream">
                  <div style={{ width: `${d.percentage}%` }} className={`h-full ${d.color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guest Origin Demographics */}
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-serif text-base font-bold text-forest">Guest Demographics by Source Market</h3>
            <p className="text-xs text-charcoal/70">International and regional traveler breakdown.</p>
          </div>

          <div className="space-y-3">
            {originMarkets.map((m) => (
              <div key={m.country} className="flex items-center justify-between border-b border-charcoal/10 pb-2 text-xs">
                <div>
                  <p className="font-semibold text-charcoal">{m.country}</p>
                  <p className="text-[10px] text-charcoal/60">{m.pax} Guests in Period</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-forest">{m.share}%</span>
                  <p className="text-[10px] text-charcoal/60">Market share</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
