const Mobile = () => import('@/mobile/index.vue');
import mobileRouter from '../mobile/router';

const routes = [
  {
    path: '/',
    name: 'mobile',
    component: Mobile,
    redirect: '/content',
    children: mobileRouter,
  },
  {
    path: '*',
    redirect:'/'
  },
];
export default routes;
