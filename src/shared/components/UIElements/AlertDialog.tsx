import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  IconButton
} from '@material-ui/core'

interface DialogProps {
  buttonType: 'icon' | 'normal',
  linkText: string | JSX.Element,
  dialogTitle: string,
  contentText: string,
  ok: string,
  ng: string,
  action: Function
}

const AlertDialog = (props: DialogProps) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const continueAction = (action: Function) => {
    action()
    setOpen(false)
  }

  return (
    <div>
      {props.buttonType === 'icon'?
        <IconButton onClick={handleClickOpen}>
          {props.linkText}
        </IconButton>
      :
        <Button color="primary" onClick={handleClickOpen}>
          {props.linkText}
        </Button>
      }
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.contentText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => continueAction(props.action)} color="primary" autoFocus>
            {props.ok}
          </Button>
          <Button onClick={handleClose} color="primary">
            {props.ng}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AlertDialog