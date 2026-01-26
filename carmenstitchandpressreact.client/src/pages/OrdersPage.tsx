import React, { useEffect, useMemo, useState } from "react";
import type { JSX } from "react/jsx-runtime";

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Completed" | "Cancelled";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  customerName: string;
  status: OrderStatus;
  total: number;
  createdAt: string; // ISO date
  items?: OrderItem[];
};

export default function OrdersPage(): JSX.Element {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortKey, setSortKey] = useState<"createdAt" | "total">("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchOrders(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const data = (await res.json()) as Order[];
      setOrders(data);
    } catch (err) {
      // Fallback: show a small set of mock data so page is usable in dev without API
      console.error(err);
      setError("Failed to load orders. Showing local demo data.");
      setOrders(getMockOrders());
    } finally {
      setLoading(false);
    }
  }

  const statuses: string[] = useMemo(
    () => ["All", "Pending", "Processing", "Shipped", "Completed", "Cancelled"],
    []
  );

  const filtered = useMemo(() => {
    if (!orders) return [];
    let list = orders.slice();

    if (query.trim() !== "") {
      const q = query.toLowerCase();
      list = list.filter(
        (o) =>
          o.customerName.toLowerCase().includes(q) ||
          o.id.toString().toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "All") {
      list = list.filter((o) => o.status === statusFilter);
    }

    list.sort((a, b) => {
      let v = 0;
      if (sortKey === "createdAt") {
        v = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        v = a.total - b.total;
      }
      return sortDirection === "asc" ? v : -v;
    });

    return list;
  }, [orders, query, statusFilter, sortKey, sortDirection]);

  function toggleSort(key: "createdAt" | "total") {
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  }

  function formatCurrency(n: number) {
    return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString();
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Orders</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
        <input
          aria-label="Search orders"
          placeholder="Search by customer or order id..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 8, flex: 1 }}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: 8 }}>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button onClick={() => fetchOrders()} disabled={loading} style={{ padding: "8px 12px" }}>
          Refresh
        </button>
      </div>

      {error && (
        <div style={{ marginBottom: 8, color: "orange" }}>
          {error}
        </div>
      )}

      <div style={{ overflowX: "auto", border: "1px solid #e6e6e6", borderRadius: 4 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", background: "#fafafa" }}>
              <th style={thStyle}>Order ID</th>
              <th style={thStyle}>Customer</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle} onClick={() => toggleSort("total")}>
                Total {sortKey === "total" ? (sortDirection === "asc" ? "?" : "?") : ""}
              </th>
              <th style={thStyle} onClick={() => toggleSort("createdAt")}>
                Created {sortKey === "createdAt" ? (sortDirection === "asc" ? "?" : "?") : ""}
              </th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} style={{ padding: 16 }}>
                  Loading...
                </td>
              </tr>
            )}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 16 }}>
                  No orders found.
                </td>
              </tr>
            )}

            {!loading &&
              filtered.map((o) => (
                <tr key={o.id} style={{ borderTop: "1px solid #f0f0f0" }}>
                  <td style={tdStyle}>{o.id}</td>
                  <td style={tdStyle}>{o.customerName}</td>
                  <td style={tdStyle}>{o.status}</td>
                  <td style={tdStyle}>{formatCurrency(o.total)}</td>
                  <td style={tdStyle}>{formatDate(o.createdAt)}</td>
                  <td style={tdStyle}>
                    <button onClick={() => setSelectedOrder(o)} style={{ marginRight: 8 }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div role="dialog" aria-modal="true" style={modalStyle}>
          <div style={modalContentStyle}>
            <h2>Order {selectedOrder.id}</h2>
            <p>
              <strong>Customer:</strong> {selectedOrder.customerName}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Total:</strong> {formatCurrency(selectedOrder.total)}
            </p>
            <p>
              <strong>Created:</strong> {formatDate(selectedOrder.createdAt)}
            </p>

            <h3>Items</h3>
            <ul>
              {(selectedOrder.items ?? []).map((it) => (
                <li key={it.id}>
                  {it.name} × {it.quantity} — {formatCurrency(it.price)}
                </li>
              ))}
            </ul>

            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "8px 12px",
  fontWeight: 600,
  cursor: "pointer",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 12px",
  verticalAlign: "top",
};

const modalStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  background: "white",
  padding: 20,
  borderRadius: 6,
  width: "90%",
  maxWidth: 600,
  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
};

function getMockOrders(): Order[] {
  const now = new Date();
  return [
    {
      id: "1001",
      customerName: "Alice Johnson",
      status: "Processing",
      total: 89.5,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      items: [
        { id: "a1", name: "Custom Tote", quantity: 1, price: 29.5 },
        { id: "a2", name: "T-Shirt", quantity: 2, price: 30.0 },
      ],
    },
    {
      id: "1002",
      customerName: "Bob Smith",
      status: "Shipped",
      total: 45.0,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(),
      items: [{ id: "b1", name: "Cap", quantity: 3, price: 15.0 }],
    },
    {
      id: "1003",
      customerName: "Carmen Studio",
      status: "Pending",
      total: 150.0,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 72).toISOString(),
      items: [{ id: "c1", name: "Embroidery Order", quantity: 1, price: 150.0 }],
    },
  ];
}