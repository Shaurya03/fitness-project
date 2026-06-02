import { useEffect, useState } from "react";
import { useExercises } from "../hooks/useExercises";

const categoryOrder = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Core",
  "Cardio"
];

function Exercises() {
  const { exercises, fetchExercises } = useExercises();
  const [searchTerm, setSearchTerm] = useState("");

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    fetchExercises();
  }, []);

  /* eslint-enable react-hooks/exhaustive-deps */

  const filteredExercises = exercises?.filter((exercise) =>
    exercise.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  ) || [];

  const groupedExercises = filteredExercises.reduce(
    (groups, exercise) => {

      const category =
        exercise.type === "cardio"
          ? "Cardio"
          : exercise.category;

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(exercise);

      return groups;
    }, {}
  );

  return (
    <div>
      <h2>Exercises</h2>

      <input
        type="text"
        placeholder="Search exercises..."
        value={searchTerm}
        onChange={(event) =>
          setSearchTerm(event.target.value)
        }
      />

      {categoryOrder.map((category) => {
        const categoryExercises = groupedExercises[category];

        if (!categoryExercises) return null;

        return (
          <div key={category}>

            <h3>{category}</h3>

            {categoryExercises.map((exercise) => (
              <div key={exercise._id}>
                {exercise.name}
              </div>
            ))}

          </div>
        );
      })}

    </div>
  );
}

export default Exercises;