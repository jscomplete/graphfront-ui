const env = process.env;
const nodeEnv = env.NODE_ENV || 'development';

module.exports = {
  nodeEnv: nodeEnv,
  isBrowser: typeof window !== 'undefined',
  isDev: nodeEnv === 'development',
};
