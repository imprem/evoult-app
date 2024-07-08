import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    // useEffect(() => {
    //     if (typeof window.ethereum !== 'undefined') {
    //         try {
    //           const accounts =  window.ethereum.request({
    //             method: 'eth_requestAccounts'
    //           });
    //           window.$metaAddress = accounts[0];
    //         } catch (error) {
    //           console.error(error);
    //         }
    //       } else {
    //         console.error('MetaMask is not installed');
    //     }
    // })

    const navigate = useNavigate();
    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3051/', values)
            .then(res => {
                navigate('/home');
            })
            .catch(err => {
                Swal.fire({
                    title: 'Oops...',
                    text: err.response.data.error, // Access error message property
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    };

    return (
        <div className='d-flex justify-content-center align-items-center custom-bg-color vh-100'>
            <div className='custom-bg-white p-3 rounded w-25'>
                <h2>Log in</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='email'>Email</label>
                        <input type='email' placeholder='Enter email' name='email' value={values.email} onChange={handleInput} className='form-control rounded-0' id='email' />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'>Password</label>
                        <input type='password' placeholder='Enter Password' name='password' value={values.password} onChange={handleInput} className='form-control rounded-0' id='password' />
                    </div>
                    <button type='submit' className='btn btn-success w-100 login-btn'>Log in</button>
                    <Link to="/signup" className='btn btn-default border w-100 custom-bg-light text-decoration-none'>Create Account</Link>
                </form>
            </div>
        </div>
    );
}

export default Login;