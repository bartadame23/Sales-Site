const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const LEADS_FILE = path.join(__dirname, "leads.json");

async function loadLeads() {
  try { return JSON.parse(await fs.readFile(LEADS_FILE, "utf8")); }
  catch (e) { return []; }
}

async function saveLeads(leads) {
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2));
}

app.post("/api/leads", async (req,res)=>{
  const {firstName,lastName,phone,consent} = req.body;
  if(!firstName||!lastName||!phone||!consent)
    return res.status(400).json({message:"Missing fields"});

  const leads = await loadLeads();
  const newLead = { id: Date.now(), createdAt: new Date().toISOString(), ...req.body };
  leads.push(newLead);
  await saveLeads(leads);
  res.json({message:"Saved", leadId:newLead.id});
});

app.listen(PORT, ()=>console.log("Running on "+PORT));