const URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost';
const PORT = process.env.NEXT_PUBLIC_PORT || '3000';
const VERSION = process.env.NEXT_PUBLIC_VERSION || 'v1';

const isServer = typeof window === 'undefined';

export default {
    // BASE_URL : `${URL}:${PORT}/${VERSION}`,
    // BASE_URL : `/api/v1`,
    BASE_URL: isServer ? `${URL}:${PORT}/api/${VERSION}` : `/api/v1`, // Absolute URL for server, relative for client

    //────────────────────────────────────────────
    //? API: ---- Auth
    //────────────────────────────────────────────
    MEMBER_LOGIN: '/auth/login',
    ADMIN_LOGIN: '/auth/admin/login',
    SUPER_ADMIN_LOGIN: '/auth/super-admin/login',

    REFRESH_TOKEN: '/auth/refresh-token',

    //────────────────────────────────────────────
    //? API: ---- Contact
    //────────────────────────────────────────────
    CONTACT: '/contact',

    //────────────────────────────────────────────
    //? API: ---- Setting
    //────────────────────────────────────────────
    GET_GENERAL_INFO: '/settings/general',
    CREATE_GENERAL_INFO: '/admin/settings/general',

    GET_LEGAL_DOCUMENT: '/settings/legal/document',
    LEGAL_DOCUMENT: '/admin/settings/legal/document',

    //────────────────────────────────────────────
    //? API: ---- About
    //────────────────────────────────────────────
    GET_ABOUT_MISSION: '/about/about/mission',
    ABOUT_MISSION: '/admin/about/about/mission',

    GET_ABOUT_VISION: '/about/about/vision',
    ABOUT_VISION: '/admin/about/about/vision',

    GET_ABOUT_AIM_OBJECTIVE: '/about/about/aim-objective',
    ABOUT_AIM_OBJECTIVE: '/admin/about/about/aim-objective',

    //────────────────────────────────────────────
    //? API: ---- Membership
    //────────────────────────────────────────────
    GET_ABOUT_MEMBERSHIP: '/about/membership/about-membership',
    ABOUT_MEMBERSHIP: '/admin/about/membership/about-membership',

    GET_MEMBERSHIP_CRITERIA: 'about//membership/membership-criteria',
    MEMBERSHIP_CRITERIA: '/admin/about/membership/membership-criteria',

    GET_MEMBERSHIP_FEE: 'about//membership/membership-fee',
    MEMBERSHIP_FEE: '/admin/about/membership/membership-fee',
    //────────────────────────────────────────────
    //? API: ---- Member
    //────────────────────────────────────────────
    GET_MEMBER_LIST: '/member',
    GET_MEMBER_BY_ID: '/member/',
    GET_MEMBER_PROFILE: '/member/profile',
    CREATE_MEMBER: '/admin/member',
    UPDATE_MEMBER: '/admin/member/',
    DELETE_MEMBER: '/admin/member/',

    GET_MEMBER_TYPE: '/type/member',
    GET_MEMBER_STATUS: '/status/member',

    GET_MEMBER_COUNT: '/member/count',

    //────────────────────────────────────────────
    //? API: ---- Team
    //────────────────────────────────────────────
    GET_TEAM_LIST: '/team/executive',
    GET_TEAM_BY_ID: '/team/executive/',
    CREATE_TEAM_COMMITTEE: '/admin/team/executive',
    UPDATE_TEAM_COMMITTEE: '/admin/team/executive/',
    DELETE_TEAM_COMMITTEE: '/admin/team/executive/',

    GET_TEAM_TYPE: '/type/team',
    GET_TEAM_STATUS: '/status/team',
    //────────────────────────────────────────────
    //? API: ---- Event
    //────────────────────────────────────────────
    GET_EVENT_CATEGORY: '/event/category',
    CREATE_EVENT_CATEGORY: '/admin/event/category',
    UPDATE_EVENT_CATEGORY: '/admin/event/category/',
    DELETE_EVENT_CATEGORY: '/admin/event/category/',
    GET_EVENT_CATEGORY_BY_ID: '/event/category/',

    GET_EVENT_SUBCATEGORY: '/event/sub-category',
    CREATE_EVENT_SUBCATEGORY: '/admin/event/sub-category',
    UPDATE_EVENT_SUBCATEGORY: '/admin/event/sub-category/',
    DELETE_EVENT_SUBCATEGORY: '/admin/event/sub-category/',
    GET_EVENT_SUBCATEGORY_BY_ID: '/event/sub-category/',

    GET_EVENT_STATUS: '/status/event',
    CREATE_EVENT_STATUS: '/admin/status/event',
    UPDATE_EVENT_STATUS: '/admin/status/event/',
    DELETE_EVENT_STATUS: '/admin/status/event/',
    GET_EVENT_STATUS_BY_ID: '/status/event/',

    GET_EVENT: '/event',
    CREATE_EVENT: '/admin/event',
    UPDATE_EVENT: '/admin/event/',
    DELETE_EVENT: '/admin/event/',
    GET_EVENT_BY_ID: '/event/',
    //────────────────────────────────────────────
    //? API: ---- Event Special Forms
    //────────────────────────────────────────────
    GET_SCHOLARSHIP_FORM: '/event/form/special/scholarship',
    GET_SCHOLARSHIP_FORM_BY_ID: '/event/form/special/scholarship/',
    CREATE_SCHOLARSHIP_FORM: '/admin/event/form/special/scholarship',
    UPDATE_SCHOLARSHIP_FORM: '/admin/event/form/special/scholarship/',
    DELETE_SCHOLARSHIP_FORM: '/admin/event/form/special/scholarship/',

    SUBMIT_SCHOLARSHIP_FORM: '/event/form/special/scholarship/',                         //! e.g: /event/form/special/scholarship/{_id}/data
    GET_SCHOLARSHIP_FORM_DATA: '/event/form/special/scholarship/',                       //! e.g: /event/form/special/scholarship/{_id}/data
    UPDATE_SCHOLARSHIP_FORM_DATA: '/admin/event/form/special/scholarship/',              //! e.g: /event/form/special/scholarship/{_id}/data
    //────────────────────────────────────────────
    //? API: ---- Eligible School
    //────────────────────────────────────────────
    GET_ELIGIBLE_INSTITUTE:
        '/event/form/special/scholarship/eligible/institute',
    GET_ELIGIBLE_INSTITUTE_BY_ID:
        '/event/form/special/scholarship/eligible/institute/',
    CREATE_ELIGIBLE_INSTITUTE:
        '/admin/event/form/special/scholarship/eligible/institute',
    UPDATE_ELIGIBLE_INSTITUTE:
        '/admin/event/form/special/scholarship/eligible/institute/',
    DELETE_ELIGIBLE_INSTITUTE:
        '/admin/event/form/special/scholarship/eligible/institute/',
    //────────────────────────────────────────────
    //? API: ---- Home
    //────────────────────────────────────────────
    GET_BENEFITS_OF_MEMBERS: '/home/benefits-of-member',
    GET_BENEFITS_OF_MEMBERS_BY_ID: '/home/benefits-of-member/',
    CREATE_BENEFITS_OF_MEMBERS: '/admin/home/benefits-of-member',
    UPDATE_BENEFITS_OF_MEMBERS: '/admin/home/benefits-of-member/',
    DELETE_BENEFITS_OF_MEMBERS: '/admin/home/benefits-of-member/',

    GET_CAROUSEL: '/home/carousel',
    GET_CAROUSEL_BY_ID: '/home/carousel/',
    CREATE_CAROUSEL: '/admin/home/carousel',
    UPDATE_CAROUSEL: '/admin/home/carousel/',
    DELETE_CAROUSEL: '/admin/home/carousel/',

    GET_MESSAGE: '/home/message',
    GET_MESSAGE_BY_ID: '/home/message/',
    CREATE_MESSAGE: '/admin/home/message',
    UPDATE_MESSAGE: '/admin/home/message/',
    DELETE_MESSAGE: '/admin/home/message/',
    //────────────────────────────────────────────
    //? API: ---- Media
    //────────────────────────────────────────────
    GET_NEWS: '/media/news',
    GET_NEWS_BY_ID: '/media/news/',
    CREATE_NEWS: '/admin/media/news',
    UPDATE_NEWS: '/admin/media/news/',
    DELETE_NEWS: '/admin/media/news/',

    GET_PHOTO: '/media/photo',
    GET_PHOTO_BY_ID: '/media/photo/',
    CREATE_PHOTO: '/admin/media/photo',
    UPDATE_PHOTO: '/admin/media/photo/',
    DELETE_PHOTO: '/admin/media/photo/',

    GET_VIDEO: '/media/video',
    GET_VIDEO_BY_ID: '/media/video/',
    CREATE_VIDEO: '/admin/media/video',
    UPDATE_VIDEO: '/admin/media/video/',
    DELETE_VIDEO: '/admin/media/video/',

    GET_NOTICE: '/notice',
    GET_NOTICE_BY_ID: '/notice/',
    CREATE_NOTICE: '/admin/notice',
    UPDATE_NOTICE: '/admin/notice/',
    DELETE_NOTICE: '/admin/notice/',
    //────────────────────────────────────────────
    //? API: ---- Finance
    //────────────────────────────────────────────
    GET_PAYMENT_METHOD: '/type/payment_method',
    GET_PAYMENT_METHOD_BY_ID: '/type/payment_method/',
    CREATE_PAYMENT_METHOD: '/admin/type/payment_method',
    UPDATE_PAYMENT_METHOD: '/admin/type/payment_method/',
    DELETE_PAYMENT_METHOD: '/admin/type/payment_method/',

    GET_DONATION: '/admin/finance/donation',
    GET_DONATION_BY_ID: '/admin/finance/donation/',
    CREATE_DONATION: '/admin/finance/donation',
    UPDATE_DONATION: '/admin/finance/donation/',
    DELETE_DONATION: '/admin/finance/donation/',

    GET_BUDGET: '/admin/finance/budget',
    GET_BUDGET_BY_ID: '/admin/finance/budget/',
    CREATE_BUDGET: '/admin/finance/budget',
    UPDATE_BUDGET: '/admin/finance/budget/',
    DELETE_BUDGET: '/admin/finance/budget/',
    UPDATE_BUDGET_COSTING: '/admin/finance/costing/',

    GET_TREASURY_INFO: '/admin/finance/treasury/info',
    //────────────────────────────────────────────
    //? API: ---- Common Status and Type
    //────────────────────────────────────────────
    GET_ALL_TYPE: '/type',
    GET_TYPE_BY_ID: '/admin/type/',
    CREATE_TYPE_BY_CATEGORY: '/admin/type/', //! e.g: /type/{team}
    UPDATE_TYPE_BY_CATEGORY: '/admin/type/', //! e.g: /type/{team}/{_id}
    DELETE_TYPE_BY_CATEGORY: '/admin/type/', //! e.g: /type/{team}/{_id}

    GET_ALL_STATUS: '/status',
    GET_STATUS_BY_ID: '/admin/status/',
    CREATE_STATUS_BY_CATEGORY: '/admin/status/', //! e.g: /status/{team}
    UPDATE_STATUS_BY_CATEGORY: '/admin/status/', //! e.g: /status/{team}/{_id}
    DELETE_STATUS_BY_CATEGORY: '/admin/status/', //! e.g: /status/{team}/{_id}
};
