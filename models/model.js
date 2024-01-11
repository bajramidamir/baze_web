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

async function getStudentReport(studentId) {
    const connection = mysql.createConnection(config);
    const query = `SELECT po.datumUnosa, po.ocjena,
    ps.ime as imeStudenta, ps.prezime as prezimeStudenta,
    p.ime as imeProfesora, p.prezime as prezimeProfesora,
    pp.imePredmeta
        FROM projekat_ocjene po
    INNER JOIN student2328.projekat_studenti ps on po.studentId = ps.studentId
    INNER JOIN student2328.projekat_profesori p on po.profesorId = p.profesorId
    INNER JOIN student2328.projekat_predmeti pp on po.predmetId = pp.predmetId
    WHERE po.studentId = ?;`
    try {
        const [ rows, fields ] = await connection.promise().query(query, [studentId])
        console.log(rows);
        return rows;
    } finally {
        connection.end();
    };
};

async function getAllStudents() {
    const connection = mysql.createConnection(config);
    try {
        const [ rows, fields ] = await connection.promise().query("SELECT studentId, ime, prezime FROM projekat_studenti");
        return rows;
    } finally {
        connection.end();
    };
};

async function getProfessorsOrdered(order) {
    const connection = mysql.createConnection(config);
    try {
        const [ rows, fields ] = await connection.promise().query("CALL ListaProfesora(?)", [order]);
        return rows[0];
    } finally {
        connection.end();
    };
};

async function getAdjacentReport(date1From, date1To, date2From, date2To) {
    const connection = mysql.createConnection(config);
    try {
        const [ rows, fields ] = await connection.promise().query("CALL UporedniIzvjestajOcjena(?, ?, ?, ?)", [date1From, date1To, date2From, date2To]);
        return rows[0];
    } finally {
        connection.end();
    };
};

async function getProfessorReport(studyProgramId) {
    const connection = mysql.createConnection(config);
    try {
        const [ rows, fields ] = await connection.promise().query("CALL IzvjestajProfesoraZaduzenjaPredmeta(?);", [studyProgramId]);
        return rows[0];
    } finally {
        connection.end();
    }
}

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
    getStudentReport,
    getAllStudents,
    getProfessorsOrdered,
    getAdjacentReport,
    getProfessorReport
};