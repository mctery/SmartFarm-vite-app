import ReactDOM from "react-dom/client";
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { STYLES } from "../../services/global_variable";
import {
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  Divider,
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";

export default function DialogGridStack() {
  const gridRef = useRef(null);
  const [widgets, setWidgets] = useState([
    { id: 1, x: 0, y: 0, w: 4, h: 2, content: "อุณหภูมิ" },
    { id: 2, x: 4, y: 0, w: 4, h: 2, content: "ความชื้น" },
    { id: 3, x: 8, y: 0, w: 4, h: 2, content: "แสงสว่าง" },
    { id: 4, x: 0, y: 2, w: 12, h: 2, content: "กราฟแสดงผล" },
  ]);
  const gridInstance = useRef(null);
  const nextId = useRef(5);

  useEffect(() => {
    if (!gridRef.current) return;

    if (gridInstance.current) {
      gridInstance.current.destroy();
    }

    const grid = GridStack.init(
      {
        cellHeight: 100,
        float: true,
        margin: 5,
        disableOneColumnMode: true,
        minRow: 2,
        column: 12,
        resizable: { handles: "all" },
        draggable: { handle: ".grid-stack-item-content" },
      },
      gridRef.current
    );

    widgets.forEach(({ id, x, y, w, h, content }) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("grid-stack-item");
      wrapper.setAttribute("data-gs-id", id);

      const contentDiv = document.createElement("div");
      contentDiv.classList.add("grid-stack-item-content");

      wrapper.appendChild(contentDiv);
      grid.addWidget(wrapper, { x, y, w, h });

      const root = ReactDOM.createRoot(contentDiv);
      root.render(
        <Paper sx={{ p: 2, position: "relative", height: "100%" }}>
          <IconButton
            size="small"
            sx={{ position: "absolute", top: 4, right: 4 }}
            onClick={() => handleRemoveWidget(id)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <Typography>{content}</Typography>
        </Paper>
      );
    });

    gridInstance.current = grid;

    const handleRemoveClick = (e) => {
      const removeId = e.target.getAttribute("data-remove-id");
      if (removeId) {
        handleRemoveWidget(parseInt(removeId));
      }
    };

    gridRef.current.addEventListener("click", handleRemoveClick);

    return () => {
      gridRef.current.removeEventListener("click", handleRemoveClick);
      grid.destroy();
    };
  }, [widgets]);

  const handleAddWidget = () => {
    setWidgets((prev) => [
      ...prev,
      {
        id: nextId.current,
        x: 0,
        y: 0,
        w: 4,
        h: 2,
        content: `Widget ${nextId.current}`,
      },
    ]);
    nextId.current += 1;
  };

  const handleRemoveWidget = (id) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <Dialog open={false} onClose={() => {}} maxWidth="lg" fullWidth>
      <DialogTitle>แดชบอร์ดการควบคุมฟาร์ม</DialogTitle>
      <DialogContent>
        <Box sx={{ width: "100%", height: "500px" }}>
          <div className="grid-stack" ref={gridRef}></div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddWidget} color="primary" variant="contained" sx={{ mr: 1 }}>
          เพิ่ม Widget
        </Button>
        <Button onClick={() => {}} color="primary">
          ปิด
        </Button>
      </DialogActions>
    </Dialog>
  );
}