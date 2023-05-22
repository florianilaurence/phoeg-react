import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { CoordinateAutoconj } from "../../../store/reducers/main_reducer";
import MainContext from "../../../store/contexts/main_context";
import { useContext } from "react";
import SubTitle from "../../styles_and_settings/SubTitle";

export interface TableDirectionProps {
  title: string;
  data: Array<Array<CoordinateAutoconj>>;
}

const MAXHEIGHT = 350;

const isClickedPoint = (
  coordinate: CoordinateAutoconj,
  pointsClicked: Array<Array<CoordinateAutoconj>>
) => {
  for (let i = 0; i < pointsClicked.length; i++) {
    for (let j = 0; j < pointsClicked[i].length; j++) {
      if (
        pointsClicked[i][j].x.equal(coordinate.x) &&
        pointsClicked[i][j].y.equal(coordinate.y)
      ) {
        return true;
      }
    }
  }
  return false;
};

const TableDirection = ({ title, data }: TableDirectionProps) => {
  const mainContext = useContext(MainContext);

  return (
    <Box>
      <SubTitle> {title} </SubTitle>
      <TableContainer component={Paper} sx={{ maxHeight: MAXHEIGHT }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell align="right">{mainContext.labelX}</TableCell>
              <TableCell align="right">{mainContext.labelY}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) =>
              row.map((coordinate) => (
                <TableRow
                  key={`data-${title}-n-${index}-x-${coordinate.x}-y-${
                    coordinate.y
                  }-${Math.random()}`}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      color: isClickedPoint(
                        coordinate,
                        mainContext.pointsClicked
                      )
                        ? "red"
                        : "black",
                    }}
                  >
                    {coordinate.order}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: isClickedPoint(
                        coordinate,
                        mainContext.pointsClicked
                      )
                        ? "red"
                        : "black",
                    }}
                  >
                    {coordinate.x.getValue()}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: isClickedPoint(
                        coordinate,
                        mainContext.pointsClicked
                      )
                        ? "red"
                        : "black",
                    }}
                  >
                    {coordinate.y.getValue()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableDirection;
