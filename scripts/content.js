// content.js (在頁面中運行)
// ... existing code ...
function extractData() {
    const tables = document.querySelectorAll('table[border="1"]');
    const results = [];

    tables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].querySelectorAll('td');
            if (cells.length >= 5) {
                const courseName = cells[1].textContent.trim();
                const credit = parseInt(cells[2].textContent.trim());
                const grade = parseInt(cells[5].textContent.trim());

                // 檢查 grade 是否為有效數字
                if (!isNaN(grade)) {
                    results.push({ courseName, credit, grade });
                }
            }
        }
    });

    console.log("Extracted Data:", results);
    return results;
}


function displayData(data) {
    console.log("Received Data in Popup:", data);
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const table = document.createElement('table');
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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "requestData") {
        const data = extractData();
        sendResponse({ data: data });
    }
});
