const { getAllTariffes } = require('../models/tariffes');
const fs = require('fs');

const file = 'tariffes.txt';

function updateTariffesFile(){
    getAllTariffes().then(allTariffes => {
        let fileContent = "";
        for(let i = 0; i < allTariffes.length; i++){
            fileContent += '_____________________________________________\n';
            fileContent +=  'name:  ' + allTariffes[i].name + '\n';
            fileContent +=  'type:  ' + allTariffes[i].type + '\n';
            fileContent +=  'description:\n' + allTariffes[i].description + '\n';
            fileContent += 'price:  ' + allTariffes[i].price + '₴\n';
        }

        fs.writeFile(file, fileContent, (err) => {
            if(err) throw err;
            console.log(file + ' updated!');
        });
    }).catch(error => {
        console.error('Error: ', error);
    });
}

function downloadTariffes(res){
    res.setHeader('Content-Description', 'File Download'); // adds desctriptive text to the header
    res.setHeader('Content-Type', 'application/octet-stream'); // type of the sent content, octet-stream means binary data
    res.setHeader('Content-Disposition', 'attachment; filename="' + file + '"'); // provides info about how content should be handled by the client, 'attachment' means that the file should be downloaded 
    res.setHeader('Expires', 0); // the time after which response expires
    res.setHeader('Cache-Control', 'must-revalidate'); // info about caching, 'must-revalidate' checks 'expires' to determaine if the cached response is still valid
    res.setHeader('Content-Length', fs.statSync(file).size); // the size of the content, statSync - method that returns object that contains information about the specified file, .size returns file size i bytes
    fs.createReadStream(file).pipe(res); //createReadStream(file) is used to create a readable stream of th specified file, pipe() is used to send data from the readable stream to the specified writable stream, in this case to res object
}

module.exports = { updateTariffesFile, downloadTariffes };