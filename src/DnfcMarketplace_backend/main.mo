import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import NftActorClass "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Bool "mo:base/Bool";

actor nfcMarketplace {

    private type Listing = {
        itemOwner : Principal;
        itemPrice : Nat;

    };

    // as each nft will have a new, so we are using this main.mo only for
    //defining functionality of our marketplace
    // we have created a folder named NFC where we will create canisters

    // Now in the frontEnd we have to show the list of all the NFT's that a user owns
    // so for that we need to have a Hashmaps which keeps the track of which NFT's were minted and who their wners are
    var mapOfNfts = HashMap.HashMap<Principal, NftActorClass.NFT>(1, Principal.equal, Principal.hash);
    // this hashmap has the principal id of the nft canister and the canister itself
    // suppose a user mints a nft then the principal id of the nft canister and the canister itself will be stored in this hashmap

    // now we will create a hasmap for owners

    var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
    // this hashmap has the principal id of the owner and the List of principal id of the newly created nft canisters
    // as a user can have multiple nft's so we are using List.

    var mapOfNftsForSale = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);
    //this hashmap has teh principal id of the nft canister as key that is for sale, and as value we need to store a bunch of things like price , owner of the nft , whan it was sold, etc, so we create a custom Dt for it

    // so the user will upload the image, then set the price, and in the backend a new canister will be created
    // then we are creating a hashmap with the principal id of the nft canister for hich price has been set and with user principal id and price

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

        mapOfNfts.put(newNftPrincipal, newNft);
        addToOwnershipMap(owner, newNftPrincipal);
        return newNftPrincipal;

        // Now creation of canisters require Cycles, it requires 500billion cycles for 1 canister to get deployed in blockChain
        // as we are creating the canister programatically, so we need to have cycles in our wallet

    };

    private func addToOwnershipMap(owner : Principal, nftPrincipalId : Principal) {
        // var ownedNfts : List.List<Principal> = mapOfOwners.get(owner);
        // what so first we are finding the owner in the mapOfOwners hashmap, and as output we should get a list
        // but what if it is a new owner who just minted their first NFT, in that case we will not have any list
        // so we will get null as output from map.owners.get

        // and also we know that .get function returs a optional type result so we handle it using switch

        var ownedNfts : List.List<Principal> = switch (mapOfOwners.get(owner)) {
            // so 2 cases are possible
            //1st the owner is new and the .get funciton retunrs null, in this case we will create a empty list using list.nil and return it
            case null List.nil<Principal>();
            // 2nd case is that the list is present in the hashmap, so we optionally unwrap it and return it
            case (?result) result;

            // so ownedNfts variable will have either an empty list or the list of principal id of the nft canisters
        };

        // now we add the principal id of the canister that is passed in this funciton to the ownedNfts list
        ownedNfts := List.push(nftPrincipalId, ownedNfts);
        //  so we push using list.push we push the nftPrincipalId to the ownedNfts list
        // and then we again reinitialise the owned nft list using :=

        // now we update the hashmap
        mapOfOwners.put(owner, ownedNfts);

    };

    public query func getListOfNfts(user : Principal) : async ([Principal]) {
        //  now to show the owned nfts in the front end we have to send the array of nfts to the front end
        var userNfts : List.List<Principal> = switch (mapOfOwners.get(user)) {
            // so 2 cases are possible
            //1st the owner is new and the .get funciton retunrs null, in this case we will create a empty list using list.nil and return it
            case null List.nil<Principal>();
            // 2nd case is that the list is present in the hashmap, so we optionally unwrap it and return it
            case (?result) result;

            // so ownedNfts variable will have either an empty list or the list of principal id of the nft canisters
        };
        return List.toArray(userNfts);
    };

    public shared (msg) func NftListings(id : Principal, price : Nat) : async Text {
        // first lets find the nft in the map of nf hashmap using the id passed in the function
        var item : NftActorClass.NFT = switch (mapOfNfts.get(id)) {
            case null return "Nft not found";
            case (?result) result;
        };

        // now we need to check if the owner of the mft(through msg.caller) is same as the owner of the nft
        // as we dont want others to list anybodyelse's nft

        let owner = await item.getOwnerName();

        if (Principal.equal(owner, msg.caller)) {
            // if the owner of the nft is same as the caller of the function then we can list the nft
            let newListingOfSale = {
                itemOwner = owner;
                itemPrice = price;
            };

            mapOfNftsForSale.put(id, newListingOfSale);

            return "Sucess";
        } else {
            return "You are not the owner of this NFT";
        };

    };

    public query func getDnfcMarketplaceId() : async (Principal) {
        return Principal.fromActor(nfcMarketplace);
    };
    public query func isListed(id : Principal) : async (Bool) {
        if (mapOfNftsForSale.get(id) == null) {
            return false;
        } else {
            return true;
        };
    };

};
