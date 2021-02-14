import React from 'react';
import {Link} from 'react-router-dom'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import CreateIcon from '@material-ui/icons/Create';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { styled } from '@material-ui/core';

const CustomLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit'
})

interface ListItemsProps {
  closeSideBar: any
}

const ListItems = (props: ListItemsProps) => {
  return(
  <div>
    <CustomLink to="/projects/new" onClick={props.closeSideBar}>
      <ListItem button>
        <ListItemIcon>
        <CreateNewFolderIcon color='primary'/>
        </ListItemIcon>
        <ListItemText primary="新規プロジェクト" />
      </ListItem>
    </CustomLink>
    <CustomLink to="/tasks/new" onClick={props.closeSideBar}>
      <ListItem button>
        <ListItemIcon>
          <CreateIcon color='primary' />
        </ListItemIcon>
        <ListItemText primary="新規タスク"/>
      </ListItem>
    </CustomLink>
    <CustomLink to="/tasks" onClick={props.closeSideBar} >
      <ListItem button>
        <ListItemIcon>
          <ListAltIcon color='primary' />
        </ListItemIcon>
        <ListItemText primary="タスク一覧" />
      </ListItem>
    </CustomLink>
    <CustomLink to="/projects/invite" onClick={props.closeSideBar}>
      <ListItem button>
        <ListItemIcon>
          <PersonAddIcon color='primary' />
        </ListItemIcon>
        <ListItemText primary="メンバー招待" />
      </ListItem>
    </CustomLink>
  </div>
  )
};

export default ListItems
