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
                let xhr = new XMLHttpRequest();

                xhr.open("POST", "/buy/tariff", true);
                xhr.setRequestHeader("Content-Type", "application/json");

                xhr.onreadystatechange = function () {
                    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
                        console.log("Data")
                }

                const choosenTariff = this.tariffes[i];

                console.log(choosenTariff);

                xhr.send(JSON.stringify(choosenTariff));
            });
        }
    }

    sortTariffesByPrice(){
        document.querySelector('#tariffesDisplayBlock').innerHTML = "";
        this.tariffes.sort((a, b) => a.price - b.price);
        this.displayTariffes();
    }

    sortTariffesByName(){
        document.querySelector('#tariffesDisplayBlock').innerHTML = "";
        this.tariffes.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.displayTariffes();
    }

    sortTariffesByNameDesc(){
        document.querySelector('#tariffesDisplayBlock').innerHTML = "";
        this.tariffes.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.tariffes.reverse();
        this.displayTariffes();
    }
}