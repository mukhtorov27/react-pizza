import React, { useState } from "react";

export interface Pizza {
  id: number;
  name: string;
  title?: string;
  imageUrl: string;
  types?: string[];
  sizes?: number[];
  price: number;
  oldPrice?: number | null;
}

interface PizzaCardProps {
  pizza: Pizza;
  onAdd: (pizza: Pizza, size: number, price: number) => void;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, onAdd }) => {
  const [selectedSize, setSelectedSize] = useState<number>(
    pizza.sizes?.[0] ?? 26
  );

  const getPrice = (): number => {
    if (selectedSize === 26) return pizza.price;
    if (selectedSize === 30) return pizza.price + 50;
    if (selectedSize === 40) return pizza.price + 100;
    return pizza.price;
  };

  return (
    <div className="pizza-card">
      <img
        className="pizza-img"
        src={pizza.imageUrl}
        alt={pizza.title ?? pizza.name}
      />

      <h3>{pizza.title ?? pizza.name}</h3>

      {pizza.sizes && (
        <div className="sizes">
          {pizza.sizes.map((size) => (
            <button
              key={size}
              className={selectedSize === size ? "active" : ""}
              onClick={() => setSelectedSize(size)}
              aria-label={`Select size ${size}`}
              type="button"
            >
              {size} см
            </button>
          ))}
        </div>
      )}

      <div className="bottom">
        <span>от {getPrice()} ₽</span>
        <button
          className="add-btn"
          onClick={() =>
            onAdd(
              {
                ...pizza,
                title: pizza.title ?? pizza.name,
                imageUrl: pizza.imageUrl,
              },
              selectedSize,
              getPrice()
            )
          }
          type="button"
        >
          Добавить
        </button>
      </div>
    </div>
  );
};

export default PizzaCard;
