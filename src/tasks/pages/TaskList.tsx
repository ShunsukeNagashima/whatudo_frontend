import React, { useState, useEffect, useContext, useRef } from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { DataGrid, ColDef } from '@material-ui/data-grid'
import {
  Button,
  Select,
  FormControl,
  MenuItem,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Hidden,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Paper,
  Divider,
  AccordionActions,
} from '@material-ui/core'
import { AuthContext } from '../../shared/contexts/auth-context'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { ProjectContext } from '../../shared/contexts/project-context'
import { formatDate } from '../../shared/utils/util-functions'
import { useHttpClient } from '../../shared/hooks/http-hook'
import Snackbar from '../../shared/components/UIElements/SnackBar'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { IconButton, Container } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import AlertDialog from '../../shared/components/UIElements/AlertDialog'
import Modal from '../../shared/components/UIElements/Modal'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

interface ITask {
  _id: string
  title: string
  description: string
  category: {
    _id: string
    name: string
  }
  status: string
  personInCharge: {
    _id: string
    name: string
  }
  limitDate: string
  progress: number
  taskId?: string
}

interface stateType {
  message: string
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    taskTitle: {
      margin: '0 auto',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 100,
    },
    btn: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      alignSelf: 'flex-start',
    },
    optionForm: {
      display: 'flex',
      alignItems: 'flex-end',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexShrink: 0,
      flexBasis: '50.33%',
      marginRight: theme.spacing(3),
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    accordion: {
      width: '100%',
    },
    accordionDetails: {
      display: 'flex',
      flexDirection: 'column',
    },
    paper: {
      alignSelf: 'center',
      margin: theme.spacing(4),
      padding: theme.spacing(4),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '85%',
    },
    marginBottom: {
      marginBottom: theme.spacing(2),
    },
  }),
)

const TaskList = () => {
  const authContext = useContext(AuthContext)
  const projectContext = useContext(ProjectContext)
  const [loadedTasks, setLoadedTask] = useState<ITask[]>([])
  const [filteredTasks, setFilteredTasks] = useState<ITask[]>([])
  const [searchOptions, setSearchOptions] = useState<
    { [key: string]: string }[]
  >([])
  const [options, setOptions] = useState<{ id: string; name: string }[]>([])
  const [showSelect, setShowSelect] = useState<boolean>(false)
  const [fetchedCategories, setFetchedCategories] = useState<any[]>([])
  const [fetchedUsers, setFetchedUsers] = useState<any[]>([])
  const [message, setMessage] = useState<string>('')
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const { sendRequest, loading, error, clearError } = useHttpClient()
  const { state } = useLocation<stateType>()
  const classes = useStyles()
  const optionNameRef = useRef<HTMLSelectElement>(null)
  const optionValueRef = useRef<HTMLSelectElement>(null)
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [expanded, setExpanded] = React.useState<string | false>(false)
  const history = useHistory()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${projectContext.selectedProject?._id}`,
          'GET',
          null,
          {
            Authorization: `Bearer ${authContext.token}`,
          },
        )
        setFetchedUsers(responseData.data)
      } catch (err) {}
    }
    fetchUsers()
  }, [sendRequest, authContext.token, projectContext.selectedProject])

  useEffect(() => {
    const fetchTasks = async () => {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/tasks?projectId=${
          projectContext.selectedProject!._id
        }`,
        'GET',
        null,
        {
          Authorization: `Bearer ${authContext.token}`,
        },
      )
      setLoadedTask(responseData.data.tasks)
      setFilteredTasks(responseData.data.tasks)
    }
    fetchTasks()
    if (state) {
      setMessage(state.message)
      setShowSnackBar(true)
    }
    state && setMessage(state.message)
  }, [sendRequest, projectContext.selectedProject, authContext.token, state])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/categories`,
          'GET',
          null,
          {
            Authorization: `Bearer ${authContext.token}`,
          },
        )
        setFetchedCategories(responseData.data)
      } catch (err) {}
    }
    fetchCategories()
  }, [sendRequest, authContext.token])

  const openDialog = () => {
    setShowDialog(true)
  }

  const closeDialog = () => {
    setShowDialog(false)
  }

  const closeSnackBar = () => {
    setShowSnackBar(false)
  }

  const handleChange = (panel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean,
  ) => {
    setExpanded(isExpanded ? panel : false)
  }

  const deleteTaskHandler = async (taskId: string) => {
    const responseData = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/tasks/${taskId}`,
      'DELETE',
      null,
      {
        Authorization: `Bearer ${authContext.token}`,
      },
    )
    const updatedTasks = loadedTasks.filter((t) => t._id !== taskId)
    setMessage(responseData.data.message)
    setShowSnackBar(true)
    setFilteredTasks(updatedTasks)
  }

  const columns: ColDef[] = [
    { field: 'objId', hide: true },
    {
      field: 'id',
      headerName: 'ID',
      width: 50,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'title',
      headerName: 'タスク名',
      width: 400,
      headerAlign: 'center',
      renderCell: (params) => {
        return (
          <Link
            className={classes.taskTitle}
            to={`/tasks/${params.getValue('id')}`}
          >
            {params.getValue('title')}
          </Link>
        )
      },
    },
    {
      field: 'category',
      headerName: 'カテゴリ',
      width: 100,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'status',
      headerName: 'ステータス',
      width: 105,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'personInCharge',
      headerName: '担当者',
      width: 120,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'limitDate',
      headerName: '期限',
      width: 130,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'progress',
      type: 'number',
      headerName: '進捗率',
      width: 80,
      headerAlign: 'center',
    },
    {
      field: 'delete',
      headerName: '削除',
      headerAlign: 'center',
      width: 80,
      renderCell: (param) => {
        return (
          <div>
            <IconButton onClick={openDialog}>
              <DeleteIcon />
            </IconButton>

            <AlertDialog
              show={showDialog}
              dialogTitle="Delete Task"
              contentText="タスクを削除します。よろしいですか？"
              ok="OK"
              ng="キャンセル"
              actionForYes={() =>
                deleteTaskHandler(param.getValue('objId')!.toString())
              }
              closeDialog={closeDialog}
            />
          </div>
        )
      },
    },
  ]

  const rows: any[] = []

  filteredTasks &&
    filteredTasks.forEach((task: ITask) => {
      rows.push({
        objId: task._id,
        id: task.taskId!,
        title: task.title,
        category: task.category.name,
        status: task.status,
        personInCharge: task.personInCharge?.name,
        limitDate: formatDate(new Date(task.limitDate), false),
        progress: task.progress + '%',
      })
    })

  let errorModal
  if (error?.response) {
    errorModal = (
      <Modal
        title={error.response?.statusText}
        description={error.response?.data.message}
        show={!!error}
        closeModal={clearError}
      />
    )
  }

  const setChoicesHandler = (event: React.ChangeEvent<{ value: unknown }>) => {
    switch (event.target.value) {
      case 'カテゴリ':
        setOptions(fetchedCategories)
        break
      case '担当者':
        setOptions(fetchedUsers)
        break
      case 'ステータス':
        setOptions([
          { id: '新規', name: '新規' },
          { id: '進行中', name: '進行中' },
          { id: '確認待ち', name: '確認待ち' },
          { id: '完了', name: '完了' },
        ])
        break
    }
  }

  const switchConditionHandler = () => {
    setIsChecked((prevState) => !prevState)
    if (!isChecked) {
      const innerText = optionValueRef?.current?.innerText
      switch (optionNameRef?.current?.innerText) {
        case 'カテゴリ':
          setFilteredTasks(
            loadedTasks.filter((t) => t.category.name === innerText),
          )
          break
        case '担当者':
          setFilteredTasks(
            loadedTasks.filter((t) => t.personInCharge.name === innerText),
          )
          break
        case 'ステータス':
          setFilteredTasks(loadedTasks.filter((t) => t.status === innerText))
          break
      }
    } else {
      setFilteredTasks(loadedTasks)
    }
    setSearchOptions([])
    console.log(searchOptions)
  }

  const selectOptionHandler = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    if (isChecked) {
      const innerText = event.target.value
      console.log(innerText)
      switch (optionNameRef?.current?.innerText) {
        case 'カテゴリ':
          setFilteredTasks(
            loadedTasks.filter((t) => t.category._id === innerText),
          )
          break
        case '担当者':
          setFilteredTasks(
            loadedTasks.filter((t) => t.personInCharge._id === innerText),
          )
          break
        case 'ステータス':
          setFilteredTasks(loadedTasks.filter((t) => t.status === innerText))
          break
      }
    }
  }

  return (
    <Container className={classes.root}>
      {errorModal}
      <LoadingSpinner isLoading={loading} />
      {showSelect && (
        <Container className={classes.optionForm}>
          <FormControl className={classes.formControl}>
            <InputLabel>絞込対象</InputLabel>
            <Select ref={optionNameRef} onChange={setChoicesHandler}>
              <MenuItem value="カテゴリ">カテゴリ</MenuItem>
              <MenuItem value="担当者">担当者</MenuItem>
              <MenuItem value="ステータス">ステータス</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel>絞込条件</InputLabel>
            <Select ref={optionValueRef} onChange={selectOptionHandler}>
              {options.length > 0 &&
                options.map((o) => {
                  return (
                    <MenuItem key={o.id} value={o.id}>
                      {o.name}
                    </MenuItem>
                  )
                })}
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Checkbox onChange={switchConditionHandler} />}
            label="適用"
          />
        </Container>
      )}
      {!showSelect && filteredTasks.length > 0 && (
        <Button
          className={classes.btn}
          variant="outlined"
          color="primary"
          onClick={() => setShowSelect(true)}
        >
          条件で絞り込む
        </Button>
      )}

      <Hidden xsDown>
        <div style={{ height: '85vh', width: '100%' }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} />
        </div>
      </Hidden>

      <Hidden smUp>
        {!loading &&
          filteredTasks.length > 0 &&
          filteredTasks.map((t) => {
            return (
              <Accordion
                key={t._id}
                className={classes.accordion}
                expanded={expanded === `panel${t.taskId}`}
                onChange={handleChange(`panel${t.taskId}`)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography className={classes.heading}>
                    {`#${t.taskId?.toString().padStart(2, ' ')} ${t.title}`}
                  </Typography>
                  <Typography className={classes.secondaryHeading}>
                    {`${formatDate(new Date(t.limitDate), false)}まで`}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  <Typography>{`カテゴリ　:　${t.category.name}`}</Typography>
                  <Typography>
                    {`担当者　　:　${
                      t.personInCharge ? t.personInCharge?.name : '未定'
                    }`}
                  </Typography>
                  <Typography>{`ステータス:　${t.status}`}</Typography>
                </AccordionDetails>
                <Divider />
                <AccordionActions>
                  <Button
                    onClick={() => history.push(`/tasks/${t.taskId}`)}
                    size="small"
                    color="primary"
                  >
                    編集
                  </Button>
                  <Button onClick={openDialog} size="small">
                    削除
                  </Button>
                  <AlertDialog
                    show={showDialog}
                    dialogTitle="Delete Task"
                    contentText="タスクを削除します。よろしいですか？"
                    ok="OK"
                    ng="キャンセル"
                    actionForYes={() => deleteTaskHandler(t._id)}
                    closeDialog={closeDialog}
                  />
                </AccordionActions>
              </Accordion>
            )
          })}
        {!loading && filteredTasks.length === 0 && (
          <Paper className={classes.paper}>
            <Typography className={classes.marginBottom}>
              タスクが登録されていません
            </Typography>
            <Button
              onClick={() => history.push('/tasks/new')}
              variant="contained"
              color="primary"
            >
              新規作成
            </Button>
          </Paper>
        )}
      </Hidden>

      <Snackbar open={showSnackBar} close={closeSnackBar} message={message} />
    </Container>
  )
}

export default TaskList
