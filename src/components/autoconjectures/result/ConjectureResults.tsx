import { useEffect } from "react";

const ConjectureResults = () => {
  useEffect(() => {
    console.log("ConjectureResults");
  }, []);

  return (
    <div>
      <h1>Fetch Conjecture</h1>
    </div>
  );
};

export default ConjectureResults;
