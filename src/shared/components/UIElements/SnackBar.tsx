import React from 'react';
import {
  Snackbar
} from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';


const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface SnackBarProps {
  message: string,
  open: boolean
  close: (event: React.SyntheticEvent<Element, Event>) => void
}

const SnackBar = (props: SnackBarProps) => {

  return (
    <Snackbar
      autoHideDuration={5000}
      open={props.open}
      anchorOrigin={{ vertical:'bottom', horizontal: 'center'}}
      onClose={props.close}>
      <Alert severity='success' onClose={props.close}>
        {props.message}
      </Alert>
    </Snackbar>
  )
};

export default SnackBar