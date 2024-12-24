import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import homeImage from "./assets/home-img.png";
import Item from "./components/Item";
import Minter from "./components/Minter";

function App() {
  // const NFTID = "bw4dl-smaaa-aaaaa-qaacq-cai";

  return (
    <div className="App">
      <Header />

      <Minter />

      {/* <Item id={NFTID} /> */}
      {/* we need to pass the id of teh nft canister also so we fetched the id and pass to this item component as props */}
      {/* just crated this for testing */}
      {/* </Item> */}

      {/* <img className="bottom-space" src={homeImage} /> */}
      <Footer />
    </div>
  );
}

export default App;



// import { useState } from 'react';
// import { DnfcMarketplace_backend } from 'declarations/DnfcMarketplace_backend';

// function App() {
//   const [greeting, setGreeting] = useState('');

//   function handleSubmit(event) {
//     event.preventDefault();
//     const name = event.target.elements.name.value;
//     DnfcMarketplace_backend.greet(name).then((greeting) => {
//       setGreeting(greeting);
//     });
//     return false;
//   }

//   return (
//     <main>
//       <img src="/logo2.svg" alt="DFINITY logo" />
//       <br />
//       <br />
//       <form action="#" onSubmit={handleSubmit}>
//         <label htmlFor="name">Enter your name: &nbsp;</label>
//         <input id="name" alt="Name" type="text" />
//         <button type="submit">Click Me!</button>
//       </form>
//       <section id="greeting">{greeting}</section>
//     </main>
//   );
// }

// export default App;
