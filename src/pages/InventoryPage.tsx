import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { inventoryData } from "../data/inventoryData";

type KeywordItem = {
  product: string;
  price: string;
};

type InventoryItemWithUpdate = {
  name: string;
  price: string;
  updatedPrice?: string;
  isUpdated: boolean;
};

const Container = styled.div`
  padding: 40px;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 24px;
`;

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
`;

const Item = styled.li`
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  margin-bottom: 16px;
  background-color: #f9f9f9;
`;

const InventoryPage: React.FC = () => {
  const location = useLocation();
  const keywords: KeywordItem[] = location.state?.keywords || [];
  const navigate = useNavigate();

  console.log("🔍 전달된 키워드:", keywords);

  const updatedData: InventoryItemWithUpdate[] = inventoryData.map((item) => {
    const match = keywords.find((kw) => kw.product === item.name);
    if (match && match.price) {
      const newPrice = `${match.price}원`;
      return {
        ...item,
        updatedPrice: newPrice,
        isUpdated: newPrice !== item.price,
      };
    }
    return { ...item, isUpdated: false };
  });

  return (
    <Container>
      <Title>모든 특가 상품</Title>
      <ItemList>
        {updatedData.map((item) => (
          <Item key={item.name}>
            <strong>{item.name}</strong> -{" "}
            {item.isUpdated ? (
              <>
                <span style={{ textDecoration: "line-through" }}>{item.price}</span>{" "}
                <span style={{ color: "red" }}>{item.updatedPrice}</span>
              </>
            ) : (
              item.price
            )}
          </Item>
        ))}
      </ItemList>
      <button onClick={() => navigate("/")}> 홈으로 </button>
    </Container>
  );
};

export default InventoryPage;
