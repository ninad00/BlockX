// import { ethers } from "./ethers-6.7.esm.min.js";
// import { abi, contractAddress } from "./constants.js";

// const fetchButton = document.getElementById("fetchButton");
// fetchButton.onclick = show_tweets;


// export async function show_tweets() {
//     if (typeof window.ethereum !== "undefined") {
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         await provider.send("eth_requestAccounts", []);
//         const signer = await provider.getSigner();
//         const contract = new ethers.Contract(
//             "0xA70770d29e12DA311Ffb9832973B7fb6B90E590d",
//             abi,
//             signer // Use signer for write transactions
//         );

//         try {
//             const tweets = await contract.getAllTweets();
//             const list = document.getElementById("tweetList");
//             console.log("tweets! : ", tweets);

//             list.innerHTML = ""; // Clear previous content

//             tweets.forEach((tweet) => {
//                 const tweetObject = {
//                     id: tweet[0],
//                     content: tweet[2],
//                     ipfsHash: tweet[3],
//                     author: tweet[1],
//                     likes: Number(tweet[4]) // Ensure it's a number
//                 };

//                 const li = document.createElement("li");
//                 li.textContent = `Id: ${tweetObject.id}, Content: ${tweetObject.content}`;

//                 const likeButton = document.createElement("button");
//                 likeButton.textContent = `👍 Like (${tweetObject.likes})`;
//                 likeButton.style.marginLeft = "10px";

//                 // Attach an event listener to like the tweet
//                 likeButton.onclick = async () => {
//                     await likeTweet(contract, tweetObject.id, likeButton);
//                 };
//                 li.appendChild(likeButton);

//                 if (tweetObject.ipfsHash && tweetObject.ipfsHash != "null") {
//                     let img = document.createElement("img");
//                     img.src = tweetObject.ipfsHash;
//                     img.alt = "Tweet Image";
//                     img.style.width = "200px"; // Set image size
//                     img.style.marginTop = "10px";
//                     li.appendChild(img);
//                 }
//                 list.appendChild(li);
//             });
//         } catch (error) {
//             console.error("Error fetching tweets:", error);
//         }
//     } else {
//         alert("Please install MetaMask");
//     }
// }

// async function likeTweet(contract, tweetId, button) {
//     try {
//         const tx = await contract.likeTweet(tweetId);
//         await tx.wait(); // Wait for transaction to be mined
//         // const updatedTweet = await contract.getTweet(tweetId);
//         button.textContent = `👍 Like (${Number(updatedTweet[4])})`; // Update likes in UI
//     } catch (error) {
//         console.error("Error liking tweet:", error);
//     }
// }


import { ethers } from "./ethers-6.7.esm.min.js";
import { abi, contractAddress } from "./constants.js";

// const fetchButton = document.getElementById("fetchButton");
// fetchButton.onclick = show_tweets;


window.onload = async function show_tweets() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
            "0x59f05f90d7468B5439d24521472E43FdEDc4bb1B",
            abi,
            signer
        );

        try {
            const tweets = await contract.getAllTweets();
            const list = document.getElementById("tweetList");
            console.log("tweets! : ", tweets);

            list.innerHTML = "";

            tweets.forEach((tweet) => {
                const tweetObject = {
                    id: tweet[0],
                    content: tweet[2],
                    ipfsHash: tweet[3],
                    author: tweet[1],
                    likes: Number(tweet[4])
                };

                const li = document.createElement("li");

                // Create tweet ID element
                const idElement = document.createElement("div");
                idElement.className = "tweet-id";
                idElement.textContent = `Tweet #${tweetObject.id}`;

                // Create tweet content element
                const contentElement = document.createElement("div");
                contentElement.className = "tweet-content";
                contentElement.textContent = tweetObject.content;

                // Add elements to li
                li.appendChild(idElement);
                li.appendChild(contentElement);

                // Add image if exists
                if (tweetObject.ipfsHash && tweetObject.ipfsHash != "null") {
                    let img = document.createElement("img");
                    img.src = tweetObject.ipfsHash;
                    img.alt = "Tweet Image";
                    img.className = "tweet-image";
                    li.appendChild(img);
                }

                // Create like button
                const likeButton = document.createElement("button");
                likeButton.className = "like-button";
                likeButton.textContent = `${tweetObject.likes}`;

                // Attach like event listener
                likeButton.onclick = async () => {
                    likeButton.classList.add('liked');
                    await likeTweet(contract, tweetObject.id, likeButton);
                };

                li.appendChild(likeButton);
                list.appendChild(li);
            });
        } catch (error) {
            console.error("Error fetching tweets:", error);
        }
    } else {
        alert("Please install MetaMask");
    }
}

async function likeTweet(contract, tweetId, button) {
    try {
        const tx = await contract.likeTweet(tweetId);
        await tx.wait();
        const updatedLikes = Number(button.textContent) + 1;
        button.textContent = `${updatedLikes}`;
    } catch (error) {
        console.error("Error liking tweet:", error);
        button.classList.remove('liked');
    }
}

