import ClassicQuery from './ClassicQuery';
import Crud from './Crud';

/**
 * Diekspos ke script user sebagai `zbuilder`. Hanya berisi aksi, jadi
 * dibuat sekali di runtime dengan `zcore` yang tidak mencatat pembacaan.
 */
const BuilderContext = ({ zcore, latest }) => {
  const crud = Crud(latest);

  return {
    classicQuery: ClassicQuery({ zcore, crud, latest }),
    crud,
  };
};

export default BuilderContext;
