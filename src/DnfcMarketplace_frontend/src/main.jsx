import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import { Principal } from "@dfinity/principal";

// const CURRENT_USER_ID = Principal.fromText("2vxsx-fae");
// export default CURRENT_USER_ID;

const init = async () => {
  const root = ReactDOM.createRoot(document.getElementById("root")); // Use createRoot here
  root.render(<App />); // Use root.render instead of ReactDOM.render
};

init();
