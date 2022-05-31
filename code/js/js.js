var arrForDragula = [];
// this is a global because the func that adds it up is recursive
let cpCountforElecPad = 0

window.onload = function () {

  uploadModal.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();
    const name = document.getElementById('name-input').value;
    setName(name);

    reader.onload = function (e) {

      // clear globals on re-load
      arrForDragula = [];
      cpCountforElecPad = 0

      const studentData = handleUpload(e.target.result);

      const completedUnits = ((studentData['Completed Units'] + studentData['Adv Stnd Units']).replace(/(['",])/g, ' ')).split(' ')
      const studentTotalOptions = filterUnitsByDegree(studentData, dummyData)
      const studentRemainingOptions = filterUnitsByCompleted(completedUnits, studentTotalOptions)

      // make ui
      var startYear = parseInt(studentData['COMMENCEMENT_DT'].substr(-4, 4));
      $('#leftColumn').empty()
      $('#rightColumn').empty()
      selectDegree(studentRemainingOptions);
      buildYearGrid(startYear, $('select').val());
      fillCompleted(studentData);
      drake = callDragula(studentTotalOptions);

    };
    reader.readAsText(input);
  });
  // Open the modal on page load
  M.Modal.getInstance($('.modal')).open();
}


/*----------------------------------------------------
  handleUpload()
  
  arg:  .csv object uploaded via html    
  returns:  dict  { 'key' : 'value', 'key' : 'value', etc }
-------------------------------------------------*/
function handleUpload(uploaded) {

  // break .csv into 2 arrays and clean them up
  const headers = (uploaded).slice(0, (uploaded).indexOf("\n")).split(",");
  var value = (uploaded).slice((uploaded).indexOf("\n")).split(",");
  var cleanValues = [];
  for (var i = 0; i < value.length; i++) {
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
        //unit['CP'] = '0'
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

  if (studentData['COURSE_CD'] == 'BCOMP' &&
    variantCodes.includes('SOFTDEV002') && variantCodes.includes('DATASC001')) {
    variantCodes.push('DOUBLE')
    variantCodes = variantCodes.filter(item => item !== 'SOFTDEV002')
    variantCodes = variantCodes.filter(item => item !== 'DATASC001')
  } // hard-coded rule for bcomp double, because doing it properly would be hard #shame

  return variantCodes

}

















// ------------------- all UI stuff below -------------------

/*----------------------------------------------------
  selectDegree()
  this tricky devil recursively checks if the current dimesion is a dict of units or, 
  dict of dicts by checking the 2nd value, and calling a gui build func, or itself

  arg:  multi dimentinal dict of dicts
  returns:  null
  side-effect  - global:  cpCountforElecPad is added up here
  side effect  - calls buildUnitList() which has proforms gui building
-------------------------------------------------*/
function selectDegree(arr) {
  if (typeof (arr[1]) === 'number') {
    buildUnitList(arr[0], arr)
    cpCountforElecPad += arr[1]
  } else {
    $.each(arr, function (index, unitList) {
      selectDegree(unitList);
    });
  }
}


/*----------------------------------------------------
  fillCompleted()

  arg:  array - all student info
  returns:  null
  side-effect  - proforms gui building ( student info box and completed units )
  side effect  - calls padWithElectives() which has proforms gui building
-------------------------------------------------*/
function fillCompleted(studentData) {

  $('#studentInfoBox').empty()
  var completedCP = 0;
  var requiredCP = 0;
  $('#studentInfoBox').append('<h3>Course Progress</h3><br>')
  $.each(studentData, function (key, value) {
    if (key == 'STUDENTNUMBER') {
      $('#studentInfoBox').append('Course: ' + value + '<br>')
    }
    value == "" ? value = "0" : null;
    switch (key) {
      case 'CREDIT_POINTS_REQUIRED': {
        requiredCP = Number(value);
        break;
      }
      case 'COMPLETED_CREDIT_POINTS' || 'Adv Stnd Units': {
        completedCP += Number(value);
        break;
      }

    }
  })

  $('#studentInfoBox').append('Require: ' + requiredCP + 'cp<br>')
  $('#studentInfoBox').append('Completed: ' + completedCP + 'cp<br>')
  let percentComplete = (completedCP / requiredCP) * 100;
  $('#studentInfoBox').append('<div class="w3-border"><div class="w3-green w3-center" style="height:24px;width:' + percentComplete + '%">' + percentComplete + '%</div></div><br>')

  // this concat is here to ensure the element is an array - ( passing a single str to $.each() is bad mojo)
  $.each([].concat(studentData['Completed Units']), function (index, unit) {
    // this is the html.append for the completed units
    $('#t' + unit.slice(unit.indexOf('-'))[1] + 'y' +
      unit.slice(unit.indexOf('-')).slice(3, 7)).append('<li class="unit completedUnit"><p>' +
        unit.replace('"', '').slice(0, unit.indexOf(' ')) + '</li>')
  });

  padWithElectives(requiredCP - completedCP)
}


/*----------------------------------------------------
  padWithElectives()

  arg:  int - total req cp for course
  returns:  null
  side-effect  - proforms gui building ( makes elective unit tiles )
  side effect  - adds to global arrForDragula[]
-------------------------------------------------*/
function padWithElectives(requiredCP) {

  let numberOfElectives = requiredCP - cpCountforElecPad
  if (numberOfElectives > 0) {
    $('#leftColumn').append('<li class="card">' +
      '      <div class="column_header column elective_column">' +
      '        <h4 id = "elective_counter">' + String(requiredCP - cpCountforElecPad) + 'CP Others:</h4>' +
      '      </div>' +
      '      <ul class="unit_list" id="elective_unit_list"></ul>' +
      '    </li>')
    for (let i = 1; i < (numberOfElectives / 6) + 1; i++) {
      $('#elective_unit_list').append('<li id="elective' + i + '" class=" unit hoverable tri_123 elective_unit cp_6 "><p> Elec/Maj/Min </p></li>')
    }
    arrForDragula.push(document.getElementById('elective_unit_list'));
  }
}


/*----------------------------------------------------
  buildUnitList()

  arg:  string  name of list (core, listed_1 etc..)
  arg:  arr -unit list
  returns:  null
  side-effect  - proforms gui building ( makes unit tiles and boxes for them )
  side effect  - adds to global arrForDragula[]
-------------------------------------------------*/
function buildUnitList(listName, arr) {

  // make the list
  var col = ''
  if ((listName.includes('scri') || listName.includes('isted')) && $("#leftColumn").find('.unit_list').length > 0) {
    col = '#rightColumn';
  } else {
    col = '#leftColumn';
  }
  $(col).append('<li class="card">' +
    '      <div class="column_header column ' + listName + '_column">' +
    '        <h4 id = "' + listName + '_counter">' + arr[1] + 'CP ' + arr[0] + ':</h4>' +
    '      </div>' +
    '      <ul class="unit_list available_units" id="' + listName + '_unit_list"></ul>' +
    '    </li>')

  // put units in the list
  $.each(arr.slice(2), function (index, unit) {

    $('#' + listName + '_unit_list').append('<li id="' + unit['Code'] + '" class="unit hoverable tri_' + unit['TriAvail'] +
      '  ' + listName + '_unit cp_' + unit['CP'] + ' "><p>' + unit['Code'] + '</p></li>')
  });

  // add units to 'make-me-draggable' list
  arrForDragula.push(document.getElementById(listName + '_unit_list'));
}


/*----------------------------------------------------
  updateListCounters()

  arg:  unit tile div
  arg:  unit list div
  arg:  unit list div
  returns:  null
  side-effect  - proforms gui building ( changes cp counters )
-------------------------------------------------*/
function updateListCounters(el, target, source) {    //  called everytime something is droped 

  let list = el.classList + '';
  let unittype = list.slice(list.indexOf('tri_') + 7).trim() + '_list';
  unittype = unittype.slice(0, unittype.indexOf(' '));
  let cpValue = parseInt(list.slice(list.indexOf('cp_') + 3, list.indexOf('cp_') + 5));

  let listOfLists = document.querySelectorAll('[id*="_unit_list"]')

  listOfLists.forEach(list => {
    if (list.id.slice(0, list.id.indexOf('_list')) == unittype) {

      var idTagSelc = list.id.slice(0, list.id.indexOf('_unit')) + '_counter'
      var counterString = $('#' + idTagSelc).html();
      var curretCp = parseInt(counterString.slice(0, counterString.indexOf('CP')));
      label = counterString.slice(counterString.indexOf('CP'));
      if (source.includes(unittype) && !target.includes(unittype)) { // unit taken from origin list
        $('#' + idTagSelc).html((curretCp - cpValue) + label);
      }
      else if (target.includes(unittype) && !source.includes(unittype)) { // unit put back into origin list 
        $('#' + idTagSelc).html((curretCp + cpValue) + label);
      }
    }
  });
}


/*----------------------------------------------------
  highlightDropOptions()

  arg:  class list of 'picked up' unit div
  returns:  null
  side-effect  - proforms gui stuff ( handles .dropable only)
-------------------------------------------------*/
function highlightDropOptions(list) {     //  called everytime something is draged 

  $('.dropable').each(function () {
    $(this).removeClass('dropable');
  });

  let unittype = list.slice(list.indexOf('tri_') + 7, list.indexOf('_unit') + 5).trim() + '_list';
  let triAvail = list.slice(list.indexOf('tri_') + 4, list.indexOf('tri_') + 8);

  for (let i = 0; i < 3; i++) {
    $('.tri_' + triAvail[i] + '_box').each(function () {
      let triId = (this.outerHTML).slice(this.outerHTML.indexOf('id="') + 4, this.outerHTML.indexOf('id="') + 11);
      if (!triExpired(triId)) {
        $(this).find('.unit_list').addClass('dropable');
      }
    });
  }
  $('#' + unittype).addClass('dropable');
}


/*----------------------------------------------------
  buildYearGrid()

  arg:  int
  arg:  int
  returns:  null
  side-effect  - proforms gui stuff
  side-effect  - adds to global arrForDragula[]
-------------------------------------------------*/
function buildYearGrid(startYear, numberOfYears) {

  const boxes = Array.from(document.getElementsByClassName('year_box'));
  boxes.forEach(box => {
    box.remove();
  });
  let isExp = ''
  for (let i = 0; i < numberOfYears; i++) {
    if (startYear + i < 2022) { isExp = 'expiredTri' } else { isExp = '' }
    $('#calendar').append(
      '<div class="year_box row">' +
      '<ul class="trimester_box tri_1_box col l4 m4 s4">' +
      '  <div class="trimester_box_header">Tri 1 ' + (startYear + i) + '</div>' +
      '  <ul class="unit_list trimester_box ' + isExp + '" id="t1y' + (startYear + i) + '"></ul>' +
      '</ul>' +
      '<ul class="trimester_box tri_2_box col l4 m4 s4">' +
      '  <div class="trimester_box_header">   Tri 2 ' + (startYear + i) + '</div>' +
      '  <ul class="unit_list trimester_box ' + isExp + '" id="t2y' + (startYear + i) + '"></ul>' +
      '</ul>' +
      '<ul class="trimester_box tri_3_box col l4 m4 s4">' +
      '  <div class="trimester_box_header">   Tri 3 ' + (startYear + i) + '</div>' +
      '  <ul class="unit_list trimester_box ' + isExp + '" id="t3y' + (startYear + i) + '"></ul>' +
      '</ul>' +
      '</div>'
    )
    arrForDragula.push(document.getElementById("t1y" + (startYear + i)));
    arrForDragula.push(document.getElementById("t2y" + (startYear + i)));
    arrForDragula.push(document.getElementById("t3y" + (startYear + i)));
  }
}


/*----------------------------------------------------
  getUnitDetails()

  arg:  div object
  arg:  arr of dicts
  returns:  null
  side-effect  - proforms gui stuff
-------------------------------------------------*/
function getUnitDetails(handle, studentTotalOptions) {

  var code = handle.firstChild.outerHTML.substr(3, 7);
  var name = 'data incomplete, check handbook';
  var TriAvail = 'data incomplete';
  var Prereq = 'data incomplete, check handbook';

  $.each(studentTotalOptions, function (index, arr) {
    $.each(arr, function (index, unit) {

      if (unit['Code'] == code) {
        name = unit['Name'];
        TriAvail = unit['TriAvail'];
        //Prereq = unit['Prereq'];
      }
      switch (TriAvail) {
        case '12' || '23' || '13': {
          TriAvail = TriAvail[0] + ' and ' + TriAvail[1];
          break;
        }
        case '123' || 'Adv Stnd Units': {
          TriAvail = TriAvail[0] + ', ' + TriAvail[1] + ' and ' + TriAvail[2] + '*';
          break;
        }
      }
      if (TriAvail.length > 1)
        code = code.replace('<', '')
      code = code.trim()
    });
  });

  $('.unitInfoBox').empty()
  $('.unitInfoBox').append('<h3>' + code + ' Information</h3><br>');
  $('.unitInfoBox').append('Name: ' + name +
    '<br>Run in Trimester(s): ' + TriAvail +
    '<br>Prereqs: ' + Prereq +
    '<br><a href="https://handbook.une.edu.au/units/2022/' + code + '?year=2022" target="_blank">' + code + ' Handbook Entry</a>')
}


/*----------------------------------------------------
  resetDrags()

  returns:  null
  side-effect  - proforms gui stuff
-------------------------------------------------*/
function resetDrags() {

  $('.unit').each(function () {
    let classes = this.classList + ''
    let unit_type = classes.slice(classes.indexOf('tri_') + 7, classes.indexOf('_unit')).trim();

    if (classes.includes("hover") && !$(this).parent().attr('id').includes(unit_type)) {
      $(this).detach().appendTo('#' + unit_type + '_unit_list')
      updateListCounters(this, ('#' + unit_type + '_unit_list'), ('#t2y2022'))
      // #t2y2022 is a dummy value, the magic for the counters is the !$(this)
    }
  });
}


/*----------------------------------------------------
  autoFill()

  arg:  int
  returns:  null
  side-effect  - proforms gui stuff, lots of it
-------------------------------------------------*/
function autoFill(unitsPerTri) {

  dumbList = []

  $('.unit').each(function () {
    dumbList.push(this)
  })
  // TODO: build list properly  -easy
  // favour 3rd tri units   -easy
  // the pre-req magic needs to be called here  -voodoo
  // track 100's  -easy
  // track 300's  -easy
  // get/track totalRequired cp  -very easy
  // get smarterer   -tell'm he's dream'n

  $('.trimester_box .unit_list').each(function () {

    if (!triExpired(this.id)) {  // need to add a 'not in-progress' to this
      for (let i = 0; i < unitsPerTri; i++) {
        if (i == 0 && (this.id + '')[1] == '3') { i += 1 } // do less units in tri3

        if (dumbList.length > 0) {

          for (let j = 0; j < dumbList.length; j++) {

            let cl = dumbList[j].classList + ''
            let unitTris = cl.slice(cl.indexOf('tri_') + 4, cl.indexOf('tri_') + 7)

            if (unitTris.includes((this.id + '')[1])) {
              var str = $('#' + dumbList[j].classList[3] + '_list').parent().html()
              var parentCounter = parseInt(str.slice(str.indexOf('counter">') + 9, str.indexOf('counter">') + 10))
              if (parentCounter > 0) {  // checking list counter is > 0
                $('#' + dumbList[j].id).detach().appendTo('#' + this.id)

                updateListCounters(dumbList[j], '#' + this.id, '#' + dumbList[j].classList[3] + '_list')
                dumbList.splice(j, 1);
                j = dumbList.length
              }
            }
          }
        }
      }
    }
  });
}







// -------    Dragula Library stuff ----------------

function callDragula(studentTotalOptions) {

  dragula(arrForDragula, {
    isContainer: function (el) {
      return false; // only elements in drake.containers will be taken into account
    },
    moves: function (el, source, handle, sibling) {
      getUnitDetails(el, studentTotalOptions);
      highlightDropOptions(el.classList + '');

      return !el.className.includes("completedUnit"); // elements only dragable if not completed
    },
    accepts: function (el, target, source, sibling) {

      // Accepts all elements into trimester lists
      let elclassList = (el.classList + '')
      let triAvail = elclassList.slice(elclassList.indexOf('tri_') + 4, elclassList.indexOf('tri_') + 7);

      if ((target.id.includes("t" + triAvail[0] + "y") || target.id.includes("t" + triAvail[1] + "y") || target.id.includes("t" + triAvail[2] + "y")) && !triExpired(target.id)) {
        return true;
      }

      if (elclassList.includes(target.id.slice(0, -5))) {
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

    .on('drop', function (el, target, source) {
      updateListCounters(el, target.id, source.id);
      $('.dropable').each(function () {
        $(this).removeClass('dropable');
      });
    })
}


function triExpired(id) {
  let year = new Date(id.substring(3, 7) + "-03"); // Tri 1 starts in March
  let tri = id.substring(1, 2);
  let month = 2629800000; // Milliseconds in a month

  let triEndDate = new Date(year.getTime() + tri * 4 * month);

  return triEndDate < new Date(); // Return triEndDate has already occured

}

function setName(name) {
  $('#student-name').empty();
  $('#student-name').append("Welcome " + name);
}

$(document).ready(function () {
  $('select').formSelect();
});