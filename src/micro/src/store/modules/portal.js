const portal = {
    state: {
        showEditMenu: false,
        portalTempletDialog: false,
        portalObj: {},
        portalId: '', //门户管理中所选门户id
        portalTemplateId: '', //门户管理中所选模板id
        portalTempTypeId: '', //门户模版类型‘portalTemplate1’
        selectMenuList: '', //选择菜单list
        selectMenuFlag: 0, //选择菜单flag
        skinTypeId: "", //皮肤id

        applicationId: '',
        applicationType: '',

        // 模板设置数据
        isPortalPageConfig: false,
        curPortalPageOption: "logoSetting",
        portalPageConfigs: {},

        /*
         ***权限设置中心
         */
        //岗位管理
        stationId: '',
    },
    getters: {
        skinTypeId: state => state.skinTypeId,
        portalTemplateId: state => state.portalTemplateId,
        selectMenuFlag: state => state.selectMenuFlag,
        portalTempTypeId: state => state.portalTempTypeId
    },
    mutations: {
        setSkinTypeId: (state, data) => {
            state.skinTypeId = data;
        },
        setSelectMenuFlag: (state, data) => {
            state.selectMenuFlag = data;
        },
        setPortalTempTypeId: (state, data) => {
            state.portalTempTypeId = data;
        },
        setShowEditMenu: (state, data) => {
            state.showEditMenu = data;
        },
        setPortalTempletDialog: (state, data) => {

            state.portalTempletDialog = data;
        },
        setPortalId: (state, portalId) => {
            state.portalId = portalId;
        },
        setPortalTemplateId: (state, portalTemplateId) => {
            state.portalTemplateId = portalTemplateId;
        },
        setApplicationId: (state, applicationId) => {
            state.applicationId = applicationId;
        },
        setApplicationType: (state, applicationType) => {
            state.applicationType = applicationType;
        },
        setPortalObj: (state, data) => {
            Object.assign(state.portalObj, data);
        },
        setPageData: (state, data) => {
            console.log("vuexdata");

            console.log(data);
            Object.assign(state.pageData, data);
        },
        setIsPortalPageConfig: (state, flag) => {
            state.isPortalPageConfig = flag
        },
        setCurPortalPageOption: (state, opt) => {
            state.curPortalPageOption = opt
        },
        setPortalPageConfigs: (state, options) => {
            Object.assign(state.portalPageConfigs, options);
        },

        /*
         ***权限设置中心
         */
        //岗位管理
        setStationId: (state, stationId) => {
            state.stationId = stationId;
        }
    },
    actions: {}
}
export default portal;

// const getDefaultConfig = () => {
//     return {
//         // logo设置
//         logoSetting: {
//             showLogo: true,
//             // logoUrl: "/images/yunban-logo.svg",
//             logoUrl: "/images/logo.png",
//             logoHeight: 36,
//             showLogoName: true,
//             logoName: "PKC",
//         },
//         // 用户信息设置
//         personSetting: {
//             showUserInfo: true,
//             showAvatar: true,
//             showUserName: true,
//             showOrgname: true,
//             showPositionName: true,
//         },
//         // 快捷菜单设置
//         menuSetting: {
//             showMenu: true,
//         },
//         // 所有应用设置
//         applicationSetting: {
//             showAllApplication: true,
//         },
//         // 搜索设置
//         searchSetting: {
//             showSearch: true,
//             showSearchStyle: "0", // 搜索输入框0， 搜索按钮1
//         },
//         // 常用导航设置
//         navSetting: {
//             showNav: true,
//         },
//         // 用户设置
//         userSetting: {
//             showSetting: true,
//             showAvatar: true,
//             showName: true,
//             showQuit: true,
//         }
//     }
// };