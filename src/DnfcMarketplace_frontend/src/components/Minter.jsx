import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DnfcMarketplace_backend } from "../../../declarations/DnfcMarketplace_backend";
import { Principal } from "@dfinity/principal";
import Item from "./Item";

function Minter() {

  // Now so that people can mint NFTs, we need to create a form that allows them to upload an image and specify a collection name.
  // We are not going to use State Management or useState for this
  // we are going to use React Hook Form for This

  const { register, handleSubmit } = useForm(); // intialize the useForm hook with empty fields.
  // register is a function that registers input fields to the form. 
  // It is used to collect the data from the input fields.
  // handleSubmit is a function that is used to submit the form data.

  const [nftPrincipal, setNftPrincipal] = useState("")

  async function onSubmit(data) {
    const name = data.name;
    const image = data.image[0];

    const imageArray = await image.arrayBuffer();
    // The arrayBuffer() method is used to read the contents of the specified Blob or File.
    // so arrayBuffer() converts the image into an array of bytes
    const imageByteData = [...new Uint8Array(imageArray)];

    // now we call the mint funcitoon from backend
    const newNftId = await DnfcMarketplace_backend.mint(imageByteData, name)
    setNftPrincipal(newNftId.toText())
    console.log(newNftId.toText())

  }

  if (nftPrincipal === "") {

    return (
      <div className="minter-container">
        <h3 className="makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Create NFT
        </h3>
        <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
          Upload Image
        </h6>
        <form className="makeStyles-form-109" noValidate="" autoComplete="off">
          <div className="upload-container">
            <input
              {...register("image", { required: true })}
              className="upload"
              type="file"
              accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
            />
          </div>
          <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
            Collection Name
          </h6>
          <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
            <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
              <input
                {...register("name", { required: true })}
                // a object is created with name and teh value of the name is the name of the input field
                // register the input field with the name attribute
                // required: true means that the input field is required
                placeholder="e.g. CryptoDunks"
                type="text"
                className="form-InputBase-input form-OutlinedInput-input"
              />
              <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
            </div>
          </div>
          <div className="form-ButtonBase-root form-Chip-root makeStyles-chipBlue-108 form-Chip-clickable">
            <span onClick={handleSubmit(onSubmit)} className="form-Chip-label">Mint NFT</span>
            {/* So we pass the Data that we got from register to handlesubmit and then handlesublit executes the onsublit function with the passed Data */}
          </div>
        </form>
      </div>
    );
  } else {
    return (
      <div className="minter-container">
        <h3 className="Typography-root makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Minted!
        </h3>
        <div className="horizontal-center">
          <Item id={nftPrincipal} />
        </div>
      </div>
    )
  }
}

export default Minter;
