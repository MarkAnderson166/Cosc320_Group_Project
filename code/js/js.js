
var arrForDragula = [ ];

  // dummy values for UI building
var myDegree = 'bCompSci';
var myMajor = 'Software_Development';
var myMajor = 'Data_Science';
var myMajor = 'Double_Major';
var myMinor = 'null';
var startYear = 2022;
var duration = 4;


window.onload = function() {

  button_container.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const uploaded = e.target.result;

        // break .csv into 2 arrays
      const headers = (uploaded).slice(0,(uploaded).indexOf("\n")).split(",");
      var value =  (uploaded).slice((uploaded).indexOf("\n")).split(",");

        // combine arrays into a dictionary
      value = removeNewlines(value);
      var studentData = {};
      for (var i=0; i<headers.length; i++) {
        if (value[i].includes('\r')){
          studentData[headers[i]] = (value[i].split("\r"));
        } else {
          studentData[headers[i]] = value[i];
        }
      }

      const completedUnits = ((studentData['Completed Units']+studentData['Adv Stnd Units']).replace(/(['",])/g,' ')).split(' ')
      const studentTotalOptions =     filterUnitsByDegree(studentData, dummyData)
      const studentRemainingOptions = filterUnitsByCompleted(completedUnits, studentTotalOptions)

      printStudentData(studentData, studentRemainingOptions);


      // make ui
      var startYear = parseInt(studentData['COMMENCEMENT_DT'].substr(-4,4));
      $('.leftColumn').empty()
      $('.rightColumn').empty()
      selectDegree('arrName', dummyData);
      buildYearGrid(startYear, duration);
      callDragula();

      // anything that happens after file upload has to be called here


    };
    reader.readAsText(input);
  });
}


    // I will need to make this recursive later. (probably)
function removeNewlines(arr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++)
    //if (Array.isArray(arr[i])){
      newArr.push(arr[i].replace(/\n/g,''));
    //}
    //else{
    //  newArr.push(arr[i].replace(/\n/g,''))
    //}
  return newArr
}


    // Just dump our results to the main window
function printStudentData(studentData, studentRemainingOptions){
  //console.log(studentData);
  //console.log(studentData['COURSE_CD']);
  //console.log(studentData['Completed Units']);
  $.each(studentData,function (key, value) { 
    $('#button_container').append(key+': '+value+'<br>')
  })
  console.log('studentRemainingOptions = \n');
  console.log(studentRemainingOptions);
  $('#button_container').append('<br><br> student recommendations: <br><br>')
  $.each(studentRemainingOptions,function (key, value) {
    $.each(value,function (index, unit) { 
      if (typeof(unit) === 'number' ) {
        $('#button_container').append('Student '+studentData['STUDENTNUMBER']+
                      ' needs to complete '+unit+' credit points from: <br>')
      } else  {
        $('#button_container').append(unit['Code']+'<br>')
        //$('#button_container').append(JSON.stringify(unit)+'<br>')
      }
    })
  })
}



// Filter Functions:

/*----------------------------------------------------
  filterUnitsByDegree()
  
  arg:      dict of student data (from csv) { key:value, key:[val1,val2] }
  arg:      entire data.js file 
  returns:  array of total student options: [ [core],[major],[minor] ]
  side-effect  - null
-------------------------------------------------*/

function filterUnitsByDegree(studentData, dummyData){
  var arrOfLists = []

    // this will be a basted ... - needs to make an array of 'unit blocks'
    // these are in the 'Unit Sets (Completed)', 'Unit Sets (Non-Completed)',
    //             AND 'Adv Stnd Units'   <-- problem
  var arrayVariantCodes = ['SOFTDEV','Rule_A_F']  

  $.each(dummyData,function (degreeCode, arrOfArrs) { 
    if (degreeCode === studentData['COURSE_CD']){
      $.each(arrOfArrs,function (index, value) { 
        if (typeof(value[0]) === 'number' ) {
          arrOfLists.push(value)         // missing name problem is here
        } else {
          if (arrayVariantCodes.includes(index)){
            $.each(value,function (index, value1) { 
              if (typeof(value1[0]) === 'number' ) {
                arrOfLists.push(value1)  // missing name problem is here
              } 
            });
          }
        }
      });
    }
  });
  //console.log(arrOfLists)
  return arrOfLists
}

/* ----------------------------------------------------
  filterUnitsByCompleted()

  arg:      array of options [ [],[],[] ]
  arg:      array of completed(+adv standing) []
  returns:  array of reccommendation arrays: [ [],[],[] ]
  side-effect  - dumps to console list of things that didn't match
------------------------------------------------- */

function filterUnitsByCompleted(completedUnits, studentTotalOptions){
  var newArr = [];
  var completedFilter = [];

  $.each(studentTotalOptions,function (index, list) {
    var newSubArr = [];
    $.each(list,function (index2, unit) {
      if (completedUnits.includes(unit['Code'])){
        //console.log('Ive done: '+unit['Code']);
        newSubArr[0] = parseInt(newSubArr[0])-parseInt(unit['CP'])
        completedFilter.push(unit['Code']);
      } else{
        newSubArr.push(unit);
      }
    });
    newArr.push(newSubArr);
  });

      // list completed elements that didn't match any options
  var unMatched = []
  unMatched = completedUnits.filter(item => !completedFilter.includes(item));
  unMatched = unMatched.filter(item => item.length > 4 && item.slice(0,4) != 'TRI-' );
  if (unMatched.length > 0){
    console.log('Things left in -completed- after filtering,  possible electives? ...: ');
    console.log(unMatched);
  }

  return newArr;
}




















// ------------------- all UI stuff below -------------------

function selectDegree(arrName, arr){

  if (typeof(arr[0]) === 'number' ) {
    buildUnitList(arrName, arr)

  } else  {
    $.each(arr,function (index, unitList) { 
      if (arrName == 'Major' && index !== myMajor) {
        //console.log('Im not doing the '+ index +' major')
      }
      else if (arrName == 'Minor' && index !== myMinor) {
        //console.log('Im not doing the '+ index +' minor')
      }
      else{selectDegree(index, unitList);}
    });
  }
}


function buildUnitList(listName, arr){
// make the list
  var col = ''
  if (listName.includes('scri') || listName.includes('isted')) {
    col = '.rightColumn';
  } else {
    col = '.leftColumn';
  }
  $(col).append('<li class="column '+listName+'_column">'+
            '      <div class="column_header">'+
            '        <h4>10 from this list</h4>'+
            '      </div>'+
            '      <ul class="unit_list" id="'+listName+'_unit_list"></ul>'+
            '    </li>')

// put units in the list
  //console.log(' making list called: '+listName+'  and populating with '+(arr.slice(1)).length+' elements');

  $.each(arr.slice(1),function (index, unit) { 
    $('#'+listName+'_unit_list').append('<li class="unit hoverable '+listName+
                                        '_unit"><p>'+unit['Code']+
                                        '  '+unit['TriAvail']+'</li>')
  });

// add units to 'make-me-draggable' list
  arrForDragula.push(document.getElementById(listName+'_unit_list'));
}


function buildYearGrid(startYear, numberOfYears){
  
  const boxes = Array.from(document.getElementsByClassName('year_box'));
  boxes.forEach(box => {
    box.remove();
  });

  for (let i = 1; i < numberOfYears+1; i++) {
    $('.middleColumn').append(
      '<li class="year_box">'+
      '<ul class="trimester_box ">'+
      '  <div class="trimester_box_header">Tri 1 '+(startYear+i)+'</div>'+
      '  <ul class="unit_list" id="t1y'+i+'"></ul>'+
      '</ul>'+
      '<ul class="trimester_box ">'+
      '  <div class="trimester_box_header">   Tri 2 '+(startYear+i)+'</div>'+
      '  <ul class="unit_list" id="t2y'+i+'"></ul>'+
      '</ul>'+
      '<ul class="trimester_box ">'+
      '  <div class="trimester_box_header">   Tri 3 '+(startYear+i)+'</div>'+
      '  <ul class="unit_list" id="t3y'+i+'"></ul>'+
      '</ul>'+
      '</li>'
    )
    arrForDragula.push(document.getElementById("t1y"+i));
    arrForDragula.push(document.getElementById("t2y"+i));
    arrForDragula.push(document.getElementById("t3y"+i));
  }
}


function getUnitDetails(handle){

  var code = handle.outerHTML.substr(3,7);
  var name = 'Name';
  var TriAvail = 'TriAvail';
  var Prereq = 'Prereq';

  $.each(dummyData['BCOMP'],function (index, arr) { 
    $.each(arr,function (index, unit) { 
      if (unit['Code'] == code ) {
        name = unit['Name'].substr(0,31);  //long unit names broke my box
        TriAvail = unit['TriAvail'];
        Prereq = unit['Prereq'];
      }
      if(code.charAt(6) == ' '){
        name = ' #### 6 digit unit codes break everything! ### '
      }
    });
  });
  
  $('.unitInfoBox').empty()
  $('.unitInfoBox').append('<h3>'+code+'</h3><h4>&nbsp;'+name+'</h4><h4> &nbsp;'+
                          'Trimesters:&nbsp; '+TriAvail+'&nbsp;&nbsp;Prereqs: '+Prereq+
                          '</h4><h4>&nbsp; <a href="https://handbook.une.edu.au/units/2022/'+code+'?year=2022" target="_blank">UNE Handbook Entry</a></h4>')
}



function callDragula(){

  dragula(arrForDragula, {
    isContainer: function (el) {
      return false; // only elements in drake.containers will be taken into account
    },
    moves: function (el, source, handle, sibling) {
      getUnitDetails(handle);
      return true; // elements are always draggable by default
    },
    accepts: function (el, target, source, sibling) {
      return true; // elements can be dropped in any of the `containers` by default
    },
    invalid: function (el, handle) {
      return false; // don't prevent any drags from initiating by default
    },
    direction: 'vertical',             // Y axis is considered when determining where an element would be dropped
    copy: false,                       // elements are moved by default, not copied
    copySortSource: false,             // elements in copy-source containers can be reordered
    revertOnSpill: false,              // spilling will put the element back where it was dragged from, if this is true
    removeOnSpill: false,              // spilling will `.remove` the element, if this is true
    mirrorContainer: document.body,    // set the element that gets mirror elements appended
    ignoreInputTextSelection: true,     // allows users to select input text, see details below
    slideFactorX: 0,               // allows users to select the amount of movement on the X axis before it is considered a drag instead of a click
    slideFactorY: 0,               // allows users to select the amount of movement on the Y axis before it is considered a drag instead of a click
  });
}





// -----------  xlsx  variation
/*

  window.onload = function() {
  
    button_container.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = csvFile.files[0];
      const reader = new FileReader();
  
      reader.onload = function (e) {
        const uploaded = e.target.result;
  
        var workbook = XLSX.read(uploaded, {  type: 'binary'   });
  
          var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets['Export Worksheet']);
          var json_object = JSON.stringify(XL_row_object);
  
          printJson(JSON.parse(json_object))
      };
  
      reader.readAsBinaryString(input);
  
    //  reader.readAsText(input);
  
    });
  
    if (skipUpload){
      $('.leftColumn').empty()
      $('.rightColumn').empty()
      selectDegree('arrName', dummyData);
      buildYearGrid(startYear, duration);
      callDragula();
    }
  }
 
  function printJson(json_object){
  
    console.log(json_object[2]);
  
    myDegree = '<p>(JSON.parse(json_object))[195] :<br>';
    $.each(json_object[7],function (index, val) { 
      myDegree = myDegree+index+'&nbsp;'+val.replace(/\r\r/g,'<br>')+'<br>'
    });
  
    $('#button_container').append(myDegree)
  }

  */