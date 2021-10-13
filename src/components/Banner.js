import logo from "../assets/logo_phoeg.png"
import Polytopes from "./Polytopes.js"

function Banner() {
    return (
        <div className="banner">
            <h1 align="center">PHOEG
                <img align="right" src={logo} className="app-logo" alt="logo"/>
            </h1>
            <text align="justify">Un outil pour utiliser PHOEG. Dans le première section, vous trouverez les polytopes. Vous pouvez choisir un invariant.</text>
            <Polytopes />
        </div>
    )
}

export default Banner;