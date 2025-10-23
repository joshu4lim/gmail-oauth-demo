# gmail-oauth-demo
A simple two-page web app that lets users sign in with Google and send emails via the Gmail API.

## How to Run the Demo
### Running Locally
1. Clone the repo
2. Install dependencies (npm install)
3. Create an .env file in the project's root and fill in variables:
- GOOGLE_CLIENT_ID=\<your-client-id\>
- GOOGLE_CLIENT_SECRET=\<your-client-secret\>
- REDIRECT_URI=http://localhost:3000/redirect
4. Start the server (node server.js)
5. Open and visit http://localhost:3000

### Running Online (Render)
1. Clone the repo
2. Go to https://render.com and create a free account
3. Click on "New Web Service"
4. Configure 
- Build Command: npm install
- Start Command: node server.js
5. Fill in env variables:
- GOOGLE_CLIENT_ID=\<your-client-id\>
- GOOGLE_CLIENT_SECRET=\<your-client-secret\>
- REDIRECT_URI=http://\<render link\>/redirect
6. Deploy!

## How Does it Work?

1. User clicks the login button on the main page. It redirects the user to Google's OAuth login and consent page, requesting a token.
\*While logging in, there will be a warning sign since the client isn't verified by Google. You can proceed by clicking on "Advanced.\*
2. Once the user gives permission and logs-in, Google gives the user a temporary authorization code. The server then exchanges this code for a token that is used to call the Gmail API. The user is also redirected to the page to send the email.
3. User fills out the form and submits it and let's the server know through the /send route. The server formats the email and sends it using the Gmail API.

## Frameworks and Libraries Used
- HTML / CSS / JavaScript - Frontend
- Node.js - Backend
- Express - Framework for Node.js
- googleapis - Official Google API client for Node.js
- dotenv - Loads environment variables from .env

## Limitations and Future Improvements
- Tokens are not saved, so restarting it requires the user to re-login
- Client isn't verified, so there is a warning page.
- It doesn't handle multiple users.

Main improvement I see would be saving token into a cookie or a session, better UI, and supporting multiple users. 