import React, { useState } from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

interface Pizza {
  id: number;
  name: string;
  title?: string;
  imageUrl: string;
  types?: string[];
  sizes?: number[];
  price: number;
  oldPrice?: number | null;
}

interface OrderItem {
  name: string;
  size: number;
  quantity: number;
  price: number;
}

interface Order {
  name: string;
  address: string;
  payment: string;
  date: string;
  items: OrderItem[];
  total: number;
  delivered?: boolean;
}

interface AdminProps {
  pizzas: Pizza[];
  setPizzas: React.Dispatch<React.SetStateAction<Pizza[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const Admin: React.FC<AdminProps> = ({
  pizzas,
  setPizzas,
  orders,
  setOrders,
}) => {
  const [visible, setVisible] = useState(false);
  const [showContent, setShowContent] = useState<
    "products" | "orders" | "delivered"
  >("products");
  const [editingPizza, setEditingPizza] = useState<Pizza | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [typesInput, setTypesInput] = useState<string>("Все");
  const [sizesInput, setSizesInput] = useState<number[]>([26, 30, 40]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [code, setCode] = useState("");

  const AVAILABLE_TYPES = [
    "Все",
    "Мясные",
    "Вегетарианская",
    "Гриль",
    "Острые",
    "Закрытые",
  ];
  const AVAILABLE_SIZES = [26, 30, 40];
  const correctCode = "admin123";

  const handleLogin = () => {
    if (code === correctCode) {
      setIsLoggedIn(true);
    } else {
      alert("Kod noto'g'ri!");
    }
  };

  const markAsDelivered = (index: number) => {
    setOrders((prev) =>
      prev.map((order, i) =>
        i === index ? { ...order, delivered: true } : order
      )
    );
  };

  const openModal = (pizza: Pizza | null = null) => {
    if (pizza) {
      setEditingPizza(pizza);
      setName(pizza.name);
      setPrice(String(pizza.price));
      setImageUrl(pizza.imageUrl);
      setTypesInput((pizza.types && pizza.types[0]) || "Все");
      setSizesInput(pizza.sizes || [26, 30, 40]);
    } else {
      setEditingPizza(null);
      setName("");
      setPrice("");
      setImageUrl("");
      setTypesInput("Все");
      setSizesInput([26, 30, 40]);
    }
    setVisible(true);
  };

  const savePizza = () => {
    if (!name || !price || !imageUrl) {
      alert("Hamma maydonlarni to'ldiring");
      return;
    }

    if (editingPizza) {
      setPizzas((prev) =>
        prev.map((p) =>
          p.id === editingPizza.id
            ? {
                ...p,
                name,
                oldPrice: p.price,
                price: Number(price),
                imageUrl,
                types: [typesInput],
                sizes: sizesInput,
              }
            : p
        )
      );
    } else {
      const newPizza: Pizza = {
        id: Date.now(),
        name,
        price: Number(price),
        oldPrice: null,
        imageUrl,
        types: [typesInput],
        sizes: sizesInput,
      };
      setPizzas((prev) => [...prev, newPizza]);
    }
    setVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setImageUrl("");
    setTypesInput("Все");
    setSizesInput([26, 30, 40]);
    setEditingPizza(null);
  };

  const deletePizza = (id: number) =>
    setPizzas((prev) => prev.filter((p) => p.id !== id));

  const deleteOrder = (index: number) =>
    setOrders((prev) => prev.filter((_, i) => i !== index));

  const clearAllOrders = () => {
    if (window.confirm("Barchasini o'chirish?")) setOrders([]);
  };

  if (!isLoggedIn) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ffcc70, #ff6f91)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            padding: 40,
            borderRadius: 12,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
            width: 300,
          }}
        >
          <h2 style={{ marginBottom: 16 }}>Admin Panel</h2>
          <input
            type="password"
            placeholder="Kodni kiriting"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 12,
              borderRadius: 6,
              border: "1px solid #ddd",
              fontSize: 14,
            }}
          />
          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: 10,
              background: "#ff6f91",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Kirish
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (showContent) {
      case "products":
        return (
          <>
            <h3>Mahsulotlar</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 12,
              }}
            >
              {pizzas.map((pizza) => (
                <div
                  key={pizza.id}
                  style={{
                    border: "1px solid #eee",
                    padding: 12,
                    borderRadius: 8,
                    background: "#fff",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  }}
                >
                  <img
                    src={pizza.imageUrl}
                    alt={pizza.name}
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                  <div style={{ marginTop: 8, fontWeight: 600 }}>
                    {pizza.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                    {pizza.types?.join(", ")}
                  </div>
                  <div
                    style={{ color: "#2e7d32", fontWeight: 700, marginTop: 6 }}
                  >
                    {pizza.price} ₽
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button
                      onClick={() => openModal(pizza)}
                      style={{
                        flex: 1,
                        padding: "6px 8px",
                        background: "#ffb74d",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePizza(pizza.id)}
                      style={{
                        flex: 1,
                        padding: "6px 8px",
                        background: "#e57373",
                        border: "none",
                        borderRadius: 4,
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      case "orders":
        return (
          <>
            <h3>Buyurtmalar</h3>
            {orders.filter((order) => !order.delivered).length === 0 ? (
              <p>Buyurtma yo'q</p>
            ) : (
              <>
                <button
                  onClick={clearAllOrders}
                  style={{
                    marginBottom: 12,
                    padding: "8px 10px",
                    background: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Hammasini o'chirish
                </button>
                {orders
                  .filter((order) => !order.delivered)
                  .map((order, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: "1px solid #eee",
                        padding: 10,
                        marginBottom: 10,
                        borderRadius: 8,
                        background: "white",
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{order.name}</div>
                      <div>{order.address}</div>
                      <div>Jami: {order.total} ₽</div>
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <button
                          onClick={() => markAsDelivered(idx)}
                          style={{
                            padding: "6px 8px",
                            background: "#4CAF50",
                            border: "none",
                            color: "white",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                        >
                          Yetkazildi
                        </button>
                        <button
                          onClick={() => deleteOrder(idx)}
                          style={{
                            padding: "6px 8px",
                            background: "#e57373",
                            border: "none",
                            color: "white",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                        >
                          O'chirish
                        </button>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </>
        );
      case "delivered":
        return (
          <>
            <h3>Yetkazilgan Buyurtmalar</h3>
            {orders.filter((order) => order.delivered).length === 0 ? (
              <p>Yetkazilgan buyurtmalar yo'q</p>
            ) : (
              <div>
                {orders
                  .filter((order) => order.delivered)
                  .map((order, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: "1px solid #eee",
                        padding: 10,
                        marginBottom: 10,
                        borderRadius: 8,
                        background: "white",
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{order.name}</div>
                      <div>{order.address}</div>
                      <div>Jami: {order.total} ₽</div>
                      <div>{order.date}</div>
                      <div style={{ color: "#4CAF50", fontWeight: 600 }}>
                        Yetkazilgan
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <aside
        style={{
          width: 220,
          background: "#ffe0b2",
          padding: 16,
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={() => setShowContent("products")}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 8,
            border: "none",
            background: showContent === "products" ? "#ff7043" : "#ffb74d",
            borderRadius: 6,
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Mahsulotlar
        </button>
        <button
          onClick={() => setShowContent("orders")}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 8,
            border: "none",
            background: showContent === "orders" ? "#ff7043" : "#ffb74d",
            borderRadius: 6,
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Buyurtmalar
        </button>
        <button
          onClick={() => setShowContent("delivered")}
          style={{
            width: "100%",
            padding: 10,
            border: "none",
            background: showContent === "delivered" ? "#ff7043" : "#ffb74d",
            borderRadius: 6,
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Yetkazilganlar
        </button>
      </aside>

      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            padding: 12,
            borderBottom: "1px solid #eee",
            display: "flex",
            gap: 12,
            alignItems: "center",
            background: "#fff3e0",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18 }}>🍕 Admin Panel</div>
          <input
            placeholder="Search..."
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
          />
          {showContent === "products" && (
            <button
              onClick={() => openModal(null)}
              style={{
                padding: "8px 12px",
                background: "#ff7043",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              + Qo'shish
            </button>
          )}
        </header>

        <section
          style={{ padding: 16, overflowY: "auto", background: "#fff8e1" }}
        >
          {renderContent()}
        </section>
      </main>

      <Rodal
        visible={visible}
        onClose={() => setVisible(false)}
        customStyles={{ height: "max-content" }}
        width={480}
        height={520}
      >
        <div style={{ padding: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
            {editingPizza ? "Tahrirlash" : "Yangi mahsulot"}
          </div>

          <input
            type="text"
            placeholder="Rasm URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 8,
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
          />
          <input
            type="text"
            placeholder="Nomi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 8,
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
          />
          <input
            type="number"
            placeholder="Narxi"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 8,
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
          />

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Turi</label>
            <select
              value={typesInput}
              onChange={(e) => setTypesInput(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ddd",
              }}
            >
              {AVAILABLE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", marginBottom: 6 }}>
              O'lchamlar (Ctrl/Cmd+click bilan bir nechta tanlang)
            </label>
            <select
              multiple
              value={sizesInput.map(String)}
              onChange={(e) =>
                setSizesInput(
                  Array.from(e.target.selectedOptions).map((o) =>
                    Number(o.value)
                  )
                )
              }
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ddd",
                height: 90,
              }}
            >
              {AVAILABLE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s} см
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            <button
              onClick={savePizza}
              style={{
                padding: "8px 12px",
                background: "#81c784",
                border: "none",
                borderRadius: 6,
                color: "white",
                cursor: "pointer",
              }}
            >
              Saqlash
            </button>
            <button
              onClick={() => setVisible(false)}
              style={{
                padding: "8px 12px",
                background: "#e57373",
                border: "none",
                borderRadius: 6,
                color: "white",
                cursor: "pointer",
              }}
            >
              Bekor
            </button>
          </div>
        </div>
      </Rodal>
    </div>
  );
};

export default Admin;
