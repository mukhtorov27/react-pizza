import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

interface HomeProps {
  cart: any[];
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
}

const Home: React.FC<HomeProps> = ({ cart, setCart, setOrders }) => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Naqd");

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleOrder = () => {
    const newOrder = {
      name,
      address,
      payment,
      items: cart,
      total,
      date: new Date().toLocaleString(),
    };

    setOrders((prev) => [...prev, newOrder]);

    alert(
      `✅ Buyurtma rasmiylashtirildi!\n👤 Ism: ${name}\n🏠 Adres: ${address}\n💳 To'lov turi: ${payment}\n💰 Jami: ${total} ₽`
    );
    setIsModalVisible(false);
    clearCart();
    navigate("/");
  };

  return (
    <div
      style={{
        width: "70%",
        margin: "30px auto",
        padding: "20px",
        background: "#fff",
        borderRadius: "12px",
      }}
    >
      <h2 style={{ marginBottom: "20px", fontSize: "24px" }}> <img src="/shoppingCart.png" width={24} height={24} /> Корзина</h2>

      {cart.length === 0 ? (
        <p style={{ textAlign: "center" }}>Корзина пуста</p>
      ) : (
        <div>
          {cart.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "15px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <img
                  src={item.imageUrl}
                  alt={item.title || item.name}
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div style={{ marginLeft: "15px" }}>
                  <h4 style={{ margin: "0 0 5px" }}>{item.title}</h4>
                  <p style={{ margin: 0, color: "#777" }}>
                    {item.dough || "тонкое тесто"}, {item.size} см
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() =>
                    setCart((prev) =>
                      prev.map((p, i) =>
                        i === idx && p.quantity > 1
                          ? { ...p, quantity: p.quantity - 1 }
                          : p
                      )
                    )
                  }
                  style={{
                    border: "none",
                    background: "transparent",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    cursor: "pointer",
                    color: "#FE5F1E",
                    fontWeight: "bold",
                  }}
                >
                  ➖
                </button>
                <b style={{ margin: "0 10px" }}>{item.quantity}</b>
                <button
                  onClick={() =>
                    setCart((prev) =>
                      prev.map((p, i) =>
                        i === idx ? { ...p, quantity: p.quantity + 1 } : p
                      )
                    )
                  }
                  style={{
                    border: "none",
                    background: "transparent",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    cursor: "pointer",
                    color: "#FE5F1E",
                    fontWeight: "bold",
                  }}
                >
                  ➕
                </button>
              </div>

              <b style={{ width: "80px", textAlign: "right" }}>
                {item.price * item.quantity} ₽
              </b>

              <button
                onClick={() =>
                  setCart((prev) => prev.filter((_, i) => i !== idx))
                }
                style={{
                  border: "none",
                  background: "transparent",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  cursor: "pointer",
                  marginLeft: "15px",
                }}
              >
                ❌
              </button>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
              fontSize: "18px",
            }}
          >
            <p>
              Всего пицц: <b>{totalCount} шт.</b>
            </p>
            <p>
              Сумма заказа: <b style={{ color: "#FE5F1E" }}>{total} ₽</b>
            </p>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "30px",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 25px",
            borderRadius: "25px",
            border: "1px solid #ddd",
            background: "#f9f9f9",
            cursor: "pointer",
          }}
        >
          ← Вернуться назад
        </button>

        {cart.length > 0 && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={clearCart}
              style={{
                padding: "12px 20px",
                borderRadius: "25px",
                border: "1px solid #ddd",
                background: "#f9f9f9",
                cursor: "pointer",
              }}
            >
              Очистить корзину
            </button>

            <button
              onClick={() => setIsModalVisible(true)}
              style={{
                padding: "12px 25px",
                borderRadius: "25px",
                border: "none",
                background: "#FE5F1E",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Оплатить сейчас
            </button>
          </div>
        )}
      </div>

      <Rodal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        width={400}
        height={370}
      >
        <div style={{ textAlign: "center" }}>
          <h3>📋 Оформление заказа</h3>

          <input
            type="text"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "90%",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />

          <input
            type="text"
            placeholder="Ваш адрес"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              width: "90%",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />

          <select
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            style={{
              width: "95%",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="Naqd">Naqd</option>
            <option value="Karta">Karta</option>
          </select>

          <button
            onClick={handleOrder}
            style={{
              marginTop: "15px",
              padding: "12px 25px",
              borderRadius: "25px",
              border: "none",
              background: "#2196F3",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ✅ Рaсмийлаштириш
          </button>
        </div>
      </Rodal>
    </div>
  );
};

export default Home;
