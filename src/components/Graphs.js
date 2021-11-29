
// Component's core
export default function Graphs(props) {
    return (
        <div className="graphs">
            <h2 className="graphs-title">Graphe(s)</h2>
            <p> Nom de l'invariant : {props.name} Nombre d'arêtes : {props.m} Valeur de l'invariant : {props.invariantVal}</p>
        </div>
    )
}