import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {deleteTodo, saveEditedTodo} from "../../redux/reducers/todoSlice";
import {createScheduledTodo} from "../../redux/reducers/scheduledTodoSlice";
import dayjs from "dayjs";

interface ITodo {
    id: string;
    title: string;
    description: string;
    colour: string;
}

const TodoList = () => {
    const todos = useSelector((state: RootState) => state.todo.todos)

    const [addActive, setAddActive] = useState(false)
    const [addDate, setAddDate] = useState('')
    const [addTime, setAddTime] = useState('')
    const [addColour, setAddColour] = useState('#D3D3D3')
    const [addRecurring, setAddRecurring] = useState(false)
    const [editTodo, setEditTodo] = useState(false)
    const [activeTodo, setActiveTodo] = useState({ 
        id: '', 
        title: '', 
        description: '',
        colour: '#D3D3D3',
    })
    const dispatch = useDispatch()

    const handleAdd = (todo: React.SetStateAction<ITodo>) => {
        setAddActive(!addActive)
        setActiveTodo({
            ...activeTodo,
            ...todo
        })
    }

    const handleAddDate = (e: any) => {
        e.preventDefault()
        setAddDate(e.target.value)
    }

    const handleAddTime = (e: any) => {
        e.preventDefault()
        setAddTime(e.target.value)
    }

    const handleAddColour = (e: any) => {
        e.preventDefault()
        setAddColour(e.target.value)
    }

    const handleAddRecurring = (e: any) => {
        setAddRecurring(e.target.checked)
    }

    const handleSaveAdd = (e: any) => {
        e.preventDefault()

        if (addDate !== '' && addTime !== '' ) {
            const hour = addTime.split(':')[0]
            const minute = addTime.split(':')[1]

            const scheduledAt = dayjs(addDate).add(parseInt(hour), 'hour').add(parseInt(minute), 'minute').toISOString()
            dispatch(createScheduledTodo({
                ...activeTodo,
                scheduledAt,
                colour: addColour
            }))
            setAddActive(false)
        } else {
            window.alert('you did not enter either a date, a time, or both!')
        }
    }

    const handleEditTodo = (todo: React.SetStateAction<ITodo>) => {
        setEditTodo(!editTodo)
        setActiveTodo(todo)
    }

    const handleEditedTodo = (e: any) => {
        e.preventDefault()

        if (e.target.type === "text") {
            setActiveTodo({
                id: activeTodo.id,
                title: e.target.value,
                description: activeTodo.description,
                colour: activeTodo.colour
            })
        }

        if (e.target.type === "textarea") {
            setActiveTodo({
                id: activeTodo.id,
                title: activeTodo.title,
                description: e.target.value,
                colour: activeTodo.colour
            })
        }
    }

    const handleSaveEditTodo = (e: any) => {
        e.preventDefault()
        // api call to edit todo
        dispatch(saveEditedTodo(activeTodo))

        setEditTodo(false)
    }

    const handleDeleteTodo = (todo: React.SetStateAction<{ id: string; title: string; description: string; }>) => {
        window.alert('You have deleted the todo!')
        // api call to delete todo
        dispatch(deleteTodo(todo))
    }

    const StandardButtons = (props: { currentTodo: ITodo}) => <>
        <button onClick={() => handleAdd(props.currentTodo)}>Add</button>
        <button onClick={() => handleEditTodo(props.currentTodo)}>Edit</button>
        <button onClick={() => handleDeleteTodo(props.currentTodo)}>Delete</button>
    </>

    return (
        <ul className="TodolistUl">
            {todos?.map((todo) => {
                const currentTodo = todos.find(x => x.id === todo.id)
                const currentTodoAddActiveForm = addActive && todo.id === activeTodo.id
                const currentTodoEditTodoActive = editTodo && todo.id === activeTodo.id;
                const formActiveForCurrentTodo = currentTodoAddActiveForm || currentTodoEditTodoActive

                return (
                    <li key={todo.id} className="TodolistLi">
                        <div className="TodoListLiTitle">{todo.title} </div>
                        {todo.description && <div className="TodolistLiDescription">{todo.description}</div>}

                        { currentTodoAddActiveForm &&
                            <div className="TodoListForm">
                                <form className="TodoListForm" onSubmit={handleSaveAdd}>
                                    <input type="date" onChange={handleAddDate}/><br/>
                                    <input type="time" onChange={handleAddTime}/><br/>
                                    <input type="color" onChange={handleAddColour}  defaultValue={activeTodo.colour}/><br/>
                                    <input type="checkbox" onChange={handleAddRecurring}/>
                                    <label className="TodolistLiDescription">Recurring</label>
                                    <br/>
                                    { addRecurring ? 
                                        <>
                                            <input type="color"/><br/>
                                        </> : 
                                        null
                                    }
                                    <input type="submit" value="save" />
                                </form>
                                <button onClick={() => setAddActive(false)}>Cancel</button>
                            </div> }

                        { currentTodoEditTodoActive &&
                            <>
                                <form onSubmit={handleSaveEditTodo}>
                                    {/*// @ts-ignore*/}
                                    <input type="text" name="title" onChange={handleEditedTodo} defaultValue={currentTodo.title}/>
                                    {/*// @ts-ignore*/}
                                    <textarea name="description" onChange={handleEditedTodo} defaultValue={currentTodo.description} />
                                    <input type="submit" value="save" />
                                </form>
                                <button onClick={() => setEditTodo(false)}>Cancel</button>
                            </> }
                        { !formActiveForCurrentTodo && <StandardButtons currentTodo={todo} /> }
                    </li>
                )
            })}
        </ul>
    )
}

export default TodoList;
