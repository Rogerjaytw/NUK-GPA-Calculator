document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "requestData" }, function(response) {
      if (chrome.runtime.lastError) {
        console.error("Error requesting data:", chrome.runtime.lastError);
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = ''; // 清空之前的結果
        const title = document.createElement('p');
        title.textContent = '請到學生成績查詢頁面再開啟';
        resultsDiv.appendChild(title);
        const link = document.createElement('a');
        link.textContent = 'https://aca.nuk.edu.tw/Student2/SO/ScoreQuery.asp';
        resultsDiv.appendChild(link);
      } else {
        console.log("Received data:", response.data);
        displayData(response.data);
        calculateAndDisplayGPA(response.data); // 計算並顯示 GPA
      }
    });
  });

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log("Received request:", request);
      if (request.action === "data") {
        const data = request.data;
        displayData(data);
        sendResponse({status: "success"});
      } else {
        sendResponse({ status: "error", message: "Unknown action" });
      }
    });
});

function displayData(data) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = ''; // 清空之前的結果

  if (!data || data.length === 0) {
    resultsDiv.innerHTML = '<p>No data to display.</p>';
    return;
  }

  const title = document.createElement('p');
  title.textContent = '偵測到的有效成績';
  resultsDiv.appendChild(title);

  const table = document.createElement('table');
  table.style.width = '100%'; // 設定表格寬度

  // 添加表頭
  const headerRow = table.insertRow();
  const headerCell1 = headerRow.insertCell(0);
  const headerCell2 = headerRow.insertCell(1);
  const headerCell3 = headerRow.insertCell(2);
  headerCell1.textContent = '課程名稱';
  headerCell2.textContent = '學分數';
  headerCell3.textContent = '成績';

  data.forEach(item => {
    const row = table.insertRow();
    const cellName = row.insertCell(0);
    const cellCredit = row.insertCell(1);
    const cellGrade = row.insertCell(2);
    cellName.textContent = item.courseName;
    cellCredit.textContent = item.credit;
    cellGrade.textContent = item.grade;
  });

  resultsDiv.appendChild(table);
}

function calculateAndDisplayGPA(data) {
  if (!data || data.length === 0) {
    return;
  }

  let totalCredits = 0;
  let totalPoints = 0;

  data.forEach(item => {
    totalCredits += item.credit;
    let point = 0;
    if (item.grade >= 80) {
      point = 4;
    } else if (item.grade >= 70) {
      point = 3;
    } else if (item.grade >= 60) {
      point = 2;
    } else if (item.grade >= 50) {
      point = 1;
    }
    else{
      point = 0;
    }
    totalPoints += point * item.credit;
  });

  const gpa = totalPoints / totalCredits;
  const gpaDiv = document.createElement('div');
  gpaDiv.innerHTML = `GPA: ${gpa.toFixed(2)}<br>總學分數: ${totalCredits}<br>總點數: ${totalPoints}<br>`;
  gpaDiv.style.textAlign = 'center';
  gpaDiv.style.fontSize = '20px';
  gpaDiv.style.marginTop = '20px';
  gpaDiv.style.fontWeight = 'bold';
  gpaDiv.style.color = '#800080';

  const resultsDiv = document.getElementById('results');
  resultsDiv.appendChild(gpaDiv);
}

