let tariffesManager;

fetch('http://localhost:7070/data/tariffes')
    .then((response) => response.json())
    .then((data) => {
        tariffesManager = new TariffesManager(data);
        tariffesManager.displayTariffes();
    })
    .catch((error) => {
        console.error('Error: ', error);
    });

document.querySelector("#sortByPriceBtn").addEventListener('click', () => { 
    tariffesManager.sortTariffesByPrice(); 
    tariffesManager.displayTariffes();
});
document.querySelector("#sortByNameBtn").addEventListener('click', () => { 
    tariffesManager.sortTariffesByName(); 
    tariffesManager.displayTariffes();
    });
document.querySelector("#sortByNameDescBtn").addEventListener('click', () => { 
    tariffesManager.sortTariffesByNameDesc(); 
    tariffesManager.displayTariffes();
});