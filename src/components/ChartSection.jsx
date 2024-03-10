import React, { useContext, useEffect, useState } from "react";
import { CryptoContext } from "../Context";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { TimeChart } from "../configs/api";

const ChartSection = ({
  priceChange24,
  marketCap,
  totVol,
  circulating,
  twitterF,
  setError,
}) => {
  const { cryptoId, currencySymbol, currency } = useContext(CryptoContext);
  const [days, setDays] = useState(1);
  const [coindPrices, setCoindPrices] = useState([]);

  const getChartData = async () => {
    try {
      const { data } = await axios.get(TimeChart(cryptoId, days, currency));
      setCoindPrices(data.prices);
    } catch (error) {
      console.error(error.message);
      setError({ hasError: true, errorMessage: error.message });
    }
  };

  useEffect(() => {
    getChartData();
  }, [cryptoId, currency, days]);

  return (
    coindPrices?.length > 0 && (
      <div className="chart__section-container section">
        <div className="chart__section">
          <Line
            data={{
              labels: coindPrices?.map((coin) => {
                let date = new Date(coin[0]);
                let time =
                  date.getHours() > 12
                    ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                    : `${date.getHours()}:${date.getMinutes()} AM`;
                return days === 1 ? time : date.toLocaleDateString();
              }),

              datasets: [
                {
                  data: coindPrices?.map((coin) => coin[1]),
                  label: `Price ( Past ${days} Days ) in ${currency.toUpperCase()}`,
                  borderColor: "#EEBC1D",
                },
              ],
            }}
            options={{
              elements: {
                point: {
                  radius: 1,
                },
              },
            }}
          />

          <div className="days__buttons">
            {chartDays.map((day) => (
              <button
                key={day.value}
                onClick={() => {
                  setDays(day.value);
                }}
                selected={day.value === days}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        <div className="details">
          <div className="details__item">
            <p className="details__label"> Market Cap </p>
            <p className="details__value">
              {currencySymbol} {+marketCap?.toFixed(2)}
            </p>
          </div>

          <div className="details__item">
            <p className="details__label"> Price Change 24hrs </p>
            <p className="details__value">
              {currencySymbol} {+priceChange24?.toFixed(2)}
            </p>
          </div>
          <div className="details__item">
            <p className="details__label"> Total Volume </p>
            <p className="details__value">
              {currencySymbol} {+totVol?.toFixed(2)}
            </p>
          </div>
          <div className="details__item ">
            <p className="details__label"> Circulating Supply</p>
            <p className="details__value">{+circulating?.toFixed(2)}</p>
          </div>
          <div className="details__item ">
            <p className="details__label"> Twitter Followers</p>
            <p className="details__value">{+twitterF?.toFixed(2)}</p>
          </div>
        </div>
      </div>
    )
  );
};

export default ChartSection;

const chartDays = [
  {
    label: "24 Hours",
    value: 1,
  },
  {
    label: "30 Days",
    value: 30,
  },
  {
    label: "3 Months",
    value: 90,
  },
  {
    label: "1 Year",
    value: 365,
  },
];
