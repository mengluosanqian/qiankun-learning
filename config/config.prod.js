export default {
  subAPP: [
    {
      name: 'sub-app-login',
      //host: 'http://172.16.86.12',
      activeRule: '/login',
      auth: false,
      //port: '9003'
    },
    {
      name: 'sub-app-dev',
      //host: 'http://172.16.86.12',
      activeRule: '/dev',
      auth: true,
      //port: '9002'
    },
    {
      name: 'sub-app-mobile',
      //host: 'http://172.16.86.12',
      activeRule: '/mobile',
      auth: false,
      //port: '9004'
    },
    {
      name: 'sub-app-open-mobile',
      //host: 'http://172.16.86.12',
      activeRule: '/open-mobile',
      auth: false,
      //port: '9004'
    },
    {
      name: 'sub-app-portal',
      //host: 'http://172.16.86.12',
      activeRule: '/portal',
      auth: true,
      //port: '9005'
    }
  ]
}
