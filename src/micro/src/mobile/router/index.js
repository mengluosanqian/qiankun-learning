const content = () => import('@/mobile/view/content/index.vue');
const application = () => import('@/mobile/view/application/application.vue');
const outApplication = () => import('@/mobile/view/application/out-application.vue');

export default [
    {
        path: 'content',
        name: 'mobile.content',
        component: content
    },
    {
        path: 'application',
        name: 'mobile.application',
        component: application

    }, {
        path: 'out-application',
        name: 'mobile.out-application',
        component: outApplication

    }
];