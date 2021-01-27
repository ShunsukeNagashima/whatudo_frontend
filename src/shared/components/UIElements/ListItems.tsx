import React from 'react';
import {Link} from 'react-router-dom'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import CreateIcon from '@material-ui/icons/Create';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { styled } from '@material-ui/core';

const CustomLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit'
})

export const mainListItems = (
  <div>
    <CustomLink to="/projects/new" >
      <ListItem button>
        <ListItemIcon>
        <CreateNewFolderIcon color='primary'/>
        </ListItemIcon>
        <ListItemText primary="新規プロジェクト" />
      </ListItem>
    </CustomLink>
    <CustomLink to="/tasks/new" >
      <ListItem button>
        <ListItemIcon>
          <CreateIcon color='primary' />
        </ListItemIcon>
        <ListItemText primary="新規タスク"/>
      </ListItem>
    </CustomLink>
    <CustomLink to="/tasks">
      <ListItem button>
        <ListItemIcon>
          <ListAltIcon color='primary' />
        </ListItemIcon>
        <ListItemText primary="タスク一覧" />
      </ListItem>
    </CustomLink>
    <CustomLink to="/projects/invite">
      <ListItem button>
        <ListItemIcon>
          <PersonAddIcon color='primary' />
        </ListItemIcon>
        <ListItemText primary="メンバー招待" />
      </ListItem>
    </CustomLink>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);