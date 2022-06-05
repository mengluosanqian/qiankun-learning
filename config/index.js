import devConfig from './config.develop'
import prodConfig from './config.prod'
const config = process.env.NODE_ENV === 'production'? prodConfig:devConfig
export default config;