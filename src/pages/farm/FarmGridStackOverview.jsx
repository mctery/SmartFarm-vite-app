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

import { GridStack } from "gridstack";
import { GridStackWidgetCore } from "../../components/GridStack/GridStackWidgetCore";
import "gridstack/dist/gridstack.min.css";

import BoxLoading from "../../components/BoxLoading";
import DialogConfirm from "../../components/DaialogConfirm";
import DrawerSensorList from "../../components/GridStack/DrawerSensorList";


import {
  getWidgetLayout,
  saveWidgetLayout,
  deleteWidgetLayout,
} from "../../services/widget_service";
import {
  SysGetDeviceSensorsById,
} from "../../services/sensor_service";
import { ICON } from "../../services/global_variable";
import { getUserInfo } from "../../services/storage_service";


export default function FarmGridStackOverview() {
  const { deviceId } = useParams();
  const gridRef = useRef(null);
  const grid = useRef(null);
  const nextId = useRef(1);
  const isSavingRef = useRef(false);
  const theme = useTheme();

  const CURRENT_USER_ID = getUserInfo().user_id;

  const [isLoading, setIsLoading] = useState(true);
  const [widgets, setWidgets] = useState([]);
  const [openDrawerSensors, setOpenDrawerSensors] = useState(false);
  const [sensors, setSensors] = useState([]);
  const [openDialogWidgetRemove, setDialogWidgetRemove] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const refreshSensors = async () => {
    const latest = await SysGetDeviceSensorsById(deviceId);
    setSensors(latest);
  };

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

  const addWidgetToGrid = (widget) => {
    if (!grid.current) return;

    const wrapper = document.createElement("div");
    wrapper.classList.add("grid-stack-item");
    wrapper.setAttribute("gs-x", widget.x);
    wrapper.setAttribute("gs-y", widget.y);
    wrapper.setAttribute("gs-w", widget.w);
    wrapper.setAttribute("gs-h", widget.h);
    wrapper.setAttribute("gs-id", widget.id);

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("grid-stack-item-content");
    wrapper.appendChild(contentDiv);
    grid.current.makeWidget(wrapper);

    import("react-dom/client").then((m) => {
      const root = m.createRoot(contentDiv);
      root.render(<GridStackWidgetCore deviceId={deviceId} widget={widget} onEdit={handleEditWidget} onDelete={handleRemoveWidget}/>);
    });
  };

  const handleUpdateLayout = async () => {
    try {
      if (!grid.current) return;
      
      const domNodes = grid.current.el.querySelectorAll(".grid-stack-item");
      const updated = widgets.map((w) => {
        const el = Array.from(domNodes).find((el) => parseInt(el.getAttribute("gs-id")) === w.id);
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

  const handleAddSensor = async (sensor) => {
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
    await refreshSensors();
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

  const handleUpdateSensor = async () => {
    await refreshSensors();
  };
  const handleDeleteSensor = async () => {
    await refreshSensors();
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

      <Typography variant="h6" sx={{ mb: 1 }}>อุปกรณ์: {deviceId}</Typography>

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
            เพิ่มวิดเจ็ตเซนเซอร์
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
        currentUserId={CURRENT_USER_ID}
        deviceId={deviceId}
        open={openDrawerSensors}
        sensors={sensors}
        onClose={handleCloseSideDrawerSensors}
        onAddSensor={handleAddSensor}
        onAddSensorGroup={handleAddSensorGroup}
        onUpdateSensor={handleUpdateSensor}
        onDeleteSensor={handleDeleteSensor}
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
