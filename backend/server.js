const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { type } = require("os");
const { DESTRUCTION } = require("dns/promises");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "USER_DB"
})

//==============================================
//**************** FOR LOGIN *******************
//==============================================
app.post('/', async (req, res) => {
    console.log('\n\n######### Inside Login ##########');
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

app.get('/listofcasesbyid', async (req, res) => {
    // let id = req.query.id;
    console.log("AAAAAAAAAAAAAAAAAAA");
    const LIST_OF_CASE_INFO_BY_ID = `SELECT 
	L1.NAME AS LAYWER1_NAME, 
	L2.NAME AS LAYWER2_NAME, 
	C1.NAME AS CLIENT1_NAME, 
	C2.NAME AS CLIENT2_NAME, 
	J.NAME AS JUDGE_NAME, 
	S.STATUS_NAME AS STATUS,
	D.TITLE,
    D.DESCRIPTION,
    D.JUDGEMENT
	FROM CASES C
	JOIN USERS L1 ON C.LAYWER1 = L1.USER_ID
    JOIN USERS L2 ON C.LAYWER2 = L2.USER_ID
    JOIN USERS C1 ON C.CLIENT1 = C1.USER_ID
    JOIN USERS C2 ON C.CLIENT2 = C2.USER_ID
    JOIN USERS J ON C.JUDGE = J.USER_ID
    JOIN STATUS S ON C.STATUS = S.STATUS_ID
    JOIN DOCUMENTS D ON C.DOCUMENT = D.ID
    WHERE D.ID = 1`;

    // WHERE D.ID = ${id}`;
    db.query(LIST_OF_CASE_INFO_BY_ID, function (error, results) {
        try{
            if (error) {
                return res.status(400).send({ error: true, message: 'Please provide all required fields' });
            }
            return res.json(results);
        }catch(error){
            return res.status(500).send({ error: true, message: 'Internal Server Error' }); 
        }
    });
});

//==============================================
//***************** DOWNLOAD PDF ***************
//==============================================
app.get('/downloadpdf', async (req, res) => {
    console.log('######## Inside Download Pdf ########');
    let id = req.query.id;
    const LIST_OF_CASES_BY_ID = `SELECT 
        L1.NAME AS LAYWER1_NAME,
        L2.NAME AS LAYWER2_NAME,
        C1.NAME AS CLIENT1_NAME,
        C2.NAME AS CLIENT2_NAME,
        J.NAME AS JUDGE_NAME,
        S.STATUS_NAME AS STATUS,
        D.TITLE,
        D.DESCRIPTION,
        D.JUDGEMENT
    FROM CASES C
    JOIN USERS L1 ON C.LAYWER1 = L1.USER_ID
    JOIN USERS L2 ON C.LAYWER2 = L2.USER_ID
    JOIN USERS C1 ON C.CLIENT1 = C1.USER_ID
    JOIN USERS C2 ON C.CLIENT2 = C2.USER_ID
    JOIN USERS J ON C.JUDGE = J.USER_ID
    JOIN STATUS S ON C.STATUS = S.STATUS_ID
    JOIN DOCUMENTS D ON C.DOCUMENT = D.ID
    WHERE C.CASE_ID = ${id}`;

    db.query(LIST_OF_CASES_BY_ID, function (error, results, fields) {
        if (error) {
            console.error('Error executing query: ' + error.stack);
            res.status(400).send({ error: true, message: 'Error executing query' });
            return;
        }

        if (!results || results.length === 0) {
            res.status(404).send({ error: true, message: 'No results found' });
            return;
        }

        const doc = new PDFDocument();
        const stream = fs.createWriteStream('output.pdf');
        doc.pipe(stream);

        results.forEach(row => {
            const { TITLE, CLIENT1_NAME, CLIENT2_NAME, LAYWER1_NAME, LAYWER2_NAME, JUDGE_NAME, STATUS, DESCRIPTION, JUDGEMENT } = row;
            let docData;
            try {
                docData = JSON.parse(JUDGEMENT); // Ensure the field you are parsing is correct
            } catch (parseError) {
                console.error('Error parsing JUDGEMENT as JSON: ' + parseError.message);
                docData = { TITLE: TITLE, JUDGEMENT: JUDGEMENT };
            }

            console.log("DOC_data ", docData);
            
            const pageWidth = doc.page.width;
            const imageWidth = 50;
            doc.image(`./asset/ashoka.png`, (pageWidth - imageWidth) / 2, doc.y, { fit: [imageWidth, 50] });
            doc.moveDown(1);
            
            doc.fontSize(15).font('Helvetica-Bold').text(`TITLE`, { continued: false })
            doc.fontSize(15).font('Helvetica').text(docData.TITLE || TITLE);
            doc.moveDown(0.5);
            doc.fontSize(15).font('Helvetica-Bold').text(`Client 1`, { continued: false })
            doc.fontSize(15).font('Helvetica').text(CLIENT1_NAME);
            doc.moveDown(0.5);
            doc.fontSize(15).font('Helvetica-Bold').text(`JUDGE`, { continued: false })
            doc.fontSize(15).font('Helvetica').text(JUDGE_NAME);
            doc.moveDown(0.5);
            doc.fontSize(15).font('Helvetica-Bold').text(`Client 2`, { continued: false })
            doc.fontSize(15).font('Helvetica').text(CLIENT2_NAME);
            doc.moveDown(0.5);
            doc.fontSize(15).font('Helvetica-Bold').text(`LAWYER 1`, { continued: false })
            doc.fontSize(15).font('Helvetica').text(LAYWER1_NAME);
            doc.moveDown(0.5);
            doc.fontSize(15).font('Helvetica-Bold').text(`LAWYER 2`, { continued: false })
            doc.fontSize(15).font('Helvetica').text(LAYWER2_NAME);
            doc.moveDown(0.5);
            doc.fontSize(15).font('Helvetica-Bold').text(`STATUS`, { continued: false })
            doc.fontSize(15).font('Helvetica').text(STATUS);
            doc.moveDown(0.5);
            doc.fontSize(15).font('Helvetica-Bold').text(`DESCRIPTION`, { continued: false })
            doc.fontSize(15).font('Helvetica').text(DESCRIPTION);
            doc.moveDown(0.5);
            doc.fontSize(15).font('Helvetica-Bold').text(`JUDGEMENT`, { continued: false })
            doc.fontSize(15).font('Helvetica').text(docData.JUDGEMENT || JUDGEMENT);
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

app.get('/getdocumentid', async (req, res) => {
    let id = req.query.id;
    console.log("#### ID : ", id);

    const GET_DOCUMENT_ID_BY_ID = `SELECT DOCUMENT_ID FROM DOCUMENTS WHERE ID = ${id}`;
    console.log(GET_DOCUMENT_ID_BY_ID);
    db.query(GET_DOCUMENT_ID_BY_ID, (err, data) => {
        if(err){
            return res.status(500).json({ error: "Error" });
        }
        return res.json(data[0].DOCUMENT_ID);
    })

})

//==================================================
//******** UPDATE INTO DOCUMENT AND CASES **********
//==================================================
app.post('/updatedocument', async (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let judgement = req.body.judgement;
    let status = req.body.status;
    let id = req.query.id;

    console.log('\n\n===============================================');
    console.log('************** DocumentStorage ****************');
    console.log('===============================================');
    console.log("Title :", title);
    console.log("Description", description);
    console.log("Status : ", status);
    console.log("judgement : ", judgement);
    console.log("Document_id : ", id);

    try{
        let status_id = await getStatusIdByName(status);
        await updateDocumentById(title, description, judgement, id);
        await updateCaseStatusId(status_id, id)
    }catch(error){
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal server error" });
    }

});

async function updateDocumentById(title, description, judgement, id){
    const UPDATE_DOCUMENT_BY_ID = `UPDATE DOCUMENTS SET TITLE = ?, DESCRIPTION = ?, JUDGEMENT = ? WHERE ID = ?`;
    console.log(`SQL Query: ${UPDATE_DOCUMENT_BY_ID}`);
    console.log(`Values: title=${title}, description=${description}, id=${id}`);

    return new Promise((resolve, reject) => {
        db.query(UPDATE_DOCUMENT_BY_ID, [title, description, judgement, id], (err, rows) => {
            if (err) {
                console.error(`Error executing query: ${err.message}`);
                reject(err);
            } else {
                console.log(`Query executed successfully, affected rows: ${rows.affectedRows}`);
                resolve(rows);
            }
        });
    });
}

async function updateCaseStatusId(status_id, id){
    const UPDATE_CASE_STATUS_ID = `UPDATE CASES SET STATUS = ? WHERE DOCUMENT = ?`;
    console.log(`SQL Query: ${UPDATE_CASE_STATUS_ID}`);
    console.log(`Values: STATUS_ID=${status_id}, id=${id}`);

    return new Promise((resolve, reject) => {
        db.query(UPDATE_CASE_STATUS_ID, [status_id, id], (err, rows) => {
            if (err) {
                console.error(`Error executing query: ${err.message}`);
                reject(err);
            } else {
                console.log(`Query executed successfully, affected rows: ${rows.affectedRows}`);
                resolve(rows);
            }
        });
    });
}

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
