# Instruction

1. Clone the repository using the respective GIT command line utility. This involves copying all the code from the remote repository to your local machine.
2. Find the file named `appsettings.json` in the `/backend` directory. Open this file and find a line with `DefaultConnection`. Replace the string value associated with this with your own Postgres credentials.

3. In the main folder (the one containing both backend and frontend folders), open your command line or terminal window.
4. Be sure to wait for each command to finish before proceeding to the next.

   1. `cd backend`
   2. `dotnet ef database update`
   3. `cd ..`
   4. `cd frontend`
   5. `npm install`
   6. `npx prisma db push`
   7. `npx prisma db seed`
   8. `npm run dev` (this will start the frontend server)

5. Now go to Visual Studio and open the backend project. Click on the `Run` button, this will start the application server (it will run on port 5095).
6. Now go back to your terminal. Ensure you are in the `/frontend` directory. Run the command `npm run dev` to start the server.

This completes the initial setup. For future uses, you only need to:

1. Start the backend in Visual Studio.
2. Start the frontend by navigating to the `/frontend` directory in the terminal and running `npm run dev`.
