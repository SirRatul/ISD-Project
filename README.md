# Smart Nurse

Smart Nurse is an advanced system where you can get all your medical solutions in one place developed using React, Node, Express and MongoDB.

### Version: 1.0.0


What our website solves:
Our website provides nursing services to the users when they are ill. There are patient and guardian type users where the guardian can add his/her patient and set their daily routines. Patient’s each routine activity can be notified by both guardian and patient via google calendar event and website notification. And when the patient ignores routine activities serially, the guardian will be warned via email. Overall, our website helps a patient to strictly follow his/her routine activities so that he/she can get well soon. 


Installation Process: 


For running this project at first you have to install both react and node js in your pc. 


* How to Install Node.js and NPM on Windows
   * Step 1: Download Node.js Installer In a web browser, navigate to https://nodejs.org/en/download/. Click the Windows Installer button to download the latest default version. At the time this article was written, version 10.16.0-x64 was the latest version. The Node.js installer includes the NPM package manager.
   * Step 2: Install Node.js and NPM from Browser. Once the installer finishes downloading, launch it. Open the downloads link in your browser and click the file. Or, browse to the location where you have saved the file and double-click it to launch.
      * The system will ask if you want to run the software – click Run.
      * You will be welcomed to the Node.js Setup Wizard – click Next.
      * On the next screen, review the license agreement. Click Next if you agree
to the terms and install the software.
      * The installer will prompt you for the installation location. Leave the default
location, unless you have a specific need to install it somewhere else – then click Next.
      * The wizard will let you select components to include or remove from the
installation. Again, unless you have a specific need, accept the defaults by clicking Next.
      * Finally, click the Install button to run the installer. When it finishes, click Finish.
   * Step 3: Verify Installation: 
      * Open a command prompt (or PowerShell), and enter the following:
         * node –v   (The system should display the Node.js version installed on your system.)
      * The system should display the Node.js version installed on your system.
You can do the same for NPM:
* $ npm –v


* Then  you have to run ”npm install “ for both frontend & backend. Backend Code location is the root folder. Frontend code is in the client folder. 


* Then you have to run the ‘npm run dev’ command in the root folder. For Security Issues we could not add the .env file and google calendar api keys sharing file in this repository. Without .env files someone cannot run our project. If you want to run this project, then you can contact to ‘170104103@aust.edu’.

[Live Demo](https://smart-nurse-bd.web.app/)