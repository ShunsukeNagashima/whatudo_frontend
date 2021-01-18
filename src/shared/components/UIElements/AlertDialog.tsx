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
  buttonType?: 'icon' | 'normal',
  show: boolean,
  linkText?: string | JSX.Element,
  dialogTitle: string,
  contentText: string,
  ok: string,
  ng: string,
  action: Function,
  openDialog?: (event?: React.SyntheticEvent<Element, Event>) => void
  closeDialog: (event: React.SyntheticEvent<Element, Event>) => void
}

const AlertDialog = (props: DialogProps) => {

  const continueAction = (action: Function) => {
    action()
  }

  let button: JSX.Element | null
  if (props.linkText) {
    if(props.buttonType! === 'icon') {
      button = (
        <IconButton onClick={props.openDialog}>
          {props.linkText}
        </IconButton>
      )
    } else {
      button = (
        <Button color="primary" onClick={props.openDialog}>
          {props.linkText}
        </Button>
      )
    }
  } else {
    button = null
  }


  return (
    <div>
      { button }
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
    </div>
  );
}

export default AlertDialog