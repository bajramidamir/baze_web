const express = require('express');
const router = express.Router();
const model = require('./models/model');

router.get('/', async (req, res) => {
    try {
        const indexes = await model.getStudentIndexes();
        const programs = await model.getAllPrograms();
        const professors = await model.getAllProfessors();
        res.render('home', { indexes, programs, professors });
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

module.exports = router;
