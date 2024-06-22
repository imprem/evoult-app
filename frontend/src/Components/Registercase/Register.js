import React, { useEffect, useState } from 'react';
import './register.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import DocumentStorageAbi from '../../contract/DocumentStorage.json';
const ethers = require('ethers');

function Register() {
  const [lawyers, setUsersLawyers] = useState([]);
  const [clients, setUsersClients] = useState([]);
  const [judges, setUsersJudge] = useState([]);

  const [values, setValues] = useState({
    title: '',
    description: '',
    client1: '',
    client2: '',
    lawyer1: '',
    lawyer2: '',
    judge: '',
    status: '',
    judgement: ''
  });

  useEffect(() => {
    // List of clients
    axios.post('http://localhost:3051/listofclient')
      .then(response => {
        setUsersClients(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    // List of lawyers
    axios.post('http://localhost:3051/listoflawyer')
      .then(response => {
        setUsersLawyers(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    // List of judges
    axios.post('http://localhost:3051/listofjudge')
      .then(response => {
        setUsersJudge(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const eth_call = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        const address = accounts[0];
        setValues(prevValues => ({
          ...prevValues,
          address
        }));
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('MetaMask is not installed');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await eth_call();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userContract = new ethers.Contract(
      process.env.REACT_APP_DOCUMENT_STORAGE_CONTRACT_ADDRESS,
      DocumentStorageAbi.abi,
      signer
    );

    try {
      const tx = await userContract.uploadDocument(
        values.title,
        values.client1,
        values.client2,
        values.description,
        values.status
      );
      console.log('Document Uploaded:', tx);

      axios.post('http://localhost:3051/documentstore', values)
        .then(res => {
          Swal.fire({
            title: 'Success',
            text: 'Case Register Successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        })
        .catch(err => {
          Swal.fire({
            title: 'Oops...',
            text: err.response.data.error, // Access error message property
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  return (
    <div className='container'>
      <div className='con-down'>
        <h4 className='title'>Enter Case Details</h4>
        <form onSubmit={handleSubmit}>
          <div className='mb-3 input_div'>
            <label htmlFor="title" className="form-label field-label">Title</label>
            <input type='text' placeholder='Enter title' name='title' value={values.title} onChange={handleInput} className='form-control rounded-0' id='title' />
          </div>
          <div className='mb-3 input_div'>
            <label htmlFor="description" className="form-label field-label">Description</label>
            <textarea name='description' placeholder='Enter description at least 200 words' value={values.description} onChange={handleInput} className='form-control rounded-0' id='description' rows='4' maxLength='200'></textarea>
          </div>
          <div className='mb-3 input_div'>
            <label htmlFor="client1" className="form-label fw-bold field-label">Client 1</label>
            <select id="client1" className="form-select" name="client1" onChange={handleInput}>
              {clients.map((client, i) => (
                <option key={i} value={client}>
                  {client}
                </option>
              ))}
            </select>
          </div>
          <div className='mb-3 input_div'>
            <label htmlFor="lawyer1" className="form-label field-label">Lawyer 1</label>
            <select id="lawyer1" className="form-select" name="lawyer1" value={values.lawyer1} onChange={handleInput}>
              {lawyers.map((lawyer, i) => (
                <option key={i} value={lawyer}>
                  {lawyer}
                </option>
              ))}
            </select>
          </div>
          <div className='mb-3 input_div'>
            <label htmlFor="client2" className="form-label field-label">Client 2</label>
            <select id="client2" className="form-select" name="client2" value={values.client2} onChange={handleInput}>
              {clients.map((client, i) => (
                <option key={i} value={client}>
                  {client}
                </option>
              ))}
            </select>
          </div>
          <div className='mb-3 input_div'>
            <label htmlFor="lawyer2" className="form-label field-label">Lawyer 2</label>
            <select id="lawyer2" className="form-select" name="lawyer2" value={values.lawyer2} onChange={handleInput}>
              {lawyers.map((lawyer, i) => (
                <option key={i} value={lawyer}>
                  {lawyer}
                </option>
              ))}
            </select>
          </div>
          <div className='mb-3 input_div'>
            <label htmlFor="judge" className="form-label field-label">Judge</label>
            <select name="judge" id="judge" className="form-select" value={values.judge} onChange={handleInput}>
              {judges.map((judge, i) => (
                <option key={i} value={judge}>
                  {judge}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3 input_div">
            <label htmlFor="status" className="form-label field-label">Status</label>
            <select name="status" id="type" value={values.status} onChange={handleInput} className='form-select'>
              <option value="IN PROGRESS">In Progress</option>
              <option value="NOT STARTED">Not Started</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div className='mb-3 input_div'>
            <label htmlFor="judgement" className="form-label field-label">Judgement</label>
            <textarea name='judgement' placeholder='Enter full judgement in full details' value={values.judgement} onChange={handleInput} className='form-control rounded-0' id='judgement' rows='15' maxLength='1900'></textarea>
          </div>
          <button type="submit" className="btn btn-primary btn-submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Register;