/**
 * Google Apps Script لجلب بيانات النظام من Google Sheets
 *
 * البنية المطلوبة في Google Sheets:
 *
 * Sheet 1: "Groups" - المجموعات
 *   Column A: أسماء المجموعات
 *
 * Sheet 2: "Plans" - أنواع الخطط
 *   Column A: أسماء أنواع الخطط
 *
 * Sheet 3: "PlanElements" - عناصر الخطط
 *   Column A: نوع الخطة
 *   Column B: عنصر الخطة
 *
 * Sheet 4: "Requesters" - أسماء طالبي الملفات
 *   Column A: الأسماء
 *
 * Sheet 5: "PlanData" - بيانات الخطط التفصيلية
 *   Column A: اسم عنصر الخطة (plan element)
 *   Columns B onwards: التفاصيل التي سيتم استخراجها
 */

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    const groups = getSheetData(ss, 'Groups', 'A');
    const plans = getSheetData(ss, 'Plans', 'A');
    const planElements = getPlanElements(ss);
    const requesters = getSheetData(ss, 'Requesters', 'A');

    const response = {
      groups: groups,
      plans: plans,
      planElements: planElements,
      requesters: requesters
    };

    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheetData(spreadsheet, sheetName, column) {
  try {
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      Logger.log('Sheet not found: ' + sheetName);
      return [];
    }

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return [];
    }

    const range = sheet.getRange(column + '2:' + column + lastRow);
    const values = range.getValues();

    return values
      .map(row => row[0])
      .filter(value => value !== null && value !== undefined && value.toString().trim() !== '');

  } catch (error) {
    Logger.log('Error in getSheetData for ' + sheetName + ': ' + error);
    return [];
  }
}

function getPlanElements(spreadsheet) {
  try {
    const sheet = spreadsheet.getSheetByName('PlanElements');
    if (!sheet) {
      Logger.log('Sheet not found: PlanElements');
      return {};
    }

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return {};
    }

    const range = sheet.getRange('A2:B' + lastRow);
    const values = range.getValues();

    const planElements = {};

    values.forEach(row => {
      const planType = row[0];
      const element = row[1];

      if (planType && element) {
        if (!planElements[planType]) {
          planElements[planType] = [];
        }
        planElements[planType].push(element);
      }
    });

    return planElements;

  } catch (error) {
    Logger.log('Error in getPlanElements: ' + error);
    return {};
  }
}

/**
 * طريقة النشر:
 *
 * 1. افتح Google Sheets الخاص بك
 * 2. اذهب إلى Extensions > Apps Script
 * 3. احذف أي كود موجود والصق الكود أعلاه
 * 4. احفظ المشروع (File > Save أو Ctrl+S)
 * 5. اضغط على Deploy > New deployment
 * 6. اختر Type: Web app
 * 7. في Description ضع: "Training Plan Data API"
 * 8. في Execute as: اختر "Me"
 * 9. في Who has access: اختر "Anyone"
 * 10. اضغط Deploy
 * 11. انسخ رابط الـ Web app URL
 * 12. ضع الرابط في ملف .env تحت VITE_GOOGLE_SCRIPT_URL
 *
 * مثال على الرابط:
 * https://script.google.com/macros/s/AKfycbx.../exec
 */

/**
 * دالة اختبار لمعاينة البيانات في Apps Script Editor
 */
function testGetData() {
  const result = doGet();
  Logger.log(result.getContent());
}
