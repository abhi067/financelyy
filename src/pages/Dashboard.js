import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Cards from "../components/Cards/Cards";
import AddExpenseModal from "../components/Modals/AddExpenseModal";
import AddIncomeModal from "../components/Modals/AddIncomeModal";
import TransactionTable from "../components/TransactionTable/TransactionTable";
// import moment from "moment";
import { collection, addDoc, query, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { db, auth } from "../firebase";
import Chart from "../components/Charts/Chart";
import NoTransactions from "../components/NoTransaction.js";

function Dashboard() {
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [transaction, setTransaction] = useState([]);
  const [loading, setLoading] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };
  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };
  const handleExpenseModal = () => {
    setIsExpenseModalVisible(false);
  };
  const handleIncomeModal = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    console.log("On Finish", values, type);
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: values.amount,
      name: values.name,
      tag: values.tag,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(newTransaction) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        newTransaction
      );
      console.log("Document written with ID: ", docRef.id);
      let newArr = transaction;
      newArr.push(newTransaction);
      setTransaction(newArr);
      calculateBalance();
      // toast.success("Transaction added!");
    } catch (e) {
      console.log("Error adding document: ", e);
      toast.error("Couldn't add transaction!");
    }
  }

  useEffect(() => {
    // Get all Docs from a collection
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transaction]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expenseTotal = 0;

    transaction.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expenseTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  };

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      const transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data is never undefined for query doc snapshot
        transactionsArray.push(doc.data());
      });
      setTransaction(transactionsArray);
      console.log(transactionsArray);
      toast.success("Transaction fetched");
    }
    setLoading(false);
  }

  let sortedTransactions = transaction.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseModal={handleExpenseModal}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeModal={handleIncomeModal}
            onFinish={onFinish}
          />
          {transaction.length === 0 ? (
            <NoTransactions />
          ) : (
            <Chart sortedTransactions={sortedTransactions} />
          )}

          <TransactionTable
            transaction={transaction}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
