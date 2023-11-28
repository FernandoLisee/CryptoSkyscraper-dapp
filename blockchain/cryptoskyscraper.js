// import Web3 from 'web3'

const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"apartments","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"totalShares","type":"uint256"},{"internalType":"uint256","name":"availableShares","type":"uint256"},{"internalType":"uint256","name":"pricePerShare","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"apartmentId","type":"uint256"}],"name":"getApartmentStockBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"apartmentId","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"purchase","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"apartmentId","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"restock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"sharesBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

const apartmentStockContract = web3 => {
    return new web3.eth.Contract(
        abi,
         "0x174048aB214aE96399Cb0D8cbDEeD916658a327b"
         )
}

export default apartmentStockContract