/**
 * =========================================================
 * CRM FRONTEND API CLIENT
 * File: js/api.js
 * =========================================================
 *
 * Frontend:
 * GitHub Pages
 *
 * Backend:
 * Google Apps Script Web App
 *
 * KHÔNG đặt ADMIN_KEY hoặc secret vào file này.
 * =========================================================
 */


/* =========================================================
 * 1. GOOGLE APPS SCRIPT URL
 * ========================================================= */

const APP_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzXsEC-9m-IYfFEO23-JA04VuKMQU0KQPi3vM_eS_z8jcqF6EpBUx9ytWsv6Re9OdM3Rg/exec";


/* =========================================================
 * 2. API ERROR CLASS
 * ========================================================= */

class ApiError extends Error {

  constructor(message, code, data) {

    super(message);

    this.name = "ApiError";

    this.code = code || "API_ERROR";

    this.data = data || null;
  }
}


/* =========================================================
 * 3. BUILD URL
 * ========================================================= */

function buildApiUrl(action, params = {}) {

  const url = new URL(APP_SCRIPT_URL);

  url.searchParams.set("action", action);

  Object.keys(params).forEach(function(key) {

    const value = params[key];

    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {

      url.searchParams.set(
        key,
        String(value)
      );
    }

  });

  return url.toString();
}


/* =========================================================
 * 4. GET API
 * ========================================================= */

async function apiGet(action, params = {}) {

  const url =
    buildApiUrl(
      action,
      params
    );

  try {

    const response =
      await fetch(url, {
        method: "GET",
        cache: "no-store"
      });

    if (!response.ok) {

      throw new ApiError(
        "Không thể kết nối máy chủ.",
        "HTTP_ERROR",
        {
          status: response.status
        }
      );
    }

    const data =
      await response.json();

    /*
     * Backend của chúng ta luôn trả:
     *
     * {
     *   success: true/false,
     *   ...
     * }
     */

    if (!data.success) {

      throw new ApiError(
        data.message ||
        "API trả về lỗi.",
        data.error ||
        "API_ERROR",
        data
      );
    }

    return data;

  } catch (error) {

    /*
     * Nếu chính chúng ta đã tạo ApiError
     * thì giữ nguyên.
     */

    if (error instanceof ApiError) {
      throw error;
    }

    console.error(
      "apiGet error:",
      error
    );

    throw new ApiError(
      "Không thể kết nối đến máy chủ. " +
      "Vui lòng kiểm tra Internet và thử lại.",
      "NETWORK_ERROR",
      null
    );
  }
}


/* =========================================================
 * 5. POST API
 * ========================================================= */

async function apiPost(action, data = {}) {

  const body = {
    action: action,
    ...data
  };

  try {

    const response =
      await fetch(
        APP_SCRIPT_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body: JSON.stringify(body),

          cache: "no-store"
        }
      );

    if (!response.ok) {

      throw new ApiError(
        "Không thể kết nối máy chủ.",
        "HTTP_ERROR",
        {
          status: response.status
        }
      );
    }

    const result =
      await response.json();

    if (!result.success) {

      throw new ApiError(
        result.message ||
        "API trả về lỗi.",
        result.error ||
        "API_ERROR",
        result
      );
    }

    return result;

  } catch (error) {

    if (error instanceof ApiError) {
      throw error;
    }

    console.error(
      "apiPost error:",
      error
    );

    throw new ApiError(
      "Không thể kết nối đến máy chủ. " +
      "Vui lòng kiểm tra Internet và thử lại.",
      "NETWORK_ERROR",
      null
    );
  }
}


/* =========================================================
 * 6. HEALTH CHECK
 * ========================================================= */

async function checkApiHealth() {

  return await apiGet(
    "health"
  );
}


/* =========================================================
 * 7. GET CUSTOMER
 * ========================================================= */

/**
 * Lấy dữ liệu của MỘT khách hàng.
 *
 * Quan trọng:
 * API bắt buộc phải có:
 *
 * id
 * token
 *
 * Backend sẽ kiểm tra:
 *
 * - ID
 * - Token
 * - Status
 * - ExpiryDate
 *
 * Token KHÔNG được gửi lại cho frontend
 * trong dữ liệu customer.
 */

async function getCustomer(
  customerId,
  token
) {

  if (!customerId) {

    throw new ApiError(
      "Thiếu mã khách hàng.",
      "MISSING_ID"
    );
  }

  if (!token) {

    throw new ApiError(
      "Thiếu mã truy cập.",
      "MISSING_TOKEN"
    );
  }

  return await apiGet(
    "getCustomer",
    {
      id: customerId,
      token: token
    }
  );
}


/* =========================================================
 * 8. VALIDATE CUSTOMER LINK
 * ========================================================= */

async function validateCustomer(
  customerId,
  token
) {

  if (!customerId || !token) {

    throw new ApiError(
      "Link khách hàng không hợp lệ.",
      "MISSING_CREDENTIALS"
    );
  }

  return await apiGet(
    "validate",
    {
      id: customerId,
      token: token
    }
  );
}


/* =========================================================
 * 9. ADMIN FUNCTIONS
 * =========================================================
 *
 * Các hàm dưới đây chỉ dành cho khu vực quản trị.
 *
 * KHÔNG đưa ADMIN_KEY vào website public.
 *
 * Hiện tại chúng ta giữ các hàm này để backend
 * có API đầy đủ.
 */


/* =========================================================
 * 10. CREATE CUSTOMER
 * ========================================================= */

async function createCustomer(
  adminKey,
  customer
) {

  if (!adminKey) {

    throw new ApiError(
      "Thiếu quyền quản trị.",
      "MISSING_ADMIN_KEY"
    );
  }

  return await apiPost(
    "createCustomer",
    {
      adminKey: adminKey,
      customer: customer
    }
  );
}


/* =========================================================
 * 11. UPDATE CUSTOMER
 * ========================================================= */

async function updateCustomer(
  adminKey,
  customerId,
  customer
) {

  if (!adminKey) {

    throw new ApiError(
      "Thiếu quyền quản trị.",
      "MISSING_ADMIN_KEY"
    );
  }

  if (!customerId) {

    throw new ApiError(
      "Thiếu ID khách hàng.",
      "MISSING_ID"
    );
  }

  return await apiPost(
    "updateCustomer",
    {
      adminKey: adminKey,
      id: customerId,
      customer: customer
    }
  );
}


/* =========================================================
 * 12. GENERATE LINK
 * ========================================================= */

async function generateCustomerLink(
  adminKey,
  customerId
) {

  if (!adminKey) {

    throw new ApiError(
      "Thiếu quyền quản trị.",
      "MISSING_ADMIN_KEY"
    );
  }

  return await apiPost(
    "generateLink",
    {
      adminKey: adminKey,
      id: customerId
    }
  );
}


/* =========================================================
 * 13. REGENERATE TOKEN
 * ========================================================= */

async function regenerateCustomerToken(
  adminKey,
  customerId
) {

  if (!adminKey) {

    throw new ApiError(
      "Thiếu quyền quản trị.",
      "MISSING_ADMIN_KEY"
    );
  }

  return await apiPost(
    "regenerateToken",
    {
      adminKey: adminKey,
      id: customerId
    }
  );
}


/* =========================================================
 * 14. DISABLE CUSTOMER
 * ========================================================= */

async function disableCustomer(
  adminKey,
  customerId
) {

  if (!adminKey) {

    throw new ApiError(
      "Thiếu quyền quản trị.",
      "MISSING_ADMIN_KEY"
    );
  }

  return await apiPost(
    "disableCustomer",
    {
      adminKey: adminKey,
      id: customerId
    }
  );
}


/* =========================================================
 * 15. ENABLE CUSTOMER
 * ========================================================= */

async function enableCustomer(
  adminKey,
  customerId
) {

  if (!adminKey) {

    throw new ApiError(
      "Thiếu quyền quản trị.",
      "MISSING_ADMIN_KEY"
    );
  }

  return await apiPost(
    "enableCustomer",
    {
      adminKey: adminKey,
      id: customerId
    }
  );
}


/* =========================================================
 * 16. UTILITY: READ CUSTOMER URL
 * ========================================================= */

/**
 * Đọc:
 *
 * ?id=KH0001&token=xxxxxxxx
 *
 * từ URL hiện tại.
 */

function getCustomerCredentialsFromUrl() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  return {

    id:
      params.get("id") || "",

    token:
      params.get("token") || ""
  };
}


/* =========================================================
 * 17. UTILITY: CHECK CUSTOMER URL
 * ========================================================= */

function hasCustomerCredentials() {

  const credentials =
    getCustomerCredentialsFromUrl();

  return Boolean(
    credentials.id &&
    credentials.token
  );
}


/* =========================================================
 * 18. ERROR MESSAGE FOR USER
 * ========================================================= */

function getFriendlyApiError(error) {

  if (!error) {

    return "Đã xảy ra lỗi không xác định.";
  }

  switch (error.code) {

    case "MISSING_ID":

      return "Thiếu mã khách hàng.";

    case "MISSING_TOKEN":

      return "Thiếu mã truy cập.";

    case "MISSING_CREDENTIALS":

      return "Link khách hàng không hợp lệ.";

    case "CUSTOMER_NOT_FOUND":

      return "Không tìm thấy khách hàng.";

    case "INVALID_TOKEN":

      return "Link truy cập không hợp lệ hoặc đã được thay đổi.";

    case "CUSTOMER_DISABLED":

      return "Tài khoản khách hàng đã bị vô hiệu hóa.";

    case "LINK_EXPIRED":

      return "Link truy cập của khách hàng đã hết hạn.";

    case "NETWORK_ERROR":

      return "Không thể kết nối máy chủ. Vui lòng kiểm tra Internet.";

    case "HTTP_ERROR":

      return "Máy chủ hiện không phản hồi.";

    default:

      return (
        error.message ||
        "Không thể tải dữ liệu khách hàng."
      );
  }
}


/* =========================================================
 * 19. DEBUG HELPER
 * ========================================================= */

/**
 * Có thể chạy trong Console:
 *
 * apiHealthTest()
 *
 * để kiểm tra Apps Script.
 */

async function apiHealthTest() {

  try {

    const result =
      await checkApiHealth();

    console.log(
      "CRM API HEALTH:",
      result
    );

    return result;

  } catch (error) {

    console.error(
      "CRM API ERROR:",
      error
    );

    return {
      success: false,
      error: error.code,
      message:
        getFriendlyApiError(error)
    };
  }
}
