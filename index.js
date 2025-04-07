import { ethers } from "./ethers-6.7.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connect");
const postForm = document.getElementById("postForm");

const PINATA_API_KEY = "312b87502a022395f378";
const PINATA_SECRET_API_KEY = "dbfe88ec65561baf553cd61c8d85b14d07ab4498f41c59bb05cfbc7c3f304575";

connectButton.onclick = connect;
postForm.addEventListener("submit", post);

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" });
        } catch (error) {
            console.log(error);
        }
        console.log("connected");
        const accounts = await ethereum.request({ method: "eth_accounts" });
        console.log(accounts);
        if (accounts.length > 0) {
            connectButton.textContent = "Connected";
        }
    } else {
        console.log("Please install MetaMask");
    }
}

async function upload_to_ipfs(imageFile) {

    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "pinata_api_key": PINATA_API_KEY,
                "pinata_secret_api_key": PINATA_SECRET_API_KEY
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const link = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
        // console.log(data);
        return link;
    } catch (error) {
        console.error("Error uploading to IPFS:", error);
        return null;
    }
}

async function post(event) {
    event.preventDefault();

    let posttext = document.getElementById("postText").value;
    let imageInput = document.getElementById("imageinput");
    let imageFile = imageInput.files.length > 0 ? imageInput.files[0] : null;

    if (!posttext.trim() && !imageFile) {
        alert("Please enter text or select an image!");
        return;
    }

    console.log("Post Text:", posttext);
    // if (imageFile) {

    //     console.log("Image File:", imageFile.name);
    // } else {
    //     console.log("No Image Selected");
    // }

    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log(provider)
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        console.log(signer)
        const contract = new ethers.Contract("0x59f05f90d7468B5439d24521472E43FdEDc4bb1B", abi, signer);
        let ipfslink;

        if (imageFile) {
            ipfslink = await upload_to_ipfs(imageFile);
        } else {
            ipfslink = 'null';
        }

        console.log(ipfslink);


        const dataObject = {
            _tweet: posttext,
            _ipfsHash: ipfslink
        };
        await contract.createTweet(dataObject._tweet, dataObject._ipfsHash);
    } else {
        alert("Please install MetaMask");
    }



}