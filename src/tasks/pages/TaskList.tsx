import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DataGrid, ColDef } from '@material-ui/data-grid';
import { AuthContext } from '../../shared/contexts/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { ProjectContext } from '../../shared/contexts/project-context';
import { formatDate } from '../../shared/utils/util-functions';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Snackbar from '../../shared/components/UIElements/SnackBar';

interface ITask {
  id: string,
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

const TaskList = () => {

  const auth = useContext(AuthContext);
  const project = useContext(ProjectContext);
  const [loadedTasks, setLoadedTask] = useState<any[]>([])
  const [message, setMessage] = useState<string>('');
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false);
  const { sendRequest, loading, error } = useHttpClient();
  const { state } = useLocation<stateType>()

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
  }, [sendRequest])

  const closeSnackBarHandler = () => {
    setShowSnackBar(false);
  };

  const columns: ColDef[] = [
    { field: 'id',
      headerName: 'ID',
      width:100
    },
    {
      field: 'title',
      headerName: 'タスク名',
      width: 200,
      renderCell: (params) => {
        return (<Link to={`/tasks/${params.getValue('id')}`}>{params.getValue('title')}</Link>)
      }
    },
    { field: 'category', headerName: 'カテゴリ', width: 100 },
    { field: 'status', headerName: 'ステータス', width: 120},
    { field: 'personInCharge', headerName: '担当者', width: 130 },
    { field: 'limitDate', headerName: '期限', width: 130 },
    { field: 'progress', type: 'number', headerName: '進捗率', width: 100, },
  ];

  const rows: any[] = []

  loadedTasks && loadedTasks.forEach((task: ITask) => {
    rows.push({
      id: task.taskId!,
      title: task.title,
      category: task.category.name,
      status: task.status,
      personInCharge: task.personInCharge?.name,
      limitDate: formatDate(new Date(task.limitDate), false),
      progress: task.progress + '%'
    })
  })

  if (error) {
    return (
      <div>
        Error!
      </div>
    )
  }

  return (
    <React.Fragment>
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
          close={closeSnackBarHandler}
          message={message}
        />
    </React.Fragment>
  );
};

export default TaskList;
