class UsersManager{

    //---------concructor-------------------------------

    constructor(users){
        this.users = users;
    }

    //--------methods-----------------------------------

    displayUsersInTable(){
        for(let i = 0; i < this.users.length; i++){
            let tableRow = document.createElement('tr');

            let nameTd = document.createElement('td');
            nameTd.innerText = this.users[i].username;
            tableRow.appendChild(nameTd);

            let emailTd = document.createElement('td');
            emailTd.innerText = this.users[i].email;
            tableRow.appendChild(emailTd);

            let balanceTd = document.createElement('td');
            balanceTd.innerText = this.users[i].balance;
            tableRow.appendChild(balanceTd);

            let adminTd = document.createElement('td');
            if(this.users[i].admin)
                adminTd.innerText = "+";
            else
                adminTd.innerText = "-";
            tableRow.appendChild(adminTd);

            let statusTd = document.createElement('td');
            if(this.users[i].active)
                statusTd.innerText = "active";
            else
                statusTd.innerText = "banned";
            tableRow.appendChild(statusTd);

            let blockTd = document.createElement('td');
            let blockBtn = document.createElement('button');
            blockBtn.classList.add('tableBtn');
            if(this.users[i].active) {
                blockBtn.innerText = 'Block';
                blockBtn.classList.add('blockBtn');
            }
            else {
                blockBtn.innerText = 'Unblock';
                blockBtn.classList.add('unblockBtn');
            }
            blockTd.appendChild(blockBtn);
            tableRow.appendChild(blockTd);

            document.querySelector('table').appendChild(tableRow);   
        }
    }   
}