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
    useState(null);

  const selectedExerciseId =
    location.state?.selectedExerciseId;

  const workoutId =
    location.state?.workoutId;

  const workoutDate =
    location.state?.workoutDate;

  const mode = location.state?.mode;

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    fetchCategories();
    fetchExercises();
  }, []);

  /* eslint-enable react-hooks/exhaustive-deps */

  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (
      !selectedExerciseId ||
      exercises.length === 0
    ) {
      return;
    }

    const exercise = exercises.find(
      e => e._id === selectedExerciseId
    );

    if (!exercise) return;

    setSelectedCategory(exercise.categoryId);
    setSelectedExercise(exercise);

  }, [selectedExerciseId, exercises]);

  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <div className="exercises-page">
      <div className="exercises-container">

        {!selectedCategory && (
          <CategoryList
            categories={categories || []}
            exercises={exercises || []}
            createCategory={createCategory}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {selectedCategory && !selectedExercise && (
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
        )}

        {selectedExercise && (
          <ExerciseLogger
            exercise={selectedExercise}
            workoutId={workoutId}
            workoutDate={workoutDate}
            onBack={() => setSelectedExercise(null)}
            mode={mode}
          />
        )}

      </div>
    </div>
  );
}

export default Exercises;