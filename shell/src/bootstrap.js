import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import store from "./store/store";
import Main from './Main';


function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading Tickets App...</div>}>
        <Main/>
      </Suspense>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
