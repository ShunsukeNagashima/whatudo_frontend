import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { DataGrid, ColDef } from '@material-ui/data-grid';
import { AuthContext } from '../../shared/contexts/auth-context';
import useAxios from 'axios-hooks';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { ProjectContext } from '../../shared/contexts/project-context';

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

const TaskList = () => {

  const auth = useContext(AuthContext);
  const project = useContext(ProjectContext);
  const [loadedTasks, setLoadedTask] = useState<any[]>([])

  const  [{ data, loading, error }] = useAxios({
    url: 'http://localhost:5000/api/tasks/' + project.selectedProject!._id,
    headers: {
      Authorization: 'Bearer ' + auth.token
    }
  })

  useEffect(() => {
    setLoadedTask(data);
  }, [data])

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

  console.log(loadedTasks)

  loadedTasks && loadedTasks.forEach((task: ITask) => {
    console.log(task.category)
    rows.push({
      id: task.taskId!,
      title: task.title,
      category: task.category.name,
      status: task.status,
      personInCharge: task.personInCharge.name,
      limitDate: task.limitDate,
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
    </React.Fragment>
  );
};

export default TaskList;
