const CApiUrl = {
  auth: {
    login: '/auth/login',
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
  export: {
    csv: '/export/csv',
  },
};

export default CApiUrl;
