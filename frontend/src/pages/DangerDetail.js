import React, { useState } from "react";
import "./indication.css";

import img11 from "../assets/images/Danger/img11.png";
import img21 from "../assets/images/Danger/img21.png";
import img31 from "../assets/images/Danger/img31.png";
import img41 from "../assets/images/Danger/img41.png";
import img51 from "../assets/images/Danger/img51.png";

function Indication() {

const [video,setVideo] = useState(null)
const [search,setSearch] = useState("")
const [watched,setWatched] = useState([])
const [currentIndex, setCurrentIndex] = useState(null);

const indications = [

  { image: img11, video: "/video/Danger/ved11.mp4", title: "فتحة في الحاجز الوسطي" },
  { image: img21, video: "/video/Danger/ved21.mp4", title: "طريق فرعي من اليسار" },
  { image: img31, video: "/video/Danger/ved31.mp4", title: "مدار" },
  { image: img41, video: "/video/Danger/ved41.mp4", title: "سير في الاتجاهين" },
  { image: img51, video: "/video/Danger/ved51.mp4", title: "أعط الأفضلية" },
  { image: img51, video: "/video/Danger/ved5.mp4", title: "ليس لكم حق الأسبقية" },

]

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
  key={video}   // 🔥 الحل هنا
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