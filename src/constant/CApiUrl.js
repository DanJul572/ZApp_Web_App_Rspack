const CApiUrl = {
  base: process.env.API_URL || 'http://127.0.0.1:8080/api',
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
  },
  common: {
    columns: '/common/columns',
    create: '/common/create',
    delete: '/common/delete',
    detail: '/common/detail',
    menu: '/common/menu',
    rows: '/common/rows',
    options: '/common/options',
    update: '/common/update',
  },
  module: {
    detail: '/module/detail',
    create: '/module/create',
    delete: '/module/delete',
  },
  field: {
    rows: '/field/rows',
  },
  view: {
    options: '/view/options',
  },
  script: {
    run: '/script/run',
  },
  file: {
    download: '/file/download',
  },
};

export default CApiUrl;
