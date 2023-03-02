class UsersManager{

    //---------concructor-------------------------------

    constructor(users){
        this.users = users;
    }

    //--------methods-----------------------------------

    displayUsersInTable(){
        let users = this.users;
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
            if(!this.users[i].admin){
                blockBtn.classList.add('tableBtn');
                if(this.users[i].active) {
                    blockBtn.innerText = 'Block';             
                    blockBtn.classList.add('blockBtn');
                    blockBtn.addEventListener("click", blockUserHandler);
                }
                else {
                    blockBtn.innerText = 'Unblock';             
                    blockBtn.classList.add('unblockBtn');
                    blockBtn.addEventListener("click", unblockUserHandler);
                }
                blockTd.appendChild(blockBtn);
            }
            tableRow.appendChild(blockTd);

            document.querySelector('table').appendChild(tableRow); 
            
            function blockUserHandler() {
                console.log('block');
                let blockConfirm = confirm('Are you sure that you want to block the user ' + users[i].username + "?");
                if(!blockConfirm) return;

                let xhr = new XMLHttpRequest();

                xhr.open("PUT", window.location.pathname + '/block/' + users[i]._id, true);
                xhr.setRequestHeader("Content-Type", "application/json");

                xhr.send(JSON.stringify(users[i]));

                blockBtn.innerText = 'Unblock';
                blockBtn.classList.remove('blockBtn');               
                blockBtn.classList.add('unblockBtn');
                statusTd.innerText = 'banned';
                blockBtn.addEventListener("click", unblockUserHandler);
                blockBtn.removeEventListener("click", blockUserHandler);
            }

            function unblockUserHandler() {
                let unblockConfirm = confirm('Are you sure that you want to unblock the user ' + users[i].username + "?");
                if(!unblockConfirm) return;

                let xhr = new XMLHttpRequest();

                xhr.open("PUT", window.location.pathname + '/unblock/' + users[i]._id, true);
                xhr.setRequestHeader("Content-Type", "application/json");

                xhr.send(JSON.stringify(users[i]));

                blockBtn.innerText = 'Block';
                blockBtn.classList.remove('unblockBtn');               
                blockBtn.classList.add('blockBtn');
                statusTd.innerText = 'active';
          
                blockBtn.addEventListener("click", blockUserHandler);
                blockBtn.removeEventListener("click", unblockUserHandler);
            }
        }
    }  
}