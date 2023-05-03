import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { CoinInfo, CoinPrice } from "../types";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.div`
  text-align: center;
  display: block;
  color: ${(props) => props.theme.textColor};
`;

const OverView = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
    color: rgba(255, 255, 255, 1);
  }
`;

const Description = styled.div`
  font-size: 10px;
  font-weight: 400;
  text-transform: uppercase;
  margin-bottom: 5px;
  color: rgba(255, 255, 255, 1);
  margin: 10px;
`;

interface CoinDetailInfo {
  info: CoinInfo | null;
  price: CoinPrice | null;
}

const CoinDetail = () => {
  const [loading, setLoading] = useState(true);
  const { coinId } = useParams();
  const { state } = useLocation();

  const [coin, setCoin] = useState<CoinDetailInfo>({
    info: null,
    price: null,
  });

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `https://api.coinpaprika.com/v1/coins/${coinId}`
      );
      const coinInfo = await response.json();

      const priceData = await (
        await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
      ).json();

      setCoin({
        info: coinInfo,
        price: priceData,
      });
      setLoading(false);
    })();
  }, [coinId]);

  if ([coin.info, coin.price].every((data) => data === null)) return null;

  return (
    <Container>
      <Header>
        <Title>
          {state?.name || loading ? "Loading..." : coin?.info?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <OverView>
            <OverviewItem>
              <span>Rank:</span>
              <span>{coin?.info?.rank}</span>
            </OverviewItem>
          </OverView>

          <Description>{coin?.info?.description}</Description>

          <OverView>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{coin?.price?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{coin?.price?.max_supply}</span>
            </OverviewItem>
          </OverView>
        </>
      )}
    </Container>
  );
};

export default CoinDetail;
