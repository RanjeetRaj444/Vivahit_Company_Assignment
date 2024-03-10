import React, { useContext } from "react";
import { CryptoContext } from "../Context";

const CardsContainer = ({ cardsDetails }) => {
  const { currencySymbol } = useContext(CryptoContext);
  return (
    <div className="cards__container section">
      {cardsDetails?.length > 0 &&
        cardsDetails?.map((card) => (
          <div className="card" key={card.name}>
            <p>{card.name}</p>
            {card.symbol === "percentage" ? (
              <p className="card__values">{`${card?.value}%`}</p>
            ) : (
              <p className="card__values">{`${currencySymbol} ${card?.value}`}</p>
            )}
          </div>
        ))}
    </div>
  );
};

export default CardsContainer;
