let tariffesManager;

fetch('http://localhost:7070/tariffes-data')
    .then((response) => response.json())
    .then((data) => {
        tariffesManager = new TariffesManager(data);
        tariffesManager.displayTariffes();
    });

document.querySelector("#sortByPriceBtn").addEventListener('click', () => tariffesManager.sortTariffesByPrice());
document.querySelector("#sortByNameBtn").addEventListener('click', () => tariffesManager.sortTariffesByName());
document.querySelector("#sortByNameDescBtn").addEventListener('click', () => tariffesManager.sortTariffesByNameDesc());