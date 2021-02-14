import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Link, Button, Toolbar, AppBar } from '@material-ui/core';
import { AuthContext } from '../../contexts/auth-context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      fontSize: '1.5em'
    },
    flexGlow: {
      flexGrow: 1,
    }
  }),
);

const Header = () => {
  const classes = useStyles();
  const authContext = useContext(AuthContext)
  const history = useHistory();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Link
            underline="none"
            color="inherit"
            href="/"
            className={classes.title}>
            WhatUDo
          </Link>
          <div className={classes.flexGlow} />
          { authContext.isLoggedIn && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={authContext.logout}
              >
              Logout
            </Button>
          )}
          { !authContext.isLoggedIn && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => history.push('/auth', {loginMode: true})}
              >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  )
};

export default Header;