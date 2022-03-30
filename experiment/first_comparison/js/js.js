
$(function() {
    $('#buttonForm').submit(function(e) {
      $('#brokenRules').empty();
      //button();
      populateData();

      checkRule(bcompSciDev);
    });
  });
window.onload = function() {
  populateData();
  checkRule(bcompSciDev);
}

function populateData(){
  $.each(bcompSciDevRules, function (index, entry) {
    $('#rulesBox').append(entry+'\n');
  })
  $.each(student, function (index, entry) {
    $('#completedBox').append(entry+'\n');
  })
}
/*
function button(){
  document.getElementById('rulesBox');
  document.getElementById('completedBox');
  $('#rulesBox').empty();
  $.each(bcompSciDevRules, function (index, entry) {
    $('#rulesBox').append(rulesBox);
  })
  $('#completedBox').empty();
  $.each(student, function (index, entry) {
    $('#completedBox').append(completedBox);
  })
}
*/

function brokenRuleBox(ruleName, solutionArray, note){
  $('#brokenRules').append('<div class="'+'boxClass'+'"><label for="'+'toGoBox'+'">'+
                            ruleName+':<br></label><textarea rows="'+'18'+'" cols="'+'11'+'">'+
                            note+solutionArray+'\n'+'</textarea></div>');
}


function checkRule(bcompSciDev){
  $.each(bcompSciDevRules,function (index, rule) { 
    var unitType = rule.charAt(0)+rule.charAt(1)+rule.charAt(2);
    //var ruleType = rule.charAt(3)+rule.charAt(4)+rule.charAt(5);
    var cpRequir = rule.charAt(6)+rule.charAt(7)+rule.charAt(8);

    var unitList = [];
    if      (unitType === 'COR' ) { checkForUnitTypes(rule,bcompSciDevCoreUnits,cpRequir); }
    else if (unitType === 'MAJ' ) { checkForUnitTypes(rule,bcompSciDevMajorUnits,cpRequir); }
    else if (unitType === 'LIS' ) { checkForUnitTypes(rule,bcompSciDevListedUnits,cpRequir);}

    else if (unitType === '300' ) { checkForUnitLevel(rule,cpRequir); }
    else if (unitType === '100' ) { checkForUnitLevel(rule,cpRequir); }

  });
}


function checkForUnitTypes(rule,unitList,cpRequir) {
  var counter = 0;
  var recomended=[];
  $.each(unitList,function (index, unit) { 
    if ( student.includes(unit) ) { counter += 6; }
    else { recomended.push('\n'+unit) }
  });
  var note = 'You require '+((cpRequir)-counter)+' more cp from the following units: \n\n';
  brokenRuleBox(rule, recomended, note)
}


function checkForUnitLevel(rule,cpRequir) {
  var counter = 0;
  var recomended=[];
  $.each(student,function (index, unit) { 
    if ( rule.charAt(0) === unit.charAt(4) ) { counter += 6;  }
  });
  var everything = bcompSciDevCoreUnits.concat(bcompSciDevMajorUnits).concat(bcompSciDevListedUnits).concat(electiveUnits);
  $.each(everything,function (index, unit) { 
    if ( rule.charAt(0) === unit.charAt(4) && !student.includes(unit)) {
      recomended.push('\n'+unit)
    }
  });
  if ( rule.charAt(4) === 'I' ){ 
    var note = 'You require '+((cpRequir)-counter)+' more cp from the following units: \n\n';
  } else {
    var note = 'You are limited to '+((cpRequir)-counter)+' more cp from the following units: \n\n';
  }
  brokenRuleBox(rule, recomended, note)
}