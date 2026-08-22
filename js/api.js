/**
 * CRM CUSTOMER PORTAL
 * js/app.js
 *
 * Nhiệm vụ:
 * - Phát hiện id/token trên URL
 * - Nếu có id + token -> chuyển sang customer.html
 * - Nếu không có -> hiển thị trang chủ
 */

(function () {
  'use strict';

  function getQueryParams() {
    const params = new URLSearchParams(
      window.location.search
    );

    return {
      id: (params.get('id') || '').trim(),
      token: (params.get('token') || '').trim()
    };
  }

  function redirectToCustomerPage() {

    const params = getQueryParams();

    if (!params.id || !params.token) {
      return;
    }

    /*
     * Nếu hiện tại đã ở customer.html
     * thì không redirect nữa.
     */
    const currentPage =
      window.location.pathname
        .split('/')
        .pop();

    if (
      currentPage === 'customer.html'
    ) {
      return;
    }

    /*
     * Chuyển sang:
     *
     * /thiep/customer.html?id=KH0001&token=xxxx
     */
    const customerUrl =
      'customer.html?id=' +
      encodeURIComponent(params.id) +
      '&token=' +
      encodeURIComponent(params.token);

    window.location.replace(customerUrl);
  }

  document.addEventListener(
    'DOMContentLoaded',
    redirectToCustomerPage
  );

})();
