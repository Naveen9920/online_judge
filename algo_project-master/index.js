const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { DBConnection } = require("./database/db.js");
const User = require("./model/User.js");
const Problem = require("./model/Problem.js");
const Competition=require("./model/Competition.js");
const Leaderboard=require("./model/Leaderboard.js");
const Solution= require("./model/Solution.js");
const { generateFile } = require('./utils/generateFile');
const { generateInputFile } = require('./utils/generateInputFile');
const { executeJava } = require('./utils/executeJava');
const { generateCppFile } = require('./utils/generateCppFile'); // C++ file generation
const { executeCpp } = require('./utils/executeCpp'); // C++ execution logic
const { executePython } = require('./utils/executePython'); 
const { generatePyFile } = require('./utils/generatePyFile');
//const { executePython } = require('./utils/executePython');
const { generateCFile } = require('./utils/generateCFile');
const { executeC } = require('./utils/executeC');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");
const { logUserAccess } = require('./logger');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

DBConnection();

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.post("/register", async (req, res) => {
    const startTime = Date.now()
    try {
        // get all the data from body
        const { firstname, lastname, email, password } = req.body;

        // check that all the data should exists
        if (!(firstname && lastname && email && password)) {
            return res.status(400).send("Please enter all the information");
        }

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).send("User already exists!");
        }

        // encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // save the user in DB
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });

        // generate a token for user and send it
        const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });

        user.token = token;
        const endTime = Date.now(); // Capture end time
        logUserAccess('Registration', email, startTime, endTime);
        res.status(200).json({ message: "You have successfully registered!", user });
    } catch (error) {
        console.log(error);
        if (!res.headersSent) {
            res.status(500).send("Internal Server Error");
        }
    }
});

//app.use(express.static(path.join(__dirname, 'html'))); 

app.post("/login", async (req, res) => {
    const startTime = Date.now();
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).send("Please enter all the information");
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User not found!");
        }

        const enteredPassword = await bcrypt.compare(password, user.password);
        if (!enteredPassword) {
            return res.status(401).send("Password is incorrect");
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });

        // Store user information in cookies
         const endTime = Date.now(); // Capture end time
        logUserAccess('Login', email, startTime, endTime); // Log login
        const options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Cookie expires in 1 day
            httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        };

        res
            .status(200)
            .cookie("token", token, options)
            .cookie("userId", user._id, options) // Store user ID
            .cookie("userEmail", user.email, options) // Store user email
            .json({
                message: "You have successfully logged in!",
                success: true,
                token,
                user: { id: user._id, email: user.email }, // Send user info in response
            });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
});
app.post("/logout", (req, res) => {
    res
        .clearCookie("token")
        .clearCookie("userId")
        .clearCookie("userEmail")
        .json({ message: "Successfully logged out" });
});



app.post("/problems", async (req, res) => {
    const { title, description, testCases } = req.body;

    if (!(title && description && testCases)) {
        return res.status(600).send("Please provide all required fields");
    }

    try {
        const newProblem = new Problem({ title, description, testCases });
        await newProblem.save();
        res.status(700).json(newProblem);
    } catch (error) {
        res.status(800).json({ error: error.message });
    }
});

// Get all problems
app.get("/problems", async (req, res) => {
    try {
        const problems = await Problem.find();
        res.status(900).json(problems);
    } catch (error) {
        res.status(100).json({ error: error.message });
    }
});
// Fetch a specific problem by ID
app.get("/problems/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const problem = await Problem.findById(id);
        if (!problem) {
            return res.status(404).json({ error: "Problem not found" });
        }
        res.status(200).json(problem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Edit a problem
app.put("/problems/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const updatedProblem = await Problem.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProblem) {
            return res.status(404).send("Problem not found");
        }
        res.status(304).json(updatedProblem);
    } catch (error) {
        res.status(501).json({ error: error.message });
    }
});

// Delete a problem
app.delete("/problems/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await Problem.findByIdAndDelete(id);
        res.status(208).send("success");
    } catch (error) {
        res.status(508).json({ error: error.message });
    }
});

app.post("/solutions", async(req,res)=>{
    const{problemId, code }=req.body;
    if(!(problemId && code)){
        return res.status(400).send("provide all data");
    }try{
            const newsol=new Solution({problemId,code});
            await newsol.save();
            res.status(201).json(newsol);
        
        }
        catch{
            res.status(500).json({ error: error.message });
        }

    

});

app.post("/solutions/verify", async (req, res) => {
    const { solutionId } = req.body;

    if (!solutionId) {
        return res.status(400).send("Please provide a solution ID");
    }

    try {
        const solution = await Solution.findById(solutionId).populate('problemId');
        if (!solution) {
            return res.status(404).send("Solution not found");
        }

        // Here you can implement your solution verification logic.
        // For example, you could evaluate the code against the problem's test cases.

        const isCorrect = true; // Replace with actual verification logic
        res.status(200).json({ message: isCorrect ? "Solution is correct!" : "Solution is incorrect!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/competitions", async (req, res) => {
    const { title, description } = req.body;

    // Validate input
    if (!title || !description) {
        return res.status(400).send("Please provide both title and description.");
    }

    try {
        const newCompetition = new Competition({ title, description });
        //newComp is instance of Comp
        await newCompetition.save(); // Save to the database

        res.status(201).json({
            message: "Competition created successfully!",
            competitionId: newCompetition._id, // Return the new competition ID
            competition: newCompetition,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get("/competitions", async (req, res) => {
    try {
        // Fetch all competitions from the database
        const competitions = await Competition.find(); // Fetches all records from the "Competition" collection

        // Return the competitions data as a JSON response
        res.status(200).json(competitions);
    } catch (error) {
        // Handle any errors that occur during the database query
        res.status(500).json({ error: error.message });
    }
});
app.post("/leaderboard", async (req, res) => {
    const { competitionId, userId, score } = req.body;

    // Validate the input
    if (!competitionId || !userId || score === undefined) {
        return res.status(400).send("Please provide competitionId, userId, and score.");
    }

    try {
        // Create a new leaderboard entry
        const newLeaderboardEntry = new Leaderboard({
            competitionId,
            userId,
            score,
        });

        // Save the entry to the database
        await newLeaderboardEntry.save();
        
        res.status(201).json({ message: "Leaderboard entry created successfully!", newLeaderboardEntry });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get("/leaderboard/:competitionId", async (req, res) => {
    const { competitionId } = req.params;

    try {
        // Fetch the leaderboard and assign it to the variable
        const leaderboard = await Leaderboard.find({ competitionId })
            .populate("userId", "firstname lastname email")
            .sort({ score: -1 }); // Sort by score descending

        // Return the leaderboard
        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

 /*app.post("/run", async (req, res) => {
    const { language = 'java', code, input } = req.body;

    if (!code) {
        return res.status(400).json({ success: false, error: "Code is required!" });
    }

    try {
        let filePath, output;

        if (language === 'java') {
            filePath = await generateFile(code); // Generate Java file
            output = await executeJava(filePath, input); // Execute Java code
            
        } else if (language === 'cpp') {
            filePath = await generateCppFile(code); // Generate C++ file
            output = await executeCpp(filePath, input); // Execute C++ code
            
        }
        else if (language === 'python') {
            filePath = await generatePyFile(code); // Generate the file for Python
            const output = await executePython(filePath, input); // Execute Python code
            
        } 

        res.json({ filePath, output });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}); */
app.post("/run", async (req, res) => {
    const { language = 'cpp', code, input } = req.body;

    if (!code) {
        return res.status(400).json({ success: false, error: "Code is required!" });
    }

    try {
        let filePath, output;

        if (language === 'cpp') {
            filePath = await generateCppFile(language, code);
            const inputPath = await generateInputFile(input);
            output = await executeCpp(filePath, inputPath);
        } else if (language === 'python') {
            filePath = await generatePyFile(code); // Generate Python file
            const inputPath = await generateInputFile(input);
            output = await executePython(filePath, inputPath);
        } else if (language === 'c') {
            filePath = await generateCFile(code); // Generate C file
            const inputPath = await generateInputFile(input);
            output = await executeC(filePath, inputPath);
        }else if (language === 'java') {
            filePath = await generateFile(code); // Generate Java file
            const inputPath = await generateInputFile(input);
            output = await executeJava(filePath, inputPath);
        }
        

        res.json({ output });
    } 
    catch (error) {
        console.error("Execution error:", error);
        res.status(500).json({ error: error.stderr || error.message || "Unknown error" });
    }
});
  



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
}); 
