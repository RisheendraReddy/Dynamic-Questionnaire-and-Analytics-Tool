function onFormSubmit(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var formResponsesSheet = ss.getSheetByName('Form Responses 1');
  var responsesCondensedSheet = ss.getSheetByName('Form Condensed');
  var referenceAnswersSheet = ss.getSheetByName('Reference: Answers');

  // Read 'Reference: Answers' sheet and build lookup
  var refData = referenceAnswersSheet.getDataRange().getValues();
  var refLookup = {}; // refLookup[Question][Answer] = {Category, Code, Weight}

  for (var i = 1; i < refData.length; i++) {
    var row = refData[i];
    var category = row[0];
    var question = row[1];
    var answer = row[2];
    var code = row[3];
    var weight = row[4];

    if (!refLookup[question]) {
      refLookup[question] = {};
    }
    refLookup[question][answer] = {Category: category, Code: code, Weight: weight};
  }

  // Build a mapping from Category to column index in 'Form Condensed' sheet
  var responsesCondensedHeaders = responsesCondensedSheet.getRange(1, 1, 1, responsesCondensedSheet.getLastColumn()).getValues()[0];
  var categoryColumnIndex = {}; // categoryColumnIndex[Category] = column index
  for (var col = 3; col < responsesCondensedHeaders.length; col++) {
    var category = responsesCondensedHeaders[col];
    if (category) {
      categoryColumnIndex[category] = col + 1;
    }
  }

  // Get the submitted response
  var responseRange = e.range;
  var responseRow = responseRange.getRow();
  var responseData = formResponsesSheet.getRange(responseRow, 1, 1, formResponsesSheet.getLastColumn()).getValues()[0];
  // Get the headers (questions) from the form responses sheet
  var formHeaders = formResponsesSheet.getRange(1, 1, 1, formResponsesSheet.getLastColumn()).getValues()[0];


  var categoryData = {}; // categoryData[Category] = {totalWeight: number, codeWeightPairs: []}
  // question-answer pair in Form Responses
  for (var col = 3; col < formHeaders.length; col++) {
    var question = formHeaders[col];
    var answer = responseData[col];
    if (question && answer) {
      var lookupEntry = refLookup[question] && refLookup[question][answer];
      if (lookupEntry) {
        var category = lookupEntry.Category;
        var code = lookupEntry.Code;
        var weight = lookupEntry.Weight;
        if (!categoryData[category]) {
          categoryData[category] = {totalWeight: 0, codeWeightPairs: []};
        }
        categoryData[category].totalWeight += weight;
        categoryData[category].codeWeightPairs.push(code + weight);
      } else {
        Logger.log('No lookup entry for question: ' + question + ', answer: ' + answer);
      }
    }
  }

  // Prepare 'newRow' to be added to 'Form Condensed'
  var totalColumns = responsesCondensedHeaders.length;
  var newRow = new Array(totalColumns).fill('');
  newRow[0] = responseData[0]; // timestamp
  newRow[1] = responseData[1]; // email
  newRow[2] = responseData[2]; // name

  // Format output: [totalWeight] '\' categories
  for (var category in categoryData) {
    var data = categoryData[category];
    var totalWeight = data.totalWeight;
    var codeWeightPairs = data.codeWeightPairs;
    var outputString = totalWeight + '\\' + codeWeightPairs.join('\\');
    var colIndex = categoryColumnIndex[category];
    if (colIndex) {
      var indexInNewRow = colIndex - 1;
      newRow[indexInNewRow] = outputString;
    } else {
      Logger.log('Category not found in Responses Condensed sheet: ' + category);
    }
  }

  responsesCondensedSheet.appendRow(newRow);
}