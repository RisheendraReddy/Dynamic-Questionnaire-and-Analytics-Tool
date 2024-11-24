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






  /* Create chart */
  const formCondensedSheet = responsesCondensedSheet;
  const chartSheet = ss.getSheetByName('Generate Chart');

  chartSheet.clear();

  const lastRow = formCondensedSheet.getLastRow();

  // Get the name and email from columns B and C of the last row
  const email = formCondensedSheet.getRange(lastRow, 2).getValue();
  const name = formCondensedSheet.getRange(lastRow, 3).getValue();

  // Set Name and Email in "Generate Chart" sheet
  chartSheet.getRange("A1").setValue("Name");
  chartSheet.getRange("B1").setValue(name);
  chartSheet.getRange("A2").setValue("Email");
  chartSheet.getRange("B2").setValue(email);

  // Transfer the column names from 'Form Condensed' (columns D onwards) to 'Generate Chart' sheet
  const lastColumn = formCondensedSheet.getLastColumn();
  const numColumnsToCopy = lastColumn - 3; // Columns D onwards

  const columnNames = formCondensedSheet.getRange(1, 4, 1, numColumnsToCopy).getValues()[0];
  const dataRow = formCondensedSheet.getRange(lastRow, 4, 1, numColumnsToCopy).getValues()[0];

  // Extract the numbers before the first "\" and put them in column B
  for (let i = 0; i < numColumnsToCopy; i++) {
    const columnName = columnNames[i];
    const dataItem = dataRow[i];
    if (dataItem.toString().trim() !== '') {
      const numberBeforeSlash = dataItem.toString().split("\\")[0];
      chartSheet.getRange(i + 3, 1).setValue(columnName); // Column A, starting from row 3
      chartSheet.getRange(i + 3, 2).setValue(numberBeforeSlash); // Column B, starting from row 3
    }
  }

  // Get range for chart
  const range = chartSheet.getRange(3, 1, numColumnsToCopy, 2).getValues()
    .filter(row => row[0] !== undefined && row[0] !== null && row[0].toString().trim() !== '' && row[1] !== undefined && row[1] !== null && row[1].toString().trim() !== '') // Include zeros and exclude empty cells
    .map(row => [row[0], parseFloat(row[1]) || 0]); // Ensure numerical values

  if (range.length === 0) {
    Logger.log('No data available to create a radar chart.');
    return;
  }

  // Clear previous data in "Generate Chart" before setting new range
  chartSheet.getRange(3, 1, chartSheet.getLastRow() - 2, 2).clearContent();

  // Re-populate the chartSheet with filtered range
  for (let i = 0; i < range.length; i++) {
    chartSheet.getRange(3 + i, 1).setValue(range[i][0]);
    chartSheet.getRange(3 + i, 2).setValue(range[i][1]);
  }

  // Adjust the numColumnsToCopy based on the filtered range
  const filteredNumColumnsToCopy = range.length;

  // Get the new range for the chart after filtering
  const chartRange = chartSheet.getRange(3, 1, filteredNumColumnsToCopy, 2);

  // Create a radar chart
  const chart = chartSheet.newChart()
    .setChartType(Charts.ChartType.RADAR)
    .addRange(chartRange)
    .setPosition(1, 5, 0, 0)
    .setOption('height', 600)
    .setOption('width', 600)
    .setOption('title', "Venture Audit")
    .setOption('curveType', 'none')
    .setOption('pointSize', 7)
    .setOption('pointShape', 'Triangle')
    .build();

  chartSheet.insertChart(chart);

  const blob = chart.getAs('image/png').setName(`${name}.png`);

  /*
  const folderId = '';
  const folder = DriveApp.getFolderById(folderId);
  folder.createFile(blob);
  */

  const emailSend = email.toString();
  const emailName = name.toString().replace(/[\r\n]+/g, ' ');
  const emailBody = `Hello, ${emailName} thank you for filling out the form.\nYour Venture Audit Chart is attached below.`;
  MailApp.sendEmail({
    to: emailSend,
    subject: "Your Venture Audit Chart",
    body: emailBody,
    attachments: [blob],
  })
  
  chartSheet.removeChart(chart);
}

