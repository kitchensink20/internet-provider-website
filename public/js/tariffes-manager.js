class TariffesManager{

    //---------concructor-------------------------------

    constructor(tariffes){
        this.tariffes = tariffes;
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

                        let hasThisTariffType = false;
                        for(let j = 0; j < this.user.active_services.length; j++){
                            const tariffId = this.user.active_services[j];
                            let currentTariff;
                            for(let k = 0; k < this.tariffes.length; k++)
                                if(tariffId == this.tariffes[k]._id){
                                    currentTariff = this.tariffes[k];
                                    break;
                                }
                            if(currentTariff.type == this.tariffes[i].type){
                                hasThisTariffType = true;
                                break;
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

                            xhr.open("PUT", "/admin-menu/my-active-tariffes/" + this.tariffes[i]._id, true);
                            xhr.setRequestHeader("Content-Type", "application/json");

                            /*xhr.onreadystatechange = function () { 
                                if(xhr.readyState === 4 && xhr.status === 200) { // request was completed && request was successfull
                                    console.log('fnsk');
                                    document.querySelector('#tariffesDisplayBlock').innerHTML = "";
                                    this.displayMyActiveTariffes();
                                }
                            }*/

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
}

// * ReadyState property holds the status if the XMLHttpRequest.
// 0: request not initialized = XMLHttpRequest.UNSENT: client has been created, open() not called yet;
// 1: server connection extablished = XMLHttpRequest.OPENED: open() has been called;
// 2: request received = XMLHttpRequest.HEADERS_RECEIVED:  send() has been called, and headers and status are available
// 3: processing request = XMLHttpRequest.LOADING: downloading, responseText holds partial data
// 4: request finished and response is ready = XMLHttpRequest.DONE: the operation is complete
// XMLHttpRequest.readyState property returns the state an XMLHttpRequest client is in. 
// So basically it is the list of all states in which an XHR client excists.
