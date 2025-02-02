import React, { useEffect, useState } from "react";
import PostList from "../UI/PostList";
import { useParams } from "react-router-dom";
import "../styles/archive.css";
import { useNavigate } from "react-router-dom";
import CONFIG from "../../CONFIG";

export default function Archive({ data = [], uniqueCategories = [] }) {
	const { category: routeCategory } = useParams();
	const [loading, setLoading] = useState(true);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(
		routeCategory?.toLowerCase() || "all"
	);
	const [filteredPosts, setFilteredPosts] = useState([]);
	const [postListJSX, setPostListJSX] = useState(null);

	const navigate = useNavigate();

	document.title = "Arquivo - " + CONFIG.siteName;

	useEffect(() => {
		setCategories(uniqueCategories)
	}, [uniqueCategories])

	useEffect(() => {
		setLoading(true);

		const updatedPosts =
			selectedCategory === "all"
				? data
				: data.filter(
						(post) =>
							post.category &&
							post.category.toLowerCase() === selectedCategory
				  );

		setFilteredPosts(updatedPosts);

		const jsx = <PostList key={selectedCategory} postsList={updatedPosts} />;
		setPostListJSX(jsx);

		setLoading(false);
	}, [data, selectedCategory]);

	useEffect(() => {
		if (routeCategory) {
			setSelectedCategory(routeCategory.toLowerCase());
		}
	}, [routeCategory]);


	const handleCategoryChange = (category) => {
		setSelectedCategory(category.toLowerCase());
		if (category === "all") {
			navigate(`/posts`);
			return;
		}
		navigate(`/posts/${category.toLowerCase()}`);
	};

	if (loading) {
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
			</div>
		);
	}

	return (
		<main className="archive-container">
			<div className="archive-header">
				<h1>Arquivo</h1>
				<div className="category-filter">
					<div className="tab-navigation">
						<button
							className={`tab-button ${
								selectedCategory === "all" ? "active" : ""
							}`}
							onClick={() => handleCategoryChange("all")}
						>
							todos
						</button>
						{categories.map((category) => (
							<button
								key={category}
								className={`tab-button ${
									selectedCategory === category
										? "active"
										: ""
								}`}
								onClick={() =>
									handleCategoryChange(category)
								}
							>
								{category}
							</button>
						))}
					</div>
				</div>
			</div>
			<div className="filtered-posts">
				{postListJSX}
			</div>
		</main>
	);
}
