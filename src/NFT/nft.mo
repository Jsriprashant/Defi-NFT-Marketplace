// import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Nat8 "mo:base/Nat8";

actor class NFT(name : Text, owner : Principal, content : [Nat8]) {
    // now insead of creating actor, we are going to use actor class
    // why? --> as actor class will help to create canisters programatically
    // so if people upload a image then we can create a canister programatically based on the things that people have uploaded

    // so in the input we are taking a name of the item,
    // owner's principal id, and the image data --> which is 8 bit natural number array

    //   now a nft has many properties
    let itemName = name;
    let ownerName : Principal = owner;
    let imageBytes = content;

    // so everytiem we programatically assign new canister it will have new principal Id

    // now we create funcitons gettrs so that we can get the ifromation abou that NFT

    public query func getName() : async (Text) {
        return itemName;
    };

    public query func getOwnerName() : async (Principal) {
        return ownerName;
    };
    public query func getImageData() : async ([Nat8]) {
        return imageBytes;
    };

};
