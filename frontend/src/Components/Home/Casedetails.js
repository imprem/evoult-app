import {React, useState, useEffect} from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import './Casedetails.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import DocumentStorageAbi from '../../contract/DocumentStorage.json';
const ethers = require('ethers');

export default function Casedetails(){

  const location = useLocation();
  const { caseInfo, id } = location.state || {};
  const navigate = useNavigate();
  const [documentId, setDocumentId] = useState(0);
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
    if (caseInfo) {
      setValues({
        title: caseInfo[0].TITLE || '',
        description: caseInfo[0].DESCRIPTION || '',
        client1: caseInfo[0].CLIENT1_NAME || '',
        client2: caseInfo[0].CLIENT2_NAME || '',
        lawyer1: caseInfo[0].LAYWER1_NAME || '',
        lawyer2: caseInfo[0].LAYWER2_NAME || '',
        judge: caseInfo[0].JUDGE_NAME || '',
        status: caseInfo[0].STATUS || '',
        judgement: caseInfo[0].JUDGEMENT || ''
      });
    }
  }, [caseInfo]);
  
  useEffect(() => {
    axios.get(`http://localhost:3051/getdocumentid?id=${id}`)
    .then(response => {
      setDocumentId(response.data);
    }).catch(error => {
      console.error(error);
    })
  },[documentId]);

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

    try{
      axios.post(`http://localhost:3051/updatedocument?id=${id}`, values)
        .then(res => {
          Swal.fire({
            title: 'Success',
            text: 'Document Updated Successfully.',
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

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userContract = new ethers.Contract(
          process.env.REACT_APP_DOCUMENT_STORAGE_CONTRACT_ADDRESS,
          DocumentStorageAbi.abi,
          signer
      );

      const tx = await userContract.updateDocument(documentId, values.description, values.status);
      console.log('Document Updated:', tx);
      navigate('/home');
    }catch(err){
      console.error('Error updating document:', err);
    }
  };

  return(
    <div className='container'>
      <div className='con-down'>
        <h4 className='title'>Enter Case Details</h4>
        <form onSubmit={handleSubmit}>
          <div className='mb-3 input_div'>
            <label htmlFor="title" className="form-label field-label">Title</label>
            <input type='text' name='title' value={values.title} onChange={handleInput} className='form-control rounded-0' id='title' />
          </div>
          <div className='mb-3 input_div'>
            <label htmlFor="description" className="form-label field-label">Description</label>
            <textarea name='description' placeholder='Enter description at least 200 words' value={values.description} onChange={handleInput} className='form-control rounded-0' id='description' rows='4' maxLength='200'></textarea>
          </div>
          <div className='mb-3 input_div'>
            <label htmlFor="client1" className="form-label fw-bold field-label">Client 1</label>
            <input type='text' name='client1' value={values.client1} className='form-control rounded-0' id='client1' readOnly />
          </div>
          <div className='mb-3 input_div'>
            <label htmlFor="lawyer1" className="form-label field-label">Lawyer 1</label>
            <input type='text' name='lawyer1' value={values.lawyer1} className='form-control rounded-0' id='lawyer1' readOnly />
          </div>
          <div className='mb-3 input_div'>
            <label htmlFor="client2" className="form-label field-label">Client 2</label>
            <input type='text' name='client2' value={values.client2} className='form-control rounded-0' id='client2' readOnly />
          </div>
          <div className='mb-3 input_div'>
            <label htmlFor="lawyer2" className="form-label field-label">Lawyer 2</label>
            <input type='text' name='lawyer2' value={values.lawyer2} className='form-control rounded-0' id='lawyer2' readOnly />
          </div>
          <div className='mb-3 input_div'>
            <label htmlFor="judge" className="form-label field-label">Judge</label>
            <input type='text' name='judge' value={values.judge} className='form-control rounded-0' id='judge' readOnly />
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