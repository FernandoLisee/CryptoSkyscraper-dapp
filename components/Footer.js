const Footer = () => {
    return (
        <footer className="bg-light text-center text-lg-start">
            <div className="container p-4">
                <div className="row">
                    <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
                        <h5 className="text-uppercase">CryptoSkyscraper</h5>
                        <p>
                            Investindo em imóveis com a segurança da blockchain.
                        </p>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                        <h5 className="text-uppercase">Links</h5>

                        <ul className="list-unstyled mb-0">
                            <li>
                                <a href="#!" className="text-dark">Sobre Nós</a>
                            </li>
                            <li>
                                <a href="#!" className="text-dark">Contato</a>
                            </li>
                            <li>
                                <a href="#!" className="text-dark">Ajuda</a>
                            </li>
                        </ul>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                        <h5 className="text-uppercase">Contato</h5>

                        <ul className="list-unstyled">
                            <li>
                                <span className="text-dark">Email: contato@cryptoskyscraper.com</span>
                            </li>
                            <li>
                                <span className="text-dark">Tel: (11) 1234-5678</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                © 2023 CryptoSkyscraper
            </div>
        </footer>
    );
};

export default Footer;
