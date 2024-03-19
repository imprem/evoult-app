import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import ContractAbi from "../../UserRegistration.json";
const ethers = require("ethers");

function Signup() {
    const [values, setValues] = useState({
        name: "",
        gender: "",
        phone: "",
        email: "",
        type: "",
        password: "",
        address: "",
    });

    const navigate = useNavigate();
    const handleInput = (event) => {
        setValues((prev) => ({
            ...prev,
            [event.target.name]: [event.target.value],
        }));
    };

    useEffect(() => {
        if (window.ethereum && window.ethereum.selectedAddress) {
            const selectedAddress = window.ethereum.selectedAddress;
            console.log(`Connected to MetaMask with address: ${selectedAddress}`);
        } else {
            console.log('MetaMask is not connected');
        }
    }, []);

    async function eth_call() {
        if (typeof window.ethereum !== "undefined") {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                const address = accounts[0];
                console.log("Ethereum address:", address);
                setValues((prev) => ({ ...prev, address: address }));
            } catch (error) {
                console.error(error);
            }
        } else {
            console.error("MetaMask is not installed");
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await eth_call();

        try {
            // const contractAddress = "0xa50a51c09a5c451C52BB714527E1974b686D8e77";
            console.log("Address ", process.env.REACT_APP_USER_REGISTRATION_CONTRACT_ADDRESS);
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner(); 
                const userContract = new ethers.Contract(process.env.REACT_APP_USER_REGISTRATION_CONTRACT_ADDRESS, ContractAbi.abi, signer);
                const tx = userContract.registerUser(values.name[0]);
                console.log("User registered ", tx);

                //   Calling si
                axios
                    .post("http://localhost:3051/signup", values)
                    .then((res) => {
                        window.location.href = "/";
                    })
                    .catch((err) => {
                        Swal.fire({
                            title: "Oops...",
                            text: err.response.data.error,
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    });
            } else {
                console.error(
                    'MetaMask not found. Please install MetaMask to use this application.',
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center custom-bg-color vh-100">
            <div className="custom-bg-white p-3 rounded w-50">
                <h2 className="">SignUp</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter name"
                            name="name"
                            onChange={handleInput}
                            className="form-control rounded-0"
                            id="name"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Gender:</label>
                        <div className="d-flex align-items-center">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="gender"
                                    onChange={handleInput}
                                    id="male"
                                    value="male"
                                    defaultChecked
                                />
                                <label className="form-check-label" htmlFor="male">
                                    Male
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="gender"
                                    onChange={handleInput}
                                    id="female"
                                    value="female"
                                />
                                <label className="form-check-label" htmlFor="female">
                                    Female
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="gender"
                                    onChange={handleInput}
                                    id="other"
                                    value="other"
                                />
                                <label className="form-check-label" htmlFor="other">
                                    Other
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">
                            Phone
                        </label>
                        <input
                            type="text"
                            placeholder="Enter number"
                            name="phone"
                            onChange={handleInput}
                            className="form-control rounded-0"
                            id="phone"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            onChange={handleInput}
                            className="form-control rounded-0"
                            id="email"
                        />
                    </div>
                    {/* <div className="mb-3">
                        <label htmlFor="type" className="form-label">Type</label>
                        <select name="type" id="type" onChange={handleInput} className='form-select'>
                            <option value="admin">Admin</option>
                            <option value="client">Client</option>
                            <option value="lawyer">Lawyer</option>
                            <option value="judge">Judge</option>
                        </select>
                    </div> */}
                    <div className="mb-3">
                        <label htmlFor="type" className="form-label">
                            Type
                        </label>
                        <select
                            name="type"
                            id="type"
                            onChange={handleInput}
                            className="form-select"
                        >
                            <option value="admin">Admin</option>
                            <option value="client">Client</option>
                            <option value="lawyer">Lawyer</option>
                            <option value="judge">Judge</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            onChange={handleInput}
                            className="form-control rounded-0"
                            id="password"
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100">
                        Sign Up
                    </button>
                    <Link to="/" className="btn btn-outline-primary w-100 mt-3">
                        Log in
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Signup;