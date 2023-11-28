import Head from 'next/head'
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react'
import Web3 from 'web3'
import skyscraperContract from '@/blockchain/cryptoskyscraper'
import style from '../styles/CryptoSkyscraper.module.css'
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageCarousel from '../components/ImageCarousel';
import ImageCarousel2 from '../components/ImageCarousel2';
import { Spinner } from 'react-bootstrap';


const ApartmentStocks = () => {
    const [error, setError] = useState('');
    const [inventory, setInventory] = useState({ apt1: '', apt2: '' });
    const [myShares, setMyShares] = useState({ apt1: '', apt2: '' });
    const [buyCount, setBuyCount] = useState({ apt1: '', apt2: '' });
    const [web3, setWeb3] = useState(null);
    const [address, setAddress] = useState(null);
    const [vmContract, setVmContract] = useState(null);
    const [purchases, setPurchases] = useState(0);
    const [successMsg, setSuccessMsg] = useState('');
    const [apartments, setApartments] = useState([]);
    const [selectedApartmentId, setSelectedApartmentId] = useState('0');
    const [approvedTransaction, setApprovedTransaction] = useState('');
    const [isBuying, setIsBuying] = useState(false);
    const DIVIDEND_RATE = {
        'apt1': 0.05, // 5% para o apartamento de 0.01 ETH
        'apt2': 0.07  // 7% para o apartamento de 0.05 ETH
    };



    useEffect(() => {
        if (vmContract) {
            getInventory(0); // Apartamento 1
            getInventory(1); // Apartamento 2
            fetchApartmentDetails();
        }
        if (vmContract && address) {
            getSharesHandler(0); // Apartamento 1
            getSharesHandler(1); // Apartamento 2
        }
    }, [vmContract, address, purchases])

    const calculateDividends = (apartmentId, count) => {
        const pricePerShare = apartmentId === 0 ? 0.01 : 0.05; // Preço por cota
        const annualDividend = pricePerShare * count * DIVIDEND_RATE[apartmentId === 0 ? 'apt1' : 'apt2'];
        const monthlyDividend = annualDividend / 12;
        return monthlyDividend;
    };

    const getInventory = async (apartmentId) => {
        try {
            const response = await vmContract.methods.getApartmentStockBalance(apartmentId).call();
            setInventory(prevInventory => ({
                ...prevInventory,
                [apartmentId === 0 ? 'apt1' : 'apt2']: response.toString()
            }));
        } catch (error) {
            console.error("Error fetching inventory:", error);
            setError(error.message);
        }
    };

    const getSharesHandler = async (apartmentId) => {
        try {
            const count = await vmContract.methods.sharesBalances(address, apartmentId).call();
            setMyShares(prevShares => ({
                ...prevShares,
                [apartmentId === 0 ? 'apt1' : 'apt2']: count.toString()
            }));
        } catch (error) {
            console.error("Error fetching shares:", error);
            setError(error.message);
        }
    };

    const updateSharesQt = (apartmentId, event) => {
        const value = event.target.value;
        setBuyCount(prevCount => ({
            ...prevCount,
            [apartmentId === 0 ? 'apt1' : 'apt2']: value
        }));
    };

    const buyShares = async (apartmentId) => {
        try {
            setIsBuying(true)
            const count = parseInt(buyCount[apartmentId === 0 ? 'apt1' : 'apt2']);
            if (isNaN(count) || count <= 0) {
                throw new Error("Invalid share count");
            }

            const apartment = apartments[apartmentId];
            // Converte o preço por cota para Ether (de Wei)
            const pricePerShareInEther = web3.utils.fromWei(apartment.pricePerShare, 'ether');
            console.log("Preço por cota (Ether):", pricePerShareInEther);

            const totalCostInEther = parseFloat(pricePerShareInEther) * count;
            console.log("Custo total (Ether):", totalCostInEther);

            const totalCostInWei = web3.utils.toWei(totalCostInEther.toString(), 'ether');
            console.log("Custo total (Wei):", totalCostInWei);



            const response = await vmContract.methods.purchase(apartmentId, count).send({
                from: address,
                value: totalCostInWei
            });

            // Atualizar a quantidade total de cotas
            const totalSharesAfterPurchase = (apartmentId === 0 ? parseInt(myShares.apt1) : parseInt(myShares.apt2)) + count;

            // Calcular dividendos estimados com base no total de cotas
            const estimatedDividends = calculateDividends(apartmentId, totalSharesAfterPurchase);
            
            inputRefs[apartmentId].current.value = ''; 
            inputRefs[apartmentId].current.blur(); 

            setApprovedTransaction(response.transactionHash);
            console.log("Resposta da transação:", response);
            setPurchases(purchases => purchases + 1);

            setSuccessMsg(`Você comprou ${count} cotas! Seu dividendo estimado por mês de ${totalSharesAfterPurchase} cotas é: ${estimatedDividends.toFixed(8)} ETH`);

            setMyShares(prevShares => ({
                ...prevShares,
                [apartmentId === 0 ? 'apt1' : 'apt2']: totalSharesAfterPurchase.toString()
            }));
        } catch (err) {
            console.error("Erro na compra:", err);
            setError(err.message);
        } finally {
            setIsBuying(false); 
        }
    };

    const fetchApartmentDetails = async () => {
        try {
            const numOfApartments = 2;
            let apartmentsData = [];
            for (let i = 0; i < numOfApartments; i++) {
                const aptDetails = await vmContract.methods.apartments(i).call();
                apartmentsData.push(aptDetails);
            }
            setApartments(apartmentsData);
        } catch (error) {
            console.error("Error fetching apartment details:", error);
            setError(error.message);
        }
    };


    const restockHandler = async () => {
        const amount = 2;
        const aptId = parseInt(selectedApartmentId);
        try {
            await vmContract.methods.restock(aptId, amount).send({
                from: address,
            });
        } catch (err) {
            setError(err.message);
        }
    };


    const connectWalletHandler = async () => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);
                const accounts = await web3Instance.eth.getAccounts();
                setAddress(accounts[0]);
                const vm = skyscraperContract(web3Instance);
                setVmContract(vm);
            } catch (err) {
                setError(err.message);
            }
        } else {
            setError("Please install MetaMask");
        }
    };

    const selectApartment = (event) => {
        setSelectedApartmentId(event.target.value);
    };

    const inputRefs = [useRef(null), useRef(null)];

    return (
        <div className={style.main}>
            <Head>
                <title>CryptoSkyscraper</title>
                <meta name="description" content="Blockchain" />
            </Head>

            <Navbar address={address} connectWalletHandler={connectWalletHandler} />

            <div className={`text-center ${style.apartmentHeader}`}>
                <h2>Apartamentos com cotas disponíveis!</h2>
            </div>

            <section className={style.section}>
                <div className="container">
                    <div className="row justify-content-center">
                        {/* Coluna para o Apartamento 1 */}

                        <div className="col-md-6" >
                            <p className={style.centeredContent}>Cotas Disponíves: {inventory.apt1} </p>
                            <ImageCarousel />
                            <div className={style.centeredContent}>
                                <h1 className="title is-4 mt-4">Life Highground</h1>

                                <h3 className='mb-5 mt-2'>Valor: 0.01 ETH </h3>
                                <h1 className='mb-5 mt-2'>Minhas Cotas: {myShares.apt1}</h1>
                                <input
                                    ref={inputRefs[0]} // Adicione a ref aqui
                                    className="form-control w-auto"
                                    type="number"
                                    placeholder="Quantidade de cotas"
                                    onChange={(e) => updateSharesQt(0, e)}
                                />
                                <button className={`btn btn-primary ${style.buyButton}`} onClick={() => buyShares(0)} disabled={isBuying}>
                                    {isBuying ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                            <span className="ms-2">Comprando...</span>
                                        </>
                                    ) : (
                                        "Comprar Cotas"
                                    )}</button>
                            </div>
                        </div>

                        {/* Coluna para o Apartamento 2 */}
                        <div className="col-md-6">
                            <p className={style.centeredContent}>Cotas Disponíves: {inventory.apt2}</p>
                            <ImageCarousel2 />
                            <div className={style.centeredContent}>
                                <h1 className="title is-4 mt-4">Millenium Palace</h1>
                                <h4 className='mb-5 mt-1'>Valor: 0.05 ETH </h4>
                                <h1 className='mb-5 mt-2'>Minhas Cotas: {myShares.apt2}</h1>
                                <input
                                    ref={inputRefs[1]}
                                    className="form-control w-auto"
                                    type="number"
                                    placeholder="Quantidade de cotas"
                                    onChange={(e) => updateSharesQt(1, e)}
                                />
                                <button className={`btn btn-primary ${style.buyButton}`} onClick={() => buyShares(1)} disabled={isBuying}>
                                    {isBuying ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                            <span className="ms-2">Comprando...</span>
                                        </>
                                    ) : (
                                        "Comprar Cotas"
                                    )}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="container">
                    <div className="content">
                        <p className="has-text-centered">
                            {successMsg && (
                                <span className={style.successMessage}>
                                    {successMsg}
                                </span>
                            )}

                        </p>
                        {approvedTransaction && (
                            <p className={style.transactionInfo}>
                                Tx: {approvedTransaction}
                            </p>
                        )}
                        <p>{error}</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ApartmentStocks;