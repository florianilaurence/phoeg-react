import Polytopes from "../polytopes/Polytopes";
import "react-banner/dist/style.css";
import Banner from "./Banner";
import { Introduction } from "./Introduction";

// Main component
const App: React.FC = () => {
  return (
    <div className="app">
      <Banner />
      <Introduction />
      <Polytopes />
    </div>
  );
};

export default App;
