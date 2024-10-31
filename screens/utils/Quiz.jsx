import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ProgressBarAndroid,
} from "react-native";
import { ThemeContext } from "../../contexts/ThemeContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";



  const UJ_QUESTIONS = [
    {
      id: 1,
      name: "Question 1",
      description:
        "Can you name the current Vice-Chancellor presiding over the University of Johannesburg?",
      correctAnswer: "Prof Letlhokwa Mpedi",
      options: [
        "Prof Tshilidzi Marwala",
        "Prof Pamela Dube",
        "Prof Letlhokwa Mpedi",
        "Prof Mamokegthi Phakeng",
      ],
    },
    {
      id: 2,
      name: "Question 2",
      description:
        "Can you identify the total number of campuses operated by the University of Johannesburg?",
      correctAnswer: "4",
      options: ["4", "7", "3", "5"],
    },
    {
      id: 3,
      name: "Question 3",
      description:
        "Is there an island associated with the University of Johannesburg?",
      correctAnswer: "Yes",
      options: ["Yes", "No"],
    },
    {
      id: 4,
      name: "Question 4",
      description:
        "How does the University of Johannesburg's ranking position it relative to other universities nationally?",
      correctAnswer: "5",
      options: ["10", "5", "1", "2"],
    },
    {
      id: 5,
      name: "Question 5",
      description:
        "Has the University of Johannesburg provided financial support to a primary or a high school?",
      correctAnswer: "Primary School",
      options: ["High School", "Primary School"],
    },
    {
      id: 6,
      name: "Question 6",
      description:
        "Among UJ campuses, which one boasts the highest number of lecture halls?",
      correctAnswer: "DFC",
      options: ["APK", "SWC", "APB", "DFC"],
    },
    {
      id: 7,
      name: "Question 7",
      description:
        "Is there a healthcare clinic available on any of the University of Johannesburg's campuses?",
      correctAnswer: "Yes",
      options: ["Yes", "No"],
    },
    {
      id: 8,
      name: "Question 8",
      description:
        "In what academic or research areas does the University of Johannesburg hold a competitive edge over other institutions?",

      correctAnswer: "UJ 4IR Academy",
      options: [
        "UJ Advanced Studies",
        " UJ Digital Institute",
        "UJ Tech Hub",
        "UJ 4IR Academy",
      ],
    },
    {
      id: 9,
      name: "Question 9",
      description:
        "Can you specify the total number of distinct faculties within the University of Johannesburg?",
      correctAnswer: "8",
      options: ["7", "10", "8", "5"],
    },
    {
      id: 10,
      name: "Question 10",
      description:
        "Is financial assistance or funding available for international students at the University of Johannesburg?",
      correctAnswer: "Yes",
      options: ["Yes", "No"],
    },
  ];

const UJQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const { currentColors } = useContext(ThemeContext);
  const router = useRouter();


  useEffect(() => {
    if (currentQuestion && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            handleNextQuestion();
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentQuestion, gameOver]);

  const handleNextQuestion = () => {
    setFeedback(null);
    if (questionIndex < questions.length - 1) {
      setCurrentQuestion(questions[questionIndex + 1]);
      setTimeLeft(15);
      setQuestionIndex(questionIndex + 1);
    } else {
      setGameOver(true);
    }
  };

  const handleGuess = (guess) => {
    if (guess === currentQuestion.correctAnswer) {
      setScore(score + 1);
      setFeedback("Correct!");
    } else {
      setFeedback("Incorrect!");
    }
    setTimeout(handleNextQuestion, 2000);
  };

  const startQuiz = () => {
    setQuestions(UJ_QUESTIONS);
    setCurrentQuestion(UJ_QUESTIONS[0]);
    setScore(0);
    setQuestionIndex(0);
    setGameOver(false);
    setTimeLeft(15);
    setFeedback(null);
  };

  const resetQuiz = () => {
    setQuestions([]);
    setCurrentQuestion(null);
    setScore(0);
    setGameOver(false);
    setQuestionIndex(0);
    setTimeLeft(15);
    setFeedback(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!questions.length ? (
        <View style={styles.startContainer}>
          <Text style={[styles.title, { color: currentColors.text }]}>
            University of Johannesburg Quiz
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
            <Text style={styles.startButtonText}>Start Quiz</Text>
          </TouchableOpacity>
        </View>
      ) : gameOver ? (
        <View style={styles.endContainer}>
          <TouchableOpacity onPress={() => {router.back()}}>
            <AntDesign name="arrowleft" size={24} color={currentColors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: currentColors.text }]}>
            Quiz Over
          </Text>
          <Text style={[styles.score, { color: currentColors.text }]}>
            Your Score: {score}
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={resetQuiz}>
            <Text style={styles.startButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.quizContainer}>
          <Text style={[styles.timer, { color: currentColors.text }]}>
            Time Left: {timeLeft}s
          </Text>
          <ProgressBarAndroid
            styleAttr="Horizontal"
            indeterminate={false}
            progress={(15 - timeLeft) / 15}
            color="#03A9F4"
          />
          <Text style={styles.question}>{currentQuestion.description}</Text>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleGuess(option)}
            >
              <Text style={styles.optionButtonText}>{option}</Text>
            </TouchableOpacity>
          ))}
          {feedback && (
            <Text
              style={
                feedback === "Correct!"
                  ? styles.correctFeedback
                  : styles.incorrectFeedback
              }
            >
              {feedback}
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#1E1E1E",
  },
  startContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  endContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  quizContainer: {
    marginVertical: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    
    textAlign: "center",
    marginBottom: 20,
  },
  timer: {
    fontSize: 18,
    color: "#FFD700",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  question: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    marginVertical: 20,
  },
  startButton: {
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 25,
    width: "60%",
    alignItems: "center",
    marginVertical: 20,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  optionButton: {
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 25,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  optionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  correctFeedback: {
    color: "#4CAF50",
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  },
  incorrectFeedback: {
    color: "#F44336",
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  },
  score: {
    fontSize: 24,
    color: "#FFD700",
    textAlign: "center",
    marginVertical: 20,
  },
});

export default UJQuiz;
