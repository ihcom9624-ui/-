export const GAS_CODE_STRING = `/**
 * =================================================================
 * [우리반 전자 독서기록장] Google Apps Script (Code.gs)
 * =================================================================
 * 
 * [설치 및 배포 안내]
 * 1. 구글 시트(Google Sheets)를 새로 만듭니다. (예: "우리반 독서기록장 DB")
 * 2. 상단 메뉴에서 [확장 프로그램] -> [Apps Script]를 클릭합니다.
 * 3. 기존 코드를 모두 지우고 본 코드를 그대로 복사해서 붙여넣습니다.
 * 4. 우측 상단 [배포] -> [새 배포] 클릭
 *    - 유형 선택: "웹 앱 (Web App)"
 *    - 설명: "독서기록장 API v1"
 *    - 다음 사용자 권한으로 실행: "나 (Me)"
 *    - 액세스 권한 있는 사용자: "모든 사용자 (Anyone)" -> **필수!**
 * 5. [배포] 버튼 클릭 후 제공되는 '웹 앱 URL'을 복사하여 독서기록장 웹사이트 [연동 설정]에 입력하세요.
 */

function doGet(e) {
  try {
    var sheet = getOrCreateSheet();
    var data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return responseJSON({ status: "success", data: [] });
    }
    
    var headers = data[0];
    var logs = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0] && !row[1]) continue; // 빈 행 스킵
      
      var log = {
        timestamp: row[0] ? String(row[0]) : new Date().toISOString(),
        id: row[1] ? String(row[1]) : "log_" + i,
        grade: String(row[2] || ''),
        classNum: String(row[3] || ''),
        studentNum: String(row[4] || ''),
        studentName: String(row[5] || ''),
        bookTitle: String(row[6] || ''),
        author: String(row[7] || ''),
        publisher: String(row[8] || ''),
        readDate: row[9] ? formatDate(row[9]) : '',
        rating: Number(row[10]) || 5,
        summary: String(row[11] || ''),
        thoughts: String(row[12] || ''),
        isRecommended: row[13] === true || String(row[13]).toLowerCase() === 'true' || row[13] === '추천',
        isBest: row[14] === true || String(row[14]).toLowerCase() === 'true' || row[14] === '베스트',
        teacherComment: String(row[15] || '')
      };
      logs.push(log);
    }
    
    return responseJSON({ status: "success", data: logs });
  } catch (error) {
    return responseJSON({ status: "error", message: error.toString() });
  }
}

function doPost(e) {
  try {
    var sheet = getOrCreateSheet();
    var postData;
    
    if (e && e.postData && e.postData.contents) {
      postData = JSON.parse(e.postData.contents);
    } else {
      postData = e.parameter;
    }
    
    // 배열로 전달된 경우 또는 단일 객체 처리
    var items = Array.isArray(postData) ? postData : [postData];
    var addedIds = [];
    
    items.forEach(function(item) {
      var now = item.timestamp || new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
      var id = item.id || 'log_' + new Date().getTime() + '_' + Math.floor(Math.random()*1000);
      
      var row = [
        now,
        id,
        item.grade || '',
        item.classNum || '',
        item.studentNum || '',
        item.studentName || '',
        item.bookTitle || '',
        item.author || '',
        item.publisher || '',
        item.readDate || '',
        item.rating || 5,
        item.summary || '',
        item.thoughts || '',
        item.isRecommended ? '추천' : '보통',
        item.isBest ? '베스트' : '일반',
        item.teacherComment || ''
      ];
      
      sheet.appendRow(row);
      addedIds.push(id);
    });
    
    return responseJSON({ status: "success", message: "독서기록이 구글 시트에 정상 저장되었습니다.", addedIds: addedIds });
  } catch (error) {
    return responseJSON({ status: "error", message: error.toString() });
  }
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  // 첫 번째 행 헤더 검사 및 자동 생성
  if (sheet.getLastRow() === 0) {
    var headers = [
      "등록일시", "ID", "학년", "반", "번호", "이름", 
      "도서명", "저자", "출판사", "읽은날짜", "평점", 
      "줄거리", "느낀점/소감", "추천여부", "베스트선정여부", "교사코멘트"
    ];
    sheet.appendRow(headers);
    
    // 헤더 행 서식 지정 (네이비 배경 + 흰색 글씨 + 볼드)
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0F172A");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
  
  return sheet;
}

function formatDate(dateObj) {
  if (!dateObj) return '';
  if (typeof dateObj === 'string') return dateObj.substring(0, 10);
  try {
    return Utilities.formatDate(new Date(dateObj), "Asia/Seoul", "yyyy-MM-dd");
  } catch(e) {
    return String(dateObj);
  }
}

function responseJSON(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export const GAS_INSTRUCTIONS = [
  {
    step: 1,
    title: "구글 시트 생성",
    desc: "구글 드라이브(drive.google.com)에서 새로운 'Google Sheets'를 생성하고 제목을 '우리반 독서기록장 DB'로 입력합니다."
  },
  {
    step: 2,
    title: "Apps Script 열기",
    desc: "구글 시트 상단 메뉴에서 [확장 프로그램] ➔ [Apps Script]를 클릭합니다."
  },
  {
    step: 3,
    title: "코드 붙여넣기 및 저장",
    desc: "편집기에 기본으로 입력되어 있는 코드를 모두 지우고, 아래의 'Code.gs 소스코드'를 복사하여 붙여넣은 뒤 저장(Ctrl+S)합니다."
  },
  {
    step: 4,
    title: "웹 앱으로 배포하기",
    desc: "우측 상단 [배포] ➔ [새 배포]를 누르고, 톱니바퀴 버튼을 눌러 '웹 앱(Web App)'을 선택합니다. [액세스할 수 있는 사용자]를 반드시 **'모든 사용자 (Anyone)'**로 설정 후 [배포]를 완료합니다."
  },
  {
    step: 5,
    title: "URL 입력 및 연동 완료",
    desc: "승인 과정을 거친 후 발급된 '웹 앱 URL' (https://script.google.com/macros/s/.../exec 형태)을 복사하여 독서기록장 웹사이트의 [연동 설정]란에 붙여넣고 저장합니다."
  }
];

export const DEPLOYMENT_GUIDE = {
  github: [
    "1. 본 프로젝트 소스코드를 다운로드하거나 GitHub 저장소(Repository)에 푸시합니다.",
    "2. main 브랜치에 코드가 올라간 것을 확인합니다."
  ],
  netlify: [
    "1. Netlify (netlify.com) 로그인 후 [Add new site] ➔ [Import an existing project] 선택",
    "2. GitHub 연동 후 본 독서기록장 저장소를 선택합니다.",
    "3. Build command: `npm run build`, Publish directory: `dist` 로 설정 후 [Deploy] 버튼을 클릭하면 1분 안에 나만의 독서기록장이 무료로 배포됩니다!"
  ]
};
