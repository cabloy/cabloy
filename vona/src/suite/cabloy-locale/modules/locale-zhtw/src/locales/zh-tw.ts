import aAuth from '../lib/locales/a-auth.ts';
import aCaptcha from '../lib/locales/a-captcha.ts';
import aInstance from '../lib/locales/a-instance.ts';
import aOpenapiutils from '../lib/locales/a-openapiutils.ts';
import aOrm from '../lib/locales/a-orm.ts';
import aRbac from '../lib/locales/a-rbac.ts';
import aUser from '../lib/locales/a-user.ts';
import aValidation from '../lib/locales/a-validation.ts';
import aVersion from '../lib/locales/a-version.ts';
import basicSiteadmin from '../lib/locales/basic-siteadmin.ts';
import basicSiteweb from '../lib/locales/basic-siteweb.ts';
import commerceCatalog from '../lib/locales/commerce-catalog.ts';
import commerceMember from '../lib/locales/commerce-member.ts';
import commercePromotion from '../lib/locales/commerce-promotion.ts';
import commerceSiteadmin from '../lib/locales/commerce-siteadmin.ts';
import commerceSiteweb from '../lib/locales/commerce-siteweb.ts';
import commerceTrade from '../lib/locales/commerce-trade.ts';
import core from '../lib/locales/core.ts';
import demoBasic from '../lib/locales/demo-basic.ts';
import demoDemonstration from '../lib/locales/demo-demonstration.ts';
import homeBase from '../lib/locales/home-base.ts';
import homeIndex from '../lib/locales/home-index.ts';
import homeUser from '../lib/locales/home-user.ts';
import testRest from '../lib/locales/test-rest.ts';
import testSsr from '../lib/locales/test-ssr.ts';
import testVona from '../lib/locales/test-vona.ts';
import trainingRecord from '../lib/locales/training-record.ts';
import trainingRecordsubject from '../lib/locales/training-recordsubject.ts';
import trainingStudent from '../lib/locales/training-student.ts';

export default {
  ...core,
  modules: {
    'a-auth': aAuth,
    'a-captcha': aCaptcha,
    'a-instance': aInstance,
    'a-openapiutils': aOpenapiutils,
    'a-orm': aOrm,
    'a-rbac': aRbac,
    'a-user': aUser,
    'a-validation': aValidation,
    'a-version': aVersion,
    'basic-siteadmin': basicSiteadmin,
    'basic-siteweb': basicSiteweb,
    'commerce-catalog': commerceCatalog,
    'commerce-member': commerceMember,
    'commerce-promotion': commercePromotion,
    'commerce-siteadmin': commerceSiteadmin,
    'commerce-siteweb': commerceSiteweb,
    'commerce-trade': commerceTrade,
    'demo-basic': demoBasic,
    'demo-demonstration': demoDemonstration,
    'home-base': homeBase,
    'home-index': homeIndex,
    'home-user': homeUser,
    'test-rest': testRest,
    'test-ssr': testSsr,
    'test-vona': testVona,
    'training-record': trainingRecord,
    'training-recordsubject': trainingRecordsubject,
    'training-student': trainingStudent,
  },
};
