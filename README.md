# task-manager-client
Client to interact with the task manager api

Some useful code for the postman-client:

// Stores authToken after Login
if (pm.response.code == 200) {
    pm.environment.set('authToken', pm.response.json().token)
}
