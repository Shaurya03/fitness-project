import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useCategories } from "../hooks/useCategories";
import { useExercises } from "../hooks/useExercises";

import CategoryList from "../components/CategoryList";
import ExerciseList from "../components/ExerciseList";
import ExerciseLogger from "../components/ExerciseLogger";

import "./Exercises.css";

function Exercises() {
  const location = useLocation();

  const {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  } = useCategories();

  const {
    exercises,
    fetchExercises,
    createExercise,
    updateExercise,
    deleteExercise
  } = useExercises();

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [selectedExercise, setSelectedExercise] =
    useState(location.state?.exercise || null);

  useEffect(() => {
    if (location.state?.exercise) {
      setSelectedCategory(
        location.state.exercise.categoryId
      );
    }
  }, [location.state]);

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    fetchCategories();
    fetchExercises();
  }, []);

  /* eslint-enable react-hooks/exhaustive-deps */

  if (!selectedCategory) {
    return (
      <CategoryList
        categories={categories || []}
        createCategory={createCategory}
        updateCategory={updateCategory}
        deleteCategory={deleteCategory}
        onSelectCategory={setSelectedCategory}
      />
    );
  }

  if (!selectedExercise) {
    return (
      <ExerciseList
        category={selectedCategory}
        categories={categories || []}
        exercises={exercises || []}
        createExercise={createExercise}
        updateExercise={updateExercise}
        deleteExercise={deleteExercise}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onBack={() => {
          setSearchTerm("");
          setSelectedCategory(null);
        }}
        onSelectExercise={setSelectedExercise}
      />
    );
  }

  return (
    <ExerciseLogger
      exercise={selectedExercise}
      onBack={() =>
        setSelectedExercise(null)
      }
    />
  );
}

export default Exercises;