async function hasBeenRepliedTo(threadId, auth) {
    const gmail = google.gmail({version: 'v1', auth});
    const res = await gmail.users.threads.get({userId: 'me', id: threadId});
    const messages = res.data.messages;
    return messages.some(message => message.labelIds.includes('SENT'));
  }
  
  // Function to create a label if it does not exist
  async function ensureLabelExists(auth, labelName) {
    const gmail = google.gmail({version: 'v1', auth});
    const existingLabelsRes = await gmail.users.labels.list({userId: 'me'});
    const existingLabels = existingLabelsRes.data.labels;
    let labelId = existingLabels.find(label => label.name === labelName)?.id;
  
    if (!labelId) {
      const createLabelRes = await gmail.users.labels.create({
        userId: 'me',
        requestBody: {name: labelName}
      });
      labelId = createLabelRes.data.id;
    }
  
    return labelId;
  }
const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');
function loadClientSecrets() {
    const credentials = fs.readFileSync('credentials.json');
    authorize(JSON.parse(credentials));
  }
  
  async function authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  
    let token;
    try {
      token = fs.readFileSync('token.json');
    } catch (err) {
      token = await getAccessToken(oAuth2Client);
    }
  
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client; // Return the authenticated client
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
  async function checkNewEmails(auth) {
    const gmail = google.gmail({version: 'v1', auth});
    const res = await gmail.users.messages.list({
      userId: 'me',
      labelIds: 'INBOX',
      q: 'is:unread',
      maxResults: 20
    });
  
    const messages = res.data.messages;
    if (messages && messages.length) {
      console.log('New emails found!');
      // Process each message
      messages.forEach(message => {
        processEmail(message, auth);
      });
    } else {
      console.log('No new emails found.');
    }
  }

async function processEmail(message, auth) {
    const replied = await hasBeenRepliedTo(message.threadId, auth);
    if (!replied) {
      // Reply to the email with a vacation message
      await replyToEmail(message, auth, "I'm On Vacation");
  
      // Ensure label exists and get its ID
      const labelId = await ensureLabelExists(auth, 'AutoReplied');
      
      // Add label to the email
      await addLabelToEmail(message.id, labelId, auth);
    }
  }
  
  async function replyToEmail(message, auth, replyText) {
    const gmail = google.gmail({version: 'v1', auth});
    const emailDetails = await gmail.users.messages.get({
      userId: 'me',
      id: message.id
    });
  
    const subject = 'Re: ' + emailDetails.data.payload.headers.find(header => header.name === 'Subject').value;
    const to = emailDetails.data.payload.headers.find(header => header.name === 'From').value;
    const body = `From: me\nTo: ${to}\nSubject: ${subject}\n\n${replyText}`;
  
    // Encode email in base64
    const encodedMessage = Buffer.from(body).toString('base64');
  
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });
  
    console.log('Replied to email:', subject);
  }
  
  async function addLabelToEmail(emailId, labelId, auth) {
    const gmail = google.gmail({version: 'v1', auth});
    await gmail.users.messages.modify({
      userId: 'me',
      id: emailId,
      requestBody: {
        addLabelIds: [labelId]
      }
    });
  
    console.log('Label added to email ID:', emailId);
  }
  
  async function main() {
    const credentials = JSON.parse(fs.readFileSync('credentials.json'));
    const auth = await authorize(credentials); // Await the auth client
  
    setInterval(async () => {
      console.log("Checking for new emails...");
      await checkNewEmails(auth); // Call with the correct auth variable
    }, getRandomInterval(45000, 120000));
  }
  main();
  
  
  function getRandomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  
 
  