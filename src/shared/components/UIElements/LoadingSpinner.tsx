import React from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
}));

interface LoadingSpinnerProps {
  isLoading: boolean
}

const LoadingSpinner = (props: LoadingSpinnerProps) => {

  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={props.isLoading}>
      <CircularProgress />
    </Backdrop>
  )
}


export default LoadingSpinner