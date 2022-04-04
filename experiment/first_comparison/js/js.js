
window.onload = function() {

  const myForm = document.getElementById("csv_upload_form");
  const csvFile = document.getElementById("csvFile");
  myForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const uploaded = e.target.result;
      const degree = (uploaded).slice(0,(uploaded).indexOf("\n")).split(",");
      const units = ((uploaded).slice((uploaded).indexOf("\n")).split("\n")).slice(1,-1);
      populateStudentData(degree,units);
      checkRules(degree,units);
    };
    reader.readAsText(input);
  });
}

function populateStudentData(degree,units){
  $.each(degree, function (index, entry) {
    $('#rulesBox').append(entry+'\n');
  })
  $.each(units, function (index, entry) {
    $('#completedBox').append(entry+'\n');
  })
}


function brokenRuleBox(ruleName, solutionArray, note){
  $('#brokenRules').append('<div class="'+'col'+'"><h3 class="'+'card-title'+'">'+
                            ruleName+':<br></h3><textarea  rows="'+'20'+'">'+
                            note+solutionArray+'</textarea></div>');
}


function checkRules(degree,completedUnits){

  $.each(bCompSci['Rules'],function (index, rule) { 
    var unitType = rule.charAt(0)+rule.charAt(1)+rule.charAt(2);
    //var ruleType = rule.charAt(3)+rule.charAt(4)+rule.charAt(5);
    var cpRequir = rule.charAt(6)+rule.charAt(7)+rule.charAt(8);

    if      (unitType === 'COR' ) { checkForUnitTypes(rule,bCompSci['CoreUnits'], cpRequir,completedUnits); }
    else if (unitType === 'MAJ' ) { checkForUnitTypes(rule,bCompSci['DevMajorPrescribedUnits'], cpRequir,completedUnits); }
    else if (unitType === 'LIS' ) { checkForUnitTypes(rule,bCompSci['DevMajorListedUnits'], cpRequir,completedUnits);}

    else if (unitType === '300' ) { checkForUnitLevel(rule,cpRequir,completedUnits); }
    else if (unitType === '100' ) { checkForUnitLevel(rule,cpRequir,completedUnits); }

  });
}


function checkForUnitTypes(rule,unitList,cpRequir,student) {
  var counter = 0;
  var recomended=[];
  $.each(unitList,function (index, unit) { 
    if ( student.includes(unit['Code']+'\r') ) { counter += parseInt(unit['CP']); }
    else { recomended.push('\n'+unit['Code']) }
  });
  var note = 'You require '+((cpRequir)-counter)+' more cp from the following units: \n\n';
  brokenRuleBox(rule, recomended, note)
}


function checkForUnitLevel(rule,cpRequir,student) {
  var counter = 0;
  var recomended=[];

  $.each(student,function (index, unit) { 
    if ( rule.charAt(0) === unit.charAt(4) ) { counter += 6;  }
  });
  var everything = bCompSci['CoreUnits'].concat(bCompSci['DevMajorPrescribedUnits']).concat(bCompSci['DevMajorListedUnits']);
  $.each(everything,function (index, unit) { 
    if ( rule.charAt(0) === unit['Code'].charAt(4) && !student.includes(unit['Code']+'\r')) {
      recomended.push('\n'+unit['Code'])
    }
  });
  if ( rule.charAt(4) === 'I' ){ 
    var note = 'You require '+((cpRequir)-counter)+' more cp from the following units: \n\n';
  } else {
    var note = 'You are limited to '+((cpRequir)-counter)+' more cp from the following units: \n\n';
  }
  brokenRuleBox(rule, recomended, note)
}