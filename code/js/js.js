
var arrForDragula = [ ];

var duration = 6;


window.onload = function() {

  uploadModal.addEventListener("submit", function (e) {
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



      // make ui
      var startYear = parseInt(studentData['COMMENCEMENT_DT'].substr(-4,4));
      $('#leftColumn').empty()
      $('#rightColumn').empty()
      selectDegree(studentRemainingOptions);
      buildYearGrid(startYear, duration);
      fillCompleted(studentData);
      callDragula(studentTotalOptions);

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






//----------------------- Filter Functions: ----------------------

/*----------------------------------------------------
  filterUnitsByDegree()
  
  arg:      dict of student data (from csv) { key:value, key:[val1,val2] }
  arg:      entire data.js file 
  returns:  array of total student options: [ [core],[major],[minor] ]
  side-effect  - null
-------------------------------------------------*/

function filterUnitsByDegree(studentData, dummyData){

  var arrOfLists = []
  var variantCodes = gatherVariantCodes(studentData);

  $.each(dummyData,function (degreeCode, arrOfArrs) { 
    if (degreeCode === studentData['COURSE_CD']){
      $.each(arrOfArrs,function (index, value) {
        if (typeof(value[1]) === 'number' ) {
          arrOfLists.push(value)         // picks up core units here
        } else {
          if (variantCodes.includes(index)){
            $.each(value,function (index, value1) { 
              if (typeof(value1[1]) === 'number' ) {
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

function filterUnitsByCompleted(completedUnits, studentTotalOptions){
  var newArr = [];
  var completedFilter = [];

  $.each(studentTotalOptions,function (index, list) {
    var newSubArr = [];
    $.each(list,function (index2, unit) {
      if (completedUnits.includes(unit['Code'])){
        newSubArr[1] = parseInt(newSubArr[1])-parseInt(unit['CP'])
        completedFilter.push(unit['Code']);
        unit['CP'] = '0'
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


/* ----------------------------------------------------
  gatherVariantCodes()

  arg:      dict of student data (from csv) { key:value, key:[val1,val2] }
  returns:  messy array of 'unit blocks' - eg: majors, minors, pre-existing qualifications [ str,str,str ]
  side-effect  - null
------------------------------------------------- */

function gatherVariantCodes(studentData){

  var variantCodes = (studentData['Adv Stnd Units']+
                      studentData['Unit Sets (Completed)']+
                      studentData['Unit Sets (Non-Completed)\r']+
                      studentData['Completed Units'])
  variantCodes = ((variantCodes.replace(/(['",])/g,' ')).split(' ')).filter(item => item.length > 4 );

  if (studentData['COURSE_CD'] == 'BN04'  && !variantCodes.includes('NMBA48') &&
        !variantCodes.includes('BACHI42') && !variantCodes.includes('ENURS48')){
    variantCodes.push('Rule_A_F')  } // 1 hard-coded rule becuase nursing is structured weird.
  
  return variantCodes

}

















// ------------------- all UI stuff below -------------------

function selectDegree(arr){

  if (typeof(arr[1]) === 'number' ) {
    buildUnitList(arr[0], arr)

  } else  {
    $.each(arr,function (index, unitList) { 
      selectDegree(unitList);
    });
  }
}



function fillCompleted(studentData){

  //STUDENTNUMBER,COURSE_CD,COURSE_TITLE,COURSE_VERSION,COURSE_ATTEMPT_STATUS,MODE,TYPE,ORG_UNIT_CD,
  //COMMENCEMENT_DT,ENROLLED_CURRENT_TP,ENROLLED_YR,STUDENT_TYPE,CREDIT_POINTS_REQUIRED,ADVANCED STANDING CP,
  //COMPLETED_CREDIT_POINTS,OUTSTANDING_POINTS,Course Location,Completed Units,Adv Stnd Units,
  //Unit Sets (Completed),Unit Sets (Non-Completed)

  $('#studentInfoBox').empty()
  $.each(studentData,function (key, value) { 
    if(key == 'STUDENTNUMBER' ){
      $('#studentInfoBox').append(value+'<br>')
    }
    if(key == 'CREDIT_POINTS_REQUIRED'  ||  key == 'OUTSTANDING_POINTS' ||
       key == 'COMPLETED_CREDIT_POINTS' || key == 'Adv Stnd Units'){
      $('#studentInfoBox').append(key.slice(0,12)+' : '+value+'<br>')
    }    
  })

        // this concat is here to ensure the element is an array - ( passing a single str to $.each() is bad mojo)
  $.each([].concat(studentData['Completed Units']),function (index, unit) { 
        // this is the html.append for the completed units
  $('#t'+unit.slice(unit.indexOf('-'))[1]+'y'+
    unit.slice(unit.indexOf('-')).slice(3,7)).append('<li class="unit hoverable"><p>'+
    unit.replace('"','').slice(0,unit.indexOf(' '))+'</li>')
  });
}



function buildUnitList(listName, arr){

// make the list
  var col = ''
  if (listName.includes('scri') || listName.includes('isted')) {
    col = '#rightColumn';
  } else {
    col = '#leftColumn';
  }
 $(col).append('<li class="column '+listName+'_column card">'+
            '      <div class="column_header">'+
            '        <h4>'+arr[1]+'CP '+arr[0]+':</h4>'+
            '      </div>'+
            '      <ul class="unit_list" id="'+listName+'_unit_list"></ul>'+
            '    </li>')

// put units in the list
  //console.log('making list called: '+listName+'  and populating with '+(arr.slice(2)).length+' elements'); 

  $.each(arr.slice(2),function (index, unit) { 

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

  for (let i = 0; i < numberOfYears; i++) {
    $('#middleColumn').append(
      '<div class="year_box row">'+
      '<ul class="trimester_box col l4 m4 s4">'+
      '  <div class="trimester_box_header">Tri 1 '+(startYear+i)+'</div>'+
      '  <ul class="unit_list" id="t1y'+(startYear+i)+'"></ul>'+
      '</ul>'+
      '<ul class="trimester_box col l4 m4 s4">'+
      '  <div class="trimester_box_header">   Tri 2 '+(startYear+i)+'</div>'+
      '  <ul class="unit_list" id="t2y'+(startYear+i)+'"></ul>'+
      '</ul>'+
      '<ul class="trimester_box col l4 m4 s4">'+
      '  <div class="trimester_box_header">   Tri 3 '+(startYear+i)+'</div>'+
      '  <ul class="unit_list" id="t3y'+(startYear+i)+'"></ul>'+
      '</ul>'+
      '</div>'
    )
    arrForDragula.push(document.getElementById("t1y"+(startYear+i)));
    arrForDragula.push(document.getElementById("t2y"+(startYear+i)));
    arrForDragula.push(document.getElementById("t3y"+(startYear+i)));
  }
}


function getUnitDetails(handle, studentTotalOptions){

  var code = handle.outerHTML.substr(3,7);
  var name = 'Name';
  var TriAvail = 'TriAvail';
  var Prereq = 'Prereq';

  $.each(studentTotalOptions,function (index, arr) { 
    $.each(arr,function (index, unit) { 

      if (unit['Code'] == code ) {
        name = unit['Name'];
        TriAvail = unit['TriAvail'];
        Prereq = unit['Prereq'];
      }
      if(code.charAt(6) == ' '){  name = ' ## 6 digit unit codes break this! ## '      }
    });
  });
  
  $('.unitInfoBox').empty()
  $('.unitInfoBox').append('<h4>'+code+'<p></h4><h4>'+name+'</h4><h4> &nbsp;'+
                          'Trimesters:&nbsp; '+TriAvail+'&nbsp;&nbsp;Prereqs: '+Prereq+
                          '</h4><h4>&nbsp; <a href="https://handbook.une.edu.au/units/2022/'+code+'?year=2022" target="_blank">UNE Handbook Entry</a></h4>')
}



function callDragula(studentTotalOptions){

  dragula(arrForDragula, {
    isContainer: function (el) {
      return false; // only elements in drake.containers will be taken into account
    },
    moves: function (el, source, handle, sibling) {
      getUnitDetails(handle, studentTotalOptions);
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