let usersManager;

fetch('http://localhost:7070/data/users')
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        usersManager = new UsersManager(data);
        usersManager.displayUsersInTable();
    })
    .catch((error) => {
        console.error('Error: ', error);
    });