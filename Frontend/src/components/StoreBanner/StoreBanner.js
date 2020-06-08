import React from "react";
import StoreBannerCard from "../StoreBannerCard/StoreBannerCard";
import "./Banner-styles.css";

const StoreBanner = ({ bannerDetails,countperrow }) => {
  let bannerLst;
  let bannerrow;
  let count = bannerDetails.length;
  console.log(bannerDetails);
  // alert(count);
  bannerrow=<div className="Banner">
  {bannerDetails.map((details) => (
    <StoreBannerCard {...details} />
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

export default StoreBanner;