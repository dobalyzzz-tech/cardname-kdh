/* google-apps-script.gs */
function doPost(e) {
  var ss = SpreadsheetApp.openById("1BEGgcbpe-LJZYQuj2bLRwyBhiPq4-tGq5ge0M5rWyT0");
  var sheet = ss.getSheets()[0];
  var data = JSON.parse(e.postData.contents);
  var timestamp = new Date();
  
  sheet.appendRow([timestamp, data.finishTime, data.username, data.score]);
  return ContentService.createTextOutput(JSON.stringify({ "result": "success" })).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var ss = SpreadsheetApp.openById("1BEGgcbpe-LJZYQuj2bLRwyBhiPq4-tGq5ge0M5rWyT0");
  var sheet = ss.getSheets()[0];
  var rows = sheet.getDataRange().getValues();
  
  var data = rows.slice(1).map(function(row) {
    return {
      timestamp: row[0],
      finishTime: row[1],
      username: row[2],
      score: row[3]
    };
  });

  // 시간을 초 단위로 변환 후 정렬 (낮은 시간 순서 랭킹)
  data.sort(function(a, b) {
    var aPts = String(a.finishTime).split(':').map(Number);
    var bPts = String(b.finishTime).split(':').map(Number);
    if (aPts.length < 2 || bPts.length < 2) return 0;
    return (aPts[0] * 60 + aPts[1]) - (bPts[0] * 60 + bPts[1]);
  });

  return ContentService.createTextOutput(JSON.stringify(data.slice(0, 3)))
    .setMimeType(ContentService.MimeType.JSON);
}
