export default {
  subAPP: [
    {
      name: 'sub-app-login',
      activeRule: '/login',
      auth: false,
      port: '9003'
    },
    {
      name: 'sub-app-dev',
      activeRule: '/dev',
      auth: true,
      port: '9002'
    },
    {
      name: 'sub-app-mobile',
      activeRule: '/mobile',
      auth: false,
      port: '9004'
    },
    {
      name: 'sub-app-open-mobile',
      activeRule: '/open-mobile',
      auth: false,
      port: '9004'
    },
    {
      name: 'sub-app-portal',
      activeRule: '/portal',
      auth: true,
      port: '9005'
    }
  ]
}
