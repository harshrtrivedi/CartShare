import React from "react";
import BannerCard from "../BannerCard/BannerCard";
import "./Banner-styles.css";

const Banner = ({ bannerDetails }) => {
  let bannerLst;
  let bannerrow;
  let count = bannerDetails.length;
  console.log(bannerDetails);
  // alert(count);
  bannerrow=<div className="Banner">
  {bannerDetails.map((details) => (
    <BannerCard {...details} />
  ))}
  </div>
      bannerLst = 
      <div className="row">
      {bannerrow}
      </div>
      
      
  return (
    
    <div >
     
     {bannerLst}

</div>
    
  );
};

export default Banner;