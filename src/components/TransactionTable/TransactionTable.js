import React, { useState } from "react";
import { Button, Flex, Input, Radio, Select, Table } from "antd";
import "./TransactionTable.css";
import searchIcon from "../../assets/search.svg";
import { parse, unparse, parseFLoat } from "papaparse";
import { toast } from "react-toastify";

function TransactionTable({ transaction, addTransaction, fetchTransactions }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  let filteredTransaction = transaction.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      item.type.includes(typeFilter)
  );

  let sortedTransactions = filteredTransaction.sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return;
    }
  });

  function exportToCSV() {
    var csv = unparse({
      fields: ["name", "type", "tag", "date", "amount"],
      data: transaction,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transaction.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function importFromCSV(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (result) {
          console.log("RESULT>>>", result);
          for (const transaction of result.data) {
            console.log("Transactions", transaction);
            const newTransaction = {
              ...transaction,
              amount: parseFLoat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All transaction Added!");
      fetchTransactions();
      event.target.files = null;
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <>
      <div className="search-bar">
        <img style={{ width: "1rem", height: "1rem" }} src={searchIcon} />
        <Input
          value={search}
          className="input"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Name"
        />
        <Select
          className="custom-input-2"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          allowClear
        >
          <Select.Option value="">All</Select.Option>
          <Select.Option value="income">Income</Select.Option>
          <Select.Option value="expense">Expense</Select.Option>
        </Select>
      </div>
      <div className="sort-bar">
        <h3
          style={{
            padding: "0 0.5rem",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
          }}
        >
          My Transaction
        </h3>
        <Radio.Group
          className="input-radio"
          onChange={(e) => setSortKey(e.target.value)}
          value={sortKey}
        >
          <Radio.Button value="">All</Radio.Button>
          <Radio.Button value="amount">Amount</Radio.Button>
          <Radio.Button value="date">Date</Radio.Button>
        </Radio.Group>
        <Flex gap="small" wrap="wrap">
          <Button onClick={exportToCSV}>Export To CSV</Button>
          <Button onClick={importFromCSV} type="primary">
            Import From CSV
          </Button>
        </Flex>
      </div>
      <div className="table-1">
        <Table
          dataSource={sortedTransactions}
          columns={columns}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30"],
          }}
        />
      </div>
      ;
    </>
  );
}

export default TransactionTable;
