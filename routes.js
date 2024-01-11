const express = require('express');
const router = express.Router();
const model = require('./models/model');

router.get('/', async (req, res) => {
    try {
        const indexes = await model.getStudentIndexes();
        const programs = await model.getAllPrograms();
        const professors = await model.getAllProfessors();
        const students = await model.getAllStudents();
        res.render('home', { indexes, programs, professors, students });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/izvjestaj_prosjecna_ocjena', async (req, res) => {
    const { index } = req.body;
    try {
        const result = await model.averageStudentGrades(index, res);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/pregled_studijskog_programa', async (req, res) => {
    const { programName } = req.body;
    try {
        const results = await model.getProgramAndSubjects(programName, res);
        res.render('programsView', { results });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
});

router.post('/izvjestaj_lista_studenata', async (req, res) => {
    const { year } = req.body;
    try {
        const results = await model.getReportListOfStudents(year);
        res.render('reportView', { results });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
});

router.post('/dodaj_profesora', async (req, res) => {
    const { firstName, lastName, title, email } = req.body;
    try {
        await model.addNewProfessor(firstName, lastName, title, email);
        res.redirect('back');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
});

router.get('/izmijeni_profesora', async (req, res) => {
    const { profesorId } = req.query;
    try {
        const professor = await model.getProfessorById(profesorId);
        res.render("professorEditView", { professor });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
});

router.post('/izmijeni_profesora', async (req, res) => {
    const { profesorId, firstName, lastName, email, title } = req.body;
    try {
        await model.updateProfessor(profesorId, firstName, lastName, email, title);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
});

router.get('/izbrisi_profesora', async (req, res) => {
    const { profesorId } = req.query;
    try {
        await model.deleteProfessor(profesorId);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
});

router.get('/prikaz_podataka_student', async (req, res) => {
    const { studentId } = req.query;
    try {
        const reports = await model.getStudentReport(studentId);
        res.render('studentReportView', { reports })
    } catch(error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/prikaz_lista_profesora', async (req, res) => {
    const { order } = req.body;
    try {
        const professors = await model.getProfessorsOrdered(order);
        res.render('professorsOrderedView', { professors });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
});

router.post('/prikaz_uporedni_izvjestaj', async (req, res) => {
    const { date1From, date1To, date2From, date2To } = req.body;
    try {
        const reports = await model.getAdjacentReport(date1From, date1To, date2From, date2To);
        res.render("adjacentReportView", { reports });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
});

router.post('/prikaz_profesor_izvjestaj', async (req, res) => {
    const { studyProgramId } = req.body;
    try {
        const reports = await model.getProfessorReport(studyProgramId);
        res.render("professorReportView", { reports });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
});

module.exports = router;
