import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText
} from '@material-ui/core'

interface DialogProps {
  show: boolean,
  dialogTitle: string,
  contentText: string,
  ok: string,
  ng: string,
  action: Function,
  closeDialog: any
}

const AlertDialog = (props: DialogProps) => {

  const continueAction = (action: Function) => {
    action()
    props.closeDialog()
  }

  return (
    <Dialog
      open={props.show}
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
        <Button onClick={props.closeDialog} color="primary">
          {props.ng}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AlertDialog