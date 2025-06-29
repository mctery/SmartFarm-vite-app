import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import DeviceSensors from '../../components/DeviceSensors';

import {
  getWidgetLayout,
  saveWidgetLayout,
} from '../../service/widget_service';
import {
  subscribeDeviceRealtime,
  SysGetDeviceSensors,
} from '../../service/global_function';

export default function FarmGridStackOverview() {
  const { deviceId } = useParams();
  const gridRef = useRef(null);
  const grid = useRef(null);
  const nextId = useRef(1);
  const [widgets, setWidgets] = useState([]);
  const [realtime, setRealtime] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const unsub = subscribeDeviceRealtime(deviceId, (msg) => {
      setRealtime(msg);
    });
    return unsub;
  }, [deviceId]);

  useEffect(() => {
    (async () => {
      const list = await SysGetDeviceSensors(deviceId);
      setSensors(Array.isArray(list) ? list : []);
    })();
  }, [deviceId]);

  useEffect(() => {
    (async () => {
      const data = await getWidgetLayout(deviceId);
      setWidgets(Array.isArray(data) ? data : []);
      const maxId = data.reduce((m, w) => (w.id > m ? w.id : m), 0);
      nextId.current = maxId + 1;
    })();
  }, [deviceId]);

  useEffect(() => {
    if (!gridRef.current) return;
    if (grid.current) grid.current.destroy();
    grid.current = GridStack.init(
      { cellHeight: 100, float: true, margin: 5, disableOneColumnMode: true },
      gridRef.current
    );
    widgets.forEach((w) => addWidgetToGrid(w));
    return () => {
      grid.current && grid.current.destroy();
    };
  }, [widgets]);

  const addWidgetToGrid = (w) => {
    if (!grid.current) return;
    const wrapper = document.createElement('div');
    wrapper.classList.add('grid-stack-item');
    wrapper.setAttribute('data-gs-id', w.id);
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('grid-stack-item-content');
    wrapper.appendChild(contentDiv);
    grid.current.addWidget(wrapper, { x: w.x, y: w.y, w: w.w, h: w.h });
    const Component = () => {
      return (
        <Paper sx={{ p: 1, position: 'relative', height: '100%' }}>
          <IconButton
            size="small"
            sx={{ position: 'absolute', top: 4, right: 4 }}
            onClick={() => handleRemoveWidget(w.id)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{ position: 'absolute', top: 4, right: 30 }}
            onClick={() => handleEditWidget(w.id)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle2">{w.title}</Typography>
          {w.type === 'sensor' && realtime && w.sensorKey && (
            <Typography variant="caption">
              {`${w.title}: ${realtime[w.sensorKey] ?? ''}`}
            </Typography>
          )}
          {w.type === 'sensorGroup' && realtime && (
            <DeviceSensors data={realtime} />
          )}
        </Paper>
      );
    };
    // React 18 root render
    import('react-dom/client').then((m) => {
      const root = m.createRoot(contentDiv);
      root.render(<Component />);
    });
  };

  const handleAddSensor = async (sensor) => {
    const payload = {
      id: nextId.current,
      x: 0,
      y: 0,
      w: 4,
      h: 2,
      type: 'sensor',
      title: sensor?.name || sensor?.title || 'Sensor Widget',
      sensorKey: sensor?.name || sensor?.port || sensor?.id,
    };
    setWidgets((prev) => {
      const newWidgets = [...prev, payload];
      saveWidgetLayout(deviceId, newWidgets);
      return newWidgets;
    });
    nextId.current += 1;
    handleCloseMenu();
  };

  const handleAddSensorGroup = () => {
    const payload = {
      id: nextId.current,
      x: 0,
      y: 0,
      w: 4,
      h: 3,
      type: 'sensorGroup',
      title: 'Sensors',
    };
    setWidgets((prev) => {
      const newWidgets = [...prev, payload];
      saveWidgetLayout(deviceId, newWidgets);
      return newWidgets;
    });
    nextId.current += 1;
    handleCloseMenu();
  };


  const handleRemoveWidget = async (id) => {
    setWidgets((prev) => {
      const newWidgets = prev.filter((w) => w.id !== id);
      saveWidgetLayout(deviceId, newWidgets);
      return newWidgets;
    });
  };

  const handleEditWidget = async (id) => {
    const title = window.prompt('Widget title');
    if (title !== null) {
      setWidgets((prev) => {
        const newWidgets = prev.map((w) => (w.id === id ? { ...w, title } : w));
        saveWidgetLayout(deviceId, newWidgets);
        return newWidgets;
      });
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        อุปกรณ์: {deviceId}
      </Typography>
      <Box sx={{ mb: 1 }}>
        <Button onClick={handleOpenMenu} variant="contained" size="small">
          เพิ่ม Widget
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
          <MenuItem onClick={handleAddSensorGroup}>เซนเซอร์ทั้งหมด</MenuItem>
          {sensors.map((s) => (
            <MenuItem
              key={s.id || s.port || s.name}
              onClick={() => {
                handleAddSensor(s);
                handleCloseMenu();
              }}
            >
              {s.name || s.title || s.id}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Box sx={{ width: '100%', height: '80vh' }}>
        <div className="grid-stack" ref={gridRef}></div>
      </Box>
    </Box>
  );
}
