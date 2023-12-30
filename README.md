# Gmail Auto-Reply System
## Setting Up Google API Credentials

1. **Google Cloud Console**:
   - Visit [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.

2. **Enable Gmail API**:
   - Navigate to "APIs & Services > Dashboard".
   - Click "ENABLE APIS AND SERVICES", search for "Gmail API" and enable it.

3. **Create Credentials**:
   - Go to "APIs & Services > Credentials".
   - Click "Create credentials" and select "OAuth client ID".
   - Set the application type, then add your redirect URIs.

4. **Download Credentials**:
   - Once created, download the JSON file.
   - Place this file in your project directory and rename it to `credentials.json`.

5. **Install Google API Node.js Client**:
   - Run `npm install googleapis`.

After completing these steps, your application will be ready to authenticate using Google API credentials.

## Description
This Node.js application automates responses to unread emails in a Gmail account. It's specifically designed to handle emails while you're away, responding only to those without previous replies.

## Usage
1. **Clone the Repository**:
   git clone https://github.com/himanshushukla12/gmailAutomation.git
2. **Navigate to the Project Directory**:
   ```
   cd gmailAutomation
   ```
4. **Install Dependencies**:
   ```
   npm install
6. **Set Up Google API Credentials**:
- Enable the Gmail API in the Google Developer Console.
- Download `credentials.json` and place it in the project directory.

5. **Run the Application**:
   ```
   node index.js
Follow the prompts for Google authentication.

## Features
- Replies to new, unread emails without previous responses.
- Manages labels in Gmail for organized replies.
## Improvements
- Need proper UI to make it ueasy to use
- Need to run the code indefinately till it is not manually closed
- Can not handle the rate limit, which throws exception
## Contributing
Contributions are welcome. Please follow the project's code standards and guidelines.

## License
This project is licensed under the MIT License.
