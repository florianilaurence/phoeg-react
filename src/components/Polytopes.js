import React, {useState} from "react";
import Polytope from "./Polytope";

function Polytopes() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <h2 className="polytope-title">Polytope(s)</h2>
            <p> Combien souhaitez-vous comparer de polytopes (max 3) :
                <button onClick={() => setCount((count + 1)%4)}> + </button>
                {count}
                <button onClick={() => count > 0 ? setCount(count - 1):setCount(0)}> - </button>
            </p>
            {count == 3 ? <div> <Polytope/> <Polytope/> <Polytope/> </div> :
                count == 2 ? <div> <Polytope/> <Polytope/> </div> :
                    count == 1 ? <Polytope/>:null}
      </div>
    );
  }

export default Polytopes;