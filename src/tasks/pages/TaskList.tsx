import React, { useState, useEffect, useContext } from 'react';
import { CircularProgress } from '@material-ui/core';
import { DataGrid, ColDef } from '@material-ui/data-grid';
import { AuthContext } from '../../shared/contexts/auth-context';
import useAxios from 'axios-hooks';

interface ITask {
  id: string,
  title: string,
  category: string,
  status: string,
  pic: string,
  limitDate: string,
  progress: number,
  taskId?: string
}

const TaskList = () => {

  const auth = useContext(AuthContext);
  const [loadedTasks, setLoadedTask] = useState<any[]>([])

  const  [{ data, loading, error }] = useAxios({
    url: 'http://localhost:5000/api/tasks',
    headers: {
      Authorization: 'Bearer ' + auth.token
    }
  })

  useEffect(() => {
    setLoadedTask(data);
  }, [data])

  const columns: ColDef[] = [
    { field: 'id', headerName: 'ID', width:100 },
    { field: 'title', headerName: 'タスク名', width: 200 },
    { field: 'category', headerName: 'カテゴリ', width: 100 },
    { field: 'status', headerName: 'ステータス', width: 120},
    { field: 'pic', headerName: '担当者', width: 130 },
    { field: 'limitDate', headerName: '期限', width: 130 },
    { field: 'progress', headerName: '進捗率', width: 100 },
  ];

  const rows: ITask[] = []

  console.log(loadedTasks)

  loadedTasks && loadedTasks.forEach((task: ITask) => {
    rows.push({
      id: task.taskId!,
      title: task.title,
      category: task.category,
      status: task.status,
      pic: task.pic,
      limitDate: task.limitDate,
      progress: task.progress
    })
  })

  if (error) {
    return (
      <div>
        Error!
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div style={{ height: 400, width: '100%'}}>
      <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection/>
    </div>
  );
};

export default TaskList;
