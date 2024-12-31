import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { Principal } from "@dfinity/principal";

function Item(props) {

  const [name, setName] = useState();
  const [ownerID, setOwnerID] = useState();
  const [image, setimage] = useState()

  const id = props.id
  // now in order to use nft canister we have to use http to fetch the caninster in the icp blockchain (in case the app was live in blockchain)
  // to work locally we fetch it in local dfx

  const localhost = "http://127.0.0.1:3000/";

  // httpAgent helps to run http requests in order to get hold of canisters
  const agent = new HttpAgent({ host: localhost })
  // so we are creating a http agent that makes requests using host
  // as the mehods inside nft canister is async, so we create a funciton which fetches them asynchronously

  async function loadNft() {
    await agent.fetchRootKey();

    
    // now we create a actor with 
    // IdlFactory (Interface description Language) (and what it basically does is it gives our frontend a translated version of our Motoko backend so that our JavaScript will know which method can be called in our NFT canister. )
    // this idlFactory is present in nft.did.js in declarations
    // then we pass the agent and the canister id
    const NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id
    })

    const name = await NFTActor.getName();
    setName(name);

    const ownerid = await NFTActor.getOwnerName();
    setOwnerID(ownerid.toText())

    const imageData = await NFTActor.getImageData();
    // now we got the 8bit array from nft canister
    // we need to convert it so that js can understand it
    // so we use Uint8arry

    // const imageContent = new Uint8Array(imageData)
    // then we create a url using this imagecontent so that we can use it in img tag
    // this is the BLOB dataType, these are easy DataTypes that can be converted from many diffrenet formats

    const imageUrl = URL.createObjectURL(new Blob([imageData.buffer], { type: "image/png" }));
    setimage(imageUrl)


  }

  useEffect(() => {
    // now we need to call this loadNft actor only once, so we use this useEffct
    loadNft()
  }, [])


  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {ownerID}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Item;
