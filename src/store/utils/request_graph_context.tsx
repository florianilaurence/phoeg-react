import { createContext } from "react";
import { initialGraphState } from "../reducers/request_graph_reducer";

const RequestGraphContext = createContext({
  ...initialGraphState,
  handleValueX: (data: any) => {},
  handleValueY: (data: any) => {},
  handleIsSelected: (data: any) => {},
});

export default RequestGraphContext;
