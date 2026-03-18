import React, { useState } from "react";
import "./indication.css";

import img1 from "../assets/images/dangerDetail/img1.png";
import img2 from "../assets/images/dangerDetail/img2.png";
import img3 from "../assets/images/dangerDetail/img3.png";
import img4 from "../assets/images/dangerDetail/img4.png";
import img5 from "../assets/images/dangerDetail/img5.png";
import img6 from "../assets/images/dangerDetail/img6.png";
import img7 from "../assets/images/dangerDetail/img7.png";
import img8 from "../assets/images/dangerDetail/img8.png";

function Indication() {

const [video,setVideo] = useState(null)
const [search,setSearch] = useState("")
const [watched,setWatched] = useState([])
const [currentIndex, setCurrentIndex] = useState(null);

const indications = [
{image:img1,video:"/video/video1.mp4",title:"Parking"},
{image:img2,video:"/video/video2.mp4",title:"Station service"},
{image:img3,video:"/video/video3.mp4",title:"Hôpital"},
{image:img4,video:"/video/video4.mp4",title:"Téléphone"},
{image:img5,video:"/video/video5.mp4",title:"Restaurant"},
{image:img6,video:"/video/video6.mp4",title:"Autoroute"},
{image:img7,video:"/video/video7.mp4",title:"Hôtel"},
{image:img8,video:"/video/video8.mp4",title:"Aéroport"}
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