import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import DeviceSensors from "../../components/DeviceSensors";

import {
  getWidgetLayout,
  saveWidgetLayout,
  deleteWidgetLayout,
} from "../../services/widget_service";
import {
  subscribeDeviceRealtime,
  SysGetDeviceSensorsById,
} from "../../services/global_function";
import { useSnackbar } from "notistack";

import BoxLoading from "../../components/BoxLoading";
import DialogConfirm from "../../components/DaialogConfirm";

export default function FarmGridStackOverview() {
  const { deviceId } = useParams();
  const gridRef = useRef(null);
  const grid = useRef(null);
  const nextId = useRef(1);
  const isSavingRef = useRef(false);

  const [isLoading, setIsLoading] = useState(true);
  const [widgets, setWidgets] = useState([]);
  const [realtime, setRealtime] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const [openDaialogWidget, setOpenDaialogWidget] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

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
        <Paper sx={{ p: 1, position: "relative", height: "100%" }}>
          <IconButton
            size="small"
            sx={{ position: "absolute", top: 4, right: 4 }}
            onClick={() => handleRemoveWidget(w.id)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{ position: "absolute", top: 4, right: 30 }}
            onClick={() => handleEditWidget(w.id)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle2">{w.title}</Typography>
          {w.type === "sensor" && realtime && w.sensorKey && (
            <Typography variant="caption">
              {`${w.title}: ${realtime[w.sensorKey] ?? "ไม่มีข้อมูล"}`}
            </Typography>
          )}
          {w.type === "sensorGroup" && realtime && (
            <DeviceSensors data={realtime} />
          )}
        </Paper>
      );
    });
  };

  const handleUpdateLayout = async () => {
    try {
      if (!grid.current) return;

      // ✅ ดึง DOM elements ของทุก widget จาก GridStack container
      const domNodes = grid.current.el.querySelectorAll(".grid-stack-item");

      // ✅ สร้าง layout ใหม่ โดยอัปเดตตำแหน่งจาก gridstackNode ของแต่ละ element
      const updated = widgets.map((w) => {
        // 🔍 หา DOM element ที่มี gs-id ตรงกับ widget id
        const el = Array.from(domNodes).find(
          (el) => parseInt(el.getAttribute("gs-id")) === w.id
        );

        // 📦 gridstackNode เก็บข้อมูลตำแหน่งล่าสุดของ widget
        const node = el?.gridstackNode;

        // ✅ ถ้ามี node → อัปเดตตำแหน่งใหม่เข้า widget
        return node ? { ...w, x: node.x, y: node.y, w: node.w, h: node.h } : w; // ❌ ถ้าไม่เจอ node → คืนค่าเดิมไว้
      });

      // 🧠 อัปเดต state ให้ React จำตำแหน่งใหม่
      setWidgets(updated);

      // 💾 ส่งไป backend เพื่อบันทึก layout
      await saveWidgetLayout(deviceId, updated);
      enqueueSnackbar("บันทึก Layout สำเร็จ!", {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (error) {
      enqueueSnackbar(`Error: ${error}`, {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const handleAddWidget = (payload) => {
    const newWidgets = [...widgets, payload];
    setWidgets(newWidgets);
    nextId.current += 1;
    handleCloseMenu();
  };

  const handleAddSensor = (sensor) => {
    handleAddWidget({
      id: nextId.current,
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      type: "sensor",
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
      title: "Sensors",
    });
  };

  const handleRemoveWidget = (id) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  };

  const handleEditWidget = (id) => {

    handleOpenDaialogWidget();
    // const title = window.prompt("เปลี่ยนชื่อ Widget:");
    // if (title !== null) {
    //   setWidgets((prev) =>
    //     prev.map((w) => (w.id === id ? { ...w, title } : w))
    //   );
    // }
  };

  const handleClearLayout = async () => {
    if (window.confirm("ต้องการลบ Layout ทั้งหมด?")) {
      await deleteWidgetLayout(deviceId);
      setWidgets([]);
    }
  };

  const handleOpenDaialogWidget = async () => {
    setOpenDaialogWidget(true);
  };

  const handleCloseDaialogWidget = async () => {
    setOpenDaialogWidget(false);
  };


  if (isLoading) {
    return <BoxLoading />;
  }

  return (
    <Box sx={{ p: 2 }}>
      <DialogConfirm
        open={openDaialogWidget}
        handleClose={handleCloseDaialogWidget}
        handleConfirm={handleAddWidget}
        title="แก้ไข Widget"
      />

      <Typography variant="h6" sx={{ mb: 1 }}>
        อุปกรณ์: {deviceId}
      </Typography>

      <Stack
        direction="row"
        justifyContent={"space-between"}
        spacing={1}
        sx={{ mb: 1 }}
      >
        <Stack direction="row" about="true" spacing={1}>
          <Button onClick={handleOpenMenu} variant="contained" size="small">
            เพิ่ม Widget
          </Button>
          <Button
            onClick={handleUpdateLayout}
            variant="contained"
            color="info"
            size="small"
          >
            บันทึก Layout
          </Button>
        </Stack>
        <Button
          onClick={handleClearLayout}
          variant="outlined"
          color="error"
          size="small"
        >
          ลบ Layout ทั้งหมด
        </Button>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        {/* <MenuItem>
            <Typography>
              sensors.length: {sensors.length} - {typeof(sensors)}
            </Typography>
          </MenuItem> */}
        <MenuItem onClick={handleAddSensorGroup}>
          <Typography>-- เพิ่มทั้งหมด --</Typography>
        </MenuItem>
        {sensors.length > 0 &&
          sensors.map((item, index) => {
            console.log(item);
            return (
              <MenuItem
                key={`sensor-${index}`}
                onClick={() => handleAddSensor(item)}
              >
                <Typography>
                  {item.sensor_type} - ID: {item.sensor_id}
                </Typography>
              </MenuItem>
            );
          })}
      </Menu>

      <Box sx={{ width: "100%", height: "80vh" }}>
        <div className="grid-stack" ref={gridRef}></div>
      </Box>
    </Box>
  );
}
