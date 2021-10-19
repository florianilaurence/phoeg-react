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
            {count == 3 ? <div> <Polytope num={1}/> <Polytope num={2}/> <Polytope num={3}/> </div> :
                count == 2 ? <div> <Polytope num={1}/> <Polytope num={2}/> </div> :
                    count == 1 ? <Polytope num={1}/>:null}
      </div>
    );
  }

export default Polytopes;