const user = process.env.SERVER_USER || 'root';

module.exports = {
  apps: [{
    name: 'todo',
    script: './index.js',
    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],

  deploy: {
    production: {
      user,
      host: '172.104.182.140',
      ref: 'origin/develop',
      repo: 'git@gitlab.com:damdauvaotran/checker-be.git',
      path: '/root/checker-be',
      ssh_options: 'StrictHostKeyChecking=no',
      'post-deploy': 'npm install &&  /root/.npm-global/bin/pm2 reload ecosystem.config.js --env production',
    },
  },
};
