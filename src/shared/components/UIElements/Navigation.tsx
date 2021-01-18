import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  Button,
  List,
  Select,
  MenuItem,
  FormControl
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { mainListItems } from './ListItems';
import { navStyles } from '../../../assets/navStyles';
import { AuthContext } from '../../contexts/auth-context';
import { ProjectContext } from '../../contexts/project-context';
import { IProject } from '../../interfaces/shared-interfaces';

const Navigation = () => {
  const authContext = useContext(AuthContext);
  const projectContext = useContext(ProjectContext);
  const classes = navStyles();
  const [open, setOpen] = React.useState(true);
  const history = useHistory();

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const changeProject = (project: IProject) => {
    projectContext.selectProject(project)
    history.push('/');
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuItem, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            WhatUDo
          </Typography>

          <FormControl variant='outlined'>
            <Select
              className={classes.menuItem}
              style={{'backgroundColor': '#fff'}}
              id="project"
              labelId="project"
              defaultValue={projectContext.selectedProject?._id}
            >
              {
                authContext.projects && authContext.projects.map(p => {
                  return (
                    <MenuItem
                      onClick={() => changeProject(p)}
                      value={p._id}>
                      {p.name}
                    </MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>

          <Link
            className={classes.menuItem}
            style={{
              color: 'inherit',
              textDecoration: 'none'
            }}
            to='/projects/new'
            >
            New Project
          </Link>

          <Button
            color="inherit"
            onClick={authContext.logout}
            >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
        {/* <Divider /> */}
        {/* <List>{secondaryNavItems}</List> */}
      </Drawer>
    </div>
  );
}

export default Navigation