import React from "react";

class Polytope extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                J'essaie
                {alert(this.props.dataFromParent)}
            </div>
        )
    }
}




export default Polytope;