import React from "react";
import UserCard from "../BannerCard/UserCard";
import "./Banner-styles.css";

const UserBanner = ({ bannerDetails }) => {
  let bannerLst;
  let bannerrow;
  let count = bannerDetails.length;
  console.log(bannerDetails);
  // alert(count);
  bannerrow=<div className="UserBanner">
  {bannerDetails.map((details) => (
    <UserCard  /* item={...details} */  item={details}  />
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

export default UserBanner;