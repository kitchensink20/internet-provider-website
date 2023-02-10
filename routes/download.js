const express = require('express');
const downloadRouter = express.Router();
const fileManager = require('../controllers/tariffes-file-manager');

downloadRouter.get('/tariffes', (req, res) => {
    fileManager.downloadTariffes(res);
});

module.exports = downloadRouter;