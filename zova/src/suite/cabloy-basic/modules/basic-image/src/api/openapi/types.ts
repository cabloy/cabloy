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
  '/api/image/upload-token': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Image_createUploadToken'];
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
  '/api/image/delivery/{imageId}': {
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
  '/api/test/vona/guardPassport/testUserName': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaGuardPassport_testUserName'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/guardPassport/testUserNameFail': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaGuardPassport_testUserNameFail'];
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
      /** @description Description */
      description?: string | undefined;
      sceneImages?: components['schemas']['a-image.dto.imageView'][] | undefined;
      /** @description Operations */
      _operationsRow?: unknown;
    };
    'a-image.dto.imageView': {
      id: number | string;
      url: string;
      filename?: string | undefined;
      width?: number | undefined;
      height?: number | undefined;
      provider: string;
      clientName: string;
      imageScene?: unknown;
      /** Format: date-time */
      uploadedAt?: Date;
      variants?:
        | {
            [key: string]: components['schemas']['a-image.dto.imageTransformOptions'];
          }
        | undefined;
    };
    'a-image.dto.imageTransformOptions': {
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
                  provider?: string | undefined;
                  clientName?: string | undefined;
                  imageScene?: unknown;
                  /** Format: date-time */
                  uploadedAt?: Date;
                  variants?:
                    | {
                        [key: string]: components['schemas']['a-image.dto.imageTransformOptions'];
                      }
                    | undefined;
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
            provider?: string | undefined;
            clientName?: string | undefined;
            imageScene?: unknown;
            /** Format: date-time */
            uploadedAt?: Date;
            variants?:
              | {
                  [key: string]: components['schemas']['a-image.dto.imageTransformOptions'];
                }
              | undefined;
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
          provider: string;
          clientName: string;
          imageScene?: unknown;
          /** Format: date-time */
          uploadedAt?: Date;
          variants?:
            | {
                [key: string]: components['schemas']['a-image.dto.imageTransformOptions'];
              }
            | undefined;
        }
      | undefined;
    'training-student.dto.studentView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875':
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
                  provider?: string | undefined;
                  clientName?: string | undefined;
                  imageScene?: unknown;
                  /** Format: date-time */
                  uploadedAt?: Date;
                  variants?:
                    | {
                        [key: string]: components['schemas']['a-image.dto.imageTransformOptions'];
                      }
                    | undefined;
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
                  provider?: string | undefined;
                  clientName?: string | undefined;
                  imageScene?: unknown;
                  /** Format: date-time */
                  uploadedAt?: Date;
                  variants?:
                    | {
                        [key: string]: components['schemas']['a-image.dto.imageTransformOptions'];
                      }
                    | undefined;
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
    'a-image.dto.imageUploadTokenResponse': {
      token: string;
      expiresIn?: number | undefined;
    };
    'a-image.dto.imageUploadTokenRequest': {
      imageScene: string;
      size: number;
      mimeType: string;
      expiresIn?: number | undefined;
    };
    'a-image.dto.imageUploadResponse': {
      id: number | string;
      provider: string;
      clientName: string;
      resourceId: string;
      filename?: string | undefined;
      contentType?: string | undefined;
      size?: number | undefined;
      width?: number | undefined;
      height?: number | undefined;
      requireSignedURLs?: boolean | undefined;
      variants?:
        | {
            [key: string]: components['schemas']['a-image.dto.imageTransformOptions'];
          }
        | undefined;
      imageScene?: string | undefined;
      /** Format: date-time */
      uploadedAt?: Date;
      url?: string | undefined;
      signed?: boolean | undefined;
    };
    'a-image.dto.imageDirectUploadResponse': {
      id: number | string;
      provider: string;
      clientName: string;
      resourceId: string;
      uploadUrl: string;
      draft?: boolean | undefined;
      filename?: string | undefined;
      imageScene?: string | undefined;
    };
    'a-image.dto.imageDirectUploadRequest': {
      imageScene: string;
      filename?: string | undefined;
      size: number;
      mimeType: string;
      contentType?: string | undefined;
      requireSignedURLs?: boolean | undefined;
      expiry?: string | undefined;
      customId?: string | undefined;
    };
    'a-image.dto.imageUploadUrlRequest': {
      imageScene: string;
      /** Format: uri */
      url: string;
      size: number;
      mimeType: string;
      filename?: string | undefined;
      contentType?: string | undefined;
      requireSignedURLs?: boolean | undefined;
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
            data?: unknown;
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
            data?: unknown;
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
            data?: components['schemas']['training-student.dto.studentView_2d063d28bc7243bed02ebd8bddf1212a93c6305b_425dbecccd52e19e24888f99e1b1670233afa875'];
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
            data?: unknown;
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
            data?: unknown;
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
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  Image_createUploadToken: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-image.dto.imageUploadTokenRequest'];
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
            data: components['schemas']['a-image.dto.imageUploadTokenResponse'];
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
          token: string;
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
      query?: {
        variantName?: string | undefined;
        transformOptions?: components['schemas']['a-image.dto.imageTransformOptions_2d063d28bc7243bed02ebd8bddf1212a93c6305b'];
        token?: string | undefined;
      };
      header?: never;
      path: {
        imageId: number | string;
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
            data?: unknown;
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
            data?: unknown;
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
  TestVonaGuardPassport_testUserName: {
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
  TestVonaGuardPassport_testUserNameFail: {
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
