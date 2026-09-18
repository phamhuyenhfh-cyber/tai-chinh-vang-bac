/**
 * GOOGLE APPS SCRIPT: TỰ ĐỘNG TẠO BẢNG THEO DÕI THỬ THÁCH XÂY KÊNH 7 TUẦN
 * Dành cho: 9 Thành Viên (Nancy, Hoài Học Mãi, Lambee, Nhung Hoàng, Quỳnh Thu, TanAnh Pham, Thảo Collins Edu, Trần Quế Lam, Phạm Huyền)
 * Thời gian: 08/09/2026 - 26/10/2026 (49 Ngày)
 */

function taoBangTheoDoi7Tuan() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var MEMBERS = [
    "Nancy",
    "Hoài Học Mãi",
    "Lambee",
    "Nhung Hoàng",
    "Quỳnh Thu",
    "TanAnh Pham",
    "Thảo Collins Edu",
    "Trần Quế Lam",
    "Phạm Huyền"
  ];
  
  var START_DATE = new Date(2026, 8, 8); // 08/09/2026
  var WEEKDAYS = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  
  // 1. TẠO SHEET NHẬP LIỆU
  var sheetData = ss.getSheetByName("📋 NHẬP LINK VÀ ẢNH");
  if (!sheetData) {
    sheetData = ss.insertSheet("📋 NHẬP LINK VÀ ẢNH");
  } else {
    sheetData.clear();
  }
  
  // Banner
  sheetData.getRange("A1:P1").merge()
    .setValue("💡 HƯỚNG DẪN: 9 Thành viên dán Link bài Facebook hoặc Link Ảnh chụp màn hình vào các cột tương ứng.")
    .setBackground("#2563eb")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("left");
    
  var dataHeaders = [
    "STT", "Tuần", "Thứ", "Ngày", "Ngày Thứ", "Thành Viên",
    "Link Reel FB", "Ảnh Reel",
    "Link Bài FB 1", "Ảnh Bài 1",
    "Link Bài FB 2", "Ảnh Bài 2",
    "Link Bài Tập", "Ảnh Bài Tập",
    "Hoàn Thành", "Trạng Thái"
  ];
  
  sheetData.getRange(2, 1, 1, dataHeaders.length)
    .setValues([dataHeaders])
    .setBackground("#1e3a8a")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");
    
  var rowsData = [];
  var stt = 1;
  for (var dayIdx = 0; dayIdx < 49; dayIdx++) {
    var dt = new Date(START_DATE);
    dt.setDate(dt.getDate() + dayIdx);
    var wNum = Math.floor(dayIdx / 7) + 1;
    var dowStr = WEEKDAYS[dt.getDay()];
    var d = ("0" + dt.getDate()).slice(-2);
    var m = ("0" + (dt.getMonth() + 1)).slice(-2);
    var dtStr = d + "/" + m + "/" + dt.getFullYear();
    var dayStr = "Ngày " + ("0" + (dayIdx + 1)).slice(-2);
    
    for (var mIdx = 0; mIdx < MEMBERS.length; mIdx++) {
      var rNum = 3 + (stt - 1);
      var formulaCount = '=(G' + rNum + '<>"")+(I' + rNum + '<>"")+(K' + rNum + '<>"")+(M' + rNum + '<>"")';
      var formulaStatus = '=IF(O' + rNum + '=4, "✅ Đủ 4/4", IF(O' + rNum + '>0, "⏳ Đạt " & O' + rNum + ' & "/4", "❌ Chưa nộp"))';
      
      rowsData.push([
        stt,
        "Tuần " + wNum,
        dowStr,
        dtStr,
        dayStr,
        MEMBERS[mIdx],
        "", "", "", "", "", "", "", "",
        formulaCount,
        formulaStatus
      ]);
      stt++;
    }
  }
  
  sheetData.getRange(3, 1, rowsData.length, dataHeaders.length).setValues(rowsData);
  sheetData.getRange(3, 1, rowsData.length, dataHeaders.length).setHorizontalAlignment("center");
  sheetData.getRange(3, 6, rowsData.length, 1).setHorizontalAlignment("left").setFontWeight("bold");
  sheetData.getRange(3, 7, rowsData.length, 8).setHorizontalAlignment("left");
  
  // 2. TẠO SHEET DASHBOARD TỔNG QUAN
  var sheetDash = ss.getSheetByName("📊 TỔNG KẾT TIẾN ĐỘ");
  if (!sheetDash) {
    sheetDash = ss.insertSheet("📊 TỔNG KẾT TIẾN ĐỘ", 0);
  } else {
    sheetDash.clear();
  }
  
  sheetDash.getRange("A1:K1").merge()
    .setValue("🚀 THỬ THÁCH XÂY KÊNH 7 TUẦN (08/09 - 26/10/2026) - BẢNG TỔNG KẾT TIẾN ĐỘ 9 THÀNH VIÊN")
    .setBackground("#1e3a8a")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");
    
  var dashHeaders = [
    "STT", "Họ và Tên", "Chỉ tiêu Reel (49)", "Reel Đã Nộp",
    "Chỉ tiêu Bài FB (98)", "Bài FB Đã Nộp", "Chỉ tiêu Bài Tập (49)", "Bài Tập Đã Nộp",
    "Tổng Mục Tiêu", "Tổng Đã Nộp", "Tỷ Lệ Đạt (%)"
  ];
  
  sheetDash.getRange(2, 1, 1, dashHeaders.length)
    .setValues([dashHeaders])
    .setBackground("#1e40af")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");
    
  var dashRows = [];
  for (var i = 0; i < MEMBERS.length; i++) {
    var r = 3 + i;
    var formulaReel = '=COUNTIFS('📋 NHẬP LINK VÀ ẢNH'!$F$3:$F$443, B' + r + ', '📋 NHẬP LINK VÀ ẢNH'!$G$3:$G$443, "<>")';
    var formulaPost = '=COUNTIFS('📋 NHẬP LINK VÀ ẢNH'!$F$3:$F$443, B' + r + ', '📋 NHẬP LINK VÀ ẢNH'!$I$3:$I$443, "<>") + COUNTIFS('📋 NHẬP LINK VÀ ẢNH'!$F$3:$F$443, B' + r + ', '📋 NHẬP LINK VÀ ẢNH'!$K$3:$K$443, "<>")';
    var formulaEx = '=COUNTIFS('📋 NHẬP LINK VÀ ẢNH'!$F$3:$F$443, B' + r + ', '📋 NHẬP LINK VÀ ẢNH'!$M$3:$M$443, "<>")';
    var formulaTotDone = '=D' + r + '+F' + r + '+H' + r;
    var formulaPct = '=IF(I' + r + '>0, J' + r + '/I' + r + ', 0)';
    
    dashRows.push([
      i + 1,
      MEMBERS[i],
      49,
      formulaReel,
      98,
      formulaPost,
      49,
      formulaEx,
      196,
      formulaTotDone,
      formulaPct
    ]);
  }
  
  sheetDash.getRange(3, 1, dashRows.length, dashHeaders.length).setValues(dashRows);
  sheetDash.getRange(3, 1, dashRows.length, dashHeaders.length).setHorizontalAlignment("center");
  sheetDash.getRange(3, 2, dashRows.length, 1).setHorizontalAlignment("left").setFontWeight("bold");
  sheetDash.getRange(3, 11, dashRows.length, 1).setNumberFormat("0.0%");
  
  // Total Row
  var totalRowIdx = 3 + MEMBERS.length;
  sheetDash.getRange("A" + totalRowIdx + ":B" + totalRowIdx).merge()
    .setValue("TỔNG TOÀN NHÓM")
    .setFontWeight("bold")
    .setBackground("#dbeafe")
    .setHorizontalAlignment("center");
    
  sheetDash.getRange(totalRowIdx, 3, 1, 9).setValues([[
    441,
    '=SUM(D3:D' + (totalRowIdx - 1) + ')',
    882,
    '=SUM(F3:F' + (totalRowIdx - 1) + ')',
    441,
    '=SUM(H3:H' + (totalRowIdx - 1) + ')',
    1764,
    '=SUM(J3:J' + (totalRowIdx - 1) + ')',
    '=IF(I' + totalRowIdx + '>0, J' + totalRowIdx + '/I' + totalRowIdx + ', 0)'
  ]]).setBackground("#dbeafe").setFontWeight("bold").setHorizontalAlignment("center");
  sheetDash.getRange(totalRowIdx, 11).setNumberFormat("0.0%");
  
  SpreadsheetApp.flush();
}
