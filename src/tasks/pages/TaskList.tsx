import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DataGrid, ColDef } from '@material-ui/data-grid';
import { AuthContext } from '../../shared/contexts/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { ProjectContext } from '../../shared/contexts/project-context';
import { formatDate } from '../../shared/utils/util-functions';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Snackbar from '../../shared/components/UIElements/SnackBar';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
 IconButton,
 Container
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AlertDialog from '../../shared/components/UIElements/AlertDialog';
import Modal from '../../shared/components/UIElements/Modal'

interface ITask {
  _id: string,
  title: string,
  category: {
    name: string;
  },
  status: string,
  personInCharge: {
    name: string
  },
  limitDate: string,
  progress: number,
  taskId?: string
}

interface stateType {
  message: string
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'relative'
    },
    icon: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    },
    taskTitle: {
      margin: '0 auto'
    }
  })
)

const TaskList = () => {

  const auth = useContext(AuthContext);
  const project = useContext(ProjectContext);
  const [loadedTasks, setLoadedTask] = useState<any[]>([])
  const [message, setMessage] = useState<string>('');
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const { sendRequest, loading, error, clearError } = useHttpClient();
  const { state } = useLocation<stateType>()
  const classes = useStyles();

  useEffect(() => {
    const fetchTasks = async () => {
      const responseData = await sendRequest(
        `http://localhost:5000/api/tasks?projectId=${project.selectedProject!._id}`,
        'GET',
        null,
        {
          Authorization: `Bearer ${auth.token}`
        }
      );
      setLoadedTask(responseData.data.tasks)
    }
    fetchTasks()
    if(state) {
      setMessage(state.message)
      setShowSnackBar(true)
    }
    state && setMessage(state.message)
  }, [sendRequest, project.selectedProject])

  const openDialog = () => {
    setShowDialog(true);
  }

  const closeDialog = () => {
    setShowDialog(false);
  }

  const closeSnackBar = () => {
    setShowSnackBar(false);
  };

  const deleteTaskHandler = async (taskId: string) => {
    const responseData = await sendRequest(
      `http://localhost:5000/api/tasks/${taskId}`,
      'DELETE',
      null,
      {
        Authorization: `Bearer ${auth.token}`
      }
    )
    const updatedTasks = loadedTasks.filter(t => t._id !== taskId)
    setMessage(responseData.data.message);
    setShowSnackBar(true);
    setLoadedTask(updatedTasks);
  };

  const columns: ColDef[] = [
    { field: 'objId', hide: true },
    { field: 'id', headerName: 'ID', width:100, headerAlign: 'center', align: 'center'},
    {
      field: 'title',
      headerName: 'タスク名',
      width: 200,
      headerAlign: 'center',
      renderCell: (params) => {
        return (<Link className={classes.taskTitle} to={`/tasks/${params.getValue('id')}`}>{params.getValue('title')}</Link>)
      }
    },
    { field: 'category', headerName: 'カテゴリ', width: 100, headerAlign: 'center', align: 'center' },
    { field: 'status', headerName: 'ステータス', width: 120, headerAlign: 'center', align: 'center'},
    { field: 'personInCharge', headerName: '担当者', width: 130, headerAlign: 'center', align: 'center' },
    { field: 'limitDate', headerName: '期限', width: 130, headerAlign: 'center', align: 'center' },
    { field: 'progress', type: 'number', headerName: '進捗率', width: 100, headerAlign: 'center' },
    {
      field:
      'delete',
      headerName: '削除',
      headerAlign: 'center',
      width: 80,
      renderCell: (param) => {
        return (
          <Container className={classes.root}>
            <IconButton className={classes.icon} onClick={openDialog}>
              <DeleteIcon />
            </IconButton>

            <AlertDialog
              show={showDialog}
              dialogTitle='Delete Task'
              contentText='タスクを削除します。よろしいですか？'
              ok='OK'
              ng='キャンセル'
              actionForYes={() => deleteTaskHandler(param.getValue('objId')!.toString())}
              closeDialog={closeDialog}
            />
          </Container>
        )
      }
    }
  ];

  const rows: any[] = []

  loadedTasks && loadedTasks.forEach((task: ITask) => {
    rows.push({
      objId: task._id,
      id: task.taskId!,
      title: task.title,
      category: task.category.name,
      status: task.status,
      personInCharge: task.personInCharge?.name,
      limitDate: formatDate(new Date(task.limitDate), false),
      progress: task.progress + '%'
    })
  })

  let errorModal;
  if (error?.response) {
    errorModal =  (
        <Modal
          title={error.response?.statusText}
          description={error.response?.data.message}
          show={!!error}
          closeModal={clearError}
        />
    )
  }

  return (
    <React.Fragment>
      {errorModal}
      <LoadingSpinner isLoading={loading}/>
      <div style={{ height: '85vh', width: '100%'}}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          />
      </div>

      <Snackbar
          open={showSnackBar}
          close={closeSnackBar}
          message={message}
        />
    </React.Fragment>
  );
};

export default TaskList;
