import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import NftActorClass "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";

actor nfcMarketplace {
    // as each nft will have a new, so we are using this main.mo only for
    //defining functionality of our marketplace
    // we have created a folder named NFC where we will create canisters

    public shared (msg) func mint(imageData : [Nat8], name : Text) : async (Principal) {
        //  so this is the function where the user will upload the image and the name of the image
        // this is called minting of the NFT
        // and in we are returning the principal id of the newly created canister of the NFT

        let owner : Principal = msg.caller;
        // we are taking the principal id (using the msg.caller) of the user who is calling this function

        // now lets craete a canister programatically
        Cycles.add<system>(100_500_000_000);
        Debug.print(debug_show (Cycles.balance()));
        // so to create a new nft canister, the cycle will come from the main canister and allocated to the new canister
        let newNft = await NftActorClass.NFT(name, owner, imageData);
        Debug.print(debug_show (Cycles.balance()));

        let newNftPrincipal = await newNft.getCanisterId();

        return newNftPrincipal;

        // Now creation of canisters require Cycles, it requires 500billion cycles for 1 canister to get deployed in blockChain
        // as we are creating the canister programatically, so we need to have cycles in our wallet

    }

};
