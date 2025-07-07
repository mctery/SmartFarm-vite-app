import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

import { ICON } from "../services/global_variable";

export default function DialogConfirm({
  open,
  handleClose,
  handleConfirm,
  title,
  content,
}) {
  const onClose = () => {
    handleClose();
  };

  const onConfirm = () => {
    handleConfirm();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Typography>{title}</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" size="small" onClick={onClose} color={ICON.ERROR.color}>
          ยกเลิก
        </Button>
        <Button variant="contained" size="small" onClick={onConfirm} autoFocus color={ICON.SUCCESS.color}>
          ตกลง
        </Button>
      </DialogActions>
    </Dialog>
  );
}
