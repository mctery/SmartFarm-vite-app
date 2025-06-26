import HomeIcon from "@mui/icons-material/Home";
import EventNoteIcon from "@mui/icons-material/EventNote";
import FiberSmartRecordIcon from "@mui/icons-material/FiberSmartRecord";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SettingsIcon from "@mui/icons-material/Settings";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import DevicesIcon from '@mui/icons-material/Devices';

export const NAVIGATION = [
  {
    kind: "header",
    title: "เมนูหลัก",
  },
  {
    segment: "dashboard",
    title: "หน้าหลัก",
    icon: <HomeIcon />,
  },
  {
    segment: "activity_reporting_system",
    title: "ระบบรายงานกิจกรรม",
    icon: <EventNoteIcon />,
  },
  {
    segment: "activity_recording_system",
    title: "ระบบบันทึกกิจกรรม",
    icon: <FiberSmartRecordIcon />,
  },
  {
    segment: "farm_control_system",
    title: "ระบบควบคุมฟาร์ม",
    icon: <AgricultureIcon />,
    children: [
      {
        segment: "devices",
        title: "อุปกรณ์",
        icon: <DevicesIcon />,
      },
    ],
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "ระบบ",
  },
  {
    segment: "about",
    title: "เกี่ยวกับ",
    icon: <AssignmentIndIcon />,
  },
  {
    segment: "help",
    title: "คู่มือการใช้งาน",
    icon: <ContactSupportIcon />,
  },
  {
    segment: "settings",
    title: "การตั้งค่า",
    icon: <SettingsIcon />,
  },
  // {
  //   segment: "reports",
  //   title: "Reports",
  //   icon: <BarChartIcon />,
  //   children: [
  //     {
  //       segment: "sales",
  //       title: "Sales",
  //       icon: <DescriptionIcon />,
  //     },
  //     {
  //       segment: "traffic",
  //       title: "Traffic",
  //       icon: <DescriptionIcon />,
  //     },
  //   ],
  // },
];
