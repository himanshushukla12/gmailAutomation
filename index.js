const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');
function loadClientSecrets() {
    const credentials = fs.readFileSync('credentials.json');
    authorize(JSON.parse(credentials));
  }
  
function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile('token.json', (err, token) => {
    if (err) return getAccessToken(oAuth2Client);
    oAuth2Client.setCredentials(JSON.parse(token));
    // Call Gmail API after successful authentication
  });
}
function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/gmail.modify'],
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFileSync('token.json', JSON.stringify(token));
        // Call Gmail API
      });
    });
  }
  
async function main() {
    // Application logic will go here
}

main().catch(console.error);
