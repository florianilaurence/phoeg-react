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
import { useContext } from "react";
import { Coordinate } from "../../../store/reducers/chart_data_reducer";
import RequestChartContext from "../../../store/utils/request_chart_context";
import SubSubTitle from "../../styles_and_settings/SubSubTitle";

export interface TableDirectionProps {
  title: string;
  data: Array<Array<Coordinate>>;
}

const TableDirection: React.FC<TableDirectionProps> = ({
  title,
  data,
}: TableDirectionProps) => {
  const requestChartContext = useContext(RequestChartContext);

  return (
    <Box>
      <SubSubTitle text={title} />
      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell align="right">{requestChartContext.labelX}</TableCell>
              <TableCell align="right">{requestChartContext.labelY}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) =>
              row.map((coordinate) => (
                <TableRow
                  key={`${index}-x-${coordinate.x}-y-${coordinate.y}`}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="right">{coordinate.x}</TableCell>
                  <TableCell align="right">{coordinate.y}</TableCell>
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
