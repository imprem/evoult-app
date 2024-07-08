import React from "react";
import { Link } from "react-router-dom";
import ashoka from '../../asset/ashoka.png';
import './Navbar.css';

const Navbar = () => {
    return(
        <nav className="navbar navbar-expand-xl navbar-light custom-nv-bg-color">
            <div className="container">
                <Link className="navbar-brand" to='/home'>
                    <img src={ashoka} width='70px' />
                </Link>
                {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button> */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item nav-text">
                            <Link className="nav-link" to='/home'>Home</Link>
                        </li>
                        <li className="nav-item nav-text">
                            {/* <Link className="nav-link" to='/fomo'>Fomo</Link> */}
                        </li>
                        <li className="nav-item nav-text">
                            {/* <Link className="nav-link" to='/Lomo'>Lomo</Link> */}
                        </li>
                        <li className="nav-item nav-text">
                            <Link className="nav-link" to='/casedtails'>CaseDetails</Link>
                        </li>
                        <li className="nav-item nav-text logout-btna">
                            <Link className="nav-link logout-btn" to='/'>Logout</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;