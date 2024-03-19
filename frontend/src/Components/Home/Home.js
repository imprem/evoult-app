import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [inProgress, setInProgress] = useState(0);
  const [notStarted, setNotStarted] = useState(0);
  const [completed, setCompleted] = useState(0);

  const [numberOfClient, setNumberOfClient] = useState(0); 
  const [numberOfJudge, setNumberOfJudge] = useState(0); 
  const [numberOfLawyer, setNumberOfLawyer] = useState(0);
  const [listOfDocument, setListOfDocumnet] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.post('http://localhost:3051/numberofclent')
      .then(response => {
        setNumberOfClient(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    axios.post('http://localhost:3051/numberoflawyer')
      .then(response => {
        setNumberOfLawyer(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    axios.post('http://localhost:3051/numberofjudge')
      .then(response => {
        setNumberOfJudge(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    // Status
    axios.post('http://localhost:3051/inprogressstatus')
      .then(response => {
        setInProgress(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    axios.post('http://localhost:3051/completedstatus')
      .then(response => {
        setCompleted(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    axios.post('http://localhost:3051/notstarted')
      .then(response => {
        setNotStarted(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
 
      axios.get('http://localhost:3051/listofcases')
      .then(response => {
        setListOfDocumnet(response.data);
        console.log(listOfDocument);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  useEffect(() => {
    console.log(listOfDocument);
  }, [listOfDocument]);

  return (
    <div className="container">
      <div className='con-down'>
        <h1 className="mt-2 mb-5 title">Dashboard</h1>
        <div className="row mb-4 mx-3">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Cases Not Started</h5>
                <p className="card-text">{notStarted}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Cases In Progress</h5>
                <p className="card-text">{inProgress}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Cases Closed</h5>
                <p className="card-text">{completed}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row mx-3">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Number of Clients</h5>
                <p className="card-text">{numberOfClient}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Number of Judges</h5>
                <p className="card-text">{numberOfJudge}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Number of Lawyers</h5>
                <p className="card-text">{numberOfLawyer}</p>
              </div>
            </div>
          </div>
        </div>
        <div className='text-center mt-2'>
          <h2>Case Details</h2>
          <div className="table-responsive">
            <table className='table table-bordered'>
              <colgroup>
                <col style={{ width: '10%' }} /> {/* Setting width of the first column to 10% */}
                <col style={{ width: '70%' }} />
                <col style={{ width: '20%' }} />
              </colgroup>
              <thead className="sticky-header">
                <tr>
                  <th>Id</th>
                  <th>Title</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {listOfDocument.map((user, index) => {
                  const docData = JSON.parse(user.DOC_DATA);
                  return (
                    <tr key={index}>
                      <td>{user.CASE_ID}</td>
                      <td>{docData.TITLE}</td>
                      <td><a href={`http://localhost:3051/downloadpdf?id=${user.CASE_ID}`}>Download</a></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;