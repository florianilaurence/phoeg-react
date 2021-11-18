import logo from "../phoeg.png"

export default function Banner() {
    return (
        <div className="banner">
            <h1 align="center">PHOEG
                <img align="right" src={logo} className="app-logo" alt="logo"/>
            </h1>
            <p align="justify">Une petite description de l'application web</p>
        </div>
    )
}