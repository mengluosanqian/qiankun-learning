const getters = {
    token: state => state.app.token,

    userName: state => state.app.userName,
    portalObj: state => state.oa.getPortalObj,
    portalTempletDialog: state => state.oa.portalTempletDialog,
    portalId: state => state.oa.portalTempletDialog,

    isMenuOpen: state => state.oa.isMenuOpen,
    isPageConfig: state => state.oa.isPageConfig,
    modelCode: state => state.oa.modelCode,
    appList: state => state.oa.appList,
    moduleList: state => state.oa.moduleList,
    menuList: state => state.oa.menuList,
    portalMenuList: state => state.oa.portalMenuList,
    pageList: state => state.oa.pageList,
    moduleCommonJsList: state => state.oa.moduleCommonJsList,
    moduleFileList: state => state.oa.moduleFileList,
    cdnFileList: state => state.oa.cdnFileList,
    setPageList: state => state.oa.pageList,
    activeAppId: state => state.oa.activeAppId,
    isEnableManagePortal: state => state.oa.isEnableManagePortal,
    changePotral: state => state.oa.changePotral,
    isApplication: state => state.oa.isApplication,
    portalPageData: state => state.portalPage.PageData,
    showEditMenu: state => state.portalPage.showEditMenu,


    isPortalPageConfig: state => state.portal.isPortalPageConfig,
    curPortalPageOption: state => state.portal.curPortalPageOption,
    portalPageConfigs: state => state.portal.portalPageConfigs,

    word: state => state.search.word,
    scenceId: state => state.search.scenceId,


}
export default getters