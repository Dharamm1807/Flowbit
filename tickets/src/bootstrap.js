import React from 'react';
import ReactDOM from 'react-dom/client';
import SupportTicketsApp from './SupportTicketsApp';
import store from "shell/store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <SupportTicketsApp />
    </React.StrictMode>
  </Provider>
);