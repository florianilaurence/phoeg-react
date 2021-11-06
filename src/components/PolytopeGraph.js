import ParseFiles from '../core/ParseFiles'

export default function PolytopeGraph(props) {

    const parseFile = (invariant, measure, number) => {
        let parser = new ParseFiles(invariant, measure, number);
        return parser.updatePolytope();
    }

    return (
        <div>
            <h4>invariant : {props.invariant} number : {props.number} option : {props.measure}</h4>
            <parseFile/>


        </div>
    )
}