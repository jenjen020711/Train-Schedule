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

  $("#submit-button").on("click", function (event) {
    event.preventDefault();
    //grab user input    
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainFirstTrainTime = $("#firstTrain-input").val().trim();
    var trainFrequency = $("#frequency-input").val().trim();

    //temporary object to store train data
    var newTrain = {
        train: trainName,
        destination: trainDestination,
        trainTime: trainFirstTrainTime,
        frequency: trainFrequency
    };

    //push train data to firebase
    database.ref().push(newTrain);

    console.log(("pushing Train = "), newTrain.train);
    console.log(("pushing Destination = "), newTrain.destination);
    console.log(("pusing Train Time = "), newTrain.trainTime);
    console.log(("pushing Frequency = "), newTrain.frequency);

    alert("Train information added");

    //clear input boxes
    $("train-name-input").val("");
    $("destination-input").val("");
    $("firstTrain-input").val("");
    $("frequency-input").val("");

});

//Add info to firebase and show in table on entry submission
database.ref().on("child_added", function (childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

    //store in a variable
    var trainName = childSnapshot.val().train;
    var trainDestination = childSnapshot.val().destination;
    var trainFirstTrainTime = childSnapshot.val().trainTime;
    var trainFrequency = childSnapshot.val().frequency;

    console.log(("stored var Train Name = "), trainName);
    console.log(("stored var Destination = "), trainDestination);
    console.log(("stored var First Train Time = "), trainFirstTrainTime);
    console.log(("stored var Frequency = "), trainFrequency);

    //Next Arrival = First Train Time (convert to minutes) + Frequency (which is already in minutes)
    var a = moment.unix(trainFirstTrainTime);

    var nextArrival = a.clone().add(trainFrequency, "HH:mm")
    var time = moment("HH:mm");

    //minutes away = Next arrival - current time, 
    var minAway = nextArrival.subtract(time);
    var prettyNextArrival = moment.unix(nextArrival).format("HH:mm");


    console.log("Calculating next arrival");
    console.log(("First Train Time = "), trainFirstTrainTime);
    console.log(("Train Frequency = "), trainFrequency);
    console.log(("Next Arrival = "), nextArrival);
    console.log(("Next Arrival = "), prettyNextArrival);


    // Add each train's data into the table
    $("#trainSchedule-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + prettyNextArrival + "</td><td>" + minAway + "</td></tr>");
});