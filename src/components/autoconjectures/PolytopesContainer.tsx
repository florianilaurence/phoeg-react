import { useContext, useEffect } from "react";
import MainContext from "../../store/utils/main_context";
import Loading from "../Loading";
import Title from "../styles_and_settings/Title";

const PolytopesContainer = () => {
  const mainContext = useContext(MainContext);

  useEffect(() => {
    console.log(mainContext.concaves);
  }, [mainContext.concaves]);

  return (
    <>
      {mainContext.isSubmit && <Title title="Polytopes" />}
      {mainContext.isSubmit && mainContext.isLoading && (
        <Loading height="1000px" />
      )}
      {mainContext.isSubmit && !mainContext.isLoading && (
        <div className="polytopes-container">TODO</div>
      )}
    </>
  );
};

export default PolytopesContainer;
