const express = require('express');
const router = express.Router();;
const moment = require('moment')
const Routine = require('../models/Routine');
const User = require('../models/User');

// Routine Create
router.post('/routine/:userId' , async (req, res) =>{
    // let owner = req.params.userId
    const ownerDetails = await User.findOne({ _id: req.params.userId });
    // console.log(ownerDetails)
    let owner
    if(ownerDetails.guardianList.length === 0 && ownerDetails.patientList.length === 0){
        return res.status(404).json({
            message: 'You have to become a guardian of a user or yourself Or You have to become a patient of a user or yourself to create a routine.'
        })
    } else if(ownerDetails.guardianList.length > 0 && ownerDetails.patientList.length > 0) {
        owner = [{
            guardian: [{
                guardianId: ownerDetails._id,
                guardianName: ownerDetails.firstname + " " + ownerDetails.lastname,
                guardianEmail: ownerDetails.email
            }],
            patient: [{
                patientId: ownerDetails._id,
                patientName: ownerDetails.firstname + " " + ownerDetails.lastname,
                patientEmail: ownerDetails.email
            }]
        }]
    } else if(ownerDetails.guardianList.length > 0) {
        const guardianDetails = await User.findOne({ _id: ownerDetails.guardianList[0].guardianId });
        owner = [{
            guardian: [{
                guardianId: guardianDetails._id,
                guardianName: guardianDetails.firstname + " " + guardianDetails.lastname,
                guardianEmail: guardianDetails.email
            }],
            patient: [{
                patientId: ownerDetails._id,
                patientName: ownerDetails.firstname + " " + ownerDetails.lastname,
                patientEmail: ownerDetails.email
            }]
        }]
    } else if(ownerDetails.patientList.length > 0) {
        const patientDetails = await User.findOne({ _id: ownerDetails.patientList[0].patientId });
        owner = [{
            guardian: [{
                guardianId: ownerDetails._id,
                guardianName: ownerDetails.firstname + " " + ownerDetails.lastname,
                guardianEmail: ownerDetails.email
            }],
            patient: [{
                patientId: patientDetails._id,
                patientName: patientDetails.firstname + " " + patientDetails.lastname,
                patientEmail: patientDetails.email
            }]
        }]
    }
    /* console.log('Owner:')
    console.log(owner[0].guardian[0])
    console.log(owner[0].patient[0]) */
    const startDate  = moment(req.body.startDate, "YYYY-MM-DD")
    const endDate  = moment(req.body.endDate, "YYYY-MM-DD")
    var today = new Date();
    today = today.getFullYear() + '/' + String(today.getMonth() + 1).padStart(2, '0') + '/' + String(today.getDate()).padStart(2, '0');
    today = moment(today, "YYYY/MM/DD")
    if(moment(startDate).isBefore(today) && moment(endDate).isBefore(today)){
        return resstatus(404).json({
            message: 'Routine cannot create successfully because you have selected previous date'
        })
    }
    if(!moment(startDate).isSameOrBefore(endDate)){
        return res.status(404).json({
            message: 'Start Date should not be greater than End Date.'
        })
    }
    /* if(req.user){
        owner = req.user._id
    } else {
        owner = req.body.owner
    } */
    const statusDay = [];
    const statusTime = [];
    const dateDifference = endDate.diff(startDate, 'days') + 1
    Array.from({ length: req.body.timesPerDay }, (v, k) => (
        statusTime.push({
            done: false,
            visible: true
        })
    ))
    Array.from({ length: dateDifference }, (v, k) => (
        statusDay.push({
            statusTime
        })
    ))
    /* return res.status(201).json({
        message: 'Successful'
    }) */
    const routine = new Routine({
        ...req.body,
        statusDay,
        owner
    })
    try{
        await routine.save()
        res.status(201).json({
            message: 'Routine Added Successfully',
            routine
        })
    } catch(error){
        res.status(400).json({
            message: error
        })
    }
})

/* router.get('/routine' , async (req, res) => {
    const routine = await Routine.find({})

    try{
        if(!routine){
            return res.status(404).send()
        }

        res.send(routine)

    }catch(e){
        res.status(500).send(e)
    }
}) */

// Routine List of User
router.get('/routines/:userId' , async (req, res) =>{
    let userId = req.params.userId
    
    try{
        const user = await User.findOne({
            _id: req.params.userId
        });
        let routine
        if(user.guardianList.length > 0 && user.patientList.length > 0){
            routine = await Routine.find({"owner.guardian.guardianId": userId, "owner.patient.patientId": userId})
        } else if(user.guardianList.length === 0 && user.patientList.length === 0){
            return res.status(404).json({
                message: "You are not guardian or patient of any user. So you don't have any routine."
            })
        } else if(user.guardianList.length > 0){
            routine = await Routine.find({"owner.patient.patientId": userId})
        } else if(user.patientList.length > 0){
            routine = await Routine.find({"owner.guardian.guardianId": userId})
        }
        // const routine = await Routine.find({owner: {guardian: {guardianId: userId}}})
        if (routine === undefined || routine.length == 0) {
            return res.status(404).json({
                message: "Routine not found"
            })
        }
        return res.status(200).json({
            routine
        })
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
})

// Routine Details
router.get('/routine/:routineId' , async (req, res) =>{
    const _id=req.params.routineId
    try{
        const routine = await Routine.findOne({_id })
        if(!routine){
            return res.status(404).send()
        }
        res.send(routine)
        
    }catch(e){
        res.status(500).send(e)
    }
})

// Routine Update
router.patch('/routine/:routineId' , async ( req , res) => {
    //const _id = req.params.routineId
    const updates = Object.keys(req.body)
    const allowedupdates = ['routineItem', 'itemName' , 'unit' , 'startDate' , 'endDate' , 'timesPerDay' , 'beforeAfterMeal' , 'times' ,'notification' ,'notificationFor' ]
    const isValidOperation = updates.every((update) => allowedupdates.includes(update))

    if(!isValidOperation){
        return res.status(400).json({ 
            message: 'Invalid updates!'
        })
    }

    try{
        const routine = await Routine.findOne({ _id: req.params.routineId })
        // console.log(routine)
        var today = new Date();
        // var time = moment(new Date()).format("HH:mm")
        today = today.getFullYear() + '/' + String(today.getMonth() + 1).padStart(2, '0') + '/' + String(today.getDate()).padStart(2, '0');
        today = moment(today, "YYYY/MM/DD")
        if(!routine){
            return res.status(404).json({ 
                message: 'Routine not found'
            })
        }
        let statusDay = [];
        let statusTime = [];
        const startDate  = moment(req.body.startDate, "YYYY-MM-DD")
        const endDate  = moment(req.body.endDate, "YYYY-MM-DD")
        if(moment(startDate).isBefore(today) && moment(endDate).isBefore(today)){
            console.log('ifmoment0')
            return res.json({
                message: 'Routine cannot updated successfully because you have selected previous date'
            })
        }
        if(startDate && endDate && req.body.timesPerDay){
            if(routine.timesPerDay == req.body.timesPerDay &&  moment(routine.endDate, "YYYY-MM-DD").diff(moment(routine.startDate, "YYYY-MM-DD"), 'days') + 1 ==  moment(endDate, "YYYY-MM-DD").diff( moment(startDate, "YYYY-MM-DD"), 'days') + 1){
                for(var i = 0; i < routine.times.length; i++){
                    console.log(routine.times[i].time)
                    console.log(req.body.times[i].time)
                    console.log(moment(today).isBefore(startDate))
                    console.log(moment(today).isBefore(endDate))
                    if(moment(today).isBefore(startDate) && moment(today).isBefore(endDate) || moment(today).isSame(startDate)){
                        console.log('ifmoment1')
                        if(routine.times[i].time != req.body.times[i].time){
                            routine.statusDay.forEach((item) => {
                                // console.log(item.statusTime[i])
                                item.statusTime[i].done = false
                                item.statusTime[i].visible = true
                            })
                        }
                    }
                    if(moment(today).isSame(endDate)){
                        console.log('ifmoment2')
                        if(routine.times[i].time != req.body.times[i].time){
                            console.log(routine.statusDay[routine.statusDay.length - 1])
                            routine.statusDay[routine.statusDay.length - 1].statusTime[i].done = false
                            routine.statusDay[routine.statusDay.length - 1].statusTime[i].visible = true
                        }
                    }
                    
                }
                updates.forEach((update) => routine[update] = req.body[update])
                await routine.save()
                return res.json({
                    message: 'Routine updated successfully'
                })
            } else {
                    console.log('if:')
                    console.log(routine.statusDay)
                    console.log('PreviousArray Length:'+routine.statusDay.length)
                    /* for(var i = 0; i < req.body.timesPerDay; i++){
                        console.log(routine.times[i].time)
                        console.log(req.body.times[i].time)
                        var time1 = moment(req.body.times[i].time).format("HH:mm")
                        console.log(moment(time1).isSameOrAfter(time))
                    } */
                    let newArray = routine.statusDay.splice(0, moment(today, "YYYY-MM-DD").diff(moment(routine.startDate, "YYYY-MM-DD"), 'days'));
                    console.log('NewArray:')
                    console.log(newArray)
                    console.log('NewArray Length:'+newArray.length)
                    Array.from({ length: req.body.timesPerDay }, (v, k) => (
                        statusTime.push({
                            done: false,
                            visible: true
                        })
                    ))
                    /* console.log('StatusTime:')
                    console.log(statusTime)
                    console.log('StatusTime Length:'+statusTime.length) */
                    Array.from({ length: (moment(req.body.endDate, "YYYY-MM-DD").diff(moment(req.body.startDate, "YYYY-MM-DD"), 'days') + 1) - (moment(today, "YYYY-MM-DD").diff(moment(routine.startDate, "YYYY-MM-DD"), 'days')) }, (v, k) => (
                        statusDay.push({
                            statusTime
                        })
                    ))
                    /* console.log('StatusDay:')
                    console.log(statusDay)
                    console.log('StatusDay Length:'+statusDay.length) */
                    statusDay = newArray.concat(statusDay);
                    console.log('After Concat:')
                    console.log('StatusDay:')
                    // console.log(statusDay)
                    statusDay.forEach((item) => {
                        console.log(item)
                    })
                    console.log('StatusDay Length:'+statusDay.length)
                /* if(moment(today, "YYYY-MM-DD").diff(moment(routine.startDate, "YYYY-MM-DD"), 'days') == 0){
                } else */ /* if(moment(today, "YYYY-MM-DD").diff(moment(routine.startDate, "YYYY-MM-DD"), 'days') > 0){ */
                    // console.log('PreviousArray Length:'+routine.statusDay.length)
                    
                    // updates.forEach((update) => routine[update] = req.body[update])
                    // routine.statusDay = statusDay
                    // await routine.save()
                    return res.json({  
                        message: 'Routine updated successfully'
                    })
                /* } else{
                    console.log('else')
                } */
                // console.log('Difference:'+moment(today, "YYYY-MM-DD").diff(moment(routine.startDate, "YYYY-MM-DD"), 'days'))
            }
        }
        console.log('if2')
        updates.forEach((update) => routine[update] = req.body[update])
        await routine.save()
        return res.json({ 
            message: 'Routine updated successfully'
        })
    }catch(error){
        res.status(400).json({ 
            message: error
        })
    }

})

// Routine Delete
router.delete('/routine/:routineId'  , async(req , res) =>{
    try{
        const routine = await Routine.findOneAndDelete({_id: req.params.routineId})

        if(!routine){
            return res.status(404).json({
                message: 'Routine not found'
            })
        }

        res.json({
            message: 'Routine deleted successfully'
        })
    }catch(error){
        res.status(500).json({
            message: error
        })
    }
})

// Routine Notification Count Of a User
router.get('/routineNotification/:userId' , async (req, res) =>{
    // let owner = req.params.userId;
    let userId = req.params.userId
    try {
        const user = await User.findOne({
            _id: req.params.userId
        });
        // console.log(user)
        let routine
        if(user.guardianList.length > 0 && user.patientList.length > 0){
            // console.log('if')
            routine = await Routine.find({"owner.guardian.guardianId": userId, "owner.patient.patientId": userId})
        } else if(user.guardianList.length === 0 && user.patientList.length === 0){
            // console.log('if1')
            routine = []
            /* return res.status(404).json({
                message: "You are not guardian or patient of any user. So you don't have any routine."
            }) */
        } else if(user.guardianList.length > 0){
            // console.log('if2')
            routine = await Routine.find({"owner.patient.patientId": userId})
        } else if(user.patientList.length > 0){
            // console.log('if3')
            routine = await Routine.find({"owner.guardian.guardianId": userId, notificationFor: 'Guradian&Patient'})
        }
        // const routine = await Routine.find({owner})
        // console.log(routine)
        var today = new Date();
        today = today.getFullYear() + '/' + String(today.getMonth() + 1).padStart(2, '0') + '/' + String(today.getDate()).padStart(2, '0');

        var compareDate;
        var startDate;
        var endDate;
        var compareDateTime = moment(new Date()).format();
        var dateTimeBetween;
        var dateTimeRange;
        var subtractTime;
        var notificationArray = [];
        var newArray = [];
        
        routine.forEach(function(entry, i) {
            compareDate = moment(today, "YYYY/MM/DD");
            startDate   = moment(entry.startDate, "YYYY/MM/DD");
            endDate     = moment(entry.endDate, "YYYY/MM/DD");
            subtractTime = entry.notification.split(' ')

            if(moment(compareDate, 'YYYY/MM/DD').isBetween(moment(startDate, 'YYYY/MM/DD'), moment(endDate, 'YYYY/MM/DD')) || moment(compareDate, 'YYYY/MM/DD').isSame(startDate, 'YYYY/MM/DD') || moment(compareDate, 'YYYY/MM/DD').isSame(endDate, 'YYYY/MM/DD')){
                entry.times.forEach(function (time, j) {
                    if(routine[i].statusDay[compareDate.diff(startDate, 'days')].statusTime[j].visible){
                        newArray.push({
                            notificationArray: entry,
                            notificationTime: time
                        })
                    }
                });
            }
        })

        newArray.sort(function (a, b) {
            return b.notificationTime.time.localeCompare(a.notificationTime.time);
        });

        newArray.forEach(function(entry) {
            compareDate = moment(today, "YYYY/MM/DD");
            startDate   = moment(entry.notificationArray.startDate, "YYYY/MM/DD");
            endDate     = moment(entry.notificationArray.endDate, "YYYY/MM/DD");
            subtractTime = entry.notificationArray.notification.split(' ')
            var startDateTime = moment(moment(`${today} ${entry.notificationTime.time}`, 'YYYY-MM-DD HH:mm').format()).subtract(subtractTime[1], 'minutes').format()
            var endDateTime = moment(today, "YYYY/MM/DD").add(1, 'days').format()
            dateTimeBetween = moment(compareDateTime, 'YYYY-MM-DD HH:mm').isBetween(moment(startDateTime, 'YYYY-MM-DD HH:mm'), moment(endDateTime, 'YYYY-MM-DD HH:mm'), null, '[]')
            if(dateTimeBetween || moment(compareDateTime, 'YYYY-MM-DD HH:mm').isSame(startDateTime, 'YYYY-MM-DD HH:mm') || moment(compareDateTime, 'YYYY-MM-DD HH:mm').isSame(endDateTime, 'YYYY-MM-DD HH:mm')){
                dateTimeRange = true
            } else{
                dateTimeRange = false
            }
            if(dateTimeRange){
                notificationArray.push(entry)
            }
        })

        if (notificationArray === undefined || notificationArray.length == 0) {
            return res.status(200).json({
                message: "You have no upcoming notification"
            })
        }

        return res.status(200).json({
            routine: notificationArray
        })
    } catch (e) {
        res.status(500).json({
           message: e
        })
    }
})

// Accept Routine Notification
router.patch('/acceptRoutine' , async ( req , res) => {
    var timeIndex
    const routine = await Routine.findOne({ _id: req.body.id })

    var today = new Date();
    today = today.getFullYear() + '/' + String(today.getMonth() + 1).padStart(2, '0') + '/' + String(today.getDate()).padStart(2, '0');

    today = moment(today, "YYYY/MM/DD");

    // console.log('Date Difference:' +today.diff(routine.startDate, 'days'))

    routine.times.forEach(function (time, i) {
        // console.log(req.body.time.localeCompare(time.time))
        if(req.body.time.localeCompare(time.time) === 0){
            timeIndex = i
        }
    })

    if(today.diff(routine.startDate, 'days') >= 0){
        if(timeIndex !== undefined){
            // console.log('TimeIndex: '+timeIndex)
            routine.statusDay[today.diff(routine.startDate, 'days')].statusTime[timeIndex].done = true
            routine.statusDay[today.diff(routine.startDate, 'days')].statusTime[timeIndex].visible = false
            await routine.save()
        } else {
            return res.status(404).json({
                message: 'This routine is not exist in '+today
            })
        }
    } else {
        return res.status(404).json({
            message: 'This routine is not exist in '+today
        })
    }

    return res.status(200).json({
        message: 'Successful',
        routine
    })
})

// Cancel Routine Notification
router.patch('/cancelRoutine' , async ( req , res) => {
    var timeIndex
    const routine = await Routine.findOne({ _id: req.body.id })

    var today = new Date();
    today = today.getFullYear() + '/' + String(today.getMonth() + 1).padStart(2, '0') + '/' + String(today.getDate()).padStart(2, '0');

    today = moment(today, "YYYY/MM/DD");

    // console.log('Date Difference:' +today.diff(routine.startDate, 'days'))

    routine.times.forEach(function (time, i) {
        // console.log(req.body.time.localeCompare(time.time))
        if(req.body.time.localeCompare(time.time) === 0){
            timeIndex = i
        }
    })

    if(today.diff(routine.startDate, 'days') >= 0){
        if(timeIndex !== undefined){
            // console.log('TimeIndex: '+timeIndex)
            routine.statusDay[today.diff(routine.startDate, 'days')].statusTime[timeIndex].visible = false
            await routine.save()
        } else {
            return res.status(404).json({
                message: 'This routine is not exist in '+today
            })
        }
    } else {
        return res.status(404).json({
            message: 'This routine is not exist in '+today
        })
    }

    return res.status(200).json({
        message: 'Successful',
        routine
    })
})

module.exports = router