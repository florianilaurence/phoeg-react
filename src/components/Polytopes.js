import Polytope from "./Polytope";
import {useState} from "react";

// Component's core
export default function Polytopes() {

    const [count, setCount] = useState(0);

    const renderMultiPolytopes = () => {
        let i = 1;
        let result = [];
        while (i <= count) {
            result.push(renderOnePolytope(i));
            i++;
        }
        return result;
    }

    const renderOnePolytope = (num) => {
        return <Polytope num={num}/>
    }

    return (
        <div>
            <h2 className="polytope-title">Polytope(s)</h2> {//TODO Permettre plus que 3 ou au moins que la valeur ne soit pas hardcoder mais dans un fichier de configuration
                                                                }
            <p> Combien souhaitez-vous comparer de polytopes (max 3) :
                <button onClick={() => count > 0 ? setCount(count - 1):setCount(0)}> - </button>
                {" " + count + " "}
                <button onClick={() => setCount((count + 1)%4)}> + </button>
            </p>
            {renderMultiPolytopes()}
        </div>
    );
}