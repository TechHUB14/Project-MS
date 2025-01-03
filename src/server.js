import express from 'express'; // Import express
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios'; // Import axios
import md5 from 'md5';

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/proms", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define schema and model for projects
const projectSchema = new mongoose.Schema({
  department: { type: String, required: true },
  location: { type: String, required: true },
  projectId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  govtBudget: { type: Number, required: true },
  comperiod: { type: String, required: true },
  approvalStatus: { type: String, default: "Pending" },
  projectStatus: { type: String, default: "Not Started" },
});

const Project = mongoose.model("projectdbs", projectSchema);

// Define schema and model for duplicated data
const duplicateSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  govtBudget: { type: Number, required: true },
});

const Duplicate = mongoose.model("duplicatedbs", duplicateSchema);

// Function to copy project data to duplicate table
const copyDataToDuplicate = async () => {
  try {
    const projects = await Project.find();
    for (const project of projects) {
      const existingDuplicate = await Duplicate.findOne({
        projectId: project.projectId,
      });
      if (!existingDuplicate) {
        const duplicate = new Duplicate({
          projectId: project.projectId,
          title: project.title,
          govtBudget: project.govtBudget,
        });
        await duplicate.save();
      }
    }
    console.log("Data successfully copied to the duplicate table.");
  } catch (error) {
    console.error("Error copying data:", error.message);
  }
};

// Define schema and model for tender applications
const tenderSchema = new mongoose.Schema({
  projectId: String,
  title: String,
  location: String,
  completionPeriod: Number,
  govtBudget: Number,
  department: String,
  bidAmount: Number,
  tenderid: String,
});

const Tender = mongoose.model("Tender", tenderSchema);

// Define schema and model for final tender data
const finalTenderSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  govtBudget: { type: Number, required: true },
  bidAmount: { type: Number, required: true },
  tenderid: { type: String, required: true },
  completionPeriod: { type: Number, required: true }, // Ensure this field is required
  startDate: { type: Date },
});

const FinalTender = mongoose.model("FinalTender", finalTenderSchema);

// Endpoint to fetch all projects
app.get("/api/finaltenders", async (req, res) => {
  try {
    const tenders = await FinalTender.find(); // Fetch all records from the collection
    res.status(200).json(tenders);
  } catch (error) {
    console.error("Error fetching tenders:", error);
    res.status(500).json({ error: "Failed to fetch tenders" });
  }
});

app.put("/api/finaltenders/:id", async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProject) return res.status(404).send("Project not found");
    res.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// API to save tender application
app.post("/api/apply-tender", async (req, res) => {
  try {
    const tenderData = req.body;
    const tender = new Tender(tenderData);
    await tender.save();
    res.status(201).send({ message: "Tender applied successfully", tender });
  } catch (err) {
    res.status(500).send({ error: "Failed to apply tender", details: err });
  }
});

// API route to grant tender
app.post("/api/grant-tender", async (req, res) => {
  console.log("Request body:", req.body); // Log request body for debugging

  const {
    projectId,
    title,
    location,
    govtBudget,
    bidAmount,
    tenderid,
    completionPeriod, // Ensure this is received
    startDate,
  } = req.body;

  if (!completionPeriod) {
    return res.status(400).send({ error: "CompletionPeriod is required." });
  }

  try {
    const tender = await FinalTender.findOneAndUpdate(
      { tenderid },
      {
        projectId,
        title,
        location,
        govtBudget,
        bidAmount,
        tenderid,
        completionPeriod,
        startDate,
        status: "Granted",
      },
      { new: true, upsert: true }
    );

    res.status(200).send({ success: true, updatedTender: tender });
  } catch (error) {
    console.error("Error updating tender:", error);
    res.status(500).send({ error: "Failed to save tender", message: error.message });
  }
});

// API route to get tenders data
app.get("/api/tenders", async (req, res) => {
  try {
    const tenders = await Tender.find();
    res.json(tenders);
  } catch (error) {
    console.error("Error fetching tenders:", error);
    res.status(500).send("Server error");
  }
});

// Call the copyDataToDuplicate function after connecting to MongoDB
mongoose.connection.once("open", copyDataToDuplicate);

// Endpoint to upload a new project
app.post("/api/projects", async (req, res) => {
  try {
    const { department, location, projectId, title, govtBudget, comperiod } =
      req.body;

    if (!department || !location || !projectId || !title || !govtBudget || !comperiod) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const numericBudget = parseFloat(govtBudget);
    if (isNaN(numericBudget) || numericBudget < 0) {
      return res.status(400).json({ error: "Invalid budget amount" });
    }

    const project = new Project({
      department,
      location,
      projectId,
      title,
      govtBudget: numericBudget,
      comperiod,
    });
    const savedProject = await project.save();

    const existingDuplicate = await Duplicate.findOne({ projectId: savedProject.projectId });
    if (!existingDuplicate) {
      const duplicate = new Duplicate({
        projectId: savedProject.projectId,
        title: savedProject.title,
        govtBudget: savedProject.govtBudget,
      });
      await duplicate.save();
    }

    res.status(201).json({ message: "Project uploaded successfully", project: savedProject });
  } catch (error) {
    console.error("Error saving project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to update project status
app.put("/api/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { approvalStatus, projectStatus, approvalDate, expectedCompletion } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { approvalStatus, projectStatus, approvalDate, expectedCompletion },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ message: "Project updated successfully", project: updatedProject });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch all projects
app.get("/api/projects", async (req, res) => {
  const { department } = req.query;

  try {
    const query = department ? { department } : {};
    const projects = await Project.find(query);
    res.status(200).json({ projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

// Login Endpoint for departments
app.post("/login", async (req, res) => {
  try {
    const { department, deptID, pass } = req.body;

    if (!department || !deptID || !pass) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const collectionName = {
      "Water Dept": "waterdept",
      "Road Dept": "roaddept",
      "Drainage Dept": "draindept",
    }[department];

    if (!collectionName) {
      return res.status(400).json({ error: "Invalid department selected" });
    }

    const Model = mongoose.model(
      collectionName,
      new mongoose.Schema({}, { strict: false }),
      collectionName
    );

    const user = await Model.findOne({ deptID, pass });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Login successful", department });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Tender Login Endpoint
app.post("/tenlogin", async (req, res) => {
  try {
    const { department, tenderID, passt } = req.body;

    if (!department || !tenderID || !passt) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const collectionName = {
      "Water Dept": "waterten",
      "Road Dept": "roadten",
      "Drainage Dept": "drainten",
    }[department];

    if (!collectionName) {
      return res.status(400).json({ error: "Invalid department selected" });
    }

    const Model = mongoose.model(
      collectionName,
      new mongoose.Schema({}, { strict: false }),
      collectionName
    );

    const user = await Model.findOne({ tenderID, passt });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Login successful", department });
  } catch (error) {
    console.error("Error during tender login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to fetch notifications
const notificationSchema = new mongoose.Schema({
  message: String,
  date: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

app.get("/api/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to fetch project data by projectId
app.get("/project/:id", async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findOne({ projectId });
    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching project data" });
  }
});

// Endpoint to check tender ID
app.post("/api/check-tender-id", async (req, res) => {
  const { tenderid } = req.body;
  try {
    const existingTender = await Tender.findOne({ tenderid });
    if (existingTender) {
      return res.status(200).json({ exists: true });
    }
    res.status(200).json({ exists: false });
  } catch (error) {
    res.status(500).json({ error: "Error checking tender ID" });
  }
});

// Specifications schema
const SpecificationSchema = new mongoose.Schema({
  projectId: String,
  title: String,
  department: String,
  govtBudget: String,
  specifications: Object,
});

const Specification = mongoose.model("Specification", SpecificationSchema);

// Route to save specifications
app.post("/api/specifications", async (req, res) => {
  try {
    const spec = new Specification(req.body);
    await spec.save();
    res.status(201).send({ message: "Specifications saved successfully!" });
  } catch (error) {
    res.status(500).send({ error: "Failed to save specifications" });
  }
});

// Route to fetch specifications
app.get("/api/specifications", async (req, res) => {
  try {
    const specs = await Specification.find();
    res.status(200).send(specs);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch specifications" });
  }
});

// Correct endpoint for fetching all final tenders
app.get("/api/projectss", async (req, res) => {
  try {
    const projectss = await FinalTender.find(); // Fetch all records from finaltender collection
    res.status(200).json(projectss); // Send as JSON response
  } catch (error) {
    console.error("Error fetching projectss:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// CAPTCHA verification endpoint
app.post("/verify-captcha", async (req, res) => {
  const { token } = req.body;

  try {
    const secretKey = "6LfjlpUqAAAAAJp0sf2FYAEsZAX0TslQr7RCq6dl"; // Replace with your secret key
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify", // Correct URL
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    const { success } = response.data;

    if (success) {
      res.status(200).send({ message: "CAPTCHA Verified" });
    } else {
      res.status(400).send({ message: "CAPTCHA Verification Failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server Error" });
  }
});


const complaintSchema = new mongoose.Schema({
  department:String,
  location: String,
  type: String,
  date: String,
  remarks: String,
  time: String,
  name: String,
  mobile: String,
  address: String,
  email: String,
});

const Complaint = mongoose.model("Complaint", complaintSchema);

// Endpoint to handle form submission
app.post("/api/complaints", async (req, res) => {
  try {
      const newComplaint = new Complaint(req.body);
      await newComplaint.save();
      res.status(201).send({ message: "Complaint registered successfully!" });
  } catch (error) {
      res.status(500).send({ message: "Error saving complaint", error });
  }
});
app.get("/api/complaints", async (req, res) => {
  try {
      const complaints = await Complaint.find();
      res.status(200).json(complaints);
  } catch (error) {
      res.status(500).send({ message: "Error fetching complaints", error });
  }
});

// Define Notice schema and model
const noticeSchema = new mongoose.Schema({
  department: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: String, required: true },
});

const Notice = mongoose.model("Notice", noticeSchema);

// Endpoint to send a notice
app.post("/api/sendNotice", async (req, res) => {
  const { department, location, type, date } = req.body;

  // Validate required fields
  if (!department || !location || !type || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create and save the notice
    const notice = new Notice({ department, location, type, date });
    await notice.save();
    res.status(201).json({ message: "Notice sent successfully" });
  } catch (error) {
    console.error("Error saving notice:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint to fetch all notices
app.get("/api/notices", async (req, res) => {
  try {
    const notices = await Notice.find();
    res.status(200).json({ notices });
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/graph-data", (req, res) => {
  res.json({
    improperSchedule: {
      labels: ["Road Dept", "Water Dept", "Electrical Dept"],
      data: [120, 150, 100], // Example times in hours
    },
    properSchedule: {
      labels: ["Road Dept", "Water Dept", "Drainage Dept"],
      data: [90, 110, 80], // Example reduced times
    },
  });
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});