import ClassicQuery from './ClassicQuery';
import Crud from './Crud';

const Builder = () => {
  return {
    classicQuery: ClassicQuery(),
    crud: Crud(),
  };
};

export default Builder;
