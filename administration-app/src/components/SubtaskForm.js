import React, { useState } from "react";

const SubTaskForm = ({ subtaskList, onSubtaskListChange }) => {
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [subtaskDescription, setSubtaskDescription] = useState("");
  const [subtaskImage, setSubtaskImage] = useState("");

  const handleSubtaskSubmit = (e) => {
    e.preventDefault();

    // Kreiramo novi podzadatak
    const newSubtask = {
      title: subtaskTitle,
      description: subtaskDescription,
      image: subtaskImage,
    };

    // Ažuriramo listu podzadataka
    const updatedSubtaskList = [...subtaskList, newSubtask];
    onSubtaskListChange(updatedSubtaskList);

    // Resetujemo polja forme za podzadatak
    setSubtaskTitle("");
    setSubtaskDescription("");
    setSubtaskImage("");
  };

  return (
    <div>
      <h3>Add Subtask</h3>
      <form onSubmit={handleSubtaskSubmit}>
        {/* Polja forme za podzadatak */}
        {/* Polje za naslov podzadatka */}
        <input type="text" value={subtaskTitle} onChange={(e) => setSubtaskTitle(e.target.value)} />

        {/* Polje za opis podzadatka */}
        <textarea value={subtaskDescription} onChange={(e) => setSubtaskDescription(e.target.value)} />

        {/* Polje za upload slike podzadatka */}
        <input type="file" onChange={(e) => setSubtaskImage(e.target.files[0])} />

        <button type="submit">Add Subtask</button>
      </form>
    </div>
  );
};

export default SubTaskForm;
