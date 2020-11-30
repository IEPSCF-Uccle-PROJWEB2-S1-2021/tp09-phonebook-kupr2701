const express = require('express');
const { body, validationResult } = require('express-validator');
const createError = require('http-errors');


const router = new express.Router();

class Phonebook {
  constructor (lastName,firstName,birthDate,phoneNumber,emailAddress){
    this.lastName = lastName;
    this.firstName = firstName;
    this.birthDate = birthDate;
    this.phoneNumber = phoneNumber;
    this.emailAddress = emailAddress;
  }
}
const phonebooklist = [
  new Phonebook('joel' , 'kuifo' , '27-12-1920', '+32 465 56 65 65' , 'joel@gmail.be'),
  new Phonebook('Martin', 'Fowler' , '23-3-2018', '+32 465 56 65 23' ,  'martin@gmail.be'),
];
function requireAcceptsJson(req, res, next) {
  if (req.accepts('json')) {
    next();
  } else {
    next(createError(406));
  }
}
// Only responds to client accepting JSON

router.all('*', requireAcceptsJson);

router.get('/', (req, res, next) => {
  res.json({ phonebooklist });
});


router.post(
  '/',
  [
    body("lastName" , "empty lastName" ).trim().isLength({ min: 3 }).escape(),
    body("firstName" , "empty firstName" ).trim().isLength({ min: 3 }).escape(),
    body('birthDate' , 'invalid date').optional({checkFalsy : true}).isInt({ min: 1900}).toInt(),
    body("phoneNumber" , "empty phoneNumber").optional({checkFalsy : true}).trim().isMobilePhone({strictMode : true}),
    body("emailAddress" , "empty emailAddress" ).trim().optional({checkFalsy : true}).isEmail ({domain_specific_validation: true}),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(createError(400));
    } else {
      const phonebook = new Phonebook(req.body.lastName, req.body.firstName, req.body.birthDate, req.body.phoneNumber, req.body.emailAddress);
      phonebooklist.push(phonebook);
      res.status(201);
     // res.send('created');
      res.redirect('/phonebookapi');
    }
  });

module.exports = router;
