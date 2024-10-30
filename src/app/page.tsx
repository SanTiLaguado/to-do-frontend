"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../utils/auth';
import { getAllTasks, createTask, updateTask, deleteTask, Task } from './services/TaskService';
import { logout } from './services/AuthService';

export default function HomePage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<{ title: string; description: string; dueDate: string; statusId: number }>({
    title: '',
    description: '',
    dueDate: '',
    statusId: 1,
  });
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null); // Para identificar la tarea actual

  const statusMap: { [key: number]: string } = {
    1: "Pendiente",
    2: "En Progreso",
    3: "Completada"
  };

  useEffect(() => {
    const fetchTasks = async () => {
      if (!isAuthenticated()) {
        router.push('/auth');
        return;
      }

      try {
        const tasksData = await getAllTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [router]);

  const handleCreateTask = () => {
    setModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTaskId(task.id);
    setFormValues({
      title: task.title,
      description: task.description ?? '', // Usa una cadena vacía si description es undefined
      dueDate: task.dueDate.split('T')[0],
      statusId: task.statusId,
    });
    setEditModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleOk = async (e: React.FormEvent) => {
    e.preventDefault();
    const taskData = {
      title: formValues.title,
      description: formValues.description,
      statusId: 1,
      dueDate: new Date(formValues.dueDate).toISOString()
    };

    try {
      const newTask = await createTask(taskData);
      console.log('Tarea creada:', newTask);
      setTasks(prevTasks => [...prevTasks, newTask]);
      setModalOpen(false);
      setFormValues({ title: '', description: '', dueDate: '', statusId: 1 }); // Resetear el formulario
    } catch (error) {
      console.error("Error creando la tarea:", error);
    }
  };

  const handleEditOk = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTaskData = {
      ...formValues,
      dueDate: new Date(formValues.dueDate).toISOString()
    };

    try {
      if (currentTaskId) {
        const updatedTask = await updateTask(currentTaskId, updatedTaskData);
        setTasks(prevTasks => prevTasks.map(task => (task.id === currentTaskId ? updatedTask : task)));
        setEditModalOpen(false);
        setFormValues({ title: '', description: '', dueDate: '', statusId: 1 });
      }
    } catch (error) {
      console.error("Error actualizando la tarea:", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error borrando la tarea:", error);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setEditModalOpen(false);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <section className='main'>
      <div className="board-header">
        <div className="header_logo">
          <h1>To-Do</h1>
        </div>
        <div className="user-menu">
          <a href="/auth" onClick={handleLogout}>Cerrar sesión</a>
        </div>
      </div>
      <div className='content'>
        <div className="task-list">
          <h2>Todas mis Tareas</h2>
          {tasks.map((task) => (
            <div
              key={task.id}
              className="task"
              onClick={() => handleEditTask(task)}
            >
              <span>{task.title}</span>
              <span className={`status ${task.statusId}`}>
                {statusMap[task.statusId as number]}
              </span>
            </div>
          ))}
        </div>

        <div className="board">
          {Object.values(statusMap).map((status) => (
            <div key={status} className="list">
              <h2>{status}</h2>
              <div className="cards">
                {tasks
                  .filter((task) => statusMap[task.statusId as number] === status) // Accede a `statusMap` usando `as number`
                  .map((task) => (
                    <div
                      key={task.id}
                      className="task"
                      onClick={() => handleEditTask(task)}
                    >
                      <span>{task.title}</span>
                      <span className={`status ${task.statusId}`}>
                        {statusMap[task.statusId as number]}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <button onClick={handleCreateTask} className="create-task-button">
          Crear Tarea
        </button>
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCancel}>&times;</span>
            <h2>Crear Tarea</h2>
            <form onSubmit={handleOk}>
              <label>
                Título:
                <input
                  type="text"
                  name="title"
                  value={formValues.title}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Descripción:
                <textarea
                  name="description"
                  value={formValues.description}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Fecha de Vencimiento:
                <input
                  type="date"
                  name="dueDate"
                  value={formValues.dueDate}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <button type="submit">Crear</button>
            </form>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCancel}>&times;</span>
            <h2>Editar Tarea</h2>
            <form onSubmit={handleEditOk}>
              <label>
                Título:
                <input
                  type="text"
                  name="title"
                  value={formValues.title}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Descripción:
                <textarea
                  name="description"
                  value={formValues.description}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Fecha de Vencimiento:
                <input
                  type="date"
                  name="dueDate"
                  value={formValues.dueDate}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Estado:
                <select
                  name="statusId"
                  value={formValues.statusId}
                  onChange={handleInputChange}
                >
                  {Object.entries(statusMap).map(([key, status]) => (
                    <option key={key} value={key}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit">Actualizar</button>
              <button className="delete-button" type="button" onClick={() => handleDeleteTask(currentTaskId!)}>Borrar</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
