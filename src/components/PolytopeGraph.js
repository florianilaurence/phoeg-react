import React from "react";

export default class PolytopeGraph extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <h4>invariant : {this.props.invariant}</h4>
        )
    }
}