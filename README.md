# SEproject

First of all, execute the first file (1-Create Schema Admin) on Oracle SQL developer to create the admin user of the database. Then, login as admin_user as defined in the script. Finally, execute the two other files (2-Create Tables Automations Users & 3-Load Tables) to create tables, triggers, functions/procedures, other users and load the tables.

Once you cloned the project :

1- Install npm packages (npm install in frontend/backend/root)

2- Install Concurrently package in the root (npm install concurrently --save-dev)

2- Type "npm start" in your cmd. It will launch the backend server and the frontend.

3- You can explore the tables information from the database via the frontpage (on http://localhost:4200).

If you have issue with the database, verify you already have the Oracle SQL database configured and the right login host/user/password as defined in your database.
