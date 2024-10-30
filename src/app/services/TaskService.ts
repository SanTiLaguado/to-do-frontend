import axios from 'axios';

export interface Task {
    id: number;
    title: string;
    description?: string;
    statusId: number;
    dueDate: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const API_TASKS = `${apiUrl}/tasks`;

// Función para obtener el token de autenticación
const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token not available, please login again');
    }
    return token;
};

// Crear nueva tarea
export const createTask = async (taskData: Omit<Task, 'id'>): Promise<Task> => {
    const token = getToken();
    const response = await axios.post<Task>(API_TASKS, taskData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Obtener todas las tareas
export const getAllTasks = async (): Promise<Task[]> => {
    const token = getToken();
    const response = await axios.get<Task[]>(API_TASKS, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Obtener tarea por ID
export const getTaskById = async (id: number): Promise<Task> => {
    const token = getToken();
    const response = await axios.get<Task>(`${API_TASKS}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Actualizar tarea por ID
export const updateTask = async (id: number, taskData: Partial<Omit<Task, 'id'>>): Promise<Task> => {
    const token = getToken();
    const response = await axios.put<Task>(`${API_TASKS}/${id}`, taskData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Eliminar tarea por ID
export const deleteTask = async (id: number): Promise<void> => {
    const token = getToken();
    await axios.delete(`${API_TASKS}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
