import { useState, useEffect } from 'react';

export const useTodos = () => {
  const initializeState = () => {
    try {
      const savedTodos = localStorage.getItem('todos');
      const savedInputText = localStorage.getItem('todoInputText');
      const savedEditingId = localStorage.getItem('editingTodoId');
      const savedFilter = localStorage.getItem('todoFilter');

      const todos = savedTodos ? JSON.parse(savedTodos) : [];
      const inputText = savedInputText || '';
      const filter = savedFilter || 'all';

      let editingTodo = null;
      if (savedEditingId) {
        editingTodo = todos.find(todo => todo.id === savedEditingId) || null;
        if (!editingTodo) {
          localStorage.removeItem('editingTodoId');
        }
      }

      return {
        todos,
        inputText,
        editingTodo,
        editingTodoId: editingTodo ? savedEditingId : null,
        filter,
      };
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
      return { todos: [], inputText: '', editingTodo: null, editingTodoId: null, filter: 'all' };
    }
  };

  const initialState = initializeState();

  const [todos, setTodos] = useState(initialState.todos);
  const [filter, setFilter] = useState(initialState.filter);
  const [editingTodo, setEditingTodo] = useState(initialState.editingTodo);
  const [inputText, setInputText] = useState(initialState.inputText);
  const [editingTodoId, setEditingTodoId] = useState(initialState.editingTodoId);

  // эффекты для сохранения в localStorage
  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  }, [todos]);

  useEffect(() => {
    try {
      localStorage.setItem('todoInputText', inputText);
    } catch (error) {
      console.error('Error saving input text:', error);
    }
  }, [inputText]);

  useEffect(() => {
    try {
      localStorage.setItem('todoFilter', filter);
    } catch (error) {
      console.error('Error saving filter:', error);
    }
  }, [filter]);

  useEffect(() => {
    try {
      if (editingTodoId) {
        localStorage.setItem('editingTodoId', editingTodoId);
      } else {
        localStorage.removeItem('editingTodoId');
      }
    } catch (error) {
      console.error('Error saving editing state:', error);
    }
  }, [editingTodoId]);

  // обработчики
  const addTodo = text => {
    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos(prev => [newTodo, ...prev]);
    setInputText('');
  };

  const toggleTodo = id => {
    setTodos(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const deleteTodo = id => {
    setTodos(prev => prev.filter(todo => todo.id !== id));

    if (editingTodo && editingTodo.id === id) {
      setEditingTodo(null);
      setEditingTodoId(null);
      setInputText('');
    }
  };

  const startEdit = todo => {
    setEditingTodo(todo);
    setEditingTodoId(todo.id);
    setInputText(todo.text);
  };

  const saveEdit = (id, newText) => {
    setTodos(prev => prev.map(todo => (todo.id === id ? { ...todo, text: newText } : todo)));
    setEditingTodo(null);
    setEditingTodoId(null);
    setInputText('');
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setEditingTodoId(null);
    setInputText('');
  };

  const handleFilterChange = newFilter => {
    setFilter(newFilter);
  };

  // вычисляемые значения
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;

  return {
    // состояния
    todos: filteredTodos,
    allTodos: todos,
    filter,
    editingTodo,
    inputText,

    // статистика
    totalTodos,
    completedTodos,
    activeTodos,

    // сеттеры
    setInputText,

    // обработчики
    addTodo,
    toggleTodo,
    deleteTodo,
    startEdit,
    saveEdit,
    cancelEdit,
    handleFilterChange,
  };
};
