import logo from "../assets/logo_phoeg.png"

export default function Banner() {
    return (
        <div className="banner">
            <h1 align="center">PHOEG
                <img align="right" src={logo} className="app-logo" alt="logo"/>
            </h1>
            <text align="justify">Une petite description de l'application web</text>
        </div>
    )
}