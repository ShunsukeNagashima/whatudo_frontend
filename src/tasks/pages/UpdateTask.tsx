import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/contexts/auth-context';

interface IParams {
  taskId: string;
}

const UpdateTask = () => {

  const [loadedTask, setLoadedTask] = useState();
  const { loading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const taskId = useParams<IParams>().taskId;

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const responseData = sendRequest(
          `http://localhost:5000/api/tasks/${taskId}`,
           'GET',
           null,
           {
             Authorization: 'Bearer' + auth.token
           }
        )
      } catch(err) {
        console.log(err);
      }
    };
    fetchTask();
  }, [sendRequest, taskId])

  return (
    <div>
      update Task
    </div>
  )
}

export default UpdateTask