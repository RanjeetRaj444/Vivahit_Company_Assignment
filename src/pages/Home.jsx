import React, { useEffect, useState } from "react";
import { CryptoContext } from "../Context";
import CardsContainer from "../components/CardsContainer";
import axios from "axios";
import "chart.js/auto";
import ChartSection from "../components/ChartSection";
import logo from "../assets/bitcoin-btc-logo.png";
import errorImg from "../assets/website-error-screen-free-png.png";
import { CryptoItem, Cryptos } from "../configs/api";

const Home = () => {
  const [cryptoId, setCryptoId] = useState("");
  const [cryptoList, setCryptoList] = useState([]);
  const [cryptoListItem, setCryptoListItem] = useState({});
  const [cardsDetails, setcardsDetails] = useState({});
  const [currency, setCurrency] = useState("inr");
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  const [flags, setFlags] = useState(false);
  const [error, setError] = useState({
    hasError: false,
    errorMessage: "asdas",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCryptoChange = (event) => {
    setCryptoId(event.target.value);
  };

  const handleCurrencyChange = (event) => {
    const currenctCurrency = event.target.value;
    if (currenctCurrency === "inr") setCurrencySymbol("₹");
    else if (currenctCurrency === "usd") setCurrencySymbol("$");
    setCurrency(currenctCurrency);
  };

  const getCryptoItems = async () => {
    try {
      const { data } = await axios.get(Cryptos(currency));
      setCryptoList(data);
      setCryptoId(data[0].id);
      setFlags(true);
      setIsLoading(false);
    } catch (error) {
      console.error(error.message);
      setFlags(true);
      setError({ hasError: true, errorMessage: error.message });
      setIsLoading(false);
    }
  };

  const getCryptoItemData = async () => {
    try {
      const { data } = await axios.get(CryptoItem(cryptoId));
      setCryptoListItem(data);
      prepareCardsData(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error.message);
      setError({ hasError: true, errorMessage: error.message });
      setIsLoading(false);
    }
  };

  const prepareCardsData = (cryptoItem) => {
    const cards = [];
    cards.push({
      name: "Market Cap 24Hrs",
      value:
        cryptoItem?.market_data.market_cap_change_percentage_24h?.toFixed(2),
      symbol: "percentage",
    });
    cards.push({
      name: "All Time High",
      value: cryptoItem?.market_data.ath[currency]?.toFixed(2),
      symbol: "currency",
    });
    cards.push({
      name: "Positive Sentiments",
      value: cryptoItem?.sentiment_votes_up_percentage?.toFixed(2),
      symbol: "percentage",
    });
    cards.push({
      name: "High 24Hrs",
      value: cryptoItem?.market_data.high_24h[currency]?.toFixed(2),
      symbol: "currency",
    });
    cards.push({
      name: "Low 24Hrs",
      value: cryptoItem?.market_data.low_24h[currency]?.toFixed(2),
      symbol: "currency",
    });
    setcardsDetails(cards);
  };

  useEffect(() => {
    if (!flags) {
      getCryptoItems();
    }
  }, []);

  useEffect(() => {
    if (cryptoId !== "") {
      getCryptoItemData();
    }
  }, [cryptoId, currency]);

  return (
    <>
      {error.hasError ? (
        <div className="error__box">
          <img src={errorImg} alt="" />
          <p>{error.errorMessage}</p>
        </div>
      ) : (
        <CryptoContext.Provider value={{ cryptoId, currency, currencySymbol }}>
          {cryptoList?.length > 0 && Object.keys(cryptoListItem).length > 0 && (
            <div className="main__container">
              <nav className="section">
                <img className="logo" src={logo} alt="" />
                <div className="selections">
                  <select
                    className="select__crypto"
                    name=""
                    id=""
                    onChange={(event) => handleCryptoChange(event)}
                  >
                    {cryptoList.map((crypto) => (
                      <option key={crypto.id} value={crypto.id}>
                        {crypto.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="select__currency"
                    onChange={(event) => handleCurrencyChange(event)}
                  >
                    <option value="inr">INR</option>
                    <option value="usd">USD</option>
                  </select>
                </div>
              </nav>

              <div className="cards__section">
                {cardsDetails && cardsDetails.length > 0 && (
                  <CardsContainer cardsDetails={cardsDetails} />
                )}
              </div>

              <div className="current__price_container section">
                <div className="coin__name">
                  <img
                    className="logo"
                    src={cryptoListItem?.image?.large}
                    alt=""
                  />
                  <p>{cryptoListItem?.name}</p>
                </div>
                <div className="current__price">
                  <p className="current__price-label">Current Price</p>
                  <p className="current__price-number">
                    {currencySymbol}
                    {
                      cryptoListItem?.market_data.current_price[
                        currency.toLocaleLowerCase()
                      ]
                    }
                  </p>
                </div>
              </div>

              <ChartSection
                priceChange24={
                  cryptoListItem?.market_data.price_change_24h_in_currency[
                    currency
                  ]
                }
                marketCap={cryptoListItem?.market_data.market_cap[currency]}
                totVol={cryptoListItem?.market_data.total_volume[currency]}
                circulating={cryptoListItem?.market_data["circulating_supply"]}
                twitterF={cryptoListItem?.community_data.twitter_followers}
                setError={setError}
              />
            </div>
          )}
        </CryptoContext.Provider>
      )}
    </>
  );
};

export default Home;
