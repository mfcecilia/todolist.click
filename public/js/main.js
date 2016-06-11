//global variables that will apply everywhere
var fire = new Firebase('https://todo-linear.firebaseio.com/');
var number = 0;
var status = "Incomplete";
var trash = "Delete";
var row = $("<tr>");

window.loadDone = false;

//creating the array that will hold all the to-do list items
var itemArray = new Array();
//creating the array that holds all things
var globalArray = [];

//keeps an unchanged history of inputs
//the list of items if shifting never took place
var inputHistory = new Array();

//keeps a history of what was placed in the third input
var thirdHistory = new Array();

//keeps an array of all third inputs after shortening
var editThirdHistory = new Array();

//the firebase child which will hold all the todo list items
var tododata = fire.child("listItems");

function processSnapshot(snapshot) {
  console.log('inside processSnapshot function');
  for (a = 0; a < 4; a++)
  {
    if (!typeof snapshot.val() == "object") {
      row.append($("<td>" + snapshot.val() + "</td>"));
    }
  }
}

function processLoadSnapshot(v) {
  var item;
  $('tbody').append('<tr></tr>');

  for (a = 0; a < 4; a++)
  {
    console.log('inside processLoadSnapshot');
    item = v[a];
    console.log("item = " + item);
    console.log("row = " + row);
    $('tr').last().append($("<td>" + item + "</td>"));
  }
}

function processLoadList(sval) {
  console.log('processLoadList function ' + sval);
  for (indice in sval) {
    item = sval[indice];
    processLoadSnapshot(item.contents);
    console.log("item = " + item);
  }
}

//everything is inside this document ready function
$(document).ready(function(){

  //firebase reading
  fire.on("value", function(snapshot) {
    var sval = snapshot.val();
    console.log(sval);
    console.log("value");
    if (!loadDone) {
      processLoadList(sval.listItems);
    }
    window.loadDone = true;

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });



  //this is the first function, it takes place in the first form
  //it unlocks the second form
  $('#todo').on('submit', function(e){
    event.preventDefault();
    var val = $("#todo").find('#first-input').val();
    if (val == "") {
      console.log("input 1 nothing to add");
    }

    else {
      inputHistory.push(val); //this is the array where the third form gets it's menu items


      $("#location").removeAttr("disabled");
      document.form2.two.focus(); //this allowed me to submit when pressing enter
      $("#second-submit").removeAttr("disabled");
      console.log("item 1 added");
      $("#second-submit").css("color", "#073B4C");
      $("#second-submit").css("background-color", "#EF476F");
      document.form2.submit2.focus(); //this allowed me to submit when pressing enter
      console.log("queue second option");
    }
  })
    //this is the second function, it takes place in the second form
    //it unlocks the third form
    $('#select-location').on('submit', function(event){
      event.preventDefault();
      document.form3.three.focus(); //this allowed me to submit when pressing enter
      var val = $("#todo").find('#first-input').val();
        $("#choose").removeAttr("disabled");
        $("#third-submit").removeAttr("disabled");
        console.log("item 2 added");

        //avoid illogical choices by preventing the add-on of new options until it is necessary
        //and delaying other choices from appearing
        //all of this needs to be a function

        if (itemArray.length > 0){
          var queue = inputHistory[number-1];
          thirdHistory.push(queue);
          var maxLength = 10;
          if (queue.length > maxLength)
          {
            //edit the long strings
            editThirdHistory.push(queue.substring(0,maxLength));
            $("#choose").append("<option>" + editThirdHistory[editThirdHistory.length-1] + "</option>");
          }
          else
          {
            $("#choose").append("<option>" + thirdHistory[thirdHistory.length-1] + "</option>");
          }
          console.log("the queue = " + queue);
          console.log("the thirdHistory = " + thirdHistory);
          console.log("the editThirdHistory = " + editThirdHistory);



        }

        $("#third-submit").css("color", "#073B4C");
        $("#third-submit").css("background-color", "#EF476F");
        document.form3.submit3.focus(); //this allowed me to submit when pressing enter
        console.log("queue third option");
    })

    //this is the thrid function, it takes place in the third form
    //it populates the table with entries

    $('#choose-location').on('submit', function(event){
      event.preventDefault();
      var val = $("#todo").find('#first-input').val();
      var preposition = $("#select-location").find("#location").val();
      console.log(preposition);
      var relativePos = $('#choose-location').find('#choose').val();
      console.log(relativePos);
      if ((preposition == "Before" || preposition == "After") && relativePos == "Defalut")
      {
        //autocomplete form to a valid option
        //alert user to select a valid option
        //idk, something clean and awesome
      }

      var count = number++;

      //adding items to the arrays
      //this section handles the gymnasitcs in terms of where to place things
      var timestamp = new Date();
      globalArray[count] = [];
      globalArray[count].push(status, val, timestamp.toString(), trash);

      /**
      these are all the getter methods for the arrays
      **/

      //returns the contents of an array
      var globalVal = {
        get getGlobalVal() {
          return globalArray[count]
        }
      }
      console.log(globalVal.getGlobalVal);


      //returns the index of the array
      var globalIndex = {
        get getGlobalIndex() {
          return globalArray.indexOf(globalVal.getGlobalVal)
        }
      }
      console.log("count of the first input = " + globalIndex.getGlobalIndex);


      /**
      returns the index of the array of a
      previous entry (selected from the thrid input) it's logged
      to the console later on in the code after the function
      that handles the selection of that input
      **/
      var relPosIndex = {
        get globalRelPosIndex() {
          for(var i = 0; i < globalArray.length; i++) {
              var globe = globalArray[i];
              for(var j = 0; j < globe.length; j++) {
                  if (relativePos == globe[j])
                  {
                    return i
                  }
              }
          }
        }
      }



      //getter method for item array third input
      var valIndex = {
        get getVal() {
          return itemArray.indexOf(relativePos)
        }
      }

      //getter method for item array first input
      var itemFirst = {
        get getItemFirst() {
          return itemArray.indexOf(val)
        }
      }




      /**
      The following are the controls
      for what happens to the arrangement
      of to-do list items in the arrays when certain
      options are selected in the input boxes.
      */
      if (preposition == "First"){
        //delete 0 elements (second comma) from the zero index in the array(first comma)
        //insert val there
        itemArray.splice(0, 0, val);
        globalArray.splice(0, 0, globalVal.getGlobalVal);
        //delete the last element in the array
        itemArray.splice(itemArray.length, 1);
        globalArray.splice(globalArray.length-1, 1);
        console.log("moved to first position");
      }

      if (preposition == "Random")
      {
        var randomIndex = Math.random() * (itemArray.length-0) + 0;
        //randomly places the new to do list item
        itemArray.splice(randomIndex, 0, val);
        globalArray.splice(randomIndex, 0, globalArray[count]);
        globalArray.splice(globalArray.length-1, 1);
      }

      if (preposition == "Last")
      {
        //default placement of new items at the end of the array
        itemArray.push(val);
        globalArray.splice(globalArray.length, 0, globalArray[count]);
        globalArray.splice(globalArray.length-1, 1);
      }
      if (preposition == "Before") {
        //places new item before the third input item
        itemArray.splice(valIndex.getVal, 0, val);
        globalArray.splice(relPosIndex.globalRelPosIndex, 0, globalArray[count]);
        globalArray.splice(globalArray.length-1, 1);
      }
      if (preposition == "After") {
        //places new item after third input item
        itemArray.splice(valIndex.getVal + 1, 0, val);
        globalArray.splice(relPosIndex.globalRelPosIndex + 1, 0, globalArray[count]);
        globalArray.splice(globalArray.length-1, 1);
      }


      console.log("index of third input = " + relPosIndex.globalRelPosIndex);

      console.log("index of first input = " + itemFirst.getItemFirst);



      /**
      firebase code
      */

      var newtododata = tododata.push();
      newtododata.set({
        contents: globalArray[itemFirst.getItemFirst]
      });
      tododata.on("child_added", function(snapshot) {
        console.log(snapshot.val());
        console.log("child_added");
        processSnapshot(snapshot);
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });





      /**
      Here we begin the html table gymnastics.
      I believe this is called "dynamically filling a table."
      Which means the html table should update with the arrays
      */
        var row = $("<tr>");
        var firstRow = $("<tr>").eq(-1);
        var rowCount = document.getElementsByTagName('tr');
        var listSize = rowCount.length;
        var beforeRow = $("<tr>").eq(relPosIndex.globalRelPosIndex - 1);

        for(var x = 0, xLength = rowCount.length; x < xLength; x++)
        {
          console.log('rowIndex=' + rowCount[x].rowIndex);
        }

        function fillCells(){
          var currentInput = itemFirst.getItemFirst;
          var iterate = globalArray[currentInput];
          //this for loop is just to help populate cells by iterating through the inner array
          //each "a" is a cell
          for (a = 0; a < 4; a++)
          {
            row.append($("<td>" + iterate[a] + "</td>"));
          }
        }

        function fillBeforeCells(){
          var currentInput = itemFirst.getItemFirst;
          var iterate = globalArray[currentInput];
          //this for loop is just to help populate cells by iterating through the inner array
          //each "a" is a cell
          for (a = 0; a < 4; a++)
          {
            beforeRow.append($("<td>" + iterate[a] + "</td>"));
          }
        }

        function fillFirstRowCells(){
          var currentInput = itemFirst.getItemFirst;
          var iterate = globalArray[currentInput];
          //this for loop is just to help populate cells by iterating through the inner array
          //each "a" is a cell
          for (a = 0; a < 4; a++)
          {
            firstRow.append($("<td>" + iterate[a] + "</td>"));
          }
        }

        if(preposition == "First")
        {
          //the "first" placement should only come into play after the table has
          //at least one item in it

          if (number == 1)
          {
            row.insertBefore($("table > tbody"));
            fillCells();
          }
          else if ( number > 1)
          {
            //fix how it only adds after the legit first input ever made
            //i need to find out how to get row id numbers
            //this code is just a place holder until i figure everything out
            firstRow.insertBefore($("table > tbody tr:first"));
            fillFirstRowCells();
          }
          else
          {
            $("table > tbody").append(row);
            fillCells();
          }
        }
        if (preposition == "Before")
        {
          //this code doesn't work properly
          //table.insertRow(relPosIndex.globalRelPosIndex);
          //row.insertBefore(row.eq(relPosIndex.globalRelPosIndex));
          //beforeRow.insertBefore($("table > tbody tr:first"));
          $('table > tbody > tr').eq(0).after(row);
          fillCells();
        }
        if (preposition == "After")
        {
          //do something
        }
        if (preposition == "Random")
        {
          //do something
          if (listSize > 0)
          {
            var randRow = Math.random() * (listSize-0) + 0;
            console.log(randRow);
            row.eq(randRow);

          }
          else
          {
            $("table > tbody").append(row);
            fillCells();
          }
        }
        //this defaults to adding new rows to the end of the table
        if (preposition == "Last")
        {
          $("table > tbody").append(row);
          fillCells();
        }



      //here we reset all the forms to prepare for new values
      $("#second-submit").attr("disabled", "disabled");
      $("#second-submit").css("background-color", "#118AB2");
      $("#location").attr("disabled", "disabled");
      //second input is reset
      console.log("reset second input");
      $("#third-submit").attr("disabled", "disabled");
      $("#third-submit").css("background-color", "#118AB2");
      $("#choose").attr("disabled", "disabled");
      //third input is reset
      console.log("reset third input");
      $('#todo').trigger('reset');
      //first input is reset
      console.log("reset input 1");
      console.log(itemArray);
      console.log(globalArray);
    })
});
















function checkDuplicates()
{
  var duplicate = 1;
  for (i = 0; i < itemArray.length; i++)
  {
    if (itemArray.indexOf(val) > -1)
    {
      duplicate.toString();
      val = val.concat(duplicate);
      console.log("inside duplicates loop");
    }
  }
  duplicate++;
  console.log(val);
}





    if (($("#check:checked").length) > 0) {
        $("#rate").removeAttr("disabled");
        $("#duration").removeAttr("disabled");
    } else {
        $("#rate").attr("disabled", "disabled");
        $("#duration").attr("disabled", "disabled");
      }


      // $('#').focusout(function(){
      function postStuff() {
        console.log("inside function");


        var cApi = $('#cApi').val();
        var cAccID= $('#cAcc').val();
        var hUID = $('#hApi').val();
        var hApi = $('#hUID').val();

        //determine if booleans are true
          var isATMChecked = {enabled: $('#avoidATMFees').prop('checked')}
          var isBillsChecked = {enabled: $('#billsOnTime').prop('checked')}
          var isEatMoreAtHome = {enabled: $('#eatMoreAtHome').prop('checked')}
          var isLiquorStoreChecked = {enabled: $('#liquorStore').prop('checked')};


          if($('#check').prop('checked')){

            var spendSave = {enabled: $('#check').prop('checked'), rate: $("#rate option:selected").val(), duration: $("#duration option:selected").val()};
            console.log(spendSave);

          }
          else{
              var spendSave = {enabled: $('#check').prop('checked')}
          }
        var body = {
          'cApiKey':cApi,
          'cAccID':cAccID,
          'uid': hUID,
          'hApiKey':hApi,
          'loaded': "no",
          'ATMFees': isATMChecked,
          'EatAtHome': isEatMoreAtHome,
          'Bills': isBillsChecked,
          'Liquor': isLiquorStoreChecked,
          'SpendSave': spendSave

        };


        $.ajax({
              url: 'http://localhost:3000/config/',
              data: JSON.stringify(body),
              contentType:"application/json; charset=utf-8",
              type: 'PUT',
              success: function(response) {
              },
              error: function(error) {
              }
          });
      }
