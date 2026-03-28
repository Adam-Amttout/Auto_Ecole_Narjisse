import React, { useState } from "react";
import "./indication.css";

import img13 from "../assets/images/interdection/img13.png";
import img23 from "../assets/images/interdection/img23.png";
import img33 from "../assets/images/interdection/img33.png";
import img43 from "../assets/images/interdection/img43.png";
import img53 from "../assets/images/interdection/img53.png";
import img63 from "../assets/images/interdection/img63.png";

function Indication() {

const [video,setVideo] = useState(null)
const [search,setSearch] = useState("")
const [watched,setWatched] = useState([])
const [currentIndex, setCurrentIndex] = useState(null);

const indications = [
  { image: img13, video: "/video/interdection/ved13.mp4", title: "ممنوع الوقوف" },
  { image: img23, video: "/video/interdection/ved23.mp4", title: "STOP" },
  { image: img33, video: "/video/interdection/ved33.mp4", title: "ممنوع التوقف والوقوفHôpital" },
  { image: img43, video: "/video/interdection/ved43.mp4", title: "ممنوع الدخول" },
  { image: img53, video: "/video/interdection/ved53.mp4", title: "ممنوع الرجوع (الدوران)" },
  { image: img63, video: "/video/interdection/ved63.mp4", title: "ممنوع الانعطاف" },
];

// فتح الفيديو
const openVideo = (video,index)=>{
setVideo(video)
setCurrentIndex(index)

if(!watched.includes(index)){
setWatched([...watched,index])
}
}

// التالي
const nextVideo = () => {
let nextIndex = currentIndex + 1;

if(nextIndex >= indications.length){
nextIndex = 0;
}

setVideo(indications[nextIndex].video);
setCurrentIndex(nextIndex);

if(!watched.includes(nextIndex)){
setWatched([...watched,nextIndex])
}
}

const filtered = indications.filter((item)=>
item.title.toLowerCase().includes(search.toLowerCase())
)

return (

<div className="danger-page">

<h2 className="danger-title">
Panneaux d’Indication
</h2>

<div className="progress-bar">
<div
className="progress-fill"
style={{width:(watched.length/indications.length)*100+"%"}}
/>
</div>

{watched.length === indications.length && (
<p className="finish-message">
🎉 Bravo ! Vous avez vu tous les panneaux
</p>
)}

<p className="progress-text">
Vous avez vu {watched.length} / {indications.length} panneaux
</p>

<input
type="text"
placeholder="Rechercher un panneau..."
className="search-box"
onChange={(e)=>setSearch(e.target.value)}
/>

<div className="danger-grid">

{filtered.map((item,index)=>(

<div
className="danger-card"
key={index}
onClick={()=>openVideo(item.video,index)}
>

{watched.includes(index) && (
<div className="badge-vu">✓ Vu</div>
)}

<div className="danger-image-wrapper">

<img
src={item.image}
alt="indication"
className="danger-img"
/>

<div className="play-icon">▶</div>

<div className="video-label">
Voir la vidéo
</div>

</div>

<p className="danger-name">{item.title}</p>

</div>

))}

</div>

{/* VIDEO MODAL */}
{video && (

<div className="video-modal">

<div className="video-box">

<span
className="close-btn"
onClick={()=>setVideo(null)}
>
✖
</span>

<div className="video-container">

<video 
  key={video}   // 🔥 الحل
  controls 
  autoPlay 
  className="video-player"
  onEnded={nextVideo}
>
  <source src={video} type="video/mp4"/>
</video>

<div className="video-actions">
<button className="next-video-btn" onClick={nextVideo}>
  ▶ التالي
</button>
</div>

</div>

</div>

</div>

)}

</div>

)

}

export default Indication;