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
  ng?: string,
  actionForYes?: Function,
  actionForNo?: Function
  closeDialog: any
}

const AlertDialog = (props: DialogProps) => {

  const actionForYes = (action?: Function) => {
    action && action()
    props.closeDialog()
  }

  const actionForNo = (action?: Function) => {
    action && action()
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
        <Button onClick={() => actionForYes(props.actionForYes && props.actionForYes)} color="primary" autoFocus>
          {props.ok}
        </Button>
        {props.ng &&
        <Button onClick={() => actionForNo(props.actionForNo && props.actionForNo)} color="primary">
          {props.ng}
        </Button>
        }
      </DialogActions>
    </Dialog>
  );
}

export default AlertDialog