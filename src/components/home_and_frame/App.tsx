import Polytopes from "../polytopes/Polytopes";
import "react-banner/dist/style.css";
import Banner from "./Banner";
import { Introduction } from "./Introduction";
import Title from "../styles_and_settings/Title";

// Main component
const App: React.FC = () => {
  return (
    <div className="app">
      <Banner isHome={true} />
      <Introduction />
      <Polytopes />
    </div>
  );
};

export default App;
