const mysql = require('mysql2')
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_DB,
};

async function getStudentIndexes() {
    const connection = mysql.createConnection(config);

    try {
        const [ rows, fields ] = await connection.promise().query('SELECT indeksStudenta FROM projekat_upisStudenta;');
        return rows;
    } finally {
        connection.end();
    };
};

async function getAllPrograms() {
    const connection = mysql.createConnection(config);
    try {
        const [ rows, fields ] = await connection.promise().query("SELECT * FROM projekat_studijskiProgrami");
        return rows;
    } finally {
        connection.end();
    };
};

async function averageStudentGrades(studentIndex, res) {
    const connection = mysql.createConnection(config);
    try {
        const [ rows, fields ] = await connection.promise().query("CALL ProsjecnaOcjenaStudenta(?)", [studentIndex]);
        res.send(rows[0]);
    } finally {
        connection.end();
    };
};

async function getProgramAndSubjects(programName, res) {
    const connection = mysql.createConnection(config);
    try {
        const [ rows, fields ] = await connection.promise().query(
            `SELECT sp.studijskiProgram, sp.naziv, sp.opis,
                ppSP.brojSemestra, ppSP.sifraPredmeta, ppSP.nazivPredmeta, ppSP.kontaktSati
                FROM projekat_studijskiProgrami AS sp
                INNER JOIN projekat_predmetiStudijskogPrograma ppSP on sp.studijskiProgramId = ppSP.studijskiProgramId
                WHERE sp.naziv = ?`, [programName]
        );
        console.log(rows);
        return rows;
    } finally {
        connection.end();
    };
};

async function getReportListOfStudents(year) {
    const connection = mysql.createConnection(config);
    try {
        const [ rows, fields ] = await connection.promise().query("CALL ListaStudenataSaBrojemPolozenihIspita(?);", [year]);
        return rows[0];
    } finally {
        connection.end();
    };
};

async function getAllProfessors() {
    const connection = mysql.createConnection(config);
    try {
        const [ rows, fields ] = await connection.promise().query("SELECT * FROM projekat_profesori");
        return rows;
    } finally {
        connection.end();
    };
};

async function addNewProfessor(firstName, lastName, title, email) {
    const connection = mysql.createConnection(config);
    try {
        await connection.promise().query("INSERT INTO projekat_profesori(ime, prezime, titula, email) VALUES (?, ?, ?, ?)", [firstName, lastName, title, email]);
    } finally {
        connection.end();
    };
};

async function getProfessorById(profesorId) {
    const connection = mysql.createConnection(config);
    try {
        const [ rows, fields ] = await connection.promise().query('SELECT * FROM projekat_profesori WHERE profesorId = ?', [profesorId]);
        return rows[0];
    } finally {
        connection.end();
    };
};

async function updateProfessor(profesorId, firstName, lastName, email, title) {
    const connection = mysql.createConnection(config);
    try {
        await connection.promise().query("UPDATE projekat_profesori SET ime = ?, prezime = ?, email = ?, titula = ? WHERE profesorId = ?;",
        [firstName, lastName, email, title, profesorId]);
    } finally {
        connection.end();
    };
};

async function deleteProfessor(profesorId) {
    const connection = mysql.createConnection(config);
    try {
        await connection.promise().query("DELETE FROM projekat_profesori WHERE profesorId = ?", [profesorId]);
    } finally {
        connection.end();
    };
};

module.exports = {
    getStudentIndexes,
    getAllPrograms,
    averageStudentGrades,
    getProgramAndSubjects,
    getReportListOfStudents,
    getAllProfessors,
    addNewProfessor,
    getProfessorById,
    updateProfessor,
    deleteProfessor,
};