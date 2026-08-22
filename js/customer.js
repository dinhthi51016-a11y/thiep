/*
 * =========================================================
 * CRM CUSTOMER PORTAL
 * CUSTOMER PAGE
 * =========================================================
 */


/**
 * Lấy query parameter từ URL.
 *
 * @param {string} name
 * @returns {string}
 */
function getQueryParam(name) {

  const params =
    new URLSearchParams(
      window.location.search
    );

  return (
    params.get(name) ||
    ''
  ).trim();
}


/**
 * Escape HTML.
 *
 * Không dùng innerHTML với dữ liệu khách hàng.
 *
 * @param {*} value
 * @returns {string}
 */
function escapeHtml(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return '';
  }

  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


/**
 * Gán text an toàn.
 *
 * @param {string} id
 * @param {*} value
 */
function setText(id, value) {

  const element =
    document.getElementById(id);

  if (!element) {
    return;
  }

  element.textContent =
    value === null ||
    value === undefined ||
    value === ''
      ? '--'
      : String(value);
}


/**
 * Hiển thị loading.
 */
function showLoading() {

  const loading =
    document.getElementById(
      'loadingState'
    );

  const error =
    document.getElementById(
      'errorState'
    );

  const content =
    document.getElementById(
      'customerContent'
    );

  if (loading) {
    loading.classList.remove('hidden');
  }

  if (error) {
    error.classList.add('hidden');
  }

  if (content) {
    content.classList.add('hidden');
  }
}


/**
 * Hiển thị customer.
 */
function showCustomer() {

  const loading =
    document.getElementById(
      'loadingState'
    );

  const error =
    document.getElementById(
      'errorState'
    );

  const content =
    document.getElementById(
      'customerContent'
    );

  if (loading) {
    loading.classList.add('hidden');
  }

  if (error) {
    error.classList.add('hidden');
  }

  if (content) {
    content.classList.remove('hidden');
  }
}


/**
 * Hiển thị lỗi.
 *
 * @param {string} title
 * @param {string} message
 * @param {string} icon
 */
function showError(
  title,
  message,
  icon = '⚠️'
) {

  const loading =
    document.getElementById(
      'loadingState'
    );

  const error =
    document.getElementById(
      'errorState'
    );

  const content =
    document.getElementById(
      'customerContent'
    );

  if (loading) {
    loading.classList.add('hidden');
  }

  if (content) {
    content.classList.add('hidden');
  }

  if (error) {

    error.classList.remove(
      'hidden'
    );
  }


  setText(
    'errorTitle',
    title
  );

  setText(
    'errorMessage',
    message
  );

  setText(
    'errorIcon',
    icon
  );


  setConnectionStatus(
    'Không thể kết nối',
    false
  );
}


/**
 * Cập nhật trạng thái kết nối.
 *
 * @param {string} text
 * @param {boolean} success
 */
function setConnectionStatus(
  text,
  success
) {

  const element =
    document.getElementById(
      'connectionStatus'
    );

  if (!element) {
    return;
  }

  element.textContent =
    text;

  element.style.color =
    success
      ? '#15803d'
      : '#b91c1c';
}


/**
 * Hiển thị thông tin customer.
 *
 * @param {Object} customer
 */
function renderCustomer(customer) {

  if (!customer) {

    showError(
      'Không có dữ liệu',
      'Không tìm thấy thông tin khách hàng.',
      '⚠️'
    );

    return;
  }


  /*
   * HEADER
   */

  setText(
    'customerName',
    customer.CustomerName
  );

  setText(
    'customerCompany',
    customer.Company
  );


  /*
   * AVATAR
   */

  const avatar =
    document.getElementById(
      'customerInitial'
    );

  if (avatar) {

    const name =
      String(
        customer.CustomerName ||
        'KH'
      ).trim();

    const words =
      name
        .split(/\s+/)
        .filter(Boolean);

    let initials = 'KH';

    if (words.length >= 2) {

      initials =
        (
          words[0].charAt(0) +
          words[words.length - 1].charAt(0)
        ).toUpperCase();

    } else if (words.length === 1) {

      initials =
        words[0]
          .substring(0, 2)
          .toUpperCase();

    }

    avatar.textContent =
      initials;
  }


  /*
   * BASIC DATA
   */

  setText(
    'customerId',
    customer.ID
  );

  setText(
    'customerCode',
    customer.CustomerCode
  );

  setText(
    'company',
    customer.Company
  );

  setText(
    'address',
    customer.Address
  );

  setText(
    'createdDate',
    customer.CreatedDate
  );

  setText(
    'expiryDate',
    customer.ExpiryDate
  );


  /*
   * PHONE
   */

  const phoneElement =
    document.getElementById(
      'phone'
    );

  if (phoneElement) {

    const phone =
      String(
        customer.Phone || ''
      ).trim();

    if (phone) {

      phoneElement.textContent =
        phone;

      phoneElement.href =
        'tel:' +
        encodeURIComponent(phone);

    } else {

      phoneElement.textContent =
        '--';

      phoneElement.removeAttribute(
        'href'
      );
    }
  }


  /*
   * EMAIL
   */

  const emailElement =
    document.getElementById(
      'email'
    );

  if (emailElement) {

    const email =
      String(
        customer.Email || ''
      ).trim();

    if (email) {

      emailElement.textContent =
        email;

      emailElement.href =
        'mailto:' +
        encodeURIComponent(email);

    } else {

      emailElement.textContent =
        '--';

      emailElement.removeAttribute(
        'href'
      );
    }
  }


  /*
   * STATUS
   */

  const statusElement =
    document.getElementById(
      'customerStatus'
    );

  if (statusElement) {

    const status =
      String(
        customer.Status || ''
      ).trim();

    statusElement.textContent =
      status || '--';

    statusElement.className =
      'status-badge';

    if (
      status.toLowerCase() ===
      'active'
    ) {

      statusElement.classList.add(
        'status-active'
      );

    } else {

      statusElement.classList.add(
        'status-disabled'
      );
    }
  }


  /*
   * NOTE
   */

  const noteCard =
    document.getElementById(
      'noteCard'
    );

  const noteElement =
    document.getElementById(
      'customerNote'
    );

  const note =
    String(
      customer.Note || ''
    ).trim();

  if (
    note &&
    noteCard &&
    noteElement
  ) {

    noteElement.textContent =
      note;

    noteCard.classList.remove(
      'hidden'
    );

  } else if (noteCard) {

    noteCard.classList.add(
      'hidden'
    );
  }


  setConnectionStatus(
    'Đã kết nối',
    true
  );


  showCustomer();
}


/**
 * Chuyển mã lỗi backend thành
 * thông báo thân thiện.
 *
 * @param {Error} error
 */
function handleCustomerError(error) {

  const code =
    error &&
    error.code
      ? error.code
      : 'UNKNOWN';


  switch (code) {

    case 'MISSING_CREDENTIALS':

      showError(
        'Thiếu thông tin truy cập',
        'Đường link khách hàng chưa có ID hoặc Token hợp lệ.',
        '🔗'
      );

      break;


    case 'CUSTOMER_NOT_FOUND':

      showError(
        'Không tìm thấy khách hàng',
        'Mã khách hàng không tồn tại trong hệ thống.',
        '🔎'
      );

      break;


    case 'INVALID_TOKEN':

      showError(
        'Liên kết không hợp lệ',
        'Token truy cập không đúng hoặc liên kết đã được thay đổi.',
        '🔐'
      );

      break;


    case 'CUSTOMER_DISABLED':

      showError(
        'Tài khoản đã bị khóa',
        'Quyền truy cập của khách hàng hiện đang bị vô hiệu hóa.',
        '⛔'
      );

      break;


    case 'LINK_EXPIRED':

      showError(
        'Liên kết đã hết hạn',
        'Thời hạn truy cập của liên kết khách hàng đã kết thúc.',
        '⏰'
      );

      break;


    case 'TIMEOUT':

      showError(
        'Kết nối quá lâu',
        'Không thể kết nối máy chủ trong thời gian cho phép. Hãy kiểm tra Internet và thử lại.',
        '📡'
      );

      break;


    default:

      showError(
        'Không thể tải dữ liệu',
        error &&
        error.message
          ? error.message
          : 'Đã xảy ra lỗi khi kết nối máy chủ.',
        '⚠️'
      );

      break;
  }
}


/**
 * Tải customer.
 */
async function loadCustomer() {

  showLoading();


  const id =
    getQueryParam('id');

  const token =
    getQueryParam('token');


  if (!id || !token) {

    handleCustomerError({
      code:
        'MISSING_CREDENTIALS'
    });

    return;
  }


  try {

    const result =
      await getCustomer(
        id,
        token
      );


    if (
      !result ||
      !result.success ||
      !result.customer
    ) {

      const error =
        new Error(
          'API không trả về dữ liệu khách hàng.'
        );

      error.code =
        result &&
        result.error
          ? result.error
          : 'API_ERROR';

      throw error;
    }


    renderCustomer(
      result.customer
    );

  } catch (error) {

    console.error(
      'Customer loading error:',
      error
    );

    handleCustomerError(
      error
    );
  }
}


/**
 * Khởi tạo trang.
 */
function initCustomerPage() {

  const retryButton =
    document.getElementById(
      'retryButton'
    );

  if (retryButton) {

    retryButton.addEventListener(
      'click',
      loadCustomer
    );
  }


  loadCustomer();
}


/*
 * Chạy khi HTML đã sẵn sàng.
 */
if (
  document.readyState ===
  'loading'
) {

  document.addEventListener(
    'DOMContentLoaded',
    initCustomerPage
  );

} else {

  initCustomerPage();

}
