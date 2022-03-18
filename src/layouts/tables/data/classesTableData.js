/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import Chart from "react-apexcharts";
// Images

import imgsobject from "./imagesobject";
import ensiaslogo from "../../../assets/images/ensiaslogo.png"



export default function data(data) {
  const myop={
    options: {
      chart: {
        id: "donut"
        
      },

      labels: ['Neutral', 'Happy', 'Sad', 'Angry'],
      
 
    },

  };
  
 
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => ( 
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );
  

  let myArray=[];
  console.log("displaying");
  console.log(data);
  data.map((yow)=> 
  myArray.push( {
        
    author: <Author image={ensiaslogo} name={yow.classnumber} email={""}  />,
    function: <Job title="" description={new Date(yow.date.seconds * 1000).toLocaleDateString("en-US")} />,
    status: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {parseFloat(yow.absencepercentage*100).toFixed(2)+"%"}
      </MDTypography>
    ),
    employed: (
      <Chart
              options={myop.options}
             series={[yow.neutral, yow.happy, yow.sad, yow.angry]}
        
              type="donut"
              width={300} 
          
            />
    ),
    action: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          Edit
        </MDTypography>
      ),

  })
  );
    


  return {
    thecolumns: [
      { Header: "Class Number", accessor: "author", width: "45%", align: "left" },
      { Header: "Date", accessor: "function", align: "left" },
      { Header: "Presence Percentage", accessor: "status", align: "center" },
      { Header: "Emotion Statistics", accessor: "employed", align: "center" },
    
    ],

    therows:myArray,
  };
}
