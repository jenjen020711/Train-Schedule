/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new train - then update the html + update the database
// 3. Create a way to retrieve trains from the trains database.
// 4. Create a way to calculate the minutes away. Using difference between modulus remainder from frequency.
//    Then use moment.js formatting to set difference in time.
// 5. Calculate how many minutes away.

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyAAxjaAGTCJ1DV8AJYv6m0-WFRTo1mqezw",
    authDomain: "train-schedule-8000c.firebaseapp.com",
    databaseURL: "https://train-schedule-8000c.firebaseio.com",
    projectId: "train-schedule-8000c",
    storageBucket: "train-schedule-8000c.appspot.com",
    messagingSenderId: "660007483051"
  };
  
  firebase.initializeApp(config);
  
  var database = firebase.database();

  //2. Button for adding train
    $("#add-train-btn").on("click", function(event) {
     event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var trainStart = moment($("#start-input").val().trim(), "minutes").format("X");
  var frequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: destination,
    start: trainStart,
    frequency: frequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.frequency);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().role;
  var trainStart = childSnapshot.val().start;
  var frequency = childSnapshot.val().rate;

  // Train Info
  console.log(trainName);
  console.log(destination);
  console.log(trainStart);
  console.log(frequency);

   // Assumptions
   var tFrequency = 3;

   // Time is 3:30 AM
   var firstTime = "03:30";

   // First Time (pushed back 1 year to make sure it comes before current time)
   var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
   console.log(firstTimeConverted);

   // Current Time
   var currentTime = moment();
   console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

   // Difference between the times
   var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
   console.log("DIFFERENCE IN TIME: " + diffTime);

   // Time apart (remainder)
   var tRemainder = diffTime % tFrequency;
   console.log(tRemainder);

   // Minute Until Train
   var tMinutesTillTrain = tFrequency - tRemainder;
   console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

   // Next Train
   var nextTrain = moment().add(tMinutesTillTrain, "minutes");
   console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

   // Add each train's data into the table
  $("#trainSchedule-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
  empStartPretty + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway+ "</td></tr>");
});

