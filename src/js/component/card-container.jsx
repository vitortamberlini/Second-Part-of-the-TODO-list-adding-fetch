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
				setItems(items.concat(todo));
				setTodo("");
			}
		}
	}

	function handleRemove(event, index) {
		const newItems = [...items];
		newItems.splice(index, 1);
		setItems(newItems);
	}

	function initializeItems() {
		fetch(endpoint, {
			...requestOptions,
			method: "POST",
			body: "[]",
		})
			.then((response) => {
				if (response.status === 400 || response.status === 200) {
					return fetchItems();
				}
			})
			.catch((error) => console.log(error));
	}

	function fetchItems() {
		let response;

		fetch(endpoint, { ...requestOptions, method: "GET" })
			.then((response) => response.json())
			.then((json) => {
				response = structureItems(json);
			})
			.catch((error) => console.log(error));

		console.log(response);
		return response;
	}

	function structureItems(json) {
		return json.map((jsonItem) => jsonItem.label);
	}

	useEffect(() => {
		// console.log("aaaa", initializeItems());
	}, []);

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
