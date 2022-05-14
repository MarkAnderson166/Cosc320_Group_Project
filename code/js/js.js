var arrForDragula = [];

// var duration = 6;

window.onload = function () {

  uploadModal.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      arrForDragula = [];

      const studentData = handleUpload(e.target.result);

      const completedUnits = ((studentData['Completed Units'] + studentData['Adv Stnd Units']).replace(/(['",])/g, ' ')).split(' ')
      const studentTotalOptions = filterUnitsByDegree(studentData, dummyData)
      const studentRemainingOptions = filterUnitsByCompleted(completedUnits, studentTotalOptions)
/*
      console.log('completedUnits')
      console.log(completedUnits)
      console.log('studentTotalOptions')
      console.log(studentTotalOptions)
      console.log('studentRemainingOptions')
      console.log(studentRemainingOptions)
      console.log('gatherVariantCodes(studentData)')
      console.log(gatherVariantCodes(studentData))
*/
      // make ui
      var startYear = parseInt(studentData['COMMENCEMENT_DT'].substr(-4, 4));
      $('#leftColumn').empty()
      $('#rightColumn').empty()
      selectDegree(studentRemainingOptions);
      buildYearGrid(startYear, 10);
      fillCompleted(studentData);
      drake = callDragula(studentTotalOptions);
      // anything that happens after file upload has to be called here


    };
    reader.readAsText(input);
  });
}


function handleUpload(uploaded){

  // break .csv into 2 arrays and clean them up
  const headers = (uploaded).slice(0, (uploaded).indexOf("\n")).split(",");
  var value = (uploaded).slice((uploaded).indexOf("\n")).split(",");
  var cleanValues = [];
  for (var i = 0; i < value.length; i++){
    cleanValues.push(value[i].replace(/\n/g, ''));
  }

  // combine arrays into a dictionary
  var studentData = {};
  for (var i = 0; i < headers.length; i++) {
    if (cleanValues[i].includes('\r')) {
      studentData[headers[i]] = (cleanValues[i].split("\r"));
    } else {
      studentData[headers[i]] = cleanValues[i];
    }
  }
  return studentData
}
// I will need to make this recursive later. (probably)
function removeNewlines(arr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++)
    newArr.push(arr[i].replace(/\n/g, ''));
  return newArr
}











//----------------------- Filter Functions: ----------------------

/*----------------------------------------------------
  filterUnitsByDegree()
  
  arg:      dict of student data (from csv) { key:value, key:[val1,val2] }
  arg:      entire data.js file 
  returns:  array of total student options: [ [core],[major],[minor] ]
  side-effect  - null
-------------------------------------------------*/

function filterUnitsByDegree(studentData, dummyData) {

  var arrOfLists = []
  var variantCodes = gatherVariantCodes(studentData);

  $.each(dummyData, function (degreeCode, arrOfArrs) {
    if (degreeCode === studentData['COURSE_CD']) {
      $.each(arrOfArrs, function (index, value) {
        if (typeof (value[1]) === 'number') {
          arrOfLists.push(value)         // picks up core units here
        } else {
          if (variantCodes.includes(index)) {
            $.each(value, function (index, value1) {
              if (typeof (value1[1]) === 'number') {
                arrOfLists.push(value1)  // picks up major/minor units here
              }
            });
          }
        }
      });
    }
  });
  return arrOfLists
}


/* ----------------------------------------------------
  filterUnitsByCompleted()

  arg:      array of options [ [],[],[] ]
  arg:      array of completed(+adv standing) []
  returns:  array of reccommendation arrays: [ [],[],[] ]
  side-effect  - dumps to console list of things that didn't match
------------------------------------------------- */

function filterUnitsByCompleted(completedUnits, studentTotalOptions) {
  var newArr = [];
  var completedFilter = [];

  $.each(studentTotalOptions, function (index, list) {
    var newSubArr = [];
    $.each(list, function (index2, unit) {
      if (completedUnits.includes(unit['Code'])) {
        newSubArr[1] = parseInt(newSubArr[1]) - parseInt(unit['CP'])
        completedFilter.push(unit['Code']);
        unit['CP'] = '0'
      } else {
        newSubArr.push(unit);
      }
    });
    newArr.push(newSubArr);
  });

  // list completed elements that didn't match any options
  var unMatched = []
  unMatched = completedUnits.filter(item => !completedFilter.includes(item));
  unMatched = unMatched.filter(item => item.length > 4 && item.slice(0, 4) != 'TRI-');
  if (unMatched.length > 0) {
    console.log('Things left in -completed- after filtering,  possible electives? ...: ');
    console.log(unMatched);
  }

  return newArr;
}


/* ----------------------------------------------------
  gatherVariantCodes()

  arg:      dict of student data (from csv) { key:value, key:[val1,val2] }
  returns:  messy array of 'unit blocks' - eg: majors, minors, pre-existing qualifications [ str,str,str ]
  side-effect  - null
------------------------------------------------- */

function gatherVariantCodes(studentData) {

  var variantCodes = (studentData['Adv Stnd Units'] +
    studentData['Unit Sets (Completed)'] +
    studentData['Unit Sets (Non-Completed)\r'] +  // careful with this \r - breaks lots of stuff
    studentData['Completed Units'])
  variantCodes = ((variantCodes.replace(/(['".,])/g, ' ')).split(' ')).filter(item => item.length > 4);


  if (studentData['COURSE_CD'] == 'BN04' && !variantCodes.includes('NMBA48') &&
    !variantCodes.includes('BACHI42') && !variantCodes.includes('ENURS48')) {
    variantCodes.push('Rule_A_F')
  } // 1 hard-coded rule becuase nursing is structured weird.

  return variantCodes

}

















// ------------------- all UI stuff below -------------------

function selectDegree(arr) {

  if (typeof (arr[1]) === 'number') {
    buildUnitList(arr[0], arr)

  } else {
    $.each(arr, function (index, unitList) {
      selectDegree(unitList);
    });
  }
}



function fillCompleted(studentData) {

  //STUDENTNUMBER,COURSE_CD,COURSE_TITLE,COURSE_VERSION,COURSE_ATTEMPT_STATUS,MODE,TYPE,ORG_UNIT_CD,
  //COMMENCEMENT_DT,ENROLLED_CURRENT_TP,ENROLLED_YR,STUDENT_TYPE,CREDIT_POINTS_REQUIRED,ADVANCED STANDING CP,
  //COMPLETED_CREDIT_POINTS,OUTSTANDING_POINTS,Course Location,Completed Units,Adv Stnd Units,
  //Unit Sets (Completed),Unit Sets (Non-Completed)

  $('#studentInfoBox').empty()
  $.each(studentData, function (key, value) {
    if (key == 'STUDENTNUMBER') {
      $('#studentInfoBox').append(value + '<br>')
    }
    if (key == 'CREDIT_POINTS_REQUIRED' || key == 'OUTSTANDING_POINTS' ||
      key == 'COMPLETED_CREDIT_POINTS' || key == 'Adv Stnd Units') {
      $('#studentInfoBox').append(key.slice(0, 12) + ' : ' + value + '<br>')
    }
  })

  // this concat is here to ensure the element is an array - ( passing a single str to $.each() is bad mojo)
  $.each([].concat(studentData['Completed Units']), function (index, unit) {
    // this is the html.append for the completed units
    $('#t' + unit.slice(unit.indexOf('-'))[1] + 'y' +
      unit.slice(unit.indexOf('-')).slice(3, 7)).append('<li class="unit completedUnit"><p>' +
        unit.replace('"', '').slice(0, unit.indexOf(' ')) + '</li>')
  });
}



function buildUnitList(listName, arr) {

  // make the list
  var col = ''
  if (listName.includes('scri') || listName.includes('isted')) {
    col = '#rightColumn';
  } else {
    col = '#leftColumn';
  }
  $(col).append('<li class="card">' +
    '      <div class="column_header column ' + listName + '_column">' +
    '        <h4 id = "'+listName+'_counter">' + arr[1] + 'CP ' + arr[0] + ':</h4>' +
    '      </div>' +
    '      <ul class="unit_list" id="' + listName + '_unit_list"></ul>' +
    '    </li>')

  // put units in the list

  $.each(arr.slice(2), function (index, unit) {

    $('#' + listName + '_unit_list').append('<li class="unit hoverable tri_'+unit['TriAvail']+
          '  ' + listName +'_unit"><p>' +unit['Code'] + '  ' + unit['TriAvail'] + '</p></li>')
  });

  // add units to 'make-me-draggable' list
  arrForDragula.push(document.getElementById(listName + '_unit_list'));
}



function updateListCounters(el){           //  called everytime something is droped 
  let list = el.classList+'';
  let unittype = list.slice(list.indexOf('tri_')+7).trim()+'_list';
  unittype = unittype.slice(0,unittype.indexOf(' '));

  let listOfLists = document.querySelectorAll('[id*="_unit_list"]')

  var curretCp = 0;
  var counterString = ''
  var idTagSelc = ''
  listOfLists.forEach(list => {
    if ( list.id.slice(0,list.id.indexOf('_list')) == unittype ){

      if ( true ){ // taken from list

        idTagSelc = list.id.slice(0,list.id.indexOf('_unit'))+'_counter'
        counterString = $('#'+idTagSelc).html();
        curretCp = parseInt(counterString.slice(0, counterString.indexOf('CP')))-6;
        label = counterString.slice(counterString.indexOf('CP'));
        $('#'+idTagSelc).html(curretCp+label);
      }
      else { // put back into list 

        idTagSelc = list.id.slice(0,list.id.indexOf('_unit'))+'_counter'
        counterString = $('#'+idTagSelc).html();
        curretCp = parseInt(counterString.slice(0, counterString.indexOf('CP')))+6;
        label = counterString.slice(counterString.indexOf('CP'));
        $('#'+idTagSelc).html(curretCp+label);
      }
    }
  });
}


function highlightDropOptions(list){     //  called everytime something is droped 
  let unittype = list.slice(list.indexOf('tri_')+7).trim()+'_list';
  let triAvail = list.slice(list.indexOf('tri_')+4,list.indexOf('tri_')+8);

  for (let i = 0; i < 3; i++) {
    $('.tri_'+triAvail[i]+'_box').each(function() {
      $(this).find('*').addClass('dropable');
    });
    $('#'+unittype).addClass('dropable');
  }
}



function buildYearGrid(startYear, numberOfYears) {

  const boxes = Array.from(document.getElementsByClassName('year_box'));
  boxes.forEach(box => {
    box.remove();
  });

  for (let i = 0; i < numberOfYears; i++) {
    $('#calendar').append(
      '<div class="year_box row">' +
      '<ul class="trimester_box tri_1_box col l4 m4 s4">' +
      '  <div class="trimester_box_header">Tri 1 ' + (startYear + i) + '</div>' +
      '  <ul class="unit_list trimester_box " id="t1y' + (startYear + i) + '"></ul>' +
      '</ul>' +
      '<ul class="trimester_box tri_2_box col l4 m4 s4">' +
      '  <div class="trimester_box_header">   Tri 2 ' + (startYear + i) + '</div>' +
      '  <ul class="unit_list trimester_box " id="t2y' + (startYear + i) + '"></ul>' +
      '</ul>' +
      '<ul class="trimester_box tri_3_box col l4 m4 s4">' +
      '  <div class="trimester_box_header">   Tri 3 ' + (startYear + i) + '</div>' +
      '  <ul class="unit_list trimester_box " id="t3y' + (startYear + i) + '"></ul>' +
      '</ul>' +
      '</div>'
    )
    arrForDragula.push(document.getElementById("t1y" + (startYear + i)));
    arrForDragula.push(document.getElementById("t2y" + (startYear + i)));
    arrForDragula.push(document.getElementById("t3y" + (startYear + i)));
  }
}


function getUnitDetails(handle, studentTotalOptions) {

  var code = handle.outerHTML.substr(3, 7);
  var name = 'Name';
  var TriAvail = 'TriAvail';
  var Prereq = 'Prereq';

  $.each(studentTotalOptions, function (index, arr) {
    $.each(arr, function (index, unit) {

      if (unit['Code'] == code) {
        name = unit['Name'];
        TriAvail = unit['TriAvail'];
        Prereq = unit['Prereq'];
      }
      if (code.charAt(6) == ' ') { name = ' ## 6 digit unit codes break this! ## ' }
    });
  });

  $('.unitInfoBox').empty()
  $('.unitInfoBox').append('<h4>' + code + '<p></h4><h4>' + name + '</h4><h4> &nbsp;' +
    'Trimesters:&nbsp; ' + TriAvail + '&nbsp;&nbsp;Prereqs: ' + Prereq +
    '</h4><h4>&nbsp; <a href="https://handbook.une.edu.au/units/2022/' + code + '?year=2022" target="_blank">UNE Handbook Entry</a></h4>')
}














// -------    Dragula Library stuff ----------------

function callDragula(studentTotalOptions) {

  dragula(arrForDragula, {
    isContainer: function (el) {
      return false; // only elements in drake.containers will be taken into account
    },
    moves: function (el, source, handle, sibling) {

      getUnitDetails(handle, studentTotalOptions);
      highlightDropOptions(el.classList+'');

      return !el.className.includes("completedUnit"); // elements only dragable if not completed
    },
    accepts: function (el, target, source, sibling) {

      // Accepts all elements into trimester lists
      let elclassList = (el.classList + '')
      let triAvail = elclassList.slice(elclassList.indexOf('tri_')+4,elclassList.indexOf('tri_')+7);

      if ((target.id.includes("t"+triAvail[0]+"y") || target.id.includes("t"+triAvail[1]+"y") || target.id.includes("t"+triAvail[2]+"y")) && !triExpired(target.id)) {
        return true;
      }

      if (elclassList.includes(target.id.slice(0,-5))){
        return true
      }

      // Accepts elements originally from target
      for (let i = 0; i < el.classList.length; i++) {
        if (el.classList.item(i).includes("Core")) {
          return target.id.includes(el.classList.item(i));
        }
      }
      return false
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
  })

  .on('drop', function (el) {
    $('.dropable').each(function() {
      $(this).removeClass('dropable');
    });
    
    updateListCounters(el);

  });
}


function triExpired(id) {
  let year = new Date(id.substring(3, 7) + "-03"); // Tri 1 starts in March
  let tri = id.substring(1, 2);
  let month = 2629800000; // Milliseconds in a month

  let triEndDate = new Date(year.getTime() + tri * 4 * month);

  return triEndDate < new Date(); // Return triEndDate has already occured

}