import Link from 'next/link';
import styles from '@/styles/Navbar.module.css'

const Navbar = ({ address, connectWalletHandler }) => {
    return (
        <nav className={`navbar navbar-expand-lg ${styles.bgCustomColor}`}>
            <div className="container-fluid d-flex justify-content-between">
                {/* Agrupando Logo e Título */}
                <div className="d-flex align-items-center">
                    <Link href="/" className="navbar-brand">
                        <img src="/crypto-skyscaper-logo.png" alt="Logo" style={{ height: '40px' }} />
                    </Link>
                    <h1 className="mb-0 ms-2">CryptoSkyscraper</h1>

                    
                </div>
                
                {/* Botão Connect Wallet */}
                <div className="ms-auto">
                
                    <button onClick={connectWalletHandler} className={`btn btn-primary ${styles.connectwallet}`}>
                        {address ? (
                            <>
                                <img src="/metamask.png" alt="MetaMask" style={{ width: '30px', marginRight: '15px' }} />
                                {`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
                            </>
                        ) : (
                            <>
                                <img src="/metamask.png" alt="MetaMask" style={{ width: '30px', marginRight: '15px' }} />
                                Connect Wallet
                            </>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
