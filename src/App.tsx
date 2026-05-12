import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import PizzaCard from "./pizzaCard";
import Home from "./Home";
import Admin from "./Admin";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import pizzasData from "./pizzasData";

const categories = [
  "Все",
  "Мясные",
  "Вегетарианская",
  "Гриль",
  "Острые",
  "Закрытые",
];

function App() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [cart, setCart] = useState<any[]>([]);
  const [pizzas, setPizzas] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [sortType, setSortType] = useState("default");
  const navigate = useNavigate();

  useEffect(() => {
    const savedPizzas = localStorage.getItem("pizzas");
    if (savedPizzas) {
      setPizzas(JSON.parse(savedPizzas));
    } else {
      setPizzas(pizzasData);
    }

    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  useEffect(() => {
    if (pizzas.length > 0) {
      localStorage.setItem("pizzas", JSON.stringify(pizzas));
    }
  }, [pizzas]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const filteredPizzas =
    selectedCategory === 0
      ? pizzas
      : pizzas.filter((pizza) =>
          pizza.types.includes(categories[selectedCategory])
        );

  const sortedPizzas = [...filteredPizzas].sort((a, b) => {
    if (sortType === "alphabet") {
      return a.name?.localeCompare(b.name, "ru") || 0;
    }
    if (sortType === "popular") {
      return (b.sold || 0) - (a.sold || 0);
    }
    return 0;
  });

  const addToCart = (pizza: any, size: number, price: number) => {
    setCart((prev) => {
      const found = prev.find(
        (item) => item.id === pizza.id && item.size === size
      );
      if (found) {
        return prev.map((item) =>
          item.id === pizza.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          { ...pizza, size, price, quantity: 1, imageUrl: pizza.imageUrl },
        ];
      }
    });

    toast.success(`${pizza.name} (${size} см) корзинага qo'shildi!`);
  };

  const handleLogin = () => {
    if (login === "1" && password === "1") {
      toast.success("✅ Admin paneliga xush kelibsiz!");
      setShowLogin(false);
      setLogin("");
      setPassword("");
      navigate("/admin");
    } else {
      toast.error("❌ Login yoki parol noto‘g‘ri!");
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route
          path="/"
          element={
            <div className="container">
              <header>
                <div className="logo">
                  <h1>🍕 </h1>
                  <h1>React</h1>
                  <h1>Pizza</h1>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    alignItems: "flex-end",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      className="cart-btn admin-btn"
                      onClick={() => setShowLogin(true)}
                      style={{display: "none",}}
                    >
                      Admin
                    </button>

                    <div className="cart">
                      <span>
                        <button
                          className="cart-btn"
                          onClick={() => navigate("/home")}
                        >
                          <img src="/shoppingCart.png" alt="" width={19} height={19} />
                        {cart.reduce((acc, p) => acc + p.quantity, 0)}
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </header>

              <div className="categories">
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    className={selectedCategory === idx ? "active" : ""}
                    onClick={() => setSelectedCategory(idx)}
                  >
                    {cat}
                  </button>
                ))}

                <select
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
                  style={{
                    padding: "6px",
                    borderRadius: "6px",
                    marginLeft: "10px",
                  }}
                >
                  <option value="default">Сортировка</option>
                  <option value="alphabet">По алфавиту</option>
                  <option value="popular">По популярности</option>
                </select>
              </div>

              <h2>Все пиццы</h2>
              <div className="pizza-list">
                {sortedPizzas.map((pizza) => (
                  <PizzaCard key={pizza.id} pizza={pizza} onAdd={addToCart} />
                ))}
              </div>

              {showLogin && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      background: "#fff",
                      padding: "20px",
                      borderRadius: "10px",
                      width: "300px",
                      textAlign: "center",
                    }}
                  >
                    <h3>🔐 Admin Login</h3>
                    <input
                      type="text"
                      placeholder="Login"
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      style={{
                        width: "90%",
                        margin: "10px 0",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                      }}
                    />
                    <input
                      type="password"
                      placeholder="Parol"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: "90%",
                        margin: "10px 0",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                      }}
                    />
                    <div style={{ marginTop: "10px" }}>
                      <button
                        onClick={handleLogin}
                        style={{
                          padding: "8px 15px",
                          marginRight: "10px",
                          borderRadius: "6px",
                          border: "none",
                          background: "#4CAF50",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        Kirish
                      </button>
                      <button
                        onClick={() => setShowLogin(false)}
                        style={{
                          padding: "8px 15px",
                          borderRadius: "6px",
                          border: "none",
                          background: "#f44336",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        Bekor qilish
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          }
        />

        <Route
          path="/home"
          element={React.createElement(Home as any, {
            cart,
            setCart,
            setOrders,
          })}
        />

        <Route
          path="/admin"
          element={
            <Admin
              pizzas={pizzas}
              setPizzas={setPizzas}
              orders={orders}
              setOrders={setOrders}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
