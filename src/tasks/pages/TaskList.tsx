import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DataGrid, ColDef } from '@material-ui/data-grid';
import {
  Button,
  Select,
  FormControl,
  MenuItem,
  Checkbox,
  FormControlLabel,
  InputLabel
 } from '@material-ui/core';
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
  category:{
    _id: string
    name: string;
  },
  status: string,
  personInCharge: {
    _id: string,
    name: string
  },
  limitDate: string,
  progress: number,
  taskId?: string
}

interface stateType {
  message: string
}

const useStyles = makeStyles((theme) =>
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
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    btn: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1)
    },
    optionForm: {
      display: 'flex',
      alignItems: 'flex-end'
    }
  })
)

const TaskList = () => {

  const authContext = useContext(AuthContext);
  const projectContext = useContext(ProjectContext);
  const [loadedTasks, setLoadedTask] = useState<ITask[]>([])
  const [filteredTasks, setFilteredTasks] = useState<ITask[]>([])
  const [searchOptions, setSearchOptions] = useState<{[key: string]: string}[]>([]);
  const [options, setOptions] = useState<{_id: string, name: string}[]>([]);
  const [showSelect, setShowSelect] = useState<boolean>(false);
  const [fetchedCategories, setFetchedCategories] = useState<any[]>([])
  const [message, setMessage] = useState<string>('');
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const { sendRequest, loading, error, clearError } = useHttpClient();
  const { state } = useLocation<stateType>()
  const classes = useStyles();
  const optionNameRef = useRef<HTMLSelectElement>(null);
  const optionValueRef = useRef<HTMLSelectElement>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const responseData = await sendRequest(
        `http://localhost:5000/api/tasks?projectId=${projectContext.selectedProject!._id}`,
        'GET',
        null,
        {
          Authorization: `Bearer ${authContext.token}`
        }
      );
      setLoadedTask(responseData.data.tasks)
      setFilteredTasks(responseData.data.tasks)
    }
    fetchTasks()
    if(state) {
      setMessage(state.message)
      setShowSnackBar(true)
    }
    state && setMessage(state.message)
  }, [sendRequest, projectContext.selectedProject])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/categories',
          'GET',
          null,
          {
            Authorization: `Bearer ${authContext.token}`
          }
        )
        setFetchedCategories(responseData.data)
      } catch(err) {}
    }
    fetchCategories()
  }, [])

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
        Authorization: `Bearer ${authContext.token}`
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

  filteredTasks && filteredTasks.forEach((task: ITask) => {
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

  const setChoicesHandler = (event: React.ChangeEvent<{ value: unknown }>) => {
      switch(event.target.value) {
        case 'カテゴリ':
          setOptions(fetchedCategories);
          break;
        case '担当者':
          const pics = projectContext.selectedProject?.users.map(u => {
            return {_id: u._id, name: u.name}
          })
          setOptions(pics!);
          break;
        case 'ステータス':
          setOptions([
            { _id: '新規', name: '新規'},
            { _id: '進行中', name: '進行中'},
            { _id: '確認待ち', name: '確認待ち'},
            {_id: '完了', name: '完了'}
        ]);
        break;
      }
  }

  const switchConditionHandler = () => {
    setIsChecked(prevState => !prevState)
    if (!isChecked) {
      const innerText = optionValueRef?.current?.innerText
      switch(optionNameRef?.current?.innerText) {
        case 'カテゴリ':
          setFilteredTasks(loadedTasks.filter(t => t.category.name === innerText))
          break;
        case '担当者':
          setFilteredTasks(loadedTasks.filter(t => t.personInCharge.name === innerText))
          break;
        case 'ステータス':
          setFilteredTasks(loadedTasks.filter(t => t.status === innerText))
          break;
    　}
    } else {
      setFilteredTasks(loadedTasks)
    }
    setSearchOptions([]);
    console.log(searchOptions);
  }

  const selectOptionHandler = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (isChecked) {
      const innerText = event.target.value
      console.log(innerText)
      switch(optionNameRef?.current?.innerText) {
        case 'カテゴリ':
          setFilteredTasks(loadedTasks.filter(t => t.category._id === innerText))
          break;
        case '担当者':
          setFilteredTasks(loadedTasks.filter(t => t.personInCharge._id === innerText))
          break;
        case 'ステータス':
          setFilteredTasks(loadedTasks.filter(t => t.status === innerText))
          break;
    　}
    }
  }


  return (
    <React.Fragment>
      {errorModal}
      <LoadingSpinner isLoading={loading}/>
      {showSelect &&
          <Container className={classes.optionForm}>
          <FormControl className={classes.formControl}>
            <InputLabel>絞込対象</InputLabel>
            <Select
              ref={optionNameRef}　
              onChange={setChoicesHandler}
            >
              <MenuItem value="カテゴリ">カテゴリ</MenuItem>
              <MenuItem value="担当者">担当者</MenuItem>
              <MenuItem value="ステータス">ステータス</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
          <InputLabel>絞込条件</InputLabel>
            <Select
              ref={optionValueRef}
              onChange={selectOptionHandler}
            >
            {options.length > 0 && options.map(o => {
              return <MenuItem value={o._id}>{o.name}</MenuItem>
            })}

            </Select>
          </FormControl>
          <FormControlLabel
            control={<Checkbox onChange={switchConditionHandler} />}
            label="適用"
          />
          </Container>
      }
      {!showSelect &&
        <Button
          className={classes.btn}
          variant="outlined"
          color="primary"
          onClick={() => setShowSelect(true)}
        >
        条件で絞り込む
      </Button>
       }
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
