import Banner from "../home_and_frame/Banner";
import TitleText from "../styles_and_settings/TitleText";
import {View} from "react-native-web";
import InnerText from "../styles_and_settings/InnerText";
import {BOTTOM, LEFT, RIGHT} from "../../designVars";

export default function About() {

    return (
        <>
            <Banner isHome={false} />
            <View>
                <TitleText>About</TitleText>
                <View style={{paddingLeft: LEFT, paddingRight: RIGHT, paddingBottom: BOTTOM}}>
                    <View style={{paddingBottom: BOTTOM, flexWrap: 'wrap', textAlign: 'center'}}>
                        <InnerText bold>PHOEG is an acronym for "PHOEG Helps to Obtain Extremal Graphs"</InnerText>
                    </View>
                    <View style={{paddingBottom: BOTTOM, flexWrap: 'wrap', textAlign: 'center'}}>
                        <InnerText italic>It is a discovery system developed in the <a href="http://informatique.umons.ac.be/algo" target="_blank" rel="noreferrer">Algorithms Lab at Université de Mons</a> and that is the sequel of the former system GraPHedron (Mélot, Hadrien. Facet defining inequalities among graph invariants: the system GraPHedron. Discrete Applied Mathematics 156.10 (2008): 1875-1891).</InnerText>
                    </View>
                    <View style={{paddingBottom: BOTTOM, flexWrap: 'wrap'}}>
                        <InnerText>If you use PHOEG in your research, you can cite it as:
                            DEVILLEZ Gauvain, HAUWEELE Pierre, and MÉLOT Hadrien. PHOEG Helps to Obtain Extremal Graphs.
                            In : Operations Research Proceedings 2018: Selected Papers of the Annual International Conference of the German Operations Research Society (GOR), Brussels, Belgium, September 12-14, 2018. Springer Nature, 2019. p. 251-257.</InnerText>
                    </View>
                    <View style={{paddingBottom: BOTTOM, flexWrap: 'wrap'}}>
                        <InnerText>The user interface was designed by <a href={"https://laurencefloriani.github.io/"} target="_blank" rel="noreferrer">Laurence Floriani</a>.</InnerText>
                        <InnerText>The API to communicate with the server has been implemented by <a href={"https://lavendthomas.github.io/"} target="_blank" rel="noreferrer">Thomas Lavend'Homme</a>.</InnerText>
                    </View>
                </View>
            </View>
        </>
    )
}