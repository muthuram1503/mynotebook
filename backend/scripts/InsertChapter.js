const mongoose = require("mongoose");
const Chapter = require("../models/Chapter");
const mongoURI ='mongodb+srv://haribalaji17072004:123456hari@cluster0.b21vp.mongodb.net/mynotes'
// 'mongodb://localhost:27017/mynotes'

const insertChapters = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await Chapter.deleteMany(); // Clear existing data
        const chaptersData = [
            // Class 1
            { class: 1, subject: "Tamil", chapters: ["அகர வரிசை", "எழுத்துக்கள்", "சொற்கள்", "வாக்கியங்கள்"] },
            { class: 1, subject: "English", chapters: ["Alphabet", "Basic Words", "Simple Sentences"] },
            { class: 1, subject: "Mathematics", chapters: ["Numbers", "Addition & Subtraction", "Shapes"] },
            { class: 1, subject: "Environmental Studies", chapters: ["My Body", "Family", "Animals", "Plants"] },
        
            // Class 2
            { class: 2, subject: "Tamil", chapters: ["எழுத்துகள்", "சொற்கள்", "வாக்கியங்கள்", "கவிதைகள்"] },
            { class: 2, subject: "English", chapters: ["Nouns", "Verbs", "Short Stories"] },
            { class: 2, subject: "Mathematics", chapters: ["Counting", "Addition & Subtraction", "Measurement"] },
            { class: 2, subject: "Environmental Studies", chapters: ["Seasons", "Neighborhood", "Transport"] },
        
            // Class 3
            { class: 3, subject: "Tamil", chapters: ["நாவல் கதைகள்", "பாடல்கள்", "வாக்கிய அமைப்பு"] },
            { class: 3, subject: "English", chapters: ["Tenses", "Story Writing", "Opposites"] },
            { class: 3, subject: "Mathematics", chapters: ["Multiplication", "Division", "Patterns"] },
            { class: 3, subject: "Science", chapters: ["Living & Non-living things", "Water", "Air"] },
            { class: 3, subject: "Social Science", chapters: ["My India", "Community Helpers", "Maps"] },
        
            // Class 4
            { class: 4, subject: "Tamil", chapters: ["கவிதைகள்", "கதை சொல்லல்", "வாக்கிய அமைப்பு"] },
            { class: 4, subject: "English", chapters: ["Adjectives", "Short Stories", "Picture Composition"] },
            { class: 4, subject: "Mathematics", chapters: ["Fractions", "Time & Calendar", "Money"] },
            { class: 4, subject: "Science", chapters: ["Our Environment", "Energy", "Food & Nutrition"] },
            { class: 4, subject: "Social Science", chapters: ["History of Tamil Nadu", "Famous Personalities"] },
        
            // Class 5
            { class: 5, subject: "Tamil", chapters: ["நாவல்கள்", "கவிதைகள்", "பழமொழிகள்"] },
            { class: 5, subject: "English", chapters: ["Grammar", "Comprehension", "Letter Writing"] },
            { class: 5, subject: "Mathematics", chapters: ["Decimals", "Geometry", "Measurement"] },
            { class: 5, subject: "Science", chapters: ["Simple Machines", "Solar System", "Force & Motion"] },
            { class: 5, subject: "Social Science", chapters: ["Indian Constitution", "Freedom Fighters"] },
        
            // Class 6
            { class: 6, subject: "Tamil", chapters: ["இலக்கணம்", "நாவல்கள்", "எழுத்து பழக்கம்"] },
            { class: 6, subject: "English", chapters: ["Prose & Poetry", "Tenses", "Letter Writing"] },
            { class: 6, subject: "Mathematics", chapters: ["Integers", "Factors & Multiples", "Graphing"] },
            { class: 6, subject: "Science", chapters: ["Light & Shadow", "Electricity", "Magnets"] },
            { class: 6, subject: "Social Science", chapters: ["Ancient Civilizations", "Indian Geography"] },
        
            // Class 7
            { class: 7, subject: "Tamil", chapters: ["கவிதைகள்", "படைப்புகள்", "எழுத்து நுட்பம்"] },
            { class: 7, subject: "English", chapters: ["Prose & Drama", "Direct & Indirect Speech"] },
            { class: 7, subject: "Mathematics", chapters: ["Algebra", "Percentage", "Statistics"] },
            { class: 7, subject: "Science", chapters: ["Heat", "Sound", "Chemical Reactions"] },
            { class: 7, subject: "Social Science", chapters: ["Medieval History", "Government Structure"] },
        
            // Class 8
            { class: 8, subject: "Tamil", chapters: ["சிறுகதைகள்", "கவிதைகள்", "நடப்பு நிகழ்வுகள்"] },
            { class: 8, subject: "English", chapters: ["Essay Writing", "Figures of Speech"] },
            { class: 8, subject: "Mathematics", chapters: ["Linear Equations", "Probability"] },
            { class: 8, subject: "Science", chapters: ["Cell Structure", "Acids & Bases", "Force"] },
            { class: 8, subject: "Social Science", chapters: ["French Revolution", "Indian Economy"] },
        
            // Class 9
            { class: 9, subject: "Tamil", chapters: ["நாவல்கள்", "கவிதைகள்", "பண்பாட்டு வரலாறு"] },
            { class: 9, subject: "English", chapters: ["Novel Study", "Comprehension", "Speech Writing"] },
            { class: 9, subject: "Mathematics", chapters: ["Polynomials", "Coordinate Geometry"] },
            { class: 9, subject: "Science", chapters: ["Gravitation", "Periodic Table"] },
            { class: 9, subject: "Social Science", chapters: ["Indian Independence", "Globalization"] },
            { class: 9, subject: "Computer Science", chapters: ["Python Basics", "Networking"] },
        
            // Class 10
            { class: 10, subject: "Tamil", chapters: ["சிறப்புப் பாடல்கள்", "தமிழ் இலக்கணம்"] },
            { class: 10, subject: "English", chapters: ["Poetry Analysis", "Report Writing"] },
            { class: 10, subject: "Mathematics", chapters: ["Trigonometry", "Mensuration"] },
            { class: 10, subject: "Science", chapters: ["Magnetic Effects", "Genetics"] },
            { class: 10, subject: "Social Science", chapters: ["World Wars", "Indian Judiciary"] },
            { class: 10, subject: "Computer Science", chapters: ["HTML & CSS", "C Programming"] },
        
            // Class 11
            { class: 11, subject: "Tamil", chapters: ["இலக்கிய வரலாறு", "நாடக இலக்கியம்"] },
            { class: 11, subject: "English", chapters: ["Shakespeare", "Essay Writing"] },
            { class: 11, subject: "Mathematics", chapters: ["Matrices", "Limits & Continuity"] },
            { class: 11, subject: "Physics", chapters: ["Laws of Motion", "Optics"] },
            { class: 11, subject: "Chemistry", chapters: ["Periodic Table", "Chemical Bonding"] },
            { class: 11, subject: "Biology", chapters: ["Human Physiology", "Genetics"] },
            { class: 11, subject: "Commerce", chapters: ["Accounting Basics", "Market Structure"] },
        
            // Class 12
            { class: 12, subject: "Tamil", chapters: ["நவீன தமிழ்க் கவிதைகள்"] },
            { class: 12, subject: "English", chapters: ["Prose & Drama", "Creative Writing"] },
            { class: 12, subject: "Mathematics", chapters: ["Differentiation", "Probability"] },
            { class: 12, subject: "Physics", chapters: ["Electromagnetism", "Semiconductors"] },
            { class: 12, subject: "Chemistry", chapters: ["Organic Chemistry", "Electrochemistry"] },
            { class: 12, subject: "Biology", chapters: ["Human Reproduction", "Biotechnology"] },
            { class: 12, subject: "Computer Science", chapters: ["Java Basics", "Data Structures"] },
            { class: 12, subject: "Commerce", chapters: ["Financial Management", "Taxation"] }
        ];
        
        await Chapter.insertMany(chaptersData);
        console.log("Chapters inserted successfully!");
        mongoose.connection.close();
    } catch (error) {
        console.error("Error inserting chapters:", error);
        mongoose.connection.close();
    }
};

insertChapters();
