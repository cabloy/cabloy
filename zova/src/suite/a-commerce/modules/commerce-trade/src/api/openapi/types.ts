export interface paths {
  '/api/auth/mock/authorize': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['AuthMock_authorize'];
    put?: never;
    post: operations['AuthMock_authorizePost'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/captcha/create': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Captcha_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/captcha/refresh': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Captcha_refresh'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/captcha/verifyImmediate': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Captcha_verifyImmediate'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mailconfirm/mail/emailConfirmCallback': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['MailconfirmMail_emailConfirmCallback'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mailconfirm/mail/passwordResetCallback': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['MailconfirmMail_passwordResetCallback'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/member/address/mine': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceMemberAddress_mine'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/member/address/viewMine/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceMemberAddress_viewMine'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/member/address/createMine': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['CommerceMemberAddress_createMine'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/member/address/updateMine/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch: operations['CommerceMemberAddress_updateMine'];
    trace?: never;
  };
  '/api/commerce/member/address/deleteMine/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete: operations['CommerceMemberAddress_deleteMine'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/member/address': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceMemberAddress_select'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/member/address/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceMemberAddress_view'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/current': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HomeUserPassport_current'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/logout': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserPassport_logout'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/register': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserPassport_register'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/login': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserPassport_login'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/login/{module}/{providerName}/{clientName?}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HomeUserPassport_loginOauth'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/associate/{module}/{providerName}/{clientName?}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HomeUserPassport_associate'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/migrate/{module}/{providerName}/{clientName?}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HomeUserPassport_migrate'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/refreshAuthToken': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserPassport_refreshAuthToken'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/createPassportJwtFromOauthCode': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserPassport_createPassportJwtFromOauthCode'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/createTempAuthToken': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserPassport_createTempAuthToken'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/siteadmin/operator/context': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceSiteadminOperator_context'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/promotion/coupon/mine': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommercePromotionCoupon_mine'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/promotion/coupon/issue': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['CommercePromotionCoupon_issue'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/promotion/couponTemplate': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommercePromotionCouponTemplate_select'];
    put?: never;
    post: operations['CommercePromotionCouponTemplate_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/promotion/couponTemplate/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommercePromotionCouponTemplate_view'];
    put?: never;
    post?: never;
    delete: operations['CommercePromotionCouponTemplate_delete'];
    options?: never;
    head?: never;
    patch: operations['CommercePromotionCouponTemplate_update'];
    trace?: never;
  };
  '/api/commerce/trade/cart': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceTradeCart_current'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/trade/cart/items': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['CommerceTradeCart_addItem'];
    delete: operations['CommerceTradeCart_clear'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/trade/cart/items/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete: operations['CommerceTradeCart_deleteItem'];
    options?: never;
    head?: never;
    patch: operations['CommerceTradeCart_updateItem'];
    trace?: never;
  };
  '/api/commerce/trade/checkout': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['CommerceTradeCheckout_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/trade/order/mine': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceTradeOrder_mine'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/trade/order/viewMine/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceTradeOrder_viewMine'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/trade/order/{id}/requestRefund': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['CommerceTradeOrder_requestRefund'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/trade/order/{id}/approveRefund': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['CommerceTradeOrder_approveRefund'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/trade/order/{id}/rejectRefund': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['CommerceTradeOrder_rejectRefund'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/trade/order/{id}/refundOutcome': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['CommerceTradeOrder_refundOutcome'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/trade/order/{id}/ship': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['CommerceTradeOrder_ship'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/trade/order': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceTradeOrder_select'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/trade/order/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceTradeOrder_view'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/trade/payment/{attemptId}/outcome': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['CommerceTradePayment_outcome'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/trade/stockAudit': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceTradeStockAudit_select'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/trade/stockAudit/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceTradeStockAudit_view'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/trade/stockBalance/adjustStock': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['CommerceTradeStockBalance_adjustStock'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/trade/stockBalance': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceTradeStockBalance_select'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/trade/stockBalance/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceTradeStockBalance_view'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/catalog/category': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceCatalogCategory_select'];
    put?: never;
    post: operations['CommerceCatalogCategory_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/catalog/category/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceCatalogCategory_view'];
    put?: never;
    post?: never;
    delete: operations['CommerceCatalogCategory_delete'];
    options?: never;
    head?: never;
    patch: operations['CommerceCatalogCategory_update'];
    trace?: never;
  };
  '/api/commerce/catalog/product': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceCatalogProduct_select'];
    put?: never;
    post: operations['CommerceCatalogProduct_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/catalog/product/public': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceCatalogProduct_selectPublic'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/catalog/product/public/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceCatalogProduct_viewPublic'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/catalog/product/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceCatalogProduct_view'];
    put?: never;
    post?: never;
    delete: operations['CommerceCatalogProduct_delete'];
    options?: never;
    head?: never;
    patch: operations['CommerceCatalogProduct_update'];
    trace?: never;
  };
  '/api/commerce/catalog/sku': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceCatalogSku_select'];
    put?: never;
    post: operations['CommerceCatalogSku_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/commerce/catalog/sku/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['CommerceCatalogSku_view'];
    put?: never;
    post?: never;
    delete: operations['CommerceCatalogSku_delete'];
    options?: never;
    head?: never;
    patch: operations['CommerceCatalogSku_update'];
    trace?: never;
  };
  '/api/home/base/menu/{publicPath?}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HomeBaseMenu_retrieveMenus'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/base/permission/{resource}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HomeBasePermission_retrievePermissions'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Home */
    get: operations['Home_index'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/training/record': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TrainingRecord_select'];
    put?: never;
    post: operations['TrainingRecord_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/training/record/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TrainingRecord_view'];
    put?: never;
    post?: never;
    delete: operations['TrainingRecord_delete'];
    options?: never;
    head?: never;
    patch: operations['TrainingRecord_update'];
    trace?: never;
  };
  '/api/training/student': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TrainingStudent_select'];
    put?: never;
    post: operations['TrainingStudent_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/training/student/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TrainingStudent_view'];
    put?: never;
    post?: never;
    delete: operations['TrainingStudent_delete'];
    options?: never;
    head?: never;
    patch: operations['TrainingStudent_update'];
    trace?: never;
  };
  '/api/training/student/summary/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TrainingStudent_summary'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/training/student/deleteForce/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete: operations['TrainingStudent_deleteForce'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/file/upload-policy': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['File_getUploadPolicy'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/file/upload': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['File_upload'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/file/direct-upload': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['File_createDirectUpload'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/file/direct-upload/finalize': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['File_finalizeDirectUpload'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/file/upload-url': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['File_uploadUrl'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/file/download': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['File_download'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/image/upload-policy': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Image_getUploadPolicy'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/image/upload': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Image_upload'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/image/direct-upload': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Image_createDirectUpload'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/image/direct-upload/finalize': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Image_finalizeDirectUpload'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/image/upload-url': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Image_uploadUrl'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/image/delivery': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['Image_delivery'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/paypal/getRecord/{recordId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['Paypal_getRecord'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/paypal/captureOrder/{recordId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Paypal_captureOrder'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/paypal/cancelOrder/{recordId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Paypal_cancelOrder'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/auth/passport/isAuthenticated': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestAuthPassport_isAuthenticated'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/auth/passport/current': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestAuthPassport_current'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/captcha/signin': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestCaptcha_signin'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/rest/product': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestRestProduct_select'];
    put?: never;
    post: operations['TestRestProduct_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/rest/product/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestRestProduct_view'];
    put?: never;
    post?: never;
    delete: operations['TestRestProduct_delete'];
    options?: never;
    head?: never;
    patch: operations['TestRestProduct_update'];
    trace?: never;
  };
  '/api/test/ssr/toolMinimal/test': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestSsrToolMinimal_test'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/ssr/toolOne/test/{id?}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestSsrToolOne_testGet'];
    put?: never;
    post: operations['TestSsrToolOne_test'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/ssr/toolTwo/test/{id?}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestSsrToolTwo_test'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/dtoTest/getUserLazy': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaDtoTest_getUserLazy'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/dtoTest/getUserDynamic': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaDtoTest_getPostDynamic'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/dtoTest/getUserStats': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaDtoTest_getUserStats'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/dtoTest/getUserStatsGroup': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaDtoTest_getUserStatsGroup'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/dtoTest/createUser': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestVonaDtoTest_createUser'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/dtoTest/updateUser/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch: operations['TestVonaDtoTest_updateUser'];
    trace?: never;
  };
  '/api/test/vona/dtoTest/getCategoryTree': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaDtoTest_getCategoryTree'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/dtoTest/getCategoryTree2': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaDtoTest_getCategoryTree2'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/guardPassport/testRoleName': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaGuardPassport_testRoleName'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/guardPassport/testRoleNameFail': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaGuardPassport_testRoleNameFail'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/guardPassport/testRoleNameControllerShouldNotExecute': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaGuardPassport_testRoleNameControllerShouldNotExecute'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/guardPassport/testPublic': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaGuardPassport_testPublic'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/guardPassport/testActivatedFalse': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaGuardPassport_testActivatedFalse'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['Onion_index'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/echo': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Onion_echo'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/onion/echo2/{userId}/{userName}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Onion_echo2'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/onion/echo3/{userId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['Onion_echo3'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/onion/echo4': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Onion_echo4'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/onion/echo5': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['Onion_echo5'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/onion/echo6': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['Onion_echo6'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/onion/echo7': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['Onion_echo7'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/order/create': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestVonaOrder_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/order/update/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestVonaOrder_update'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/order/findAll': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaOrder_findAll'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/order/findMany': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaOrder_findMany'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/post/group': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaPost_group'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/post/aggregate': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaPost_aggregate'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/post/findManyEcho': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaPost_findManyEcho'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/post/findMany': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaPost_findMany'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/serializer/echoSimple': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestVonaSerializer_echoSimple'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/serializer/echoArray': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestVonaSerializer_echoArray'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/serializer/echoLazy': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestVonaSerializer_echoLazy'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/upload/fields': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestVonaUpload_fields'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/upload/file': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestVonaUpload_file'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/upload/strict': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestVonaUpload_strict'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/upload/files': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestVonaUpload_files'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    'test-vona.dto.postCreate': {
      /** @description Title */
      title: string;
      userId: number | string;
      stars?: number | undefined;
    };
    'test-vona.dto.userCreate': {
      name: string;
      age?: number | undefined;
      scores?: number | undefined;
      posts?:
        | {
            /** @description Title */
            title: string;
          }[]
        | undefined;
      roles?:
        | {
            id: number | string;
            deleted?: boolean | undefined;
          }[]
        | undefined;
    };
    'test-vona.entity.product': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      /** @description Name */
      name: string;
      /** @description Price */
      price: number;
      /** @description Quantity */
      quantity: number;
      /** @description Amount */
      amount: number;
      orderId: number | string;
    };
    'a-captcha.dto.captchaData': {
      id: string;
      provider: string;
      token?: unknown;
      payload?: unknown;
    };
    'commerce-member.dto.addressMineRes': {
      list: components['schemas']['commerce-member.dto.addressMineItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'commerce-member.dto.addressMineItem': {
      id: number | string;
      /** @description Recipient Name */
      recipientName: string;
      /** @description Phone */
      phone: string;
      /** @description Country Code */
      countryCode: string;
      /** @description Region */
      region: string;
      /** @description City */
      city: string;
      /** @description Postal Code */
      postalCode: string;
      /** @description Address Line 1 */
      addressLine1: string;
      /** @description Address Line 2 */
      addressLine2?: string | undefined;
    };
    'commerce-member.dto.addressMineView_2d063d28bc7243bed02ebd8bddf1212a93c6305b':
      | {
          id: number | string;
          /** @description Recipient Name */
          recipientName: string;
          /** @description Phone */
          phone: string;
          /** @description Country Code */
          countryCode: string;
          /** @description Region */
          region: string;
          /** @description City */
          city: string;
          /** @description Postal Code */
          postalCode: string;
          /** @description Address Line 1 */
          addressLine1: string;
          /** @description Address Line 2 */
          addressLine2?: string | undefined;
        }
      | undefined;
    'commerce-member.dto.addressMineCreate': {
      /** @description Recipient Name */
      recipientName: string;
      /** @description Phone */
      phone: string;
      /** @description Country Code */
      countryCode: string;
      /** @description Region */
      region: string;
      /** @description City */
      city: string;
      /** @description Postal Code */
      postalCode: string;
      /** @description Address Line 1 */
      addressLine1: string;
      /** @description Address Line 2 */
      addressLine2?: string | undefined;
    };
    'commerce-member.dto.addressMineUpdate': {
      /** @description Recipient Name */
      recipientName: string;
      /** @description Phone */
      phone: string;
      /** @description Country Code */
      countryCode: string;
      /** @description Region */
      region: string;
      /** @description City */
      city: string;
      /** @description Postal Code */
      postalCode: string;
      /** @description Address Line 1 */
      addressLine1: string;
      /** @description Address Line 2 */
      addressLine2?: string | undefined;
    };
    'commerce-member.dto.addressSelectRes': {
      list: components['schemas']['commerce-member.dto.addressSelectResItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'commerce-member.dto.addressSelectResItem': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /** @description ID */
      id: number | string;
      /** @description Recipient Name */
      recipientName: string;
      /** @description Phone */
      phone: string;
      /** @description Country Code */
      countryCode: string;
      /** @description Region */
      region: string;
      /** @description City */
      city: string;
      /** @description Postal Code */
      postalCode: string;
      /** @description Address Line 1 */
      addressLine1: string;
      /** @description Address Line 2 */
      addressLine2?: string | undefined;
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'commerce-member.dto.addressView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875':
      | {
          /**
           * Format: date-time
           * @description Created At
           */
          createdAt: Date;
          /**
           * Format: date-time
           * @description Updated At
           */
          updatedAt: Date;
          /** @description ID */
          id: number | string;
          /** @description Recipient Name */
          recipientName: string;
          /** @description Phone */
          phone: string;
          /** @description Country Code */
          countryCode: string;
          /** @description Region */
          region: string;
          /** @description City */
          city: string;
          /** @description Postal Code */
          postalCode: string;
          /** @description Address Line 1 */
          addressLine1: string;
          /** @description Address Line 2 */
          addressLine2?: string | undefined;
        }
      | undefined;
    'home-user.dto.passport_2d063d28bc7243bed02ebd8bddf1212a93c6305b':
      | {
          user: components['schemas']['home-user.entity.user'];
          auth: components['schemas']['a-auth.dto.auth'];
          roles: components['schemas']['home-user.entity.role'][];
        }
      | undefined;
    'home-user.entity.user': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      /** @description User Name */
      name: string;
      /** @description Avatar */
      avatar?: string | undefined;
      /** @description Email */
      email?: string | undefined;
      /** @description Mobile */
      mobile?: string | undefined;
      /**
       * @description Activated
       * @default false
       */
      activated?: boolean;
      /** @description Language */
      locale?: string | undefined;
      /** @description Timezone */
      tz?: string | undefined;
    };
    'a-auth.dto.auth': {
      /** @description ID */
      id: number | string;
      profileId: string;
      authProvider?: {
        /** @description ID */
        id: number;
        providerName: string;
        clientName: string;
      };
    };
    'home-user.entity.role': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      /** @description Role Name */
      name: string;
      /** @description Role Title */
      title: string;
      /** @description Role Locales */
      locales?:
        | {
            [key: string]: string;
          }
        | undefined;
      siteIds: string[];
    };
    'home-user.dto.passportJwt': {
      passport: components['schemas']['home-user.dto.passport'];
      jwt: components['schemas']['a-jwt.dto.jwtToken'];
    };
    'home-user.dto.passport': {
      user: components['schemas']['home-user.entity.user'];
      auth: components['schemas']['a-auth.dto.auth'];
      roles: components['schemas']['home-user.entity.role'][];
    };
    'a-jwt.dto.jwtToken': {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
    'home-user.dto.register': {
      username: string;
      /** Format: email */
      email: string;
      password: string;
      passwordConfirm: string;
      captcha: components['schemas']['a-captcha.dto.captchaVerify_67c39cad0735f2460ecc6bef838440b07c4dcfa9'];
    };
    'a-captcha.dto.captchaVerify_67c39cad0735f2460ecc6bef838440b07c4dcfa9': {
      id: string;
      token: string;
    };
    'home-user.dto.login': {
      username: string;
      password: string;
      captcha: components['schemas']['a-captcha.dto.captchaVerify_67c39cad0735f2460ecc6bef838440b07c4dcfa9_f73253d699f0fd90b98fded80a123a0a180dbca2_144c29cc01b745c0021a6682766a475fe639fb8f_626802c24df1498cec99aab0854fedf90c9b6dd3_9aa4df25b9311e645e1c9dfbe6b7ece6398da661'];
    };
    'a-captcha.dto.captchaVerify_67c39cad0735f2460ecc6bef838440b07c4dcfa9_f73253d699f0fd90b98fded80a123a0a180dbca2_144c29cc01b745c0021a6682766a475fe639fb8f_626802c24df1498cec99aab0854fedf90c9b6dd3_9aa4df25b9311e645e1c9dfbe6b7ece6398da661': {
      id: string;
      token: string;
    };
    'commerce-siteadmin.dto.operatorContext': {
      instanceId: string;
      instanceName: string;
      userId: string;
      userName: string;
    };
    'commerce-promotion.dto.couponMineItem': {
      id: number | string;
      couponCode: string;
      templateName: string;
      /** @enum {string} */
      currency: 'USD';
      discountCents: number;
      minSpendCents: number;
      /** Format: date-time */
      validUntil: Date;
    };
    'commerce-promotion.dto.couponIssue': {
      templateId: number | string;
      userId: number | string;
      correlationId: string;
      reason: string;
    };
    'commerce-promotion.dto.couponTemplateCreate': {
      name: string;
      /** @enum {string} */
      state: 'draft' | 'active';
      /** @enum {string} */
      currency: 'USD';
      discountCents: number;
      minSpendCents: number;
      /** Format: date-time */
      validFrom: Date;
      /** Format: date-time */
      validUntil: Date;
      totalIssueLimit?: number | undefined;
      totalUsageLimit?: number | undefined;
      perCustomerIssueLimit?: number | undefined;
      description?: string | undefined;
    };
    'commerce-promotion.dto.couponTemplateSelectRes': {
      list: components['schemas']['commerce-promotion.dto.couponTemplateSelectResItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'commerce-promotion.dto.couponTemplateSelectResItem': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      /** @description Name */
      name: string;
      /**
       * @description Template State
       * @enum {string}
       */
      state: 'draft' | 'active' | 'disabled';
      /**
       * @description Currency
       * @enum {string}
       */
      currency: 'USD';
      /** @description Fixed Discount (Cents) */
      discountCents: number;
      /** @description Minimum Spend (Cents) */
      minSpendCents: number;
      /**
       * Format: date-time
       * @description Valid From
       */
      validFrom: Date;
      /**
       * Format: date-time
       * @description Valid Until
       */
      validUntil: Date;
      /** @description Total Issue Limit */
      totalIssueLimit?: number | undefined;
      /** @description Total Usage Limit */
      totalUsageLimit?: number | undefined;
      /** @description Per-customer Issue Limit */
      perCustomerIssueLimit?: number | undefined;
      /** @description Issued Count */
      issuedCount: number;
      /** @description Redeemed Count */
      redeemedCount: number;
      /** @description Description */
      description?: string | undefined;
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'commerce-promotion.dto.couponTemplateView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875':
      | {
          /**
           * Format: date-time
           * @description Created At
           */
          createdAt: Date;
          /**
           * Format: date-time
           * @description Updated At
           */
          updatedAt: Date;
          /**
           * @description Deleted
           * @default false
           */
          deleted?: boolean;
          /**
           * @description Instance ID
           * @default 0
           */
          iid?: number;
          /** @description ID */
          id: number | string;
          /** @description Name */
          name: string;
          /**
           * @description Template State
           * @enum {string}
           */
          state: 'draft' | 'active' | 'disabled';
          /**
           * @description Currency
           * @enum {string}
           */
          currency: 'USD';
          /** @description Fixed Discount (Cents) */
          discountCents: number;
          /** @description Minimum Spend (Cents) */
          minSpendCents: number;
          /**
           * Format: date-time
           * @description Valid From
           */
          validFrom: Date;
          /**
           * Format: date-time
           * @description Valid Until
           */
          validUntil: Date;
          /** @description Total Issue Limit */
          totalIssueLimit?: number | undefined;
          /** @description Total Usage Limit */
          totalUsageLimit?: number | undefined;
          /** @description Per-customer Issue Limit */
          perCustomerIssueLimit?: number | undefined;
          /** @description Issued Count */
          issuedCount: number;
          /** @description Redeemed Count */
          redeemedCount: number;
          /** @description Description */
          description?: string | undefined;
        }
      | undefined;
    'commerce-promotion.dto.couponTemplateUpdate': {
      name?: string | undefined;
      /** @enum {string|null} */
      state?: 'draft' | 'active' | 'disabled' | null | undefined;
      description?: string | undefined;
    };
    'commerce-trade.dto.cartView': {
      id?: number | string | undefined;
      items: components['schemas']['commerce-trade.dto.cartItem'][];
    };
    /** @description Cart Item */
    'commerce-trade.dto.cartItem': {
      id: number | string;
      skuId: number | string;
      quantity: number;
      skuCode: string;
      productTitle: string;
      priceCents: number;
      available: number;
    };
    /** @description Add Cart Item */
    'commerce-trade.dto.cartAddItem': {
      /** @description SKU ID */
      skuId: number | string;
      /** @description Quantity */
      quantity: number;
    };
    /** @description Update Cart Item */
    'commerce-trade.dto.cartUpdateItem': {
      /** @description Quantity */
      quantity: number;
    };
    'commerce-trade.dto.checkoutResult': {
      orderId: number | string;
      paymentAttemptId: number | string;
      /** @enum {string} */
      state: 'awaiting_payment' | 'paid' | 'cancelled' | 'expired';
      /** @enum {string} */
      paymentAttemptState: 'created' | 'succeeded' | 'failed' | 'cancelled';
      /** @enum {string} */
      currency: 'USD';
      payableTotalCents: number;
      /** Format: date-time */
      reservationExpiresAt: Date;
    };
    'commerce-trade.dto.checkoutCreate': {
      addressId: number | string;
      couponGrantId?: number | string | undefined;
      correlationId: string;
    };
    'commerce-trade.dto.orderMineRes': {
      list: components['schemas']['commerce-trade.dto.orderSummary'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'commerce-trade.dto.orderSummary': {
      id: number | string;
      /** @enum {string} */
      state:
        | 'awaiting_payment'
        | 'paid'
        | 'refund_requested'
        | 'refund_approved'
        | 'refund_rejected'
        | 'shipped'
        | 'refunded'
        | 'cancelled'
        | 'expired';
      /** @enum {string} */
      currency: 'USD';
      payableTotalCents: number;
      /** Format: date-time */
      createdAt: Date;
    };
    'commerce-trade.dto.orderDetail_2d063d28bc7243bed02ebd8bddf1212a93c6305b':
      | {
          id: number | string;
          /** @enum {string} */
          state:
            | 'awaiting_payment'
            | 'paid'
            | 'refund_requested'
            | 'refund_approved'
            | 'refund_rejected'
            | 'shipped'
            | 'refunded'
            | 'cancelled'
            | 'expired';
          /** @enum {string} */
          currency: 'USD';
          eligibleSubtotalCents: number;
          discountCents: number;
          payableTotalCents: number;
          /** Format: date-time */
          reservationExpiresAt: Date;
          addressSnapshot: components['schemas']['commerce-trade.dto.orderAddressSnapshot'];
          couponSnapshot?: components['schemas']['commerce-trade.dto.orderCouponSnapshot_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
          shipment?: components['schemas']['commerce-trade.dto.shipmentView_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
          lines: {
            id: number | string;
            skuCodeSnapshot: string;
            titleSnapshot: string;
            skuAttributesSnapshot: components['schemas']['commerce-trade.dto.orderLineSkuAttributeSnapshot'][];
            unitPriceCents: number;
            quantity: number;
            lineTotalCents: number;
          }[];
        }
      | undefined;
    'commerce-trade.dto.orderAddressSnapshot': {
      recipientName: string;
      phone: string;
      countryCode: string;
      region: string;
      city: string;
      postalCode: string;
      addressLine1: string;
      addressLine2?: string | undefined;
    };
    'commerce-trade.dto.orderCouponSnapshot_2d063d28bc7243bed02ebd8bddf1212a93c6305b':
      | {
          couponGrantId: number | string;
          couponTemplateId: number | string;
          couponCode: string;
          templateName: string;
          /** @enum {string} */
          currency: 'USD';
          fixedDiscountCents: number;
          minSpendCents: number;
          appliedDiscountCents: number;
        }
      | undefined;
    'commerce-trade.dto.shipmentView_2d063d28bc7243bed02ebd8bddf1212a93c6305b':
      | {
          id: number | string;
          carrier: string;
          trackingNumber: string;
          /** Format: date-time */
          shippedAt: Date;
        }
      | undefined;
    'commerce-trade.dto.orderLineSkuAttributeSnapshot': {
      name: string;
      value: string;
    };
    'commerce-trade.dto.refundResult': {
      orderId: number | string;
      refundRequestId: number | string;
      refundAttemptId?: number | string | undefined;
      /** @enum {string} */
      orderState: 'paid' | 'refund_requested' | 'refund_approved' | 'refund_rejected' | 'refunded';
      /** @enum {string} */
      refundState: 'requested' | 'approved' | 'rejected' | 'refunded' | 'failed';
      /** @enum {string|null} */
      refundAttemptState?: 'created' | 'succeeded' | 'failed' | null | undefined;
      /** @enum {string} */
      currency: 'USD';
      amountCents: number;
    };
    'commerce-trade.dto.refundRequestCreate': {
      reason: string;
      idempotencyKey: string;
    };
    'commerce-trade.dto.refundReview': {
      reason: string;
      idempotencyKey: string;
    };
    'commerce-trade.dto.refundOutcomeCreate': {
      /** @enum {string} */
      outcome: 'succeeded' | 'failed';
      idempotencyKey: string;
    };
    'commerce-trade.dto.shipmentView': {
      id: number | string;
      carrier: string;
      trackingNumber: string;
      /** Format: date-time */
      shippedAt: Date;
    };
    'commerce-trade.dto.orderShip': {
      carrier: string;
      trackingNumber: string;
    };
    'commerce-trade.dto.orderSelectRes': {
      list: components['schemas']['commerce-trade.dto.orderSelectResItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'commerce-trade.dto.orderSelectResItem': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      userId: number | string;
      addressId: number | string;
      correlationId: string;
      addressSnapshot: components['schemas']['commerce-trade.dto.orderAddressSnapshot'];
      couponSnapshot?: components['schemas']['commerce-trade.dto.orderCouponSnapshot_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
      /** @enum {string} */
      state:
        | 'awaiting_payment'
        | 'paid'
        | 'refund_requested'
        | 'refund_approved'
        | 'refund_rejected'
        | 'shipped'
        | 'refunded'
        | 'cancelled'
        | 'expired';
      /** @enum {string} */
      currency: 'USD';
      eligibleSubtotalCents: number;
      discountCents: number;
      payableTotalCents: number;
      /** Format: date-time */
      reservationExpiresAt: Date;
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'commerce-trade.dto.orderView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875':
      | {
          /**
           * Format: date-time
           * @description Created At
           */
          createdAt: Date;
          /**
           * Format: date-time
           * @description Updated At
           */
          updatedAt: Date;
          /**
           * @description Deleted
           * @default false
           */
          deleted?: boolean;
          /**
           * @description Instance ID
           * @default 0
           */
          iid?: number;
          /** @description ID */
          id: number | string;
          userId: number | string;
          addressId: number | string;
          correlationId: string;
          addressSnapshot: components['schemas']['commerce-trade.dto.orderAddressSnapshot'];
          couponSnapshot?: components['schemas']['commerce-trade.dto.orderCouponSnapshot_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
          /** @enum {string} */
          state:
            | 'awaiting_payment'
            | 'paid'
            | 'refund_requested'
            | 'refund_approved'
            | 'refund_rejected'
            | 'shipped'
            | 'refunded'
            | 'cancelled'
            | 'expired';
          /** @enum {string} */
          currency: 'USD';
          eligibleSubtotalCents: number;
          discountCents: number;
          payableTotalCents: number;
          /** Format: date-time */
          reservationExpiresAt: Date;
          shipment?: {
            /**
             * Format: date-time
             * @description Created At
             */
            createdAt: Date;
            /**
             * Format: date-time
             * @description Updated At
             */
            updatedAt: Date;
            /**
             * @description Deleted
             * @default false
             */
            deleted?: boolean;
            /**
             * @description Instance ID
             * @default 0
             */
            iid?: number;
            /** @description ID */
            id: number | string;
            orderId: number | string;
            carrier: string;
            trackingNumber: string;
            operatorId: number | string;
            /** Format: date-time */
            shippedAt: Date;
            correlationId: string;
          };
        }
      | undefined;
    'commerce-trade.dto.paymentOutcomeResult': {
      orderId: number | string;
      paymentAttemptId: number | string;
      /** @enum {string} */
      orderState: 'paid' | 'cancelled' | 'expired';
      /** @enum {string} */
      paymentAttemptState: 'succeeded' | 'failed' | 'cancelled';
      /** @enum {string} */
      currency: 'USD';
      payableTotalCents: number;
    };
    'commerce-trade.dto.paymentOutcomeCreate': {
      /** @enum {string} */
      outcome: 'succeeded' | 'failed' | 'cancelled';
      idempotencyKey: string;
    };
    'commerce-trade.dto.stockAuditSelectRes': {
      list: components['schemas']['commerce-trade.dto.stockAuditSelectResItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'commerce-trade.dto.stockAuditSelectResItem': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      /** @description Stock Balance ID */
      stockBalanceId: number | string;
      /** @description SKU ID */
      skuId: number | string;
      /** @description Stock Reservation ID */
      stockReservationId?: number | string | undefined;
      /** @description Actor ID */
      actorId?: number | string | undefined;
      /**
       * @description Stock Operation
       * @enum {string}
       */
      operation: 'adjust' | 'reserve' | 'consume' | 'release' | 'restore';
      /** @description Delta */
      delta: number;
      /** @description Reason */
      reason: string;
      /** @description Correlation ID */
      correlationId: string;
      /** @description Prior On Hand */
      priorOnHand: number;
      /** @description Prior Reserved */
      priorReserved: number;
      /** @description Prior Available */
      priorAvailable: number;
      /** @description On Hand */
      onHand: number;
      /** @description Reserved */
      reserved: number;
      /** @description Available */
      available: number;
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'commerce-trade.dto.stockAuditView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875':
      | {
          /**
           * Format: date-time
           * @description Created At
           */
          createdAt: Date;
          /**
           * Format: date-time
           * @description Updated At
           */
          updatedAt: Date;
          /**
           * @description Deleted
           * @default false
           */
          deleted?: boolean;
          /**
           * @description Instance ID
           * @default 0
           */
          iid?: number;
          /** @description ID */
          id: number | string;
          /** @description Stock Balance ID */
          stockBalanceId: number | string;
          /** @description SKU ID */
          skuId: number | string;
          /** @description Stock Reservation ID */
          stockReservationId?: number | string | undefined;
          /** @description Actor ID */
          actorId?: number | string | undefined;
          /**
           * @description Stock Operation
           * @enum {string}
           */
          operation: 'adjust' | 'reserve' | 'consume' | 'release' | 'restore';
          /** @description Delta */
          delta: number;
          /** @description Reason */
          reason: string;
          /** @description Correlation ID */
          correlationId: string;
          /** @description Prior On Hand */
          priorOnHand: number;
          /** @description Prior Reserved */
          priorReserved: number;
          /** @description Prior Available */
          priorAvailable: number;
          /** @description On Hand */
          onHand: number;
          /** @description Reserved */
          reserved: number;
          /** @description Available */
          available: number;
        }
      | undefined;
    'commerce-trade.entity.stockBalance': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      /** @description SKU ID */
      skuId: number | string;
      /** @description On Hand */
      onHand: number;
      /** @description Reserved */
      reserved: number;
      /** @description Available */
      available: number;
    };
    /** @description Adjust Stock */
    'commerce-trade.dto.stockAdjust_0aab216abd3467dd07f61c69172266c2441af477': {
      /** @description SKU ID */
      skuId: number | string;
      /** @description Delta */
      delta: number;
      /** @description Reason */
      reason: string;
      /** @description Correlation ID */
      correlationId: string;
    };
    'commerce-trade.dto.stockBalanceSelectRes': {
      list: components['schemas']['commerce-trade.dto.stockBalanceSelectResItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'commerce-trade.dto.stockBalanceSelectResItem': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      /** @description SKU ID */
      skuId: number | string;
      /** @description On Hand */
      onHand: number;
      /** @description Reserved */
      reserved: number;
      /** @description Available */
      available: number;
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'commerce-trade.dto.stockBalanceView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875':
      | {
          /**
           * Format: date-time
           * @description Created At
           */
          createdAt: Date;
          /**
           * Format: date-time
           * @description Updated At
           */
          updatedAt: Date;
          /**
           * @description Deleted
           * @default false
           */
          deleted?: boolean;
          /**
           * @description Instance ID
           * @default 0
           */
          iid?: number;
          /** @description ID */
          id: number | string;
          /** @description SKU ID */
          skuId: number | string;
          /** @description On Hand */
          onHand: number;
          /** @description Reserved */
          reserved: number;
          /** @description Available */
          available: number;
        }
      | undefined;
    'commerce-catalog.dto.categoryCreate': {
      /** @description Name */
      name: string;
      /** @description Parent category */
      parentId?: number | string | undefined;
      /**
       * @description Published
       * @default false
       */
      published?: boolean;
      /** @description Description */
      description?: string | undefined;
    };
    'commerce-catalog.dto.categorySelectRes': {
      list: components['schemas']['commerce-catalog.dto.categorySelectResItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'commerce-catalog.dto.categorySelectResItem': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      /** @description Name */
      name: string;
      /** @description Parent category */
      parentId?: number | string | undefined;
      /**
       * @description Published
       * @default false
       */
      published?: boolean;
      /** @description Description */
      description?: string | undefined;
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'commerce-catalog.dto.categoryView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875':
      | {
          /**
           * Format: date-time
           * @description Created At
           */
          createdAt: Date;
          /**
           * Format: date-time
           * @description Updated At
           */
          updatedAt: Date;
          /**
           * @description Deleted
           * @default false
           */
          deleted?: boolean;
          /**
           * @description Instance ID
           * @default 0
           */
          iid?: number;
          /** @description ID */
          id: number | string;
          /** @description Name */
          name: string;
          /** @description Parent category */
          parentId?: number | string | undefined;
          /**
           * @description Published
           * @default false
           */
          published?: boolean;
          /** @description Description */
          description?: string | undefined;
        }
      | undefined;
    'commerce-catalog.dto.categoryUpdate': {
      /** @description Name */
      name: string;
      /** @description Parent category */
      parentId?: number | string | undefined;
      /**
       * @description Published
       * @default false
       */
      published?: boolean;
      /** @description Description */
      description?: string | undefined;
    };
    'commerce-catalog.dto.productCreate': {
      /** @description Product title */
      title: string;
      /** @description Category */
      categoryId: number | string;
      /**
       * @description Published
       * @default false
       */
      published?: boolean;
      /** @description Description */
      description?: string | undefined;
    };
    'commerce-catalog.dto.productSelectRes': {
      list: components['schemas']['commerce-catalog.dto.productSelectResItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'commerce-catalog.dto.productSelectResItem': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      /** @description Product title */
      title: string;
      /** @description Category */
      categoryId: number | string;
      /**
       * @description Published
       * @default false
       */
      published?: boolean;
      /** @description Description */
      description?: string | undefined;
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'commerce-catalog.dto.productPublicSelectRes': {
      list: components['schemas']['commerce-catalog.dto.productPublic'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'commerce-catalog.dto.productPublic': {
      id: number | string;
      /** @description Product title */
      title: string;
      /** @description Description */
      description?: string | undefined;
      /** @description Category */
      categoryId: number | string;
      /** @description Name */
      categoryName: string;
      /** @description Price (cents) */
      priceCents: number;
      /** @description Available */
      available: number;
      skuAvailables: components['schemas']['commerce-catalog.dto.productPublicSku'][];
    };
    'commerce-catalog.dto.productPublicSku': {
      id: number | string;
      /** @description SKU code */
      code: string;
      /** @description Price (cents) */
      priceCents: number;
      /** @description Available */
      available: number;
    };
    'commerce-catalog.dto.productPublic_2d063d28bc7243bed02ebd8bddf1212a93c6305b':
      | {
          id: number | string;
          /** @description Product title */
          title: string;
          /** @description Description */
          description?: string | undefined;
          /** @description Category */
          categoryId: number | string;
          /** @description Name */
          categoryName: string;
          /** @description Price (cents) */
          priceCents: number;
          /** @description Available */
          available: number;
          skuAvailables: components['schemas']['commerce-catalog.dto.productPublicSku'][];
        }
      | undefined;
    'commerce-catalog.dto.productView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875':
      | {
          /**
           * Format: date-time
           * @description Created At
           */
          createdAt: Date;
          /**
           * Format: date-time
           * @description Updated At
           */
          updatedAt: Date;
          /**
           * @description Deleted
           * @default false
           */
          deleted?: boolean;
          /**
           * @description Instance ID
           * @default 0
           */
          iid?: number;
          /** @description ID */
          id: number | string;
          /** @description Product title */
          title: string;
          /** @description Category */
          categoryId: number | string;
          /**
           * @description Published
           * @default false
           */
          published?: boolean;
          /** @description Description */
          description?: string | undefined;
        }
      | undefined;
    'commerce-catalog.dto.productUpdate': {
      /** @description Product title */
      title: string;
      /** @description Category */
      categoryId: number | string;
      /**
       * @description Published
       * @default false
       */
      published?: boolean;
      /** @description Description */
      description?: string | undefined;
    };
    'commerce-catalog.dto.skuCreate': {
      /** @description SKU code */
      code: string;
      /** @description Product */
      productId: number | string;
      /** @description Price (cents) */
      priceCents: number;
      /**
       * @description SKU attributes
       * @default []
       */
      attributes?: components['schemas']['commerce-catalog.dto.skuAttribute'][];
      /**
       * @description SKU lifecycle
       * @default draft
       * @enum {string}
       */
      lifecycle?: 'draft' | 'active' | 'inactive' | 'archived';
    };
    'commerce-catalog.dto.skuAttribute': {
      /** @description SKU attribute name */
      name: string;
      /** @description SKU attribute value */
      value: string;
    };
    'commerce-catalog.dto.skuSelectRes': {
      list: components['schemas']['commerce-catalog.dto.skuSelectResItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'commerce-catalog.dto.skuSelectResItem': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      /** @description SKU code */
      code: string;
      /** @description Product */
      productId: number | string;
      /** @description Price (cents) */
      priceCents: number;
      /**
       * @description SKU attributes
       * @default []
       */
      attributes?: components['schemas']['commerce-catalog.dto.skuAttribute'][];
      /**
       * @description SKU lifecycle
       * @default draft
       * @enum {string}
       */
      lifecycle?: 'draft' | 'active' | 'inactive' | 'archived';
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'commerce-catalog.dto.skuView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875':
      | {
          /**
           * Format: date-time
           * @description Created At
           */
          createdAt: Date;
          /**
           * Format: date-time
           * @description Updated At
           */
          updatedAt: Date;
          /**
           * @description Deleted
           * @default false
           */
          deleted?: boolean;
          /**
           * @description Instance ID
           * @default 0
           */
          iid?: number;
          /** @description ID */
          id: number | string;
          /** @description SKU code */
          code: string;
          /** @description Product */
          productId: number | string;
          /** @description Price (cents) */
          priceCents: number;
          /**
           * @description SKU attributes
           * @default []
           */
          attributes?: components['schemas']['commerce-catalog.dto.skuAttribute'][];
          /**
           * @description SKU lifecycle
           * @default draft
           * @enum {string}
           */
          lifecycle?: 'draft' | 'active' | 'inactive' | 'archived';
        }
      | undefined;
    'commerce-catalog.dto.skuUpdate': {
      /** @description SKU code */
      code: string;
      /** @description Product */
      productId: number | string;
      /** @description Price (cents) */
      priceCents: number;
      /**
       * @description SKU attributes
       * @default []
       */
      attributes?: components['schemas']['commerce-catalog.dto.skuAttribute'][];
      /**
       * @description SKU lifecycle
       * @default draft
       * @enum {string}
       */
      lifecycle?: 'draft' | 'active' | 'inactive' | 'archived';
    };
    'a-menu.dto.menus': {
      menus?: components['schemas']['a-menu.dto.menuItem'][] | undefined;
      groups?: components['schemas']['a-menu.dto.menuGroup'][] | undefined;
    };
    'a-menu.dto.menuItem': {
      name: string;
      title?: string | undefined;
      description?: string | undefined;
      icon?: string | undefined;
      order?: number | undefined;
      group?: string | string[] | undefined;
      separator?: boolean | undefined;
      link?: string | undefined;
      external?: boolean | undefined;
      target?: string | undefined;
      meta?: components['schemas']['a-menu.dto.menuItemMeta_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
    };
    'a-menu.dto.menuItemMeta_2d063d28bc7243bed02ebd8bddf1212a93c6305b':
      | {
          params?: unknown;
          query?: unknown;
        }
      | undefined;
    'a-menu.dto.menuGroup': {
      name: string;
      title?: string | undefined;
      description?: string | undefined;
      icon?: string | undefined;
      order?: number | undefined;
      group?: string | string[] | undefined;
      collapsed?: boolean | undefined;
    };
    'a-permission.dto.permissions': {
      roleIds?: (number | string)[] | undefined;
      roleNames?: string[] | undefined;
      actions?: unknown;
    };
    'training-record.dto.recordCreate': {
      /** @description Training Record Name */
      name: string;
      /** @description Student */
      studentId: number | string;
      /** @description Subject Count */
      subjectCount?: number | undefined;
      /** @description Total Score */
      totalScore?: number | undefined;
      /** @description Average Score */
      averageScore?: number | undefined;
      /**
       * Format: date-time
       * @description Training Time
       */
      trainingTime?: Date;
      /** @description Scene Photos */
      sceneImageIds?: (number | string)[] | undefined;
      /** @description Dossier Files */
      dossierFileIds?: (number | string)[] | undefined;
      /** @description Description */
      description?: string | undefined;
      /** @description Student Training Record Details */
      trainingRecordSubjects?:
        | {
            /** @description Subject Name */
            name: string;
            /** @description Subject Score */
            score: number;
            /** @description Description */
            description?: string | undefined;
          }[]
        | undefined;
      _trainingRecordSubjects?:
        | components['schemas']['training-record.dto.detailRecordSubjectResItem'][]
        | undefined;
    };
    'training-record.dto.detailRecordSubjectResItem': {
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /** @description ID */
      id: number | string;
      /** @description Subject Name */
      name: string;
      /** @description Subject Score */
      score: number;
      /** @description Description */
      description?: string | undefined;
      /** @description # */
      _lineNumber: number;
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'training-record.dto.recordSelectRes': {
      list: components['schemas']['training-record.dto.recordSelectResItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'training-record.dto.recordSelectResItem': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      /** @description Training Record Name */
      name: string;
      /** @description Student */
      studentId: number | string;
      /** @description Subject Count */
      subjectCount?: number | undefined;
      /** @description Total Score */
      totalScore?: number | undefined;
      /** @description Average Score */
      averageScore?: number | undefined;
      /**
       * Format: date-time
       * @description Training Time
       */
      trainingTime?: Date;
      /** @description Scene Photos */
      sceneImageIds?: (number | string)[] | undefined;
      /** @description Dossier Files */
      dossierFileIds?: (number | string)[] | undefined;
      /** @description Description */
      description?: string | undefined;
      sceneImages?: components['schemas']['a-image.dto.imageView'][] | undefined;
      /** @description Dossier Files */
      dossierFiles?: components['schemas']['a-file.dto.fileView'][] | undefined;
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'a-image.dto.imageView': {
      id: number | string;
      url: string;
      filename?: string | undefined;
      width?: number | undefined;
      height?: number | undefined;
      public?: boolean | undefined;
      /** @default true */
      signed?: boolean;
    };
    'a-file.dto.fileView': {
      id: number | string;
      filename?: string | undefined;
      contentType?: string | undefined;
      size?: number | undefined;
      public?: boolean | undefined;
      /** Format: date-time */
      uploadedAt?: Date;
      downloadUrl: string;
      /** @default true */
      signed?: boolean;
    };
    'training-record.dto.recordView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875':
      | {
          /**
           * Format: date-time
           * @description Created At
           */
          createdAt: Date;
          /**
           * Format: date-time
           * @description Updated At
           */
          updatedAt: Date;
          /**
           * @description Deleted
           * @default false
           */
          deleted?: boolean;
          /**
           * @description Instance ID
           * @default 0
           */
          iid?: number;
          /** @description ID */
          id: number | string;
          /** @description Training Record Name */
          name: string;
          /** @description Student */
          studentId: number | string;
          /** @description Subject Count */
          subjectCount?: number | undefined;
          /** @description Total Score */
          totalScore?: number | undefined;
          /** @description Average Score */
          averageScore?: number | undefined;
          /**
           * Format: date-time
           * @description Training Time
           */
          trainingTime?: Date;
          /** @description Scene Photos */
          sceneImageIds?: (number | string)[] | undefined;
          /** @description Dossier Files */
          dossierFileIds?: (number | string)[] | undefined;
          /** @description Description */
          description?: string | undefined;
          /** @description Student Training Record Details */
          trainingRecordSubjects: {
            /**
             * @description Deleted
             * @default false
             */
            deleted?: boolean;
            /** @description ID */
            id: number | string;
            /** @description Subject Name */
            name: string;
            /** @description Subject Score */
            score: number;
            /** @description Description */
            description?: string | undefined;
          }[];
          sceneImages?: components['schemas']['a-image.dto.imageView'][] | undefined;
          /** @description Dossier Files */
          dossierFiles?: components['schemas']['a-file.dto.fileView'][] | undefined;
          _trainingRecordSubjects?:
            | components['schemas']['training-record.dto.detailRecordSubjectResItem'][]
            | undefined;
        }
      | undefined;
    'training-record.dto.recordUpdate': {
      /** @description Training Record Name */
      name: string;
      /** @description Student */
      studentId: number | string;
      /** @description Subject Count */
      subjectCount?: number | undefined;
      /** @description Total Score */
      totalScore?: number | undefined;
      /** @description Average Score */
      averageScore?: number | undefined;
      /**
       * Format: date-time
       * @description Training Time
       */
      trainingTime?: Date;
      /** @description Scene Photos */
      sceneImageIds?: (number | string)[] | undefined;
      /** @description Dossier Files */
      dossierFileIds?: (number | string)[] | undefined;
      /** @description Description */
      description?: string | undefined;
      /** @description Student Training Record Details */
      trainingRecordSubjects?:
        | {
            /**
             * @description Deleted
             * @default false
             */
            deleted?: boolean | undefined;
            /** @description ID */
            id?: number | string | undefined;
            /** @description Subject Name */
            name: string;
            /** @description Subject Score */
            score: number;
            /** @description Description */
            description?: string | undefined;
          }[]
        | undefined;
      _trainingRecordSubjects?:
        | components['schemas']['training-record.dto.detailRecordSubjectResItem'][]
        | undefined;
    };
    'training-student.dto.studentCreate': {
      /** @description Student Name */
      name: string;
      /** @description Description */
      description?: string | undefined;
      /** @description Mobile */
      mobile: string;
      /** @description Student Image */
      imageId?: number | string | undefined;
      /** @description Training Stage */
      level: 1 | 2 | 3;
      /** @description Student Training Records */
      trainingRecords?:
        | {
            /** @description Training Record Name */
            name: string;
            /** @description Subject Count */
            subjectCount?: number | undefined;
            /** @description Total Score */
            totalScore?: number | undefined;
            /** @description Average Score */
            averageScore?: number | undefined;
            /**
             * Format: date-time
             * @description Training Time
             */
            trainingTime?: Date;
            /** @description Scene Photos */
            sceneImageIds?: (number | string)[] | undefined;
            /** @description Dossier Files */
            dossierFileIds?: (number | string)[] | undefined;
            /** @description Description */
            description?: string | undefined;
            /** @description Student Training Record Details */
            trainingRecordSubjects?:
              | {
                  /**
                   * @description Deleted
                   * @default false
                   */
                  deleted?: boolean | undefined;
                  /** @description ID */
                  id?: number | string | undefined;
                  /** @description Subject Name */
                  name: string;
                  /** @description Subject Score */
                  score: number;
                  /** @description Description */
                  description?: string | undefined;
                }[]
              | undefined;
            sceneImages?:
              | {
                  id?: number | string | undefined;
                  url?: string | undefined;
                  filename?: string | undefined;
                  width?: number | undefined;
                  height?: number | undefined;
                  public?: boolean | undefined;
                  /** @default true */
                  signed?: boolean | undefined;
                }[]
              | undefined;
            /** @description Dossier Files */
            dossierFiles?:
              | {
                  id?: number | string | undefined;
                  filename?: string | undefined;
                  contentType?: string | undefined;
                  size?: number | undefined;
                  public?: boolean | undefined;
                  /** Format: date-time */
                  uploadedAt?: Date;
                  downloadUrl?: string | undefined;
                  /** @default true */
                  signed?: boolean | undefined;
                }[]
              | undefined;
            _trainingRecordSubjects?:
              | components['schemas']['training-record.dto.detailRecordSubjectResItem'][]
              | undefined;
          }[]
        | undefined;
      _trainingRecords?:
        | components['schemas']['training-student.dto.detailRecordResItem'][]
        | undefined;
    };
    'training-student.dto.detailRecordResItem': {
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /** @description ID */
      id: number | string;
      /** @description Training Record Name */
      name: string;
      /** @description Subject Count */
      subjectCount?: number | undefined;
      /** @description Total Score */
      totalScore?: number | undefined;
      /** @description Average Score */
      averageScore?: number | undefined;
      /**
       * Format: date-time
       * @description Training Time
       */
      trainingTime?: Date;
      /** @description Scene Photos */
      sceneImageIds?: (number | string)[] | undefined;
      /** @description Dossier Files */
      dossierFileIds?: (number | string)[] | undefined;
      /** @description Description */
      description?: string | undefined;
      /** @description Student Training Record Details */
      trainingRecordSubjects?: unknown;
      sceneImages?:
        | {
            id?: number | string | undefined;
            url?: string | undefined;
            filename?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
            public?: boolean | undefined;
            /** @default true */
            signed?: boolean | undefined;
          }[]
        | undefined;
      /** @description Dossier Files */
      dossierFiles?:
        | {
            id?: number | string | undefined;
            filename?: string | undefined;
            contentType?: string | undefined;
            size?: number | undefined;
            public?: boolean | undefined;
            /** Format: date-time */
            uploadedAt?: Date;
            downloadUrl?: string | undefined;
            /** @default true */
            signed?: boolean | undefined;
          }[]
        | undefined;
      /** @description # */
      _lineNumber: number;
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'training-student.dto.studentSelectRes': {
      list: components['schemas']['training-student.dto.studentSelectResItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'training-student.dto.studentSelectResItem': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      /** @description Student Name */
      name: string;
      /** @description Description */
      description?: string | undefined;
      /** @description Mobile */
      mobile: string;
      /** @description Student Image */
      imageId?: number | string | undefined;
      /** @description Training Stage */
      level: 1 | 2 | 3;
      image?: components['schemas']['a-image.dto.imageView_a83c3e638bca4b30ec8675860cdc52d66f6a16d1_2d063d28bc7243bed02ebd8bddf1212a93c6305b_efb37794d7c03c65122279f90d79919f009c34e5_1816ff740d81c738ec055c7038bbd93beb9405a7_537cd6552a384183a9457fb6a920bbae337277f6'];
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'a-image.dto.imageView_a83c3e638bca4b30ec8675860cdc52d66f6a16d1_2d063d28bc7243bed02ebd8bddf1212a93c6305b_efb37794d7c03c65122279f90d79919f009c34e5_1816ff740d81c738ec055c7038bbd93beb9405a7_537cd6552a384183a9457fb6a920bbae337277f6':
      | {
          id: number | string;
          url: string;
          filename?: string | undefined;
          width?: number | undefined;
          height?: number | undefined;
          public?: boolean | undefined;
          /** @default true */
          signed?: boolean;
        }
      | undefined;
    'training-student.dto.studentView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_4e7e5941f704425ce1be04de1885c36427ccc436':
      | {
          /**
           * Format: date-time
           * @description Created At
           */
          createdAt: Date;
          /**
           * Format: date-time
           * @description Updated At
           */
          updatedAt: Date;
          /**
           * @description Deleted
           * @default false
           */
          deleted?: boolean;
          /**
           * @description Instance ID
           * @default 0
           */
          iid?: number;
          /** @description ID */
          id: number | string;
          /** @description Student Name */
          name: string;
          /** @description Description */
          description?: string | undefined;
          /** @description Mobile */
          mobile: string;
          /** @description Student Image */
          imageId?: number | string | undefined;
          /** @description Training Stage */
          level: 1 | 2 | 3;
          /** @description Student Training Records */
          trainingRecords: {
            /**
             * @description Deleted
             * @default false
             */
            deleted?: boolean;
            /** @description ID */
            id: number | string;
            /** @description Training Record Name */
            name: string;
            /** @description Subject Count */
            subjectCount?: number | undefined;
            /** @description Total Score */
            totalScore?: number | undefined;
            /** @description Average Score */
            averageScore?: number | undefined;
            /**
             * Format: date-time
             * @description Training Time
             */
            trainingTime?: Date;
            /** @description Scene Photos */
            sceneImageIds?: (number | string)[] | undefined;
            /** @description Dossier Files */
            dossierFileIds?: (number | string)[] | undefined;
            /** @description Description */
            description?: string | undefined;
            /** @description Student Training Record Details */
            trainingRecordSubjects: {
              /**
               * @description Deleted
               * @default false
               */
              deleted?: boolean;
              /** @description ID */
              id: number | string;
              /** @description Subject Name */
              name: string;
              /** @description Subject Score */
              score: number;
              /** @description Description */
              description?: string | undefined;
            }[];
            sceneImages?:
              | {
                  id?: number | string | undefined;
                  url?: string | undefined;
                  filename?: string | undefined;
                  width?: number | undefined;
                  height?: number | undefined;
                  public?: boolean | undefined;
                  /** @default true */
                  signed?: boolean | undefined;
                }[]
              | undefined;
            /** @description Dossier Files */
            dossierFiles?:
              | {
                  id?: number | string | undefined;
                  filename?: string | undefined;
                  contentType?: string | undefined;
                  size?: number | undefined;
                  public?: boolean | undefined;
                  /** Format: date-time */
                  uploadedAt?: Date;
                  downloadUrl?: string | undefined;
                  /** @default true */
                  signed?: boolean | undefined;
                }[]
              | undefined;
            _trainingRecordSubjects?:
              | components['schemas']['training-record.dto.detailRecordSubjectResItem'][]
              | undefined;
          }[];
          image?: components['schemas']['a-image.dto.imageView_a83c3e638bca4b30ec8675860cdc52d66f6a16d1_2d063d28bc7243bed02ebd8bddf1212a93c6305b_efb37794d7c03c65122279f90d79919f009c34e5_1816ff740d81c738ec055c7038bbd93beb9405a7_537cd6552a384183a9457fb6a920bbae337277f6'];
          _trainingRecords?:
            | components['schemas']['training-student.dto.detailRecordResItem'][]
            | undefined;
        }
      | undefined;
    'training-student.dto.studentUpdate': {
      /** @description Student Name */
      name: string;
      /** @description Description */
      description?: string | undefined;
      /** @description Mobile */
      mobile: string;
      /** @description Student Image */
      imageId?: number | string | undefined;
      /** @description Training Stage */
      level: 1 | 2 | 3;
      /** @description Student Training Records */
      trainingRecords?:
        | {
            /**
             * @description Deleted
             * @default false
             */
            deleted?: boolean | undefined;
            /** @description ID */
            id?: number | string | undefined;
            /** @description Training Record Name */
            name: string;
            /** @description Subject Count */
            subjectCount?: number | undefined;
            /** @description Total Score */
            totalScore?: number | undefined;
            /** @description Average Score */
            averageScore?: number | undefined;
            /**
             * Format: date-time
             * @description Training Time
             */
            trainingTime?: Date;
            /** @description Scene Photos */
            sceneImageIds?: (number | string)[] | undefined;
            /** @description Dossier Files */
            dossierFileIds?: (number | string)[] | undefined;
            /** @description Description */
            description?: string | undefined;
            /** @description Student Training Record Details */
            trainingRecordSubjects?:
              | {
                  /**
                   * @description Deleted
                   * @default false
                   */
                  deleted?: boolean | undefined;
                  /** @description ID */
                  id?: number | string | undefined;
                  /** @description Subject Name */
                  name: string;
                  /** @description Subject Score */
                  score: number;
                  /** @description Description */
                  description?: string | undefined;
                }[]
              | undefined;
            sceneImages?:
              | {
                  id?: number | string | undefined;
                  url?: string | undefined;
                  filename?: string | undefined;
                  width?: number | undefined;
                  height?: number | undefined;
                  public?: boolean | undefined;
                  /** @default true */
                  signed?: boolean | undefined;
                }[]
              | undefined;
            /** @description Dossier Files */
            dossierFiles?:
              | {
                  id?: number | string | undefined;
                  filename?: string | undefined;
                  contentType?: string | undefined;
                  size?: number | undefined;
                  public?: boolean | undefined;
                  /** Format: date-time */
                  uploadedAt?: Date;
                  downloadUrl?: string | undefined;
                  /** @default true */
                  signed?: boolean | undefined;
                }[]
              | undefined;
            _trainingRecordSubjects?:
              | components['schemas']['training-record.dto.detailRecordSubjectResItem'][]
              | undefined;
          }[]
        | undefined;
      _trainingRecords?:
        | components['schemas']['training-student.dto.detailRecordResItem'][]
        | undefined;
    };
    'training-student.dto.studentSummary_2d063d28bc7243bed02ebd8bddf1212a93c6305b':
      | {
          id: number | string;
          /** @description Student Name */
          name: string;
          /** @description Mobile */
          mobile: string;
          /** @description Training Stage */
          level: number;
          /** @description Level Title */
          levelTitle: string;
          /** @description Description */
          description?: string | undefined;
          /** @description Description Length */
          descriptionLength: number;
          /** @description Summary */
          summaryText: string;
        }
      | undefined;
    'a-file.dto.fileUploadPolicyResponse': {
      fileScene: string;
      maxSize?: number | undefined;
      mimeTypes?: string[] | undefined;
      extensions?: string[] | undefined;
      multiple?: boolean | undefined;
      public?: boolean | undefined;
      directUpload: boolean;
    };
    'a-file.dto.fileUploadPolicyRequest': {
      fileScene: string;
    };
    'a-file.dto.fileUploadResponse': {
      id: number | string;
      filename?: string | undefined;
      contentType?: string | undefined;
      size?: number | undefined;
      public?: boolean | undefined;
      /** Format: date-time */
      uploadedAt?: Date;
      url?: string | undefined;
      signed?: boolean | undefined;
    };
    'a-file.dto.fileDirectUploadResponse': {
      id: number | string;
      uploadUrl: string;
      headers?:
        | {
            [key: string]: string;
          }
        | undefined;
      /** @enum {string|null} */
      method?: 'PUT' | 'POST' | null | undefined;
      filename?: string | undefined;
      public?: boolean | undefined;
    };
    'a-file.dto.fileDirectUploadRequest': {
      fileScene: string;
      filename?: string | undefined;
      size: number;
      mimeType: string;
      contentType?: string | undefined;
      expiry?: string | undefined;
    };
    'a-file.dto.fileDirectUploadFinalizeResponse': {
      id: number | string;
      filename?: string | undefined;
      contentType?: string | undefined;
      size?: number | undefined;
      public?: boolean | undefined;
      /** Format: date-time */
      uploadedAt?: Date;
      url?: string | undefined;
      signed?: boolean | undefined;
    };
    'a-file.dto.fileDirectUploadFinalizeRequest': {
      fileId: number | string;
    };
    'a-file.dto.fileUploadUrlRequest': {
      fileScene: string;
      /** Format: uri */
      url: string;
      size: number;
      mimeType: string;
      filename?: string | undefined;
      contentType?: string | undefined;
      objectKey?: string | undefined;
    };
    'a-image.dto.imageUploadPolicyResponse': {
      imageScene: string;
      maxSize?: number | undefined;
      mimeTypes?: string[] | undefined;
      extensions?: string[] | undefined;
      multiple?: boolean | undefined;
      public?: boolean | undefined;
      directUpload?: boolean | undefined;
    };
    'a-image.dto.imageUploadPolicyRequest': {
      imageScene: string;
    };
    'a-image.dto.imageUploadResponse': {
      id: number | string;
      filename?: string | undefined;
      contentType?: string | undefined;
      size?: number | undefined;
      width?: number | undefined;
      height?: number | undefined;
      public?: boolean | undefined;
      url?: string | undefined;
      signed?: boolean | undefined;
    };
    'a-image.dto.imageDirectUploadResponse': {
      id: number | string;
      uploadUrl: string;
      filename?: string | undefined;
      public?: boolean | undefined;
    };
    'a-image.dto.imageDirectUploadRequest': {
      imageScene: string;
      filename?: string | undefined;
      size: number;
      mimeType: string;
      contentType?: string | undefined;
      expiry?: string | undefined;
      customId?: string | undefined;
    };
    'a-image.dto.imageDirectUploadFinalizeResponse': {
      id: number | string;
      filename?: string | undefined;
      contentType?: string | undefined;
      size?: number | undefined;
      width?: number | undefined;
      height?: number | undefined;
      public?: boolean | undefined;
      url?: string | undefined;
      signed?: boolean | undefined;
    };
    'a-image.dto.imageDirectUploadFinalizeRequest': {
      imageId: number | string;
    };
    'a-image.dto.imageUploadUrlRequest': {
      imageScene: string;
      /** Format: uri */
      url: string;
      size: number;
      mimeType: string;
      filename?: string | undefined;
      contentType?: string | undefined;
    };
    'a-image.dto.imageTransformOptions_2d063d28bc7243bed02ebd8bddf1212a93c6305b':
      | {
          width?: number | undefined;
          height?: number | undefined;
          /** @enum {string|null} */
          fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad' | null | undefined;
          /** @enum {string|null} */
          gravity?: 'auto' | 'center' | 'top' | 'bottom' | 'left' | 'right' | null | undefined;
          background?: string | undefined;
          quality?: number | undefined;
          /** @enum {string|null} */
          format?: 'auto' | 'avif' | 'webp' | 'jpeg' | 'png' | null | undefined;
          dpr?: number | undefined;
          rotate?: number | undefined;
          sharpen?: number | undefined;
        }
      | undefined;
    'a-paypal.entity.paypalRecord': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      userId: number | string;
      /** @default 0 */
      status?: number;
      prepayId: string;
      payload: components['schemas']['a-paypal.dto.paypalOrderRecordPayload'];
      options: components['schemas']['a-paypal.dto.paypalOrderRecordOptions'];
    };
    'a-paypal.dto.paypalOrderRecordPayload': {
      remark: string;
      total: string;
      currencyCode: string;
    };
    'a-paypal.dto.paypalOrderRecordOptions': {
      brandName: string;
      returnUrl: string;
      cancelUrl: string;
      returnTo: string;
      scene: string;
      orderId: number | string;
    };
    'test-captcha.dto.signin': {
      username: string;
      password: string;
      captcha?: unknown;
    };
    /** @description Create Product */
    'test-rest.dto.productCreate': {
      /** @description Name */
      name: string;
      /** @description Description */
      description?: string | undefined;
      /** @description Price */
      price: number;
      /** @description Quantity */
      quantity: number;
      /** @description Amount */
      amount: number;
      /** @description Custom */
      _custom?: string | undefined;
      /** @description Test */
      _test?: string | undefined;
    };
    'test-rest.dto.productSelectRes': {
      list: components['schemas']['test-rest.dto.productSelectResItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'test-rest.dto.productSelectResItem': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      /** @description Name */
      name: string;
      /** @description Description */
      description?: string | undefined;
      /** @description Price */
      price: number;
      /** @description Quantity */
      quantity: number;
      /** @description Amount */
      amount: number;
      /** @description Custom */
      _custom?: string | undefined;
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'test-rest.dto.productView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875':
      | {
          /**
           * Format: date-time
           * @description Created At
           */
          createdAt: Date;
          /**
           * Format: date-time
           * @description Updated At
           */
          updatedAt: Date;
          /**
           * @description Deleted
           * @default false
           */
          deleted?: boolean;
          /**
           * @description Instance ID
           * @default 0
           */
          iid?: number;
          /** @description ID */
          id: number | string;
          /** @description Name */
          name: string;
          /** @description Description */
          description?: string | undefined;
          /** @description Price */
          price: number;
          /** @description Quantity */
          quantity: number;
          /** @description Amount */
          amount: number;
          /** @description Custom */
          _custom?: string | undefined;
        }
      | undefined;
    /** @description Update Product */
    'test-rest.dto.productUpdate': {
      /** @description Name */
      name: string;
      /** @description Description */
      description?: string | undefined;
      /** @description Price */
      price: number;
      /** @description Quantity */
      quantity: number;
      /** @description Amount */
      amount: number;
      /** @description Custom */
      _custom?: string | undefined;
    };
    'test-ssr.dto.testResult': {
      id: number | string;
      /**
       * @description Name
       * @default tom
       */
      name?: string;
      married: boolean;
      details: components['schemas']['test-ssr.dto.testDetail'][];
      /** @default custom */
      _custom1?: string | undefined;
      /** @default custom */
      _custom2?: string | undefined;
      /** @default custom */
      _custom5?: string | undefined;
      _customCopy?: string | undefined;
      _customCopied?: boolean | undefined;
    };
    'test-ssr.dto.testDetail': {
      name: string;
      price: number;
      quantity: number;
      amount: number;
    };
    'test-ssr.dto.testBody': {
      id: number | string;
      /**
       * @description Name
       * @default tom
       */
      name?: string;
      married: boolean;
      details: components['schemas']['test-ssr.dto.testDetail'][];
      /** @default custom */
      _custom1?: string | undefined;
      /** @default custom */
      _custom2?: string | undefined;
      /** @default custom */
      _custom5?: string | undefined;
      _customCopy?: string | undefined;
      _customCopied?: boolean | undefined;
    };
    'test-vona.dto.userLazy': {
      name: string;
      user?: components['schemas']['test-vona.dto.userLazy_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
      roles?: components['schemas']['test-vona.dto.roleLazy'][] | undefined;
    };
    'test-vona.dto.userLazy_2d063d28bc7243bed02ebd8bddf1212a93c6305b': {
      name: string;
      user?: components['schemas']['test-vona.dto.userLazy_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
      roles?: components['schemas']['test-vona.dto.roleLazy'][] | undefined;
    };
    'test-vona.dto.roleLazy': {
      name: string;
      users?: components['schemas']['test-vona.dto.userLazy'][] | undefined;
    };
    'test-vona.entity.user_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7_2d063d28bc7243bed02ebd8bddf1212a93c6305b': {
      /** @description ID */
      id: number | string;
      name: string;
    };
    'test-vona.entity.post_a6ba2076b5b70a3c098374cc82d418bd1ab226c3_2d063d28bc7243bed02ebd8bddf1212a93c6305b': {
      count_all?: string | undefined;
      count_title?: string | undefined;
      sum_stars?: string | undefined;
    };
    'test-vona.entity.post_729883d7de16ce4401b26f75bebe618c8948ff64': {
      /** @description Title */
      title: string;
      count_all?: string | undefined;
      count_title?: string | undefined;
      sum_stars?: string | undefined;
    };
    'test-vona.dto.userUpdate': {
      name: string;
      age?: number | undefined;
      scores?: number | undefined;
      posts?:
        | {
            /**
             * @description Deleted
             * @default false
             */
            deleted?: boolean | undefined;
            /** @description ID */
            id?: number | string | undefined;
            /** @description Title */
            title: string;
          }[]
        | undefined;
    };
    'test-vona.entity.category_2c7d642ee581efa300341e343180fbb0ecdc785d': {
      /** @description ID */
      id: number | string;
      name: string;
      children: components['schemas']['test-vona.entity.category_2c7d642ee581efa300341e343180fbb0ecdc785d'][];
    };
    'test-vona.dto.categoryTree': {
      /** @description ID */
      id: number | string;
      name: string;
      children: components['schemas']['test-vona.entity.category_2c7d642ee581efa300341e343180fbb0ecdc785d'][];
    };
    /** @description User */
    'test-vona.dto.user': {
      /** @description User ID */
      id: number | string;
      name: string;
      married: boolean;
    };
    'test-vona.dto.orderCreate': {
      /**
       * @description Order No
       * @default
       */
      orderNo?: string;
      /** @description Remark */
      remark?: string | undefined;
      products?:
        | components['schemas']['test-vona.entity.product_29731960f3f38d3572bc2f8a01a7498bfe927055'][]
        | undefined;
    };
    'test-vona.entity.product_29731960f3f38d3572bc2f8a01a7498bfe927055': {
      /** @description Name */
      name: string;
      /** @description Price */
      price: number;
      /** @description Quantity */
      quantity: number;
      /** @description Amount */
      amount: number;
    };
    'test-vona.dto.orderUpdate': {
      /**
       * @description Order No
       * @default
       */
      orderNo?: string;
      /** @description Remark */
      remark?: string | undefined;
      products?:
        | components['schemas']['test-vona.entity.product_9cf2c6bcd41713270c34bcfce21b7b4942e3fbc6'][]
        | undefined;
    };
    'test-vona.entity.product_9cf2c6bcd41713270c34bcfce21b7b4942e3fbc6': {
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean | undefined;
      /** @description ID */
      id?: number | string | undefined;
      /** @description Name */
      name: string;
      /** @description Price */
      price: number;
      /** @description Quantity */
      quantity: number;
      /** @description Amount */
      amount: number;
    };
    'test-vona.dto.orderSelectResItem': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      /**
       * @description Order No
       * @default
       */
      orderNo?: string;
      /** @description Remark */
      remark?: string | undefined;
      userId: number | string;
      user?: components['schemas']['test-vona.entity.user_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
      products: components['schemas']['test-vona.entity.product_bce173590aaef19772f1ae3a82196493c2633e2e'][];
    };
    'test-vona.entity.product_bce173590aaef19772f1ae3a82196493c2633e2e': {
      /** @description ID */
      id: number | string;
      /** @description Name */
      name: string;
      /** @description Price */
      price: number;
      /** @description Quantity */
      quantity: number;
      /** @description Amount */
      amount: number;
    };
    'test-vona.dto.orderSelectRes': {
      list: components['schemas']['test-vona.dto.orderSelectResItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'test-vona.dto.postGroup': {
      userId: number | string;
      count_all?: string | undefined;
      sum_stars?: string | undefined;
    };
    'test-vona.dto.postAggregate': {
      count_all?: string | undefined;
      count_stars?: string | undefined;
      sum_stars?: string | undefined;
      avg_stars?: string | undefined;
      min_stars?: string | undefined;
      max_stars?: string | undefined;
    };
    'test-vona.dto.postSelectRes': {
      list: components['schemas']['test-vona.dto.postSelectResItem'][];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'test-vona.dto.postSelectResItem': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number;
      /** @description ID */
      id: number | string;
      /** @description Title */
      title: string;
      userId: number | string;
      stars?: number | undefined;
      postContent?: {
        /** @description ID */
        id: number | string;
        content: string;
      };
      user?: components['schemas']['test-vona.entity.user_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'test-vona.dto.serializerSimple': {
      password: string;
      password2: string;
      email: string;
      /** Format: email */
      email2: string;
      /** Format: email */
      email3: string;
      email4: string;
      /** Format: email */
      email5: string;
      /** Format: email */
      email6: string;
      /** Format: email */
      email7: string;
      firstName: string;
      lastName: string;
      fullName?: string | undefined;
      fullName2?: string | undefined;
      fullName3?: string | undefined;
      fullName4?: string | undefined;
    };
    'test-vona.dto.serializerArray': {
      /** @description Simple */
      simples: components['schemas']['test-vona.dto.serializerSimple'][];
      /** @description Simple */
      simplesLazy: components['schemas']['test-vona.dto.serializerSimple'][];
    };
    'test-vona.dto.serializerLazy': {
      simple: components['schemas']['test-vona.dto.serializerSimple_1c4b95bcfe8fe28a56dbcc7028097cf11836b4fc'];
      simpleLazy?: components['schemas']['test-vona.dto.serializerSimple_542f7be0da9b85a67248a6a1a3629e72de5fdb33_0544b269faee0bd5cd6c610dee78c5be0d490831'];
    };
    'test-vona.dto.serializerSimple_1c4b95bcfe8fe28a56dbcc7028097cf11836b4fc': {
      password: string;
      password2: string;
      email: string;
      /** Format: email */
      email2: string;
      /** Format: email */
      email3: string;
      email4: string;
      /** Format: email */
      email5: string;
      /** Format: email */
      email6: string;
      /** Format: email */
      email7: string;
      firstName: string;
      lastName: string;
      fullName?: string | undefined;
      fullName2?: string | undefined;
      fullName3?: string | undefined;
      fullName4?: string | undefined;
    };
    /**
     * title
     * @description description
     */
    'test-vona.dto.serializerSimple_542f7be0da9b85a67248a6a1a3629e72de5fdb33_0544b269faee0bd5cd6c610dee78c5be0d490831': {
      password: string;
      password2: string;
      email: string;
      /** Format: email */
      email2: string;
      /** Format: email */
      email3: string;
      email4: string;
      /** Format: email */
      email5: string;
      /** Format: email */
      email6: string;
      /** Format: email */
      email7: string;
      firstName: string;
      lastName: string;
      fullName?: string | undefined;
      fullName2?: string | undefined;
      fullName3?: string | undefined;
      fullName4?: string | undefined;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  AuthMock_authorize: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  AuthMock_authorizePost: {
    parameters: {
      query: {
        redirect_uri: string;
        state: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          username: string;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  Captcha_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          scene: string;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-captcha.dto.captchaData'];
          };
        };
      };
    };
  };
  Captcha_refresh: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          id: string;
          scene: string;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-captcha.dto.captchaData'];
          };
        };
      };
    };
  };
  Captcha_verifyImmediate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          id: string;
          token?: unknown;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: string;
          };
        };
      };
    };
  };
  MailconfirmMail_emailConfirmCallback: {
    parameters: {
      query: {
        token: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  MailconfirmMail_passwordResetCallback: {
    parameters: {
      query: {
        token: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  CommerceMemberAddress_mine: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-member.dto.addressMineRes'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceMemberAddress_viewMine: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['commerce-member.dto.addressMineView_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceMemberAddress_createMine: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-member.dto.addressMineCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: number | string;
          };
        };
      };
    };
    authToken: true;
  };
  CommerceMemberAddress_updateMine: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-member.dto.addressMineUpdate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  CommerceMemberAddress_deleteMine: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  CommerceMemberAddress_select: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
        recipientName?: string | undefined;
        phone?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-member.dto.addressSelectRes'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceMemberAddress_view: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['commerce-member.dto.addressView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875'];
          };
        };
      };
    };
    authToken: true;
  };
  HomeUserPassport_current: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['home-user.dto.passport_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
          };
        };
      };
    };
  };
  HomeUserPassport_logout: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  HomeUserPassport_register: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['home-user.dto.register'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['home-user.dto.passportJwt'];
          };
        };
      };
    };
  };
  HomeUserPassport_login: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['home-user.dto.login'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['home-user.dto.passportJwt'];
          };
        };
      };
    };
  };
  HomeUserPassport_loginOauth: {
    parameters: {
      query?: {
        redirect?: string | undefined;
      };
      header?: never;
      path: {
        module: string;
        providerName: string;
        clientName: ((string | undefined) | undefined) | undefined;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  HomeUserPassport_associate: {
    parameters: {
      query?: {
        redirect?: string | undefined;
      };
      header?: never;
      path: {
        module: string;
        providerName: string;
        clientName: ((string | undefined) | undefined) | undefined;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['home-user.dto.passportJwt'];
          };
        };
      };
    };
    authToken: true;
  };
  HomeUserPassport_migrate: {
    parameters: {
      query?: {
        redirect?: string | undefined;
      };
      header?: never;
      path: {
        module: string;
        providerName: string;
        clientName: ((string | undefined) | undefined) | undefined;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['home-user.dto.passportJwt'];
          };
        };
      };
    };
    authToken: true;
  };
  HomeUserPassport_refreshAuthToken: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          refreshToken: string;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-jwt.dto.jwtToken'];
          };
        };
      };
    };
  };
  HomeUserPassport_createPassportJwtFromOauthCode: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          code: string;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['home-user.dto.passportJwt'];
          };
        };
      };
    };
  };
  HomeUserPassport_createTempAuthToken: {
    parameters: {
      query?: {
        path?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: string;
          };
        };
      };
    };
    authToken: true;
  };
  CommerceSiteadminOperator_context: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-siteadmin.dto.operatorContext'];
          };
        };
      };
    };
    authToken: true;
  };
  CommercePromotionCoupon_mine: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-promotion.dto.couponMineItem'][];
          };
        };
      };
    };
    authToken: true;
  };
  CommercePromotionCoupon_issue: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-promotion.dto.couponIssue'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: number | string;
          };
        };
      };
    };
    authToken: true;
  };
  CommercePromotionCouponTemplate_select: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
        name?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-promotion.dto.couponTemplateSelectRes'];
          };
        };
      };
    };
    authToken: true;
  };
  CommercePromotionCouponTemplate_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-promotion.dto.couponTemplateCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: number | string;
          };
        };
      };
    };
    authToken: true;
  };
  CommercePromotionCouponTemplate_view: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['commerce-promotion.dto.couponTemplateView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875'];
          };
        };
      };
    };
    authToken: true;
  };
  CommercePromotionCouponTemplate_delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  CommercePromotionCouponTemplate_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-promotion.dto.couponTemplateUpdate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradeCart_current: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-trade.dto.cartView'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradeCart_addItem: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-trade.dto.cartAddItem'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-trade.dto.cartView'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradeCart_clear: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-trade.dto.cartView'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradeCart_deleteItem: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-trade.dto.cartView'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradeCart_updateItem: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-trade.dto.cartUpdateItem'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-trade.dto.cartView'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradeCheckout_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-trade.dto.checkoutCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-trade.dto.checkoutResult'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradeOrder_mine: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
        state?:
          | 'awaiting_payment'
          | 'paid'
          | 'shipped'
          | 'cancelled'
          | 'expired'
          | null
          | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-trade.dto.orderMineRes'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradeOrder_viewMine: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['commerce-trade.dto.orderDetail_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradeOrder_requestRefund: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-trade.dto.refundRequestCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-trade.dto.refundResult'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradeOrder_approveRefund: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-trade.dto.refundReview'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-trade.dto.refundResult'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradeOrder_rejectRefund: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-trade.dto.refundReview'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-trade.dto.refundResult'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradeOrder_refundOutcome: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-trade.dto.refundOutcomeCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-trade.dto.refundResult'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradeOrder_ship: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-trade.dto.orderShip'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-trade.dto.shipmentView'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradeOrder_select: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
        state?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-trade.dto.orderSelectRes'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradeOrder_view: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['commerce-trade.dto.orderView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradePayment_outcome: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        attemptId: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-trade.dto.paymentOutcomeCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-trade.dto.paymentOutcomeResult'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradeStockAudit_select: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
        skuId?: number | string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-trade.dto.stockAuditSelectRes'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradeStockAudit_view: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['commerce-trade.dto.stockAuditView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradeStockBalance_adjustStock: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-trade.dto.stockAdjust_0aab216abd3467dd07f61c69172266c2441af477'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-trade.entity.stockBalance'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradeStockBalance_select: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
        skuId?: number | string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-trade.dto.stockBalanceSelectRes'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceTradeStockBalance_view: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['commerce-trade.dto.stockBalanceView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceCatalogCategory_select: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
        name?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-catalog.dto.categorySelectRes'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceCatalogCategory_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-catalog.dto.categoryCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: number | string;
          };
        };
      };
    };
    authToken: true;
  };
  CommerceCatalogCategory_view: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['commerce-catalog.dto.categoryView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceCatalogCategory_delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  CommerceCatalogCategory_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-catalog.dto.categoryUpdate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  CommerceCatalogProduct_select: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
        title?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-catalog.dto.productSelectRes'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceCatalogProduct_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-catalog.dto.productCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: number | string;
          };
        };
      };
    };
    authToken: true;
  };
  CommerceCatalogProduct_selectPublic: {
    parameters: {
      query?: {
        pageNo?: number;
        pageSize?: number;
        categoryId?: number | string | undefined;
        title?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-catalog.dto.productPublicSelectRes'];
          };
        };
      };
    };
  };
  CommerceCatalogProduct_viewPublic: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['commerce-catalog.dto.productPublic_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
          };
        };
      };
    };
  };
  CommerceCatalogProduct_view: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['commerce-catalog.dto.productView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceCatalogProduct_delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  CommerceCatalogProduct_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-catalog.dto.productUpdate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  CommerceCatalogSku_select: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
        code?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['commerce-catalog.dto.skuSelectRes'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceCatalogSku_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-catalog.dto.skuCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: number | string;
          };
        };
      };
    };
    authToken: true;
  };
  CommerceCatalogSku_view: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['commerce-catalog.dto.skuView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875'];
          };
        };
      };
    };
    authToken: true;
  };
  CommerceCatalogSku_delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  CommerceCatalogSku_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['commerce-catalog.dto.skuUpdate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  HomeBaseMenu_retrieveMenus: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        publicPath: ((string | undefined) | undefined) | undefined;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-menu.dto.menus'];
          };
        };
      };
    };
  };
  HomeBasePermission_retrievePermissions: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        resource: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-permission.dto.permissions'];
          };
        };
      };
    };
    authToken: true;
  };
  Home_index: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  TrainingRecord_select: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
        name?: string | undefined;
        studentId?: number | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['training-record.dto.recordSelectRes'];
          };
        };
      };
    };
    authToken: true;
  };
  TrainingRecord_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['training-record.dto.recordCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: number | string;
          };
        };
      };
    };
    authToken: true;
  };
  TrainingRecord_view: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['training-record.dto.recordView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875'];
          };
        };
      };
    };
    authToken: true;
  };
  TrainingRecord_delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  TrainingRecord_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['training-record.dto.recordUpdate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  TrainingStudent_select: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
        name?: string | undefined;
        level?: number | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['training-student.dto.studentSelectRes'];
          };
        };
      };
    };
    authToken: true;
  };
  TrainingStudent_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['training-student.dto.studentCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: number | string;
          };
        };
      };
    };
    authToken: true;
  };
  TrainingStudent_view: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['training-student.dto.studentView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_4e7e5941f704425ce1be04de1885c36427ccc436'];
          };
        };
      };
    };
    authToken: true;
  };
  TrainingStudent_delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  TrainingStudent_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['training-student.dto.studentUpdate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  TrainingStudent_summary: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['training-student.dto.studentSummary_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
          };
        };
      };
    };
    authToken: true;
  };
  TrainingStudent_deleteForce: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  File_getUploadPolicy: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-file.dto.fileUploadPolicyRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-file.dto.fileUploadPolicyResponse'];
          };
        };
      };
    };
    authToken: true;
  };
  File_upload: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'multipart/form-data': {
          fileScene: string;
          /** Format: binary */
          file: Blob;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-file.dto.fileUploadResponse'];
          };
        };
      };
    };
    authToken: true;
  };
  File_createDirectUpload: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-file.dto.fileDirectUploadRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-file.dto.fileDirectUploadResponse'];
          };
        };
      };
    };
    authToken: true;
  };
  File_finalizeDirectUpload: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-file.dto.fileDirectUploadFinalizeRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-file.dto.fileDirectUploadFinalizeResponse'];
          };
        };
      };
    };
    authToken: true;
  };
  File_uploadUrl: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-file.dto.fileUploadUrlRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-file.dto.fileUploadResponse'];
          };
        };
      };
    };
    authToken: true;
  };
  File_download: {
    parameters: {
      query: {
        fileId: number | string;
        token?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  Image_getUploadPolicy: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-image.dto.imageUploadPolicyRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-image.dto.imageUploadPolicyResponse'];
          };
        };
      };
    };
    authToken: true;
  };
  Image_upload: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'multipart/form-data': {
          imageScene: string;
          /** Format: binary */
          image: Blob;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-image.dto.imageUploadResponse'];
          };
        };
      };
    };
    authToken: true;
  };
  Image_createDirectUpload: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-image.dto.imageDirectUploadRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-image.dto.imageDirectUploadResponse'];
          };
        };
      };
    };
    authToken: true;
  };
  Image_finalizeDirectUpload: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-image.dto.imageDirectUploadFinalizeRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-image.dto.imageDirectUploadFinalizeResponse'];
          };
        };
      };
    };
    authToken: true;
  };
  Image_uploadUrl: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-image.dto.imageUploadUrlRequest'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-image.dto.imageUploadResponse'];
          };
        };
      };
    };
    authToken: true;
  };
  Image_delivery: {
    parameters: {
      query: {
        imageId: number | string;
        variantName?: string | undefined;
        transformOptions?: components['schemas']['a-image.dto.imageTransformOptions_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
        token?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  Paypal_getRecord: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        recordId: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-paypal.entity.paypalRecord'];
          };
        };
      };
    };
    authToken: true;
  };
  Paypal_captureOrder: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        recordId: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  Paypal_cancelOrder: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        recordId: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestAuthPassport_isAuthenticated: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: boolean;
          };
        };
      };
    };
    authToken: true;
  };
  TestAuthPassport_current: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestCaptcha_signin: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-captcha.dto.signin'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  TestRestProduct_select: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
        name?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-rest.dto.productSelectRes'];
          };
        };
      };
    };
    authToken: true;
  };
  TestRestProduct_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-rest.dto.productCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: number | string;
          };
        };
      };
    };
    authToken: true;
  };
  TestRestProduct_view: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['test-rest.dto.productView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875'];
          };
        };
      };
    };
    authToken: true;
  };
  TestRestProduct_delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  TestRestProduct_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-rest.dto.productUpdate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: undefined;
          };
        };
      };
    };
    authToken: true;
  };
  TestSsrToolMinimal_test: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  TestSsrToolOne_testGet: {
    parameters: {
      query: {
        name: string;
      };
      header?: never;
      path: {
        id: ((number | undefined) | (string | undefined) | (undefined | undefined)) | undefined;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestSsrToolOne_test: {
    parameters: {
      query: {
        name: string;
      };
      header?: never;
      path: {
        id: ((number | undefined) | (string | undefined) | (undefined | undefined)) | undefined;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-ssr.dto.testBody'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-ssr.dto.testResult'];
          };
        };
      };
    };
    authToken: true;
  };
  TestSsrToolTwo_test: {
    parameters: {
      query: {
        name: string;
      };
      header?: never;
      path: {
        id: ((number | undefined) | (string | undefined) | (undefined | undefined)) | undefined;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-ssr.dto.testResult'];
          };
        };
      };
    };
  };
  TestVonaDtoTest_getUserLazy: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.userLazy'];
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaDtoTest_getPostDynamic: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: {
              /**
               * Created At
               * Format: date-time
               */
              createdAt: Date;
              /**
               * Updated At
               * Format: date-time
               */
              updatedAt: Date;
              /**
               * Deleted
               * @default false
               */
              deleted?: boolean;
              /**
               * Instance ID
               * @default 0
               */
              iid?: number;
              /** ID */
              id: number | string;
              /** Title */
              title: string;
              userId: number | string;
              stars?: number | undefined;
              user?: components['schemas']['test-vona.entity.user_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
            };
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaDtoTest_getUserStats: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: {
              /**
               * Created At
               * Format: date-time
               */
              createdAt: Date;
              /**
               * Updated At
               * Format: date-time
               */
              updatedAt: Date;
              /**
               * Deleted
               * @default false
               */
              deleted?: boolean;
              /**
               * Instance ID
               * @default 0
               */
              iid?: number;
              /** ID */
              id: number | string;
              name: string;
              age?: number | undefined;
              scores?: number | undefined;
              posts?: components['schemas']['test-vona.entity.post_a6ba2076b5b70a3c098374cc82d418bd1ab226c3_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
            };
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaDtoTest_getUserStatsGroup: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: {
              /**
               * Created At
               * Format: date-time
               */
              createdAt: Date;
              /**
               * Updated At
               * Format: date-time
               */
              updatedAt: Date;
              /**
               * Deleted
               * @default false
               */
              deleted?: boolean;
              /**
               * Instance ID
               * @default 0
               */
              iid?: number;
              /** ID */
              id: number | string;
              name: string;
              age?: number | undefined;
              scores?: number | undefined;
              posts: components['schemas']['test-vona.entity.post_729883d7de16ce4401b26f75bebe618c8948ff64'][];
            };
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaDtoTest_createUser: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-vona.dto.userCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaDtoTest_updateUser: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: unknown;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-vona.dto.userUpdate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaDtoTest_getCategoryTree: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: {
              /** ID */
              id: number | string;
              name: string;
              children: components['schemas']['test-vona.entity.category_2c7d642ee581efa300341e343180fbb0ecdc785d'][];
            }[];
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaDtoTest_getCategoryTree2: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.categoryTree'][];
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaGuardPassport_testRoleName: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaGuardPassport_testRoleNameFail: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaGuardPassport_testRoleNameControllerShouldNotExecute: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaGuardPassport_testPublic: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  TestVonaGuardPassport_testActivatedFalse: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  Onion_index: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  Onion_echo: {
    parameters: {
      query?: {
        id?: number;
        name?: number | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          /** @description User ID */
          id: number;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: string | undefined;
          };
        };
      };
    };
  };
  Onion_echo2: {
    parameters: {
      query: {
        id: number | string;
        name: string;
        married: boolean;
      };
      header?: never;
      path: {
        userId: number;
        userName: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          /** @description User ID */
          id: number;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.user'];
          };
        };
      };
    };
  };
  Onion_echo3: {
    parameters: {
      query?: {
        id?: number | undefined;
      };
      header: {
        Accept: string;
      };
      path: {
        userId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  Onion_echo4: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: {
      content: {
        'application/json': components['schemas']['test-vona.dto.user'][] | undefined;
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.user'][];
          };
        };
      };
    };
  };
  Onion_echo5: {
    parameters: {
      query?: {
        ids?: number[];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  Onion_echo6: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  Onion_echo7: {
    parameters: {
      query?: {
        age?: number | undefined;
        nullableAge?: number | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  TestVonaOrder_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-vona.dto.orderCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: number | string;
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaOrder_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: unknown;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-vona.dto.orderUpdate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaOrder_findAll: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        orderNo?: string | undefined;
        remark?: string | undefined;
        userName?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.orderSelectResItem'][];
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaOrder_findMany: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        orderNo?: string | undefined;
        remark?: string | undefined;
        pageSize?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.orderSelectRes'];
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaPost_group: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.postGroup'][];
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaPost_aggregate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.postAggregate'];
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaPost_findManyEcho: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
        title?: string | undefined;
        userName?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.postSelectRes'];
          };
        };
      };
    };
  };
  TestVonaPost_findMany: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?:
          | {
              [key: string]: unknown;
            }
          | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
        title?: string | undefined;
        userName?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.postSelectRes'];
          };
        };
      };
    };
  };
  TestVonaSerializer_echoSimple: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-vona.dto.serializerSimple'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.serializerSimple'];
          };
        };
      };
    };
  };
  TestVonaSerializer_echoArray: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-vona.dto.serializerArray'][];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.serializerArray'][];
          };
        };
      };
    };
  };
  TestVonaSerializer_echoLazy: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-vona.dto.serializerLazy'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.serializerLazy'];
          };
        };
      };
    };
  };
  TestVonaUpload_fields: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'multipart/form-data': {
          checkes: string[];
          /**
           * your name
           * @default zhennann
           */
          name?: string;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  TestVonaUpload_file: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'multipart/form-data': {
          /** @default zhennann */
          name?: string;
          /** Format: binary */
          welcome: Blob;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  TestVonaUpload_strict: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'multipart/form-data': {
          name: string;
          /** Format: binary */
          welcome: Blob;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  TestVonaUpload_files: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'multipart/form-data': {
          /** images */
          images: Blob[];
          /**
           * single file
           * Format: binary
           */
          welcome1: Blob;
          /** Format: binary */
          welcome2: Blob;
          /** more files */
          blobs: Blob[];
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
}
