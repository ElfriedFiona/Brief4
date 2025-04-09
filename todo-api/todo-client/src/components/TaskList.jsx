import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onTaskUpdated }) => {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onTaskUpdated={onTaskUpdated} />
      ))}
    </ul>
  );
};

export default TaskList;
