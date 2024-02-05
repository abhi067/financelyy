import React from "react";
import { Card, Row } from "antd";
import Button from "../Button/Button";
import "./Cards.css";

function Cards({
  income,
  expense,
  totalBalance,
  showExpenseModal,
  showIncomeModal,
}) {
  return (
    <div>
      <Row className="my-row">
        <Card className="my-card">
          <h2>Current Balance</h2>
          <p>$ {totalBalance}</p>
          <Button blue={true} text={"Reset Balance"} />
        </Card>

        <Card className="my-card">
          <h2>Total Income</h2>
          <p>$ {income}</p>
          <Button blue={true} text={"Add Income"} onClick={showIncomeModal} />
        </Card>

        <Card className="my-card">
          <h2>Total Expense</h2>
          <p>$ {expense}</p>
          <Button blue={true} text={"Add Expense"} onClick={showExpenseModal} />
        </Card>
      </Row>
    </div>
  );
}

export default Cards;
