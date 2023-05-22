import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import { useContext } from "react";
import MainContext from "../../store/contexts/main_context";
import { SimplifiedCoordinate } from "../../store/reducers/main_reducer";

interface DrawEnvelopeProps {
  xScale: any;
  yScale: any;
  currentIndexOrder?: number;
}

const DrawEnvelope = ({
  xScale,
  yScale,
  currentIndexOrder,
}: DrawEnvelopeProps) => {
  const mainContext = useContext(MainContext);

  return (
    <Group>
      <LinePath
        stroke="black"
        strokeWidth={1}
        data={
          currentIndexOrder !== undefined
            ? mainContext.envelopes[currentIndexOrder]
            : mainContext.envelope
        }
        x={(d: SimplifiedCoordinate) => xScale(d.x.getValue())}
        y={(d: SimplifiedCoordinate) => yScale(d.y.getValue())}
      />
    </Group>
  );
};

export default DrawEnvelope;
