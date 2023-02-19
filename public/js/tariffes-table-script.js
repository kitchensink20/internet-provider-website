let tariffesManager;

fetch('http://localhost:7070/data/tariffes')
    .then((response) => response.json())
    .then((data) => {
        tariffesManager = new TariffesManager(data);
        tariffesManager.displayTariffesInTable();
    })
    .catch((error) => {
        console.error('Error: ', error);
    });