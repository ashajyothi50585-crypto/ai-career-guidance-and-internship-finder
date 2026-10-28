const demoInternships = [
  {id:1,title:"AI / Machine Learning Intern",company:"DemoTech Labs",domain:"AI & Data",pay:"Paid",mode:"Remote",duration:"8 weeks",skills:["Python","ML basics"],initials:"DT",description:"Learn model evaluation and data preparation with a mentor."},
  {id:2,title:"Junior Web Developer Intern",company:"BrightWeb Studio",domain:"Web Development",pay:"Paid",mode:"Hybrid",duration:"6 weeks",skills:["HTML","CSS","JavaScript"],initials:"BW",description:"Build responsive pages and practice frontend fundamentals."},
  {id:3,title:"Data Analytics Intern",company:"Insight Demo",domain:"AI & Data",pay:"Unpaid",mode:"Remote",duration:"4 weeks",skills:["Excel","SQL"],initials:"ID",description:"Explore datasets, create reports, and explain useful trends."},
  {id:4,title:"Cybersecurity Trainee",company:"SecureStart Demo",domain:"Cybersecurity",pay:"Unpaid",mode:"Remote",duration:"4 weeks",skills:["Networking","Security basics"],initials:"SS",description:"Learn security concepts in a supervised learning project."},
  {id:5,title:"UI/UX Design Intern",company:"PixelNest Demo",domain:"Design",pay:"Paid",mode:"Hybrid",duration:"8 weeks",skills:["Figma","Wireframes"],initials:"PN",description:"Practice user research, wireframes, and accessible interfaces."},
  {id:6,title:"Product Research Intern",company:"LaunchPad Demo",domain:"Business",pay:"Unpaid",mode:"On-site",duration:"6 weeks",skills:["Communication","Research"],initials:"LP",description:"Research user needs and help organize product feedback."}
];
const careerMap = {
  ai:{title:"AI / Machine Learning Engineer",description:"Explore how data and algorithms can help computers find patterns and make predictions.",skills:["Python basics","Math & statistics","Data handling","Machine learning fundamentals"],next:"Start with Python variables and lists, then try a small dataset project."},
  data:{title:"Data Analyst",description:"Turn raw information into useful insights using analysis, visualizations, and clear explanations.",skills:["Excel or spreadsheets","SQL basics","Statistics","Data visualization"],next:"Choose a small public dataset and answer three questions using charts."},
  web:{title:"Frontend Web Developer",description:"Create the pages and interactive experiences people use on websites and web applications.",skills:["HTML","CSS","JavaScript","Git & GitHub"],next:"Build a responsive personal portfolio with an about section and two projects."},
  cyber:{title:"Cybersecurity Analyst",description:"Learn how systems, networks, and information can be protected from digital threats.",skills:["Networking basics","Linux basics","Security principles","Scripting fundamentals"],next:"Study networking fundamentals and practice only in legal learning labs."},
  design:{title:"UI/UX Designer",description:"Design useful, accessible digital experiences by understanding user needs and testing ideas.",skills:["User research","Wireframing","Visual hierarchy","Prototyping"],next:"Redesign one student app screen and explain the design choices."},
  business:{title:"Product / Business Analyst",description:"Connect user needs, business goals, and technical teams to improve digital products.",skills:["Communication","Research","Problem solving","Basic data analysis"],next:"Interview a few classmates about a problem and map a simple solution."}
};
const careerForm=document.querySelector("#careerForm");
const careerResults=document.querySelector("#careerResults");
const internshipGrid=document.querySelector("#internshipGrid");
const savedGrid=document.querySelector("#savedGrid");
const searchInput=document.querySelector("#searchInput");
const domainFilter=document.querySelector("#domainFilter");
const payFilter=document.querySelector("#payFilter");
const toast=document.querySelector("#toast");
let savedIds=loadSaved();
let toastTimer;
function loadSaved(){try{return JSON.parse(localStorage.getItem("careerpath-saved")||"[]")}catch{return []}}
function saveSaved(){localStorage.setItem("careerpath-saved",JSON.stringify(savedIds))}
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2800)}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
careerForm.addEventListener("submit",event=>{
  event.preventDefault();
  const name=document.querySelector("#studentName").value.trim();
  const degree=document.querySelector("#degree").value;
  const year=document.querySelector("#year").value;
  const interest=document.querySelector("#interests").value;
  const skills=document.querySelector("#skills").value.trim();
  if(!name||!degree||!year||!interest){showToast("Please complete the required profile fields.");return}
  const selected=careerMap[interest];
  const skillTags=selected.skills.map(skill=>`<span class="tag">${escapeHtml(skill)}</span>`).join("");
  careerResults.innerHTML=`<div class="career-result"><div class="result-intro"><p class="eyebrow">YOUR CAREER STARTING POINT</p><h3>Nice to meet you, ${escapeHtml(name)}.</h3><p>${escapeHtml(degree)} · ${escapeHtml(year)}. Use this as a starting point for exploration.</p></div><article class="career-option"><h4>${escapeHtml(selected.title)}</h4><p>${escapeHtml(selected.description)}</p><strong style="font-size:.76rem;display:block;margin-bottom:9px">Skills to explore</strong><div class="tag-list">${skillTags}</div></article>${skills?`<article class="career-option"><h4>Skills you mentioned</h4><p>${escapeHtml(skills)}</p></article>`:""}<div class="next-step"><strong>Your suggested next step</strong>${escapeHtml(selected.next)}</div><p class="fine-print">Rule-based demo recommendation based on your selected interest. Explore several paths before making decisions.</p></div>`;
  showToast("Your career suggestions are ready!");
  careerResults.scrollIntoView({behavior:"smooth",block:"nearest"});
});
function renderInternships(){
  const term=searchInput.value.trim().toLowerCase(),domain=domainFilter.value,pay=payFilter.value;
  const filtered=demoInternships.filter(item=>(!term||[item.title,item.company,item.domain,...item.skills].join(" ").toLowerCase().includes(term))&&(!domain||item.domain===domain)&&(!pay||item.pay===pay));
  internshipGrid.innerHTML=filtered.length?filtered.map(cardHtml).join(""):`<div class="empty-list">No demo internships match those filters. Try a different search.</div>`;
  const saved=demoInternships.filter(item=>savedIds.includes(item.id));
  savedGrid.innerHTML=saved.length?saved.map(cardHtml).join(""):`<div class="empty-list">You haven't saved any internships yet. Use the bookmark icon on an opportunity to add it here.</div>`;
  document.querySelectorAll(".bookmark-btn").forEach(button=>button.addEventListener("click",()=>toggleSaved(Number(button.dataset.id))));
}
function cardHtml(item){
  const saved=savedIds.includes(item.id);
  return `<article class="internship-card"><div class="card-top"><div class="company-mark">${escapeHtml(item.initials)}</div><button class="bookmark-btn ${saved?"saved":""}" data-id="${item.id}" aria-label="${saved?"Unsave":"Save"} ${escapeHtml(item.title)}" title="${saved?"Unsave internship":"Save internship"}">${saved?"♥":"♡"}</button></div><h3>${escapeHtml(item.title)}</h3><div class="company-name">${escapeHtml(item.company)} · ${escapeHtml(item.domain)}</div><p style="font-size:.78rem;color:var(--muted);margin:10px 0 0">${escapeHtml(item.description)}</p><div class="card-tags">${item.skills.map(skill=>`<span>${escapeHtml(skill)}</span>`).join("")}</div><div class="card-bottom"><span>${escapeHtml(item.mode)} · ${escapeHtml(item.duration)}</span><strong>${escapeHtml(item.pay)}</strong></div></article>`;
}
function toggleSaved(id){
  if(savedIds.includes(id)){savedIds=savedIds.filter(savedId=>savedId!==id);showToast("Internship removed from saved list.")}else{savedIds.push(id);showToast("Internship saved!")}
  saveSaved();renderInternships();
}
[searchInput,domainFilter,payFilter].forEach(element=>element.addEventListener("input",renderInternships));
const authDialog=document.querySelector("#authDialog");
let authMode="register";
function openAuth(mode){
  authMode=mode;
  document.querySelector("#authTitle").textContent=mode==="register"?"Create your account":"Welcome back";
  document.querySelector("#authDescription").textContent="Account registration and login need the backend and database setup described in README.md.";
  document.querySelector("#authName").closest("label").style.display=mode==="register"?"block":"none";
  document.querySelector("#authName").style.display=mode==="register"?"block":"none";
  document.querySelector("#authSubmit").textContent=mode==="register"?"Create account":"Log in";
  authDialog.showModal();
}
document.querySelector("#loginBtn").addEventListener("click",()=>openAuth("login"));
document.querySelector("#registerBtn").addEventListener("click",()=>openAuth("register"));
document.querySelector("#authForm").addEventListener("submit",event=>{event.preventDefault();showToast("Demo mode: connect the Express backend to enable accounts.");authDialog.close()});
renderInternships();
