const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { type } = require("os");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "USER_DB"
})

//For Login
app.post('/', async (req, res) => {
    try {
        const isEmailExist = await findEmailByEmail(req.body.email);
        if (isEmailExist) {
            const isPassword = await findPasswordByEmail(req.body.email);
            if (req.body.password === isPassword) {
                return res.json({ message: "Login successful" });
            } else {
                return res.status(400).json({ error: "Wrong Password!!!" });
            }
        } else {
            return res.status(400).json({ error: "Email not registered!!!" });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

async function findEmailByEmail(email){
    let email1 = `"${email}"`;
    const FIND_EMAIL_IN_USERS = `SELECT EMAIL FROM USERS WHERE EMAIL = ${email1};`;
    console.log("SQLLQLQLQL ", FIND_EMAIL_IN_USERS);
    return new Promise((resolve, reject) => {
        db.query(FIND_EMAIL_IN_USERS, (err, rows) => {
            if(err){
                reject(err);
            } else {
                if (rows.length > 0) {
                    resolve(rows[0].EMAIL);
                } else {
                    reject(new Error("Email not found"));
                }
            }
        })
    })
}

async function findPasswordByEmail(email){
    let email1 = `"${email}"`;
    const FIND_PASSWORD_IN_USERS_BY_EMAIL = `SELECT PASSWORD FROM USERS WHERE EMAIL = ${email1};`;
    return new Promise((resolve, reject) => {
        db.query(FIND_PASSWORD_IN_USERS_BY_EMAIL, (err, rows) => {
            if(err){
                reject(err);
            } else {
                if (rows.length > 0) {
                    resolve(rows[0].PASSWORD);
                } else {
                    reject(new Error("Password not found"));
                }
            }
        })
    })
}

//LIST OF CLIENT
app.post('/listofclient', (req, res) => {
    const GET_LIST_OF_CLIENTS = `SELECT u.NAME FROM USERS u INNER JOIN ROLES r ON u.ROLE_ID = r.ROLE_ID WHERE r.ROLE_ID = 2`;
    db.query(GET_LIST_OF_CLIENTS, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error" });
        }
        const clientNames = data.map(client => client.NAME);
        return res.json(clientNames);
    })
})

//LIST OF LAWYER
app.post('/listoflawyer', (req, res) =>{
    const GET_LIST_OF_LAYWER = `SELECT u.NAME FROM USERS u INNER JOIN ROLES r ON u.ROLE_ID = r.ROLE_ID WHERE r.ROLE_ID = 3`;
    db.query(GET_LIST_OF_LAYWER, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error" });
        }
        const clientNames = data.map(client => client.NAME);
        return res.json(clientNames);
    })
})

//LIST OF JUDGE
app.post('/listofjudge', (req, res) =>{
    const GET_LIST_OF_JUDGE = `SELECT u.NAME FROM USERS u INNER JOIN ROLES r ON u.ROLE_ID = r.ROLE_ID WHERE r.ROLE_ID = 4`;
    db.query(GET_LIST_OF_JUDGE, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error" });
        }
        const clientNames = data.map(client => client.NAME);
        return res.json(clientNames);
    })
})

//NUMBER OF CLIENT
app.post('/numberofclent', (req, res) =>{
    const GET_NUMBER_OF_CLIENT = `SELECT COUNT(*) AS NUM FROM USERS u INNER JOIN ROLES r ON u.ROLE_ID = r.ROLE_ID WHERE r.ROLE_NAME = 'CLIENT'`;
    db.query(GET_NUMBER_OF_CLIENT, (err, data) => {
        if(err){
            return res.status(500).json({ error: "Error" });
        }
        return res.json(data[0].NUM);
    })
})

//NUMBER OF LAWYER
app.post('/numberoflawyer', (req, res) =>{
    const GET_NUMBER_OF_LAWYER = `SELECT COUNT(*) AS NUM FROM USERS u INNER JOIN ROLES r ON u.ROLE_ID = r.ROLE_ID WHERE r.ROLE_NAME = 'LAWYER'`;
    db.query(GET_NUMBER_OF_LAWYER, (err, data) => {
        if(err){
            return res.status(500).json({ error: "Error" });
        }
        return res.json(data[0].NUM);
    })
})

//NUMBER OF JUDGE
app.post('/numberofjudge', (req, res) =>{
    const GET_NUMBER_OF_JUDGE = `SELECT COUNT(*) AS NUM FROM USERS u INNER JOIN ROLES r ON u.ROLE_ID = r.ROLE_ID WHERE r.ROLE_NAME = 'JUDGE'`;
    db.query(GET_NUMBER_OF_JUDGE, (err, data) => {
        if(err){
            return res.status(500).json({ error: "Error" });
        }
        console.log(data[0].NUM);
        return res.json(data[0].NUM);
    })
})

//IN PROGRESS STATUS
app.post('/inprogressstatus', (req, res) =>{
    const COUNT_IN_PROGRESS_STATUS = `SELECT COUNT(*) AS NUM FROM CASES c INNER JOIN STATUS s ON c.STATUS = s.STATUS_ID WHERE s.STATUS_NAME = 'IN PROGRESS'`;
    db.query(COUNT_IN_PROGRESS_STATUS, (err, data) => {
        if(err){
            return res.status(500).json({ error: "Error" });
        }
        console.log(data[0].NUM);
        return res.json(data[0].NUM);
    })
})

//COMPLETED STATUS
app.post('/completedstatus', (req, res) =>{
    const COUNT_COMPLETED_STATUS = `SELECT COUNT(*) AS NUM FROM CASES c INNER JOIN STATUS s ON c.STATUS = s.STATUS_ID WHERE s.STATUS_NAME = 'COMPLETED'`;
    db.query(COUNT_COMPLETED_STATUS, (err, data) => {
        if(err){
            return res.status(500).json({ error: "Error" });
        }
        console.log(data[0].NUM);
        return res.json(data[0].NUM);
    })
})

//COMPLETED STATUS
app.post('/notstarted', (req, res) =>{
    const COUNT_NOT_STATRTED_STATUS = `SELECT COUNT(*) AS NUM FROM CASES c INNER JOIN STATUS s ON c.STATUS = s.STATUS_ID WHERE s.STATUS_NAME = 'NOT STARTED'`;
    db.query(COUNT_NOT_STATRTED_STATUS, (err, data) => {
        if(err){
            return res.status(500).json({ error: "Error" });
        }
        console.log(data[0].NUM);
        return res.json(data[0].NUM);
    })
})

//==================================================
//**************** LIST OF CASES *******************
//==================================================
app.get('/listofcases', async (req, res) => {
    const LIST_OF_CASES = `SELECT ID, TITLE FROM DOCUMENTS;`
    try {
        db.query(LIST_OF_CASES, (err, rows) => {
            if (err) {
                return res.status(400).send({ error: true, message: 'Please provide all required fields' });
            }
            return res.json(rows);
        });
    } catch (error) {
        return res.status(500).send({ error: true, message: 'Internal Server Error' });
    }
});


//==================================================
//***************** DOWNLOAD PDF *******************
//==================================================
app.get('/downloadpdf', async (req, res) => {
    let id = req.query.id; 
    const LIST_OF_CASES_BY_ID = `SELECT CASE_ID, LW1.NAME AS LAWYER1_NAME,
    LW2.NAME AS LAWYER2_NAME,
    CL1.NAME AS CLIENT1_NAME,
    CL2.NAME AS CLIENT2_NAME,
    JDG.NAME AS JUDGE_NAME,
    STA.STATUS_NAME AS CASE_STATUS,
    JSON_OBJECT('TITLE', DOC.TITLE, 'DESCRIPTION', DOC.DESCRIPTION, 'JUDGEMENT', DOC.JUDGEMENT) AS DOC_DATA FROM CASES 
        JOIN (SELECT * FROM USERS WHERE ROLE_ID=3 GROUP BY USER_ID) AS LW1 ON CASES.LAYWER1=LW1.USER_ID
        JOIN (SELECT * FROM USERS WHERE ROLE_ID=3 GROUP BY USER_ID) AS LW2 ON CASES.LAYWER2=LW2.USER_ID
        JOIN (SELECT * FROM USERS WHERE ROLE_ID=2 GROUP BY USER_ID) AS CL1 ON CASES.CLIENT1=CL1.USER_ID
        JOIN (SELECT * FROM USERS WHERE ROLE_ID=2 GROUP BY USER_ID) AS CL2 ON CASES.CLIENT2=CL2.USER_ID
        JOIN (SELECT * FROM USERS WHERE ROLE_ID=4 GROUP BY USER_ID) AS JDG ON CASES.JUDGE=JDG.USER_ID
        JOIN (SELECT * FROM STATUS GROUP BY STATUS_ID) AS STA ON CASES.STATUS=STA.STATUS_ID
        JOIN (SELECT * FROM DOCUMENTS GROUP BY DOCUMENT_ID) AS DOC ON CASES.DOCUMENT=DOC.DOCUMENT_ID WHERE CASES.CASE_ID = ${id}`;

    db.query(LIST_OF_CASES_BY_ID, function (error, results, fields) {
        if (error) {
            console.error('Error executing query: ' + error.stack);
            res.status(400).send({ error: true, message: 'Error executing query' });
            return;
        }

        const doc = new PDFDocument();
        const stream = fs.createWriteStream('output.pdf');
        doc.pipe(stream);

        results.forEach(row => {
            // doc.text(JSON.stringify(row));
            const { TITLE, CLIENT1_NAME, CLIENT2_NAME, LAWYER1_NAME, LAWYER2_NAME, JUDGE_NAME, DOC_DATA } = row;
            const DOC_DATA1 = JSON.parse(DOC_DATA);
            console.log("DOC_data 1", DOC_DATA1);

            doc.text(`Title: ${DOC_DATA1.TITLE}`);
            doc.text(`Client 1: ${CLIENT1_NAME}`);
            doc.text(`Client 2: ${CLIENT2_NAME}`);
            doc.text(`Lawyer 1: ${LAWYER1_NAME}`);
            doc.text(`Lawyer 2: ${LAWYER2_NAME}`);
            doc.text(`Judge: ${JUDGE_NAME}`);
            doc.text(`Judgement: ${DOC_DATA1.JUDGEMENT}`);
            
            // Add spacing between entries
            doc.moveDown();
            //  format the data
        });

        doc.end();

        stream.on('finish', function () {
            res.status(200).download('output.pdf', 'output.pdf', function (err) {
                if (err) {
                    console.error('Error sending file: ' + err.stack);
                    res.status(500).send({ error: true, message: 'Error sending file' });
                }
            });
        });
    });
});



app.post('/name', async (req, res) => {
    try{
        const GET_LIST_OF_LAWYER = `SELECT NAME FROM USERS INNER JOIN ROLES ON USERS.ROLE_ID = ROLES.ROLE_ID WHERE ROLES.ROLE_NAME = ${'CLIENT'}`;
        return new Promise((resolve, reject) => {
            db.query(GET_LIST_OF_LAWYER, (err, rows) => {
                if(err){
                    reject(err);
                } else {
                    console.log("rows[0].NAME", rows[0].NAME)
                    resolve(rows[0].NAME);
                }
            })
        })
    }catch(error){
        res.status(400).json({ error: error.message });
    }
})

//==================================================
//***************** FOR SIGNUP *********************
//==================================================
app.post('/signup', async (req, res) =>{
    let name = req.body.name;
    let gender = req.body.gender;
    let phone = req.body.phone;
    let email = req.body.email;
    let type = req.body.type;
    let password = req.body.password;
    let public_address = req.query.address;
    let date = '2023-02-29'; // Date format should be 'YYYY-MM-DD'
    let created_by = 'Prem'; 

    console.log('\n\n===============================================');
    console.log('************* UserRegistration ****************');
    console.log('===============================================');
    console.log("Name : ", name);
    console.log("Gender : ", gender);
    console.log("Phone : ", phone);
    console.log("Email : ", email);
    console.log("Type : ", type);
    console.log("Password : ", password);
    console.log("Public Address : ", public_address);
    console.log('Date : ', date);
    console.log("Created By : ", created_by);
    console.log('===============================================');

    try {
        const role_id = await getRoleId(req.body.type);
        const isPubKey = await isAddressExisted(public_address);
        if(isPubKey){
            return res.status(400).json({ error: "Public address already exists" });
        }

        const INSERT_INTO_USERS = `INSERT INTO USERS(NAME, GENDER, PHONE, EMAIL, ROLE_ID, PASSWORD, PUBLIC_ADDRESS, CREATED_DATE, CREATED_BY) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(INSERT_INTO_USERS, [name, gender, phone, email, role_id, password, public_address, date, created_by], (err, data) => {
            if(err){
                console.error(err);
                return res.status(500).json({ error: "Error inserting user" });
            }
            return res.json(data);
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

//==================================================
//******** INSERT INTO DOCUMENT AND CASES **********
//==================================================
app.post('/documentstore', async (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let client1 = req.body.client1;
    let client2 = req.body.client2;
    let lawyer1 = req.body.lawyer1;
    let lawyer2 = req.body.lawyer2;
    let judge = req.body.judge;
    let judgement = req.body.judgement;
    let status = req.body.status;
    let date = '2024-02-29'; // Fixed date format to YYYY-MM-DD
    let created_by = 'Prem';

    console.log('\n\n===============================================');
    console.log('************** DocumentStorage ****************');
    console.log('===============================================');
    console.log("Title :", title);
    console.log("Description", description);
    console.log("client1", client1);
    console.log("client2", client2);
    console.log("lawyer1", lawyer1);
    console.log("lawyer2", lawyer2);
    console.log("judge", judge);
    console.log("Status : ", status);
    console.log("judgement : ", judgement);
    console.log('Date : ', date);
    console.log("Created By : ", created_by);
    console.log('===============================================');

    try {
        let status_id = await getStatusIdByName(status);
        let lawyer1Id = await getLawyerIdByName(lawyer1);
        let lawyer2Id = await getLawyerIdByName(lawyer2);
        let client1Id = await getLawyerIdByName(client1);
        let client2Id = await getLawyerIdByName(client2);
        let judgeId = await getLawyerIdByName(judge);

        let doc_id = await insertIntoDocument(title, description, judgement, date, created_by);
        const INSERT_INTO_CASE = `INSERT INTO CASES(LAYWER1, LAYWER2, CLIENT1, CLIENT2, JUDGE, STATUS, DOCUMENT, CREATED_DATE, CREATED_BY) VALUES(${lawyer1Id}, ${lawyer2Id}, ${client1Id}, ${client2Id}, ${judgeId}, ${status_id}, ${doc_id}, '${date}', '${created_by}')`;

        db.query(INSERT_INTO_CASE, async (err, data) => {
            if (err) {
                return res.json("Error");
            }
            return res.json(data);
        });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

async function isAddressExisted(pub_key){
    const GET_USER_ID = `SELECT USER_ID FROM USERS WHERE PUBLIC_ADDRESS = ?`;
    return new Promise((resolve, reject) => {
        db.query(GET_USER_ID, [pub_key], (err, rows) => {
            if(err){
                reject(err);
            } else {
                resolve(rows.length > 0); // Return true if address exists, false otherwise
            }
        });
    });
}

async function getRoleId(role_name) {
    const GET_ID = `SELECT ROLE_ID FROM ROLES WHERE ROLE_NAME = ?`;
    return new Promise((resolve, reject) => {
        db.query(GET_ID, [role_name], (err, rows) => {
            if(err){
                reject(err);
            } else {
                if(rows.length > 0) {
                    resolve(rows[0].ROLE_ID);
                } else {
                    reject(new Error("Role not found"));
                }
            }
        });
    });
}

async function insertIntoDocument(title, description, judgement, date, created_by) {
    return new Promise((resolve, reject) => {
        const INSERT_INTO_DOCUMENT = `INSERT INTO DOCUMENTS(TITLE, DESCRIPTION, JUDGEMENT, CREATED_DATE, CREATED_BY) VALUES('${title}', '${description}', '${judgement}', '${date}', '${created_by}')`;
        db.query(INSERT_INTO_DOCUMENT, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.insertId);
            }
        });
    });
}

async function getStatusIdByName(name){
    let name1 = `"${name}"`;
    const GET_STATUS_ID = `SELECT STATUS_ID FROM STATUS WHERE STATUS_NAME = ${name1}`;
    return new Promise((resolve, reject) => {
        db.query(GET_STATUS_ID, (err, rows) => {
            if(err){
                reject(err);
            } else {
                resolve(rows[0].STATUS_ID);
            }
        })
    })
}

async function getLawyerIdByName(name){
    let name1 = `"${name}"`;
    const GET_USER_ID = `SELECT USER_ID FROM USERS WHERE NAME = ${name1}`;
    return new Promise((resolve, reject) => {
        db.query(GET_USER_ID, (err, rows) => {
            if(err){
                reject(err);
            } else {
                resolve(rows[0].USER_ID);
            }
        })
    })
}

app.listen(3051, ()=>{
    console.log('Listening at 3051');
})
