import Web3 from 'web3';

// Initialize Web3 with Infura endpoint for Sepolia
const web3 = new Web3('https://sepolia.infura.io/v3/6dc321e76263460ba74cea9d38c50bf7');

document.addEventListener('DOMContentLoaded', function() {
    const coin = document.getElementById('coin');
    const flipBtn = document.getElementById('flip');
    const headsBtn = document.getElementById('heads');
    const tailsBtn = document.getElementById('tails');
    const resultDiv = document.getElementById('result');
    
    let selectedSide = null; // 'heads' or 'tails'
    let account = null;

    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        
        // Request MetaMask accounts
        window.ethereum.request({ method: 'eth_requestAccounts' }).then(async () => {
            account = (await web3.eth.getAccounts())[0];
            console.log('Connected account:', account);

            const contractAddress = '0xa0EafC7A0661d43a98aa75bed173731AF3173425';
            const abi = [
                // ABI of the CoinFlip contract
                {
                    "inputs": [],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "stateMutability": "payable",
                    "type": "fallback",
                    "payable": true
                },
                {
                    "inputs": [],
                    "name": "owner",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function",
                    "constant": true
                },
                {
                    "stateMutability": "payable",
                    "type": "receive",
                    "payable": true
                },
                {
                    "inputs": [
                        {
                            "internalType": "bool",
                            "name": "_guess",
                            "type": "bool"
                        }
                    ],
                    "name": "flipCoin",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "payable",
                    "type": "function",
                    "payable": true
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "player",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "bool",
                            "name": "guess",
                            "type": "bool"
                        },
                        {
                            "indexed": false,
                            "internalType": "bool",
                            "name": "result",
                            "type": "bool"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "CoinFlipped",
                    "type": "event"
                }
            ];

            const coinFlipContract = new web3.eth.Contract(abi, contractAddress);

            // Button Event Handlers
            headsBtn.addEventListener('click', function() {
                selectedSide = 'heads';
                
        headsBtn.style.backgroundColor = '#0056b3';
        tailsBtn.style.backgroundColor = '#007bff';

                headsBtn.classList.add('active');
                tailsBtn.classList.remove('active');
            });

            tailsBtn.addEventListener('click', function() {
                selectedSide = 'tails';
                tailsBtn.style.backgroundColor = '#0056b3';
                headsBtn.style.backgroundColor = '#007bff';
                tailsBtn.classList.add('active');
                headsBtn.classList.remove('active');
            });

            flipBtn.addEventListener('click', async function() {
                if (selectedSide === null) {
                    resultDiv.textContent = 'Please select heads or tails!';
                    resultDiv.style.color = 'orange';
                    return;
                }
                
                if (!account) {
                    resultDiv.textContent = 'Please connect your MetaMask wallet.';
                    resultDiv.style.color = 'red';
                    return;
                }

                const betAmount = web3.utils.toWei('0.01', 'ether'); // 0.01 ETH bet
                resultDiv.textContent = 'Processing...';
                resultDiv.style.color = 'blue';

                // Simulate coin flip animation
                const randomNum = Math.random();
                const outcome = randomNum < 0.5 ? 'heads' : 'tails';
                const fullRotation = outcome === 'heads' ? 0 : 180; 
                const spins = Math.floor(Math.random() * 4) + 3; // Random spins between 3 and 6
                const finalRotation = fullRotation + spins * 360;

                coin.style.transition = 'transform 3s';
                coin.style.transform = `rotateY(${finalRotation}deg)`;

                setTimeout(async function() {
                    try {
                        const receipt = await coinFlipContract.methods.flipCoin(selectedSide === 'heads').send({
                            from: account,
                            value: betAmount,
                            gas: 500000 // Adjust gas if needed
                        });

                        // Handle the event emitted by the contract
                        const event = receipt.events.CoinFlipped;
                        if (event) {
                            const win = event.returnValues.result;
                            resultDiv.textContent = `Transaction successful! You ${win ? 'won' : 'lost'}! Transaction Hash: ${receipt.transactionHash}`;
                            resultDiv.style.color = win ? 'green' : 'red';
                        } else {
                            resultDiv.textContent = `Transaction successful! Transaction Hash: ${receipt.transactionHash}`;
                            resultDiv.style.color = 'blue';
                        }
                    } catch (error) {
                        console.error("Transaction error:", error);
                        resultDiv.textContent = 'Transaction failed!';
                        resultDiv.style.color = 'red';
                    }
                }, 3000); // Match the coin flip animation duration
            });
        }).catch(error => {
            console.error("User rejected the request or an error occurred:", error);
            alert('Please allow access to MetaMask to use this dApp!');
        });
    } else {
        alert('MetaMask is not installed. Please install MetaMask to use this dApp!');
    }
});
