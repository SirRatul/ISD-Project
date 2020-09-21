const express = require("express");
const router = express.Router();
const Guardianship = require("../models/Guardianship");
const User = require("../models/User");
const Routine = require('../models/Routine');

//Send Request
router.post("/users/sendRequest/:id", async (req, res) => {
  let owner;
  let ownerName;
  
  owner = req.params.id;
  const ownerNameFind = await User.findOne({ _id: owner });
  if(ownerNameFind.guardianList.length > 0 && ownerNameFind.patientList.length > 0){
    return res.status(404).json({
      message: 'You are already Your Patient'
    })
  } else if(ownerNameFind.guardianList.length > 0){
    return res.status(404).json({
      message: 'You are already a Patient. Remove that relationship'
    })
  } else if(ownerNameFind.patientList.length > 0){
    return res.status(404).json({
      message: 'You are already a Guardian. Remove that relationship'
    })
  } 
  if (ownerNameFind) {
    ownerName = ownerNameFind.firstname + " " + ownerNameFind.lastname;
  }

  const gurdian = new Guardianship({
    ...req.body,
    requester: owner,
    requesterName: ownerName
  });

  const patientExist = await Guardianship.findOne({
    "recipients.id": req.body.recipients[0].id,
    "recipients.status": true,
    requester: owner
  });

  const previouspatientCheck = await Guardianship.findOne({
    "recipients.id": req.body.recipients[0].id,
    "recipients.status": true
  });

  const previousGuardianCheck = await User.findOne({
    _id: req.body.recipients[0].id
  });

  const guardianExist = await Guardianship.findOne({
    "recipients.id": owner,
    "recipients.status": true,
    requester: req.body.recipients[0].id
  });

  const myStatusCheck = await Guardianship.findOne({
    "recipients.id": owner,
    "recipients.status": true
  });

  const requestExist = await Guardianship.findOne({
    "recipients.id": req.body.recipients[0].id,
    requester: owner
  });

  const receiveRequestExist = await Guardianship.findOne({
    "recipients.id": owner,
    requester: req.body.recipients[0].id
  });

  try {
    if (patientExist) {
      return res.status(404).json({
        message: "You are already guardian of that user."
      });
    } else if (previouspatientCheck) {
      return res.status(404).json({
        message: "This user has a guardian. So You can't send request to become his guardian."
      });
    } else if(previousGuardianCheck.guardianList.length > 0 && previousGuardianCheck.patientList.length > 0){
      return res.status(404).json({
        message: "This user has already Patient.So You can't send request to become his guardian."
      })
    } else if(previousGuardianCheck.guardianList.length > 0){
      return res.status(404).json({
        message: 'This user has already Guardian'
      })
    } else if(previousGuardianCheck.patientList.length > 0){
      return res.status(404).json({
        message: "This user has already Patient.So You can't send request to become his guardian."
      })
    }else if (guardianExist) {
      return res.status(404).json({
        message: "You are already patient of that user."
      });
    } else if (myStatusCheck) {
      return res.status(404).json({
        message: "You are already patient of a user. So You can't send request to anyone to become his guardian."
      });
    } else if (requestExist) {
      return res.status(200).json({
        message: "You have already sent a request to that user."
      });
    } else if (receiveRequestExist) {
      return res.status(200).json({
        message: "You have already got a request from that user."
      });
    }
    await gurdian.save();
    return res.status(200).json({
      gurdian,
      message: "You have succesfully sent request to that user"
    });
  } catch (error) {
    return res.status(404).json({
      mesaage: error
    });
  }
});

//Accept Request
router.patch("/users/acceptRequest/:id", async (req, res) => {
  let owner = req.params.id;

  const user = await User.findOne({
    _id: req.body.requester
  });

  const guardianUser = await User.findOne({
    _id: owner
  });

  if(guardianUser.guardianList.length > 0 && guardianUser.patientList.length > 0){
    return res.status(404).json({
      message: 'You are already Your Patient.'
    })
  } else if(guardianUser.guardianList.length > 0){
    return res.status(404).json({
      message: 'You are already a Patient. Remove that relationship'
    })
  } else if(guardianUser.patientList.length > 0){
    return res.status(404).json({
      message: 'You are already a Guardian. Remove that relationship'
    })
  }

  if(user.guardianList.length > 0 && user.patientList.length > 0){
    return res.status(404).json({
      message: user.firstname+' '+user.lastname+' is already Patient of '+(user.gender === 'Male' ? 'himself' : 'herself')
    })
  } else if(user.guardianList.length > 0){
    return res.status(404).json({
      message: user.firstname+' '+user.lastname+' is already Patient of Someone. Please tell '+ user.firstname+' '+user.lastname+' to remove that relationship.'
    })
  } else if(user.patientList.length > 0){
    return res.status(404).json({
      message: user.firstname+' '+user.lastname+' is already Guardian of Someone. Please tell '+ user.firstname+' '+user.lastname+' to remove that relationship.'
    })
  }

  const gurdian = await Guardianship.findOne({
    "recipients.id": owner,
    "recipients.status": false,
    requester: req.body.requester
  });
  if (gurdian) {
    user.patientList.push({patientId: owner, patientName: guardianUser.firstname+' '+guardianUser.lastname, patientEmail: guardianUser.email})
    user.userType = 'Guardian'
    guardianUser.guardianList.push({guardianId: req.body.requester, guardianName: user.firstname+' '+user.lastname, guardianEmail: user.email})
    guardianUser.userType = 'Patient'
    gurdian.recipients[0].status = true;
    await user.save();
    await guardianUser.save();
    await gurdian.save();
    return res.status(200).json({
      gurdian,
      message: "You are now patient of that user."
    });
  }
  return res.status(404).json({
    message: "No Request Found"
  });
});

//Delete Request 
router.delete("/requestDelete/:requestId", async (req, res) => {
  try {
    const user = await Guardianship.findOneAndDelete({
      // "recipients.id": owner,
      "recipients.status": false,
      _id: req.params.requestId,
    });
    if (!user) {
      return res.status(404).json({
        message: "No request found"
      });
    }
    res.status(200).json({
      message: "Request deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error
    });
  }
});

//Cancel Request
router.patch("/users/cancelRequest/:id", async (req, res) => {
  let owner = req.params.id;
  
  try {
    await Guardianship.findOneAndDelete({
      "recipients.id": req.body.patientId,
      "recipients.status": true,
      requester: owner
    });
    const routine = await Routine.find({"owner.guardian.guardianId": owner, "owner.patient.patientId": req.body.patientId})
    let routineId = []
    routine.forEach(function(item) {
      routineId.push(item.id)
    })
    await Routine.deleteMany({_id: routineId})
    await User.findByIdAndUpdate(
      owner, { $pull: { "patientList": { patientId: req.body.patientId } } }, { multi: true },
      function(err) {
        if (err) { 
          return res.status(500).json({
            message: error
          }); 
        }
    });
    const user = await User.findOne({
      _id: owner
    });
    user.userType = ''
    await user.save();
    const patient = await User.findOne({
      _id: req.body.patientId
    });
    patient.userType = ''
    await patient.save();
    await User.findByIdAndUpdate(
      req.body.patientId, { $pull: { "guardianList": { guardianId: owner } } },{ "multi": true },
      function(err) {
        if (err) { 
          return res.status(500).json({
            message: error
          }); 
        }
    });
    return res.status(200).json({
      message: 'Request Deleted Successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error
    });
  }
})

//Request List
router.get("/users/requestList/:id", async (req, res) => {
  let owner = req.params.id;
  
  const requestExist = await Guardianship.find({
    "recipients.id": owner,
    "recipients.status": false
  });

  try {
    if (requestExist.length > 0) {
      return res.status(200).json({
        requestExist
      });
    } else {
      return res.status(200).json({
        mesaage: "You have no request."
      });
    }
  } catch (error) {
    return res.status(404).json({
      mesaage: error
    });
  }
});

//Add Myself As Patient
router.patch("/addPatientMyself/:id", async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id
  });
  if(user.guardianList.length > 0 && user.patientList.length > 0){
    return res.status(404).json({
      message: 'You are already Your Patient'
    })
  }
  else if(user.guardianList.length > 0){
    return res.status(404).json({
      message: 'You are already a Patient. Remove that relationship'
    })
  }
  if(user.patientList.length > 0){
    return res.status(404).json({
      message: 'You are already a Guardian. Remove that relationship'
    })
  }
  user.guardianList.push({guardianId: req.params.id, guardianName: user.firstname+' '+user.lastname, guardianEmail: user.email})
  user.patientList.push({patientId: req.params.id, patientName: user.firstname+' '+user.lastname, patientEmail: user.email})
  user.userType = 'Guardian/Patient'
  await user.save();
  
  return res.status(200).json({
    message: 'You have add yourself as a patient',
    user
  })
});

//Remove Myself As Patient
router.patch("/removePatientMyself/:id", async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id
  });
  if(user.guardianList[0].guardianId.equals(req.params.id) && user.patientList[0].patientId.equals(req.params.id)){
    user.guardianList = []
    user.patientList = []
    user.userType = ''
    const routine = await Routine.find({"owner.guardian.guardianId": req.params.id, "owner.patient.patientId": req.params.id})
    let routineId = []
    routine.forEach(function(item) {
      routineId.push(item.id)
    })
    await Routine.deleteMany({_id: routineId})
    await user.save();
    return res.status(200).json({
      message: 'You have removed yourself as a patient',
      user
    })
  } else {
    return res.status(404).json({
      message: 'You are not add yourself as a patient.'
    })
  }
});

// User Status Check
/* router.get("/checkGuardianAndPatient/:id", async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id
  });
  if(user.guardianList.length > 0 && user.patientList.length > 0){
    return res.status(404).json({
      message: 'You are already Your Patient'
    })
  } else if(user.guardianList.length > 0){
    return res.status(404).json({
      message: 'You are already a Patient. Remove that relationship'
    })
  } else if(user.patientList.length > 0){
    return res.status(404).json({
      message: 'You are already a Guardian. Remove that relationship'
    })
  } else {
    return res.status(200).json({
      message: 'You are not guardian of any user & You are not patient of any user.'
    })
  }
}); */

module.exports = router;