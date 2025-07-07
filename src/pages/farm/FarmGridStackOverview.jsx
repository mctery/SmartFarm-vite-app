import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  Stack,
  Tooltip,
  Divider,
  useTheme
} from "@mui/material";
import { useSnackbar } from "notistack";

import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";

import DeviceSensors from "../../components/DeviceSensors";
import BoxLoading from "../../components/BoxLoading";
import DialogConfirm from "../../components/DaialogConfirm";
import DrawerSensorList from "../../components/sensors/DrawerSensorList";

import {
  getWidgetLayout,
  saveWidgetLayout,
  deleteWidgetLayout,
} from "../../services/widget_service";
import {
  subscribeDeviceRealtime,
  SysGetDeviceSensorsById,
} from "../../services/global_function";
import { ICON } from "../../services/global_variable";

export default function FarmGridStackOverview() {
  const { deviceId } = useParams();
  const gridRef = useRef(null);
  const grid = useRef(null);
  const nextId = useRef(1);
  const isSavingRef = useRef(false);
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [widgets, setWidgets] = useState([]);
  const [openDrawerSensors, setOpenDrawerSensors] = useState(false);
  const [realtime, setRealtime] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [openDialogWidgetRemove, setDialogWidgetRemove] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const unsub = subscribeDeviceRealtime(deviceId, (msg) => setRealtime(msg));
    return unsub;
  }, [deviceId]);

  useEffect(() => {
    const fetchData = async () => {
      const sensors = await SysGetDeviceSensorsById(deviceId);
      const widgets = await getWidgetLayout(deviceId);
      const maxId = widgets.reduce((m, w) => (w.id > m ? w.id : m), 0);
      nextId.current = maxId + 1;

      setSensors(sensors);
      setWidgets(widgets);
      setIsLoading(false);
    };
    fetchData();
  }, [deviceId]);

  useEffect(() => {
    if (!gridRef.current || isSavingRef.current) return;
    if (grid.current) {
      grid.current.destroy(false);
      grid.current = null;
    }

    grid.current = GridStack.init(
      {
        column: 5,
        cellHeight: 200,
        float: true,
        margin: 5,
        disableOneColumnMode: true,
      },
      gridRef.current
    );

    grid.current.removeAll(true);
    widgets.forEach(addWidgetToGrid);

    return () => {
      grid.current?.destroy(false);
      grid.current = null;
    };
  }, [widgets]);

  const addWidgetToGrid = (w) => {
    if (!grid.current) return;

    const wrapper = document.createElement("div");
    wrapper.classList.add("grid-stack-item");
    wrapper.setAttribute("gs-x", w.x);
    wrapper.setAttribute("gs-y", w.y);
    wrapper.setAttribute("gs-w", w.w);
    wrapper.setAttribute("gs-h", w.h);
    wrapper.setAttribute("gs-id", w.id);

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("grid-stack-item-content");
    wrapper.appendChild(contentDiv);
    grid.current.makeWidget(wrapper);

    import("react-dom/client").then((m) => {
      const root = m.createRoot(contentDiv);
      root.render(
        <Paper
          elevation={3}
          sx={{
            p: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            borderRadius: 3,
            // backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
          }}
        >
          <Box sx={{ position: "absolute", top: 4, right: 4 }}>
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="แก้ไขวิดเจ็ต">
                <IconButton
                  size="small"
                  onClick={() => handleEditWidget(w.id)}
                  color={ICON.EDIT.color}
                >
                  {ICON.EDIT.icon}
                </IconButton>
              </Tooltip>
              <Tooltip title="ลบวิดเจ็ต">
                <IconButton
                  size="small"
                  onClick={() => handleRemoveWidget(w.id)}
                  color={ICON.REMOVE.color}
                >
                  {ICON.REMOVE.icon}
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
            {w.title}
          </Typography>

          {w.type === "sensor" && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {realtime && w.sensorKey
                ? `${realtime[w.sensorKey]}`
                : "ไม่มีข้อมูลจากเซนเซอร์"}
            </Typography>
          )}

          {w.type === "sensorGroup" && realtime && (
            <Box sx={{ mt: 1 }}>
              <DeviceSensors data={realtime} />
            </Box>
          )}
        </Paper>
      );
    });
  };

  const handleUpdateLayout = async () => {
    try {
      if (!grid.current) return;
      const domNodes = grid.current.el.querySelectorAll(".grid-stack-item");
      const updated = widgets.map((w) => {
        const el = Array.from(domNodes).find(
          (el) => parseInt(el.getAttribute("gs-id")) === w.id
        );
        const node = el?.gridstackNode;
        return node ? { ...w, x: node.x, y: node.y, w: node.w, h: node.h } : w;
      });
      setWidgets(updated);
      await saveWidgetLayout(deviceId, updated);
      enqueueSnackbar("บันทึกผังวิดเจ็ตเรียบร้อยแล้ว", {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (error) {
      enqueueSnackbar(`เกิดข้อผิดพลาด: ${error}`, {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const handleAddWidget = (payload) => {
    setWidgets((prev) => [...prev, payload]);
    nextId.current += 1;
  };

  const handleAddSensor = (sensor) => {
    handleAddWidget({
      id: nextId.current,
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      type: `${sensor.sensor_type}`,
      title: `${sensor.sensor_type} (${sensor.sensor_id})`,
      sensorKey: sensor.sensor_id,
    });
  };

  const handleAddSensorGroup = () => {
    handleAddWidget({
      id: nextId.current,
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      type: "sensorGroup",
      title: "กลุ่มเซนเซอร์",
    });
  };

  const handleRemoveWidget = (id) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  };

  const handleEditWidget = (id) => {
    const title = window.prompt("ตั้งชื่อใหม่สำหรับวิดเจ็ตนี้:");
    if (title !== null) {
      setWidgets((prev) =>
        prev.map((w) => (w.id === id ? { ...w, title } : w))
      );
    }
  };

  const handleClearLayout = async () => {
    try {
      await deleteWidgetLayout(deviceId);
      setWidgets([]);
      handleCloseDialogWidgetRemove();
    } catch (error) {
      console.error("error handleClearLayout:", error);
    }
  };

  const handleOpenDialogWidgetRemove = () => setDialogWidgetRemove(true);
  const handleCloseDialogWidgetRemove = () => setDialogWidgetRemove(false);
  const handleOpenSideDrawerSensors = () => setOpenDrawerSensors(true);
  const handleCloseSideDrawerSensors = () => setOpenDrawerSensors(false);

  if (isLoading) return <BoxLoading />;

  return (
    <Box sx={{ p: 2 }}>
      <DialogConfirm
        open={openDialogWidgetRemove}
        title="ลบผังวิดเจ็ตทั้งหมด?"
        content="คุณต้องการลบวิดเจ็ตทั้งหมดออกจากหน้าจอหรือไม่?"
        handleClose={handleCloseDialogWidgetRemove}
        handleConfirm={handleClearLayout}
      />

      <Typography variant="h6" sx={{ mb: 1 }}>
        อุปกรณ์: {deviceId}
      </Typography>

      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 1 }}
      >
        <Stack direction="row" spacing={1}>
          <Button
            onClick={handleOpenSideDrawerSensors}
            variant="contained"
            size="small"
            startIcon={ICON.ADD.icon}
            color={ICON.ADD.color}
          >
            เพิ่มวิดเจ็ตข้อมูล
          </Button>
          <Button
            onClick={handleUpdateLayout}
            variant="contained"
            size="small"
            startIcon={ICON.SAVE.icon}
            color={ICON.SAVE.color}
          >
            บันทึกตำแหน่งวิดเจ็ต
          </Button>
        </Stack>
        <Button
          onClick={handleOpenDialogWidgetRemove}
          variant="outlined"
          size="small"
          startIcon={ICON.DELETE.icon}
          color={ICON.DELETE.color}
        >
          ลบวิดเจ็ตทั้งหมด
        </Button>
      </Stack>

      <DrawerSensorList
        open={openDrawerSensors}
        onClose={handleCloseSideDrawerSensors}
        sensors={sensors}
        onAddSensor={handleAddSensor}
        onAddSensorGroup={handleAddSensorGroup}
      />

      <Box
        sx={{
          width: "100%",
          height: "80vh",
          backgroundColor: theme.palette.grey[200],
          borderRadius: 2,
          border: "1px dashed #ccc",
        }}
      >
        <div className="grid-stack" ref={gridRef}></div>
      </Box>
    </Box>
  );
}
