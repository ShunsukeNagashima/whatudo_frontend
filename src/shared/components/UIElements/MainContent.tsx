import React from 'react'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { drawerWidth } from './Navigation'

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '95vh',
    overflow: 'auto',
    position: 'relative',
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  copyRight: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: theme.spacing(2),
  },
}))

type MainContentProps = {
  content: JSX.Element
}

const MainContent = (props: MainContentProps) => {
  const classes = useStyles()
  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          {props.content}
        </Grid>
      </Container>
    </main>
  )
}

export default MainContent
