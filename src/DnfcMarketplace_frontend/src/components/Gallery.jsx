// import React, { useState, useEffect } from "react";
// import Item from "./Item";
// import { Principal } from "@dfinity/principal";

// function Gallery(props) {

//   // const [items, setItems] = useState()

//   // function fetchNfts() {
//   //   if (props.ids != undefined) {
//   //     setItems(props.ids.map((nftId) => (
//   //       <Item id={nftId} key={nftId.toText()} />
//   //     )))
//   //   }
//   // }

//   // useEffect(() => {
//   //   fetchNfts()
//   // }, [])


//   return (
//     <div className="gallery-view">
//       <h3 className="makeStyles-title-99 Typography-h3">Discover</h3>
//       <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
//         <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
//           <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
//             {
//               props.ids.map((nftId) => (
//                 <Item id={nftId} key={nftId.toText()}></Item>
//               ))
//             }

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Gallery;
import React from "react";
import Item from "./Item";

function Gallery(props) {
  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">Discover</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
            {props.ids && props.ids.length > 0 ? (
              props.ids.map((nftId) => (
                <Item id={nftId} key={nftId.toText()} role={props.role} />
              ))
            ) : (
              <h4>No NFTs to display!</h4>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
