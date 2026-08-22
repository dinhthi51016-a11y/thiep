/**
 * CRM CUSTOMER PORTAL
 * API CLIENT
 *
 * Frontend: GitHub Pages
 * Backend: Google Apps Script
 */

const APP_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzXsEC-9m-IYfFEO23-JA04VuKMQU0KQPi3vM_eS_z8jcqF6EpBUx9ytWsv6Re9OdM3Rg/exec";


/**
 * Gọi GET API
 */
async function apiGet(params = {}) {

  try {

    const query = new URLSearchParams(params);

    const url =
      APP_SCRIPT_URL +
      "?" +
      query.toString();

    const response =
      await fetch(url, {
        method: "GET",
        redirect: "follow",
        cache: "no-store"
      });

    if (!response.ok) {
      throw new Error(
        "HTTP error: " + response.status
      );
    }

    const data =
      await response.json();

    return data;

  } catch (error) {

    console.error(
      "API GET ERROR:",
      error
    );

    throw new Error(
      "Không thể kết nối tới máy chủ."
    );
  }
}


/**
 * Gọi POST API
 */
async function apiPost(data = {}) {

  try {

    const response =
      await fetch(APP_SCRIPT_URL, {
        method: "POST",
        redirect: "follow",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(data)
      });

    if (!response.ok) {
      throw new Error(
        "HTTP error: " + response.status
      );
    }

    const result =
      await response.json();

    return result;

  } catch (error) {

    console.error(
      "API POST ERROR:",
      error
    );

    throw new Error(
      "Không thể kết nối tới máy chủ."
    );
  }
}


/**
 * Kiểm tra server
 */
async function checkApiHealth() {

  return await apiGet({
    action: "health"
  });

}


/**
 * Lấy thông tin khách hàng
 */
async function getCustomer(
  id,
  token
) {

  if (!id || !token) {

    throw new Error(
      "Thiếu ID hoặc Token."
    );
  }

  return await apiGet({
    action: "getCustomer",
    id: id,
    token: token
  });

}


/**
 * Kiểm tra link khách hàng
 */
async function validateCustomer(
  id,
  token
) {

  if (!id || !token) {

    throw new Error(
      "Thiếu ID hoặc Token."
    );
  }

  return await apiGet({
    action: "validate",
    id: id,
    token: token
  });

}
