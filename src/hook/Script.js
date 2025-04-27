import { useEffect, useState } from 'react';

import Request from './Request';

import CApiUrl from '@/constant/CApiUrl';

const Script = (props) => {
  const { id } = props;

  const { get } = Request();

  const [val, setVal] = useState(null);

  const getVal = () => {
    if (id) {
      get(CApiUrl.script.run, { id })
        .then((res) => {
          setVal(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    getVal();
  }, [id]);

  return {
    val,
  };
};

export default Script;
