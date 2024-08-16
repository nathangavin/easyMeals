#Flows

- Nathan Gavin

=======================
* person creates new account
* User is created in DB
* person is forced to login
* login session token is created in DB and linked to User
* session token is returned and stored in cookie
* person edits User
* user update request is authenticated against session
* person logs out
* log out request is authenticated
* session token is deleted from DB


=======================
* person logs in
* session token is created in DB, linked to User
* session token is returned and stored in cookie
* person creates new recipe
* Recipe is created in DB, draft flag set to true
* User is linked to new Recipe


=======================
* person logs in
* session token retrieved
* person edits recipe
* person creates new instruction in recipe
* person creates new ingredients for instruction
* person adds quantities of new ingredients
* person looks up Units for each quantity


=======================
* person logs in
* session token retrieved
* person finishes recipe by adding all instructions
* recipe is published
* person is required to rank recipe


=======================
* person logs in
* session token retrieved
* person creates new Pantry
* User is linked to Pantry
* person adds ingredient quantities to Pantry
* person looks up existing ingredients

