import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { idlFactory as tokenIdlFactory } from "../../../declarations/Dtoken_backend";
import { Principal } from "@dfinity/principal";
import Button from "./Button";
import { DnfcMarketplace_backend } from "../../../declarations/DnfcMarketplace_backend";
import CURRENT_USER_ID from "../main";
import PriceLabel from "./PriceLabel";


function Item(props) {

  const [name, setName] = useState();
  const [ownerID, setOwnerID] = useState();
  const [image, setimage] = useState()
  const [button, setButton] = useState()
  const [inputPrice, setInputPrice] = useState()
  const [loaderHidden, setLoaderHidden] = useState(true)
  const [blurImg, setblurImg] = useState()
  const [sellStatus, setSellStatus] = useState()
  const [sellPrice, setsellPrice] = useState();
  const [shouldDisplay, setShouldDisplay] = useState(true)

  const id = props.id
  // now in order to use nft canister we have to use http to fetch the caninster in the icp blockchain (in case the app was live in blockchain)
  // to work locally we fetch it in local dfx

  const localhost = "http://127.0.0.1:3000/";

  // httpAgent helps to run http requests in order to get hold of canisters
  const agent = new HttpAgent({ host: localhost })
  // so we are creating a http agent that makes requests using host
  // as the mehods inside nft canister is async, so we create a funciton which fetches them asynchronously

  let NFTActor;

  async function loadNft() {
    // remove the fetchRootKey function if you are not using the local dfx
    await agent.fetchRootKey();

    // now we create a actor with 
    // IdlFactory (Interface description Language) (and what it basically does is it gives our frontend a translated version of our Motoko backend so that our JavaScript will know which method can be called in our NFT canister. )
    // this idlFactory is present in nft.did.js in declarations
    // then we pass the agent and the canister id
    NFTActor = await Actor.createActor(idlFactory, {
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

    const isListeedResult = await DnfcMarketplace_backend.isListed(props.id);

    if (props.role == "collection") {

      if (isListeedResult) {
        setblurImg({ filter: "blur(5px)" })
        setOwnerID("Nft Marketplace")
        setSellStatus("Listed")

      }
      else {

        setButton(<Button handleClick={handleSell} text="Sell" />)
      }
    } else if (props.role == "discover") {
      //now we are not allowing the user who sold the nft to buy it again
      // so we need to perform the check again
      const originalOwner = await DnfcMarketplace_backend.getOriginalOwnerOfNft(props.id)
      // console.log("Original Owner Id",originalOwner.toText())
      // console.log("Current User Id",CURRENT_USER_ID.toText())
      const nftprice = await DnfcMarketplace_backend.getNftListedPrice(props.id);
      setsellPrice(<PriceLabel pricetToSell={nftprice.toString()} />)
      if (originalOwner.toText() != CURRENT_USER_ID.toText()) {
        // if the original owner is not the current user then we can allow the user to buy the nft


        setButton(<Button handleClick={handleBuy} text="Buy" />)



      }


    }



  }

  // this is the function that i am sending through props
  let price;
  function handleSell(params) {
    setInputPrice(
      <input
        placeholder="Price in DANG"
        type="number"
        className="price-input"
        value={price}
        onChange={e => {
          price = e.target.value;
          //normally we would use another usestate for price, but we are using this way to avoid re-rendering
          //When using useState, changes to the state are not immediately reflected in 
          //the next line of code. This might cause issues if the updated price is needed right after the change, especially in asynchronous workflows (like API calls).
        }}
      />
    )
    //once the button is clicked we will change the button to confirm button, and also we will change the handleclick function
    setButton(<Button handleClick={sellItem} text="Confirm" />)
  }

  async function sellItem(params) {
    setblurImg({ filter: "blur(5px)" })
    setLoaderHidden(false)
    // console.log("confirm button clicked")
    // now as we will use this funciton in the backend, that's why async
    const listingResult = await DnfcMarketplace_backend.NftListings(props.id, Number(price))
    // console.log("Listing" + listingResult)
    //now we want to create a hash map of price and the owner id of the nft
    // then we can use that hashmap to list the nfts in the discover page

    // now we want to transfer the ownership of the nft to the marketplace
    //so that the market place can sell it
    // as it is individual nft's we are going to create a function in the nft canister

    if (listingResult == "Sucess") {
      // if the listing result is sucess then we transfer the ownership to the marketplace
      // for that we are going to call the transferOwnership function in the nft canister itself
      // we have accessed the nft canister through agent in loadnft functin
      const IdOfMarketplace = await DnfcMarketplace_backend.getDnfcMarketplaceId()
      const transferResult = await NFTActor.transferOwnership(IdOfMarketplace)
      // console.log("Transfer Result" + transferResult)
      if (transferResult == "success") {
        setInputPrice();
        setButton();
        setOwnerID("Nft Marketplace")
        setSellStatus("Listed")
        setLoaderHidden(true)

      }

    }


  }

  async function handleBuy(params) {
    setLoaderHidden(false)
    console.log("Buy button clicked");

    // now we are creating a actor with the idlFactory of Dtoken (Gta 6 project)
    // we deployed the Dtoken project and we will ne using its transfer funciton to transfer the 
    // GTA6 tokens to the seller from buyer's account
    //This way we learn how to talk to dofferent canisters in the blockchain
    const tokenActor = await Actor.createActor(tokenIdlFactory, {
      agent,
      canisterId: Principal.fromText("b77ix-eeaaa-aaaaa-qaada-cai"),
      // the id is of the Dtoken_backend canister
    });

    // first lets get the seller's original id

    const sellerId = await DnfcMarketplace_backend.getOriginalOwnerOfNft(props.id)
    const itemPrice = await DnfcMarketplace_backend.getNftListedPrice(props.id)

    //now lets use the tokenActor's transfer function

    const result = await tokenActor.transfer(sellerId, itemPrice);
    // once the amount is transferred, we need to transfer the ownership
    if (result == "SUCCESS") {
      const resultOfTransferOwnership = await DnfcMarketplace_backend.completePurchase(props.id, sellerId, CURRENT_USER_ID)
      console.log("Purchase " + resultOfTransferOwnership)
      setLoaderHidden(true)
      setShouldDisplay(false);
    }
    else {
      console.log("Insufficient Balance")
      setLoaderHidden(true)
    }

  }

  useEffect(() => {
    // now we need to call this loadNft actor only once, so we use this useEffct
    loadNft()
  }, [])


  return (
    <div style={{ display: shouldDisplay ? "inline" : "none" }} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blurImg}
        />
        <div className="lds-ellipsis" hidden={loaderHidden}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          {sellPrice}

          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> -{sellStatus}</span>
          </h2>

          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {ownerID}
          </p>
          {inputPrice}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
