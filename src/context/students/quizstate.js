import React, { useState, useEffect } from "react";
import QuizContext from "./quizcontext";

const QuizState = (props) => {
  const host = "http://localhost:5000";
  const initialQuizzes = [];

  const [quizzes, setQuizzes] = useState(initialQuizzes);

  // Fetch all quizzes
  const getQuizzes = async () => {
    try {
      const response = await fetch(`${host}/api/quiz/fetchallquizzes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      console.log(data);
      setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error.message);
    }
  };

  // Add a quiz
  const addQuiz = async (question, options, answer, classNum) => {
    try {
      const response = await fetch(`${host}/api/quiz/addquiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ question, options, answer, class: classNum })
      });

      const result = await response.json();
      setQuizzes([...quizzes, result]);
      return result;
    } catch (error) {
      console.error("Error adding quiz:", error.message);
    }
  };

  // Delete a quiz
  const deleteQuiz = async (id) => {
    try {
      const response = await fetch(`${host}/api/quiz/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      await response.json();

      const newQuizzes = quizzes.filter((quiz) => quiz._id !== id);
      setQuizzes(newQuizzes);
    } catch (error) {
      console.error("Error deleting quiz:", error.message);
    }
  };

  // Edit a quiz
  const editQuiz = async (id, question, options, answer, classNum) => {
    try {
      const response = await fetch(`${host}/api/quiz/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ question, options, answer, class: classNum })
      });

      await response.json();

      const updatedQuizzes = quizzes.map((quiz) =>
        quiz._id === id ? { ...quiz, question, options, answer, class: classNum } : quiz
      );
      setQuizzes(updatedQuizzes);
    } catch (error) {
      console.error("Error editing quiz:", error.message);
    }
  };

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        setQuizzes,
        getQuizzes,
        addQuiz,
        deleteQuiz,
        editQuiz
      }}
    >
      {props.children}
    </QuizContext.Provider>
  );
};

export default QuizState;
