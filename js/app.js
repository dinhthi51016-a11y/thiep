/*
 * =========================================================
 * CRM CUSTOMER PORTAL
 * GLOBAL APP
 * =========================================================
 */


/**
 * Cập nhật năm hiện tại.
 */
function updateCurrentYear() {

  const year =
    document.getElementById(
      'currentYear'
    );

  if (year) {

    year.textContent =
      new Date().getFullYear();

  }
}


/**
 * Kiểm tra trang hiện tại.
 */
function initApp() {

  updateCurrentYear();

}


/*
 * Initialize.
 */
if (
  document.readyState ===
  'loading'
) {

  document.addEventListener(
    'DOMContentLoaded',
    initApp
  );

} else {

  initApp();

}
