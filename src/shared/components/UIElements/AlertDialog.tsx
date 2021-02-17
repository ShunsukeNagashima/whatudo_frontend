import React from 'react'
import { withRouter, RouteComponentProps, useHistory } from 'react-router-dom'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from '@material-ui/core'

interface DialogProps extends RouteComponentProps {
  show: boolean
  dialogTitle: string
  contentText: string
  ok: string
  ng?: string
  actionForYes?: Function
  actionForNo?: Function
  closeDialog: any
  redirectTo?: string
}

const AlertDialog = (props: DialogProps) => {
  const history = useHistory()

  const actionForYes = (action?: Function) => {
    action && action()
    props.redirectTo && history.push(props.redirectTo)
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
        <Button
          onClick={() => actionForYes(props.actionForYes && props.actionForYes)}
          color="primary"
          autoFocus
        >
          {props.ok}
        </Button>
        {props.ng && (
          <Button
            onClick={() => actionForNo(props.actionForNo && props.actionForNo)}
            color="primary"
          >
            {props.ng}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default withRouter(AlertDialog)
