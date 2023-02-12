let tariffesManager;

let userDataUrl = 'http://localhost:7070/data/user',
    tariffesDataUrl = 'http://localhost:7070/data/tariffes';

Promise.all([fetch(userDataUrl), fetch(tariffesDataUrl)])
    .then((responses) => Promise.all(responses.map((res) => res.json())))
    .then((data) => {
        user = data[0];
        tariffes = data[1];
        
        let activeTariffesArray = tariffes.filter(x => user.active_services.includes(x._id));
        tariffesManager = new TariffesManager(activeTariffesArray);
        tariffesManager.displayMyActiveTariffes();
    });

document.querySelector("#sortByPriceBtn").addEventListener('click', () => { 
    tariffesManager.sortTariffesByPrice(); 
    tariffesManager.displayMyActiveTariffes();
});
document.querySelector("#sortByNameBtn").addEventListener('click', () => { 
    tariffesManager.sortTariffesByName(); 
    tariffesManager.displayMyActiveTariffes();
});
document.querySelector("#sortByNameDescBtn").addEventListener('click', () => { 
    tariffesManager.sortTariffesByNameDesc(); 
    tariffesManager.displayMyActiveTariffes();
});