import ClassicQuery from './ClassicQuery';
import Crud from './Crud';

/**
 * Diekspos ke script user sebagai `zbuilder`.
 */
const BuilderContext = () => {
  return {
    classicQuery: ClassicQuery(),
    crud: Crud(),
  };
};

export default BuilderContext;
