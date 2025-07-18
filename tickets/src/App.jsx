import React from "react";
import TicketList from "./components/TicketList";
import NewTicketForm from "./components/NewTicketForm";
import { useSelector } from "react-redux";
import AdminTicketsPage from "./components/AdminTicketsPage";

const App = () => {
  const token = useSelector((state) => state.auth?.token);
  const page = useSelector((state) => state.auth?.page);
  
  console.log("Using token from Redux store:", token);

  return (
     <div>
      {page === 'my-requests' ? (
        <div style={{ marginBottom: "20px" }}>
          <TicketList token={token} />
        </div>
      ) : page === 'new-ticket' ? (
        <div style={{ marginTop: "40px" }}>
          <NewTicketForm token={token} />
        </div>
      ) : (
        <AdminTicketsPage token={token} />
      )}
    </div>
  );
};

export default App;
