import React from 'react'
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  CssBaseline,
  Typography,
  Hidden,
  Button
} from '@material-ui/core'
import Auth from './Auth'
import BackGround from '../../assets/image/luis-villasmil-mlVbMbxfWI4-unsplash.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '95vh',
    background: `-webkit-linear-gradient(bottom, rgba(28, 146, 210, .3), rgba(242, 252, 254, .3)), url(${BackGround})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: '0 50%',
    position: 'relative'
  },
  auth: {
    backgroundColor: '#fff',
    height: '500px',
    position: 'absolute',
    top: '5%',
    right: '5%',
    borderRadius: '50px'
  },
  textArea: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '10%',
    color: 'white',
    alignItems: 'center'
  },
  appName: {
    color: '#FFFF11'
  },
  marginTop: {
    marginTop: theme.spacing(2)
  },
  mainText: {
    [theme.breakpoints.down('md')]: {
      fontSize: '4rem'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '2rem'
    }
  },
  subText: {
    [theme.breakpoints.down('md')]: {
      fontSize: '2.5rem'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.2rem'
    },
  },
  button: {
    textAlign: 'center',
    marginTop: theme.spacing(8)
  },
  copyRight: {
    position: 'absolute',
    bottom: 0,
    color: 'white',
    padding: theme.spacing(2),
    fontSize: '1rem',
    width: '100%'
  }
}))

const TopPage = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Grid container component="main" className={classes.root}>
       <CssBaseline />
       <Grid item xs={false} sm={12} md={7} className={classes.textArea}>
         <Typography variant="h1" className={classes.mainText}>
           Make a Life Simple.
         </Typography>
         <Typography variant="h3" className={`${classes.marginTop} ${classes.subText}`}>
           <span className={classes.appName}>WhatUDo</span>はあなたのやるべきことを完璧に管理するためのプロジェクト管理アプリケーションです。
         </Typography>

         <Hidden mdUp>
            <Grid  className={classes.button} item xs={12} sm={12} md={5} >
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => history.push('/auth', {loginMode: false})}
                  >Sign Up For Free
                </Button>
            </Grid>
          </Hidden>
       </Grid>

       <Hidden smDown>
          <Grid className={classes.auth} item xs={12} sm={8} md={5} >
              <Auth loginMode={false} />
          </Grid>
       </Hidden>
       <Typography className={classes.copyRight} variant="body2"  align="center">
        {'Copyright © Shunsuke Nagashima '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Grid>

  )
}

export default TopPage;