class TariffesManager{

    //---------concructor-------------------------------

    constructor(tariffes){
        this.tariffes = tariffes;
        this.tariffes.sort((a, b) => (a.type > b.type) ? 1 : ((b.type > a.type) ? -1 : 0));
    }

    //--------methods-----------------------------------

    displayTariffes(){
        let temp = document.getElementsByTagName('template')[0];

        for(let i = 0; i < this.tariffes.length; i++){
            let tempClone = temp.content.cloneNode(true); // refers to a deep clone that creates an exact copy of the original node, including its child nodes and attributes
            document.querySelector('#tariffesDisplayBlock').append(tempClone);
            
            document.querySelectorAll(".tariffType")[i].textContent = this.tariffes[i].type;
            document.querySelectorAll(".tariffName")[i].textContent = this.tariffes[i].name;
            document.querySelectorAll(".tariffDescription")[i].textContent = this.tariffes[i].description;
            document.querySelectorAll(".tariffPrice")[i].textContent = this.tariffes[i].price + '₴';

            document.querySelectorAll(".buyBtn")[i].addEventListener("click", () => {
                fetch('http://localhost:7070/data/user')
                    .then((response) => response.json())
                    .then((data) => {
                        this.user = data;
                        /*if(this.user.balance < this.tariffes[i].price){
                            alert('You do not have enough money on your balance.');
                            return;
                        }*/

                        let hasThisTariffType = false;
                        for(let j = 0; j < this.user.active_services.length; j++){
                            const tariffId = this.user.active_services[j];
                            let currentTariff;
                            for(let k = 0; k < this.tariffes.length; k++) {
                                if(tariffId == this.tariffes[k]._id){
                                    currentTariff = this.tariffes[k];
                                    if(currentTariff.type == this.tariffes[i].type){
                                        hasThisTariffType = true;
                                        break;
                                    }
                                    break;
                                }
                            }
                        }
        
                        if(hasThisTariffType){
                            alert('You have already purchased packet for ' + this.tariffes[i].type + '.');
                        } else {  
                            let purchaseConfirm = confirm('Do you confirm the purchase of the tariff plan ' + this.tariffes[i].name + '?');
                            if(purchaseConfirm){
                                let xhr = new XMLHttpRequest(); // creating the instance of XMLHttpRequest object
        
                                // method open initializes request, takes 3 arguments
                                xhr.open("POST", // HTTP method
                                    "/buy/tariff",  // URL that the request will be sent to
                                    true); // the request should be made asynchronously or not
                                xhr.setRequestHeader("Content-Type", "application/json"); // tells the server that the request body will contain JSON data
        
                                // send method is used to send the request to the server
                                xhr.send(JSON.stringify(this.tariffes[i])); // the argument is a stringified version of the 'choosenTariff' object, which will be sent in the request body as JSON
                            }
                        }
                });
            });  
        }
    }

    displayMyActiveTariffes() {
        let temp = document.getElementsByTagName('template')[0];

        for(let i = 0; i < this.tariffes.length; i++){
            let tariffBlock = temp.content.cloneNode(true); // refers to a deep clone that creates an exact copy of the original node, including its child nodes and attributes
            document.querySelector('#tariffesDisplayBlock').append(tariffBlock);
            
            document.querySelectorAll(".tariffType")[i].textContent = this.tariffes[i].type;
            document.querySelectorAll(".tariffName")[i].textContent = this.tariffes[i].name;
            document.querySelectorAll(".tariffDescription")[i].textContent = this.tariffes[i].description;
            document.querySelectorAll(".tariffPrice")[i].textContent = 'Price: ' + this.tariffes[i].price + '₴';

            document.querySelectorAll(".deactivateBtn")[i].addEventListener("click", () => {
                fetch('http://localhost:7070/data/user')
                    .then((response) => response.json())
                    .then((data) => {
                        this.user = data;

                        
                        let deactivateConfirm = confirm('Do you confirm the deactivate of the tariff plan ' + this.tariffes[i].name + '?');
                        if(deactivateConfirm){
                            let xhr = new XMLHttpRequest();

                            xhr.open("PUT", window.location.pathname + '/' + this.tariffes[i]._id, true);
                            xhr.setRequestHeader("Content-Type", "application/json");

                            xhr.send(JSON.stringify(this.tariffes[i]));
                        }
                    });
            });  
        }
    }

    sortTariffesByPrice() {
        document.querySelector('#tariffesDisplayBlock').innerHTML = "";
        this.tariffes.sort((a, b) => a.price - b.price);
    }

    sortTariffesByName() {
        document.querySelector('#tariffesDisplayBlock').innerHTML = "";
        this.tariffes.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    }

    sortTariffesByNameDesc(){
        document.querySelector('#tariffesDisplayBlock').innerHTML = "";
        this.tariffes.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.tariffes.reverse();
    }

    displayTariffesInTable(){
        for(let i = 0; i < this.tariffes.length; i++){
            let tableRow = document.createElement('tr');

            let typeTd = document.createElement('td');
            typeTd.innerText = this.tariffes[i].type;
            tableRow.appendChild(typeTd);

            let nameTd = document.createElement('td');
            nameTd.innerText = this.tariffes[i].name;
            tableRow.appendChild(nameTd);

            let priceTd = document.createElement('td');
            priceTd.innerText = this.tariffes[i].price;
            tableRow.appendChild(priceTd)

            let editTd = document.createElement('td');
            let editBtn = document.createElement('button');
            editBtn.classList.add('tableBtn');
            editBtn.classList.add('editBtn');
            editBtn.addEventListener('click', () => this.#editTariff(i));
            editBtn.innerText = 'Edit';
            editTd.appendChild(editBtn);
            tableRow.appendChild(editTd);

            let deleteTd = document.createElement('td');
            let deleteBtn = document.createElement('button');
            deleteBtn.classList.add('tableBtn');
            deleteBtn.classList.add('deleteBtn');
            deleteBtn.addEventListener('click', () => this.#deleteTariff(i));
            deleteBtn.innerText = 'Delete';
            deleteTd.appendChild(deleteBtn);
            tableRow.appendChild(deleteTd);

            document.querySelector('table').appendChild(tableRow);   
        }
    }

    #editTariff(index) {
        let tariffId = this.tariffes[index]._id;

        window.location.href = window.location.pathname + `/edit-tariff/${tariffId}`;
    }

    #deleteTariff(index) {
        let deleteConfirm = confirm('Are you sure that you want to delete tariff ' + this.tariffes[index].name + "?");
        if(!deleteConfirm)
            return;

        let xhr = new XMLHttpRequest();

        xhr.open("DELETE", window.location.pathname + '/' + this.tariffes[index]._id, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(JSON.stringify(this.tariffes[index]));
    }
}

// * ReadyState property holds the status if the XMLHttpRequest.
// 0: request not initialized = XMLHttpRequest.UNSENT: client has been created, open() not called yet;
// 1: server connection extablished = XMLHttpRequest.OPENED: open() has been called;
// 2: request received = XMLHttpRequest.HEADERS_RECEIVED:  send() has been called, and headers and status are available
// 3: processing request = XMLHttpRequest.LOADING: downloading, responseText holds partial data
// 4: request finished and response is ready = XMLHttpRequest.DONE: the operation is complete
// XMLHttpRequest.readyState property returns the state an XMLHttpRequest client is in. 
// So basically it is the list of all states in which an XHR client excists.
