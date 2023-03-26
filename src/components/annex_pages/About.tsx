import Title from "../styles_and_settings/Title";
import { Box, Typography } from "@mui/material";
import Frame from "./Frame";
import { OpenProps } from "../polytopes/PhoegApp";

const About = ({ isOpenMenu, setIsOpenMenu }: OpenProps) => {
  return (
    <Frame isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu}>
      <Title title="About" />
      <Box sx={{ ml: 3, mr: 3, mb: 3 }}>
        <Typography variant="body1" fontWeight="bold" align="center">
          PHOEG is an acronym for "PHOEG Helps to Obtain Extremal Graphs"
        </Typography>
        <br />
        <Typography variant="body1" fontStyle="italic" align="center">
          It is a discovery system developed in the{" "}
          <a
            href="http://informatique.umons.ac.be/algo"
            target="_blank"
            rel="noreferrer"
          >
            Algorithms Lab at Université de Mons
          </a>{" "}
          and that is the sequel of the former system GraPHedron (Mélot,
          Hadrien. Facet defining inequalities among graph invariants: the
          system GraPHedron. Discrete Applied Mathematics 156.10 (2008):
          1875-1891).
        </Typography>
        <br />
        <Typography variant="body1" align="justify">
          If you use PHOEG in your research, you can cite it as: DEVILLEZ
          Gauvain, HAUWEELE Pierre, and MÉLOT Hadrien. PHOEG Helps to Obtain
          Extremal Graphs. In : Operations Research Proceedings 2018: Selected
          Papers of the Annual International Conference of the German Operations
          Research Society (GOR), Brussels, Belgium, September 12-14, 2018.
          Springer Nature, 2019. p. 251-257.
        </Typography>
        <br />
        <Typography variant="body1" align="justify">
          The user interface was designed by{" "}
          <a
            href={"https://laurencefloriani.github.io/"}
            target="_blank"
            rel="noreferrer"
          >
            Laurence Floriani
          </a>
          .
        </Typography>
        <br />
        <Typography variant="body1" align="justify">
          The API to communicate with the server has been implemented by{" "}
          <a
            href={"https://lavendthomas.github.io/"}
            target="_blank"
            rel="noreferrer"
          >
            Thomas Lavend'Homme
          </a>
          .
        </Typography>
      </Box>
    </Frame>
  );
};

export default About;
