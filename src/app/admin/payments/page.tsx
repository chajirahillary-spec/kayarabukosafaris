"use client";

import { useState } from "react";
import { formatUsd } from "@/components/ui/commerce";
import { X } from "lucide-react";

export type PaymentMethod = "M-Pesa Express" | "Stripe (Card)" | "Bank Wire / RTGS" | "Office Cash";
export type PaymentStatus = "Settled" | "Pending" | "Failed" | "Refunded";
export type PaymentType = "30% Deposit" | "Balance 70%" | "Full Payment" | "Safari Add-On";

export interface Transaction {
  id: string;
  ref: string;
  bookingRef: string;
  customerName: string;
  method: PaymentMethod;
  amountUsd: number;
  amountKes: number;
  type: PaymentType;
  gatewayCode: string;
  status: PaymentStatus;
  timestamp: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-101",
    ref: "PAY-2026-9041",
    bookingRef: "KA-2026-0814",
    customerName: "Eleanor & Marcus Vance",
    method: "Stripe (Card)",
    amountUsd: 534,
    amountKes: 69420,
    type: "30% Deposit",
    gatewayCode: "ch_3Nwf1K2eZvKYlo2C19xaP",
    status: "Settled",
    timestamp: "2026-10-04 14:22:10",
  },
  {
    id: "tx-102",
    ref: "PAY-2026-9042",
    bookingRef: "KA-2026-0815",
    customerName: "Dr. Andrew Peterson",
    method: "Bank Wire / RTGS",
    amountUsd: 3120,
    amountKes: 405600,
    type: "Full Payment",
    gatewayCode: "NCBA-FT-9912048",
    status: "Settled",
    timestamp: "2026-10-04 11:05:44",
  },
  {
    id: "tx-103",
    ref: "PAY-2026-9043",
    bookingRef: "KA-2026-0816",
    customerName: "Claire Moreau",
    method: "Stripe (Card)",
    amountUsd: 1170,
    amountKes: 152100,
    type: "30% Deposit",
    gatewayCode: "ch_3Nwh7P2eZvKYlo2C08uqA",
    status: "Settled",
    timestamp: "2026-10-03 16:40:19",
  },
  {
    id: "tx-104",
    ref: "PAY-2026-9044",
    bookingRef: "KA-2026-0817",
    customerName: "Kariuki & Wanjiru Mwangi",
    method: "M-Pesa Express",
    amountUsd: 330,
    amountKes: 42900,
    type: "30% Deposit",
    gatewayCode: "RKG89201JX",
    status: "Settled",
    timestamp: "2026-10-03 09:12:30",
  },
  {
    id: "tx-105",
    ref: "PAY-2026-9045",
    bookingRef: "KA-2026-0818",
    customerName: "Liam O'Connor",
    method: "M-Pesa Express",
    amountUsd: 460,
    amountKes: 59800,
    type: "30% Deposit",
    gatewayCode: "RKH11029KL",
    status: "Pending",
    timestamp: "2026-10-05 18:22:15",
  },
  {
    id: "tx-106",
    ref: "PAY-2026-9046",
    bookingRef: "KA-2026-0814",
    customerName: "Eleanor & Marcus Vance",
    method: "Stripe (Card)",
    amountUsd: 1246,
    amountKes: 161980,
    type: "Balance 70%",
    gatewayCode: "ch_3Nwk9L2eZvKYlo2C33llQ",
    status: "Settled",
    timestamp: "2026-10-05 10:14:02",
  },
];

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New manual entry state
  const [newTx, setNewTx] = useState({
    bookingRef: "KA-2026-",
    customerName: "",
    method: "Bank Wire / RTGS" as PaymentMethod,
    amountUsd: 1000,
    type: "30% Deposit" as PaymentType,
    gatewayCode: "",
  });

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.ref.toLowerCase().includes(search.toLowerCase()) ||
      t.bookingRef.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.gatewayCode.toLowerCase().includes(search.toLowerCase());

    const matchesMethod = methodFilter === "ALL" || t.method === methodFilter;
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;

    return matchesSearch && matchesMethod && matchesStatus;
  });

  const handleRecordManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.bookingRef || !newTx.customerName || !newTx.gatewayCode) return;

    const created: Transaction = {
      id: `tx-${Date.now()}`,
      ref: `PAY-2026-${Math.floor(9047 + Math.random() * 500)}`,
      bookingRef: newTx.bookingRef,
      customerName: newTx.customerName,
      method: newTx.method,
      amountUsd: Number(newTx.amountUsd),
      amountKes: Math.round(Number(newTx.amountUsd) * 130),
      type: newTx.type,
      gatewayCode: newTx.gatewayCode,
      status: "Settled",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    setTransactions([created, ...transactions]);
    setIsModalOpen(false);
  };

  const exportCsv = () => {
    const headers = ["Payment Ref", "Booking Ref", "Customer", "Method", "Amount USD", "Amount KES", "Type", "Gateway Code", "Status", "Timestamp"];
    const rows = filtered.map((t) => [
      t.ref,
      t.bookingRef,
      `"${t.customerName}"`,
      `"${t.method}"`,
      t.amountUsd,
      t.amountKes,
      `"${t.type}"`,
      t.gatewayCode,
      t.status,
      t.timestamp,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kayarabuko_payments_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "Settled":
        return "bg-green/15 text-forest border border-green/30 font-semibold";
      case "Pending":
        return "bg-gold/20 text-charcoal border border-gold/40 font-semibold";
      case "Failed":
        return "bg-rose-100 text-rose-800 border border-rose-300 font-medium";
      case "Refunded":
        return "bg-charcoal/10 text-charcoal/70 border border-charcoal/20 font-medium";
    }
  };

  const totalSettledUsd = transactions
    .filter((t) => t.status === "Settled")
    .reduce((sum, t) => sum + t.amountUsd, 0);

  const totalPendingUsd = transactions
    .filter((t) => t.status === "Pending")
    .reduce((sum, t) => sum + t.amountUsd, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-forest">Payment Transactions & Settlement</h1>
          <p className="text-xs text-charcoal/70">
            Real-time reconciliation of M-Pesa Daraja, Stripe international cards, and bank wires.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCsv}
            className="rounded-ka border border-charcoal/20 bg-ivory px-3 py-2 text-xs font-semibold text-charcoal hover:bg-cream/40 transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-ka bg-forest px-4 py-2 text-xs font-semibold text-ivory hover:bg-green transition-colors"
          >
            + Record Manual Settlement
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Total Settled (USD)</p>
          <p className="mt-1 font-serif text-2xl font-bold text-forest">{formatUsd(totalSettledUsd)}</p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">
            KES {(totalSettledUsd * 130).toLocaleString()} equiv.
          </p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Pending Inbound</p>
          <p className="mt-1 font-serif text-2xl font-bold text-gold">{formatUsd(totalPendingUsd)}</p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">Awaiting callback / clearance</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Transactions Count</p>
          <p className="mt-1 font-serif text-2xl font-bold text-charcoal">{transactions.length}</p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">98.3% Gateway success rate</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Forex Baseline</p>
          <p className="mt-1 font-serif text-2xl font-bold text-forest">130.00</p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">KES per 1.00 USD fixed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
        <input
          type="text"
          placeholder="Search payment ref, booking ref, guest name, or transaction code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md w-full rounded-ka border border-charcoal/20 bg-cream/20 px-3 py-2 text-xs focus:border-forest focus:outline-none"
        />
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-charcoal/60 font-medium">Gateway:</span>
          {["ALL", "M-Pesa Express", "Stripe (Card)", "Bank Wire / RTGS"].map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`rounded-ka px-3 py-1 text-xs transition-colors ${
                methodFilter === m ? "bg-forest text-ivory font-semibold" : "bg-cream/40 text-charcoal hover:bg-cream"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-ka border border-charcoal/10 bg-ivory shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-charcoal/10 bg-cream/30 text-[11px] font-semibold uppercase tracking-wider text-charcoal/70">
            <tr>
              <th className="p-3.5">Payment Ref</th>
              <th className="p-3.5">Booking / Customer</th>
              <th className="p-3.5">Gateway & Code</th>
              <th className="p-3.5">Type</th>
              <th className="p-3.5">Amount (USD & KES)</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/10">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-cream/15 transition-colors">
                <td className="p-3.5">
                  <p className="font-mono font-bold text-forest">{item.ref}</p>
                </td>
                <td className="p-3.5">
                  <p className="font-semibold text-charcoal">{item.customerName}</p>
                  <p className="font-mono text-[11px] text-charcoal/60">Booking: {item.bookingRef}</p>
                </td>
                <td className="p-3.5">
                  <p className="font-medium text-charcoal">{item.method}</p>
                  <p className="font-mono text-[11px] text-forest">{item.gatewayCode}</p>
                </td>
                <td className="p-3.5 text-charcoal/80 font-medium">{item.type}</td>
                <td className="p-3.5 font-mono">
                  <p className="text-forest font-bold">{formatUsd(item.amountUsd)}</p>
                  <p className="text-charcoal/60 text-[11px]">KES {item.amountKes.toLocaleString()}</p>
                </td>
                <td className="p-3.5">
                  <span className={`rounded-ka px-2 py-0.5 text-[10px] ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-3.5 text-charcoal/70 text-[11px]">{item.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manual Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-ka border border-charcoal/15 bg-ivory p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-forest">Record Manual Payment Settlement</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded p-1 text-charcoal/60 hover:text-charcoal"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRecordManual} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal">Booking Reference</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KA-2026-0814"
                  value={newTx.bookingRef}
                  onChange={(e) => setNewTx({ ...newTx, bookingRef: e.target.value })}
                  className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={newTx.customerName}
                  onChange={(e) => setNewTx({ ...newTx, customerName: e.target.value })}
                  className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal">Payment Channel</label>
                  <select
                    value={newTx.method}
                    onChange={(e) => setNewTx({ ...newTx, method: e.target.value as PaymentMethod })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  >
                    <option value="Bank Wire / RTGS">Bank Wire / RTGS</option>
                    <option value="M-Pesa Express">M-Pesa Express</option>
                    <option value="Stripe (Card)">Stripe (Card)</option>
                    <option value="Office Cash">Office Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-charcoal">Payment Type</label>
                  <select
                    value={newTx.type}
                    onChange={(e) => setNewTx({ ...newTx, type: e.target.value as PaymentType })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  >
                    <option value="30% Deposit">30% Deposit</option>
                    <option value="Balance 70%">Balance 70%</option>
                    <option value="Full Payment">Full Payment</option>
                    <option value="Safari Add-On">Safari Add-On</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal">Amount (USD)</label>
                  <input
                    type="number"
                    min="1"
                    value={newTx.amountUsd}
                    onChange={(e) => setNewTx({ ...newTx, amountUsd: Number(e.target.value) })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal">Transaction / Bank Ref Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NCBA-FT-1234 or MPESA code"
                    value={newTx.gatewayCode}
                    onChange={(e) => setNewTx({ ...newTx, gatewayCode: e.target.value })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-charcoal/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-ka px-4 py-2 font-medium text-charcoal hover:bg-cream/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-ka bg-forest px-4 py-2 font-semibold text-ivory hover:bg-green"
                >
                  Confirm & Reconcile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
