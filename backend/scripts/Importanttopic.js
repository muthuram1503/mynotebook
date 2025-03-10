const mongoose = require("mongoose");
const ImportantTopic = require("../models/Importantchaptopic");
const mongoURI ='mongodb+srv://haribalaji17072004:123456hari@cluster0.b21vp.mongodb.net/mynotes'
'mongodb://localhost:27017/mynotes'
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const importantTopics = [
    // 🏫 **Class 1-5: Basic Subjects**
    { class: "1", subject: "Mathematics", chapter: "Numbers", topics: ["Counting", "Addition", "Subtraction", "Number Patterns"] },
    { class: "1", subject: "English", chapter: "Alphabet", topics: ["Vowels", "Consonants", "Basic Words", "Simple Sentences"] },
    { class: "1", subject: "Science", chapter: "Living & Non-living Things", topics: ["Characteristics of Living Things", "Examples of Non-living Things"] },
    { class: "2", subject: "Science", chapter: "Plants", topics: ["Types of Plants", "Parts of a Plant", "Uses of Plants"] },
    { class: "3", subject: "Social Studies", chapter: "Community Helpers", topics: ["Doctors", "Teachers", "Police", "Firefighters"] },
    { class: "4", subject: "Mathematics", chapter: "Fractions", topics: ["Proper & Improper Fractions", "Equivalent Fractions", "Fraction Addition"] },
    { class: "5", subject: "Science", chapter: "Solar System", topics: ["Planets", "Moon Phases", "Sun & Stars"] },

    // 📚 **Class 6-8: Intermediate Level**
    { class: "6", subject: "Mathematics", chapter: "Integers", topics: ["Addition & Subtraction", "Multiplication & Division", "Negative Numbers"] },
    { class: "6", subject: "Science", chapter: "Motion", topics: ["Types of Motion", "Speed and Velocity", "Acceleration"] },
    { class: "7", subject: "Mathematics", chapter: "Algebra", topics: ["Variables", "Simple Equations", "Expressions"] },
    { class: "7", subject: "Science", chapter: "Electricity", topics: ["Current", "Voltage", "Conductors & Insulators"] },
    { class: "8", subject: "Social Science", chapter: "Medieval History", topics: ["Mughal Empire", "Indian Kingdoms", "British Rule"] },
    { class: "8", subject: "Mathematics", chapter: "Geometry", topics: ["Triangles", "Quadrilaterals", "Circles"] },

    // 📖 **Class 9-10: Board-Level Preparation**
    { class: "9", subject: "Mathematics", chapter: "Linear Equations", topics: ["Graphing Equations", "Simultaneous Equations", "Slope & Intercepts"] },
    { class: "9", subject: "Science", chapter: "Atoms & Molecules", topics: ["Atomic Structure", "Chemical Bonds", "Mole Concept"] },
    { class: "9", subject: "Social Science", chapter: "French Revolution", topics: ["Causes", "Effects", "Key Figures", "Consequences"] },
    { class: "10", subject: "Mathematics", chapter: "Trigonometry", topics: ["Sine, Cosine, Tangent", "Trigonometric Identities", "Applications"] },
    { class: "10", subject: "Science", chapter: "Periodic Table", topics: ["Groups & Periods", "Trends in Elements", "Electron Configuration"] },
    { class: "10", subject: "Social Science", chapter: "Indian Freedom Struggle", topics: ["Gandhi's Role", "Partition of India", "British Policies"] },

    // 🎓 **Class 11-12: Advanced Subjects**
    { class: "11", subject: "Mathematics", chapter: "Calculus", topics: ["Limits", "Derivatives", "Integrals", "Differential Equations"] },
    { class: "11", subject: "Physics", chapter: "Kinematics", topics: ["Equations of Motion", "Projectile Motion", "Vector Calculations"] },
    { class: "11", subject: "Chemistry", chapter: "Thermodynamics", topics: ["Laws of Thermodynamics", "Enthalpy", "Entropy"] },
    { class: "11", subject: "Biology", chapter: "Cell Biology", topics: ["Cell Structure", "Cell Division", "Organelles"] },
    { class: "11", subject: "Computer Science", chapter: "Programming Basics", topics: ["Variables", "Loops", "Functions", "Conditionals"] },

    { class: "12", subject: "Mathematics", chapter: "Probability", topics: ["Binomial Theorem", "Permutations & Combinations", "Bayes' Theorem"] },
    { class: "12", subject: "Physics", chapter: "Electromagnetism", topics: ["Faraday's Law", "Maxwell's Equations", "Magnetic Fields"] },
    { class: "12", subject: "Chemistry", chapter: "Organic Chemistry", topics: ["Alcohols", "Aldehydes", "Ketones", "Aromatic Compounds"] },
    { class: "12", subject: "Biology", chapter: "Genetics", topics: ["Mendelian Genetics", "DNA & RNA", "Gene Mutation"] },
    { class: "12", subject: "Computer Science", chapter: "Data Structures", topics: ["Arrays", "Linked Lists", "Stacks", "Queues", "Graphs"] },

    // 🌍 **Additional Subjects: Geography, Economics, Political Science**
    { class: "9", subject: "Geography", chapter: "Climate", topics: ["Weather vs Climate", "Factors Affecting Climate"] },
    { class: "10", subject: "Economics", chapter: "Indian Economy", topics: ["Sectors of Economy", "GDP & Growth"] },
    { class: "12", subject: "Political Science", chapter: "Democracy", topics: ["Features of Democracy", "Challenges & Importance"] },
];

const insertData = async () => {
    try {
        await ImportantTopic.insertMany(importantTopics);
        console.log("✅ Important topics inserted successfully!");
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error inserting data:", error);
    }
};

insertData();
