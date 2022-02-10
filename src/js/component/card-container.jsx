import MyCard from "./my-card.jsx";
import ListGroup from "react-bootstrap/ListGroup";
import MyFooter from "./my-footer.jsx";
import { useState, useEffect } from "react";

const CardContainer = () => {
	const [items, setItems] = useState([]);
	const [todo, setTodo] = useState("");
	const endpoint =
		"https://assets.breatheco.de/apis/fake/todos/user/vitor-tamberlini";
	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const requestOptions = {
		headers: myHeaders,
		redirect: "follow",
	};

	function handleInput(event) {
		setTodo(event.target.value);
	}

	function handleEnter(event) {
		if (event.key === "Enter") {
			if (todo !== "") {
				const newItems = items.concat(todo);
				updateItems(newItems);
				setTodo("");
			}
		}
	}

	function handleRemove(event, index) {
		const newItems = [...items];
		newItems.splice(index, 1);
		updateItems(newItems);
	}

	async function deleteItems() {
		const response = await fetch(endpoint, {
			...requestOptions,
			method: "DELETE",
		});

		if (response.status === 200 || response.status === 500) {
			setItems([]);
		}
	}

	async function updateItems(newItems) {
		if (items.length === 0) {
			await initializeItems();
			console.log(items);
		}

		if (newItems === []) {
			await deleteItems();
			return;
		}

		const body = JSON.stringify(
			newItems.map((i) => {
				return { label: i, done: false };
			})
		);

		const response = await fetch(endpoint, {
			...requestOptions,
			method: "PUT",
			body,
		});
		if (response.status === 400) {
			deleteItems();
		} else {
			setItems(newItems);
		}
	}

	async function initializeItems() {
		const response = await fetch(endpoint, {
			...requestOptions,
			method: "POST",
			body: "[]",
		});

		if (response.status === 400 || response.status === 200) {
			const newList = await fetchItems();
			setItems(newList);
		} else {
			return Error("I couldn't fetch the data");
		}
	}

	async function fetchItems() {
		const response = await fetch(endpoint, {
			...requestOptions,
			method: "GET",
		});

		const json = await response.json();
		const newList = structureItems(json);

		return newList;
	}

	function structureItems(json) {
		return json.map((jsonItem) => jsonItem.label);
	}

	useEffect(() => initializeItems(), []);

	return (
		<ListGroup>
			<ListGroup.Item className="ps-3">
				<input
					className="border-0 w-100 "
					type="text"
					name="todo-title"
					id="todo-input"
					value={todo}
					onChange={(e) => handleInput(e)}
					onKeyDown={(e) => handleEnter(e)}
					placeholder="What needs to be done?"
				/>
			</ListGroup.Item>
			{items.map((item, id) => (
				<MyCard
					key={id}
					index={id}
					text={item}
					handleRemove={handleRemove}
				/>
			))}

			<MyFooter itemsLeft={items.length} />
		</ListGroup>
	);
};

export default CardContainer;
