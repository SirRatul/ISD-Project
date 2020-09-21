const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = ( email , Token) => {
    sgMail.send({
        to: email ,
        from: 'jahid.aust39@gmail.com' ,
        subject: 'Confirm Your mail !' ,
        text: 'You are receiving this because you (or someone else) have requested to create account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        process.env.FRONTEND_URL+'confirmation/' + Token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'  
    }).then(() => {
    }).catch((error) => {
        console.log(error)
    })
}

// Manually Pateint Account Creation Email
const sendRequestEmail = ( email , Token) => {
    sgMail.send({
        to: email,
        from: 'jahid.aust39@gmail.com',
        subject: 'Confirm Your Account!',
        text: 'You are receiving this because you (or someone else) have requested to create account.\n\n' +
        'Please click on the following link and give passwords to create your account \n\n' +
        process.env.FRONTEND_URL+'setPasswordForNewPatient/' + Token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'  
    }).then(() => {
    }).catch((error) => {
        console.log(error)
    })
}

// Password Reset Confirmation Email
const sendResetEmail = ( email , token) => {
    sgMail.send({
        to: email ,
        from: 'jahid.aust39@gmail.com',
        subject: 'Password Reset For Smart Nurse!',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          process.env.FRONTEND_URL+'resetPassword/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    }).then(() => {
    }).catch((error) => {
        console.log(error)
    })
}

/* const sendCancelationEmail =( email , name) => {
    sgMail.send({
        to: email,
        from: 'jahid.aust39@gmail.com',
        subject: 'Sorry to see you go!',
        text: 'Goodbye sd. I hope to see you back sometime soon.' 
    }).then(() => {
    }).catch((error) => {
        console.log(error)
    })
} */

// Time Format Function
const timeFormat = (timeString) => {
    var time = timeString.split(':');
    var hour = time[0] % 12 || 12;
    var minute = time[1];
    var ampm = (time[0] < 12 || time[0] === 24) ? "AM" : "PM";
    return hour+':'+minute + ' '+ampm;
}

// Routine Missed Email
const sendRoutineMissedEmail =( email , routine, guardianName, patientName) => {
    let emailBody = 'Hello, Mr./ Mrs. '+guardianName+',\nYour patient is not following the daily routine. He has missed these activities listed below:\n'
    routine.sort(function (a, b) {
        return a.notificationTime.time.localeCompare(b.notificationTime.time);
    });
    routine.forEach((element) => {
        emailBody = emailBody + element.notificationArray.itemName + ' ' + timeFormat(element.notificationTime.time)+'\n'
    })
    emailBody = emailBody + 'Please contact with your patient as soon as possible.\nWith best regards,\nSmart Nurse Team'
    sgMail.send({
        to: email,
        from: 'jahid.aust39@gmail.com',
        subject: 'Your patient '+patientName+ ' has missed several daily routines in a row.',
        text: emailBody
    }).then(() => {
    }).catch((error) => {
        console.log(error)
    })
}

module.exports = {
    sendWelcomeEmail ,
    // sendCancelationEmail ,
    sendResetEmail ,
    sendRequestEmail,
    sendRoutineMissedEmail
}