import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Web3 from 'web3';
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
        address: ""
    });

    const handleInput = (event) => {
        setValues((prev) => ({
            ...prev,
            [event.target.name]: [event.target.value],
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // const userData = {...values};
        let userData = "";
        console.log("User Data only with VAlue ", userData)

        if (typeof window.ethereum !== 'undefined') {
            try {
                // Request account access if needed
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                const userAddress = accounts[0];
                userData = userAddress;
                console.log("=========>")
                console.log("=========>", userAddress)
                // userData = { ...values, address: userAddress };
                console.log("User Data only with VAlue and address ", userData)
                console.log('MetaMask is connected!');
                // Perform your form submission logic here
            } catch (error) {
                console.error('User rejected the request or MetaMask is not installed', error);
            }
        } else {
            alert('MetaMask is not installed. Please install it to use this feature.');
        }

        try {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner(); 
                console.log("Nmae : ", values.name[0]);
                const userContract = new ethers.Contract(process.env.REACT_APP_USER_REGISTRATION_CONTRACT_ADDRESS, ContractAbi.abi, signer);
                const tx = await userContract.registerUser(values.name[0]);
                console.log("User registered ", tx.hash);
    
                // Listen for transaction confirmation
                provider.once(tx.hash, (receipt) => {
                    console.log("Transaction confirmed: ", receipt);
                    // Make axios call only if transaction is confirmed
                    console.log("Account for query ", userData);
                    axios
                        .post(`http://localhost:3051/signup?address=${userData}`, values)
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
                });
    
                // Show a message to the user that transaction is pending
                Swal.fire({
                    title: "Transaction pending",
                    text: "Please wait for the transaction confirmation in MetaMask.",
                    icon: "info",
                    confirmButtonText: "OK",
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