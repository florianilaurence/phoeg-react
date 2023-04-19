import MathJax from "react-mathjax";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface RenderOneConjectureProps {
  conjecture: string;
  maxLenEq: number;
  direction?: string;
}

const RenderOneConjecture = ({
  conjecture,
  maxLenEq,
  direction,
}: RenderOneConjectureProps) => {
  const [showDialogConj, setShowDialogConj] = useState(false);

  const convertConj = (conj: string) => {
    if (conj.length > maxLenEq) {
      let temp = conj.slice(0, maxLenEq);
      let index = temp.lastIndexOf("}");
      return conj.slice(0, index + 1) + "...";
    } else {
      return conj;
    }
  };

  return (
    <>
      {conjecture.length > 6 && (
        <Box
          sx={{
            display: "flex",
            direction: "row",
            justifyContent: "space-evenly",
          }}
        >
          <MathJax.Provider>
            <MathJax.Node formula={convertConj(conjecture)} />
          </MathJax.Provider>

          {conjecture.length > maxLenEq && (
            <Tooltip
              title="Click to show full conjecture"
              placement="top-start"
            >
              <IconButton onClick={() => setShowDialogConj(true)}>
                <PriorityHighIcon fontSize="small" color="error" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}

      <Dialog
        open={showDialogConj}
        onClose={() => setShowDialogConj(false)}
        title="Conjecture"
      >
        {direction ? (
          <DialogTitle>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              Conjecture for {direction}
              <IconButton onClick={() => setShowDialogConj(false)}>
                <CloseIcon color="warning" />
              </IconButton>
            </Box>
          </DialogTitle>
        ) : (
          <DialogTitle>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton onClick={() => setShowDialogConj(false)}>
                <CloseIcon color="warning" />
              </IconButton>
            </Box>
          </DialogTitle>
        )}
        <DialogContent>
          <MathJax.Provider>
            <MathJax.Node inline formula={conjecture} />
          </MathJax.Provider>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RenderOneConjecture;
