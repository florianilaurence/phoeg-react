import Polytope from "./Polytope";
import {useState} from "react";

// Component's core
export default function Polytopes() {
    const [count, setCount] = useState(1);
    const [maxPolytopes, setMaxPolytopes] = useState(3);

    const RenderMultiPolytopes = () => {
        let i = 1;
        let result = [];
        while (i <= count) {
            result.push(renderOnePolytope(i));
            i++;
        }
        return result;
    }

    const renderOnePolytope = (num) => {
        return <Polytope key={"pol_" + num} num={num}/>
    }

    return (
        <div>
            <h2 className="polytope-title">Polytope(s)</h2>
            <p> Combien souhaitez-vous comparer de polytopes (max {maxPolytopes}) :
                <button onClick={() => count > 0 ? setCount(count - 1):setCount(0)}> - </button>
                {" " + count + " "}
                <button onClick={() => setCount((count + 1) % (maxPolytopes + 1))}> + </button>
            </p>
            <RenderMultiPolytopes />
        </div>
    );
}