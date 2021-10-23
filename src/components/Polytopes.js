import React, {useState} from "react";
import Polytope from "./Polytope";

// Component's core
export default class Polytopes extends React.Component {
    constructor() {
        this.count = 0;
    }

    setCount(newCount) {
        this.count = newCount;
    }

    render() {
        return (
            <div>
                <h2 className="polytope-title">Polytope(s)</h2>
                <p> Combien souhaitez-vous comparer de polytopes (max 3) :
                    <button onClick={() => this.count > 0 ? this.setCount(this.count - 1):this.setCount(0)}> - </button>
                    {" " + this.count + " "}
                    <button onClick={() => this.setCount((this.count + 1)%4)}> + </button>
                </p>
                {this.count === 3 ? <div> <Polytope num={1}/> <Polytope num={2}/> <Polytope num={3}/> </div> :
                    this.count === 2 ? <div> <Polytope num={1}/> <Polytope num={2}/> </div> :
                        this.count === 1 ? <Polytope num={1}/>:null}
            </div>
        );
    }
}