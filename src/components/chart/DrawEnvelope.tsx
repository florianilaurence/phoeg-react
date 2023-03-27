import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import { useContext } from "react";
import MainContext from "../../store/utils/main_context";

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
        x={(d) => xScale(d.x)}
        y={(d) => yScale(d.y)}
      />
    </Group>
  );
};

export default DrawEnvelope;
