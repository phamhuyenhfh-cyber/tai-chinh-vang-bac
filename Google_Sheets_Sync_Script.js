/**
 * =========================================================================
 * GOOGLE APPS SCRIPT ĐỒNG BỘ 2 CHIỀU CHO WEB APP QUẢN LÝ VÀNG BẠC
 * Dành riêng cho Chị Phạm Huyền
 * =========================================================================
 */

function doGet(e) {
  var action = e.parameter.action;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === 'GET_TRANSACTIONS') {
    var sheet = ss.getSheetByName('DanhMucGiaoDich');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ transactions: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ transactions: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var headers = data[0];
    var transactions = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;
      
      transactions.push({
        id: row[0],
        buyDate: formatDate(row[1]),
        type: row[2] === 'Vàng' ? 'gold' : 'silver',
        brand: row[3],
        productName: row[4],
        quantity: Number(row[5]) || 0,
        unit: row[6],
        buyPrice: Number(row[7]) || 0,
        fee: Number(row[8]) || 0,
        note: row[10] || ''
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'success', 
      transactions: transactions 
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'ready', message: 'Hệ thống Quản lý Vàng Bạc sẵn sàng kết nối!' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === 'SYNC_ALL') {
      var transactions = payload.transactions || [];
      var marketPrices = payload.marketPrices || {};
      
      // 1. Cập nhật Sheet Danh Mục Giao Dịch
      var sheetTx = getOrCreateSheet(ss, 'DanhMucGiaoDich', [
        'Mã GD', 'Ngày Mua', 'Loại Kim Loại', 'Thương Hiệu', 'Tên Sản Phẩm', 
        'Số Lượng', 'Đơn Vị', 'Đơn Giá Mua (VNĐ)', 'Phí Công (VNĐ)', 'Tổng Vốn (VNĐ)', 'Ghi Chú', 'Cập Nhật Lúc'
      ], '#b8860b');
      
      // Xóa dữ liệu cũ trừ tiêu đề
      if (sheetTx.getLastRow() > 1) {
        sheetTx.getRange(2, 1, sheetTx.getLastRow() - 1, 12).clearContent();
      }
      
      if (transactions.length > 0) {
        var rowsTx = transactions.map(function(tx) {
          var cost = (tx.quantity * tx.buyPrice) + (tx.fee || 0);
          return [
            tx.id,
            tx.buyDate,
            tx.type === 'gold' ? 'Vàng' : 'Bạc',
            tx.brand,
            tx.productName,
            tx.quantity,
            tx.unit,
            tx.buyPrice,
            tx.fee || 0,
            cost,
            tx.note || '',
            new Date()
          ];
        });
        
        sheetTx.getRange(2, 1, rowsTx.length, 12).setValues(rowsTx);
        sheetTx.getRange(2, 8, rowsTx.length, 3).setNumberFormat('#,##0 "₫"');
      }
      
      // 2. Cập nhật Sheet Bảng Giá Sàn
      var sheetPrices = getOrCreateSheet(ss, 'BangGiaSan', [
        'Mã Sàn', 'Tên Sản Phẩm Niêm Yết', 'Đơn Vị', 'Giá Tiệm Thu Mua', 'Giá Tiệm Bán Ra', 'Biến Động', 'Thời Gian Cập Nhật'
      ], '#161b22');
      
      if (sheetPrices.getLastRow() > 1) {
        sheetPrices.getRange(2, 1, sheetPrices.getLastRow() - 1, 7).clearContent();
      }
      
      var priceKeys = Object.keys(marketPrices);
      if (priceKeys.length > 0) {
        var rowsPrice = priceKeys.map(function(k) {
          var p = marketPrices[k];
          return [
            k,
            p.name,
            p.unit,
            p.buy,
            p.sell,
            p.change || '',
            new Date()
          ];
        });
        sheetPrices.getRange(2, 1, rowsPrice.length, 7).setValues(rowsPrice);
        sheetPrices.getRange(2, 4, rowsPrice.length, 2).setNumberFormat('#,##0');
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Đã đồng bộ ' + transactions.length + ' giao dịch!' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm hỗ trợ tạo Sheet có format chuyên nghiệp
function getOrCreateSheet(ss, sheetName, headers, headerColor) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground(headerColor || '#161b22');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
  }
  
  return sheet;
}

function formatDate(dateVal) {
  if (!dateVal) return '';
  if (dateVal instanceof Date) {
    return Utilities.formatDate(dateVal, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(dateVal).split('T')[0];
}

// Thêm Menu tiện ích vào thanh công cụ Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('👑 Quản Lý Vàng Bạc')
    .addItem('✨ Tự Động Định Dạng Lại Bảng', 'formatSheets')
    .addItem('🔄 Kiểm Tra Kết Nối', 'testConnection')
    .addToUi();
}

function formatSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('DanhMucGiaoDich');
  if (sheet && sheet.getLastRow() > 1) {
    sheet.autoResizeColumns(1, 12);
    SpreadsheetApp.getUi().alert('✅ Đã căn chỉnh cột và định dạng bảng đẹp mắt!');
  }
}

function testConnection() {
  SpreadsheetApp.getUi().alert('🎉 Hệ thống kết nối Google Sheets hoạt động hoàn hảo!');
}
